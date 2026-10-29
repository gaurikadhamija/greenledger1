import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Zap, Sun, BatteryCharging, Building, Eye } from 'lucide-react';

export const ThreeCampusSpecimen: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  const stateRef = useRef({
    isRotating,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    rotationY: 0.65,
    rotationX: 0.55,
    zoom: 1.0,
  });

  useEffect(() => {
    stateRef.current.isRotating = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    // CAMERA (Axonometric style)
    const aspect = width / height;
    const d = 16;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(24, 22, 24);
    camera.lookAt(0, 1, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x574539, 1.2);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(20, 35, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const blueSkyFill = new THREE.DirectionalLight(0x57927f, 0.8);
    blueSkyFill.position.set(-20, 10, -20);
    scene.add(blueSkyFill);

    // ROOT RIG
    const rig = new THREE.Group();
    scene.add(rig);

    // PALETTE
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf0edde,
      roughness: 0.8,
      metalness: 0.05,
    });
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0xd9e5dc,
      roughness: 0.9,
    });
    const pathwayMat = new THREE.MeshStandardMaterial({
      color: 0xe2dcc9,
      roughness: 0.6,
    });
    const buildingWallMat = new THREE.MeshStandardMaterial({
      color: 0xdfd8c5,
      roughness: 0.4,
      metalness: 0.1,
    });
    const woodFinMat = new THREE.MeshStandardMaterial({
      color: 0x8c6d46,
      roughness: 0.5,
    });
    const glassRoofMat = new THREE.MeshPhysicalMaterial({
      color: 0x57927f,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7,
      transmission: 0.6,
    });
    const solarPanelMat = new THREE.MeshStandardMaterial({
      color: 0x1a2e3b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const copperAccentMat = new THREE.MeshStandardMaterial({
      color: 0x960d41,
      metalness: 0.5,
      roughness: 0.3,
    });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x98b8b0,
      roughness: 0.2,
      metalness: 0.4,
    });

    // 1. GROUND SITE PLAN
    const groundGeo = new THREE.BoxGeometry(28, 0.6, 22);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    rig.add(ground);

    // Site Plan Grid Hairlines
    const siteGrid = new THREE.GridHelper(26, 26, 0xcfc7b4, 0xe0d9c6);
    siteGrid.position.y = 0.02;
    rig.add(siteGrid);

    // Central Green Courtyard & Garden Beds
    const courtyardGeo = new THREE.BoxGeometry(8, 0.05, 8);
    const courtyard = new THREE.Mesh(courtyardGeo, grassMat);
    courtyard.position.set(0, 0.03, 0);
    rig.add(courtyard);

    // Rain Garden & Water Basin
    const pondGeo = new THREE.CylinderGeometry(2, 2.2, 0.08, 16);
    const pond = new THREE.Mesh(pondGeo, waterMat);
    pond.position.set(-6.5, 0.04, 5.5);
    rig.add(pond);

    // Pathways
    const path1Geo = new THREE.BoxGeometry(1.4, 0.04, 20);
    const path1 = new THREE.Mesh(path1Geo, pathwayMat);
    path1.position.set(0, 0.03, 0);
    rig.add(path1);

    const path2Geo = new THREE.BoxGeometry(26, 0.04, 1.4);
    const path2 = new THREE.Mesh(path2Geo, pathwayMat);
    path2.position.set(0, 0.03, 0);
    rig.add(path2);

    // 2. BUILDINGS
    // Helper to build modern architectural block with fins and solar panels
    const createBuilding = (
      w: number,
      h: number,
      d: number,
      x: number,
      z: number,
      hasSolar: boolean,
      name: string
    ) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(x, 0, z);

      // Main structure
      const bGeo = new THREE.BoxGeometry(w, h, d);
      const bMesh = new THREE.Mesh(bGeo, buildingWallMat);
      bMesh.position.y = h / 2;
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      bGroup.add(bMesh);

      // Building Wireframe Outlines
      const bEdges = new THREE.EdgesGeometry(bGeo);
      const bWire = new THREE.LineSegments(
        bEdges,
        new THREE.LineBasicMaterial({ color: 0x574539, linewidth: 1 })
      );
      bWire.position.y = h / 2;
      bGroup.add(bWire);

      // Exterior Architectural Louvers / Vertical Wood Fins
      const finCount = Math.floor(w / 0.8);
      for (let i = 0; i < finCount; i++) {
        const finGeo = new THREE.BoxGeometry(0.12, h * 0.85, 0.3);
        const fin = new THREE.Mesh(finGeo, woodFinMat);
        fin.position.set(-w / 2 + 0.4 + i * 0.8, h / 2, d / 2 + 0.15);
        bGroup.add(fin);
      }

      // Rooftop Parapet
      const roofCapGeo = new THREE.BoxGeometry(w + 0.1, 0.15, d + 0.1);
      const roofCap = new THREE.Mesh(roofCapGeo, copperAccentMat);
      roofCap.position.y = h + 0.08;
      bGroup.add(roofCap);

      // Skylight or Solar Arrays
      if (hasSolar) {
        // Solar panel rows on roof
        const rows = 3;
        const cols = Math.floor((w - 1) / 1.2);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const pGeo = new THREE.BoxGeometry(1.0, 0.1, 0.8);
            const panel = new THREE.Mesh(pGeo, solarPanelMat);
            panel.position.set(-w / 2 + 1.0 + c * 1.2, h + 0.25, -d / 2 + 1.0 + r * 1.2);
            panel.rotation.x = -0.15; // angled toward sun
            bGroup.add(panel);
          }
        }
      } else {
        // Green roof or glass skylight
        const skyGeo = new THREE.BoxGeometry(w * 0.6, 0.3, d * 0.5);
        const skylight = new THREE.Mesh(skyGeo, glassRoofMat);
        skylight.position.set(0, h + 0.2, 0);
        bGroup.add(skylight);
      }

      rig.add(bGroup);
      return bGroup;
    };

    // Building 1: Materials Innovation Lab (Solar Roof 240 kWp) - Top Left
    createBuilding(7, 3.8, 6, -6.5, -4.5, true, 'Materials Lab');

    // Building 2: Biotech Research Center - Top Right
    createBuilding(6.5, 4.5, 6, 6.5, -4.5, true, 'Biotech Center');

    // Building 3: Academic Hub (Green Roof & Skylights) - Bottom Left
    createBuilding(7, 3.2, 5.5, -6.5, 5.0, false, 'Academic Hub');

    // Building 4: Central Utility & Substation - Bottom Right
    createBuilding(6, 2.8, 5.5, 6.5, 5.0, false, 'Central Utility');

    // 3. BATTERY ENERGY STORAGE CONTAINER (BESS 4 MWh)
    const bessGroup = new THREE.Group();
    bessGroup.position.set(2.0, 0, 7.5);

    const bessGeo = new THREE.BoxGeometry(3.5, 1.8, 1.6);
    const bessMesh = new THREE.Mesh(
      bessGeo,
      new THREE.MeshStandardMaterial({ color: 0x27544a, roughness: 0.3, metalness: 0.6 })
    );
    bessMesh.position.y = 0.9;
    bessMesh.castShadow = true;
    bessGroup.add(bessMesh);

    // Glowing BESS Status LED
    const ledGeo = new THREE.BoxGeometry(0.8, 0.2, 0.05);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x57927f });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 1.2, 0.82);
    bessGroup.add(led);

    rig.add(bessGroup);

    // 4. ANIMATED POWER CONDUIT PULSES (Flowing Energy Beams)
    // Conduits from Solar Roofs into BESS and Hub
    const conduitCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.5, 4.0, -4.5),
      new THREE.Vector3(0, 2.0, -2.0),
      new THREE.Vector3(2.0, 1.0, 7.5),
    ]);
    const conduitCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(6.5, 4.7, -4.5),
      new THREE.Vector3(3.0, 2.0, 0),
      new THREE.Vector3(2.0, 1.0, 7.5),
    ]);

    const drawConduit = (curve: THREE.CatmullRomCurve3) => {
      const points = curve.getPoints(50);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineDashedMaterial({
        color: 0x960d41,
        dashSize: 0.6,
        gapSize: 0.3,
      });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      rig.add(line);
      return line;
    };

    const cLine1 = drawConduit(conduitCurve1);
    const cLine2 = drawConduit(conduitCurve2);

    // Flowing energy particle sparks
    const sparkCount = 8;
    const sparkGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xeaceaa });
    const sparks: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; progress: number }[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const mesh = new THREE.Mesh(sparkGeo, sparkMat);
      rig.add(mesh);
      sparks.push({
        mesh,
        curve: i % 2 === 0 ? conduitCurve1 : conduitCurve2,
        progress: (i / sparkCount),
      });
    }

    // MOUSE DRAG ORBIT
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
      stateRef.current.rotationX = Math.max(0.2, Math.min(1.1, stateRef.current.rotationX + dy * 0.008));
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
      stateRef.current.rotationX = Math.max(0.2, Math.min(1.1, stateRef.current.rotationX + dy * 0.008));
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
      camera.left = -d * asp * stateRef.current.zoom;
      camera.right = d * asp * stateRef.current.zoom;
      camera.top = d * stateRef.current.zoom;
      camera.bottom = -d * stateRef.current.zoom;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // ANIMATION
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth auto-orbit if not dragging
      if (stateRef.current.isRotating && !stateRef.current.isDragging) {
        stateRef.current.rotationY += 0.003;
      }

      rig.rotation.y = stateRef.current.rotationY;
      rig.rotation.x = stateRef.current.rotationX * 0.5;

      // Energy Sparks Moving along conduits
      sparks.forEach((s) => {
        s.progress = (s.progress + 0.008) % 1.0;
        const pt = s.curve.getPointAt(s.progress);
        s.mesh.position.copy(pt);
      });

      // Pulse LED on BESS
      led.scale.x = 1 + Math.sin(elapsed * 4) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

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
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] bg-[#f7f4e9] rounded-xl overflow-hidden border border-[#cfc7b4] shadow-inner select-none group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full min-h-[380px] sm:min-h-[440px] cursor-grab active:cursor-grabbing" />

      {/* Technical Corner Brackets matching Pramaan Design */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#960d41] pointer-events-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#960d41] pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#960d41] pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#960d41] pointer-events-none" />

      {/* Animated Laser Scanline */}
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#960d41] to-transparent animate-scanline pointer-events-none opacity-80 shadow-[0_0_8px_#960d41]" />

      {/* CRISP, READABLE 3D FLOATING CALLOUT LABELS (User requested: "readable text and rotating or moving with animation effect") */}
      {/* Pin 1: Materials Innovation Lab / Solar Roof */}
      <div className="absolute top-6 left-6 z-20">
        <div
          onMouseEnter={() => setActiveCallout('solar')}
          onMouseLeave={() => setActiveCallout(null)}
          className={`px-3 py-1.5 rounded-lg border backdrop-blur-xs transition-all shadow-md cursor-pointer ${
            activeCallout === 'solar'
              ? 'bg-[#21150f] text-white border-[#960d41] scale-105'
              : 'bg-[#fffefa]/95 text-[#21150f] border-[#cfc7b4]'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#960d41]">
            <Sun className="w-3 h-3 text-[#960d41] animate-spin" style={{ animationDuration: '10s' }} />
            <span>SOLAR ARRAY · 240 kWp</span>
          </div>
          <p className="text-[11px] font-sans font-semibold mt-0.5">Materials Innovation Lab</p>
          <p className="text-[9px] font-mono text-[#57927f]">14,200 kWh/mo · Grid Export</p>
        </div>
      </div>

      {/* Pin 2: Academic Hub / Green Roof */}
      <div className="absolute bottom-16 left-6 z-20">
        <div
          onMouseEnter={() => setActiveCallout('hub')}
          onMouseLeave={() => setActiveCallout(null)}
          className={`px-3 py-1.5 rounded-lg border backdrop-blur-xs transition-all shadow-md cursor-pointer ${
            activeCallout === 'hub'
              ? 'bg-[#21150f] text-white border-[#09453d] scale-105'
              : 'bg-[#fffefa]/95 text-[#21150f] border-[#cfc7b4]'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#09453d]">
            <Building className="w-3 h-3 text-[#09453d]" />
            <span>ACADEMIC HUB</span>
          </div>
          <p className="text-[11px] font-sans font-semibold mt-0.5">Green Roof & Skylights</p>
          <p className="text-[9px] font-mono text-[#6f6052]">Passive Thermal Buffer</p>
        </div>
      </div>

      {/* Pin 3: Biotech Research Center / Sub-meter */}
      <div className="absolute top-6 right-6 z-20 text-right">
        <div
          onMouseEnter={() => setActiveCallout('biotech')}
          onMouseLeave={() => setActiveCallout(null)}
          className={`px-3 py-1.5 rounded-lg border backdrop-blur-xs transition-all shadow-md cursor-pointer ${
            activeCallout === 'biotech'
              ? 'bg-[#21150f] text-white border-[#960d41] scale-105'
              : 'bg-[#fffefa]/95 text-[#21150f] border-[#cfc7b4]'
          }`}
        >
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono font-bold text-[#960d41]">
            <Zap className="w-3 h-3 text-[#960d41] animate-pulse" />
            <span>BIOTECH RESEARCH</span>
          </div>
          <p className="text-[11px] font-sans font-semibold mt-0.5">Sub-meter #4B Feeder</p>
          <p className="text-[9px] font-mono text-[#09453d]">Peak 380 kW · Chiller Overhaul</p>
        </div>
      </div>

      {/* Pin 4: Energy Storage BESS */}
      <div className="absolute bottom-16 right-6 z-20 text-right">
        <div
          onMouseEnter={() => setActiveCallout('bess')}
          onMouseLeave={() => setActiveCallout(null)}
          className={`px-3 py-1.5 rounded-lg border backdrop-blur-xs transition-all shadow-md cursor-pointer ${
            activeCallout === 'bess'
              ? 'bg-[#21150f] text-white border-[#27544a] scale-105'
              : 'bg-[#fffefa]/95 text-[#21150f] border-[#cfc7b4]'
          }`}
        >
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono font-bold text-[#27544a]">
            <BatteryCharging className="w-3.5 h-3.5 text-[#09453d]" />
            <span>BESS STORAGE · 4 MWh</span>
          </div>
          <p className="text-[11px] font-sans font-semibold mt-0.5">Central Utility Plant</p>
          <p className="text-[9px] font-mono text-[#09453d]">94% Charge · Peak Shaving Active</p>
        </div>
      </div>

      {/* Top Center Controls: Rotation Toggle & Telemetry Cue */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1 rounded-full text-[10px] font-mono border backdrop-blur-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
            isRotating
              ? 'bg-[#fffefa]/95 text-[#09453d] border-[#09453d]'
              : 'bg-[#f4f0e5]/95 text-[#574539] border-[#cfc7b4]'
          }`}
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <span>{isRotating ? '3D ORBIT ACTIVE' : 'ORBIT PAUSED'}</span>
        </button>
      </div>

      {/* Reticle / Optical Focus Stamp (Crisp & Readable) */}
      <div className="absolute bottom-3 right-4 z-20 bg-[#fffefa]/95 backdrop-blur-xs border border-[#cfc7b4] px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#21150f] flex items-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#09453d] animate-pulse" />
        <span className="font-bold">SPECIMEN: DELHI CAMPUS AUDIT #IGDTUW-2026 · 3D DIGITAL TWIN</span>
      </div>

      {/* Orbit drag cue */}
      <div className="absolute bottom-3 left-4 z-20 text-[10px] font-mono text-[#6f6052] hidden sm:block">
        DRAG TO ORBIT · HOVER PINS TO INSPECT
      </div>
    </div>
  );
};
