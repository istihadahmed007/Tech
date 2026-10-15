import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Glacial Tech — Woven 3D Technology Atmosphere
 * 
 * Core Features:
 * - Real-time 3D background featuring flowing, interwoven digital waves.
 * - Thousands of fine, luminous threads forming a gently undulating 3D mesh.
 * - Multiple layers of smooth, interwoven 3D wireframe waves that weave over and under.
 * - Interconnected curves and subtle luminous nodes with soft ice-blue and white lighting.
 * - Gentle transparency, restrained glow, and pale silver highlights.
 * - Subtle pointer-responsive depth movement on desktop and smooth scroll influence.
 * - Context-aware modes: 'home' (expressive), 'category' (soft), 'pdp' (ambient), 'checkout' (minimal).
 * - Full reduced-motion compliance and background tab pause.
 * - Strictly background: fixed, zero pointer-events, does not interfere with any UI elements.
 */
export default function WovenBackground({ mode = 'home' }) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Mode-based target uniform values
  const targetParams = useRef({
    amp: 1.0,
    speed: 0.35,
    opacity: 0.65,
    nodeOpacity: 0.7
  });

  // Update target parameters when mode changes
  useEffect(() => {
    switch (mode) {
      case 'home':
        targetParams.current = { amp: 1.0, speed: 0.35, opacity: 0.65, nodeOpacity: 0.7 };
        break;
      case 'category':
        targetParams.current = { amp: 0.7, speed: 0.28, opacity: 0.48, nodeOpacity: 0.45 };
        break;
      case 'pdp':
        targetParams.current = { amp: 0.55, speed: 0.22, opacity: 0.38, nodeOpacity: 0.35 };
        break;
      case 'checkout':
      case 'cart':
        targetParams.current = { amp: 0.25, speed: 0.12, opacity: 0.22, nodeOpacity: 0.18 };
        break;
      default:
        targetParams.current = { amp: 0.85, speed: 0.3, opacity: 0.55, nodeOpacity: 0.55 };
    }
  }, [mode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    // Check user reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Atmospheric ice-blue depth fog
    scene.fog = new THREE.FogExp2(0xF7FBFF, 0.024);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    // Camera positioned slightly elevated, looking slightly across the undulating woven mesh
    camera.position.set(0, -6.5, 23);
    camera.rotation.set(0.28, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0xF7FBFF, 0.0); // Transparent so underlying ice-blue gradient is visible
    container.appendChild(renderer.domElement);

    // Apply strict non-blocking styling to canvas
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    // 2. Vertex & Fragment Shaders for the Woven Digital Silk Waves
    const waveVertexShader = `
      uniform float uTime;
      uniform float uWaveSpeed;
      uniform float uWaveAmp;
      uniform float uScrollOffset;
      uniform float uLayerPhase;
      uniform float uLayerFreq;

      varying vec2 vUv;
      varying float vElevation;
      varying vec3 vWorldPos;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Coordinates across wave plane
        float x = pos.x * 0.082;
        float y = pos.y * 0.092;
        float t = uTime * uWaveSpeed;

        // Primary interwoven harmonics
        float w1 = sin(x * uLayerFreq + t * 0.72 + uLayerPhase + uScrollOffset * 0.35) * cos(y * 0.88 + t * 0.52);
        float w2 = sin((x * 0.95 + y * 1.05) * 0.75 - t * 0.58 + uLayerPhase * 0.7) * 0.55;
        float w3 = cos((x * 0.7 - y * 1.15) + t * 0.42) * 0.38;
        float w4 = sin(x * 1.8 - t * 0.3) * sin(y * 1.6 + t * 0.35) * 0.22;

        float elevation = (w1 + w2 + w3 + w4) * uWaveAmp * 4.2;
        pos.z += elevation;

        vElevation = elevation;
        vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
      }
    `;

    const waveFragmentShader = `
      uniform vec3 uColorBase;
      uniform vec3 uColorThread;
      uniform vec3 uColorHighlight;
      uniform float uOpacity;
      uniform float uThreadDensity;
      uniform float uCrestLight;

      varying vec2 vUv;
      varying float vElevation;
      varying vec3 vWorldPos;

      void main() {
        // High-precision anti-aliased procedural wireframe threads
        vec2 grid = abs(fract(vUv * uThreadDensity - 0.5) - 0.5) / fwidth(vUv * uThreadDensity);
        float line = min(grid.x, grid.y);
        float thread = 1.0 - min(line, 1.0); // 1.0 on thread line, 0.0 inside cell

        // Subtle face transparency between threads so layers weave over and under visibly
        float faceAlpha = 0.035;
        float threadAlpha = 0.75;
        float alpha = mix(faceAlpha, threadAlpha, thread) * uOpacity;

        // Shimmering crest lighting: wave peaks catch pale silver/white light
        float crest = smoothstep(-1.8, 3.2, vElevation);
        vec3 threadColor = mix(uColorThread, uColorHighlight, crest * uCrestLight);

        // Distance fog attenuation (fades smoothly into atmospheric background)
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(14.0, 52.0, depth);
        vec3 finalColor = mix(threadColor, uColorBase, fogFactor * 0.65);

        gl_FragColor = vec4(finalColor, alpha * (1.0 - fogFactor * 0.82));
      }
    `;

    // 3. Create Layer A (Primary Flowing Digital Silk Wave)
    const geomA = new THREE.PlaneGeometry(86, 54, 76, 52);
    const uniformsA = {
      uTime: { value: 0 },
      uWaveSpeed: { value: prefersReducedMotion ? 0 : 0.35 },
      uWaveAmp: { value: targetParams.current.amp },
      uScrollOffset: { value: 0 },
      uLayerPhase: { value: 0.0 },
      uLayerFreq: { value: 1.15 },
      uColorBase: { value: new THREE.Color(0xEDF6FF) },      // Ice-blue atmosphere base
      uColorThread: { value: new THREE.Color(0x2563EB) },    // Glacial Tech brand royal ice-blue
      uColorHighlight: { value: new THREE.Color(0xFFFFFF) }, // Pure luminous white peak highlights
      uOpacity: { value: targetParams.current.opacity },
      uThreadDensity: { value: 36.0 },
      uCrestLight: { value: 0.85 }
    };

    const matA = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms: uniformsA,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide
    });

    const meshA = new THREE.Mesh(geomA, matA);
    meshA.position.set(0, 0, 0);
    scene.add(meshA);

    // 4. Create Layer B (Interwoven Counter Wave that weaves over and under)
    const geomB = new THREE.PlaneGeometry(86, 54, 72, 48);
    const uniformsB = {
      uTime: { value: 0 },
      uWaveSpeed: { value: prefersReducedMotion ? 0 : 0.32 },
      uWaveAmp: { value: targetParams.current.amp * 0.92 },
      uScrollOffset: { value: 0 },
      uLayerPhase: { value: 2.35 }, // Phase shift causes this wave to rise where Layer A dips
      uLayerFreq: { value: 1.05 },
      uColorBase: { value: new THREE.Color(0xEDF6FF) },
      uColorThread: { value: new THREE.Color(0x60A5FA) },    // Pale sapphire / sky blue
      uColorHighlight: { value: new THREE.Color(0xE2E8F0) }, // Pale silver highlight
      uOpacity: { value: targetParams.current.opacity * 0.85 },
      uThreadDensity: { value: 32.0 },
      uCrestLight: { value: 0.75 }
    };

    const matB = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms: uniformsB,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide
    });

    const meshB = new THREE.Mesh(geomB, matB);
    meshB.position.set(1.5, 0.8, -1.2);
    meshB.rotation.set(-0.08, 0.12, 0.05); // Slight counter-angle enhances weave perception
    scene.add(meshB);

    // 5. Create Layer C: Luminous Fiber-Optic Nodes (Points at wave junctions)
    // Create a circular glowing sprite texture procedurally
    const createNodeTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, 'rgba(165, 201, 255, 0.85)');
      grad.addColorStop(0.65, 'rgba(37, 99, 235, 0.3)');
      grad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };

    const nodeTexture = createNodeTexture();
    const nodeCount = 380;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeSeeds = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3 + 0] = (Math.random() - 0.5) * 78;
      nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 46;
      nodePositions[i * 3 + 2] = 0;
      nodeSeeds[i] = Math.random() * Math.PI * 2;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute('aSeed', new THREE.BufferAttribute(nodeSeeds, 1));

    const nodeVertexShader = `
      attribute float aSeed;
      uniform float uTime;
      uniform float uWaveSpeed;
      uniform float uWaveAmp;
      uniform float uScrollOffset;

      varying float vNodeAlpha;

      void main() {
        vec3 pos = position;
        float x = pos.x * 0.082;
        float y = pos.y * 0.092;
        float t = uTime * uWaveSpeed;

        float w1 = sin(x * 1.15 + t * 0.72 + uScrollOffset * 0.35) * cos(y * 0.88 + t * 0.52);
        float w2 = sin((x * 0.95 + y * 1.05) * 0.75 - t * 0.58) * 0.55;
        float elevation = (w1 + w2) * uWaveAmp * 4.2;
        pos.z = elevation + 0.15; // Slightly above mesh surface

        // Gentle breathing pulse
        vNodeAlpha = 0.55 + 0.45 * sin(t * 1.8 + aSeed);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (12.0 * vNodeAlpha) * (20.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const nodeFragmentShader = `
      uniform sampler2D uTexture;
      uniform float uNodeOpacity;
      varying float vNodeAlpha;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        gl_FragColor = vec4(tex.rgb, tex.a * vNodeAlpha * uNodeOpacity);
      }
    `;

    const nodeUniforms = {
      uTime: { value: 0 },
      uWaveSpeed: { value: prefersReducedMotion ? 0 : 0.35 },
      uWaveAmp: { value: targetParams.current.amp },
      uScrollOffset: { value: 0 },
      uTexture: { value: nodeTexture },
      uNodeOpacity: { value: targetParams.current.nodeOpacity }
    };

    const nodeMaterial = new THREE.ShaderMaterial({
      vertexShader: nodeVertexShader,
      fragmentShader: nodeFragmentShader,
      uniforms: nodeUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodePoints);

    // 6. Interaction: Smooth Pointer Parallax (Desktop) & Scroll Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = -6.5;
    let targetScrollOffset = 0;
    let currentScrollOffset = 0;

    const handleMouseMove = (e) => {
      // Normalized coordinates (-1 to 1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = nx;
      mouseY = ny;
      targetCamX = mouseX * 2.8;
      targetCamY = -6.5 + mouseY * 1.6;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      targetScrollOffset = scrollY * 0.0018;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };

    window.addEventListener('resize', handleResize);

    // Visibility Listener: Pause animation when tab is inactive to save battery/CPU
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 7. Smooth Animation Loop
    let animationFrameId;
    let lastTime = performance.now();
    let elapsedTime = 0;

    const currentParams = {
      amp: targetParams.current.amp,
      speed: targetParams.current.speed,
      opacity: targetParams.current.opacity,
      nodeOpacity: targetParams.current.nodeOpacity
    };

    const animate = (now) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!prefersReducedMotion) {
        elapsedTime += delta;
      }

      // Smooth interpolation towards mode target parameters
      const lerpSpeed = 0.06;
      currentParams.amp += (targetParams.current.amp - currentParams.amp) * lerpSpeed;
      currentParams.speed += (targetParams.current.speed - currentParams.speed) * lerpSpeed;
      currentParams.opacity += (targetParams.current.opacity - currentParams.opacity) * lerpSpeed;
      currentParams.nodeOpacity += (targetParams.current.nodeOpacity - currentParams.nodeOpacity) * lerpSpeed;

      // Smooth camera pointer parallax interpolation
      camera.position.x += (targetCamX - camera.position.x) * 0.038;
      camera.position.y += (targetCamY - camera.position.y) * 0.038;

      // Smooth scroll offset interpolation
      currentScrollOffset += (targetScrollOffset - currentScrollOffset) * 0.05;

      // Update uniforms for Layer A
      uniformsA.uTime.value = elapsedTime;
      uniformsA.uWaveSpeed.value = currentParams.speed;
      uniformsA.uWaveAmp.value = currentParams.amp;
      uniformsA.uScrollOffset.value = currentScrollOffset;
      uniformsA.uOpacity.value = currentParams.opacity;

      // Update uniforms for Layer B
      uniformsB.uTime.value = elapsedTime;
      uniformsB.uWaveSpeed.value = currentParams.speed * 0.92;
      uniformsB.uWaveAmp.value = currentParams.amp * 0.92;
      uniformsB.uScrollOffset.value = currentScrollOffset;
      uniformsB.uOpacity.value = currentParams.opacity * 0.85;

      // Update uniforms for Luminous Nodes
      nodeUniforms.uTime.value = elapsedTime;
      nodeUniforms.uWaveSpeed.value = currentParams.speed;
      nodeUniforms.uWaveAmp.value = currentParams.amp;
      nodeUniforms.uScrollOffset.value = currentScrollOffset;
      nodeUniforms.uNodeOpacity.value = currentParams.nodeOpacity;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 8. Cleanup WebGL Resources & Listeners on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      geomA.dispose();
      matA.dispose();
      geomB.dispose();
      matB.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      nodeTexture.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      {/* Underlying Ice-Blue Ambient Light Base Gradient */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(130% 90% at 50% 10%, #FFFFFF 0%, #F5FAFF 45%, #EAF4FC 100%)',
          zIndex: -1
        }}
      />

      {/* Real-time 3D WebGL Canvas Mount */}
      {webglSupported ? (
        <div ref={mountRef} className="w-full h-full pointer-events-none" />
      ) : (
        /* Graceful CSS Animated Gradient Fallback if WebGL unavailable */
        <div 
          className="w-full h-full opacity-60 pointer-events-none animate-pulse"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.08) 0%, rgba(96,165,250,0.05) 40%, transparent 70%)'
          }}
        />
      )}
    </div>
  );
}
