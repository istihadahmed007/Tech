import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Glacial Tech — Woven 3D Technology Atmosphere
 * 
 * Hyper-accurate recreation matching the user's reference image:
 * - Expansive rolling 3D cybernetic wave landscape (undulating ocean/sand-dune swells).
 * - High-density triangulated wireframe lattice (~28,000 vertices, ~55,000 fine diagonal lines).
 * - Crisp, brilliant pinpoint node dots at every single vertex intersection.
 * - Multi-ridge wave topology with 4-5 visible rolling crests receding into atmospheric haze.
 * - Glowing electric cyan lines with radiant white crest highlights (#FFFFFF, #7FE5FF, #00D2FF).
 * - Solid dark midnight surface occlusion between waves (#020814) so foreground ridges cleanly occlude background valleys.
 * - Soft atmospheric horizon glow and distance depth fade.
 * - Subtle mouse parallax and smooth scroll response.
 * - Context-aware modes for Home, Categories, PDP, and Checkout.
 * - Strictly background: fixed, pointer-events: none, z-index: 0.
 */
export default function WovenBackground({ mode = 'home' }) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Target animation parameters by page mode
  const targetParams = useRef({
    amp: 1.0,
    speed: 0.34,
    lineOpacity: 0.96,
    nodeOpacity: 1.0,
    surfaceOpacity: 0.97
  });

  useEffect(() => {
    switch (mode) {
      case 'home':
        targetParams.current = { amp: 1.0, speed: 0.34, lineOpacity: 0.96, nodeOpacity: 1.0, surfaceOpacity: 0.97 };
        break;
      case 'category':
        targetParams.current = { amp: 0.88, speed: 0.28, lineOpacity: 0.88, nodeOpacity: 0.92, surfaceOpacity: 0.97 };
        break;
      case 'pdp':
        targetParams.current = { amp: 0.78, speed: 0.24, lineOpacity: 0.82, nodeOpacity: 0.85, surfaceOpacity: 0.97 };
        break;
      case 'checkout':
      case 'cart':
        targetParams.current = { amp: 0.42, speed: 0.16, lineOpacity: 0.55, nodeOpacity: 0.6, surfaceOpacity: 0.97 };
        break;
      default:
        targetParams.current = { amp: 0.95, speed: 0.3, lineOpacity: 0.92, nodeOpacity: 0.95, surfaceOpacity: 0.97 };
    }
  }, [mode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x011326, 0.012);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Cinematic landscape camera looking across rolling horizontal swells
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 160);
    const defaultCamX = 0;
    const defaultCamY = 6.8;
    const defaultCamZ = 21.5;
    camera.position.set(defaultCamX, defaultCamY, defaultCamZ);
    camera.lookAt(0, 1.2, -6.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0.0); // Transparent so radiant atmospheric horizon glow shines through
    container.appendChild(renderer.domElement);

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    // 2. High-Density Plane Geometry (190 x 140 segments = 26,600 vertices, 53,200 triangles)
    // 145 width x 105 depth
    const planeGeom = new THREE.PlaneGeometry(145, 105, 190, 140);
    const meshRotationX = -Math.PI * 0.38; // Tilted toward horizon

    // 3. Shared Vertex Shader (Displaces surface, wireframe lines, and node points synchronously)
    const commonVertexShader = `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmp;
      uniform float uScroll;
      uniform float uZOffset;

      varying float vElevation;
      varying vec3 vWorldPos;

      void main() {
        vec3 pos = position;

        // Wave spatial coordinates
        float kx = pos.x * 0.088;
        float ky = pos.y * 0.142; // recedes into depth
        float t = uTime * uSpeed;

        // Diagonal wave projection matching reference photo angle
        float u = kx * 0.88 + ky * 0.46;
        float v = ky * 0.90 - kx * 0.38;

        // Primary rolling transverse swells
        float swell1 = sin(v * 1.82 + sin(u * 0.72) * 1.35 + t * 0.78 + uScroll * 0.3);

        // Secondary cross-undulation creating peaks and valleys along ridges
        float swell2 = cos(v * 0.88 - u * 0.92 - t * 0.54) * 0.62;

        // Sharpen crest ridges (Trochoidal profile: narrow glowing peaks, wide troughs)
        float ridgeFactor = (swell1 + 1.0) * 0.5;
        float ridgeShaped = pow(ridgeFactor, 1.4) * 2.0 - 1.0;

        // Subtle micro-ripples adding fine silky woven digital texture
        float micro1 = sin((u * 2.3 + v * 1.9) + t * 0.88) * 0.22;
        float micro2 = cos((u * 1.5 - v * 2.5) - t * 0.68) * 0.14;

        // Total elevation along normal
        float elevation = (ridgeShaped * 3.3 + swell2 * 1.55 + micro1 + micro2) * uAmp * 1.42;
        
        // Displace along local Z (normal to tilted plane)
        pos.z += elevation + uZOffset;

        vElevation = elevation;
        vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPos, 1.0);
      }
    `;

    // 4. Base Surface Mesh (Solid dark occlusion so foreground waves obscure valleys behind them)
    const surfaceFragmentShader = `
      uniform vec3 uColorValley;
      uniform vec3 uColorSlope;
      uniform vec3 uColorCrest;
      uniform float uSurfaceOpacity;

      varying float vElevation;
      varying vec3 vWorldPos;

      void main() {
        // Deep obsidian-navy in valleys to midnight-cyan on slopes
        float t = smoothstep(-3.5, 4.0, vElevation);
        vec3 col = mix(uColorValley, uColorSlope, t);
        col = mix(col, uColorCrest, smoothstep(1.0, 4.5, vElevation) * 0.6);

        // Atmospheric distance fog attenuation
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(22.0, 80.0, depth);
        vec3 finalCol = mix(col, vec3(0.01, 0.045, 0.09), fogFactor);

        gl_FragColor = vec4(finalCol, uSurfaceOpacity);
      }
    `;

    const surfaceUniforms = {
      uTime: { value: 0 },
      uSpeed: { value: prefersReducedMotion ? 0 : 0.34 },
      uAmp: { value: targetParams.current.amp },
      uScroll: { value: 0 },
      uZOffset: { value: 0.0 },
      uColorValley: { value: new THREE.Color(0x010712) },  // Deep obsidian black-navy
      uColorSlope: { value: new THREE.Color(0x02162c) },   // Cyan-tinted navy
      uColorCrest: { value: new THREE.Color(0x06335a) },   // Luminous twilight cyan
      uSurfaceOpacity: { value: targetParams.current.surfaceOpacity }
    };

    const surfaceMat = new THREE.ShaderMaterial({
      vertexShader: commonVertexShader,
      fragmentShader: surfaceFragmentShader,
      uniforms: surfaceUniforms,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide
    });

    const surfaceMesh = new THREE.Mesh(planeGeom, surfaceMat);
    surfaceMesh.rotation.x = meshRotationX;
    scene.add(surfaceMesh);

    // 5. Wireframe Lattice (Fine cyan lines matching reference photo)
    const wireframeGeom = new THREE.WireframeGeometry(planeGeom);

    const lineFragmentShader = `
      uniform vec3 uLineTrough;
      uniform vec3 uLineSlope;
      uniform vec3 uLineCrest;
      uniform vec3 uLinePeak;
      uniform float uLineOpacity;

      varying float vElevation;
      varying vec3 vWorldPos;

      void main() {
        // Multi-stop electric cyan gradient across wave elevations
        float t = smoothstep(-3.0, 3.5, vElevation);
        vec3 col = mix(uLineTrough, uLineSlope, t);
        col = mix(col, uLineCrest, smoothstep(0.4, 2.6, vElevation));

        // Radiant white-cyan crest highlight (matches the glowing ridges in reference)
        float peakFactor = smoothstep(1.3, 4.0, vElevation);
        col = mix(col, uLinePeak, peakFactor * 0.96);

        // Distance depth fade into atmospheric haze
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float depthFade = smoothstep(25.0, 85.0, depth);

        // Emissive boost on crests
        float crestBoost = 1.0 + peakFactor * 0.7;

        gl_FragColor = vec4(col * crestBoost, uLineOpacity * (1.0 - depthFade * 0.4));
      }
    `;

    const lineUniforms = {
      uTime: { value: 0 },
      uSpeed: { value: prefersReducedMotion ? 0 : 0.34 },
      uAmp: { value: targetParams.current.amp },
      uScroll: { value: 0 },
      uZOffset: { value: 0.05 }, // Offset slightly above surface to eliminate z-fighting
      uLineTrough: { value: new THREE.Color(0x014B73) }, // Deep electric cyan-blue
      uLineSlope: { value: new THREE.Color(0x00D2F4) },  // Glowing cybernetic cyan
      uLineCrest: { value: new THREE.Color(0x7FE5FF) },  // Ice-cyan crest
      uLinePeak: { value: new THREE.Color(0xFFFFFF) },   // Pure white crest peak highlight
      uLineOpacity: { value: targetParams.current.lineOpacity }
    };

    const lineMat = new THREE.ShaderMaterial({
      vertexShader: commonVertexShader,
      fragmentShader: lineFragmentShader,
      uniforms: lineUniforms,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -1.0
    });

    const wireframeMesh = new THREE.LineSegments(wireframeGeom, lineMat);
    wireframeMesh.rotation.x = meshRotationX;
    scene.add(wireframeMesh);

    // 6. Luminous Node Dots (Rendered at every grid vertex intersection)
    const createNodeTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');     // Pure brilliant white core
      grad.addColorStop(0.22, 'rgba(235, 252, 255, 1.0)');    // Ice white-cyan
      grad.addColorStop(0.48, 'rgba(0, 225, 255, 0.85)');    // Luminous electric cyan halo
      grad.addColorStop(0.78, 'rgba(0, 185, 255, 0.35)');    // Soft atmospheric glow
      grad.addColorStop(1.0, 'rgba(0, 185, 255, 0.0)');      // Transparent edge
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };

    const nodeTexture = createNodeTexture();

    const pointsVertexShader = `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmp;
      uniform float uScroll;

      varying float vNodeIntensity;

      void main() {
        vec3 pos = position;

        float kx = pos.x * 0.088;
        float ky = pos.y * 0.142;
        float t = uTime * uSpeed;

        float u = kx * 0.88 + ky * 0.46;
        float v = ky * 0.90 - kx * 0.38;

        float swell1 = sin(v * 1.82 + sin(u * 0.72) * 1.35 + t * 0.78 + uScroll * 0.3);
        float swell2 = cos(v * 0.88 - u * 0.92 - t * 0.54) * 0.62;

        float ridgeFactor = (swell1 + 1.0) * 0.5;
        float ridgeShaped = pow(ridgeFactor, 1.4) * 2.0 - 1.0;

        float micro1 = sin((u * 2.3 + v * 1.9) + t * 0.88) * 0.22;
        float micro2 = cos((u * 1.5 - v * 2.5) - t * 0.68) * 0.14;

        float elevation = (ridgeShaped * 3.3 + swell2 * 1.55 + micro1 + micro2) * uAmp * 1.42;
        
        // Elevated safely above surface and wireframe so dots never clip
        pos.z += elevation + 0.12;

        // Node size and intensity: luminous beads scaling gracefully with perspective
        float crest = smoothstep(-1.0, 3.8, elevation);
        vNodeIntensity = 0.75 + 0.55 * crest;

        vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
        vec4 mvPosition = viewMatrix * vec4(worldPos, 1.0);

        // Point size calibrated: luminous beads matching reference photo
        float baseSize = 5.6 + 6.5 * crest;
        gl_PointSize = clamp(baseSize * (20.0 / -mvPosition.z), 2.2, 12.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const pointsFragmentShader = `
      uniform sampler2D uTexture;
      uniform float uNodeOpacity;
      varying float vNodeIntensity;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        gl_FragColor = vec4(tex.rgb, tex.a * vNodeIntensity * uNodeOpacity);
      }
    `;

    const pointsUniforms = {
      uTime: { value: 0 },
      uSpeed: { value: prefersReducedMotion ? 0 : 0.34 },
      uAmp: { value: targetParams.current.amp },
      uScroll: { value: 0 },
      uTexture: { value: nodeTexture },
      uNodeOpacity: { value: targetParams.current.nodeOpacity }
    };

    const pointsMat = new THREE.ShaderMaterial({
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
      uniforms: pointsUniforms,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      polygonOffset: true,
      polygonOffsetFactor: -2.0,
      polygonOffsetUnits: -2.0
    });

    const pointsMesh = new THREE.Points(planeGeom, pointsMat);
    pointsMesh.rotation.x = meshRotationX;
    scene.add(pointsMesh);

    // 7. Interaction: Subtle Pointer Parallax & Scroll
    let targetCamX = defaultCamX;
    let targetCamY = defaultCamY;
    let targetScrollOffset = 0;
    let currentScrollOffset = 0;

    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCamX = defaultCamX + nx * 2.8;
      targetCamY = defaultCamY + ny * 1.4;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      targetScrollOffset = scrollY * 0.0018;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };

    window.addEventListener('resize', handleResize);

    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 8. Smooth Animation Loop
    let animationFrameId;
    let lastTime = performance.now();
    let elapsedTime = 0;

    const currentParams = {
      amp: targetParams.current.amp,
      speed: targetParams.current.speed,
      lineOpacity: targetParams.current.lineOpacity,
      nodeOpacity: targetParams.current.nodeOpacity,
      surfaceOpacity: targetParams.current.surfaceOpacity
    };

    const animate = (now) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!prefersReducedMotion) {
        elapsedTime += delta;
      }

      const lerpSpeed = 0.055;
      currentParams.amp += (targetParams.current.amp - currentParams.amp) * lerpSpeed;
      currentParams.speed += (targetParams.current.speed - currentParams.speed) * lerpSpeed;
      currentParams.lineOpacity += (targetParams.current.lineOpacity - currentParams.lineOpacity) * lerpSpeed;
      currentParams.nodeOpacity += (targetParams.current.nodeOpacity - currentParams.nodeOpacity) * lerpSpeed;
      currentParams.surfaceOpacity += (targetParams.current.surfaceOpacity - currentParams.surfaceOpacity) * lerpSpeed;

      // Smooth camera parallax
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(0, 1.2, -6.0);

      // Smooth scroll displacement
      currentScrollOffset += (targetScrollOffset - currentScrollOffset) * 0.05;

      surfaceUniforms.uTime.value = elapsedTime;
      surfaceUniforms.uSpeed.value = currentParams.speed;
      surfaceUniforms.uAmp.value = currentParams.amp;
      surfaceUniforms.uScroll.value = currentScrollOffset;
      surfaceUniforms.uSurfaceOpacity.value = currentParams.surfaceOpacity;

      lineUniforms.uTime.value = elapsedTime;
      lineUniforms.uSpeed.value = currentParams.speed;
      lineUniforms.uAmp.value = currentParams.amp;
      lineUniforms.uScroll.value = currentScrollOffset;
      lineUniforms.uLineOpacity.value = currentParams.lineOpacity;

      pointsUniforms.uTime.value = elapsedTime;
      pointsUniforms.uSpeed.value = currentParams.speed;
      pointsUniforms.uAmp.value = currentParams.amp;
      pointsUniforms.uScroll.value = currentScrollOffset;
      pointsUniforms.uNodeOpacity.value = currentParams.nodeOpacity;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      planeGeom.dispose();
      wireframeGeom.dispose();
      surfaceMat.dispose();
      lineMat.dispose();
      pointsMat.dispose();
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
        pointerEvents: 'none',
        background: '#020712'
      }}
      aria-hidden="true"
    >
      {/* Soft Cyan Horizon Atmospheric Ambient Glow (matching reference background) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(130% 90% at 50% 28%, rgba(0, 220, 255, 0.42) 0%, rgba(0, 160, 240, 0.22) 32%, rgba(2, 14, 34, 0.92) 68%, #020712 100%)',
          zIndex: -1
        }}
      />

      {/* Real-Time 3D WebGL Canvas */}
      {webglSupported ? (
        <div ref={mountRef} className="w-full h-full pointer-events-none" />
      ) : (
        /* Graceful CSS Fallback */
        <div 
          className="w-full h-full opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 35%, rgba(56,189,248,0.2) 0%, rgba(2,132,199,0.08) 50%, #020712 100%)'
          }}
        />
      )}
    </div>
  );
}
