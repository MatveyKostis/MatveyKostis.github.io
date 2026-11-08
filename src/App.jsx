import { useState } from 'react'
import './App.css'
import Avatar from './assets/avatar.png'
import Project from './components/project.jsx'
import Contact from './components/contact.jsx'

function App() {
    const [eggs, setEggs] = useState(0)

    return (
        <main>
            <header>
                <h1>komaru</h1>
                <nav>
                    <a href="#projects">projects</a>
                    <a href="#contact">contact</a>
                </nav>
            </header>

            <section className="hero">
                <h2>I write Python that runs in the browser.</h2>
                <p>
                    Also JS, a bit of Lua, and too many clickers. This is the
                    new home for all of it.
                </p>
                <div className="terminal" aria-label="a python session">
                    <div className="terminal-bar">
                        <i /><i /><i />
                        <span>python3 — komaru@web</span>
                    </div>
                    <pre>
<span className="c-dim">&gt;&gt;&gt;</span> <span className="c-blue">from</span> komaru <span className="c-blue">import</span> projects{'\n'}
<span className="c-dim">&gt;&gt;&gt;</span> projects.sort(by=<span className="c-green">"fun"</span>){'\n'}
<span className="c-dim">&gt;&gt;&gt;</span> <span className="c-blue">for</span> p <span className="c-blue">in</span> projects: p.ship(){'\n'}
<span className="c-cyan">shipping all of them... done ✓</span>{'\n'}
<span className="c-dim">&gt;&gt;&gt;</span> _<span className="cursor" aria-hidden="true" />
                    </pre>
                </div>
            </section>

            <section className="block about">
                <h3>something about me</h3>
                <p className="lead">
                    the short version, minus the lorem ipsum.
                </p>
                <div className="about-grid">
                    <img src={Avatar} alt="komaru's avatar: a cat holding a baguette" />
                    <p onClick={() => setEggs(eggs + 1)}>
                        I'm komaru. I like making small
                        things that run in a browser — games, timers, tools —
                        and I'd rather write Python than JavaScript, which is
                        why half my web stuff is Brython. When I'm not coding
                        I'm probably playing ULTRAKILL or Undertale.
                        <span className="hint">
                            {eggs === 0 && "psst: this site has easter eggs. try clicking things."}
                            {eggs === 1 && "heh, you found one. keep going."}
                            {eggs >= 2 && `that's ${eggs} easter eggs found. nice.`}
                        </span>
                    </p>
                </div>
            </section>

            <section className="block projects" id="projects">
                <h3>projects</h3>
                <p className="lead">
                    things I've shipped, most recent first.
                </p>
                <div className="projects-grid">
                    <Project
                        title="brython_easier"
                        description="a library that makes brython usable — localStorage, timers, the DOM, without breaking your brain. on PyPI."
                        link="https://github.com/MatveyKostis/brython_easier"
                        tech="python, pypi"
                    />
                    <Project
                        title="KomaruClicker"
                        description="a clicker game. the first one that got stuck in my head."
                        link="https://matveykostis.github.io/KomaruSite/"
                        tech="brython"
                    />
                    <Project
                        title="RandomTimer"
                        description="a timer that refuses to pick a normal number."
                        link="https://matveykostis.github.io/time/"
                        tech="brython"
                    />
                    <Project
                        title="this website"
                        description="react + vite, no template. the code is open."
                        link="https://github.com/MatveyKostis/MatveyKostis.github.io"
                        tech="react, vite"
                        dead={false}
                    />
                </div>
                <h4 className="learning-sub">learning projects</h4>
                <p className="learning-note">never use these, never, please</p>
                <div className="projects-grid">
                    <Project
                        title="notesite + noteserver"
                        description="notes app with accounts and a self-hosted server."
                        link="https://github.com/MatveyKostis/notesite"
                        tech="js, node, parcel"
                    />
                </div>
            </section>

            <section className="block contact" id="contact">
                <h3>contact</h3>
                <p className="lead">
                    the old page said "do not contact me". that was a joke,
                    mostly. these all work:
                </p>
                <div className="contact-row">
                    <Contact name="github" url="https://github.com/MatveyKostis" />
                    <Contact name="telegram" url="https://t.me/matveykostis" />
                    <Contact name="discord" url="https://discord.com/users/828149186545188906" />
                </div>
            </section>

            <footer>
                <p>© {new Date().getFullYear()} komaru</p>
                <p>2+2=5</p>
                <button
                    type="button"
                    className="egg-button"
                    onClick={() => setEggs(eggs + 1)}
                >
                    {eggs === 0 ? "fr" : "fr × " + eggs}
                </button>
            </footer>
        </main>
    )
}

export default App
