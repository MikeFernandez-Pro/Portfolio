import { useGLTF, useKeyboardControls, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, RigidBody} from "@react-three/rapier";
import {useRef, useState, useEffect, useMemo} from "react"
import * as RAPIER from '@dimforge/rapier3d-compat'
import * as THREE from "three"
import { useControls } from "leva";


const Player = (props) => {

    const knightCharacter = useGLTF('/KnightCharacter.gltf')
    const knightAnimations = useAnimations(knightCharacter.animations, knightCharacter.scene)
    const knightRef = useRef();

    knightCharacter.scene.traverse((child) =>
    {
        child.castShadow = true;
    })

    const [ knightRun, setknightRun ] = useState("Idle")
    

    const [ orientation, setOrientation ] = useState(Math.PI )

    const knightBody = useRef();
    const [subscribeKeys, getKeys] = useKeyboardControls();

    const controls = useControls({
        rotationSmoothness: {value : 8, min : 2, max: 20, step: 1}
    })

    useFrame((state, delta) => {

        const keys = getKeys();
        const {forward, backward, leftward, rightward} = keys;
        
        const nbOfKeysPressed = Object.values(keys).filter(key => key).length;
        let wrongKeysCombination = nbOfKeysPressed >= 3 || (forward && backward) || (leftward && rightward)

        // Update character animation on movement 
        setknightRun(nbOfKeysPressed === 0 || wrongKeysCombination ? "Idle" : "Run");
        
        // Cancel movement on bad keys combination
        if (wrongKeysCombination)
            return
        
        
        // Model movement

        const linvelY = knightBody.current.linvel().y;

        // Reduce speed value if it's diagonal movement
        const speed = nbOfKeysPressed == 1 ? 120 * delta : Math.sqrt(2) * 60 * delta
        
        const impulse = {
            x: leftward? -speed: rightward ? speed :0, y: linvelY, z: forward? -speed: backward ? speed :0}

        knightBody.current.setLinvel(impulse)

        
        // Model Rotation

        const angle =(Math.PI / 4) / 7 // rotation speed (more divided => more smooth)

        const topLeftAngle = 3.927 // (225 * Math.PI / 180).toFixed(3)
                    
        const bottomLeftAngle = 5.498 // (315 * Math.PI / 180).toFixed(3)

        const topRightAngle = 2.356 // (135 * Math.PI / 180).toFixed(3)

        const bottomRightAngle = 0.785 // (45 * Math.PI / 180).toFixed(3)

        let aTanAngle = Math.atan2(Math.sin(orientation), Math.cos(orientation))
        aTanAngle = aTanAngle < 0 ? aTanAngle + (Math.PI * 2) : aTanAngle;
        aTanAngle = Number(aTanAngle.toFixed(3))
        aTanAngle = aTanAngle == 0 ?  Number((Math.PI * 2).toFixed(3)) : aTanAngle

        const keysCombinations = {
           forwardRight: forward && !backward && !leftward && rightward,
           forwardLeft: forward && !backward && leftward && !rightward,
           backwardRight: !forward && backward && !leftward && rightward,
           backwardLeft: !forward && backward && leftward && !rightward,
           forward: forward && !backward && !leftward && !rightward,
           right: !forward && !backward && !leftward && rightward,
           backward: !forward && backward && !leftward && !rightward,
           left: !forward && !backward && leftward && !rightward,
        }
        
        /**
         * FORWARD-RIGHT
         */
        if (keysCombinations.forwardRight && aTanAngle != topRightAngle) {
            setOrientation(prevState => prevState + angle * (aTanAngle > topRightAngle ? -1 : 1))
        }

        /**
        * FORWARD-LEFT
        */
        if (keysCombinations.forwardLeft && aTanAngle != topLeftAngle) {
            setOrientation(prevState => prevState + angle * (aTanAngle > topLeftAngle ? -1 : 1))
        }

        /**
        * BOTTOM-RIGHT
        */
        if (keysCombinations.backwardRight && aTanAngle != bottomRightAngle) {
            setOrientation(prevState => prevState + angle * (aTanAngle > bottomRightAngle && aTanAngle < topLeftAngle ? -1 : 1))
        }

        /**
        * BOTTOM-LEFT
        */
        if (keysCombinations.backwardLeft && aTanAngle != bottomLeftAngle) {
            setOrientation(prevState => prevState + angle * (aTanAngle < topRightAngle || aTanAngle > bottomLeftAngle ? -1 : 1))
        }

        /**
         * RIGHT
         */
        if (keysCombinations.right && Math.sin(orientation) != 1) {
            setOrientation(prevState => prevState + angle * (Math.cos(orientation) > 0 ? 1 : -1))
        }

        /**
         * LEFT
         */
        if (keysCombinations.left && Math.sin(orientation) != -1) {
            setOrientation(prevState => prevState + angle * (Math.cos(orientation) > 0 ? -1 : 1))
        } 

        /**
        * FORWARD
        */
        if (keysCombinations.forward && Math.cos(orientation) != -1) {
            setOrientation(prevState => prevState + angle * (Math.sin(orientation) > 0 ? 1 : -1))
        }   

        
        /**
        * BACKWARD
        */
        if (keysCombinations.backward && Math.cos(orientation) != 1) {
            setOrientation(prevState => prevState + angle * (Math.sin(orientation) > 0 ? -1 : 1))
        }  

        // Set the new rotation Y value of the character and lock X and Z rotations
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(new THREE.Euler(0, orientation, 0));
        knightBody.current.setRotation(quaternionRotation);
    })

    // const knightAction = knightAnimations.actions["Idle"]
    // knightAction.play()
    // const knightIdleAction = knightAnimations.actions["Idle"]
   
    useEffect(() => {
        knightAnimations.actions[knightRun].reset().fadeIn(0.2).play()

        return () => {
            knightAnimations.actions[knightRun].fadeOut(0.2)
        }
    }, [knightRun])

    // useEffect(() => {
    //     subscribeKeys(
    //         (state) => state,
    //         (value) => {
    //             if (value)
                        // console.log("jump!")
                // }
    // })
    
    return (
        <RigidBody ref={knightBody} colliders={false} position={[0, 1, 0]} restitution={0.2} friction={1}>
              <primitive ref={knightRef} object={knightCharacter.scene} scale={0.2} position-y={-1}/>
                <CapsuleCollider 
                    args={[0.3, 0.25]}
                    position={[0, -0.45, 0]}
                />  
        </RigidBody>
    );
};

export default Player;