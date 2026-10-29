import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeExplodedCanvasProps {
  activeLayer: 'all' | 'qr' | 'core' | 'base';
  isRotating: boolean;
}

export const ThreeExplodedCanvas: React.FC<ThreeExplodedCanvasProps> = ({ activeLayer, isRotating }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    activeLayer,
    isRotating,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    rotationY: 0.78, // ~45 deg
    rotationX: 0.52, // ~30 deg isometric
  });

  // Keep stateRef up to date
  useEffect(() => {
    stateRef.current.activeLayer = activeLayer;
    stateRef.current.isRotating = isRotating;
  }, [activeLayer, isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = null; // Transparent to blend with Pramaan cream background

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // CAMERA (Orthographic for true architectural axonometric look, or perspective with narrow FOV)
    const aspect = width / height;
    const d = 14;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfffefa, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const redAccentLight = new THREE.PointLight(0x960d41, 3.5, 30);
    redAccentLight.position.set(0, 0, 0);
    scene.add(redAccentLight);

    const rimLight = new THREE.DirectionalLight(0x57927f, 1.0);
    rimLight.position.set(-20, -10, -20);
    scene.add(rimLight);

    // ROOT ROTATING RIG
    const rig = new THREE.Group();
    scene.add(rig);

    // MATERIAL PALETTE
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xf7f4e9,
      roughness: 0.35,
      metalness: 0.05,
    });
    const darkInkMat = new THREE.MeshStandardMaterial({
      color: 0x21150f,
      roughness: 0.3,
      metalness: 0.1,
    });
    const redSignalMat = new THREE.MeshStandardMaterial({
      color: 0x960d41,
      roughness: 0.2,
      metalness: 0.2,
    });
    const greenVerifiedMat = new THREE.MeshStandardMaterial({
      color: 0x09453d,
      roughness: 0.3,
      metalness: 0.2,
    });
    const goldChampagneMat = new THREE.MeshStandardMaterial({
      color: 0xd4b94e,
      roughness: 0.3,
      metalness: 0.3,
    });
    const glassCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.45,
    });

    // 1. TOP TIER: QR PROOF PLATE
    const topGroup = new THREE.Group();
    topGroup.position.y = 6.2;
    rig.add(topGroup);

    // Plate geometry
    const topSlabGeo = new THREE.BoxGeometry(8, 0.3, 8);
    const topSlab = new THREE.Mesh(topSlabGeo, paperMat);
    topSlab.castShadow = true;
    topSlab.receiveShadow = true;
    topGroup.add(topSlab);

    // Create high-res dynamic QR Code Canvas Texture
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = 512;
    qrCanvas.height = 512;
    const qrCtx = qrCanvas.getContext('2d')!;
    qrCtx.fillStyle = '#f7f4e9';
    qrCtx.fillRect(0, 0, 512, 512);

    // Draw QR-style authentic matrix
    qrCtx.fillStyle = '#21150f';
    // 3 Corner Position Markers
    const drawEye = (x: number, y: number) => {
      qrCtx.fillRect(x, y, 100, 100);
      qrCtx.fillStyle = '#f7f4e9';
      qrCtx.fillRect(x + 16, y + 16, 68, 68);
      qrCtx.fillStyle = '#21150f';
      qrCtx.fillRect(x + 32, y + 32, 36, 36);
    };
    drawEye(32, 32);
    drawEye(380, 32);
    drawEye(32, 380);

    // Data matrix blocks
    qrCtx.fillStyle = '#21150f';
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 18; j++) {
        if (
          (i < 6 && j < 6) ||
          (i > 11 && j < 6) ||
          (i < 6 && j > 11)
        ) continue;
        if ((i * 7 + j * 13 + i * j) % 3 === 0) {
          qrCtx.fillRect(32 + i * 25, 32 + j * 25, 20, 20);
        }
      }
    }
    // Center glowing mark
    qrCtx.fillStyle = '#960d41';
    qrCtx.fillRect(230, 230, 52, 52);

    const qrTexture = new THREE.CanvasTexture(qrCanvas);
    qrTexture.anisotropy = 4;
    const qrPlaneGeo = new THREE.PlaneGeometry(6.6, 6.6);
    const qrPlaneMat = new THREE.MeshBasicMaterial({ map: qrTexture });
    const qrPlane = new THREE.Mesh(qrPlaneGeo, qrPlaneMat);
    qrPlane.rotation.x = -Math.PI / 2;
    qrPlane.position.y = 0.16;
    topGroup.add(qrPlane);

    // Top Plate Corner Brackets (Red)
    const bracketMat = redSignalMat;
    const bGeo = new THREE.BoxGeometry(0.25, 0.4, 1.2);
    const bGeo2 = new THREE.BoxGeometry(1.2, 0.4, 0.25);
    const corners = [
      [-3.9, -3.9],
      [3.9, -3.9],
      [-3.9, 3.9],
      [3.9, 3.9],
    ];
    corners.forEach(([cx, cz]) => {
      const b1 = new THREE.Mesh(bGeo, bracketMat);
      b1.position.set(cx, 0.1, cz + (cz > 0 ? -0.5 : 0.5));
      topGroup.add(b1);
      const b2 = new THREE.Mesh(bGeo2, bracketMat);
      b2.position.set(cx + (cx > 0 ? -0.5 : 0.5), 0.1, cz);
      topGroup.add(b2);
    });

    // 2. MIDDLE TIER: MICROGRID TRANSFORMER CORE
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 0;
    rig.add(coreGroup);

    // Outer Glass Crystalline Cube
    const outerCubeGeo = new THREE.BoxGeometry(4.2, 4.2, 4.2);
    const outerCube = new THREE.Mesh(outerCubeGeo, glassCoreMat);
    coreGroup.add(outerCube);

    // Cube Wireframe Edges
    const edges = new THREE.EdgesGeometry(outerCubeGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x960d41, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    coreGroup.add(wireframe);

    // Inner Glowing Core Cube
    const innerCoreGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x34150f,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x4d1610,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCore);

    // Rotating Energy Gyro Rings inside core
    const torusGeo = new THREE.TorusGeometry(1.5, 0.06, 8, 32);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xeaceaa,
      emissive: 0x960d41,
      roughness: 0.2,
      metalness: 0.8,
    });
    const gyroRing1 = new THREE.Mesh(torusGeo, torusMat);
    const gyroRing2 = new THREE.Mesh(torusGeo, torusMat);
    gyroRing2.rotation.x = Math.PI / 2;
    coreGroup.add(gyroRing1);
    coreGroup.add(gyroRing2);

    // Satellite Corner Micro-cubes
    const satGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const satPositions = [
      [-3.2, 0, -3.2],
      [3.2, 0, -3.2],
      [-3.2, 0, 3.2],
      [3.2, 0, 3.2],
    ];
    const satellites: THREE.Mesh[] = [];
    satPositions.forEach(([sx, sy, sz]) => {
      const sat = new THREE.Mesh(satGeo, darkInkMat);
      sat.position.set(sx, sy, sz);
      coreGroup.add(sat);
      satellites.push(sat);

      // Connecting laser beam from center to satellite
      const beamGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(sx, sy, sz),
      ]);
      const beamMat = new THREE.LineDashedMaterial({
        color: 0x960d41,
        dashSize: 0.4,
        gapSize: 0.2,
      });
      const beam = new THREE.Line(beamGeo, beamMat);
      beam.computeLineDistances();
      coreGroup.add(beam);
    });

    // 3. BASE TIER: SUB-METER & BLUEPRINT FOUNDATION
    const baseGroup = new THREE.Group();
    baseGroup.position.y = -6.2;
    rig.add(baseGroup);

    // Large Foundation Slab
    const baseSlabGeo = new THREE.BoxGeometry(11, 0.4, 11);
    const baseSlab = new THREE.Mesh(baseSlabGeo, paperMat);
    baseSlab.receiveShadow = true;
    baseGroup.add(baseSlab);

    // Grid Floor markings on base slab
    const gridHelper = new THREE.GridHelper(10, 10, 0x960d41, 0xcfc7b4);
    gridHelper.position.y = 0.21;
    baseGroup.add(gridHelper);

    // 3D Telemetry Bar Columns (Monthly consumption kWh)
    const barData = [
      { h: 3.2, color: redSignalMat, x: -3.5, z: 2.2 },
      { h: 4.8, color: greenVerifiedMat, x: -2.0, z: 2.2 },
      { h: 3.9, color: greenVerifiedMat, x: -0.5, z: 2.2 },
      { h: 5.5, color: darkInkMat, x: 1.0, z: 2.2 },
      { h: 2.8, color: goldChampagneMat, x: 2.5, z: 2.2 },
      { h: 4.4, color: redSignalMat, x: 4.0, z: 2.2 },
    ];
    const bars: THREE.Mesh[] = [];
    barData.forEach((bar) => {
      const bGeo = new THREE.BoxGeometry(0.8, bar.h, 0.8);
      const bMesh = new THREE.Mesh(bGeo, bar.color);
      bMesh.position.set(bar.x, 0.2 + bar.h / 2, bar.z);
      bMesh.castShadow = true;
      baseGroup.add(bMesh);
      bars.push(bMesh);
    });

    // Radial Circular Sub-meter Dial on Base
    const dialRingGeo = new THREE.RingGeometry(1.2, 1.6, 32);
    const dialRingMat = new THREE.MeshBasicMaterial({ color: 0x09453d, side: THREE.DoubleSide });
    const dialRing = new THREE.Mesh(dialRingGeo, dialRingMat);
    dialRing.rotation.x = -Math.PI / 2;
    dialRing.position.set(-2.5, 0.22, -2.5);
    baseGroup.add(dialRing);

    // 4. VERTICAL GUIDE RODS & DATUM RED BEADS
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 16, 8);
    const rodMat = new THREE.MeshBasicMaterial({ color: 0xcfc7b4, transparent: true, opacity: 0.6 });
    const rods = [
      [-4.5, -4.5],
      [4.5, -4.5],
      [-4.5, 4.5],
      [4.5, 4.5],
    ];
    rods.forEach(([rx, rz]) => {
      const rod = new THREE.Mesh(rodGeo, rodMat);
      rod.position.set(rx, 0, rz);
      rig.add(rod);

      // Red corner datum cube anchors
      const datumCubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const datumTop = new THREE.Mesh(datumCubeGeo, redSignalMat);
      datumTop.position.set(rx, 7.5, rz);
      rig.add(datumTop);

      const datumBottom = new THREE.Mesh(datumCubeGeo, redSignalMat);
      datumBottom.position.set(rx, -7.5, rz);
      rig.add(datumBottom);
    });

    // FLOATING PARTICLES (Data telemetry dust)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x960d41,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rig.add(particles);

    // MOUSE DRAG & ORBIT INTERACTION
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.prevMouseX;
      const dy = e.clientY - stateRef.current.prevMouseY;
      stateRef.current.rotationY += dx * 0.008;
      stateRef.current.rotationX = Math.max(0.1, Math.min(1.2, stateRef.current.rotationX + dy * 0.008));
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // TOUCH SUPPORT
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        stateRef.current.isDragging = true;
        stateRef.current.prevMouseX = e.touches[0].clientX;
        stateRef.current.prevMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - stateRef.current.prevMouseX;
      const dy = e.touches[0].clientY - stateRef.current.prevMouseY;
      stateRef.current.rotationY += dx * 0.008;
      stateRef.current.rotationX = Math.max(0.1, Math.min(1.2, stateRef.current.rotationX + dy * 0.008));
      stateRef.current.prevMouseX = e.touches[0].clientX;
      stateRef.current.prevMouseY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const asp = w / h;
      camera.left = -d * asp;
      camera.right = d * asp;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-rotation if enabled and not dragging
      if (stateRef.current.isRotating && !stateRef.current.isDragging) {
        stateRef.current.rotationY += 0.0025;
      }

      // Smooth interpolation of rig rotation
      rig.rotation.y = stateRef.current.rotationY;
      rig.rotation.x = stateRef.current.rotationX * 0.5;

      // Internal Core Animations
      innerCore.rotation.y = elapsed * 0.6;
      innerCore.rotation.x = elapsed * 0.3;
      gyroRing1.rotation.z = elapsed * 0.8;
      gyroRing2.rotation.y = elapsed * 0.5;

      // Gentle levitation breathing
      const breathe = Math.sin(elapsed * 1.5) * 0.15;

      // Dynamic Layer Zoom & Separation target
      let targetTopY = 6.2;
      let targetCoreY = 0;
      let targetBaseY = -6.2;
      let targetRigScale = 1.0;
      let targetRigY = 0;

      if (stateRef.current.activeLayer === 'qr') {
        targetTopY = 2.0;
        targetCoreY = -7.0;
        targetBaseY = -14.0;
        targetRigScale = 1.45;
        targetRigY = -2.0;
      } else if (stateRef.current.activeLayer === 'core') {
        targetTopY = 8.5;
        targetCoreY = 0;
        targetBaseY = -8.5;
        targetRigScale = 1.5;
        targetRigY = 0;
      } else if (stateRef.current.activeLayer === 'base') {
        targetTopY = 14.0;
        targetCoreY = 7.0;
        targetBaseY = -2.0;
        targetRigScale = 1.35;
        targetRigY = 2.5;
      } else {
        // 'all' exploded view
        targetTopY = 6.2 + breathe;
        targetCoreY = 0;
        targetBaseY = -6.2 - breathe;
        targetRigScale = 1.0;
        targetRigY = 0;
      }

      topGroup.position.y = THREE.MathUtils.lerp(topGroup.position.y, targetTopY, 0.08);
      coreGroup.position.y = THREE.MathUtils.lerp(coreGroup.position.y, targetCoreY, 0.08);
      baseGroup.position.y = THREE.MathUtils.lerp(baseGroup.position.y, targetBaseY, 0.08);
      rig.scale.setScalar(THREE.MathUtils.lerp(rig.scale.x, targetRigScale, 0.08));
      rig.position.y = THREE.MathUtils.lerp(rig.position.y, targetRigY, 0.08);

      // Bar columns subtle energy pulse
      bars.forEach((bar, idx) => {
        const pulse = 1 + Math.sin(elapsed * 2 + idx) * 0.04;
        bar.scale.y = pulse;
      });

      // Rotating particles
      particles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[440px] sm:min-h-[500px] cursor-grab active:cursor-grabbing relative"
    />
  );
};
