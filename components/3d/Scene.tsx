"use client";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Component,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Boiler, Collar, Flow, Saddle, Valve } from "./Models";
import { sceneStore, motion, useSceneState } from "./state";
type Anchor = {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: string;
};
type Layout = { anchors: Anchor[]; width: number };
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    sceneStore.set({ sceneStatus: "fallback" });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function World({ layout }: { layout: Layout }) {
  const group = useRef<THREE.Group>(null);
  const { size, gl } = useThree();
  const route = useMemo(() => {
    const points: THREE.Vector3[] = [];
    let valve = new THREE.Vector3(),
      boiler = new THREE.Vector3();
    let saddle = new THREE.Vector3();
    const scales: { valve: number; boiler: number; saddle: number } = {
      valve: 1,
      boiler: 1,
      saddle: 1,
    };
    layout.anchors.forEach((a, i) => {
      const mobile = layout.width < 760;
      const x = a.x - layout.width / 2;
      const top = -a.y;
      const w = a.width;
      const h = a.height;
      if (mobile && i > 0 && points.length && a.y + points.at(-1)!.y > 140) {
        const prev = points.at(-1)!;
        const edge = layout.width / 2 + 4;
        const startX =
          a.kind === "edge"
            ? x + w * 0.5
            : a.kind === "valve"
              ? x + w * 0.53
              : a.kind === "boiler"
                ? x + w * 0.83
                : x + w * 0.75;
        points.push(
          new THREE.Vector3(prev.x, prev.y - 28, 0),
          new THREE.Vector3(edge, prev.y - 65, 0),
          new THREE.Vector3(edge, top + 60, 0),
          new THREE.Vector3(startX, top + 22, 0),
        );
      }
      if (a.kind === "hero") {
        saddle = new THREE.Vector3(x + w * 0.62, top - 80, 0);
        scales.saddle = mobile ? 0.74 : 1;
        points.push(
          saddle.clone(),
          new THREE.Vector3(saddle.x, top - 155, 0),
          new THREE.Vector3(x + w * 0.28, top - h * 0.5, 10),
          new THREE.Vector3(x + w * 0.29, top - h * 0.68, 10),
          new THREE.Vector3(x + w * 0.73, top - h * 0.82, 0),
          new THREE.Vector3(x + w * 0.75, top - h, 0),
        );
      } else if (a.kind === "valve") {
        valve = new THREE.Vector3(x + w * 0.53, top - h * 0.52, 0);
        scales.valve = mobile ? 0.85 : 1.2;
        points.push(
          new THREE.Vector3(valve.x, top, 0),
          new THREE.Vector3(valve.x, valve.y + 140, 0),
          valve.clone(),
          new THREE.Vector3(valve.x, valve.y - 140, 0),
          new THREE.Vector3(x + w * 0.75, top - h, 0),
        );
      } else if (a.kind === "boiler") {
        scales.boiler = mobile ? 0.86 : 1.2;
        boiler = new THREE.Vector3(x + w * 0.5, top - h * 0.45, 30);
        const target = new THREE.Vector3(
          boiler.x,
          boiler.y - 165 * scales.boiler,
          30,
        );
        points.push(
          new THREE.Vector3(x + w * 0.83, top, 0),
          new THREE.Vector3(x + w * 0.87, top - h * 0.64, 0),
          new THREE.Vector3(x + w * 0.8, top - h * 0.86, 0),
          new THREE.Vector3(boiler.x, top - h * 0.86, 20),
          target,
        );
      } else if (a.kind === "edge") {
        points.push(
          new THREE.Vector3(x + w * 0.5, top, 0),
          new THREE.Vector3(x + w * 0.5, top - h, 0),
        );
      } else {
        points.push(
          new THREE.Vector3(x + w * 0.75, top, 0),
          new THREE.Vector3(x + w * 0.3, top - h * 0.32, 12),
          new THREE.Vector3(x + w * 0.27, top - h * 0.55, 12),
          new THREE.Vector3(x + w * 0.72, top - h * 0.8, 0),
          new THREE.Vector3(x + w * 0.75, top - h, 0),
        );
      }
    });
    const uniquePoints = points.filter(
      (p, i) => i === 0 || p.distanceTo(points[i - 1]) > 0.1,
    );
    const curve = new THREE.CatmullRomCurve3(
      uniquePoints,
      false,
      "centripetal",
      0.4,
    );
    curve.arcLengthDivisions = 3000;
    curve.updateArcLengths();
    let closest = Infinity,
      valveAt = 0.5;
    for (let i = 0; i <= 1500; i++) {
      const d = curve.getPointAt(i / 1500).distanceTo(valve);
      if (d < closest) {
        closest = d;
        valveAt = i / 1500;
      }
    }
    return { curve, valve, boiler, saddle, scales, valveAt };
  }, [layout]);
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        route.curve,
        Math.min(1800, Math.ceil(route.curve.getLength() / 9)),
        23,
        12,
        false,
      ),
    [route],
  );
  useEffect(() => {
    motion.valveAt = route.valveAt;
    group.current?.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name !== "shadow-receiver")
        obj.castShadow = true;
    });
    if (new URLSearchParams(location.search).has("routeQA")) {
      const layer = document.querySelector<HTMLElement>("[data-scene-status]");
      if (layer)
        layer.dataset.routeSamples = JSON.stringify(
          route.curve
            .getSpacedPoints(2000)
            .map((p) => [p.x + layout.width / 2, -p.y]),
        );
    }
    return () => geometry.dispose();
  }, [route, geometry, layout.width]);
  useEffect(() => {
    const lost = (e: Event) => {
      e.preventDefault();
      sceneStore.set({ sceneStatus: "fallback" });
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    sceneStore.set({ sceneStatus: "ready" });
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl]);
  useFrame(() => {
    if (group.current)
      group.current.position.y = motion.pageScroll + size.height / 2;
  });
  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight
        position={[-400, 400, 750]}
        intensity={3.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-1500}
        shadow-camera-right={1500}
        shadow-camera-top={1200}
        shadow-camera-bottom={-1200}
        shadow-camera-near={1}
        shadow-camera-far={3000}
        shadow-bias={-0.001}
        shadow-radius={4}
      />
      <directionalLight position={[500, -200, 300]} intensity={1.6} />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[-4, 3, 5]}
          scale={[8, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[5, -3, 3]}
          scale={[2, 8, 1]}
        />
      </Environment>
      <group ref={group}>
        <mesh
          name="shadow-receiver"
          receiveShadow
          position={[0, -(layout.anchors.at(-1)!.y + 700) / 2, -75]}
        >
          <planeGeometry
            args={[layout.width + 500, layout.anchors.at(-1)!.y + 1200]}
          />
          <shadowMaterial transparent opacity={0.14} />
        </mesh>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color="#2e3941"
            metalness={0.28}
            roughness={0.36}
          />
        </mesh>
        <mesh
          position={[
            (layout.anchors[0].x + layout.width + 100) / 2 - layout.width / 2,
            -layout.anchors[0].y - 80,
            0,
          ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry
            args={[34, 34, layout.width - layout.anchors[0].x + 100, 48]}
          />
          <meshStandardMaterial
            color="#4c5963"
            metalness={0.48}
            roughness={0.29}
          />
        </mesh>
        <group position={route.saddle}>
          <Saddle scale={route.scales.saddle} />
        </group>
        <group position={route.valve}>
          <Valve scale={route.scales.valve} />
        </group>
        <group position={route.boiler}>
          <Boiler scale={route.scales.boiler} />
        </group>
        <Flow curve={route.curve} />
        {[0.06, 0.22, 0.72].map((t) => (
          <group
            key={t}
            position={route.curve.getPointAt(t)}
            quaternion={new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              route.curve.getTangentAt(t),
            )}
          >
            <Collar radius={23} length={21} />
          </group>
        ))}
      </group>
    </>
  );
}
export default function Scene() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [dpr, setDpr] = useState(1.5);
  const [visible, setVisible] = useState(true);
  const state = useSceneState();
  const invalidate = useRef<() => void>(() => {});
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) sceneStore.set({ animationMode: "reduced" });
    const change = () =>
      sceneStore.set({ animationMode: media.matches ? "reduced" : "running" });
    media.addEventListener("change", change);
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const anchors = Array.from(
          document.querySelectorAll<HTMLElement>("[data-route]"),
        ).map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left,
            y: r.top + window.scrollY,
            width: r.width,
            height: r.height,
            kind: el.dataset.route ?? "curve",
          };
        });
        if (anchors.length > 1)
          setLayout({ anchors, width: window.innerWidth });
      });
    };
    const scroll = () => {
      motion.pageScroll = window.scrollY;
      invalidate.current();
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.querySelector("main") ?? document.body);
    document.fonts.ready.then(measure);
    measure();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        onUpdate: scroll,
      });
      gsap.utils.toArray<HTMLElement>(".section .protected").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 94%",
          once: true,
          onEnter: () => {
            if (!media.matches)
              gsap.fromTo(
                el,
                { opacity: 0.72, y: 14 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  ease: "power2.out",
                  clearProps: "transform,opacity",
                },
              );
          },
        });
      });
    });
    const visibility = () => {
      motion.hidden = document.hidden;
      setVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", visibility);
    let samples = 0,
      total = 0,
      last = performance.now(),
      raf = 0;
    const sample = (now: number) => {
      const dt = now - last;
      last = now;
      if (!document.hidden && dt < 300) {
        total += dt;
        samples++;
      }
      if (samples === 180) {
        if (total / samples > 32) {
          setDpr(1);
          sceneStore.set({ graphicsQuality: "low" });
        }
        return;
      }
      raf = requestAnimationFrame(sample);
    };
    raf = requestAnimationFrame(sample);
    const query = new URLSearchParams(location.search);
    if (query.get("graphics") === "fallback")
      sceneStore.set({ sceneStatus: "fallback" });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(raf);
      ro.disconnect();
      ctx.revert();
      media.removeEventListener("change", change);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", visibility);
      document.body.style.cursor = "";
    };
  }, []);
  if (!layout || state.sceneStatus === "fallback") return null;
  return (
    <SceneBoundary>
      <Canvas
        shadows
        orthographic
        camera={{ position: [0, 0, 1600], near: 0.1, far: 4000, zoom: 1 }}
        dpr={[1, dpr]}
        onCreated={(s) => {
          invalidate.current = s.invalidate;
        }}
        frameloop={
          !visible
            ? "never"
            : state.animationMode === "running"
              ? "always"
              : "demand"
        }
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <World layout={layout} />
      </Canvas>
    </SceneBoundary>
  );
}
