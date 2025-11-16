import { useState } from 'react'
import './App.css'
import Avatar from './assets/avatar.png'
import Project from './components/project.jsx'
import Contact from './components/contact.jsx'

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
                    <Project
                        title="KomaruClicker"
                        description="clicker on brython (i'll probably rewrite it later on react)"
                        link="https://matveykostis.github.io/KomaruSite/"
                        tech="brython, other html stuff"
                    />
                    <Project
                        title="KomaruSite"
                        description="this website"
                        link="https://matveykostis.github.io/"
                        tech="react, vite"
                    />
                    <Project
                        title="RandomTimer"
                        description="original name was bad time but meh."
                        link="https://matveykostis.github.io/time/"
                        tech="brython, other html stuff"
                    />
                    <Project
                        title="Brython Easier"
                        description="unsupported, btw, all other web project (not including this website) was written on this."
                        link="https://github.com/MatveyKostis/brython_easier"
                        tech="brython"
                    />
                </section>

                <section className="contact">
                    <h3>do not contact me</h3>
                    <p>i'm not even sure if i should put it here but anyway here</p>
                    <Contact name="github" url="https://github.com/MatveyKostis"/>
                    <Contact name="discord" url="https://discord.com/users/828149186545188906"/>
                    <Contact name="telegram" url="https://t.me/MatveyKostis"/>
                </section>
            </section>

            <footer>
                <p>this is really definitely a website, fr</p>
            </footer>
        </main>
    )
}

export default App