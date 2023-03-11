import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls } from '@react-three/drei'
import { StrictMode } from 'react'
import { Leva } from 'leva'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Leva />
        <KeyboardControls
            map={[
                {name: "forward", keys: ["ArraowUp", "KeyW"]},
                {name: "backward", keys: ["ArraowDown", "KeyS"]},
                {name: "leftward", keys: ["ArraowLeft", "KeyA"]},
                {name: "rightward", keys: ["ArraowRight", "KeyD"]},
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
    </StrictMode>
)