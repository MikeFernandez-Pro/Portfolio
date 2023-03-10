import { useGLTF, useKeyboardControls, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody} from "@react-three/rapier";
import {useRef, useState, useEffect, useMemo} from "react"
import * as RAPIER from '@dimforge/rapier3d-compat'
import * as THREE from "three"
import { useControls } from "leva";


const Player = (props) => {
    

    const fox = useGLTF("./Fox/glTF/Fox.gltf")
    const animations = useAnimations(fox.animations, fox.scene)
    const foxRef = useRef();

    const knightCharacter = useGLTF('/KnightCharacter.gltf')
    const knightAnimations = useAnimations(knightCharacter.animations, knightCharacter.scene)
    const knightRef = useRef();
    

    const [ orientation, setOrientation ] = useState(Math.PI )

    const body = useRef();
    const [subscribeKeys, getKeys] = useKeyboardControls();

    const controls = useControls({
        rotationSmoothness: {value : 8, min : 2, max: 20, step: 1}
    })

    useFrame((state, delta) => {

        const keys = getKeys();
        const {forward, backward, leftward, rightward} = keys;
      
        const nbOfKeysPressed = Object.values(keys).filter(key => key).length;

        if ( nbOfKeysPressed >= 3)
            return

        if ((forward && backward) || (leftward && rightward))
            return;

        const linvelY = body.current.linvel().y;
        
        const spead = nbOfKeysPressed == 1 ? 120 * delta : Math.sqrt(2) * 60 * delta
        
        const impulse = {
            x: leftward? -spead: rightward ? spead :0, y: linvelY, z: forward? -spead: backward ? spead :0}

        body.current.setLinvel(impulse)
        
        
        /**
         * Model Rotation
         */

        const angle =(Math.PI / 4) / 8// more divided more smooth

        // Top-left angle
        // const topLeftAngle = 225 * Math.PI / 180
        const topLeftTanAngle = (225 * Math.PI / 180).toFixed(3)
        // let topLeftTanAngle = Math.atan2(Math.sin(topLeftAngle), Math.cos(topLeftAngle)) + (Math.PI * 2)
        // topLeftTanAngle = Number(topLeftTanAngle.toFixed(3))
                    
        // Bottom-left angle
        // const bottomLeftAngle = 315 * Math.PI / 180;
        const bottomLeftTanAngle = (315 * Math.PI / 180).toFixed(3)
        // let bottomLeftTanAngle = Math.atan2(Math.sin(bottomLeftAngle), Math.cos(bottomLeftAngle)) + (Math.PI * 2)
        // bottomLeftTanAngle = Number(bottomLeftTanAngle.toFixed(3))

        // Top-right angle
        // const topRightAngle = 135 * Math.PI / 180;
        const topRightTanAngle = (135 * Math.PI / 180).toFixed(3)
        // let topRightTanAngle = Math.atan2(Math.sin(topRightAngle), Math.cos(topRightAngle))
        // topRightTanAngle = Number(topRightTanAngle.toFixed(3))

        // Bottom-right angle
        // const bottomRightAngle = 45 * Math.PI / 180;
        const bottomRightTanAngle = (45 * Math.PI / 180).toFixed(3)
        // let bottomRightTanAngle = Math.atan2(Math.sin(bottomRightAngle), Math.cos(bottomRightAngle))
        // bottomRightTanAngle = Number(bottomRightTanAngle.toFixed(3))


        let aTanAngle = Math.atan2(Math.sin(orientation), Math.cos(orientation))
        aTanAngle = aTanAngle < 0 ? aTanAngle + (Math.PI * 2) : aTanAngle;
        aTanAngle = Number(aTanAngle.toFixed(3))
        aTanAngle = aTanAngle == 0 ?  Number((Math.PI * 2).toFixed(3)) : aTanAngle

        // console.log(`corner => ${bottomLeftTanAngle}, aTanAngle => ${aTanAngle}`)

        /**
         * FORWARD-RIGHT
         */
        if (rightward && forward && aTanAngle != topRightTanAngle) {
            // if (aTanAngle > topRightTanAngle)
            //     setOrientation(state => state - angle)
            // else
            //     setOrientation(state => state + angle)
            setOrientation(prevState => prevState + angle * (aTanAngle > topRightTanAngle ? -1 : 1))
        }

        /**
        * FORWARD-LEFT
        */
        if (leftward && forward && aTanAngle != topLeftTanAngle) {
            // if (aTanAngle > topLeftTanAngle)
            //     setOrientation(state => state - angle)
            // else
            //     setOrientation(state => state + angle)
            setOrientation(prevState => prevState + angle * (aTanAngle > topLeftTanAngle ? -1 : 1))
        }

        /**
        * BOTTOM-RIGHT
        */
        if (rightward && backward && aTanAngle != bottomRightTanAngle) {
            // if (aTanAngle > bottomRightTanAngle && aTanAngle < topLeftTanAngle)
            //     setOrientation(state => state - angle)
            // else
            //     setOrientation(state => state + angle)
            setOrientation(prevState => prevState + angle * (aTanAngle > bottomRightTanAngle && aTanAngle < topLeftTanAngle ? -1 : 1))
        }

        /**
        * BOTTOM-LEFT
        */
        if (leftward && backward && aTanAngle != bottomLeftTanAngle) {
            // if (aTanAngle < topRightTanAngle || aTanAngle > bottomLeftTanAngle)
            //     setOrientation(state => state - angle)
            // else
            //     setOrientation(state => state + angle)
            setOrientation(prevState => prevState + angle * (aTanAngle < topRightTanAngle || aTanAngle > bottomLeftTanAngle ? -1 : 1))
        }

        /**
         * RIGHT
         */
        if (rightward && !forward && !backward && Math.sin(orientation) != 1) {
            // if (Math.cos(orientation) > 0)
            //     setOrientation(state => state + angle)
            // else
            //     setOrientation(state => state - angle)
            setOrientation(prevState => prevState + angle * (Math.cos(orientation) > 0 ? 1 : -1))
        }

        /**
         * LEFT
         */
        if (leftward && !forward && !backward && Math.sin(orientation) != -1) {
            // if (Math.cos(orientation) > 0)
            //     setOrientation(state => state - angle)
            // else
            //     setOrientation(state => state + angle)
            setOrientation(prevState => prevState + angle * (Math.cos(orientation) > 0 ? -1 : 1))
        } 

        /**
        * FORWARD
        */
        if (forward && !leftward && !rightward && Math.cos(orientation) != -1) {
            // if (Math.sin(orientation) > 0)
            //     setOrientation(state => state + angle)
            // else
            //     setOrientation(state => state - angle)
            setOrientation(prevState => prevState + angle * (Math.sin(orientation) > 0 ? 1 : -1))
        }   

        
        /**
        * BACKWARD
        */
        if (backward && !leftward && !rightward && Math.cos(orientation) != 1) {
            // if (Math.sin(orientation) > 0)
            //     setOrientation(state => state - angle)
            // else
            //     setOrientation(state => state + angle)
            setOrientation(prevState => prevState + angle * (Math.sin(orientation) > 0 ? -1 : 1))
        }  

        // const eulerRotation = new THREE.Euler(0, orientation, 0)
         
        const quaternionRotation = new THREE.Quaternion()
        // quaternionRotation.setFromEuler(eulerRotation);
        quaternionRotation.setFromEuler(new THREE.Euler(0, orientation, 0));
        body.current.setRotation(quaternionRotation);
    })
    
    const action = animations.actions["Walk"]
    action.play()

    const knightAction = knightAnimations.actions["Run"]
    knightAction.play();


    // useEffect(() => {
    //     subscribeKeys(
    //         (state) => state,
    //         (value) => {
    //             if (value.forward || value.backward || value.leftward || value.rightward || value.jump) {
    //                 const action = animations.actions["Walk"]
    //                 action.play()
    //             }
    //             else {
    //                 return () => {
    //                 action.fadeOut(0.5) // Remove the previous animation with fade out effect
    //                 }
    //             }
                
    //         }
    //     )
    // })


    return (
        <RigidBody ref={body} colliders={false} position={[0, 1, 0]} restitution={0.2} friction={1}>
            <mesh>
            {/* <primitive ref={foxRef} object={fox.scene} castshadow scale={0.009} position-y={-1}/>  */}
              <primitive ref={knightRef} object={knightCharacter.scene} scale={0.2} position-y={-1}/>
                <CuboidCollider 
                    args={[0.2, 0.2, 0.4]}
                    position={[0, -0.75, 0]}
                    restitution={0.2}
                    friction={1}
                />
                {/* <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial flatShading color="mediumpurple" /> */}
            </mesh> 
        </RigidBody>
    );
};

export default Player;