import './project.css'

export default function Project(props) {
    const { title, description, link, tech } = props
    return (
        <article className="project">
            <h4>{title}</h4>
            <p className="desc">{description}</p>
            <p className="tech">{tech}</p>
            <a href={link} target="_blank" rel="noreferrer">open {title}</a>
        </article>
    )
}
