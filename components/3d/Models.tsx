"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { sceneStore, motion } from "./state";
const steel = { color: "#b7c0c6", metalness: 0.94, roughness: 0.24 };
const dark = { color: "#28343d", metalness: 0.22, roughness: 0.35 };
const brass = { color: "#bca16f", metalness: 0.83, roughness: 0.28 };
export function Collar({
  radius = 26,
  length = 28,
}: {
  radius?: number;
  length?: number;
}) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[radius * 1.32, radius * 1.32, length, 40]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {[-1, 1].map((k) => (
        <mesh
          key={k}
          position={[0, k * (length / 2 - 2), 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[radius * 1.34, 2.8, 8, 36]} />
          <meshStandardMaterial {...dark} />
        </mesh>
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * radius * 1.13,
              0,
              Math.sin(a) * radius * 1.13,
            ]}
          >
            <cylinderGeometry args={[5, 5, length + 8, 6]} />
            <meshStandardMaterial {...steel} />
          </mesh>
        );
      })}
    </group>
  );
}
export function Saddle({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[40, 40, 94, 40, 1, true]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {[-35, 35].map((x) => (
          <mesh key={x} position={[0, x, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[42, 4, 10, 40]} />
            <meshStandardMaterial {...dark} />
          </mesh>
        ))}
      </group>
      <RoundedBox
        args={[62, 22, 68]}
        radius={5}
        smoothness={3}
        position={[0, -26, 0]}
      >
        <meshStandardMaterial {...steel} />
      </RoundedBox>
      <mesh position={[0, -49, 0]}>
        <cylinderGeometry args={[26, 28, 45, 40]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      <group position={[0, -73, 0]}>
        <Collar radius={25} length={18} />
      </group>
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x},${z}`} position={[x * 25, -40, z * 24]}>
            <cylinderGeometry args={[6, 6, 14, 6]} />
            <meshStandardMaterial {...steel} />
          </mesh>
        )),
      )}
    </group>
  );
}
export function Valve({ scale = 1 }: { scale?: number }) {
  const handle = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!handle.current) return;
    const s = sceneStore.get();
    const target = s.valveState === "open" ? 0 : Math.PI / 2;
    handle.current.rotation.z =
      s.animationMode === "reduced"
        ? target
        : THREE.MathUtils.damp(
            handle.current.rotation.z,
            target,
            7,
            Math.min(dt, 0.05),
          );
  });
  return (
    <group scale={scale}>
      <mesh>
        <cylinderGeometry args={[36, 36, 100, 40]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 27]}>
        <cylinderGeometry args={[17, 22, 54, 32]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {[-65, 65].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <Collar radius={27} length={28} />
        </group>
      ))}
      <group
        position={[0, 0, 72]}
        ref={handle}
        rotation={[0, 0, Math.PI / 2]}
        onClick={(e) => {
          e.stopPropagation();
          sceneStore.open();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <RoundedBox
          args={[30, 166, 20]}
          radius={9}
          smoothness={4}
          position={[0, 50, 0]}
        >
          <meshStandardMaterial
            color="#155ecd"
            roughness={0.31}
            metalness={0.2}
          />
        </RoundedBox>
        <mesh position={[0, 0, 13]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[14, 14, 8, 6]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <RoundedBox
          args={[34, 72, 23]}
          radius={9}
          smoothness={4}
          position={[0, 90, 0]}
        >
          <meshStandardMaterial color="#103f87" roughness={0.72} />
        </RoundedBox>
      </group>
    </group>
  );
}
export function Boiler({ scale = 1 }: { scale?: number }) {
  const indicator = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (indicator.current) {
      const active = sceneStore.get().boilerState === "active";
      indicator.current.color.set(active ? "#53bd8a" : "#788a96");
      indicator.current.emissive.set(active ? "#267556" : "#000000");
    }
  });
  return (
    <group scale={scale} rotation={[0.1, -0.3, 0]}>
      <RoundedBox
        args={[226, 328, 114]}
        radius={14}
        smoothness={5}
        position={[0, 35, 0]}
      >
        <meshStandardMaterial
          color="#e3e6e5"
          metalness={0.22}
          roughness={0.25}
        />
      </RoundedBox>
      <RoundedBox
        args={[218, 310, 14]}
        radius={11}
        smoothness={4}
        position={[0, 40, 58]}
      >
        <meshStandardMaterial
          color="#fafbf9"
          metalness={0.12}
          roughness={0.26}
        />
      </RoundedBox>
      <mesh position={[0, 207, -13]}>
        <cylinderGeometry args={[34, 34, 54, 40]} />
        <meshStandardMaterial
          color="#e4e7e6"
          metalness={0.22}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 236, -13]}>
        <cylinderGeometry args={[41, 41, 12, 40]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <RoundedBox args={[182, 53, 8]} radius={6} position={[0, -63, 70]}>
        <meshStandardMaterial color="#24303a" roughness={0.32} />
      </RoundedBox>
      <RoundedBox args={[72, 28, 3]} radius={3} position={[0, -63, 76]}>
        <meshStandardMaterial ref={indicator} />
      </RoundedBox>
      {[-1, 1].map((i) => (
        <mesh
          key={i}
          position={[i * 64, -63, 79]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[10, 10, 8, 32]} />
          <meshStandardMaterial
            color="#d1d8d9"
            metalness={0.65}
            roughness={0.24}
          />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <RoundedBox
          key={i}
          args={[54, 2.4, 2]}
          radius={1}
          smoothness={2}
          position={[0, 110 + i * 6, 69]}
        >
          <meshStandardMaterial color="#c3ccce" roughness={0.45} />
        </RoundedBox>
      ))}
      {[-68, 0, 68].map((x) => (
        <group key={x} position={[x, -142, 0]}>
          <mesh>
            <cylinderGeometry
              args={[x === 0 ? 17 : 11, x === 0 ? 17 : 11, 34, 24]}
            />
            <meshStandardMaterial {...brass} />
          </mesh>
          <group position={[0, -18, 0]}>
            <Collar radius={x === 0 ? 17 : 11} length={14} />
          </group>
        </group>
      ))}
    </group>
  );
}
export function Flow({ curve }: { curve: THREE.Curve<THREE.Vector3> }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const last = useRef(0);
  const length = curve.getLength();
  useFrame((_, delta) => {
    const s = sceneStore.get();
    if (s.animationMode === "running" && !motion.hidden) {
      motion.flowProgress = Math.min(
        s.valveState === "closed" ? motion.valveAt : 1,
        motion.flowProgress + (Math.min(delta, 0.05) * 360) / length,
      );
      last.current += Math.min(delta, 0.05) * 360;
    }
    if (
      motion.flowProgress >= 0.999 &&
      s.valveState === "open" &&
      s.boilerState !== "active"
    )
      sceneStore.set({ boilerState: "active" });
    rings.current.forEach((mesh, i) => {
      if (!mesh) return;
      let d = (last.current - i * 165) % length;
      if (d < 0) d += length;
      const t = d / length;
      mesh.visible =
        t <= motion.flowProgress &&
        (s.valveState === "open" || t <= motion.valveAt);
      if (!mesh.visible) return;
      const p = curve.getPointAt(t);
      mesh.position.copy(p);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        curve.getTangentAt(t),
      );
    });
  });
  return (
    <group>
      {Array.from({ length: 28 }, (_, i) => (
        <mesh
          key={i}
          ref={(r) => {
            rings.current[i] = r;
          }}
        >
          <torusGeometry args={[24.5, 2, 6, 24]} />
          <meshStandardMaterial
            color="#61a7fa"
            emissive="#2e7bdb"
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
