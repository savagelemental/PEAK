import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface TechThreeCanvasProps {
  entropy: number;
  synapticSpeed: number;
  feedbackLoops: number;
}

export default function TechThreeCanvas({ entropy, synapticSpeed, feedbackLoops }: TechThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ entropy, synapticSpeed, feedbackLoops });

  // Keep ref updated to avoid re-triggering useEffect unnecessarily
  useEffect(() => {
    stateRef.current = { entropy, synapticSpeed, feedbackLoops };
  }, [entropy, synapticSpeed, feedbackLoops]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.015);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 24);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create Interconnected Synaptic Neural Net
    const maxParticleCount = 150;
    const positions = new Float32Array(maxParticleCount * 3);
    const colors = new Float32Array(maxParticleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const basePositions: { x: number; y: number; z: number }[] = [];

    const colorCyan = new THREE.Color("#00f2ff");
    const colorBlue = new THREE.Color("#005577");

    // Distribute particles in a spherical neural shell
    for (let i = 0; i < maxParticleCount; i++) {
      // Spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 6 + Math.random() * 2.5; // Radius

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions.push({ x, y, z });

      // Small ambient motion velocity
      velocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
      });

      // Coloring based on altitude / position
      const mixedColor = colorCyan.clone().lerp(colorBlue, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circular dot texture for clean design
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

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Line segments to represent synaptic connections (axons/links)
    const lineMaxConnections = 450;
    const linePositions = new Float32Array(lineMaxConnections * 2 * 3);
    const lineColors = new Float32Array(lineMaxConnections * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.35,
      depthWrite: false
    });

    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    // 6. Interactive Parallax and Mouse Tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 7. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentParams = stateRef.current;

      // Inertia for mouse parallax
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Rotate whole group based on time and mouse
      particleSystem.rotation.y = elapsedTime * 0.05 * currentParams.synapticSpeed;
      particleSystem.rotation.x = currentY * 0.2;
      lineSystem.rotation.y = particleSystem.rotation.y;
      lineSystem.rotation.x = particleSystem.rotation.x;

      // Update particle positions with brownian noise influenced by entropy
      const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = positionAttr.array as Float32Array;

      for (let i = 0; i < maxParticleCount; i++) {
        const base = basePositions[i];
        
        // Dynamic offset with noise scaled by entropy
        const speedScale = currentParams.synapticSpeed * 1.5;
        const offsetRange = currentParams.entropy * 2.2;
        
        const offsetX = Math.sin(elapsedTime * speedScale + i) * offsetRange;
        const offsetY = Math.cos(elapsedTime * speedScale * 0.8 + i) * offsetRange;
        const offsetZ = Math.sin(elapsedTime * speedScale * 1.2 + i * 2) * offsetRange;

        posArray[i * 3] = base.x + offsetX;
        posArray[i * 3 + 1] = base.y + offsetY;
        posArray[i * 3 + 2] = base.z + offsetZ;
      }
      positionAttr.needsUpdate = true;

      // Re-calculate line connections dynamically based on current spacing and feedbackLoops (layer complexity)
      const linePosAttr = lineGeometry.getAttribute("position") as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;

      const lineColorAttr = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
      const lineColorArray = lineColorAttr.array as Float32Array;

      let connectionIndex = 0;
      
      // Proximity threshold is scaled by feedback loops (more loops = denser, more connected mesh)
      const maxDistance = 4.0 + (currentParams.feedbackLoops * 0.5);

      for (let i = 0; i < maxParticleCount; i++) {
        for (let j = i + 1; j < maxParticleCount; j++) {
          if (connectionIndex >= lineMaxConnections) break;

          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const lineIdx = connectionIndex * 2;

            // Start vertex
            linePosArray[lineIdx * 3] = posArray[i * 3];
            linePosArray[lineIdx * 3 + 1] = posArray[i * 3 + 1];
            linePosArray[lineIdx * 3 + 2] = posArray[i * 3 + 2];

            // End vertex
            linePosArray[(lineIdx + 1) * 3] = posArray[j * 3];
            linePosArray[(lineIdx + 1) * 3 + 1] = posArray[j * 3 + 1];
            linePosArray[(lineIdx + 1) * 3 + 2] = posArray[j * 3 + 2];

            // Connection strength / fading color
            const alpha = 1.0 - dist / maxDistance;
            
            // Pulse connection brightness based on synapticSpeed
            const pulse = 0.4 + 0.6 * Math.sin(elapsedTime * currentParams.synapticSpeed * 4 + dist);
            const intensity = alpha * pulse;

            const r = colorCyan.r * intensity;
            const g = colorCyan.g * intensity;
            const b = colorCyan.b * intensity;

            lineColorArray[lineIdx * 3] = r;
            lineColorArray[lineIdx * 3 + 1] = g;
            lineColorArray[lineIdx * 3 + 2] = b;

            lineColorArray[(lineIdx + 1) * 3] = r;
            lineColorArray[(lineIdx + 1) * 3 + 1] = g;
            lineColorArray[(lineIdx + 1) * 3 + 2] = b;

            connectionIndex++;
          }
        }
      }

      // Fill remaining connection buffer with zeros to hide unused lines
      for (let i = connectionIndex; i < lineMaxConnections; i++) {
        const lineIdx = i * 2;
        linePosArray[lineIdx * 3] = 0;
        linePosArray[lineIdx * 3 + 1] = 0;
        linePosArray[lineIdx * 3 + 2] = 0;
        linePosArray[(lineIdx + 1) * 3] = 0;
        linePosArray[(lineIdx + 1) * 3 + 1] = 0;
        linePosArray[(lineIdx + 1) * 3 + 2] = 0;
      }

      linePosAttr.needsUpdate = true;
      lineColorAttr.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      dotTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#0c0c0e]"
      id="tech-3d-canvas-container"
    />
  );
}
