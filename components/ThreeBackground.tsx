import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Edges } from '@react-three/drei';
import * as THREE from 'three';

// Bypass TypeScript check for R3F intrinsic elements
const Mesh = 'mesh' as any;
const BoxGeometry = 'boxGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

const TechCube = ({ size, color, speed, reverse = false }: { size: number, color: string, speed: number, reverse?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const direction = reverse ? -1 : 1;
    
    // Rotation lente et hypnotique
    meshRef.current.rotation.x = (t * speed * 0.1) * direction;
    meshRef.current.rotation.y = (t * speed * 0.15) * direction;
    meshRef.current.rotation.z = (t * speed * 0.05) * direction;
  });

  return (
    <Mesh ref={meshRef}>
      <BoxGeometry args={[size, size, size]} />
      {/* Remplissage très subtil et transparent */}
      <MeshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.03} 
        roughness={0}
        metalness={0.1}
      />
      {/* Arêtes lumineuses nettes */}
      <Edges 
        scale={1} 
        threshold={15} // Affiche seulement les arêtes principales (90 degrés)
        color={color}
      />
    </Mesh>
  );
};

export const ThreeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#050511]">
      {/* Vignette pour assombrir les bords */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80 pointer-events-none z-10" />
      
      <Canvas camera={{ position: [0, 0, 12], fov: 35 }}>
        <Environment preset="city" />
        
        {/* Lumières d'ambiance pour faire briller les arêtes */}
        <AmbientLight intensity={0.5} />
        <PointLight position={[10, 10, 10]} intensity={2} color="#818cf8" />
        <PointLight position={[-10, -10, -10]} intensity={2} color="#c084fc" />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Group rotation={[0.5, 0.5, 0]}>
            {/* Cube Extérieur */}
            <TechCube size={5.5} color="#6366f1" speed={0.8} />
            
            {/* Cube Intérieur - tourne en sens inverse */}
            <TechCube size={3.2} color="#a855f7" speed={1.2} reverse />
            
            {/* Petit noyau central optionnel pour la profondeur */}
            <TechCube size={1.5} color="#ec4899" speed={2} />
          </Group>
        </Float>
      </Canvas>
    </div>
  );
};