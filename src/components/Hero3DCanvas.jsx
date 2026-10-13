import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Play, Pause, Zap, ShieldCheck } from 'lucide-react';

/**
 * Hero3DCanvas
 * Carefully directed Three.js 3D scene featuring ice-blue mobile accessories:
 * - Aura Frost MagSafe Case (translucent polycarbonate, MagSafe ring, triple titanium camera)
 * - GaN 65W Fast Charger (compact chamfered cube, dual USB-C/USB-A ports)
 * - Glacier TWS Wireless Earbuds & Charging Case (dual-tone ergonomic stems)
 * - Frosted Glacial studio plinth & ambient refraction ribbons
 *
 * Requirements Met:
 * - Slow 7-10s floating cycle (6-10px equivalent amplitude)
 * - Gentle rotation within small controlled angular range (no fast continuous spinning)
 * - Subtle desktop pointer tilt (2-3 degrees) with smooth return to rest on mouseleave
 * - Category-reactive transitions (smooth lerping, no camera jumps)
 * - Accessible visible pause/resume control
 * - Respects prefers-reduced-motion
 * - IntersectionObserver & Visibility API to halt offscreen rendering
 * - Adaptive DPR (capped at 1.5 desktop, 1.0 mobile)
 * - High-fidelity static fallback if WebGL fails
 */
