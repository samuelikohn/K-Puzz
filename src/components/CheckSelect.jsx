import ModalLayer from "./ModalLayer.jsx"
import "../styles/Select.css"

export default function CheckSelect(props) {

    const selectStyle = props.cursorPos ? {
        left: props.cursorPos[0],
        top: props.cursorPos[1]
    } : null

    return (
        <ModalLayer
            ariaLabel="Check options"
            backdropClassName="selectBackdrop"
            contentClassName="select"
            onClose={props.onClose}
            contentStyle={selectStyle}
            role="menu"
        >
            <button
                className="boxSelect"
                onClick={() => {
                    props.setRevealHighlights(false)
                    props.setCheckHighlights(true)
                    props.onClose()
                }}
                type="button"
            >
                Box
            </button>
            <button
                id="puzzleSelect"
                onClick={() => {
                    props.onClose()
                    props.setConfirmCheckShown(true)
                }}
                type="button"
            >
                Puzzle
            </button>
        </ModalLayer>
    )
}
