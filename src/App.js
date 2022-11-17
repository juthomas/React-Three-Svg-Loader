import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import React, { Suspense, useState, useEffect, useMemo } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { useTransition, useSpring, a } from '@react-spring/three'
import './styles.css'

const colors = ['#21242d', '#ea5158', '#0d4663', '#ffbcb7', '#2d4a3e', '#8bd8d2']
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

function Scene() {
  const { viewport } = useThree()
  const [page, setPage] = useState(0)
  // useEffect(() => void setInterval(() => setPage((i) => (i + 1) % urls.length), 3500), [])

  const data = useLoader(SVGLoader, urls[page])
  const shapes = useMemo(() => data.paths.flatMap((g, index) => g.toShapes(true).map((shape) => ({ shape, color: g.color, index }))), [
    data
  ])

  return (
    <>
      <group position={[viewport.width / 2, viewport.height / 4, page]} rotation={[0, 0, Math.PI]}>
        {shapes.map((item) => {
          return <Shape {...item} rotation={[0, 0, 0]} position={[0, 0, 0]} opacity={1} />
        })}
      </group>
    </>
  )
}

export default function App() {
  return (
    <Canvas flat linear camera={{ fov: 80, position: [0, 0, 2000], near: 0.1, far: 20000 }}>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.5} position={[300, 300, 4000]} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
