import { Fragment, useState, useEffect } from "react"
import Box from "./Box.jsx"
import Notes from "./Notes.jsx"
import Results from "./Results.jsx"
import Connections from "./Connections.jsx"
import "../styles/Puzzle.css"

export default function Puzzle(props) {
    const [boxCorrectness, setBoxCorrectness] = useState({1: false})
    const [finalTime, setFinalTime] = useState(0)

    // Box dimensions and positions
    const WIDTH = 3.5
    const HEIGHT = 6.625
    const MARGIN = 2
    const OFFSET_X = WIDTH + MARGIN
    const OFFSET_Y = (HEIGHT + WIDTH) / 2 + MARGIN
    const numBoxes = props.puzzle.puzzle.boxes.length

    // Set puzzle bounding box dimensions based on puzzle size
    const divStyle = {
        width: (props.puzzle.width + 1) * (WIDTH + MARGIN) + WIDTH + "rem",
        height: (props.puzzle.height + 1) * (HEIGHT + MARGIN) + WIDTH + "rem",
        minWidth: (3) * (WIDTH + MARGIN) + WIDTH + "rem",
        minHeight: (3) * (HEIGHT + MARGIN) + WIDTH + "rem"
    }

    function handleBoxChange(boxID, currentValue) {
        props.updateNumbersUsed(boxID, currentValue)
        setBoxCorrectness(prevBoxCorrectness => ({
            ...prevBoxCorrectness,
            [boxID]: (boxID === currentValue)
        }))
    }

    function closeResultsPage() {
        props.setResultsShown(false)
    }

    // Wait for new puzzle data to reset states
    useEffect(() => {
        const initialBoxCorrectness = {}
        for (let i = 1; i <= numBoxes; i++) {
            initialBoxCorrectness[i] = false
        }
        setBoxCorrectness(initialBoxCorrectness)
        props.updateNumbersUsed(null, null)
    }, [props.puzzle])

    // Wait for box correctness to update then check if puzzle is solved
    useEffect(() => {
        if (Object.values(boxCorrectness).every(value => value === true)) {
            setFinalTime(Date.now() - props.startTime)
            props.setIsSolved(true)
            props.setResultsShown(true)
        }
    }, [boxCorrectness])

    return (
        <div className="puzzleDiv controlBox" style={divStyle}>
            {props.resultsShown && <Results onClose={closeResultsPage} finalTime={finalTime}/>}
            {
                props.puzzle.puzzle.boxes.map((box, i) =>
                    <Fragment key={props.keys[i]}>
                        <Box
                            topVal={box.topVal}
                            bottomVal={box.bottomVal}
                            x={box.x}
                            y={box.y}
                            width={WIDTH}
                            height={HEIGHT}
                            margin={MARGIN}
                            offsetX={OFFSET_X}
                            offsetY={OFFSET_Y}
                            onChange={handleBoxChange}
                            isSolved={props.isSolved}
                            boxStates={props.boxStates}
                        />
                        <Notes
                            x={box.x}
                            y={box.y}
                            width={WIDTH}
                            height={HEIGHT}
                            margin={MARGIN}
                            offsetX={OFFSET_X - 0.5}
                            offsetY={OFFSET_Y - 0.5}
                            isSolved={props.isSolved}
                        />
                    </Fragment>
                )
            }
            <Connections
                paths={props.puzzle.puzzle.connections}
                width={WIDTH}
                height={HEIGHT}
                margin={MARGIN}
                offsetX={OFFSET_X}
                offsetY={OFFSET_Y}
            />
        </div>
    )
}