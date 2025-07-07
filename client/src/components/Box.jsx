import { useState, useEffect } from "react"
import "../styles/Box.css"

export default function Box(props) {
    const [boxVal, setBoxVal] = useState("")

    const divStyle = {
        top: props.y * (props.height + props.margin) + props.offsetY + "rem",
        left: props.x * (props.width + props.margin) + props.offsetX + "rem"
    }

    function filterInput(event) {
        let val = event.target.value
        val = val.replace(/[^0-9]/g, "")
        if (val.charAt(0) === "0") {
            val = val.slice(1)
        }
        return val
    }

    function sendInputToParent(value) {

        // Bottom vals are unique, use as keys for storing box states
        props.onChange(props.bottomVal, Number(value))
    }

    function handleInput(event) {
        const filteredValue = filterInput(event)
        sendInputToParent(filteredValue)
        setBoxVal(filteredValue)
    }

    useEffect(() => {
        if (props.boxStates && props.boxStates[props.bottomVal].revealed) {
            setBoxVal(props.bottomVal)
            sendInputToParent(props.bottomVal)
        }
    }, [props.boxStates])

    return (
        <div className="boxDiv" style={divStyle}>
            <p className="boxTop">{props.topVal}</p>
            <input
                className="boxBottom"
                type="text"
                maxLength={2}
                onChange={handleInput}
                disabled={(props.boxStates && props.boxStates[props.bottomVal].revealed) || props.isSolved}
                value={boxVal}
            />
        </div>
    )
}