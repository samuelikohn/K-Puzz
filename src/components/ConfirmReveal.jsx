import "../styles/Overlay.css"

export default function ConfirmReveal(props) {
    return (
        <div className="overlayBackdrop" onClick={props.onClose}>
            <div className="overlay confirmDiv" onClick={(event) => event.stopPropagation}>
                <h2>{`Are you sure you want to reveal the entire puzzle?`}</h2>
                <div className="confirmBtns">
                    <button onClick={props.revealAllBoxes}>Yes</button>
                    <button onClick={props.onClose}>No</button>
                </div>
            </div>
        </div>
    )
}