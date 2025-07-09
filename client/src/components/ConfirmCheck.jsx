import "../styles/Overlay.css"

export default function ConfirmCheck(props) {
    return (
        <div className="overlayBackdrop" onClick={props.onClose}>
            <div className="overlay confirmDiv" onClick={(event) => event.stopPropagation}>
                <h2>{`Are you sure you want to check the entire puzzle?`}</h2>
                <div className="confirmBtns">
                    <button onClick={props.checkAllBoxes}>Yes</button>
                    <button onClick={props.onClose}>No</button>
                </div>
            </div>
        </div>
    )
}