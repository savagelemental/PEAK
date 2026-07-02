import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StoryThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0b, 0.012);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    // Positioned higher up looking slightly down at the grid landscape
    camera.position.set(0, 12, 28);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Interactive Object: A Flowing Digital Peak Landscape (Parametric Particle Grid)
    const cols = 75;
    const rows = 75;
    const particleCount = cols * rows;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalY = new Float32Array(particleCount);

    const colorCyan = new THREE.Color("#00f2ff");
    const colorIndigo = new THREE.Color("#003545");
    const colorWhite = new THREE.Color("#ffffff");

    // Grid spacing
    const spacingX = 0.8;
    const spacingZ = 0.8;
    const offsetX = -(cols * spacingX) / 2;
    const offsetZ = -(rows * spacingZ) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const index = i * rows + j;

        // Position coordinates centered at origin
        const x = i * spacingX + offsetX;
        const z = j * spacingZ + offsetZ;
        
        // Generate mountain-like elevation at the center (Gaussian distribution)
        const distFromCenter = Math.sqrt(x * x + z * z);
        const elevation = 7 * Math.exp(-0.02 * (distFromCenter * distFromCenter));
        
        const y = elevation + (Math.sin(i * 0.25) * Math.cos(j * 0.25) * 0.8);

        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;

        originalY[index] = y;

        // Visual coloring representing peak altitude (higher points are bright white/cyan, lower are deep indigo)
        const normalizedAlt = Math.max(0, Math.min(1, y / 8));
        let mixedColor = colorIndigo.clone();
        if (normalizedAlt > 0.6) {
          mixedColor.lerp(colorWhite, (normalizedAlt - 0.6) * 2.5);
        } else {
          mixedColor.lerp(colorCyan, normalizedAlt * 1.6);
        }

        colors[index * 3] = mixedColor.r;
        colors[index * 3 + 1] = mixedColor.g;
        colors[index * 3 + 2] = mixedColor.b;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Dynamic dot texture
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

    const material = new THREE.PointsMaterial({
      size: 0.22,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const landscapeSystem = new THREE.Points(geometry, material);
    scene.add(landscapeSystem);

    // 3. Subtle background grid floor for CAD aesthetic
    const gridHelper = new THREE.GridHelper(80, 20, 0x00f2ff, 0x222225);
    gridHelper.position.y = -6;
    gridHelper.material.opacity = 0.04;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 4. Input Handling for Interactive Parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 5. Render & Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      
      // Interpolate mouse movements for cinematic smooth inertia
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Rotate camera angle slightly based on mouse
      camera.position.x = currentX * 12;
      // Scroll-based altitude descent
      const baseScrollFactor = scrollY / 1200;
      camera.position.y = 12 - Math.min(baseScrollFactor * 6, 8) + currentY * 3;
      camera.lookAt(0, -2 - (baseScrollFactor * 2), 0);

      // Animate the wave height dynamically over time to make the peak look "alive"
      const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = positionAttr.array as Float32Array;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = i * rows + j;
          const origY = originalY[index];
          
          // Ripple wave patterns spreading out from center
          const distFromCenter = Math.sqrt(
            posArray[index * 3] * posArray[index * 3] + 
            posArray[index * 3 + 2] * posArray[index * 3 + 2]
          );

          // Combination of sin/cos waves for a natural liquid/fluctuating feel
          const wave = Math.sin(distFromCenter * 0.3 - elapsedTime * 1.5) * 0.45;
          const microWave = Math.cos((i + j) * 0.2 + elapsedTime * 2.2) * 0.12;

          // Modify Y position
          posArray[index * 3 + 1] = origY + wave + microWave;
        }
      }
      positionAttr.needsUpdate = true;

      // Slow elegant drift of the overall coordinate system
      landscapeSystem.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle responsive layout updates flawlessly
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

    // Cleanup memory and event listeners properly
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      dotTexture.dispose();
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#0a0a0b]"
      id="story-3d-canvas-container"
    />
  );
}
