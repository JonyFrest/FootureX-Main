import { createStage } from './lib.js';
import { SCENES } from './scenes.js';
const q = new URLSearchParams(location.search);
const name = q.get('scene'), mode = q.get('mode') || 'normal';
const W = +q.get('w'), H = +q.get('h');
const def = SCENES[name];
const st = createStage(W, H, def.opts);
const info = await def.build(st, mode);
window.cams = Object.keys(info.cameras);
window.shot = (cam) => {
  const c = info.cameras[cam];
  st.camera.fov = c.fov; st.camera.aspect = W / H; st.camera.position.set(...c.pos); st.camera.lookAt(...c.target); st.camera.updateProjectionMatrix();
  st.renderer.toneMappingExposure = c.exposure ?? def.opts.exposure ?? 1.0;
  st.composer.render();
  const labels = {};
  for (const [k, v0] of Object.entries(info.labels || {})) { const v = v0.clone().project(st.camera); labels[k] = [+((v.x + 1) / 2).toFixed(4), +((1 - v.y) / 2).toFixed(4)]; }
  return { img: st.renderer.domElement.toDataURL('image/png'), labels };
};
window.ready = true;
