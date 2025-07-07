import "../styles/Select.css"

export default function CheckSelect(props) {

    function checkBox() {
        console.log("box checked")
    }

    function checkPuzzle() {
        console.log("puzzle checked")
    }

    const selectStyle = props.cursorPos ? {
        left: props.cursorPos[0],
        top: props.cursorPos[1]
    } : null

    return (
        <div className="selectBackdrop" onClick={props.onClose}>
            <div className="select" style={selectStyle}>
                <p className="boxSelect" onClick={checkBox}>Box</p>
                <p className="puzzleSelect" onClick={checkPuzzle}>Puzzle</p>
            </div>
        </div>
    )
}