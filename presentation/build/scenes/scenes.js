// Concept scenes for FootureX Uzbekistan. Every render is a CONCEPT visualization, not a design of record.
import { THREE, PAL, rnd, reseed, std, glow, lineMat, addEdges, lights, ground, building, tree, sEll, ringGeom, ringLine, particles, arc } from './lib.js';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
function place(m, pos, rot) { m.position.copy(pos); if (rot) m.rotation.set(...rot); return m; }

// ---------------------------------------------------------------- stadium
function pitchTexture() {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 800;
  const g = c.getContext('2d');
  for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#13285e' : '#0f2150'; g.fillRect(i * 75, 0, 75, 800); }
  g.strokeStyle = 'rgba(142,180,255,0.9)'; g.lineWidth = 4;
  const X = (m) => 600 + m * 10, Y = (m) => 400 + m * 10;
  g.strokeRect(X(-52.5), Y(-34), 1050, 680);
  g.beginPath(); g.moveTo(X(0), Y(-34)); g.lineTo(X(0), Y(34)); g.stroke();
  g.beginPath(); g.arc(X(0), Y(0), 91.5, 0, Math.PI * 2); g.stroke();
  for (const s of [-1, 1]) {
    g.strokeRect(s < 0 ? X(-52.5) : X(52.5 - 16.5), Y(-20.16), 165, 403.2);
    g.strokeRect(s < 0 ? X(-52.5) : X(52.5 - 5.5), Y(-9.16), 55, 183.2);
    g.beginPath(); g.arc(X(s * 41.5), Y(0), 91.5, s < 0 ? -0.93 : Math.PI - 0.93, s < 0 ? 0.93 : Math.PI + 0.93); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export function stadium(o = {}) {
  const G = new THREE.Group();
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), new THREE.MeshStandardMaterial({ map: pitchTexture(), roughness: 0.9 }));
  pitch.rotation.x = -Math.PI / 2; pitch.position.y = 0.3; pitch.receiveShadow = true; G.add(pitch);
  const apron = new THREE.Mesh(ringGeom(60, 42, 0.25, 64, 46, 0.25), std(0x0f1824, 0.8, 0.1, { side: THREE.DoubleSide }));
  G.add(apron);

  const seat = std(o.seatColor ?? 0x141c29, 0.6, 0.3, { side: THREE.DoubleSide });
  const lower = new THREE.Mesh(ringGeom(64, 46, 1, 88, 70, 17), seat); lower.receiveShadow = true; lower.castShadow = true; G.add(lower);
  const conc = new THREE.Mesh(ringGeom(88, 70, 17, 93, 75, 17), std(0x232e40, 0.6, 0.3, { side: THREE.DoubleSide })); G.add(conc);
  const upper = new THREE.Mesh(ringGeom(93, 75, 19, 120, 102, 44), seat); upper.receiveShadow = true; upper.castShadow = true; G.add(upper);
  const rowMat = lineMat(PAL.steel, 0.16);
  for (let i = 1; i < 12; i++) { const f = i / 12; G.add(new THREE.Line(ringLine(64 + 24 * f, 46 + 24 * f, 1 + 16 * f + 0.15), rowMat)); }
  for (let i = 1; i < 14; i++) { const f = i / 14; G.add(new THREE.Line(ringLine(93 + 27 * f, 75 + 27 * f, 19 + 25 * f + 0.15), rowMat)); }
  // LED ribbon between tiers
  G.add(new THREE.Mesh(ringGeom(88.2, 70.2, 17.4, 88.2, 70.2, 18.8), glow(PAL.accent, 1.3)));

  // facade fins
  const finGeo = new THREE.BoxGeometry(1.1, 50, 5);
  const fins = new THREE.InstancedMesh(finGeo, std(0x2a3446, 0.35, 0.7), 168);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < 168; i++) {
    const t = (i / 168) * Math.PI * 2; const [x, z] = sEll(126, 108, t); const [x2, z2] = sEll(126, 108, t + 0.01);
    const ang = Math.atan2(z2 - z, x2 - x);
    e.set(0, -ang, 0.08); q.setFromEuler(e); m4.compose(V(x, 25, z), q, V(1, 1, 1)); fins.setMatrixAt(i, m4);
  }
  fins.castShadow = true; G.add(fins);
  const skin = new THREE.Mesh(ringGeom(122, 104, 0, 122, 104, 48), new THREE.MeshPhysicalMaterial({ color: 0x0d1626, roughness: 0.15, metalness: 0.6, transparent: true, opacity: 0.88, side: THREE.DoubleSide }));
  G.add(skin);
  for (const y of [9, 26, 43]) G.add(new THREE.Mesh(ringGeom(124.5, 106.5, y, 124.5, 106.5, y + 0.9), glow(y === 26 ? PAL.accent : 0x9fc3ff, y === 26 ? 1.6 : 0.9)));

  // roof
  const roof = new THREE.Mesh(ringGeom(76, 58, 53, 130, 112, 49), new THREE.MeshPhysicalMaterial({ color: 0x1b2638, roughness: 0.3, metalness: 0.5, transparent: true, opacity: 0.93, side: THREE.DoubleSide }));
  roof.castShadow = true; G.add(roof);
  addEdges(roof, PAL.steel, 0.05);
  const ribMat = std(0x3a465a, 0.4, 0.8);
  for (let i = 0; i < 48; i++) {
    const t = (i / 48) * Math.PI * 2; const [x0, z0] = sEll(76, 58, t); const [x1, z1] = sEll(130, 112, t);
    const a = V(x0, 53.6, z0), b = V(x1, 49.6, z1); const len = a.distanceTo(b);
    const rib = new THREE.Mesh(new THREE.BoxGeometry(len, 1.2, 1.4), ribMat);
    rib.position.copy(a).add(b).multiplyScalar(0.5); rib.lookAt(b); rib.rotateY(Math.PI / 2); G.add(rib);
  }
  G.add(new THREE.Mesh(ringGeom(76, 58, 52.4, 78, 60, 52.2), glow(0xe8f0ff, o.floodI ?? 2.4)));
  G.add(new THREE.Line(ringLine(130, 112, 49.6), lineMat(PAL.accent, 0.9)));

  if (o.lit !== false) {
    const p = new THREE.PointLight(0xe3ecff, o.pitchLight ?? 7000, 160, 1.8); p.position.set(0, 70, 0); G.add(p);
  }
  G.userData.labels = {
    pitch: V(0, 0, 0), lower: V(0, 9, 58), upper: V(0, 32, 92), roof: V(-60, 52, -70), facade: V(0, 25, 108), ribbon: V(-88, 18, 0),
  };
  return G;
}

