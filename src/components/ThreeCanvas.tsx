import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Add atmospheric fog
    scene.fog = new THREE.FogExp2(0x0a0a0b, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Interactive Object: A Complex Synaptic Neural Sphere (Morphing Geometry)
    // We create a custom particle cloud combined with a subtle wireframe sphere
    const particleCount = 1200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color("#00f2ff");
    const colorTurquoise = new THREE.Color("#003545");
    const colorWhite = new THREE.Color("#ffffff");

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution for a perfectly spherical cloud
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const radius = 8 + Math.random() * 2.5; // Layered sphere
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Color interpolation based on position
      const mixedColor = colorCyan.clone().lerp(
        Math.random() > 0.45 ? colorTurquoise : colorWhite, 
        Math.random()
      );
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Shaders/Materials for maximum premium performance
    const textureLoader = new THREE.TextureLoader();
    // Use a programmatically generated circular texture to avoid external assets loading lag
    const canvasTexture = document.createElement("canvas");
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const ctx = canvasTexture.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const dotTexture = new THREE.CanvasTexture(canvasTexture);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 3. Elegant Wireframe Inner Geometry to make it feel like CAD / high-end engineering
    const innerGeo = new THREE.IcosahedronGeometry(7.2, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 4. Floating Rings (representing data bounds)
    const ringGeo1 = new THREE.RingGeometry(11, 11.2, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.05,
      wireframe: true
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(12.5, 12.6, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.03,
      wireframe: true
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x00f2ff, 1.5);
    directionalLight1.position.set(5, 10, 15);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-10, -5, -10);
    scene.add(directionalLight2);

    // 6. Interactive Mouse & Scroll Input Handling
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize coordinate bounds [-1, 1]
      const rect = container.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 7. Render Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow orbital camera movement
      camera.position.x += (targetX * 3.5 - camera.position.x) * 0.05;
      camera.position.y += (targetY * 3.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Interpolate current mouse
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      // Scroll-based parallax and particle dispersal
      const scrollFactor = Math.min(scrollY / 1200, 1.0);
      
      // Shift elements downwards and expand scale based on scroll
      const currentYOffset = -scrollFactor * 6.5;
      particleSystem.position.y = currentYOffset;
      innerMesh.position.y = currentYOffset;
      ring1.position.y = currentYOffset;
      ring2.position.y = currentYOffset;

      const activeScale = 1.0 + scrollFactor * 0.65;
      particleSystem.scale.set(activeScale, activeScale, activeScale);

      // Base rotations
      particleSystem.rotation.y = elapsedTime * 0.04 + currentX * 0.2;
      particleSystem.rotation.x = elapsedTime * 0.02 + currentY * 0.2;

      innerMesh.rotation.y = -elapsedTime * 0.06;
      innerMesh.rotation.x = elapsedTime * 0.03;

      ring1.rotation.z = elapsedTime * 0.02;
      ring2.rotation.z = -elapsedTime * 0.035;

      // Pulse effects (Glow and Depth simulation)
      const scaleFactor = 1.0 + Math.sin(elapsedTime * 1.5) * 0.04;
      innerMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Morphing particle vertices programmatically (simulating an alive synaptic neural network)
      const positionsAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      if (positionsAttr) {
        const arr = positionsAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const ox = originalPositions[idx];
          const oy = originalPositions[idx + 1];
          const oz = originalPositions[idx + 2];

          // Compute frequency displacements based on sine waves and index
          const offset = i * 0.05;
          const wave = Math.sin(elapsedTime * 1.2 + offset) * 0.12;
          
          arr[idx] = ox + (ox / 10) * wave;
          arr[idx + 1] = oy + (oy / 10) * wave;
          arr[idx + 2] = oz + (oz / 10) * wave;
        }
        positionsAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Observer to perfectly adapt to iframe or window changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[350px] md:min-h-[500px] cursor-grab active:cursor-grabbing select-none overflow-hidden relative"
      id="peak-webgl-canvas-container"
    >
      {/* Subtle overlay styling inside the canvas to mix it perfectly with the design */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-[#0a0a0b] pointer-events-none" />
    </div>
  );
}
