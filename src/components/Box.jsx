import { useState, useEffect, useRef } from "react"
import "../styles/Box.css"

export default function Box(props) {
    const [boxVal, setBoxVal] = useState("")
    const inputRef = useRef(null)
    
    const divStyle = {
        top: props.y * (props.height + props.margin) + props.offsetY + "rem",
        left: props.x * (props.width + props.margin) + props.offsetX + "rem"
    }

    useEffect(() => {
        if (props.boxStates && props.boxStates[props.bottomVal].revealed) {
            setBoxVal(props.bottomVal)
            sendInputToParent(props.bottomVal)
        }
    }, [props.boxStates])
    
    function filterInput(event) {
        let val = event.target.value
        val = val.replace(/[^0-9]/g, "")
        if (val.charAt(0) === "0") {
            val = val.slice(1)
        }
        return val
    }
    
    function handleClick() {
        if (props.boxStates && props.boxStates[props.bottomVal].revealHighlighted) {
            props.revealBox(String(props.bottomVal))
        } else if (inputRef.current && props.boxStates && props.boxStates[props.bottomVal].checkHighlighted) {
            props.checkBox((inputRef.current.value ? String(props.bottomVal) : ""), String(props.bottomVal) === inputRef.current.value)
        }
    }
    
    function handleInput(event) {
        props.resetCheckState(String(props.bottomVal))
        const filteredValue = filterInput(event)
        sendInputToParent(filteredValue)
        setBoxVal(filteredValue)
    }
    
    function sendInputToParent(value) {

        // Bottom vals are unique, use as keys for storing box states
        props.onChange(props.bottomVal, Number(value))
    }

    function setInputClassName() {
        if (props.boxStates) {
            if (props.boxStates[props.bottomVal].revealed) {
                return "revealed"
            } else if (props.boxStates[props.bottomVal].checkedCorrect) {
                return "checkedCorrect"
            } else if (props.boxStates[props.bottomVal].checkedIncorrect) {
                return "checkedIncorrect"
            }
        }
        return "boxBottom"
    }

    return (
        <div
            className={
                props.boxStates && (
                    props.boxStates[props.bottomVal].revealHighlighted ||
                    props.boxStates[props.bottomVal].checkHighlighted
                ) ? 
                "highlighted" :
                "boxDiv"
            }
            style={divStyle}
            onClick={handleClick}
        >
            <p className="boxTop">{props.topVal}</p>
            <input
                className={setInputClassName()}
                type="text"
                maxLength={2}
                onChange={handleInput}
                disabled={(props.boxStates && (props.boxStates[props.bottomVal].checkedCorrect || props.boxStates[props.bottomVal].revealed)) || props.isSolved}
                value={boxVal}
                ref={inputRef}
            />
        </div>
    )
}