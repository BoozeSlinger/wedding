"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";

type Venue = "rustic" | "speakeasy" | null;

// ─── Deterministic seeded random (pure, no Math.random in render) ─────────────
function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
}

// ─── Particle Field ───────────────────────────────────────────────────────────
function ParticleField({
  count,
  side,
  color,
  splitX,
  seed,
}: {
  count: number;
  side: "left" | "right";
  color: string;
  splitX: number;
  seed: number;
}) {
  const meshRef = useRef<THREE.Points>(null);

  // geometry + velocities built once from deterministic seed — pure, no Math.random
  const { geo, vel } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const b = seed * 5000 + i * 9;
      const r0 = sr(b);
      const r1 = sr(b + 1);
      const r2 = sr(b + 2);
      const r3 = sr(b + 3);
      const r4 = sr(b + 4);
      const r5 = sr(b + 5);
      pos[i * 3]     = side === "left" ? (r0 - 0.5) * splitX * 2 - splitX / 2 : (r0 - 0.5) * splitX * 2 + splitX / 2;
      pos[i * 3 + 1] = (r1 - 0.5) * 12;
      pos[i * 3 + 2] = (r2 - 0.5) * 8;
      vel[i * 3]     = (r3 - 0.5) * 0.002;
      vel[i * 3 + 1] = -(0.004 + r4 * 0.003);
      vel[i * 3 + 2] = (r5 - 0.5) * 0.001;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo, vel };
  }, [count, side, splitX, seed]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size: 0.03,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color]
  );

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    const p = m.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      p[i * 3]     += vel[i * 3];
      p[i * 3 + 1] += vel[i * 3 + 1];
      p[i * 3 + 2] += vel[i * 3 + 2];
      if (p[i * 3 + 1] < -6) p[i * 3 + 1] = 6;
    }
    m.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={meshRef} geometry={geo} material={mat} />;
}

