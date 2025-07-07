import "../styles/Select.css"

export default function RevealSelect(props) {

    function revealBox() {
        console.log("box revealed")
    }

    const selectStyle = props.cursorPos ? {
        left: props.cursorPos[0],
        top: props.cursorPos[1]
    } : null

    return (
        <div className="selectBackdrop" onClick={props.onClose}>
            <div className="select" style={selectStyle}>
                <p className="boxSelect" onClick={revealBox}>Box</p>
                <p className="puzzleSelect" onClick={props.revealAllBoxes}>Puzzle</p>
            </div>
        </div>
    )
}