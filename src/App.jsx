import { useState } from 'react'
import './App.css'
import Avatar from './assets/avatar.png'
import Project from './components/project.jsx'

const ABOUT_TEXT = 'a nerd that likes to write code on python, lua, js (not very)'

function App() {
    const [loremcount, setLoremCount] = useState(0)

    return (
        <main>
            <header>
                <h1>definitely a website</h1>
            </header>

            <section className="content">
                <section className="about">
                    <h3>smthing about me, komaru</h3>
                    <img src={Avatar} alt="avatar" />
                    <p onClick={(e) => {
                        if (loremcount === 0) {
                            e.target.innerText = "heh, kiddin, click again"
                            setLoremCount(loremcount + 1)
                        } else {
                            e.target.innerText = ABOUT_TEXT
                        }
                    }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quaerat, quibusdam. Quisquam, quibusdam. click here pls
                    </p>
                </section>

                <section className="projects">
                    <h3>projects</h3>
                    <Project
                        title="KomaruProvider"
                        description="self-written provider-aggregator: dual chat format, registry-order failover"
                        tech="node 22, fastify"
                    />
                    <Project
                        title="Komaru API"
                        description="LLM gateway; manual updates only, model sweep disabled (upstream-ban protection)"
                        tech="docker, new-api"
                    />
                    <Project
                        title="Web proxy"
                        description="scramjet engine + fallback page with identical UI (two engines, one visual)"
                        tech="scramjet"
                    />
                    <Project
                        title="CharForge web"
                        description="standalone mini-service replacing the OrbWeaver plugin"
                        tech="web"
                    />
                    <Project
                        title="komarusquare front"
                        description="front-end build, phase-1 spec done"
                        tech="front-end"
                    />
                    <Project
                        title="OrbWeaver"
                        description="user's app"
                        tech="pnpm"
                    />
                    <Project
                        title="Jukebox v2"
                        description="gateway with model scout and model=auto chain"
                        tech="gateway"
                    />
                    <Project
                        title="SUB/WAVE fetcher"
                        description="yt-dlp → Navidrome music fetcher; LLM track pick, compile-markers filter, top-N cap"
                        tech="yt-dlp, navidrome"
                    />
                </section>
            </section>
        </main>
    )
}

export default App
