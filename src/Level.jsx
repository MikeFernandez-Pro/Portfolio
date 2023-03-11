
import { RigidBody } from "@react-three/rapier";

const Level = () => {

    return (
        <>
            <RigidBody type="fixed" restitution={0.2} friction={1}>
                <mesh  position={[0, -0.1, 0]} scale={[15, 0.2, 15]} receiveShadow>
                    <boxGeometry />
                    <meshStandardMaterial color={"DarkSlateGrey"} />
                </mesh>
            </RigidBody>
        </>
    ); 
};

export default Level;
