import Settings from "./Settings.jsx"
import "../styles/LeftPanel.css"

export default function LeftPanel(props) {
    return (
        <div className="leftPanel">
            <h1 className="title">K-Puzz</h1>
            <Settings
                generateNewPuzzle={props.generateNewPuzzle}
                puzzleID={props.puzzleID}
                selectedWidth={props.selectedWidth}
                selectedHeight={props.selectedHeight}
                setSelectedWidth={props.setSelectedWidth}
                setSelectedHeight={props.setSelectedHeight}
            />
        </div>
    )
}
