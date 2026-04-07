import "../styles/Select.css"

export default function CheckSelect(props) {

    const selectStyle = props.cursorPos ? {
        left: props.cursorPos[0],
        top: props.cursorPos[1]
    } : null

    return (
        <div className="selectBackdrop" onClick={props.onClose}>
            <div className="select" style={selectStyle}>
                <p className="boxSelect" onClick={() => {
                    props.setRevealHighlights(false)
                    props.setCheckHighlights(true)
                }}>Box</p>
                <p className="puzzleSelect" onClick={() => props.setConfirmCheckShown(true)}>Puzzle</p>
            </div>
        </div>
    )
}