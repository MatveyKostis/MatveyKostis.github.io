import { useState } from 'react'

function Project(props) {
    return (
        <div className="project">
            <h3>{props.title}</h3>
            <p>{props.description}</p>
            <a href={props.link}>{props.link}</a>
            <p>tech used: {props.tech}</p>
        </div>
    )
}

export default Project


