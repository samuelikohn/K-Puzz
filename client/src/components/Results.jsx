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
                        <div className="overlay resultsDiv" onClick={(event) => event.stopPropagation}>
                            <h1 className="congrats">Congratulations!</h1>
                            <h2>Final Time:</h2>
                            <h2 className="finalTime">{translateTime(props.finalTime)}</h2>
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