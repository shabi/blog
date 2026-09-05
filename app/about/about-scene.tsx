"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const BG = new THREE.Color("#FCFCFC");
const SHADOW = new THREE.Color("#CFCFCF");

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position =
      projectionMatrix *
      viewMatrix *
      worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 bgColor;
  uniform vec3 shadowColor;
  uniform vec3 lightDirection;

  varying vec3 vNormal;
  varying vec3 vWorldNormal;

  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 l = normalize(lightDirection);

    float light = dot(n, l);

    /*
     * Left / upper facing surfaces become the exact
     * page background and visually disappear into it.
     *
     * Only the turning-away surfaces gradually become gray.
     */
    float shadow = smoothstep(0.42, -0.20, light);

    /*
     * Keep the shadow very soft.
     */
    shadow = pow(shadow, 1.35) * 0.72;

    vec3 color = mix(
      bgColor,
      shadowColor,
      shadow
    );

    gl_FragColor = vec4(color, 1.0);
  }
`;

function PressureMaterial() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        bgColor: {
          value: BG,
        },
        shadowColor: {
          value: SHADOW,
        },
        lightDirection: {
          value: new THREE.Vector3(
            -0.7,
            0.9,
            1.0,
          ).normalize(),
        },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
  }, []);

  return (
    <primitive
      object={material}
      attach="material"
    />
  );
}

function Head() {
  return (
    <group position={[0, 0.10, 0.42]}>
      {/* Skull */}
      <mesh
        scale={[0.78, 0.98, 0.62]}
      >
        <sphereGeometry
          args={[1, 64, 48]}
        />

        <PressureMaterial />
      </mesh>

      {/* Nose */}
      <mesh
        position={[
          0,
          -0.01,
          0.59,
        ]}
        scale={[
          0.14,
          0.29,
          0.20,
        ]}
      >
        <sphereGeometry
          args={[1, 48, 32]}
        />

        <PressureMaterial />
      </mesh>

      {/* Mouth / chin pressure */}
      <mesh
        position={[
          0,
          -0.52,
          0.28,
        ]}
        scale={[
          0.36,
          0.14,
          0.23,
        ]}
      >
        <sphereGeometry
          args={[1, 48, 32]}
        />

        <PressureMaterial />
      </mesh>
    </group>
  );
}

function Limb({
  position,
  rotation,
  length,
  radius,
  endScale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
  radius: number;
  endScale?: number;
}) {
  return (
    <group
      position={position}
      rotation={rotation}
    >
      <mesh>
        <capsuleGeometry
          args={[
            radius,
            length,
            16,
            32,
          ]}
        />

        <PressureMaterial />
      </mesh>

      <mesh
        position={[
          0,
          -(length / 2 + radius * 0.50),
          0,
        ]}
        scale={[
          endScale,
          endScale,
          endScale,
        ]}
      >
        <sphereGeometry
          args={[
            radius * 1.22,
            32,
            24,
          ]}
        />

        <PressureMaterial />
      </mesh>
    </group>
  );
}

function Limbs() {
  return (
    <>
      {/* Upper left */}
      <Limb
        position={[
          -2.75,
          1.85,
          0.28,
        ]}
        rotation={[
          0,
          0,
          -0.72,
        ]}
        length={2.05}
        radius={0.27}
        endScale={0.88}
      />

      {/* Upper right */}
      <Limb
        position={[
          2.65,
          1.50,
          0.25,
        ]}
        rotation={[
          0,
          0,
          0.88,
        ]}
        length={2.0}
        radius={0.28}
        endScale={0.9}
      />

      {/* Middle left */}
      <Limb
        position={[
          -3.05,
          0.05,
          0.22,
        ]}
        rotation={[
          0,
          0,
          -1.10,
        ]}
        length={1.45}
        radius={0.22}
        endScale={0.72}
      />

      {/* Middle right */}
      <Limb
        position={[
          2.18,
          -0.25,
          0.20,
        ]}
        rotation={[
          0,
          0,
          1.00,
        ]}
        length={1.35}
        radius={0.21}
        endScale={0.72}
      />

      {/* Lower left */}
      <Limb
        position={[
          -2.0,
          -1.82,
          0.22,
        ]}
        rotation={[
          0,
          0,
          -0.15,
        ]}
        length={2.55}
        radius={0.32}
        endScale={1.05}
      />

      {/* Lower right */}
      <Limb
        position={[
          2.35,
          -1.92,
          0.22,
        ]}
        rotation={[
          0,
          0,
          0.17,
        ]}
        length={2.50}
        radius={0.32}
        endScale={1.05}
      />

      {/* Bottom center */}
      <Limb
        position={[
          -0.60,
          -2.48,
          0.18,
        ]}
        rotation={[
          0,
          0,
          -0.45,
        ]}
        length={1.35}
        radius={0.21}
        endScale={0.78}
      />
    </>
  );
}

function CameraRig() {
  const { camera } = useThree();

  const dragging = useRef(false);

  const last = useRef({
    x: 0,
    y: 0,
  });

  const target = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const onDown = (
      event: PointerEvent,
    ) => {
      dragging.current = true;

      last.current.x =
        event.clientX;

      last.current.y =
        event.clientY;
    };

    const onMove = (
      event: PointerEvent,
    ) => {
      if (!dragging.current) {
        return;
      }

      const dx =
        event.clientX -
        last.current.x;

      const dy =
        event.clientY -
        last.current.y;

      target.current.y +=
        dx * 0.00055;

      target.current.x +=
        dy * 0.0004;

      target.current.x =
        THREE.MathUtils.clamp(
          target.current.x,
          -0.12,
          0.12,
        );

      target.current.y =
        THREE.MathUtils.clamp(
          target.current.y,
          -0.16,
          0.16,
        );

      last.current.x =
        event.clientX;

      last.current.y =
        event.clientY;
    };

    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener(
      "pointerdown",
      onDown,
    );

    window.addEventListener(
      "pointermove",
      onMove,
    );

    window.addEventListener(
      "pointerup",
      onUp,
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        onDown,
      );

      window.removeEventListener(
        "pointermove",
        onMove,
      );

      window.removeEventListener(
        "pointerup",
        onUp,
      );
    };
  }, []);

  useFrame(() => {
    camera.position.x =
      THREE.MathUtils.lerp(
        camera.position.x,
        target.current.y * 1.2,
        0.045,
      );

    camera.position.y =
      THREE.MathUtils.lerp(
        camera.position.y,
        -target.current.x * 0.9,
        0.045,
      );

    camera.lookAt(
      0,
      0,
      0,
    );
  });

  return null;
}


function Scene() {
  return (
    <>
      <Limbs />
      <Head />
      <CameraRig />
    </>
  );
}

export default function AboutScene() {
  return (
    <div
      className="
        relative
        w-full
        h-[70vh]
        min-h-[520px]
        overflow-hidden
      "
      style={{
        backgroundColor:
          "transparent",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [
            0,
            0,
            7,
          ],
          fov: 34,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{
          background:
            "transparent",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