// ---------------------------------------------------------------- city masterplan
export function city(mode = 'normal') {
  reseed(77);
  const G = new THREE.Group();
  const phaseCol = { 1: PAL.accent, 2: PAL.accent2, 3: 0xb8c1d4 };
  const edgeFor = (ph) => mode === 'phases' ? phaseCol[ph] : PAL.steel;
  const roofFor = (ph) => mode === 'phases' ? phaseCol[ph] : null;
  const RG = mode === 'phases' ? 0.5 : 1.4;
  const roadMat = std(0x111824, 0.9, 0.05);
  const road = (x, z, w, d) => { const r = new THREE.Mesh(new THREE.BoxGeometry(w, 0.4, d), roadMat); r.position.set(x, 0.2, z); r.receiveShadow = true; G.add(r);
    const l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d)), lineMat(0x3d8bff, 0.25)); l.rotation.x = -Math.PI / 2; l.position.set(x, 0.5, z); G.add(l); };
  // main roads
  road(0, 0, 1900, 44); road(0, -430, 1900, 26); road(0, 430, 1900, 26);
  for (const x of [-820, -330, 80, 420, 760]) road(x, 0, 26, 1400);
  // water canal
  const water = new THREE.Mesh(new THREE.PlaneGeometry(1900, 70), new THREE.MeshPhysicalMaterial({ color: 0x0b2440, roughness: 0.05, metalness: 0.4, clearcoat: 1 }));
  water.rotation.x = -Math.PI / 2; water.position.set(0, 0.3, -560); G.add(water);

  // stadium (phase 2)
  const st = stadium({ lit: false, floodI: 2.2 }); st.position.set(-560, 0, -220); st.scale.setScalar(0.95); G.add(st);
  if (mode === 'phases') st.traverse((c) => { if (c.isLine) c.material = lineMat(phaseCol[2], 0.9); });
  // esports arena dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(70, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.3), new THREE.MeshPhysicalMaterial({ color: 0x1a2a44, roughness: 0.2, metalness: 0.6, transparent: true, opacity: 0.95 }));
  dome.position.set(-160, -12, -250); dome.scale.y = 0.62; dome.castShadow = true; G.add(dome);
  const domeWire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(70.5, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2.3)), lineMat(mode === 'phases' ? phaseCol[2] : PAL.accent2, 0.35));
  domeWire.position.copy(dome.position); domeWire.scale.y = 0.62; G.add(domeWire);
  G.add(place(new THREE.Mesh(new THREE.TorusGeometry(66, 0.9, 6, 96), glow(PAL.accent, 1.5)), V(-160, 4, -250), [Math.PI / 2, 0, 0]));

  // tech campus (phase 1)
  const campus = [[230, -230, 46, 190, 46, true], [300, -300, 40, 140, 40], [180, -330, 36, 110, 50], [330, -180, 50, 90, 36], [250, -120, 70, 40, 50], [140, -200, 40, 70, 40]];
  for (const [x, z, w, h, d, hq] of campus) {
    const b = building(w, h, d, { color: 0x172235, edge: edgeFor(1), edgeOpacity: mode === 'phases' ? 0.7 : 0.3, roofGlow: hq ? PAL.accent : roofFor(1), roofGlowI: hq ? 1.2 : RG, lit: 1.1 });
    b.position.x = x; b.position.z = z; G.add(b);
  }
  // innovation bridge between towers
  const br = new THREE.Mesh(new THREE.BoxGeometry(90, 8, 10), std(0x22314a, 0.3, 0.7)); br.position.set(265, 70, -265); br.rotation.y = Math.PI / 4; G.add(br); addEdges(br, PAL.accent, 0.6);

  // retail boulevard (phase 3) along main road
  for (let x = -760; x <= 720; x += 75) {
    if (x > -380 && x < -250) continue;
    for (const side of [-1, 1]) {
      const h = 10 + rnd() * 14; const b = building(58, h, 30, { color: 0x1e283a, edge: edgeFor(3), edgeOpacity: mode === 'phases' ? 0.6 : 0.25, lit: 1.3, roofGlow: roofFor(3), roofGlowI: RG });
      b.position.x = x; b.position.z = side * 48; G.add(b);
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(58, 0.6, 6), glow(0xb8c1d4, 0.9)); canopy.position.set(x, 5, side * 31); G.add(canopy);
    }
  }
  // residential perimeter blocks (phase 3) south
  for (let bx = -760; bx <= 300; bx += 170) for (let bz = 130; bz <= 400; bz += 140) {
    if (bx > -330 && bx < 80 && bz < 400) continue; // park
    const h1 = 22 + rnd() * 40, h2 = 18 + rnd() * 30;
    for (const [dx, dz, w, d, h] of [[0, -45, 120, 22, h1], [0, 45, 120, 22, h2], [-50, 0, 20, 70, h2 * 0.8], [50, 0, 20, 70, h1 * 0.7]]) {
      const b = building(w, h, d, { color: 0x1a2232, edge: edgeFor(3), edgeOpacity: mode === 'phases' ? 0.55 : 0.22, lit: 0.8, roofGlow: roofFor(3), roofGlowI: RG });
      b.position.x = bx + dx; b.position.z = bz + dz; G.add(b);
    }
    for (let i = 0; i < 4; i++) { const t = tree(0.9); t.position.set(bx - 25 + rnd() * 50, 0, bz - 18 + rnd() * 36); G.add(t); }
  }
  // central park
  const park = new THREE.Mesh(new THREE.BoxGeometry(380, 0.6, 300), std(0x101f3d, 0.95)); park.position.set(-125, 0.3, 255); park.receiveShadow = true; G.add(park);
  const pond = new THREE.Mesh(new THREE.CircleGeometry(55, 48), new THREE.MeshPhysicalMaterial({ color: 0x0b2440, roughness: 0.05, metalness: 0.4 })); pond.rotation.x = -Math.PI / 2; pond.position.set(-100, 0.7, 270); G.add(pond);
  for (let i = 0; i < 140; i++) { const t = tree(0.8 + rnd() * 0.6); const x = -300 + rnd() * 350, z = 120 + rnd() * 270; if (Math.hypot(x + 100, z - 270) < 62) continue; t.position.set(x, 0, z); G.add(t); }
  // education & academy campus (phase 1) east
  for (const [x, z, w, h, d] of [[560, 170, 150, 26, 40], [560, 270, 150, 22, 40], [500, 220, 30, 30, 60], [640, 220, 30, 34, 60], [600, 360, 80, 46, 50]]) {
    const b = building(w, h, d, { color: 0x1a2436, edge: edgeFor(1), edgeOpacity: mode === 'phases' ? 0.65 : 0.25, lit: 1.0, roofGlow: roofFor(1), roofGlowI: RG });
    b.position.x = x; b.position.z = z; G.add(b);
  }
  // sports centre + training pitches (phase 2) west
  const sc = building(120, 20, 70, { color: 0x1a2436, edge: edgeFor(2), edgeOpacity: mode === 'phases' ? 0.65 : 0.25, roofGlow: roofFor(2) ?? 0x9fc3ff, roofGlowI: 0.6 }); sc.position.set(-620, 0, 170); G.add(sc);
  for (const [x, z] of [[-700, 300], [-560, 300]]) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(105, 68), new THREE.MeshStandardMaterial({ color: 0x13285e, roughness: 0.9 })); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.6, z); G.add(p);
    const l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(100, 64)), lineMat(0xe8f0ff, 0.6)); l.rotation.x = -Math.PI / 2; l.position.set(x, 0.8, z); G.add(l);
  }
  // north mixed-use towers behind canal
  for (let x = -700; x <= 700; x += 110) { const h = 30 + rnd() * 60; const b = building(50, h, 40, { color: 0x151d2b, edgeOpacity: 0.15, lit: 0.6 }); b.position.set(x, 0, -660 - rnd() * 60); G.add(b); }
  // boulevard trees
  for (let x = -800; x <= 800; x += 22) for (const s of [-1, 1]) { const t = tree(0.55); t.position.set(x, 0, s * 26); G.add(t); }

  if (mode === 'smart') {
    const hub = V(230, 196, -230);
    const targets = [V(-560, 55, -220), V(-160, 45, -250), V(560, 30, 220), V(-620, 22, 170), V(-125, 10, 255), V(-500, 40, 270), V(100, 50, 290), V(600, 48, 360), V(-300, 20, 48), V(400, 20, -48), V(-700, 60, -680), V(500, 70, -690)];
    for (const t of targets) { G.add(arc(hub, t, 120, rnd() < 0.5 ? PAL.accent2 : PAL.accent, 0.9, 2.2)); const s = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 8), glow(PAL.accent, 3)); s.position.copy(t); G.add(s); }
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 400, 8, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.accent).multiplyScalar(1.5), transparent: true, opacity: 0.35, toneMapped: false }));
    beacon.position.set(230, 396, -230); G.add(beacon);
    for (let i = 0; i < 260; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(1.6, 6, 4), glow(i % 3 ? 0x7fb2ff : PAL.accent, 2)); s.position.set(-850 + rnd() * 1700, 6 + rnd() * 30, -500 + rnd() * 950); G.add(s); }
  }
  G.userData.labels = {
    stadium: V(-560, 60, -220), arena: V(-160, 50, -250), campus: V(240, 200, -240), retail: V(-60, 20, 48), residential: V(-560, 60, 300 - 140), park: V(-125, 10, 250), academy: V(570, 50, 250), sports: V(-640, 25, 240), north: V(0, 80, -680),
    resiBlock: V(-420, 50, 270), plaza: V(-330, 5, -40),
  };
  return G;
}

