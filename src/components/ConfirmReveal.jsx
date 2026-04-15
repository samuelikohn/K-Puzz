import ModalLayer from "./ModalLayer.jsx"
import "../styles/Overlay.css"

export default function ConfirmReveal(props) {
    function handleConfirm() {
        props.revealAllBoxes()
        props.onClose()
    }

    return (
        <ModalLayer contentClassName="overlay confirmDiv" onClose={props.onClose}>
            {({ titleId }) => (
                <>
                    <h2 id={titleId}>{`Are you sure you want to reveal the entire puzzle?`}</h2>
                    <div className="confirmBtns">
                        <button onClick={handleConfirm} type="button">Yes</button>
                        <button onClick={props.onClose} type="button">No</button>
                    </div>
                </>
            )}
        </ModalLayer>
    )
}
