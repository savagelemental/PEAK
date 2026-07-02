import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ContactThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene setup with foggy atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 2, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create the Transmitter Signal Grid (a wavy concentric circular/radial data grid)
    const rings = 12;
    const segments = 64;
    const gridGroup = new THREE.Group();
    scene.add(gridGroup);

    const ringMaterials: THREE.LineBasicMaterial[] = [];
    const ringGeometries: THREE.BufferGeometry[] = [];

    const cyanColor = new THREE.Color("#00f2ff");
    const darkBlueColor = new THREE.Color("#031b26");

    // Creating concentric radial line rings to represent a target / transmitter antenna
    for (let r = 1; r <= rings; r++) {
      const radius = r * 1.8;
      const points: THREE.Vector3[] = [];
      
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }

      const geom = new THREE.BufferGeometry().setFromPoints(points);
      // Fade out outer rings
      const opacity = Math.max(0.01, 0.28 - (r / rings) * 0.2);
      const color = cyanColor.clone().lerp(darkBlueColor, r / rings);

      const mat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const line = new THREE.Line(geom, mat);
      gridGroup.add(line);

      ringGeometries.push(geom);
      ringMaterials.push(mat);
    }

    // Creating radial spokes / lines radiating outward from the transmitter core
    const spokeCount = 16;
    for (let i = 0; i < spokeCount; i++) {
      const theta = (i / spokeCount) * Math.PI * 2;
      const maxRadius = rings * 1.8;
      
      const points: THREE.Vector3[] = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(theta) * maxRadius, 0, Math.sin(theta) * maxRadius)
      ];

      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: cyanColor.clone().lerp(darkBlueColor, 0.4),
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const line = new THREE.Line(geom, mat);
      gridGroup.add(line);
    }

    // 5. Signal Data Packet streams (flowing along the radial lines or orbiting)
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    // Store data for particle simulation
    const particleSpeeds: number[] = [];
    const particleProgress: number[] = [];
    const particleAngles: number[] = [];
    const particleYMax: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Flow from center outward & upward
      particleProgress.push(Math.random()); // starting point (0 to 1)
      particleSpeeds.push(0.12 + Math.random() * 0.25);
      particleAngles.push(Math.random() * Math.PI * 2);
      particleYMax.push(3 + Math.random() * 8); // height of vertical transmission beams

      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;

      // Color variation (pure cyan to light magenta/indigo or pristine white)
      const rnd = Math.random();
      const col = rnd > 0.7 
        ? new THREE.Color("#ffffff") 
        : rnd > 0.3 
          ? new THREE.Color("#00f2ff") 
          : new THREE.Color("#0055ff");

      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

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

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.45,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Central Transmission Tower/Receiver Beacon (Elegant Glowing Rings and a Beam)
    const beaconGroup = new THREE.Group();
    scene.add(beaconGroup);

    // Dynamic glowing cylinder representing the transmission core beam
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.4, 18, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 9;
    beaconGroup.add(beam);

    // Transmitter core beacon spheres
    const coreGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0;
    beaconGroup.add(coreMesh);

    // 7. Interactive Parallax Mouse Controls
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

      // Inertia on mouse tracking
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Camera smoothly floats and follows mouse parallax
      camera.position.x = currentX * 7;
      camera.position.y = 8 + currentY * 4;
      camera.lookAt(0, 1.5, 0);

      // Rotate grid terrain slightly
      gridGroup.rotation.y = elapsedTime * 0.035;

      // Animate concentric rings using custom ripple function
      ringGeometries.forEach((geom, index) => {
        const positionAttr = geom.getAttribute("position") as THREE.BufferAttribute;
        const posArray = positionAttr.array as Float32Array;
        const ringRadius = (index + 1) * 1.8;

        // Wave propagation from the center outwards
        const wave = Math.sin(elapsedTime * 2.5 - ringRadius * 0.6) * 0.55;

        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          posArray[s * 3] = Math.cos(theta) * ringRadius;
          // Apply sinusoidal wave height
          posArray[s * 3 + 1] = wave;
          posArray[s * 3 + 2] = Math.sin(theta) * ringRadius;
        }
        positionAttr.needsUpdate = true;
      });

      // Animate transmission core elements
      beam.rotation.y = -elapsedTime * 0.2;
      coreMesh.rotation.y = elapsedTime * 0.8;
      
      // Pulsate beam intensity
      beamMat.opacity = 0.08 + 0.12 * Math.sin(elapsedTime * 5.0);

      // Animate data packets (Particles flowing upward & outward like signals)
      const partPosAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
      const partPosArray = partPosAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Increment progress
        particleProgress[i] += particleSpeeds[i] * 0.012;
        if (particleProgress[i] > 1.0) {
          particleProgress[i] = 0;
          particleAngles[i] = Math.random() * Math.PI * 2;
        }

        const progress = particleProgress[i];
        const angle = particleAngles[i];
        const maxDist = rings * 1.8;

        // Polar layout - particles flow outward and curve upward/downward
        const currentRadius = progress * maxDist;
        const waveHeight = Math.sin(progress * Math.PI) * particleYMax[i];

        partPosArray[i * 3] = Math.cos(angle) * currentRadius;
        partPosArray[i * 3 + 1] = waveHeight - 0.5;
        partPosArray[i * 3 + 2] = Math.sin(angle) * currentRadius;
      }
      partPosAttr.needsUpdate = true;

      // Render Frame
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
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
      ringGeometries.forEach((g) => g.dispose());
      ringMaterials.forEach((m) => m.dispose());
      beamGeo.dispose();
      beamMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      dotTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#0c0c0e]"
      id="contact-3d-canvas-container"
    />
  );
}