// ---------------------------------------------------------------- football (hero)
export function football() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const base = [[0, 1, 3 * phi], [1, 2 + phi, 2 * phi], [phi, 2, phi * phi * phi]];
  const perms = (a) => [[a[0], a[1], a[2]], [a[1], a[2], a[0]], [a[2], a[0], a[1]]];
  const pts = [];
  for (const b of base) for (const p of perms(b)) for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    const v = V(p[0] * sx, p[1] * sy, p[2] * sz); if (!pts.some((u) => u.distanceTo(v) < 1e-3)) pts.push(v);
  }
  const geo = new ConvexGeometry(pts); geo.scale(1 / 5, 1 / 5, 1 / 5);
  const G = new THREE.Group();
  const ball = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0x101c30, roughness: 0.35, metalness: 0.6, clearcoat: 0.3, flatShading: true, envMapIntensity: 0.5 }));
  ball.castShadow = true; G.add(ball);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), lineMat(0x8eb4ff, 1)); G.add(edges);
  const glowLines = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.accent).multiplyScalar(1.4), toneMapped: false }));
  glowLines.scale.setScalar(1.003); G.add(glowLines);
  // vertex nodes
  for (const p of pts) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), glow(0xdbe7ff, 1.3)); s.position.copy(p).multiplyScalar(1 / 5 * 1.004); G.add(s); }
  // orbit rings
  const ringData = [[1.45, 0.006, [1.2, 0.2, 0.3], PAL.accent2, 2.2], [1.7, 0.004, [1.45, -0.5, 0.1], PAL.accent, 1.6], [2.05, 0.003, [1.6, 0.35, -0.4], 0x9fc3ff, 1.2]];
  for (const [r, t, rot, c, i] of ringData) { const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 256), glow(c, i)); m.rotation.set(...rot); G.add(m); }
  for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2; const r = 1.45 + rnd() * 0.65; const s = new THREE.Mesh(new THREE.SphereGeometry(0.02 + rnd() * 0.02, 8, 6), glow(rnd() < 0.5 ? PAL.accent : 0x9fc3ff, 1.4)); s.position.set(Math.cos(a) * r, (rnd() - 0.5) * 0.8, Math.sin(a) * r); G.add(s); }
  G.position.y = 1.6;
  return G;
}

