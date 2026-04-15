import ModalLayer from "./ModalLayer.jsx"
import "../styles/Select.css"

export default function RevealSelect(props) {

    const selectStyle = props.cursorPos ? {
        left: props.cursorPos[0],
        top: props.cursorPos[1]
    } : null

    return (
        <ModalLayer
            ariaLabel="Reveal options"
            backdropClassName="selectBackdrop"
            contentClassName="select"
            onClose={props.onClose}
            contentStyle={selectStyle}
            role="menu"
        >
            <button
                className="boxSelect"
                onClick={() => {
                    props.setCheckHighlights(false)
                    props.setRevealHighlights(true)
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
                    props.setConfirmRevealShown(true)
                }}
                type="button"
            >
                Puzzle
            </button>
        </ModalLayer>
    )
}
