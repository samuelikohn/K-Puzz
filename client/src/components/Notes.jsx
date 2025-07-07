import "../styles/Notes.css"

export default function Notes(props) {

    const divStyle = {
        top: props.y * (props.height + props.margin) + props.offsetY + "rem",
        left: props.x * (props.width + props.margin) + props.offsetX + "rem"
    }

    return (
        <textarea style={divStyle} disabled={props.isSolved}/>
    )
}