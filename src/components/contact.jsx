export default function Contact(props) {
    return (
        <a className="chip" href={props.url} target="_blank" rel="noreferrer">
            {props.name}
        </a>
    )
}