// ---------------------------------------------------------------- AI network
export function aiNetwork() {
  reseed(11);
  const G = new THREE.Group();
  const nodes = [];
  const shells = [[1.2, 40, PAL.accent], [2.2, 90, PAL.accent2], [3.3, 150, 0x9fc3ff]];
  for (const [r, n, c] of shells) for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, rr = Math.sqrt(1 - y * y), th = i * 2.399963;
    const p = V(Math.cos(th) * rr * r, y * r, Math.sin(th) * rr * r); nodes.push([p, c, r]);
    const s = new THREE.Mesh(new THREE.SphereGeometry(r === 1.2 ? 0.04 : 0.026, 10, 8), glow(c, 1.15)); s.position.copy(p); G.add(s);
  }
  const segs = [];
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const d = nodes[i][0].distanceTo(nodes[j][0]);
    if (d < 0.75 && rnd() < 0.55) segs.push(nodes[i][0], nodes[j][0]);
    else if (Math.abs(nodes[i][2] - nodes[j][2]) > 0.5 && d < 1.25 && rnd() < 0.08) segs.push(nodes[i][0], nodes[j][0]);
  }
  G.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), lineMat(0x5f8fd8, 0.35)));
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), new THREE.MeshPhysicalMaterial({ color: 0x0f1a2c, metalness: 0.6, roughness: 0.15, flatShading: true }));
  G.add(core); addEdges(core, PAL.accent, 1, 1);
  G.add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), glow(PAL.accent, 2.4)));
  for (const [r, rot] of [[3.9, [1.3, 0.2, 0]], [4.3, [1.75, -0.3, 0.4]]]) { const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 6, 256), glow(PAL.accent2, 1.6)); m.rotation.set(...rot); G.add(m); }
  G.position.y = 0;
  return G;
}

