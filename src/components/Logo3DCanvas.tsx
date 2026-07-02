import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Logo3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (matching RGB3DButton focal depth)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create premium 3D floating structure (identical to RGB3DButton)
    const geometry = new THREE.IcosahedronGeometry(1.35, 1);
    
    // Physical material that responds beautifully to point lights
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.95,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Inner glowing core sphere
    const innerGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 5. RGB Immersive Light Rig
    const redLight = new THREE.PointLight(0xff003c, 15, 10);
    const greenLight = new THREE.PointLight(0x00ff66, 15, 10);
    const blueLight = new THREE.PointLight(0x0066ff, 15, 10);

    scene.add(redLight);
    scene.add(greenLight);
    scene.add(blueLight);

    // Subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    // 6. Interactive states tracked via ref
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.targetX = (x / rect.width) * 2 - 1;
      mouse.targetY = -(y / rect.height) * 2 + 1;
    };

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => {
      setHovered(false);
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    // 7. Animation loop (matching exact gliding and lighting orbits of RGB3DButton)
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      
      // Interpolate mouse coordinates for fluid movement
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Accelerate rotation when hovered
      const rotationSpeed = hovered ? 1.6 : 0.6;
      mesh.rotation.y = elapsedTime * 0.45 * rotationSpeed;
      mesh.rotation.x = elapsedTime * 0.2 * rotationSpeed;
      mesh.rotation.z = elapsedTime * 0.1 * rotationSpeed;

      // Calculate dynamic horizontal range based on current width/height aspect ratio
      const aspect = width / height;
      const maxRangeX = aspect * 0.95;

      // Glide the mesh smoothly across the entire width of the logo area
      const targetXPos = Math.sin(elapsedTime * 0.8) * maxRangeX * 0.65 + mouse.x * maxRangeX * 0.35;
      mesh.position.x += (targetXPos - mesh.position.x) * 0.08;

      // Slight floating effect on vertical axis
      const targetYPos = Math.cos(elapsedTime * 1.6) * 0.12 + mouse.y * 0.25;
      mesh.position.y += (targetYPos - mesh.position.y) * 0.08;

      innerMesh.position.copy(mesh.position);
      innerMesh.rotation.y = -elapsedTime * 0.8;

      // Spread the RGB lights across the button/logo width to paint a beautiful neon gradient landscape
      // Red light orbits on the left side
      const redAngle = elapsedTime * 2.2 + (hovered ? 1.5 : 0);
      const redCenterX = -maxRangeX * 0.6;
      redLight.position.x = redCenterX + Math.cos(redAngle) * 1.2;
      redLight.position.z = Math.sin(redAngle) * 1.2;
      redLight.position.y = Math.sin(elapsedTime * 1.2) * 0.6;

      // Green light orbits in the center
      const greenAngle = elapsedTime * 1.6;
      greenLight.position.x = Math.cos(elapsedTime * 0.8) * 0.6;
      greenLight.position.y = Math.cos(greenAngle) * 1.2;
      greenLight.position.z = Math.sin(greenAngle) * 1.2;

      // Blue light orbits on the right side
      const blueAngle = -elapsedTime * 2.0;
      const blueCenterX = maxRangeX * 0.6;
      blueLight.position.x = blueCenterX + Math.sin(blueAngle) * 1.2;
      blueLight.position.y = Math.cos(blueAngle) * 1.2;
      blueLight.position.z = Math.sin(elapsedTime * 1.4) * 0.6;

      // Increase intensity when hovered to create a beautiful "RGB Flare"
      const targetIntensity = hovered ? 25 : 16;
      redLight.intensity += (targetIntensity - redLight.intensity) * 0.1;
      greenLight.intensity += (targetIntensity - greenLight.intensity) * 0.1;
      blueLight.intensity += (targetIntensity - blueLight.intensity) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resizing
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

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
    };
  }, [hovered]);

  return (
    <div
      ref={containerRef}
      className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-sm cursor-pointer"
    >
      <canvas ref={canvasRef} className="w-full h-full block animate-fade-in" />
    </div>
  );
}
