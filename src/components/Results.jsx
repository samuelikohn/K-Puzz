import { ScrollArea } from "@base-ui-components/react/scroll-area"
import "../styles/Overlay.css"

export default function Results(props) {

    function translateTime(timeInMS) {
        const totalSeconds = Math.floor(timeInMS / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = (Math.floor((totalSeconds % 3600) / 60)).toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false})
        const seconds = (totalSeconds % 60).toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false})

        return `${hours > 0 ? hours + ":" : ""}${minutes}:${seconds}`
    }

    return (
        <div className="overlayBackdrop" onClick={props.onClose}>
            <ScrollArea.Root className="scrollArea">
                <ScrollArea.Viewport className="viewport">
                    <ScrollArea.Content>
                        <div className="overlay resultsDiv" onClick={(event) => event.stopPropagation()}>
                            <h2 className="congrats">Congratulations!</h2>
                            <div className="controlBox">
                                <h4 className="bottomBreak">Final Time: {translateTime(props.finalTime)}</h4>
                                <h4 className="bottomBreak">Checks Used: {props.numChecks}</h4>
                                <h4>Reveals Used: {props.numReveals}</h4>
                            </div>
                            <button onClick={props.onClose}>Show Puzzle</button>
                        </div>
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="scrollbar">
                    <ScrollArea.Thumb className="thumb"/>
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </div>
    )
}