// ---------------------------------------------------------------- data centre / cloud
export function dataCenter() {
  reseed(5);
  const G = new THREE.Group();
  const ledTex = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 64, 256);
    for (let y = 6; y < 256; y += 12) { g.fillStyle = 'rgba(80,110,160,0.35)'; g.fillRect(6, y, 52, 7); for (let k = 0; k < 4; k++) if (rnd() < 0.6) { g.fillStyle = rnd() < 0.7 ? '#2593fa' : '#3d8bff'; g.fillRect(44 + k * 4, y + 2, 2, 3); } }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const rackMat = new THREE.MeshPhysicalMaterial({ color: 0x141c2a, metalness: 0.7, roughness: 0.3, emissive: 0xffffff, emissiveMap: ledTex, emissiveIntensity: 1.4 });
  for (let row = -2; row <= 2; row++) for (let i = -7; i <= 7; i++) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.3, 1.1), rackMat); r.position.set(i * 1.0, 1.15, row * 3.4 + (row > 0 ? 0.5 : 0)); r.castShadow = true; G.add(r); addEdges(r, 0x3a4a66, 0.5);
  }
  for (let row = -2; row <= 2; row++) { const s = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.05, 0.08), glow(PAL.accent2, 2)); s.position.set(0, 2.45, row * 3.4 + (row > 0 ? 0.5 : 0) + 0.6); G.add(s); }
  // cold aisle floor light
  for (let row = -2; row < 2; row++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(15, 0.12), glow(PAL.accent, 1.2)); f.rotation.x = -Math.PI / 2; f.position.set(0, 0.02, row * 3.4 + 1.7 + (row >= 0 ? 0.25 : 0)); G.add(f); }
  // cloud lattice above
  for (let i = 0; i < 40; i++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), glow(rnd() < 0.5 ? PAL.accent : PAL.accent2, 2)); s.position.set(-8 + rnd() * 16, 4 + rnd() * 2.5, -8 + rnd() * 16); G.add(s); }
  const ups = []; for (let i = 0; i < 18; i++) { const x = -7 + rnd() * 14, z = -7 + rnd() * 14; ups.push(V(x, 2.4, z), V(x + (rnd() - 0.5), 5.6, z + (rnd() - 0.5))); }
  G.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ups), lineMat(PAL.accent2, 0.45)));
  return G;
}

// ---------------------------------------------------------------- esports arena interior
export function arena() {
  reseed(21);
  const G = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 64), std(0x0b111b, 0.4, 0.4)); floor.rotation.x = -Math.PI / 2; G.add(floor);
  const seat = std(0x161f2e, 0.6, 0.2, { side: THREE.DoubleSide });
  G.add(new THREE.Mesh(ringGeom(40, 40, 0.5, 62, 62, 14, 160, 2), seat));
  G.add(new THREE.Mesh(ringGeom(64, 64, 16, 88, 88, 32, 160, 2), seat));
  G.add(new THREE.Mesh(ringGeom(62.2, 62.2, 14.3, 62.2, 62.2, 15.4, 160, 2), glow(PAL.accent, 1.4)));
  // audience phone lights
  const pts = []; for (let i = 0; i < 3500; i++) { const tier = rnd() < 0.5; const f = rnd(); const a = rnd() * Math.PI * 2; const r = tier ? 41 + f * 21 : 65 + f * 23; const y = tier ? 1.2 + f * 13.5 : 17 + f * 15.5; pts.push(Math.cos(a) * r, y, Math.sin(a) * r); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  G.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: new THREE.Color(0xbfdcff).multiplyScalar(1.6), size: 0.35, toneMapped: false, transparent: true, opacity: 0.9 })));
  // stage
  const stage = new THREE.Mesh(new THREE.CylinderGeometry(14, 15, 1.6, 64), std(0x1a2435, 0.3, 0.7)); stage.position.y = 0.8; G.add(stage);
  G.add(place(new THREE.Mesh(new THREE.TorusGeometry(14.6, 0.18, 8, 128), glow(PAL.accent, 2.5)), V(0, 1.6, 0), [Math.PI / 2, 0, 0]));
  for (const s of [-1, 1]) { // player desks
    const desk = new THREE.Mesh(new THREE.BoxGeometry(10, 1.1, 2.2), std(0x101826, 0.3, 0.6)); desk.position.set(s * 5.5, 2.2, 0); G.add(desk); addEdges(desk, s < 0 ? PAL.accent : PAL.accent2, 0.9);
    for (let k = -2; k <= 2; k++) { const mon = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), glow(s < 0 ? 0x2593fa : 0x5aa0ff, 1.1)); mon.position.set(s * 5.5 + k * 1.9, 3.3, -s * 0.6); mon.rotation.y = s < 0 ? 0 : Math.PI; G.add(mon); }
  }
  // hanging LED cube
  const screenTex = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 288; const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 512, 288); gr.addColorStop(0, '#0e1f4a'); gr.addColorStop(1, '#0b1f45'); g.fillStyle = gr; g.fillRect(0, 0, 512, 288);
    g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 3; g.strokeRect(40, 40, 432, 208); g.beginPath(); g.moveTo(256, 40); g.lineTo(256, 248); g.stroke(); g.beginPath(); g.arc(256, 144, 36, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#2593fa'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(120 + i * 30, 90 + (i % 2) * 60, 7, 0, 7); g.fill(); } g.fillStyle = '#3d8bff'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(300 + i * 30, 110 + (i % 2) * 50, 7, 0, 7); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const cube = new THREE.Group(); cube.position.y = 26;
  for (let k = 0; k < 4; k++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false, color: 0xbbbbbb })); p.rotation.y = k * Math.PI / 2; p.position.set(Math.sin(k * Math.PI / 2) * 8, 0, Math.cos(k * Math.PI / 2) * 8); cube.add(p); }
  const frame = new THREE.Mesh(new THREE.BoxGeometry(16.3, 9.3, 16.3), std(0x0b111b)); frame.scale.set(0.98, 0.98, 0.98); cube.add(frame);
  cube.add(place(new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.4, 16.6), glow(PAL.accent, 2)), V(0, -4.8, 0)));
  G.add(cube);
  // light beams
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; const beam = new THREE.Mesh(new THREE.ConeGeometry(4, 40, 24, 1, true), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x2550fa : 0x2593fa, transparent: true, opacity: 0.035, side: THREE.DoubleSide, depthWrite: false })); beam.position.set(Math.cos(a) * 30, 22, Math.sin(a) * 30); beam.lookAt(0, 0, 0); beam.rotateX(Math.PI / 2); G.add(beam); }
  // roof
  const roof = new THREE.Mesh(new THREE.SphereGeometry(95, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), std(0x070b12, 0.9, 0.1, { side: THREE.BackSide })); roof.scale.y = 0.48; roof.position.y = 30; G.add(roof);
  const truss = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(94, 32, 8, 0, Math.PI * 2, 0, Math.PI / 2)), lineMat(0x26324a, 0.6)); truss.scale.y = 0.48; truss.position.y = 30; G.add(truss);
  const spot = new THREE.PointLight(0xdfe9ff, 1800, 120, 1.6); spot.position.set(0, 40, 0); G.add(spot);
  return G;
}

