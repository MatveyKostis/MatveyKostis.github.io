export default function Contact(props) {
    return (
        <div className={"contact"}>
            <p>{props.name}: <a href={props.url}>{props.url}</a></p>
        </div>
    )
}