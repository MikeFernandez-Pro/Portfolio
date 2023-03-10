import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls } from '@react-three/drei'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <KeyboardControls
        map={[
            {name: "forward", keys: ["ArraowUp", "KeyW"]},
            {name: "backward", keys: ["ArraowDown", "KeyS"]},
            {name: "leftward", keys: ["ArraowLeft", "KeyA"]},
            {name: "rightward", keys: ["ArraowRight", "KeyD"]},
            {name: "jump", keys: ["Space"]}
        ]}
    >
    <Canvas
        shadows
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ 2.5, 4, 6 ]
        } }
    >
        <Experience />
    </Canvas>
    </KeyboardControls>
)