// ---------------------------------------------------------------- football academy complex
export function academy() {
  reseed(31);
  const G = new THREE.Group();
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0x13285e, roughness: 0.9 });
  const pitches = [[-80, -40], [40, -40], [-80, 50], [40, 50]];
  for (const [x, z] of pitches) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(105, 68), pitchMat); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.3, z); p.receiveShadow = true; G.add(p);
    const l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(100, 64)), lineMat(0xeaf2ff, 0.8)); l.rotation.x = -Math.PI / 2; l.position.set(x, 0.5, z); G.add(l);
    const c = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 65 }, (_, i) => V(Math.cos(i / 64 * Math.PI * 2) * 9.15 + x, 0.5, Math.sin(i / 64 * Math.PI * 2) * 9.15 + z))), lineMat(0xeaf2ff, 0.8)); G.add(c);
    const mid = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(x, 0.5, z - 32), V(x, 0.5, z + 32)]), lineMat(0xeaf2ff, 0.8)); G.add(mid);
    for (const s of [-1, 1]) for (const k of [-1, 1]) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 26, 6), std(0x3a465a, 0.4, 0.8)); pole.position.set(x + s * 55, 13, z + k * 36); G.add(pole); const lamp = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 1), glow(0xe8f0ff, 3)); lamp.position.set(x + s * 55, 26, z + k * 36); G.add(lamp); }
  }
  // indoor dome
  const dome = new THREE.Mesh(new THREE.CylinderGeometry(40, 40, 110, 32, 1, false, 0, Math.PI), new THREE.MeshPhysicalMaterial({ color: 0x1b2a44, roughness: 0.25, metalness: 0.5, side: THREE.DoubleSide }));
  dome.rotation.z = Math.PI / 2; dome.rotation.y = Math.PI / 2; dome.position.set(170, 0, 5); dome.scale.set(1, 1, 0.55); G.add(dome); addEdges(dome, PAL.accent2, 0.35, 5);
  // academy HQ building with courtyard
  for (const [x, z, w, h, d, glowc] of [[-20, 150, 160, 22, 30, null], [-110, 185, 30, 18, 90], [70, 185, 30, 18, 90], [-20, 230, 160, 14, 26]]) {
    const b = building(w, h, d, { color: 0x1a2436, lit: 1.1, roofGlow: glowc, edgeOpacity: 0.3 }); b.position.x = x; b.position.z = z; G.add(b);
  }
  // small stand
  const stand = new THREE.Mesh(new THREE.BoxGeometry(90, 8, 12), std(0x1b2433)); stand.position.set(-80, 4, -84); stand.castShadow = true; G.add(stand); addEdges(stand, PAL.steel, 0.25);
  for (let i = 0; i < 60; i++) { const t = tree(0.7 + rnd() * 0.4); t.position.set(-170 + rnd() * 400, 0, (rnd() < 0.5 ? -110 : 270) + rnd() * 20); G.add(t); }
  // training markers
  for (let i = 0; i < 24; i++) { const cone = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.4, 8), glow(i % 2 ? 0xb8c1d4 : PAL.accent, 1.4)); cone.position.set(40 - 30 + (i % 6) * 12, 0.7, 50 - 20 + Math.floor(i / 6) * 12); G.add(cone); }
  return G;
}

