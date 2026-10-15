import * as THREE from 'three';

/**
 * Creates a photorealistic 3D model of the Glacial Tech 65W GaN Turbo Charger
 * and 4-in-1 Braided Fast Charging Cable.
 * 
 * @param {string} colorVariant - 'silver' | 'black' | 'blue'
 */
export function createChargerModel(colorVariant = 'silver') {
  const root = new THREE.Group();

  const isDark = colorVariant === 'black';

  // 1. GaN Matte Polycarbonate Case Material
  const ganCaseMaterial = new THREE.MeshPhysicalMaterial({
    color: isDark ? 0x1A1E24 : 0xF4F8FD,
    roughness: 0.28,
    metalness: 0.08,
    clearcoat: 0.5,
    clearcoatRoughness: 0.15
  });

  // 2. Anodized Aluminum Connector Shell Material
  const aluminumMaterial = new THREE.MeshStandardMaterial({
    color: isDark ? 0x3A4452 : 0xC8D7E6,
    metalness: 0.9,
    roughness: 0.22
  });

  // 3. Braided Nylon Cable Texture Material
  const cableMaterial = new THREE.MeshStandardMaterial({
    color: isDark ? 0x282E38 : 0x8FA4B8,
    roughness: 0.8,
    metalness: 0.1
  });

  // 4. Gold Contacts Material
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xE6B800,
    metalness: 0.95,
    roughness: 0.15
  });

  // 5. GaN Charger Faceplate Brand Texture
  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = 256;
  faceCanvas.height = 256;
  const ctx = faceCanvas.getContext('2d');
  ctx.fillStyle = isDark ? '#14181F' : '#EAF2FA';
  ctx.fillRect(0, 0, 256, 256);

  ctx.font = '700 28px -apple-system, sans-serif';
  ctx.fillStyle = '#145CFF';
  ctx.textAlign = 'center';
  ctx.fillText('65W GaN', 128, 90);

  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('GLACIAL TECH', 128, 120);

  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('PD 3.0 • QC 4.0', 128, 145);

  const faceTexture = new THREE.CanvasTexture(faceCanvas);
  faceTexture.colorSpace = THREE.SRGBColorSpace;
  const brandedPlateMaterial = new THREE.MeshBasicMaterial({ map: faceTexture });

  // ==========================================
  // 1. GaN TURBO CHARGER BLOCK
  // ==========================================
  const chargerBlock = new THREE.Group();
  chargerBlock.position.set(-0.65, 0.65, 0);

  // Main GaN Charger Body
  const bodyGeo = new THREE.BoxGeometry(0.9, 1.25, 0.9);
  const bodyMesh = new THREE.Mesh(bodyGeo, ganCaseMaterial);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  chargerBlock.add(bodyMesh);

  // Branded Front Faceplate
  const plateGeo = new THREE.PlaneGeometry(0.82, 1.15);
  const plateMesh = new THREE.Mesh(plateGeo, brandedPlateMaterial);
  plateMesh.position.z = 0.46;
  chargerBlock.add(plateMesh);

  // Dual USB-C Ports + 1 USB-A Port
  const portBorderMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 });

  // Type-C Port 1
  const port1Geo = new THREE.BoxGeometry(0.26, 0.09, 0.02);
  const port1 = new THREE.Mesh(port1Geo, portBorderMat);
  port1.position.set(0, 0.18, 0.47);
  chargerBlock.add(port1);

  // Type-C Port 2
  const port2 = port1.clone();
  port2.position.set(0, -0.02, 0.47);
  chargerBlock.add(port2);

  // USB-A Port
  const usbAGeo = new THREE.BoxGeometry(0.36, 0.15, 0.02);
  const usbA = new THREE.Mesh(usbAGeo, portBorderMat);
  usbA.position.set(0, -0.26, 0.47);
  chargerBlock.add(usbA);

  // Folding Metallic AC Prongs in back
  const prongGeo = new THREE.BoxGeometry(0.08, 0.35, 0.03);
  const prong1 = new THREE.Mesh(prongGeo, aluminumMaterial);
  prong1.position.set(-0.2, 0.1, -0.52);
  chargerBlock.add(prong1);

  const prong2 = prong1.clone();
  prong2.position.set(0.2, 0.1, -0.52);
  chargerBlock.add(prong2);

  root.add(chargerBlock);

  // ==========================================
  // 2. 4-IN-1 BRAIDED HIGH-SPEED CABLE
  // ==========================================
  const cableGroup = new THREE.Group();
  cableGroup.position.set(0.65, 0.65, 0);

  // Sleek Anodized Aluminum Connector Head
  const headGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.75, 32);
  const headMesh = new THREE.Mesh(headGeo, aluminumMaterial);
  headMesh.castShadow = true;
  cableGroup.add(headMesh);

  // Strain Relief Flexible Collar
  const reliefGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.25, 24);
  const reliefMesh = new THREE.Mesh(reliefGeo, cableMaterial);
  reliefMesh.position.y = -0.45;
  cableGroup.add(reliefMesh);

  // Gold Type-C Male Connector Plug
  const plugGeo = new THREE.BoxGeometry(0.22, 0.32, 0.08);
  const plugMesh = new THREE.Mesh(plugGeo, goldMaterial);
  plugMesh.position.y = 0.48;
  cableGroup.add(plugMesh);

  // Braided Cable Curved Coil (Torus Ring)
  const coilGeo = new THREE.TorusGeometry(0.55, 0.09, 16, 48, Math.PI * 1.8);
  const coilMesh = new THREE.Mesh(coilGeo, cableMaterial);
  coilMesh.rotation.x = Math.PI / 2;
  coilMesh.position.set(0, -0.7, 0.2);
  coilMesh.castShadow = true;
  cableGroup.add(coilMesh);

  root.add(cableGroup);

  // Floating animation
  root.userData = {
    chargerBlock,
    cableGroup,
    update(time) {
      chargerBlock.position.y = 0.65 + Math.sin(time * 1.3) * 0.03;
      cableGroup.position.y = 0.65 + Math.cos(time * 1.3) * 0.03;
      cableGroup.rotation.y = Math.sin(time * 0.8) * 0.15;
    }
  };

  return root;
}
