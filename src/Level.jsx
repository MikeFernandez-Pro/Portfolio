import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import { cloneElement, useRef, useState, useMemo } from "react";
import * as THREE from "three"

THREE.ColorManagement.legacyMode = false;

// Generic Box Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Generic Meshes Materials
const floor1Material = new THREE.MeshStandardMaterial({color: "limegreen"})
const floor2Material = new THREE.MeshStandardMaterial({color: "greenyellow"})
const obstacleMaterial = new THREE.MeshStandardMaterial({color: "orangered"})
const wallMaterial = new THREE.MeshStandardMaterial({color: "slategrey"})

/**     
 * Start Block
 */
export function BlockStart({position = [0, 0, 0]}) {
    return (
        <group position={position}>
            {/* Floor */}
            <mesh geometry={boxGeometry} material={floor1Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        </group>
    )
}

/**
 * End   Block
 */
export function BlockEnd({position = [0, 0, 0]}) {
    
    const hamburger = useGLTF("./hamburger.glb")
 
    for (const mesh of hamburger.scene.children) {
        mesh.castShadow = true;
    }
    
    return (
        <group position={position}>
            {/* Floor */}
            <RigidBody type="fixed" colliders={false} restitution={0.2} friction={0} position={[0, 0.25, 0]}>
                <primitive object={hamburger.scene} scale={0.2}/> 
                <CylinderCollider args={ [ 0.5, 1] }  position={[0, 0.5, 0]}/>
            </RigidBody> 
            <mesh geometry={boxGeometry} material={floor1Material} position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow />
        </group>
    )
}

/**
 * Spinner Obstacle
 */
export function BlockSpinner({position = [0, 0, 0]}) {

    const obstacle = useRef();
    const [ speed, setSpeed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)); // The speed with not reset after each re-render thanks to useState()

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        const quaternionRotation = new THREE.Quaternion();
        quaternionRotation.setFromEuler(new THREE.Euler(0, time * speed, 0));

        obstacle.current.setNextKinematicRotation(quaternionRotation);
    })

    return (
        <>
            <group position={position}>
                {/* Floor */}
                <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
                
                {/* Obstacle */}
                <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                    <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
                </RigidBody>
            </group> 
        </>
    )
}


/**
 * Limbo Obstacle
 */
export function BlockLimbo({position = [0, 0, 0]}) {

    const obstacle = useRef();
    const [ timeOffset, setTimeOffset ] = useState(() => (Math.random() * Math.PI * 2)); // The speed with not reset after each re-render thanks to useState()

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        const y = Math.sin(time + timeOffset) + 1.15;

        obstacle.current.setNextKinematicTranslation({x: position[0], y: position[1] +   y, z: position[2]});
    })

    return (
        <>
            <group position={position}>
                {/* Floor */}
                <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
                
                {/* Obstacle */}
                <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                    <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
                </RigidBody>
            </group> 
        </>
    )
}


/**
 * Axe Obstacle
 */
export function BlockAxe({position = [0, 0, 0]}) {

    const obstacle = useRef();
    const [ timeOffset, setTimeOffset ] = useState(() => (Math.random() * Math.PI * 2)); // The speed with not reset after each re-render thanks to useState()

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        const x = Math.sin(time + timeOffset) * 1.25;

        obstacle.current.setNextKinematicTranslation({x: position[0] + x, y: position[1] + 0.75, z: position[2]});
    })

    return (
        <>
            <group position={position}>
                {/* Floor */}
                <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
                
                {/* Obstacle */}
                <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                    <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
                </RigidBody>
            </group> 
        </>
    )
}

export function Bounds({length = 7}) {
     
    return <>
                <RigidBody type="fixed" restitution={0.2} friction={0}>
                    {/* <mesh
                        geometry={boxGeometry}
                        material={wallMaterial}
                        position={[2.15, 0.75, -(length * 2) + 2]}
                        scale={[0.3, 1.5, 4 * length]}
                        castShadow
                    />
                    <mesh
                        geometry={boxGeometry}
                        material={wallMaterial}
                        position={[-2.15, 0.75, -(length * 2) + 2]}
                        scale={[0.3, 1.5, 4 * length]}
                        receiveShadow
                    />
                    <mesh
                        geometry={boxGeometry}
                        material={wallMaterial}
                        position={[0, 0.75, (length * -4) + 1.85]}
                        scale={[4, 1.5, 0.3]}
                        receiveShadow
                    />
                    <CuboidCollider
                        args={[2, 0.1, length * 2]}
                        position={[0, -0.1, -(length * 2) + 2]}
                        restitution={0.2}
                        friction={1}
                    /> */}
                    <CuboidCollider
                        args={[30,0.1, 30]}
                        position={[0, -0.1, -(length * 2) + 2]}
                        restitution={0.2}
                        friction={1}
                    />
                </RigidBody>
    </> 
}

    export function Level ({count = 5, types = [ BlockSpinner, BlockAxe, BlockLimbo]}) {

        const blocks = useMemo(() =>
    {
        const blocks = []

        for(let i = 0; i < count; i++)
        {
            const type = types[ Math.floor(Math.random() * types.length) ]
            blocks.push(type)
        }
        return blocks
    }, [ count, types ])

    return (
        <>
            <BlockStart  position={[0, 0, 0]}/>
            
            {blocks.map((ObstacleBlock, index) => <ObstacleBlock key={index} position={[0, 0, (index + 1) * -4]}/>)}
           
            <BlockEnd position={[0, 0, (count + 1) * -4]} />
            
            <Bounds length={count + 2}/>
        </> 
    ); 
};
