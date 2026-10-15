import * as THREE from 'three';

/**
 * Creates a photorealistic 3D model of the H2 ANC Pro Active Noise Cancelling TWS Earbuds.
 * Includes detailed charging case, metallic hinge, acoustic mesh, silicone tips, and status LED.
 * 
 * @param {string} colorVariant - 'white' | 'black' | 'silver'
 */
export function createTwsModel(colorVariant = 'white') {
  const root = new THREE.Group();

  const isDark = colorVariant === 'black';

  // Primary Body Material (Ceramic Gloss or Matte Obsidian)
  const caseMaterial = new THREE.MeshPhysicalMaterial({
    color: isDark ? 0x1E2229 : 0xFAFCFF,
    roughness: isDark ? 0.35 : 0.12,
    metalness: isDark ? 0.2 : 0.05,
    clearcoat: isDark ? 0.4 : 0.95,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9
  });

  // Metallic Brushed Accents (Hinge, Ports, Contacts)
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xC8D7E6,
    metalness: 0.92,
    roughness: 0.22
  });

  // Acoustic Mesh Filter Material
  const meshMaterial = new THREE.MeshStandardMaterial({
    color: 0x2A323D,
    metalness: 0.85,
    roughness: 0.45
  });

  // Silicone Ear-tip Material
  const siliconeMaterial = new THREE.MeshPhysicalMaterial({
    color: isDark ? 0x2D343F : 0xEFF6FF,
    roughness: 0.55,
    metalness: 0.0,
    transmission: 0.3,
    thickness: 0.5,
    clearcoat: 0.1
  });

  // Gold Charging Pins Material
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xE6B800,
    metalness: 0.95,
    roughness: 0.18
  });

  // Status LED Material (Signature Glacial Tech Sapphire)
  const ledMaterial = new THREE.MeshBasicMaterial({
    color: 0x00D2FF
  });

  // ==========================================
  // 1. CHARGING CASE
  // ==========================================
  const caseGroup = new THREE.Group();
  caseGroup.position.set(0, 0.42, 0);

  // Lower Case Body: Rounded Capsule/Pebble Shape
  const lowerGeo = new THREE.CylinderGeometry(0.85, 0.72, 0.75, 48);
  const lowerMesh = new THREE.Mesh(lowerGeo, caseMaterial);
  lowerMesh.castShadow = true;
  lowerMesh.receiveShadow = true;
  caseGroup.add(lowerMesh);

  // Bottom rounded cap
  const bottomCapGeo = new THREE.SphereGeometry(0.72, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const bottomCapMesh = new THREE.Mesh(bottomCapGeo, caseMaterial);
  bottomCapMesh.position.y = -0.375;
  caseGroup.add(bottomCapMesh);

  // USB-C Port Cutout Rim
  const portGeo = new THREE.BoxGeometry(0.24, 0.08, 0.12);
  const portMesh = new THREE.Mesh(portGeo, metalMaterial);
  portMesh.position.set(0, -0.72, 0);
  caseGroup.add(portMesh);

  // Top Case Lid: Rounded Clamshell
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.375, -0.6); // Hinge pivot point

  const lidMeshGeo = new THREE.SphereGeometry(0.85, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const lidMesh = new THREE.Mesh(lidMeshGeo, caseMaterial);
  lidMesh.scale.set(1, 0.65, 1);
  lidMesh.position.set(0, 0, 0.6);
  lidMesh.castShadow = true;
  lidGroup.add(lidMesh);

  // Rear Titanium Hinge
  const hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 24);
  const hingeMesh = new THREE.Mesh(hingeGeo, metalMaterial);
  hingeMesh.rotation.z = Math.PI / 2;
  hingeMesh.position.set(0, 0.02, 0);
  lidGroup.add(hingeMesh);

  // Open lid by 65 degrees for dramatic showcase
  lidGroup.rotation.x = -Math.PI * 0.36;
  caseGroup.add(lidGroup);

  // Front Status LED Indicator
  const ledGeo = new THREE.SphereGeometry(0.025, 16, 16);
  const ledMesh = new THREE.Mesh(ledGeo, ledMaterial);
  ledMesh.position.set(0, 0.05, 0.86);
  caseGroup.add(ledMesh);

  root.add(caseGroup);

  // ==========================================
  // 2. ACOUSTIC EARBUDS (LEFT & RIGHT)
  // ==========================================
  function createEarbud(isRight = false) {
    const bud = new THREE.Group();

    // Stem: Cylindrical body with tapered top
    const stemGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.72, 32);
    const stemMesh = new THREE.Mesh(stemGeo, caseMaterial);
    stemMesh.castShadow = true;
    bud.add(stemMesh);

    // Stem Bottom Gold Contacts
    const ring1Geo = new THREE.CylinderGeometry(0.082, 0.082, 0.03, 24);
    const ring1 = new THREE.Mesh(ring1Geo, goldMaterial);
    ring1.position.y = -0.32;
    bud.add(ring1);

    const ring2Geo = new THREE.CylinderGeometry(0.082, 0.082, 0.03, 24);
    const ring2 = new THREE.Mesh(ring2Geo, goldMaterial);
    ring2.position.y = -0.26;
    bud.add(ring2);

    // Capacitive Touch Sensor Indentation
    const sensorGeo = new THREE.BoxGeometry(0.04, 0.22, 0.03);
    const sensorMesh = new THREE.Mesh(sensorGeo, metalMaterial);
    sensorMesh.position.set(0, 0.08, 0.08);
    bud.add(sensorMesh);

    // Acoustic Head: Ergonomic bulb
    const headGroup = new THREE.Group();
    headGroup.position.set(isRight ? -0.15 : 0.15, 0.38, 0.08);

    const bulbGeo = new THREE.SphereGeometry(0.22, 32, 24);
    const bulbMesh = new THREE.Mesh(bulbGeo, caseMaterial);
    bulbMesh.castShadow = true;
    headGroup.add(bulbMesh);

    // Acoustic Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.14, 24);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, metalMaterial);
    nozzleMesh.rotation.z = isRight ? -Math.PI / 4 : Math.PI / 4;
    nozzleMesh.position.set(isRight ? -0.16 : 0.16, 0.04, 0.12);
    headGroup.add(nozzleMesh);

    // Metallic Mesh Filter inside nozzle
    const meshGeo = new THREE.CircleGeometry(0.11, 24);
    const filterMesh = new THREE.Mesh(meshGeo, meshMaterial);
    filterMesh.rotation.y = isRight ? -Math.PI / 3 : Math.PI / 3;
    filterMesh.position.set(isRight ? -0.21 : 0.21, 0.08, 0.18);
    headGroup.add(filterMesh);

    // Silicone Ear-tip
    const tipGeo = new THREE.ConeGeometry(0.2, 0.18, 32);
    const tipMesh = new THREE.Mesh(tipGeo, siliconeMaterial);
    tipMesh.rotation.z = isRight ? Math.PI * 0.75 : -Math.PI * 0.75;
    tipMesh.position.set(isRight ? -0.24 : 0.24, 0.11, 0.22);
    headGroup.add(tipMesh);

    bud.add(headGroup);
    return bud;
  }

  // Left Earbud: Floating gracefully on left
  const leftBud = createEarbud(false);
  leftBud.position.set(-0.65, 0.95, 0.25);
  leftBud.rotation.set(0.2, 0.35, -0.3);
  root.add(leftBud);

  // Right Earbud: Floating gracefully on right
  const rightBud = createEarbud(true);
  rightBud.position.set(0.65, 1.05, 0.15);
  rightBud.rotation.set(-0.25, -0.4, 0.35);
  root.add(rightBud);

  // Animation references
  root.userData = {
    leftBud,
    rightBud,
    lidGroup,
    ledMesh,
    update(time) {
      // Gentle breathing levitation for earbuds
      leftBud.position.y = 0.95 + Math.sin(time * 1.5) * 0.04;
      leftBud.rotation.y = 0.35 + Math.cos(time * 1.2) * 0.05;

      rightBud.position.y = 1.05 + Math.sin(time * 1.5 + 1.2) * 0.04;
      rightBud.rotation.y = -0.4 + Math.cos(time * 1.2 + 1.2) * 0.05;

      // Subtle pulse on LED
      const pulse = (Math.sin(time * 3) + 1) * 0.5;
      ledMaterial.color.setRGB(0, 0.7 + pulse * 0.3, 1);
    }
  };

  return root;
}
