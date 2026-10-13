import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, ShieldCheck, Zap } from 'lucide-react';

export default function Hero3D({ t }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // References to keep animation state across renders
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    animationFrameId: null,
    isPlaying: true,
    isInView: true,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    objects: {
      ribbon: null,
      ribbon2: null,
      phoneCase: null,
      charger: null,
      earbudsCase: null,
      earbudLeft: null,
      earbudRight: null,
      ledLight: null
    }
  });

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setIsPlaying(false);
      stateRef.current.isPlaying = false;
    }

    // Check WebGL availability
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xEAF5FF, 0.04);
    stateRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    stateRef.current.camera = camera;

    // 2. Renderer with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: window.devicePixelRatio < 2, // antialias on standard screens
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    stateRef.current.renderer = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xF0F7FF, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const blueRimLight = new THREE.PointLight(0x2563EB, 3.5, 12);
    blueRimLight.position.set(-4, -2, 3);
    scene.add(blueRimLight);

    const softFillLight = new THREE.PointLight(0x93C5FD, 2.0, 10);
    softFillLight.position.set(3, -3, 2);
    scene.add(softFillLight);

    // 4. Materials
    // Frosted Glass Material for loops
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xD0E7FF,
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.14,
      ior: 1.5,
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: 0xFFFFFF
    });

    const secondGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x93C5FD,
      transmission: 0.82,
      opacity: 0.95,
      transparent: true,
      roughness: 0.2,
      ior: 1.45,
      thickness: 0.8
    });

    // Case Material: Frosted Ice Polycarbonate
    const caseGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xE2F1FF,
      transmission: 0.85,
      roughness: 0.18,
      ior: 1.52,
      thickness: 0.6,
      transparent: true,
      opacity: 0.92
    });

    // Metallic Titanium Accent Material
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0xCBD5E1,
      metalness: 0.85,
      roughness: 0.25
    });

    // Dark Navy Contrast Material
    const navyAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x112A43,
      metalness: 0.4,
      roughness: 0.3
    });

    // 5. Procedural 3D Objects
    // A. Elegant Frosted Glass Loops/Ribbons
    const ribbonGeom = new THREE.TorusKnotGeometry(1.6, 0.12, 120, 16, 2, 3);
    const ribbonMesh = new THREE.Mesh(ribbonGeom, glassMaterial);
    ribbonMesh.position.set(0.4, 0.1, -1.2);
    ribbonMesh.scale.set(0.9, 0.9, 0.9);
    scene.add(ribbonMesh);
    stateRef.current.objects.ribbon = ribbonMesh;

    const ribbonGeom2 = new THREE.TorusGeometry(2.2, 0.08, 16, 80);
    const ribbonMesh2 = new THREE.Mesh(ribbonGeom2, secondGlassMaterial);
    ribbonMesh2.position.set(-0.2, -0.2, -1.8);
    ribbonMesh2.rotation.x = Math.PI / 3;
    scene.add(ribbonMesh2);
    stateRef.current.objects.ribbon2 = ribbonMesh2;

    // B. Frosted MagSafe Phone Case
    const phoneCaseGroup = new THREE.Group();
    // Main case body (smooth beveled rounded panel)
    const caseBodyGeom = new THREE.BoxGeometry(1.6, 3.2, 0.12);
    const caseBodyMesh = new THREE.Mesh(caseBodyGeom, caseGlassMaterial);
    phoneCaseGroup.add(caseBodyMesh);

    // MagSafe Ring
    const magSafeGeom = new THREE.RingGeometry(0.45, 0.54, 48);
    const magSafeMesh = new THREE.Mesh(magSafeGeom, titaniumMaterial);
    magSafeMesh.position.set(0, 0.1, 0.07);
    phoneCaseGroup.add(magSafeMesh);

    const magSafeLineGeom = new THREE.BoxGeometry(0.08, 0.35, 0.02);
    const magSafeLineMesh = new THREE.Mesh(magSafeLineGeom, titaniumMaterial);
    magSafeLineMesh.position.set(0, -0.55, 0.07);
    phoneCaseGroup.add(magSafeLineMesh);

    // Camera Bump
    const cameraBumpGeom = new THREE.BoxGeometry(0.7, 0.7, 0.12);
    const cameraBumpMesh = new THREE.Mesh(cameraBumpGeom, titaniumMaterial);
    cameraBumpMesh.position.set(-0.35, 1.1, 0.07);
    phoneCaseGroup.add(cameraBumpMesh);

    phoneCaseGroup.position.set(0.8, -0.2, 0.5);
    phoneCaseGroup.rotation.set(-0.15, -0.35, 0.1);
    phoneCaseGroup.scale.set(0.8, 0.8, 0.8);
    scene.add(phoneCaseGroup);
    stateRef.current.objects.phoneCase = phoneCaseGroup;

    // C. Compact GaN 65W Charger
    const chargerGroup = new THREE.Group();
    const chargerBodyGeom = new THREE.BoxGeometry(0.85, 0.95, 0.85);
    const chargerBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xEEF6FF,
      roughness: 0.22,
      metalness: 0.1,
      transmission: 0.4,
      transparent: true,
      opacity: 0.95
    });
    const chargerBodyMesh = new THREE.Mesh(chargerBodyGeom, chargerBodyMat);
    chargerGroup.add(chargerBodyMesh);

    // Prongs
    const prongGeom = new THREE.BoxGeometry(0.12, 0.35, 0.04);
    const prong1 = new THREE.Mesh(prongGeom, titaniumMaterial);
    prong1.position.set(-0.2, -0.58, 0);
    const prong2 = new THREE.Mesh(prongGeom, titaniumMaterial);
    prong2.position.set(0.2, -0.58, 0);
    chargerGroup.add(prong1);
    chargerGroup.add(prong2);

    // USB-C Ports face
    const portGeom = new THREE.BoxGeometry(0.28, 0.08, 0.02);
    const port1 = new THREE.Mesh(portGeom, navyAccentMaterial);
    port1.position.set(0, 0.2, 0.43);
    const port2 = new THREE.Mesh(portGeom, navyAccentMaterial);
    port2.position.set(0, -0.15, 0.43);
    chargerGroup.add(port1);
    chargerGroup.add(port2);

    chargerGroup.position.set(-1.4, -0.8, 0.8);
    chargerGroup.rotation.set(0.3, 0.45, -0.2);
    chargerGroup.scale.set(0.75, 0.75, 0.75);
    scene.add(chargerGroup);
    stateRef.current.objects.charger = chargerGroup;

    // D. Sleek Wireless Earbuds Case & Floating Buds
    const earbudsGroup = new THREE.Group();
    // Pebble charging case (squircle/cylinder)
    const casePebbleGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 32);
    const casePebbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAFDFF,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.96
    });
    const casePebbleMesh = new THREE.Mesh(casePebbleGeom, casePebbleMat);
    casePebbleMesh.rotation.x = Math.PI / 2;
    earbudsGroup.add(casePebbleMesh);

    // Glowing LED Dot on case
    const ledGeom = new THREE.SphereGeometry(0.04, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x2563EB });
    const ledMesh = new THREE.Mesh(ledGeom, ledMat);
    ledMesh.position.set(0, 0.26, 0.2);
    earbudsGroup.add(ledMesh);
    stateRef.current.objects.ledLight = ledMesh;

    // Earbud 1
    const budGroup1 = new THREE.Group();
    const budHeadGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const budHeadMesh = new THREE.Mesh(budHeadGeom, navyAccentMaterial);
    budGroup1.add(budHeadMesh);
    const stemGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
    const stemMesh = new THREE.Mesh(stemGeom, titaniumMaterial);
    stemMesh.position.set(0.08, -0.22, 0);
    stemMesh.rotation.z = -0.2;
    budGroup1.add(stemMesh);
    budGroup1.position.set(-0.35, 0.75, 0.2);
    budGroup1.rotation.set(0.2, 0.3, -0.1);
    earbudsGroup.add(budGroup1);
    stateRef.current.objects.earbudLeft = budGroup1;

    // Earbud 2
    const budGroup2 = budGroup1.clone();
    budGroup2.position.set(0.35, 0.65, 0.35);
    budGroup2.rotation.set(-0.2, -0.4, 0.15);
    earbudsGroup.add(budGroup2);
    stateRef.current.objects.earbudRight = budGroup2;

    earbudsGroup.position.set(-0.9, 0.9, 0.3);
    earbudsGroup.rotation.set(0.2, -0.2, 0.15);
    earbudsGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(earbudsGroup);
    stateRef.current.objects.earbudsCase = earbudsGroup;

    setIsLoaded(true);

    // 6. Pointer & Parallax tracking
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      stateRef.current.mouse.targetX = (x - 0.5) * 2;
      stateRef.current.mouse.targetY = (y - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !stateRef.current.renderer || !stateRef.current.camera) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      stateRef.current.camera.aspect = newWidth / newHeight;
      stateRef.current.camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Intersection Observer to halt WebGL off-screen
    const observer = new IntersectionObserver(([entry]) => {
      stateRef.current.isInView = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    // 9. Visibility Change listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stateRef.current.isInView = false;
      } else {
        stateRef.current.isInView = true;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      stateRef.current.animationFrameId = requestAnimationFrame(animate);

      if (!stateRef.current.isPlaying || !stateRef.current.isInView) {
        return;
      }

      const elapsedTime = clock.getElapsedTime();
      const { mouse, objects, camera } = stateRef.current;

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Subtle camera drift response (very subtle to preserve text legibility)
      camera.position.x = mouse.x * 0.25;
      camera.position.y = -mouse.y * 0.2;
      camera.lookAt(0, 0, 0);

      // Glass ribbon subtle continuous drift
      if (objects.ribbon) {
        objects.ribbon.rotation.x = elapsedTime * 0.12;
        objects.ribbon.rotation.y = elapsedTime * 0.18;
      }
      if (objects.ribbon2) {
        objects.ribbon2.rotation.z = -elapsedTime * 0.08;
      }

      // Phone Case gentle floating
      if (objects.phoneCase) {
        objects.phoneCase.position.y = -0.2 + Math.sin(elapsedTime * 0.9) * 0.08;
        objects.phoneCase.rotation.y = -0.35 + Math.sin(elapsedTime * 0.6) * 0.05 + mouse.x * 0.1;
      }

      // GaN Charger floating
      if (objects.charger) {
        objects.charger.position.y = -0.8 + Math.cos(elapsedTime * 1.1) * 0.09;
        objects.charger.rotation.x = 0.3 + Math.sin(elapsedTime * 0.8) * 0.06;
      }

      // Earbuds case floating & subtle pulsation
      if (objects.earbudsCase) {
        objects.earbudsCase.position.y = 0.9 + Math.sin(elapsedTime * 0.8 + 1.2) * 0.07;
      }
      if (objects.earbudLeft) {
        objects.earbudLeft.position.y = 0.75 + Math.sin(elapsedTime * 1.4) * 0.04;
      }
      if (objects.earbudRight) {
        objects.earbudRight.position.y = 0.65 + Math.cos(elapsedTime * 1.3) * 0.04;
      }

      // Render frame
      stateRef.current.renderer.render(scene, camera);
    };

    // Render initial static frame immediately
    renderer.render(scene, camera);

    if (!mediaQuery.matches) {
      animate();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  const toggleAnimation = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    stateRef.current.isPlaying = nextState;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] md:h-[500px] lg:h-[560px] flex items-center justify-center overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.7) 0%, rgba(220,238,254,0.3) 60%, transparent 100%)'
      }}
      aria-label="3D Interactive composition of mobile accessories"
    >
      {/* 3D WebGL Canvas */}
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ pointerEvents: 'none' }}
        />
      ) : (
        /* Static Refined Fallback */
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white/70 backdrop-blur-md rounded-3xl border border-blue-200/50 shadow-lg">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-inner">
            <ShieldCheck size={38} />
          </div>
          <h4 className="text-xl font-bold text-[#112A43]">Precision Optical Optics</h4>
          <p className="text-sm text-[#4B637B] max-w-xs mt-1">
            Engineered MagSafe protection, lossless acoustic drivers, and GaN power.
          </p>
        </div>
      )}

      {/* Floating Info Pill Over Hero 3D Scene */}
      <div
        className="absolute bottom-5 right-5 z-20 flex items-center gap-3 bg-white/85 backdrop-blur-xl border border-blue-200/60 shadow-lg rounded-full px-4 py-2 text-xs font-semibold text-[#112A43]"
        style={{
          boxShadow: '0 8px 24px -4px rgba(17, 42, 67, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
        }}
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline">65W GaN • MagSafe 15W • ANC</span>
        
        {/* Accessible Play/Pause Toggle */}
        <button
          onClick={toggleAnimation}
          className="flex items-center gap-1 ml-1 text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded-full hover:bg-blue-50 transition-colors"
          title={isPlaying ? t.motionPause : t.motionResume}
          aria-label={isPlaying ? t.motionPause : t.motionResume}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? t.motionPause : t.motionResume}</span>
        </button>
      </div>

      {/* Subtle Spec Chip */}
      <div className="absolute top-5 left-5 z-20 hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-lg border border-blue-100 px-3 py-1.5 rounded-full text-xs text-[#4B637B] font-medium shadow-sm">
        <Zap size={14} className="text-blue-600" />
        <span>Glacial Glassmorphic Edition</span>
      </div>
    </div>
  );
}
