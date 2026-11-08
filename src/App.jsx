import { useState } from 'react'
import './App.css'
import Avatar from './assets/avatar.png'
import Project from './components/project.jsx'
import Contact from './components/contact.jsx'

const projects = [
    {
        title: "KomaruProvider",
        description: "self-written provider-aggregator, dual chat format, registry-order failover.",
        tech: "node 22, fastify"
    },
    {
        title: "Komaru API",
        description: "model gateway with tiered-expression billing, manual updates only.",
        tech: "docker, new-api"
    },
    {
        title: "Jukebox v2",
        description: "gateway with a model scout and an auto model chain.",
        tech: "new-api"
    },
    {
        title: "Web proxy",
        description: "public proxy, two engines behind one identical UI.",
        tech: "scramjet"
    },
    {
        title: "PostCat",
        description: "postman alternative for android: json editor, cookie jar, crash-free.",
        tech: "kotlin, compose, material 3"
    },
    {
        title: "KomaruTheWork",
        description: "music discord bot.",
        tech: "discord, llm"
    },
    {
        title: "Neural Court",
        description: "five llm agents arguing in a discord courtroom.",
        tech: "discord, llm"
    },
    {
        title: "heroku-userbot",
        description: "telegram userbot with an inline bot.",
        tech: "telethon"
    },
    {
        title: "SUB/WAVE fetcher",
        description: "music fetcher with llm track picking and an ost-channel rule.",
        tech: "yt-dlp, navidrome"
    },
    {
        title: "CharForge web",
        description: "standalone mini-service, orbweaver plugin replacement.",
        tech: "web"
    },
    {
        title: "komarusquare front",
        description: "front-end build, phase 1.",
        tech: "web"
    },
    {
        title: "KomaruSite",
        description: "this website.",
        tech: "react, vite"
    }
]

const contacts = ["github", "discord", "telegram"]

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
                            e.target.innerText = "an nerd that likes to write code on python, lua, js (not very)"
                        }
                    }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quaerat, quibusdam. Quisquam, quibusdam. click here pls
                    </p>
                </section>

                <section className="projects">
                    <h3>projects</h3>
                    {projects.map((p) => (
                        <Project key={p.title} {...p} />
                    ))}
                </section>

                <section className="contact">
                    <h3>do not contact me</h3>
                    <p>i'm not even sure if i should put it here but anyway here</p>
                    {contacts.map((name) => (
                        <Contact key={name} name={name} />
                    ))}
                </section>
            </section>

            <footer>
                <p>this is really definitely a website, fr</p>
            </footer>
        </main>
    )
}

export default App
