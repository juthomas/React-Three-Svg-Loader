import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import React, { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { a } from '@react-spring/three'

const urls = ['night', 'city', 'morning', 'tubes', 'woods', 'beach'].map(
  (name) => `https://raw.githubusercontent.com/pmndrs/react-three-fiber/v5.3.22/examples/src/resources/images/svg/${name}.svg`
)

function Shape({ shape, rotation, position, color, opacity, index }) {
  if (!position) return null
  return (
    <a.mesh rotation={rotation} position={position}>
      <a.meshPhongMaterial color={color} opacity={opacity} side={THREE.DoubleSide} depthWrite={false} transparent />
      <shapeGeometry args={[shape]} />
    </a.mesh>
  )
}

function SvgRender({ url, position, scale }) {
  const data = useLoader(SVGLoader, url)
  const shapes = useMemo(
    () => data.paths.flatMap((g, index) => g.toShapes(true).map((shape) => ({ shape, color: g.color, index }))),
    [data]
  )

  return (
    <group position={position} rotation={[0, 0, Math.PI]} scale={scale}>
      {shapes.map((item) => {
        return <Shape {...item} rotation={[0, 0, 0]} position={[0, 0, 0]} opacity={1} />
      })}
    </group>
  )
}

export default function App() {
  return (
    <Canvas orthographic dpr={[1, 1]} camera={{ zoom: 12, position: [0, 0, -30] }}>
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <SvgRender url={urls[0]} scale={0.01} position={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  )
}
