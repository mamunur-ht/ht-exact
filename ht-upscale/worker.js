import * as ort from './vendor/ort/ort.min.mjs';

ort.env.wasm.wasmPaths = new URL('vendor/ort/', self.location.href).href;
ort.env.wasm.numThreads = 1;

const sessions = {};
const TILE = 256;

function f32ToF16(v){
  const f = new Float32Array(1); f[0] = v;
  const u = new Uint32Array(f.buffer)[0];
  const sign = (u >>> 16) & 0x8000;
  let e = ((u >>> 23) & 0xff) - 127 + 15;
  let m = u & 0x7fffff;
  if(e <= 0){
    if(e < -10) return sign;
    m = (m | 0x800000) >>> (1 - e);
    if(m & 0x1000) m += 0x2000;
    return sign | (m >>> 13);
  }
  if(e >= 31) return sign | 0x7c00;
  m += 0x1000;
  if(m & 0x800000){ m >>>= 13; e++; if(e === 31) return sign | 0x7c00; }
  else m >>>= 13;
  return sign | (e << 10) | m;
}

function f16ToF32(h){
  const s = (h & 0x8000) >>> 15, e = (h & 0x7c00) >>> 10, m = h & 0x3ff;
  if(e === 0) return s ? -m * Math.pow(2, -24) : m * Math.pow(2, -24);
  if(e === 31) return m ? NaN : (s ? -Infinity : Infinity);
  const v = (m | 0x400) * Math.pow(2, e - 25);
  return s ? -v : v;
}

function toFloat32(raw){
  const f32 = new Float32Array(raw.length);
  if(raw instanceof Float32Array){
    f32.set(raw);
  } else if(typeof Float16Array !== 'undefined' && raw instanceof Float16Array){
    for(let i = 0; i < f32.length; i++) f32[i] = raw[i];
  } else {
    for(let i = 0; i < f32.length; i++) f32[i] = f16ToF32(raw[i]);
  }
  return f32;
}

self.onmessage = async (e) => {
  const msg = e.data;
  try{
    if(msg.type === 'load'){
      sessions[msg.key] = await ort.InferenceSession.create(msg.buffer, { executionProviders: ['wasm'] });
      self.postMessage({ id: msg.id, ok: true });
    } else if(msg.type === 'run'){
      const sess = sessions[msg.key];
      if(!sess) throw new Error(`model ${msg.key} not loaded`);
      let tensor, result;
      if(msg.key === 'x4plus'){
        const data = typeof Float16Array !== 'undefined'
          ? Float16Array.from(msg.tileIn)
          : (() => { const d = new Uint16Array(msg.tileIn.length); for(let i = 0; i < msg.tileIn.length; i++) d[i] = f32ToF16(msg.tileIn[i]); return d; })();
        tensor = new ort.Tensor('float16', data, [1, 3, TILE, TILE]);
        result = await sess.run({ input: tensor });
      } else {
        tensor = new ort.Tensor('float32', msg.tileIn, [1, 3, TILE, TILE]);
        result = await sess.run({ input: tensor });
      }
      const out = toFloat32(result.output.data);
      self.postMessage({ id: msg.id, ok: true, out }, [out.buffer]);
    }
  } catch(err){
    self.postMessage({ id: msg.id, ok: false, error: String((err && err.message) || err) });
  }
};