// ---------------------------------------------------------------- Uzbekistan 3D map
export async function uzMap() {
  const data = await (await fetch('/data/central_asia.json')).json();
  const G = new THREE.Group();
  const lon0 = 64, lat0 = 41.5, k = Math.cos(lat0 * Math.PI / 180);
  const P = (lon, lat) => [(lon - lon0) * k * 10, (lat - lat0) * 10];
  const labels = {};
  for (const f of data.features) {
    const iso = f.properties.iso; const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) {
      const shape = new THREE.Shape(poly[0].map(([lo, la]) => new THREE.Vector2(...P(lo, la))));
      for (const h of poly.slice(1)) shape.holes.push(new THREE.Path(h.map(([lo, la]) => new THREE.Vector2(...P(lo, la)))));
      const isUz = iso === 'UZB';
      const geo = new THREE.ExtrudeGeometry(shape, { depth: isUz ? 3.2 : 0.4, bevelEnabled: isUz, bevelThickness: 0.25, bevelSize: 0.2, bevelSegments: 2 });
      geo.rotateX(-Math.PI / 2);
      const m = new THREE.Mesh(geo, isUz ? new THREE.MeshPhysicalMaterial({ color: 0x2a4570, roughness: 0.35, metalness: 0.45, clearcoat: 0.6 }) : std(0x121b2a, 0.8, 0.2));
      m.castShadow = isUz; m.receiveShadow = true; G.add(m);
      addEdges(m, isUz ? PAL.accent : 0x3a4d6e, isUz ? 1 : 0.8, 30);
    }
  }
  // Tashkent pin
  const [tx, tz0] = P(69.2401, 41.2995); const tz = -tz0;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 30, 16, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.accent).multiplyScalar(2), toneMapped: false, transparent: true, opacity: 0.85 }));
  beam.position.set(tx, 18, tz); G.add(beam);
  for (const [r, op] of [[1.2, 1], [2.4, 0.6], [3.8, 0.35]]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.09, 8, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.accent).multiplyScalar(2), toneMapped: false, transparent: true, opacity: op })); ring.rotation.x = Math.PI / 2; ring.position.set(tx, 3.7, tz); G.add(ring); }
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), glow(0xdbe7ff, 3)); top.position.set(tx, 33, tz); G.add(top);
  labels.tashkent = V(tx, 33, tz);
  labels.uz = (() => { const [x, z] = P(63.5, 41.6); return V(x, 4, -z); })();
  for (const [name, lo, la] of [['KAZ', 67, 46.5], ['TKM', 59.5, 39], ['KGZ', 74.5, 41.6], ['TJK', 71, 38.6], ['AFG', 66.5, 36.5]]) { const [x, z] = P(lo, la); labels[name] = V(x, 1, -z); }
  G.userData.labels = labels;
  return G;
}

