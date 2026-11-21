// Hero: live gerenderter 3D-KI-Kern (Three.js / WebGL).
// Glaskugel mit neuronalem Netz, Chrom- und Titanringe, Lichtspuren, Partikel. Reagiert auf Maus und Scrollen.
import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

export function startCore(canvas, hero) {
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.38;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const BLUE = new THREE.Color('#168BFF'); const CYAN = new THREE.Color('#3FD5FF');
  const core = new THREE.Group(); scene.add(core);

  // Weiches Leuchten (Sprite mit Verlauf)
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(120,190,255,.75)'); gr.addColorStop(0.5, 'rgba(22,139,255,.22)'); gr.addColorStop(1, 'rgba(22,139,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const sprite = (scale, opacity) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity })); s.scale.setScalar(scale); return s; };
  const halo = sprite(8.5, 0.42); halo.position.z = -1.2; core.add(halo);
  const heart = sprite(1.3, 0.55); core.add(heart);

  // Neuronales Netz im Inneren
  const net = new THREE.Group(); core.add(net);
  const N = mobile ? 70 : 150; const R = 1.12; const nodes = [];
  for (let i = 0; i < N; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(R * (0.45 + 0.55 * Math.cbrt(Math.random())));
    nodes.push(v);
  }
  const edges = []; const linePos = [];
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    if (nodes[i].distanceTo(nodes[j]) < (mobile ? 0.62 : 0.5)) { edges.push([i, j]); linePos.push(...nodes[i].toArray(), ...nodes[j].toArray()); }
  }
  const lineGeo = new THREE.BufferGeometry(); lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  net.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false })));
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  net.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({ map: glowTex, color: 0x9fd2ff, size: 0.1, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  // Signale, die über die Verbindungen laufen
  const SIG = Math.min(edges.length, mobile ? 14 : 34); const sig = Array.from({ length: SIG }, () => ({ e: Math.floor(Math.random() * edges.length), t: Math.random(), s: 0.25 + Math.random() * 0.6 }));
  const sigGeo = new THREE.BufferGeometry(); sigGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SIG * 3), 3));
  net.add(new THREE.Points(sigGeo, new THREE.PointsMaterial({ map: glowTex, color: 0xffffff, size: 0.2, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));

  // Glasschichten: innen facettiert, aussen glatte Kugel mit echter Lichtbrechung
  const facet = new THREE.Mesh(new THREE.IcosahedronGeometry(1.32, 1), new THREE.MeshPhysicalMaterial({ color: 0x9cc8ff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.1, flatShading: true, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 }));
  core.add(facet);
  const facetEdges = new THREE.LineSegments(new THREE.EdgesGeometry(facet.geometry), new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
  facet.add(facetEdges);
  // Aussen: klare Glaskugel (spiegelnd, durchsichtig – das Netz im Inneren bleibt sichtbar)
  const glass = new THREE.Mesh(new THREE.SphereGeometry(1.62, 96, 96), new THREE.MeshPhysicalMaterial({ color: 0x8fc4ff, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.13, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.4, depthWrite: false, side: THREE.FrontSide }));
  glass.renderOrder = 5;
  // Zweite, dünne Glasschicht für Tiefe
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1.74, 64, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.0, transparent: true, opacity: 0.05, clearcoat: 1, envMapIntensity: 1.6, depthWrite: false }));
  shell.renderOrder = 6; core.add(shell);
  core.add(glass);

  // Metallringe (Chrom / gebürstetes Titan) mit Lichtspuren
  const rings = []; const trails = [];
  const ringDefs = [
    { r: 2.05, tube: 0.028, tilt: [1.15, 0.2, 0.0], mat: { color: 0xf2f5fa, metalness: 1, roughness: 0.06 }, speed: 0.16 },
    { r: 2.42, tube: 0.05, tilt: [1.45, -0.55, 0.3], mat: { color: 0x8d949e, metalness: 1, roughness: 0.36 }, speed: -0.11 },
    { r: 2.85, tube: 0.018, tilt: [0.75, 0.9, -0.2], mat: { color: 0xcfe2ff, metalness: 1, roughness: 0.1 }, speed: 0.07 },
  ];
  ringDefs.forEach((d, k) => {
    const pivot = new THREE.Group(); pivot.rotation.set(...d.tilt); core.add(pivot);
    pivot.add(new THREE.Mesh(new THREE.TorusGeometry(d.r, d.tube, 24, 220), new THREE.MeshStandardMaterial({ ...d.mat, envMapIntensity: 1.5 })));
    // Lichtspur: Punkte entlang des Rings, nach hinten ausblendend
    const T = 46; const pos = new Float32Array(T * 3); const col = new Float32Array(T * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ map: glowTex, size: k === 1 ? 0.17 : 0.13, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    pivot.add(pts);
    rings.push({ pivot, d, base: d.tilt.slice() }); trails.push({ g, pos, col, r: d.r, T, a: Math.random() * 6.28, speed: (k % 2 ? -1 : 1) * (0.5 + k * 0.18) });
  });

  // Schwebende Partikel im Raum
  const P = mobile ? 120 : 320; const pp = new Float32Array(P * 3);
  for (let i = 0; i < P; i++) { pp[i * 3] = (Math.random() - 0.5) * 16; pp[i * 3 + 1] = (Math.random() - 0.5) * 10; pp[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1; }
  const dust = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ map: glowTex, color: 0x6fb4ff, size: 0.05, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  scene.add(new THREE.PointLight(BLUE, 40, 12, 2));
  const rim = new THREE.DirectionalLight(0xbfe4ff, 2.2); rim.position.set(4, 3, 5); scene.add(rim);
  const back = new THREE.DirectionalLight(CYAN, 1.4); back.position.set(-5, -2, -3); scene.add(back);

  // Layout, Maus, Scroll
  let home = new THREE.Vector3(); let baseScale = 1;
  const resize = () => {
    const w = hero.clientWidth; const h = hero.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
    if (w < 760) { home.set(halfW * 0.3, 1.55, 0); baseScale = 0.4; } else if (w < 1100) { home.set(halfW * 0.5, 0.5, 0); baseScale = 0.52; } else { home.set(halfW * 0.52, 0.1, 0); baseScale = 0.68; }
  };
  resize(); window.addEventListener('resize', resize);
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => { mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; }, { passive: true });
  let scrollP = 0; const onScroll = () => { scrollP = Math.min(1.3, window.scrollY / Math.max(1, hero.clientHeight)); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const clock = new THREE.Clock(); let raf = null; let visible = true; const tmp = new THREE.Vector3();
  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05); const t = clock.elapsedTime;
    mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
    // Schweben, langsame Rotation, Reaktion auf Maus und Scroll
    core.position.set(home.x + mouse.x * 0.18, home.y + Math.sin(t * 0.6) * 0.12 - mouse.y * 0.12 + scrollP * 1.6, 0);
    core.scale.setScalar(baseScale * (1 - scrollP * 0.28));
    core.rotation.y = t * 0.12 + mouse.x * 0.35 + scrollP * 1.4; core.rotation.x = Math.sin(t * 0.25) * 0.08 + mouse.y * 0.22;
    net.rotation.y = -t * 0.22; net.rotation.z = t * 0.07;
    facet.rotation.y = t * 0.09; facet.rotation.x = -t * 0.05;
    heart.scale.setScalar(1.5 + Math.sin(t * 1.6) * 0.14); halo.material.opacity = 0.3 + Math.sin(t * 0.8) * 0.05;
    rings.forEach(({ pivot, d, base }, k) => { pivot.rotation.x = base[0] + Math.sin(t * 0.3 + k) * 0.12 + scrollP * (0.9 - k * 0.5); pivot.rotation.y = base[1] + t * d.speed; pivot.rotation.z = base[2] + Math.cos(t * 0.22 + k) * 0.1; });
    trails.forEach((tr) => {
      tr.a += tr.speed * dt;
      for (let i = 0; i < tr.T; i++) {
        const a = tr.a - Math.sign(tr.speed) * i * 0.022; const f = (1 - i / tr.T) ** 2.2;
        tr.pos[i * 3] = Math.cos(a) * tr.r; tr.pos[i * 3 + 1] = Math.sin(a) * tr.r; tr.pos[i * 3 + 2] = 0;
        tr.col[i * 3] = 0.35 * f; tr.col[i * 3 + 1] = 0.85 * f; tr.col[i * 3 + 2] = 1.0 * f;
      }
      tr.g.attributes.position.needsUpdate = true; tr.g.attributes.color.needsUpdate = true;
    });
    const sp = sigGeo.attributes.position.array;
    sig.forEach((s, i) => { s.t += s.s * dt; if (s.t > 1) { s.t = 0; s.e = Math.floor(Math.random() * edges.length); } const [a, b] = edges[s.e]; tmp.lerpVectors(nodes[a], nodes[b], s.t); sp[i * 3] = tmp.x; sp[i * 3 + 1] = tmp.y; sp[i * 3 + 2] = tmp.z; });
    sigGeo.attributes.position.needsUpdate = true;
    dust.rotation.y = t * 0.012 + mouse.x * 0.03; dust.position.y = scrollP * 0.8;
    canvas.style.opacity = String(Math.max(0, 1 - scrollP * 0.85));
    renderer.render(scene, camera);
    raf = visible ? requestAnimationFrame(frame) : null;
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { clock.getDelta(); raf = requestAnimationFrame(frame); } }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { visible = false; } else { visible = true; if (!raf) { clock.getDelta(); raf = requestAnimationFrame(frame); } } });
  raf = requestAnimationFrame(frame);
  hero.classList.add('core-ready');
}
