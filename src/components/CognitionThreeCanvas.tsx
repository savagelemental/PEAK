import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CognitionThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0b, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 22);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create the central "Cognitive Core" Hologram
    // Outer wireframe sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(6, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const coreOuterMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(coreOuterMesh);

    // Inner glowing solid/wireframe core (representing active agent logic)
    const innerGeometry = new THREE.IcosahedronGeometry(3, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00a2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    const coreInnerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(coreInnerMesh);

    // 5. Constellation of surrounding Data Nodes
    const nodeCount = 80;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeSpeeds: number[] = [];
    const nodeAngles: number[] = [];
    const nodeRadii: number[] = [];
    const nodeAltitudes: number[] = [];

    const colorCyan = new THREE.Color("#00f2ff");
    const colorWhite = new THREE.Color("#ffffff");
    const colorIndigo = new THREE.Color("#0a3a4a");

    for (let i = 0; i < nodeCount; i++) {
      const radius = 7 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const altitude = (Math.random() - 0.5) * 8;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = altitude;

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      nodeRadii.push(radius);
      nodeAngles.push(angle);
      nodeAltitudes.push(altitude);
      // Custom angular orbit speed
      nodeSpeeds.push((0.1 + Math.random() * 0.25) * (Math.random() > 0.5 ? 1 : -1));

      // Color coding representing different agent levels or active states
      const randVal = Math.random();
      let mixedColor = colorCyan.clone();
      if (randVal > 0.75) {
        mixedColor = colorWhite.clone();
      } else if (randVal < 0.3) {
        mixedColor = colorIndigo.clone();
      }

      nodeColors[i * 3] = mixedColor.r;
      nodeColors[i * 3 + 1] = mixedColor.g;
      nodeColors[i * 3 + 2] = mixedColor.b;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

    // Glow dot texture
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

    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.38,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const nodeSystem = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodeSystem);

    // 6. Dynamic active connection lines (Syntactical/Communication Paths)
    const lineCount = 120;
    const linePositions = new Float32Array(lineCount * 2 * 3);
    const lineColors = new Float32Array(lineCount * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.3,
      depthWrite: false
    });

    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    // 7. Interactive Mouse Tracking
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

    // 8. Animation & Render Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Mouse inertia tracking
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Rotate camera angle slightly based on mouse
      camera.position.x = currentX * 6;
      camera.position.y = currentY * 5;
      camera.lookAt(0, 0, 0);

      // Rotate core meshes in opposite directions for visual rhythm
      coreOuterMesh.rotation.y = elapsedTime * 0.08;
      coreOuterMesh.rotation.x = elapsedTime * 0.03;
      
      coreInnerMesh.rotation.y = -elapsedTime * 0.15;
      coreInnerMesh.rotation.z = -elapsedTime * 0.06;

      // Update orbital nodes position
      const posAttr = nodeGeometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const radius = nodeRadii[i];
        const baseAngle = nodeAngles[i];
        const speed = nodeSpeeds[i];
        const altitude = nodeAltitudes[i];

        // Orbit calculation
        const currentAngle = baseAngle + elapsedTime * speed * 0.35;

        // Wave displacement to simulate dynamic flow
        const wave = Math.sin(elapsedTime * 1.5 + i) * 0.25;

        posArray[i * 3] = Math.cos(currentAngle) * radius;
        posArray[i * 3 + 1] = altitude + wave;
        posArray[i * 3 + 2] = Math.sin(currentAngle) * radius;
      }
      posAttr.needsUpdate = true;

      // Draw connection lines between nearest nodes to simulate neural synaptic flows
      const linePosAttr = lineGeometry.getAttribute("position") as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;

      const lineColorAttr = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
      const lineColorArray = lineColorAttr.array as Float32Array;

      let linkIndex = 0;
      const maxDistance = 5.2;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (linkIndex >= lineCount) break;

          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const lineIdx = linkIndex * 2;

            // Start point (Node i)
            linePosArray[lineIdx * 3] = posArray[i * 3];
            linePosArray[lineIdx * 3 + 1] = posArray[i * 3 + 1];
            linePosArray[lineIdx * 3 + 2] = posArray[i * 3 + 2];

            // End point (Node j)
            linePosArray[(lineIdx + 1) * 3] = posArray[j * 3];
            linePosArray[(lineIdx + 1) * 3 + 1] = posArray[j * 3 + 1];
            linePosArray[(lineIdx + 1) * 3 + 2] = posArray[j * 3 + 2];

            // Fading glowing connections
            const ratio = 1.0 - dist / maxDistance;
            const pulse = 0.5 + 0.5 * Math.sin(elapsedTime * 4.5 + dist * 2);
            const intensity = ratio * pulse;

            const r = colorCyan.r * intensity;
            const g = colorCyan.g * intensity;
            const b = colorCyan.b * intensity;

            lineColorArray[lineIdx * 3] = r;
            lineColorArray[lineIdx * 3 + 1] = g;
            lineColorArray[lineIdx * 3 + 2] = b;

            lineColorArray[(lineIdx + 1) * 3] = r;
            lineColorArray[(lineIdx + 1) * 3 + 1] = g;
            lineColorArray[(lineIdx + 1) * 3 + 2] = b;

            linkIndex++;
          }
        }
      }

      // Hide inactive segments in buffer
      for (let i = linkIndex; i < lineCount; i++) {
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

      // Render Frame
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
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

    // 10. Memory cleanups
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      dotTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#0a0a0b]"
      id="cognition-3d-canvas-container"
    />
  );
}
