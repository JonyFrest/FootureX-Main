// Shared three.js toolkit for FootureX concept renders (renderer, materials, helpers).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export { THREE };

export const PAL = {
  bg: 0x0b0f0e, bg2: 0x0e1629, surface: 0x141c2b, concrete: 0x1c2534, steel: 0xc9d3e3,
  accent: 0x2593fa, accent2: 0x2550fa, warm: 0xb8c1d4, pitch: 0x13285e, line: 0x26324a,
};

let seed = 1337;
export function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
export function reseed(s) { seed = s; }

export function createStage(W, H, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = gradientTexture(opts.bgTop ?? '#0e1a3a', opts.bgBottom ?? '#0b0f0e');
  if (opts.fog !== false) scene.fog = new THREE.FogExp2(PAL.bg, opts.fogDensity ?? 0.0009);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 35, W / H, 0.5, 20000);

  const rt = new THREE.WebGLRenderTarget(W, H, { samples: 4, type: THREE.HalfFloatType });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), opts.bloomStrength ?? 0.55, opts.bloomRadius ?? 0.5, opts.bloomThreshold ?? 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  return { renderer, scene, camera, composer, bloom };
}

export function gradientTexture(top, bottom) {
  const c = document.createElement('canvas'); c.width = 4; c.height = 512;
  const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, top); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function std(color, rough = 0.6, metal = 0.2, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
}
export function glow(color, intensity = 1) {
  const c = new THREE.Color(color).multiplyScalar(intensity);
  return new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
}
export function lineMat(color, opacity = 1) {
  return new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
}
export function addEdges(mesh, color = PAL.steel, opacity = 0.35, threshold = 20) {
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, threshold), lineMat(color, opacity));
  mesh.add(e); return e;
}

export function lights(scene, o = {}) {
  scene.add(new THREE.HemisphereLight(0x9cb8ff, 0x04060a, o.hemi ?? 0.55));
  const sun = new THREE.DirectionalLight(o.sunColor ?? 0xdce6ff, o.sun ?? 2.2);
  sun.position.set(...(o.sunPos ?? [-600, 900, 500]));
  sun.castShadow = true;
  const s = o.shadowSize ?? 700;
  Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 10, far: 4000 });
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(o.rimColor ?? 0x3d8bff, o.rim ?? 0.9);
  rim.position.set(700, 300, -800); scene.add(rim);
  return sun;
}

export function ground(scene, size = 6000, o = {}) {
  const g = new THREE.Mesh(new THREE.PlaneGeometry(size, size), std(o.color ?? 0x0a0f18, 0.85, 0.1));
  g.rotation.x = -Math.PI / 2; g.receiveShadow = true; g.position.y = o.y ?? 0; scene.add(g);
  if (o.grid !== false) {
    const grid = new THREE.GridHelper(size, size / (o.cell ?? 40), o.gridColor ?? 0x1a2a40, o.gridColor ?? 0x1a2a40);
    grid.material.transparent = true; grid.material.opacity = o.gridOpacity ?? 0.35; grid.position.y = (o.y ?? 0) + 0.05;
    scene.add(grid);
  }
  return g;
}

export function windowTexture(o = {}) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 512;
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 256, 512);
  const cols = o.cols ?? 8, rows = o.rows ?? 24, cw = 256 / cols, rh = 512 / rows;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const r = rnd();
    if (r < (o.lit ?? 0.32)) {
      g.fillStyle = r < 0.03 ? '#2593fa' : (r < 0.07 ? '#7fb2ff' : '#ffe2b8');
      g.globalAlpha = 0.45 + rnd() * 0.55;
      g.fillRect(x * cw + cw * 0.18, y * rh + rh * 0.22, cw * 0.64, rh * 0.5);
    }
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

// Building: box with lit-window emissive map + edges. Returns mesh.
const winTex = [];
export function building(w, h, d, o = {}) {
  if (!winTex.length) for (let i = 0; i < 6; i++) winTex.push(windowTexture({ lit: 0.1 + i * 0.035 }));
  const tex = winTex[Math.floor(rnd() * winTex.length)].clone();
  tex.needsUpdate = true;
  tex.repeat.set(Math.max(1, Math.round(w / 22)), Math.max(1, h / 70));
  const mat = new THREE.MeshPhysicalMaterial({
    color: o.color ?? 0x1b2536, roughness: o.rough ?? 0.35, metalness: 0.45,
    emissive: 0xffffff, emissiveMap: o.windows === false ? null : tex, emissiveIntensity: o.windows === false ? 0 : (o.lit ?? 0.9) * 0.55,
    envMapIntensity: 0.6,
  });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true; m.receiveShadow = true; m.position.y = h / 2;
  addEdges(m, o.edge ?? PAL.steel, o.edgeOpacity ?? 0.28);
  if (o.roofGlow) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(w * 1.0, 0.8, d * 1.0), glow(o.roofGlow, o.roofGlowI ?? 1.4));
    r.position.y = h / 2 + 0.4; m.add(r);
  }
  return m;
}

export function tree(scale = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 3, 5), std(0x1a1f26));
  trunk.position.y = 1.5; g.add(trunk);
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 0), std(0x1a2b4a, 0.8, 0.05, { flatShading: true }));
  crown.position.y = 5.5; crown.castShadow = true; g.add(crown);
  g.scale.setScalar(scale); return g;
}

// Superellipse helper: point on rounded-rect ellipse.
export function sEll(a, b, t, n = 4.2) {
  const c = Math.cos(t), s = Math.sin(t);
  return [a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), b * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)];
}

// Ring surface between two superellipses at different heights (stands, roof).
export function ringGeom(a0, b0, y0, a1, b1, y1, seg = 192, n = 4.2) {
  const pos = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    const [x0, z0] = sEll(a0, b0, t, n); const [x1, z1] = sEll(a1, b1, t, n);
    pos.push(x0, y0, z0, x1, y1, z1);
  }
  for (let i = 0; i < seg; i++) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
export function ringLine(a, b, y, seg = 192, n = 4.2) {
  const pts = [];
  for (let i = 0; i <= seg; i++) { const [x, z] = sEll(a, b, (i / seg) * Math.PI * 2, n); pts.push(new THREE.Vector3(x, y, z)); }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

export function particles(count, spread, yMin, yMax, color = 0x9cc4ff, size = 2, opacity = 0.6) {
  const p = [];
  for (let i = 0; i < count; i++) p.push((rnd() - 0.5) * spread, yMin + rnd() * (yMax - yMin), (rnd() - 0.5) * spread);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true, depthWrite: false }));
}

export function arc(a, b, h, color = PAL.accent2, r = 0.6, intensity = 2) {
  const mid = a.clone().add(b).multiplyScalar(0.5); mid.y += h;
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 48, r, 6, false), glow(color, intensity));
}
