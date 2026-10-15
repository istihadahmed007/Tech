import * as THREE from 'three';

/**
 * Creates a photorealistic 3D model of the Y80 / T800 Ultra Smartwatch.
 * Features brushed aerospace titanium chassis, sapphire crystal display,
 * digital crown with orange accent ring, tactile side button, and ocean-loop strap.
 * 
 * @param {string} colorVariant - 'silver' | 'black' | 'orange'
 */
export function createWatchModel(colorVariant = 'silver') {
  const root = new THREE.Group();

  const isDark = colorVariant === 'black';

  // 1. Brushed Aerospace Titanium Chassis Material
  const titaniumMaterial = new THREE.MeshStandardMaterial({
    color: isDark ? 0x22262C : 0xD5E0EA,
    metalness: 0.88,
    roughness: 0.28
  });

  // 2. High-Polish Chamfer Edge Material
  const polishedMetalMaterial = new THREE.MeshStandardMaterial({
    color: isDark ? 0x333A44 : 0xF0F5FA,
    metalness: 0.95,
    roughness: 0.12
  });

  // 3. Signature International Orange Crown Accent Ring
  const orangeAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF5500,
    metalness: 0.2,
    roughness: 0.35
  });

  // 4. Textured Ocean Loop / Ridge Silicone Strap Material
  const strapMaterial = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1B1E22 : 0xC8D8E6,
    roughness: 0.75,
    metalness: 0.05
  });

  // 5. Watchface Display Texture Generator (Glacial Tech UI)
  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = 512;
  faceCanvas.height = 640;
  const ctx = faceCanvas.getContext('2d');

  // OLED Deep Black Background
  ctx.fillStyle = '#060B12';
  ctx.fillRect(0, 0, 512, 640);

  // Subtle Ice-Blue Tech Grid / Horizon
  const grad = ctx.createRadialGradient(256, 320, 20, 256, 320, 260);
  grad.addColorStop(0, 'rgba(20, 92, 255, 0.22)');
  grad.addColorStop(1, 'rgba(6, 11, 18, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 640);

  // Glacial Tech Brand Header
  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillStyle = '#00D2FF';
  ctx.textAlign = 'center';
  ctx.fillText('GLACIAL TECH', 256, 120);

  // Primary Time Display
  ctx.font = '800 108px -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('09:41', 256, 260);

  // Sub-metrics: Battery & Heart Rate
  ctx.font = '600 24px -apple-system, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('⚡ 98%   •   ♥ 72 BPM', 256, 320);

  // Circular Activity Gauge
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(256, 440, 75, 0, Math.PI * 2);
  ctx.stroke();

  // Active Progress Arc (Sapphire & Cyan)
  const arcGrad = ctx.createLinearGradient(180, 360, 330, 500);
  arcGrad.addColorStop(0, '#145CFF');
  arcGrad.addColorStop(1, '#00D2FF');
  ctx.strokeStyle = arcGrad;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(256, 440, 75, -Math.PI / 2, Math.PI * 0.85);
  ctx.stroke();

  // Metrics center value
  ctx.font = '700 28px -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('8,420', 256, 440);
  ctx.font = '500 16px -apple-system, sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('STEPS TODAY', 256, 465);

  const faceTexture = new THREE.CanvasTexture(faceCanvas);
  faceTexture.colorSpace = THREE.SRGBColorSpace;

  const glassScreenMaterial = new THREE.MeshPhysicalMaterial({
    map: faceTexture,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.95
  });

  // ==========================================
  // 1. WATCH CASE CHASSIS
  // ==========================================
  const watchBody = new THREE.Group();
  watchBody.position.y = 0.55;

  // Main Squircle Titanium Body
  const bodyGeo = new THREE.BoxGeometry(1.28, 1.52, 0.34);
  const bodyMesh = new THREE.Mesh(bodyGeo, titaniumMaterial);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  watchBody.add(bodyMesh);

  // Protective Screen Bezel
  const bezelGeo = new THREE.BoxGeometry(1.22, 1.46, 0.05);
  const bezelMesh = new THREE.Mesh(bezelGeo, polishedMetalMaterial);
  bezelMesh.position.z = 0.18;
  watchBody.add(bezelMesh);

  // Sapphire Glass Face Screen
  const screenGeo = new THREE.PlaneGeometry(1.14, 1.38);
  const screenMesh = new THREE.Mesh(screenGeo, glassScreenMaterial);
  screenMesh.position.z = 0.21;
  watchBody.add(screenMesh);

  // ==========================================
  // 2. HARDWARE CROWN & BUTTONS
  // ==========================================
  // Digital Crown Guard Bump
  const guardGeo = new THREE.BoxGeometry(0.12, 0.48, 0.28);
  const guardMesh = new THREE.Mesh(guardGeo, titaniumMaterial);
  guardMesh.position.set(0.68, 0.2, 0);
  watchBody.add(guardMesh);

  // Rotating Digital Crown (With ridges)
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0.72, 0.25, 0);
  crownGroup.rotation.z = Math.PI / 2;

  const crownGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.18, 32);
  const crownMesh = new THREE.Mesh(crownGeo, titaniumMaterial);
  crownGroup.add(crownMesh);

  // Orange Accent Groove Ring
  const crownRingGeo = new THREE.TorusGeometry(0.142, 0.02, 16, 32);
  const crownRingMesh = new THREE.Mesh(crownRingGeo, orangeAccentMaterial);
  crownRingMesh.rotation.x = Math.PI / 2;
  crownGroup.add(crownRingMesh);

  watchBody.add(crownGroup);

  // Secondary Pill Button
  const pillGeo = new THREE.BoxGeometry(0.06, 0.32, 0.12);
  const pillMesh = new THREE.Mesh(pillGeo, titaniumMaterial);
  pillMesh.position.set(0.68, -0.22, 0);
  watchBody.add(pillMesh);

  // Action Button on Left Side (Orange Titanium)
  const leftActionGeo = new THREE.BoxGeometry(0.06, 0.42, 0.14);
  const leftActionMesh = new THREE.Mesh(leftActionGeo, orangeAccentMaterial);
  leftActionMesh.position.set(-0.66, 0.05, 0);
  watchBody.add(leftActionMesh);

  // Dual Speaker Grille Slots
  for (let i = -1; i <= 1; i++) {
    const slotGeo = new THREE.BoxGeometry(0.02, 0.06, 0.08);
    const slotMesh = new THREE.Mesh(slotGeo, polishedMetalMaterial);
    slotMesh.position.set(-0.66, -0.28 + i * 0.1, 0);
    watchBody.add(slotMesh);
  }

  // ==========================================
  // 3. OCEAN LOOP STRAP (TOP & BOTTOM)
  // ==========================================
  function createStrapSegment(isTop = true) {
    const strap = new THREE.Group();
    const dir = isTop ? 1 : -1;

    // Curved loop segments simulating corrugated ocean ridge
    for (let i = 0; i < 7; i++) {
      const ridgeGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.98, 24);
      const ridgeMesh = new THREE.Mesh(ridgeGeo, strapMaterial);
      ridgeMesh.rotation.z = Math.PI / 2;
      ridgeMesh.position.set(
        0,
        dir * (0.85 + i * 0.16),
        -Math.sin((i / 7) * Math.PI * 0.6) * 0.35
      );
      ridgeMesh.castShadow = true;
      strap.add(ridgeMesh);
    }

    // Titanium Buckle / End-clamp
    const buckleGeo = new THREE.BoxGeometry(1.05, 0.14, 0.12);
    const buckleMesh = new THREE.Mesh(buckleGeo, titaniumMaterial);
    buckleMesh.position.set(0, dir * 1.95, -0.32);
    strap.add(buckleMesh);

    return strap;
  }

  const topStrap = createStrapSegment(true);
  const bottomStrap = createStrapSegment(false);
  watchBody.add(topStrap);
  watchBody.add(bottomStrap);

  root.add(watchBody);

  // Gentle floating animation
  root.userData = {
    crownGroup,
    watchBody,
    update(time) {
      // Gentle turntable float
      watchBody.position.y = 0.55 + Math.sin(time * 1.4) * 0.035;
      crownGroup.rotation.y = time * 0.8;
    }
  };

  return root;
}