// ---------------------------------------------------------------- scene registry
export const SCENES = {
  hero: { opts: { fov: 30, bloomStrength: 0.45, bloomThreshold: 0.8, bloomRadius: 0.35, fogDensity: 0.035 }, async build(st) {
      const { scene } = st; lights(scene, { sun: 0.9, shadowSize: 10, sunPos: [-8, 6, 3], rim: 1.6 }); ground(scene, 80, { cell: 0.5, gridOpacity: 0.55, gridColor: 0x1f4466 });
      scene.add(football()); scene.add(particles(700, 30, 0.2, 10, 0x9cc4ff, 0.025, 0.55));
      const pl = new THREE.PointLight(PAL.accent, 12, 6, 2); pl.position.set(0, 1.6, 0); scene.add(pl);
      return { cameras: { cover: { pos: [-2.3, 2.35, 7.5], target: [-1.9, 1.55, 0], fov: 30 }, final: { pos: [0, 2.0, 7.4], target: [0, 1.65, 0], fov: 32 }, close: { pos: [2.5, 2.9, 3.6], target: [0.2, 1.5, 0], fov: 38 } } };
    } },
  stadium: { opts: { fov: 35, fogDensity: 0.0012, bloomStrength: 0.6 }, async build(st) {
      const { scene } = st; lights(scene, { sun: 1.6, shadowSize: 400 }); ground(scene, 4000, { cell: 20 });
      const s = stadium(); scene.add(s);
      // context plaza + approach
      const plaza = new THREE.Mesh(new THREE.RingGeometry(140, 230, 96), std(0x111a28, 0.7, 0.2)); plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.1; plaza.scale.set(1.05, 0.9, 1); scene.add(plaza);
      for (let i = 0; i < 80; i++) { const a = (i / 80) * Math.PI * 2; const t = tree(1.1); t.position.set(Math.cos(a) * 205, 0, Math.sin(a) * 180); scene.add(t); }
      for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2; const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 6), glow(0xcfe0ff, 2)); lamp.position.set(Math.cos(a) * 160, 4, Math.sin(a) * 140); scene.add(lamp); }
      // surrounding blocks (context)
      reseed(3); for (let i = 0; i < 46; i++) { const a = rnd() * Math.PI * 2, r = 330 + rnd() * 420; const b = building(40 + rnd() * 50, 20 + rnd() * 70, 30 + rnd() * 40, { edgeOpacity: 0.18, lit: 0.6 }); b.position.x = Math.cos(a) * r; b.position.z = Math.sin(a) * r; scene.add(b); }
      return { labels: s.userData.labels, cameras: {
        aerial: { pos: [330, 260, 380], target: [0, 10, 0], fov: 34 },
        context: { pos: [-700, 620, 760], target: [0, 0, 0], fov: 38, exposure: 1.7 },
        facade: { pos: [190, 18, 260], target: [0, 32, 0], fov: 46 },
        interior: { pos: [-40, 9, 52], target: [20, 18, -40], fov: 62 },
        top: { pos: [0, 640, 40], target: [0, 0, 0], fov: 38 },
      } };
    } },
  city: { opts: { fov: 35, fogDensity: 0.00032, bloomStrength: 0.5, exposure: 1.35 }, async build(st, mode) {
      const { scene } = st; lights(scene, { sun: 2.6, hemi: 0.9, shadowSize: 1200 }); ground(scene, 8000, { cell: 50, gridOpacity: 0.25 });
      const c = city(mode); scene.add(c);
      return { labels: c.userData.labels, cameras: {
        wide: { pos: [620, 560, 980], target: [-120, 0, -80], fov: 44 },
        plan: { pos: [0, 2050, 200], target: [0, 0, -40], fov: 40 },
        campus: { pos: [640, 230, 160], target: [230, 90, -240], fov: 40 },
        residential: { pos: [-150, 160, 760], target: [-420, 20, 260], fov: 44 },
        boulevard: { pos: [560, 26, 20], target: [-200, 18, 0], fov: 52 },
        education: { pos: [980, 190, 620], target: [560, 20, 230], fov: 40 },
        smart: { pos: [820, 700, 860], target: [-80, 40, -80], fov: 42 },
        phases: { pos: [-820, 820, 900], target: [20, 0, -60], fov: 42 },
      } };
    } },
  ai: { opts: { fov: 35, fog: false, bloomStrength: 0.5, bloomThreshold: 0.75, bloomRadius: 0.3, bgTop: '#0e1a3a', bgBottom: '#0b0f0e' }, async build(st) {
      const { scene } = st; lights(scene, { sun: 0.8 }); scene.add(aiNetwork()); scene.add(particles(1200, 26, -10, 10, 0x7fa8ff, 0.03, 0.6));
      return { cameras: { wide: { pos: [5.6, 2.2, 9.5], target: [1.6, 0, 0], fov: 38, exposure: 1.5 }, close: { pos: [2.6, 1.0, 4.6], target: [0, 0, 0], fov: 45 } } };
    } },
  datacenter: { opts: { fov: 40, fogDensity: 0.03, bloomStrength: 0.8, bloomThreshold: 0.65 }, async build(st) {
      const { scene } = st; lights(scene, { sun: 0.6, shadowSize: 20, sunPos: [-10, 20, 10] }); ground(scene, 120, { cell: 1, gridOpacity: 0.45, gridColor: 0x1b3550 }); scene.add(dataCenter());
      return { cameras: { aisle: { pos: [12, 5.2, 10], target: [0, 1.6, 0], fov: 40 } } };
    } },
  arena: { opts: { fov: 50, fog: false, bloomStrength: 0.55, bloomThreshold: 0.75, bgTop: '#0b0f0e', bgBottom: '#0b0f0e', exposure: 1.1 }, async build(st) {
      const { scene } = st; scene.add(new THREE.HemisphereLight(0x9cb8ff, 0x04060a, 0.35)); scene.add(arena());
      return { cameras: { wide: { pos: [0, 24, 70], target: [0, 15, 0], fov: 58 }, stage: { pos: [26, 10, 34], target: [0, 10, 0], fov: 58 } } };
    } },
  academy: { opts: { fov: 35, fogDensity: 0.0011 }, async build(st) {
      const { scene } = st; lights(scene, { sun: 1.4, shadowSize: 400 }); ground(scene, 4000, { cell: 20 }); scene.add(academy());
      return { cameras: { aerial: { pos: [330, 230, 380], target: [20, 0, 40], fov: 38 } } };
    } },
  map: { opts: { fov: 30, fogDensity: 0.0015, bloomStrength: 0.75, bloomThreshold: 0.7 }, async build(st) {
      const { scene } = st; lights(scene, { sun: 1.6, shadowSize: 200, sunPos: [-100, 200, 120] }); ground(scene, 1600, { cell: 10, y: -0.2, gridOpacity: 0.3 });
      const m = await uzMap(); scene.add(m);
      return { labels: m.userData.labels, cameras: { main: { pos: [40, 130, 140], target: [34, 0, -4], fov: 36 }, tashkent: { pos: [80, 70, 80], target: [42, 4, -2], fov: 34 } } };
    } },
};