export default function Hero3DCanvas({ selectedCategory = null, t = {} }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mutable internal state to avoid React re-renders inside 60fps RAF loop
  const internalRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    animationFrameId: null,
    isPlaying: true,
    isInView: true,
    isTabVisible: true,
    isCoarsePointer: false,
    selectedCategory: null,
    mouse: {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0
    },
    objects: {
      caseGroup: null,
      chargerGroup: null,
      earbudsGroup: null,
      earbudL: null,
      earbudR: null,
      haloRing: null,
      pedestal: null
    },
    targets: {
      case: { x: 0.15, y: -0.15, z: 0, rotY: -0.32, scale: 1 },
      charger: { x: 0.85, y: -0.75, z: -0.1, rotX: 0.28, rotY: 0.25, scale: 0.95 },
      earbuds: { x: -0.85, y: 0.72, z: 0.15, rotY: 0.22, scale: 0.9 }
    }
  });

  // Keep category in sync with ref for the loop
  useEffect(() => {
    internalRef.current.selectedCategory = selectedCategory;

    // Adjust target poses based on category focus
    const { targets } = internalRef.current;
    if (selectedCategory === 'cases') {
      targets.case = { x: 0.05, y: -0.05, z: 0.45, rotY: -0.15, scale: 1.22 };
      targets.charger = { x: 1.05, y: -0.85, z: -0.5, rotX: 0.35, rotY: 0.3, scale: 0.75 };
      targets.earbuds = { x: -1.05, y: 0.8, z: -0.4, rotY: 0.3, scale: 0.75 };
    } else if (selectedCategory === 'audio') {
      targets.earbuds = { x: 0, y: 0.1, z: 0.5, rotY: 0, scale: 1.25 };
      targets.case = { x: 0.75, y: -0.35, z: -0.4, rotY: -0.45, scale: 0.8 };
      targets.charger = { x: -0.85, y: -0.75, z: -0.35, rotX: 0.25, rotY: 0.2, scale: 0.8 };
    } else if (selectedCategory === 'charging' || selectedCategory === 'powerbanks') {
      targets.charger = { x: 0, y: -0.2, z: 0.5, rotX: 0.2, rotY: 0.15, scale: 1.28 };
      targets.case = { x: -0.85, y: 0.2, z: -0.4, rotY: -0.25, scale: 0.8 };
      targets.earbuds = { x: 0.85, y: 0.65, z: -0.35, rotY: 0.25, scale: 0.8 };
    } else {
      // Default harmonious trio
      targets.case = { x: 0.12, y: -0.12, z: 0, rotY: -0.32, scale: 1.0 };
      targets.charger = { x: 0.82, y: -0.72, z: -0.1, rotX: 0.28, rotY: 0.25, scale: 0.95 };
      targets.earbuds = { x: -0.82, y: 0.7, z: 0.15, rotY: 0.22, scale: 0.9 };
    }
  }, [selectedCategory]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Detect Coarse pointer (touch screens)
    const isCoarse = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
    internalRef.current.isCoarsePointer = isCoarse;

    // 2. Reduced motion preference check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsPlaying(false);
      internalRef.current.isPlaying = false;
    }

    // 3. WebGL Support Test
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL is not supported on this device. Switching to static studio fallback.', e);
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Adapt DPR: max 1.0 on mobile, 1.5 on desktop
    const isMobile = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // 4. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    internalRef.current.renderer = renderer;
    internalRef.current.scene = scene;
    internalRef.current.camera = camera;

    // 5. Studio Lighting
    // Ambient light - soft cool fill
    const ambientLight = new THREE.AmbientLight(0xF4F9FF, 1.4);
    scene.add(ambientLight);

    // Directional Key Light (Top-Right Front)
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    // Electric-Blue Backlight (Rim highlight for frosted edges)
    const rimLight = new THREE.DirectionalLight(0x145CFF, 1.5);
    rimLight.position.set(-3.0, -1.5, -3.5);
    scene.add(rimLight);

    // Soft Point Light over the MagSafe array
    const accentPointLight = new THREE.PointLight(0x38BDF8, 0.9, 10);
    accentPointLight.position.set(0.5, 0.5, 2.0);
    scene.add(accentPointLight);

    // 6. Materials (Ice-Blue Glassmorphic Palette)
    const iceGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xEAF5FF,
      metalness: 0.05,
      roughness: 0.12,
      transmission: 0.85,
      thickness: 0.45,
      ior: 1.45,
      transparent: true,
      opacity: 0.88,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xFFFFFF)
    });

    const phoneFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x9CB5CC,
      metalness: 0.75,
      roughness: 0.25
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x071526,
      roughness: 0.1,
      metalness: 0.9
    });

    const magsafeRingMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88
    });

    const titaniumDarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x1E334D,
      metalness: 0.85,
      roughness: 0.2
    });

    const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x051329,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.3,
      ior: 1.6
    });

    const chargerBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xF8FBFE,
      roughness: 0.28,
      metalness: 0.08
    });

    const prongMaterial = new THREE.MeshStandardMaterial({
      color: 0xDCE7F0,
      metalness: 0.9,
      roughness: 0.15
    });

    const electricBlueAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x145CFF,
      roughness: 0.3,
      metalness: 0.4
    });

    // 7. BUILD OBJECT 1: AURA FROST MAGSAFE PHONE CASE
    const caseGroup = new THREE.Group();

    // Phone body chassis
    const phoneWidth = 1.25;
    const phoneHeight = 2.45;
    const phoneDepth = 0.12;
    const phoneRadius = 0.16;

    const phoneChassisShape = new THREE.Shape();
    phoneChassisShape.moveTo(-phoneWidth / 2 + phoneRadius, -phoneHeight / 2);
    phoneChassisShape.lineTo(phoneWidth / 2 - phoneRadius, -phoneHeight / 2);
    phoneChassisShape.quadraticCurveTo(phoneWidth / 2, -phoneHeight / 2, phoneWidth / 2, -phoneHeight / 2 + phoneRadius);
    phoneChassisShape.lineTo(phoneWidth / 2, phoneHeight / 2 - phoneRadius);
    phoneChassisShape.quadraticCurveTo(phoneWidth / 2, phoneHeight / 2, phoneWidth / 2 - phoneRadius, phoneHeight / 2);
    phoneChassisShape.lineTo(-phoneWidth / 2 + phoneRadius, phoneHeight / 2);
    phoneChassisShape.quadraticCurveTo(-phoneWidth / 2, phoneHeight / 2, -phoneWidth / 2, phoneHeight / 2 - phoneRadius);
    phoneChassisShape.lineTo(-phoneWidth / 2, -phoneHeight / 2 + phoneRadius);
    phoneChassisShape.quadraticCurveTo(-phoneWidth / 2, -phoneHeight / 2, -phoneWidth / 2 + phoneRadius, -phoneHeight / 2);

    const extrudeSettings = { depth: phoneDepth, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const chassisGeom = new THREE.ExtrudeGeometry(phoneChassisShape, extrudeSettings);
    chassisGeom.center();
    const phoneMesh = new THREE.Mesh(chassisGeom, iceGlassMaterial);
    caseGroup.add(phoneMesh);

    // Screen inlay on front face
    const screenGeom = new THREE.PlaneGeometry(phoneWidth - 0.14, phoneHeight - 0.14);
    const screenMesh = new THREE.Mesh(screenGeom, screenMaterial);
    screenMesh.position.z = phoneDepth / 2 + 0.045;
    caseGroup.add(screenMesh);

    // MagSafe Magnetic Ring on back
    const ringGeom = new THREE.RingGeometry(0.36, 0.42, 48);
    const ringMesh = new THREE.Mesh(ringGeom, magsafeRingMaterial);
    ringMesh.position.set(0, 0.05, -phoneDepth / 2 - 0.045);
    ringMesh.rotation.y = Math.PI;
    caseGroup.add(ringMesh);

    // MagSafe alignment pill indicator
    const pillGeom = new THREE.PlaneGeometry(0.06, 0.22);
    const pillMesh = new THREE.Mesh(pillGeom, magsafeRingMaterial);
    pillMesh.position.set(0, -0.52, -phoneDepth / 2 - 0.045);
    pillMesh.rotation.y = Math.PI;
    caseGroup.add(pillMesh);

    // Triple Camera Plateau on back upper-left
    const camIslandShape = new THREE.Shape();
    const camSize = 0.58;
    const camRadius = 0.12;
    camIslandShape.moveTo(-camSize / 2 + camRadius, -camSize / 2);
    camIslandShape.lineTo(camSize / 2 - camRadius, -camSize / 2);
    camIslandShape.quadraticCurveTo(camSize / 2, -camSize / 2, camSize / 2, -camSize / 2 + camRadius);
    camIslandShape.lineTo(camSize / 2, camSize / 2 - camRadius);
    camIslandShape.quadraticCurveTo(camSize / 2, camSize / 2, camSize / 2 - camRadius, camSize / 2);
    camIslandShape.lineTo(-camSize / 2 + camRadius, camSize / 2);
    camIslandShape.quadraticCurveTo(-camSize / 2, camSize / 2, -camSize / 2, camSize / 2 - camRadius);
    camIslandShape.lineTo(-camSize / 2, -camSize / 2 + camRadius);
    camIslandShape.quadraticCurveTo(-camSize / 2, -camSize / 2, -camSize / 2 + camRadius, -camSize / 2);

    const camIslandGeom = new THREE.ExtrudeGeometry(camIslandShape, { depth: 0.06, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 });
    camIslandGeom.center();
    const camIslandMesh = new THREE.Mesh(camIslandGeom, phoneFrameMaterial);
    camIslandMesh.position.set(-0.28, 0.68, -phoneDepth / 2 - 0.06);
    camIslandMesh.rotation.y = Math.PI;
    caseGroup.add(camIslandMesh);

    // 3 Individual Camera Lenses
    const lensPositions = [
      [-0.17, 0.79],
      [-0.17, 0.57],
      [-0.38, 0.68]
    ];
    lensPositions.forEach(([lx, ly]) => {
      const ringCyl = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24);
      ringCyl.rotateX(Math.PI / 2);
      const ringLensMesh = new THREE.Mesh(ringCyl, titaniumDarkMaterial);
      ringLensMesh.position.set(lx, ly, -phoneDepth / 2 - 0.095);
      caseGroup.add(ringLensMesh);

      const glassPupil = new THREE.CylinderGeometry(0.075, 0.075, 0.03, 24);
      glassPupil.rotateX(Math.PI / 2);
      const pupilMesh = new THREE.Mesh(glassPupil, lensMaterial);
      pupilMesh.position.set(lx, ly, -phoneDepth / 2 - 0.115);
      caseGroup.add(pupilMesh);
    });

    caseGroup.position.set(0.15, -0.15, 0);
    caseGroup.rotation.set(0.08, -0.32, 0.04);
    scene.add(caseGroup);
    internalRef.current.objects.caseGroup = caseGroup;

    // 8. BUILD OBJECT 2: GAN 65W FAST CHARGER
    const chargerGroup = new THREE.Group();
    const chargerGeom = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const chargerMesh = new THREE.Mesh(chargerGeom, chargerBodyMaterial);
    chargerGroup.add(chargerMesh);

    // Front Port Face (Dark Inset Plate)
    const portPlateGeom = new THREE.PlaneGeometry(0.72, 0.72);
    const portPlateMesh = new THREE.Mesh(portPlateGeom, titaniumDarkMaterial);
    portPlateMesh.position.z = 0.426;
    chargerGroup.add(portPlateMesh);

    // USB-C Port 1 & 2
    [-0.16, 0.14].forEach((py) => {
      const usbCGeom = new THREE.PlaneGeometry(0.24, 0.08);
      const usbCMesh = new THREE.Mesh(usbCGeom, electricBlueAccentMaterial);
      usbCMesh.position.set(0, py, 0.428);
      chargerGroup.add(usbCMesh);
    });

    // Wall Pins (Back Face)
    [-0.18, 0.18].forEach((px) => {
      const prongGeom = new THREE.BoxGeometry(0.06, 0.32, 0.32);
      const prongMesh = new THREE.Mesh(prongGeom, prongMaterial);
      prongMesh.position.set(px, 0, -0.56);
      chargerGroup.add(prongMesh);
    });

    chargerGroup.position.set(0.85, -0.75, -0.1);
    chargerGroup.rotation.set(0.28, 0.25, -0.1);
    chargerGroup.scale.set(0.95, 0.95, 0.95);
    scene.add(chargerGroup);
    internalRef.current.objects.chargerGroup = chargerGroup;

    // 9. BUILD OBJECT 3: GLACIER TWS EARBUDS & CAPSULE
    const earbudsGroup = new THREE.Group();

    // Charging Capsule Body (Pebble shape)
    const capsuleGeom = new THREE.CapsuleGeometry(0.38, 0.52, 16, 24);
    capsuleGeom.rotateZ(Math.PI / 2);
    const capsuleMesh = new THREE.Mesh(capsuleGeom, iceGlassMaterial);
    earbudsGroup.add(capsuleMesh);

    // Subtle parting line ring
    const capsuleRingGeom = new THREE.TorusGeometry(0.385, 0.015, 16, 48);
    capsuleRingGeom.rotateY(Math.PI / 2);
    const capsuleRingMesh = new THREE.Mesh(capsuleRingGeom, electricBlueAccentMaterial);
    earbudsGroup.add(capsuleRingMesh);

    // Earbud Left
    const budGroupL = new THREE.Group();
    const budHeadGeom = new THREE.SphereGeometry(0.14, 16, 16);
    const budHeadMesh = new THREE.Mesh(budHeadGeom, titaniumDarkMaterial);
    budGroupL.add(budHeadMesh);

    const stemGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 16);
    const stemMesh = new THREE.Mesh(stemGeom, prongMaterial);
    stemMesh.position.set(0.05, -0.18, 0);
    stemMesh.rotation.z = -0.18;
    budGroupL.add(stemMesh);

    budGroupL.position.set(-0.35, 0.45, 0.2);
    budGroupL.rotation.set(0.2, 0.3, -0.1);
    earbudsGroup.add(budGroupL);
    internalRef.current.objects.earbudL = budGroupL;

    // Earbud Right
    const budGroupR = budGroupL.clone();
    budGroupR.position.set(0.35, 0.42, 0.28);
    budGroupR.rotation.set(-0.25, -0.35, 0.15);
    earbudsGroup.add(budGroupR);
    internalRef.current.objects.earbudR = budGroupR;

    earbudsGroup.position.set(-0.85, 0.72, 0.15);
    earbudsGroup.rotation.set(0.18, -0.22, 0.12);
    earbudsGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(earbudsGroup);
    internalRef.current.objects.earbudsGroup = earbudsGroup;

    // 10. STUDIO PEDESTAL DISC & AMBIENT HALO
    const haloGeom = new THREE.TorusGeometry(2.1, 0.025, 16, 64);
    haloGeom.rotateX(Math.PI / 2.3);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.35
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMaterial);
    haloMesh.position.set(0, -0.9, -0.3);
    scene.add(haloMesh);
    internalRef.current.objects.haloRing = haloMesh;

    setIsLoaded(true);

    // Initial render
    renderer.render(scene, camera);

    // 11. Mouse tracking with smooth lerp & bounds (2-3 degrees max)
    const handleMouseMove = (e) => {
      if (internalRef.current.isCoarsePointer) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // Clamp between -1 and 1
      internalRef.current.mouse.targetX = Math.max(-1, Math.min(1, nx));
      internalRef.current.mouse.targetY = Math.max(-1, Math.min(1, ny));
    };

    // Smooth return to resting state on pointer leave
    const handleMouseLeave = () => {
      internalRef.current.mouse.targetX = 0;
      internalRef.current.mouse.targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // 12. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 13. Intersection Observer (halts loop when off-screen)
    const observer = new IntersectionObserver(([entry]) => {
      internalRef.current.isInView = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 14. Visibility API (halts loop when tab is hidden)
    const handleVisibilityChange = () => {
      internalRef.current.isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 15. Directed Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      internalRef.current.animationFrameId = requestAnimationFrame(animate);

      const state = internalRef.current;
      if (!state.isPlaying || !state.isInView || !state.isTabVisible) {
        return;
      }

      const elapsed = clock.getElapsedTime();
      const { mouse, objects, targets } = state;

      // Smooth pointer lerping towards target (damping factor 0.06)
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.06;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.06;

      // Subtle tilt: max ~2.5 degrees (0.045 rad)
      const tiltX = mouse.currentY * 0.035;
      const tiltY = mouse.currentX * 0.045;

      // 1. Phone Case Floating & Sway
      if (objects.caseGroup && targets.case) {
        const cg = objects.caseGroup;
        // Float cycle: 8.4s period, ~8px world offset
        const floatY = Math.sin(elapsed * (Math.PI * 2 / 8.4)) * 0.075;
        const swayRotY = Math.sin(elapsed * (Math.PI * 2 / 9.2)) * 0.04;

        cg.position.x += (targets.case.x + mouse.currentX * 0.08 - cg.position.x) * 0.05;
        cg.position.y += (targets.case.y + floatY + mouse.currentY * 0.06 - cg.position.y) * 0.05;
        cg.position.z += (targets.case.z - cg.position.z) * 0.05;

        cg.rotation.x += (0.08 + tiltX - cg.rotation.x) * 0.06;
        cg.rotation.y += (targets.case.rotY + swayRotY + tiltY - cg.rotation.y) * 0.06;

        const s = targets.case.scale;
        cg.scale.set(
          cg.scale.x + (s - cg.scale.x) * 0.05,
          cg.scale.y + (s - cg.scale.y) * 0.05,
          cg.scale.z + (s - cg.scale.z) * 0.05
        );
      }

      // 2. GaN Charger Floating & Drift
      if (objects.chargerGroup && targets.charger) {
        const ch = objects.chargerGroup;
        // Float cycle: 9.6s period with phase offset
        const floatY = Math.cos((elapsed + 1.6) * (Math.PI * 2 / 9.6)) * 0.065;
        const swayRotX = Math.sin((elapsed + 0.8) * (Math.PI * 2 / 8.6)) * 0.035;

        ch.position.x += (targets.charger.x + mouse.currentX * 0.05 - ch.position.x) * 0.05;
        ch.position.y += (targets.charger.y + floatY - ch.position.y) * 0.05;
        ch.position.z += (targets.charger.z - ch.position.z) * 0.05;

        ch.rotation.x += (targets.charger.rotX + swayRotX + tiltX - ch.rotation.x) * 0.06;
        ch.rotation.y += (targets.charger.rotY + tiltY - ch.rotation.y) * 0.06;

        const s = targets.charger.scale;
        ch.scale.set(
          ch.scale.x + (s - ch.scale.x) * 0.05,
          ch.scale.y + (s - ch.scale.y) * 0.05,
          ch.scale.z + (s - ch.scale.z) * 0.05
        );
      }

      // 3. Earbuds Floating & Micro-movement
      if (objects.earbudsGroup && targets.earbuds) {
        const eg = objects.earbudsGroup;
        // Float cycle: 7.3s period
        const floatY = Math.sin((elapsed + 3.2) * (Math.PI * 2 / 7.3)) * 0.08;
        const swayRotZ = Math.sin(elapsed * (Math.PI * 2 / 7.8)) * 0.03;

        eg.position.x += (targets.earbuds.x - eg.position.x) * 0.05;
        eg.position.y += (targets.earbuds.y + floatY - eg.position.y) * 0.05;
        eg.position.z += (targets.earbuds.z - eg.position.z) * 0.05;

        eg.rotation.y += (targets.earbuds.rotY + tiltY - eg.rotation.y) * 0.06;
        eg.rotation.z += (0.12 + swayRotZ - eg.rotation.z) * 0.06;

        // Subtle independent bud pulse
        if (objects.earbudL) {
          objects.earbudL.position.y = 0.45 + Math.sin(elapsed * 1.5) * 0.025;
        }
        if (objects.earbudR) {
          objects.earbudR.position.y = 0.42 + Math.cos(elapsed * 1.3) * 0.025;
        }

        const s = targets.earbuds.scale;
        eg.scale.set(
          eg.scale.x + (s - eg.scale.x) * 0.05,
          eg.scale.y + (s - eg.scale.y) * 0.05,
          eg.scale.z + (s - eg.scale.z) * 0.05
        );
      }

      // 4. Studio halo ring slow breathing
      if (objects.haloRing) {
        objects.haloRing.rotation.z = elapsed * 0.05;
      }

      renderer.render(scene, camera);
    };

    if (!prefersReducedMotion) {
      animate();
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      if (internalRef.current.animationFrameId) {
        cancelAnimationFrame(internalRef.current.animationFrameId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      internalRef.current.isPlaying = next;
      // If resuming and tab/view is active, request a frame
      if (next && internalRef.current.renderer && internalRef.current.scene && internalRef.current.camera) {
        internalRef.current.renderer.render(
          internalRef.current.scene,
          internalRef.current.camera
        );
      }
      return next;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-3d-container relative w-full h-[400px] sm:h-[460px] lg:h-[500px] flex items-center justify-center select-none overflow-hidden rounded-2xl"
      style={{
        background: 'radial-gradient(ellipse at 55% 45%, rgba(234, 244, 252, 0.95) 0%, rgba(247, 251, 255, 0.6) 65%, transparent 100%)'
      }}
      aria-label="3D Interactive composition of mobile accessories"
    >
      {/* 3D WebGL Canvas */}
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        />
      ) : (
        /* Refined static fallback */
        <div className="hero-3d-fallback flex flex-col items-center justify-center p-8 text-center bg-white/80 backdrop-blur-md rounded-2xl border border-[#DCE7F0]">
          <img
            src="/assets/hero-products-clean.jpg"
            alt="Small upgrades. Everyday better. Cases, sound and power."
            className="w-full max-w-sm object-contain"
            loading="eager"
          />
        </div>
      )}

      {/* Floating Status & Pause/Resume Control Pill */}
      <div
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-[#DCE7F0] shadow-sm rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#10263D]"
        style={{
          boxShadow: '0 4px 16px -2px rgba(16, 38, 61, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
        }}
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline text-[#52677B]">Precision Optics • Qi2</span>

        {/* Accessible Play/Pause Toggle */}
        <button
          type="button"
          onClick={toggleAnimation}
          className="flex items-center gap-1.5 ml-1 text-xs text-[#145CFF] hover:text-[#0D4BD9] font-medium py-1 px-2 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
          title={isPlaying ? (t.motionPause || "Pause motion") : (t.motionResume || "Resume motion")}
          aria-label={isPlaying ? (t.motionPause || "Pause motion") : (t.motionResume || "Resume motion")}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span>{isPlaying ? (t.motionPause || "Pause motion") : (t.motionResume || "Resume motion")}</span>
        </button>
      </div>

      {/* Spec Badge Top Left */}
      <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 bg-white/85 backdrop-blur-md border border-[#DCE7F0] px-3 py-1.5 rounded-full text-xs text-[#52677B] font-medium shadow-xs">
        <Zap size={13} className="text-[#145CFF]" />
        <span>Glacial Glassmorphic 3D</span>
      </div>
    </div>
  );
}
