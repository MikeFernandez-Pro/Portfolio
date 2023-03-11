import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics, Debug } from '@react-three/rapier'
import Lights from './Lights.jsx'
import Level from './Level.jsx'
import Player from './Player.jsx'
import { useControls } from 'leva'

export default function Experience()
{
    const {orbitControls, debug, cubeCollider} = useControls("Debug", {
        orbitControls : false,
        debug: true,
    })

    return <>
        <Perf position="top-left" />

        {orbitControls && <OrbitControls makeDefault />}

        <Physics>
            {debug && <Debug />}
            <Lights />
            <Level />
            <Player orbitControls={orbitControls} />
        </Physics>

    </>
}