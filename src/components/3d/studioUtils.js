import * as THREE from 'three';

/**
 * Creates an ice-blue technology studio reflection environment texture.
 * Generates smooth high-dynamic-range gradients simulating softbox studio lights.
 */
export function createStudioEnvironment(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background: Deep ice-blue to soft navy gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#EAF5FF');
  bgGrad.addColorStop(0.3, '#D8ECFD');
  bgGrad.addColorStop(0.7, '#C2E0FA');
  bgGrad.addColorStop(1, '#A8D2F8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Studio Softbox 1: Overhead key softbox (Crisp pure white)
  const keySoftbox = ctx.createRadialGradient(512, 120, 10, 512, 120, 220);
  keySoftbox.addColorStop(0, 'rgba(255, 255, 255, 1)');
  keySoftbox.addColorStop(0.4, 'rgba(240, 248, 255, 0.85)');
  keySoftbox.addColorStop(0.8, 'rgba(200, 230, 255, 0.2)');
  keySoftbox.addColorStop(1, 'rgba(200, 230, 255, 0)');
  ctx.fillStyle = keySoftbox;
  ctx.fillRect(200, 0, 624, 300);

  // Studio Softbox 2: Left rim light (Glacial Tech sapphire blue)
  const rimLeft = ctx.createRadialGradient(150, 220, 5, 150, 220, 180);
  rimLeft.addColorStop(0, 'rgba(20, 92, 255, 0.9)');
  rimLeft.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
  rimLeft.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rimLeft;
  ctx.fillRect(0, 50, 350, 340);

  // Studio Softbox 3: Right warm-ice fill light
  const fillRight = ctx.createRadialGradient(880, 260, 5, 880, 260, 200);
  fillRight.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  fillRight.addColorStop(0.5, 'rgba(186, 230, 253, 0.5)');
  fillRight.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = fillRight;
  ctx.fillRect(680, 60, 344, 400);

  // Ground plane horizon reflection line
  ctx.fillStyle = 'rgba(225, 240, 255, 0.4)';
  ctx.fillRect(0, 380, 1024, 132);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  pmremGenerator.dispose();
  texture.dispose();

  return envMap;
}

/**
 * Creates studio lighting setup for the showroom
 */
export function setupStudioLighting(scene) {
  const lightsGroup = new THREE.Group();

  // 1. Ambient Light: Cool balanced fill
  const ambientLight = new THREE.AmbientLight(0xEAF5FF, 1.2);
  lightsGroup.add(ambientLight);

  // 2. Key Light: Crisp top-front directional light with soft shadow
  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.4);
  keyLight.position.set(3, 6, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 15;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.0005;
  lightsGroup.add(keyLight);

  // 3. Glacial Rim / Back Light: Adds the signature blue metallic edge reflection
  const rimLight = new THREE.DirectionalLight(0x145CFF, 2.8);
  rimLight.position.set(-4, 3, -4);
  lightsGroup.add(rimLight);

  // 4. Soft Bottom / Floor Fill
  const fillLight = new THREE.DirectionalLight(0xC2E0FA, 0.8);
  fillLight.position.set(0, -3, 2);
  lightsGroup.add(fillLight);

  scene.add(lightsGroup);
  return lightsGroup;
}

/**
 * Creates the brushed titanium & frosted glass showroom display podium
 */
export function createStudioPodium() {
  const podiumGroup = new THREE.Group();

  // Top platform cylinder: Frosted glass / ceramic top
  const topGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.12, 64);
  const topMat = new THREE.MeshPhysicalMaterial({
    color: 0xF0F7FF,
    roughness: 0.18,
    metalness: 0.05,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    transmission: 0.25,
    thickness: 0.8,
    reflectivity: 0.9
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.position.y = -0.06;
  topMesh.receiveShadow = true;
  podiumGroup.add(topMesh);

  // Titanium Bevel Ring: Brushed titanium edge
  const ringGeo = new THREE.TorusGeometry(2.2, 0.05, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xD2E4F4,
    metalness: 0.85,
    roughness: 0.25
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 0;
  podiumGroup.add(ringMesh);

  // Base Pedestal Cylinder
  const baseGeo = new THREE.CylinderGeometry(2.35, 2.5, 0.4, 64);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xDEEDFB,
    roughness: 0.35,
    metalness: 0.4
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.32;
  baseMesh.receiveShadow = true;
  podiumGroup.add(baseMesh);

  // Soft Studio Contact Shadow Plane
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const shadowGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
  shadowGrad.addColorStop(0, 'rgba(16, 38, 61, 0.45)');
  shadowGrad.addColorStop(0.4, 'rgba(20, 92, 255, 0.15)');
  shadowGrad.addColorStop(0.8, 'rgba(16, 38, 61, 0.04)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = shadowGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.53;
  podiumGroup.add(shadowPlane);

  return podiumGroup;
}
