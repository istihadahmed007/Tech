import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createStudioEnvironment, setupStudioLighting, createStudioPodium } from './3d/studioUtils';
import { createTwsModel } from './3d/models/TwsModel';
import { createWatchModel } from './3d/models/WatchModel';
import { createChargerModel } from './3d/models/ChargerModel';
import { RotateCw, Maximize2, Minimize2, Image as ImageIcon, Sparkles, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * Checks if a given product has an accurate 3D model available.
 */
export function hasProduct3DModel(product) {
  if (!product || !product.id) return false;
  const id = product.id.toLowerCase();
  const cat = (product.category || '').toLowerCase();

  // Known modeled product IDs or categories
  if (
    id.includes('tws') ||
    id.includes('h2-anc') ||
    id.includes('ultrapods') ||
    id.includes('watch') ||
    id.includes('y80') ||
    id.includes('t800') ||
    id.includes('laxasfit') ||
    id.includes('cable') ||
    id.includes('charger') ||
    id.includes('recrsi') ||
    id.includes('remax')
  ) {
    return true;
  }

  return cat === 'audio' || cat === 'wearables' || cat === 'charging';
}

export default function Product3DViewer({
  product,
  selectedVariant = null,
  onClose3D,
  lang = 'en'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [webglSupported, setWebglSupported] = useState(true);

  // Three.js internal references
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const currentModelRef = useRef(null);
  const animFrameRef = useRef(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const modelRotationRef = useRef({ x: 0.1, y: 0.2 });
  const targetRotationRef = useRef({ x: 0.1, y: 0.2 });
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Determine model type and color from product
  const getModelSpec = useCallback(() => {
    const id = (product?.id || '').toLowerCase();
    const cat = (product?.category || '').toLowerCase();
    const variantName = (selectedVariant?.name || '').toLowerCase();

    let color = 'white';
    if (variantName.includes('black') || id.includes('black')) {
      color = 'black';
    } else if (variantName.includes('silver') || variantName.includes('gray') || id.includes('silver')) {
      color = 'silver';
    } else if (variantName.includes('orange')) {
      color = 'orange';
    }

    let type = 'audio';
    if (cat === 'wearables' || id.includes('watch') || id.includes('y80') || id.includes('t800')) {
      type = 'wearables';
    } else if (cat === 'charging' || id.includes('cable') || id.includes('charger') || id.includes('recrsi') || id.includes('remax')) {
      type = 'charging';
    }

    return { type, color };
  }, [product, selectedVariant]);

  // Load appropriate 3D model
  const loadProductModel = useCallback(() => {
    if (!sceneRef.current) return;

    if (currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
      currentModelRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
            else child.material.dispose();
          }
        }
      });
    }

    const { type, color } = getModelSpec();
    let model;
    if (type === 'wearables') {
      model = createWatchModel(color);
    } else if (type === 'charging') {
      model = createChargerModel(color);
    } else {
      model = createTwsModel(color);
    }

    model.position.set(0, 0, 0);
    sceneRef.current.add(model);
    currentModelRef.current = model;
  }, [getModelSpec]);

  // Update model when variant changes
  useEffect(() => {
    loadProductModel();
  }, [selectedVariant, loadProductModel]);

  // Three.js Mount & Animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 4.2);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
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
      renderer.toneMappingExposure = 1.2;
      rendererRef.current = renderer;
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    // 4. Studio Environment & Lighting
    const envMap = createStudioEnvironment(renderer);
    scene.environment = envMap;
    setupStudioLighting(scene);

    // 5. Studio Display Podium
    const podium = createStudioPodium();
    scene.add(podium);

    // 6. Initial Model Load
    loadProductModel();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.008;
      }

      modelRotationRef.current.x += (targetRotationRef.current.x - modelRotationRef.current.x) * 0.08;
      modelRotationRef.current.y += (targetRotationRef.current.y - modelRotationRef.current.y) * 0.08;

      if (currentModelRef.current) {
        currentModelRef.current.rotation.x = modelRotationRef.current.x;
        currentModelRef.current.rotation.y = modelRotationRef.current.y;
        if (currentModelRef.current.userData?.update) {
          currentModelRef.current.userData.update(elapsedTime);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      if (envMap) envMap.dispose();
      if (renderer) renderer.dispose();
    };
  }, [loadProductModel]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
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
    targetRotationRef.current.x = Math.max(-0.6, Math.min(0.7, targetRotationRef.current.x + deltaY * 0.008));

    previousMousePosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Zoom Handler
  const handleWheel = (e) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const delta = e.deltaY * 0.002;
    const newZ = Math.max(2.5, Math.min(6.5, cameraRef.current.position.z + delta));
    cameraRef.current.position.z = newZ;
    setZoomLevel(Number(((4.2 / newZ) * 100).toFixed(0)));
  };

  const adjustZoom = (factor) => {
    if (!cameraRef.current) return;
    const newZ = Math.max(2.5, Math.min(6.5, cameraRef.current.position.z * factor));
    cameraRef.current.position.z = newZ;
    setZoomLevel(Number(((4.2 / newZ) * 100).toFixed(0)));
  };

  const handleResetView = () => {
    targetRotationRef.current = { x: 0.1, y: 0.2 };
    modelRotationRef.current = { x: 0.1, y: 0.2 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 1.2, 4.2);
      cameraRef.current.lookAt(0, 0.4, 0);
      setZoomLevel(100);
    }
  };

  if (!webglSupported) {
    return (
      <div className="w-full aspect-square flex flex-col items-center justify-center p-8 bg-blue-50/40 rounded-2xl border border-[#DCE7F0] text-center">
        <p className="text-sm text-[#52677B] mb-4">3D hardware acceleration is unavailable on this device.</p>
        <button
          type="button"
          onClick={onClose3D}
          className="px-4 py-2 rounded-xl bg-[#145CFF] text-white text-xs font-semibold"
        >
          Return to Photo Gallery
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className={`relative w-full max-w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#F2F8FD] to-[#E2F0FC] select-none cursor-grab active:cursor-grabbing border border-[#D8E8F5] shadow-xs ${
        isFullscreen ? 'fixed inset-4 z-50 aspect-auto h-auto shadow-2xl border-2 border-[#145CFF]' : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block max-w-full"
        style={{ width: '100%', height: '100%', maxWidth: '100%' }}
      />

      {/* Top Floating Bar: Status and Close */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#DCE7F0] shadow-xs pointer-events-auto">
          <Sparkles size={13} className="text-[#145CFF]" />
          <span className="text-[11px] font-bold text-[#10263D] tracking-wide uppercase">
            {lang === 'bn' ? 'ইন্টারেক্টিভ ৩ডি ভিউ' : 'Interactive 3D'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose3D}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#10263D] text-xs font-semibold shadow-xs border border-[#DCE7F0] transition-colors pointer-events-auto"
        >
          <ImageIcon size={13} className="text-[#145CFF]" />
          <span>{lang === 'bn' ? 'ছবি দেখুন' : 'Back to Photos'}</span>
        </button>
      </div>

      {/* Bottom Floating Toolbar: Orbit, Reset, Zoom */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* Reset View */}
        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[11px] font-semibold text-[#52677B] hover:text-[#10263D] border border-[#DCE7F0] shadow-xs pointer-events-auto transition-colors"
          title="Reset View"
        >
          <RefreshCw size={12} />
          <span>Reset</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#DCE7F0] shadow-xs pointer-events-auto">
          <button
            type="button"
            onClick={() => adjustZoom(0.85)}
            className="p-1.5 rounded-lg text-[#52677B] hover:text-[#10263D] hover:bg-blue-50 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <span className="text-[10px] font-bold text-[#52677B] px-1">{zoomLevel}%</span>
          <button
            type="button"
            onClick={() => adjustZoom(1.15)}
            className="p-1.5 rounded-lg text-[#52677B] hover:text-[#10263D] hover:bg-blue-50 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
        </div>

        {/* Auto-Rotate & Fullscreen Toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setAutoRotate(prev => !prev)}
            className={`p-2 rounded-xl border shadow-xs transition-colors ${
              autoRotate
                ? 'bg-blue-50 border-[#145CFF]/30 text-[#145CFF]'
                : 'bg-white/90 border-[#DCE7F0] text-[#64748B]'
            }`}
            title={autoRotate ? 'Pause 360° Spin' : 'Resume 360° Spin'}
          >
            <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#52677B] hover:text-[#10263D] border border-[#DCE7F0] shadow-xs transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
