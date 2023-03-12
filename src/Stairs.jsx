import { Center, useGLTF } from "@react-three/drei";
import { ConvexHullCollider, RigidBody, TrimeshCollider } from "@react-three/rapier";

const Stairs = (props) => {
    const model = useGLTF("./Stairs.glb");


    return (
        <RigidBody  type={"fixed"} colliders="hull" position-z={-3} position-y={-0.07} rotation-y={Math.PI / 2}>
            <primitive object={model.scene} scale={0.2} />
        </RigidBody>  
    );
X
};

export default Stairs;