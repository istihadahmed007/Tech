import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createStudioEnvironment, setupStudioLighting, createStudioPodium } from './studioUtils';
import { createTwsModel } from './models/TwsModel';
import { createWatchModel } from './models/WatchModel';
import { createChargerModel } from './models/ChargerModel';
import { RotateCw, Sparkles, Eye, Check } from 'lucide-react';

export default function Hero3DCanvas({
  activeProductType = 'audio', // 'audio' | 'wearables' | 'charging'
  onSelectProductType,
  lang = 'en'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // User Interactive State
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeColor, setActiveColor] = useState('white');
  const [isInteracting, setIsInteracting] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Three.js internal references
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const currentModelRef = useRef(null);
  const podiumRef = useRef(null);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Interaction & Rotation trackers
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const modelRotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const scrollOffsetRef = useRef(0);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Check WebGL availability safely
  const checkWebGL = () => {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };

  // Switch or rebuild active 3D Model
  const loadModel = useCallback((type, color) => {
    if (!sceneRef.current) return;

    if (currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
      // Clean up geometries and materials
      currentModelRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }

    let newModel;
    if (type === 'wearables') {
      newModel = createWatchModel(color === 'black' ? 'black' : 'silver');
    } else if (type === 'charging') {
      newModel = createChargerModel(color === 'black' ? 'black' : 'silver');
    } else {
      newModel = createTwsModel(color === 'black' ? 'black' : 'white');
    }

    newModel.position.set(0, 0, 0);
    sceneRef.current.add(newModel);
    currentModelRef.current = newModel;

    // Reset rotation targets smoothly
    targetRotationRef.current = { x: 0.1, y: 0.2 };
    modelRotationRef.current = { x: 0.1, y: 0.2 };
  }, []);

  // Update model when product type or color changes
  useEffect(() => {
    loadModel(activeProductType, activeColor);
  }, [activeProductType, activeColor, loadModel]);

  // Main Three.js Setup & Animation Loop
  useEffect(() => {
    if (!checkWebGL()) {
      setWebglSupported(false);
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Cinematic angle
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.4, 4.6);
    camera.lookAt(0, 0.45, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and capped DPR for high performance
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Studio Environment & Lighting
    const envMap = createStudioEnvironment(renderer);
    scene.environment = envMap;
    setupStudioLighting(scene);

    // 5. Studio Display Podium
    const podium = createStudioPodium();
    scene.add(podium);
    podiumRef.current = podium;

    // 6. Initial Model Load
    loadModel(activeProductType, activeColor);
    setIsLoading(false);

    // 7. Scroll-driven camera and rotation response
    const handleScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height || 1)));
      scrollOffsetRef.current = progress;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 8. Visibility observer to pause rendering when out of view
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 9. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsedTime = clock.getElapsedTime();

      // Auto-turntable spin when not dragging
      if (autoRotateRef.current && !isDraggingRef.current && !prefersReducedMotion) {
        targetRotationRef.current.y += 0.007;
      }

      // Smooth dampening towards target rotation
      modelRotationRef.current.x += (targetRotationRef.current.x - modelRotationRef.current.x) * 0.08;
      modelRotationRef.current.y += (targetRotationRef.current.y - modelRotationRef.current.y) * 0.08;

      if (currentModelRef.current) {
        currentModelRef.current.rotation.x = modelRotationRef.current.x;
        currentModelRef.current.rotation.y = modelRotationRef.current.y;

        // Model internal animation (floating buds, LED pulse, etc.)
        if (currentModelRef.current.userData && typeof currentModelRef.current.userData.update === 'function') {
          currentModelRef.current.userData.update(elapsedTime);
        }
      }

      // Smooth scroll camera dolly
      const scrollProgress = scrollOffsetRef.current;
      if (!prefersReducedMotion) {
        camera.position.y = 1.4 + scrollProgress * 0.8;
        camera.position.z = 4.6 - scrollProgress * 0.6;
        camera.lookAt(0, 0.45 - scrollProgress * 0.2, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (envMap) envMap.dispose();
      if (renderer) renderer.dispose();
    };
  }, [loadModel]);

  // Touch and Mouse Interaction Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    previousMousePosRef.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0].clientY) || 0
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = clientX - previousMousePosRef.current.x;
    const deltaY = clientY - previousMousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.009;
    targetRotationRef.current.x = Math.max(-0.4, Math.min(0.6, targetRotationRef.current.x + deltaY * 0.008));

    previousMousePosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => setIsInteracting(false), 800);
  };

  // Reset 3D view
  const handleResetView = () => {
    targetRotationRef.current = { x: 0.1, y: 0.2 };
    modelRotationRef.current = { x: 0.1, y: 0.2 };
  };

  if (!webglSupported) {
    return (
      <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#EAF5FF] to-[#D8ECFD] rounded-2xl border border-[#DCE7F0] text-center">
        <img
          src="/assets/products/p01-pro-tws-white.jpg"
          alt="Glacial Tech TWS"
          className="w-48 h-48 object-contain mb-4 drop-shadow-md"
        />
        <h4 className="text-sm font-bold text-[#10263D] mb-1">Glacial Tech Studio</h4>
        <p className="text-xs text-[#52677B]">Interactive 3D preview requires WebGL support.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F0F8FF]/80 via-[#E4F2FD]/60 to-[#DBEEFC]/90 select-none cursor-grab active:cursor-grabbing border border-[#D8E8F5]/80 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_12px_32px_-8px_rgba(20,92,255,0.08)]"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      role="region"
      aria-label="Interactive 3D Product Showcase"
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block max-w-full"
        style={{ width: '100%', height: '100%', maxWidth: '100%' }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#EAF5FF]/80 backdrop-blur-xs">
          <div className="w-8 h-8 rounded-full border-2 border-[#145CFF] border-t-transparent animate-spin" />
        </div>
      )}

      {/* Floating Top Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#D0E2F2] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#145CFF] animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider text-[#10263D] uppercase">
            {lang === 'bn' ? 'রিয়েল-টাইম ৩ডি শোরুম' : 'Real-Time 3D Studio'}
          </span>
        </div>
      </div>

      {/* Model Selector Tabs (Audio, Watch, Charging) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-[#D0E2F2] shadow-xs pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProductType && onSelectProductType('audio');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeProductType === 'audio'
              ? 'bg-[#145CFF] text-white shadow-xs'
              : 'text-[#52677B] hover:text-[#10263D] hover:bg-blue-50/60'
          }`}
        >
          {lang === 'bn' ? 'টিডব্লিউএস অডিও' : 'ANC TWS'}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProductType && onSelectProductType('wearables');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeProductType === 'wearables'
              ? 'bg-[#145CFF] text-white shadow-xs'
              : 'text-[#52677B] hover:text-[#10263D] hover:bg-blue-50/60'
          }`}
        >
          {lang === 'bn' ? 'স্মার্টওয়াচ' : 'Ultra Watch'}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProductType && onSelectProductType('charging');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeProductType === 'charging'
              ? 'bg-[#145CFF] text-white shadow-xs'
              : 'text-[#52677B] hover:text-[#10263D] hover:bg-blue-50/60'
          }`}
        >
          {lang === 'bn' ? 'ফাস্ট চার্জার' : '65W GaN'}
        </button>
      </div>

      {/* Interactive Helper Hint (Fade out on drag) */}
      <div
        className={`absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-[#DCE7F0] shadow-xs transition-opacity duration-300 pointer-events-none ${
          isInteracting ? 'opacity-0' : 'opacity-90'
        }`}
      >
        <Eye size={13} className="text-[#145CFF]" />
        <span className="text-[11px] font-medium text-[#52677B]">
          {lang === 'bn' ? 'ঘোরাতে ড্র্যাগ করুন • ৩৬০° পরীক্ষা' : 'Drag to rotate 360° • Inspect details'}
        </span>
      </div>

      {/* Floating Bottom Toolbar (Turntable Toggle & Color Variants) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-[#D0E2F2] shadow-xs pointer-events-auto">
        {/* Color Variant Switcher */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-[#E2E8F0]">
          <button
            type="button"
            title="Glacier White / Titanium"
            onClick={(e) => {
              e.stopPropagation();
              setActiveColor('white');
            }}
            className={`w-5 h-5 rounded-full border-2 transition-transform ${
              activeColor === 'white'
                ? 'border-[#145CFF] scale-110 shadow-xs'
                : 'border-slate-300 opacity-70 hover:opacity-100'
            } bg-[#F8FAFC]`}
          />
          <button
            type="button"
            title="Obsidian Matte Black"
            onClick={(e) => {
              e.stopPropagation();
              setActiveColor('black');
            }}
            className={`w-5 h-5 rounded-full border-2 transition-transform ${
              activeColor === 'black'
                ? 'border-[#145CFF] scale-110 shadow-xs'
                : 'border-slate-300 opacity-70 hover:opacity-100'
            } bg-[#1E293B]`}
          />
        </div>

        {/* Auto-Rotate Turntable Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setAutoRotate(prev => !prev);
          }}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            autoRotate
              ? 'bg-blue-50 text-[#145CFF]'
              : 'text-[#64748B] hover:text-[#10263D] hover:bg-slate-100'
          }`}
          title={autoRotate ? 'Pause 360° Spin' : 'Resume 360° Spin'}
        >
          <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
          <span className="text-[11px] font-medium hidden sm:inline">
            {autoRotate ? 'Spinning' : 'Paused'}
          </span>
        </button>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleResetView();
          }}
          className="px-2 py-1 rounded-lg text-[11px] font-semibold text-[#52677B] hover:text-[#10263D] hover:bg-slate-100 transition-colors"
          title="Reset View"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