// ─── Glowing Divider — shader time driven via imperative mesh ref ─────────────
function DividerPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const tRef    = useRef(0);

  // Create material once, imperatively (not during render)
  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    uniforms:    { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float uTime; varying vec2 vUv;
      void main() {
        float a = sin(vUv.y * 3.14159) * 0.9;
        float p = 0.7 + 0.3 * sin(uTime * 1.5 + vUv.y * 6.0);
        vec3 c = mix(vec3(0.77,0.57,0.16), vec3(0.96,0.83,0.42), p);
        gl_FragColor = vec4(c, a * p * 0.95);
      }
    `,
  }), []);

  useFrame((_, dt) => {
    tRef.current += dt;
    // mutate material outside render — this is fine in useFrame
    const material = meshRef.current?.material as THREE.ShaderMaterial | undefined;
    if (material?.uniforms) {
      material.uniforms.uTime.value = tRef.current;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} material={mat}>
        <planeGeometry args={[0.015, 16, 1, 64]} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.3, 16]} />
        <meshBasicMaterial
          color={new THREE.Color(0xc4922a)}
          transparent opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Background Planes with animated shader uniforms ─────────────────────────
function BackgroundPlanes({ hoveredSide }: { hoveredSide: Venue }) {
  const rusticMeshRef = useRef<THREE.Mesh>(null);
  const speakMeshRef  = useRef<THREE.Mesh>(null);
  const rusticHover   = useRef(0);
  const speakHover    = useRef(0);
  const rusticTime    = useRef(0);
  const speakTime     = useRef(0);

  const rusticMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uHover: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float uHover; uniform float uTime; varying vec2 vUv;
      void main() {
        vec3 dark = vec3(0.11,0.07,0.036); vec3 warm = vec3(0.55,0.33,0.08);
        float g = clamp(1.0 - length(vUv - vec2(0.5,0.55)) * 1.2, 0.0, 1.0);
        float p = 0.5 + 0.5 * sin(uTime * 0.6);
        gl_FragColor = vec4(mix(dark, warm, g * (0.12 + uHover * 0.18) * (0.6 + p * 0.4)), 1.0);
      }
    `,
  }), []);

  const speakMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uHover: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float uHover; uniform float uTime; varying vec2 vUv;
      void main() {
        vec3 dark = vec3(0.051,0.039,0.055);
        vec3 col = mix(vec3(0.38,0.108,0.108), vec3(0.52,0.39,0.09), 0.5 + 0.5 * sin(uTime * 0.7 + 1.5));
        float g = clamp(1.0 - length(vUv - vec2(0.5,0.45)) * 1.3, 0.0, 1.0);
        gl_FragColor = vec4(mix(dark, col, g * (0.1 + uHover * 0.22)), 1.0);
      }
    `,
  }), []);

  useFrame((_, dt) => {
    // Lerp hover values — purely imperative, no render
    const tR = hoveredSide === "rustic" ? 1 : 0;
    const tS = hoveredSide === "speakeasy" ? 1 : 0;
    rusticHover.current += (tR - rusticHover.current) * 0.06;
    speakHover.current  += (tS - speakHover.current) * 0.06;
    rusticTime.current  += dt;
    speakTime.current   += dt;

    const rm = rusticMeshRef.current?.material as THREE.ShaderMaterial | undefined;
    const sm = speakMeshRef.current?.material as THREE.ShaderMaterial | undefined;
    if (rm?.uniforms) {
      rm.uniforms.uHover.value = rusticHover.current;
      rm.uniforms.uTime.value  = rusticTime.current;
    }
    if (sm?.uniforms) {
      sm.uniforms.uHover.value = speakHover.current;
      sm.uniforms.uTime.value  = speakTime.current;
    }
  });

  return (
    <>
      <mesh ref={rusticMeshRef} position={[-3.5, 0, -2]} material={rusticMat}>
        <planeGeometry args={[7, 10]} />
      </mesh>
      <mesh ref={speakMeshRef} position={[3.5, 0, -2]} material={speakMat}>
        <planeGeometry args={[7, 10]} />
      </mesh>
    </>
  );
}

// ─── Camera Rig ───────────────────────────────────────────────────────────────
function CameraRig({
  mouseX, mouseY, warpProgress, warpVenue,
}: {
  mouseX: number; mouseY: number; warpProgress: number; warpVenue: Venue;
}) {
  useFrame(({ camera }) => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x += (mouseX * 0.4 - cam.position.x) * 0.04;
    cam.position.y += (mouseY * 0.25 - cam.position.y) * 0.04;
    if (warpProgress > 0) {
      const destX = warpVenue === "rustic" ? -4 : 4;
      cam.position.x += (destX - cam.position.x) * warpProgress * 0.12;
      cam.position.z  = THREE.MathUtils.lerp(cam.position.z, -8 + warpProgress * 8, warpProgress * 0.08);
      cam.fov         = THREE.MathUtils.lerp(cam.fov, 75 + warpProgress * 30, 0.08);
      cam.updateProjectionMatrix();
    }
    cam.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({
  mouseX, mouseY, hoveredSide, warpProgress, warpVenue,
}: {
  mouseX: number; mouseY: number; hoveredSide: Venue; warpProgress: number; warpVenue: Venue;
}) {
  return (
    <>
      <BackgroundPlanes hoveredSide={hoveredSide} />
      <ParticleField count={600} side="left"  color="#c4922a" splitX={3.5} seed={1} />
      <ParticleField count={200} side="left"  color="#ff6b35" splitX={2.5} seed={2} />
      <ParticleField count={500} side="right" color="#9b1c1c" splitX={3.5} seed={3} />
      <ParticleField count={200} side="right" color="#d4a017" splitX={2.5} seed={4} />
      <DividerPlane />
      <CameraRig mouseX={mouseX} mouseY={mouseY} warpProgress={warpProgress} warpVenue={warpVenue} />
    </>
  );
}

// ─── Main Portal ──────────────────────────────────────────────────────────────
export default function VenuePortal3D() {
  const router = useRouter();
  const [hoveredSide,    setHoveredSide]    = useState<Venue>(null);
  const [isTransitioning,setIsTransitioning]= useState(false);
  const [warpProgress,   setWarpProgress]   = useState(0);
  const [warpVenue,      setWarpVenue]      = useState<Venue>(null);
  const [mouseX,         setMouseX]         = useState(0);
  const [mouseY,         setMouseY]         = useState(0);
  const warpRef = useRef(0);
  const rafRef  = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const nx = (clientX / width  - 0.5) * 2;
    const ny = -(clientY / height - 0.5) * 2;
    setMouseX(nx); setMouseY(ny);
    setHoveredSide(nx < 0 ? "rustic" : "speakeasy");
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSide(null); setMouseX(0); setMouseY(0);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    const venue: Venue = (e.clientX / window.innerWidth - 0.5) * 2 < 0 ? "rustic" : "speakeasy";
    setIsTransitioning(true); setWarpVenue(venue);
    const animate = () => {
      warpRef.current += 0.025;
      setWarpProgress(Math.min(warpRef.current, 1));
      if (warpRef.current >= 1) router.push(`/venue/${venue}`);
      else rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [isTransitioning, router]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: "none" }}
    >
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#0a0805" }}
      >
        <Scene
          mouseX={mouseX} mouseY={mouseY}
          hoveredSide={hoveredSide}
          warpProgress={warpProgress} warpVenue={warpVenue}
        />
      </Canvas>

      {/* HTML overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
        <div className="font-ui text-xs tracking-[0.45em] text-center mb-8"
          style={{ color: "rgba(196,146,42,0.55)", textShadow: "0 0 20px rgba(196,146,42,0.3)" }}>
          THE MOST IMPORTANT DAY OF YOUR LIFE DESERVES THE RIGHT SETTING.
        </div>
        <h1 className="font-display text-center leading-none"
          style={{ fontSize: "clamp(3.2rem,8vw,8.5rem)", color: "rgba(245,240,232,0.96)",
            textShadow: "0 4px 60px rgba(0,0,0,0.95), 0 0 80px rgba(196,146,42,0.15)" }}>
          Two Venues.
          <br />
          <span style={{
            color: hoveredSide === "rustic" ? "#c4922a" : hoveredSide === "speakeasy" ? "#d4a017" : "rgba(245,240,232,0.96)",
            transition: "color 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}>One Day.</span>
        </h1>
        <div className="font-ui mt-10 text-xs tracking-[0.3em] flex items-center gap-4"
          style={{ color: "rgba(196,146,42,0.4)" }}>
          <div className="w-8 h-px" style={{ background: "linear-gradient(to right,transparent,rgba(196,146,42,0.4))" }} />
          HOVER TO FEEL IT · CLICK TO STEP INSIDE
          <div className="w-8 h-px" style={{ background: "linear-gradient(to left,transparent,rgba(196,146,42,0.4))" }} />
        </div>

        <div className="absolute inset-0 flex pointer-events-none">
          <div className="flex-1 flex flex-col items-center justify-end pb-16"
            style={{ opacity: hoveredSide === "speakeasy" ? 0.15 : 1, transition: "opacity 0.6s ease" }}>
            <div className="font-editorial text-center"
              style={{ fontSize: "clamp(1rem,2.5vw,1.8rem)", color: "#e8b96e", letterSpacing: "0.2em", textShadow: "0 0 30px rgba(196,146,42,0.4)" }}>
              THE RANCH</div>
            <div className="font-ui text-xs mt-2"
              style={{ color: "rgba(196,146,42,0.5)", letterSpacing: "0.25em" }}>
              12 ACRES · 350 GUESTS · OPEN SKIES</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-end pb-16"
            style={{ opacity: hoveredSide === "rustic" ? 0.15 : 1, transition: "opacity 0.6s ease" }}>
            <div className="font-editorial text-center"
              style={{ fontSize: "clamp(1rem,2.5vw,1.8rem)", color: "#d4a017", letterSpacing: "0.2em", textShadow: "0 0 30px rgba(212,160,23,0.4)" }}>
              THE VAULT</div>
            <div className="font-ui text-xs mt-2"
              style={{ color: "rgba(212,160,23,0.5)", letterSpacing: "0.25em" }}>
              EST. 1924 · 200 GUESTS · DOWNTOWN</div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden py-3"
        style={{ borderTop: "1px solid rgba(196,146,42,0.12)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <div style={{ animation: "ticker 30s linear infinite", display: "flex", width: "max-content" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center"
              style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(196,146,42,0.4)" }}>
              {["FULL-SERVICE WEDDING PLANNING","VENUES AVAILABLE SPRING & FALL 2026","ALL-INCLUSIVE PACKAGES FROM $18K","OPEN-FIRE & BESPOKE CATERING","PRIVATE SITE TOURS AVAILABLE","LAST CALL WEDDING CO. · EST. IN LOVE"]
                .map((t, j) => <span key={j} className="mx-8">{t} <span style={{ color: "rgba(196,146,42,0.2)" }}>◆</span></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* Warp flash */}
      {warpProgress > 0 && (
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 20,
          background: `radial-gradient(ellipse at ${warpVenue === "rustic" ? "25%" : "75%"} 50%, rgba(${warpVenue === "rustic" ? "196,146,42" : "212,160,23"},${warpProgress * 0.6}) 0%, transparent 70%)`,
          opacity: Math.sin(warpProgress * Math.PI),
        }} />
      )}
    </div>
  );
}
