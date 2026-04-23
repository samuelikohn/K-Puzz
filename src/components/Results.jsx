import { ScrollArea } from "@base-ui-components/react/scroll-area"
import toast, { Toaster } from "react-hot-toast"
import copy from "copy-to-clipboard"
import ModalLayer from "./ModalLayer.jsx"
import { useTheme } from "../contexts/ThemeContext"
import "../styles/Overlay.css"

export default function Results(props) {
    const { theme } = useTheme()
    const toasterId = "results-toast"
    const shareText = `I completed K-Puzz in ${translateTime(props.finalTime)}!\n\n${window.location.href}`

    function translateTime(timeInMS) {
        const totalSeconds = Math.floor(timeInMS / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = (Math.floor((totalSeconds % 3600) / 60)).toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false})
        const seconds = (totalSeconds % 60).toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false})

        return `${hours > 0 ? hours + ":" : ""}${minutes}:${seconds}`
    }

    function shareResults() {
        const didCopy = copy(shareText)

        if (didCopy) {
            toast("Results copied to clipboard!", { toasterId: toasterId })
        }
    }

    return (
        <ModalLayer contentClassName="modalShell" onClose={props.onClose}>
            {({ titleId }) => (
                <ScrollArea.Root className="scrollArea">
                    <ScrollArea.Viewport className="viewport">
                        <ScrollArea.Content>
                            <div className="overlay resultsDiv">
                                <h2 className="congrats" id={titleId}>Congratulations!</h2>
                                <div className="controlBox">
                                    <h4 className="bottomBreak">Final Time: {translateTime(props.finalTime)}</h4>
                                    <h4 className="bottomBreak">Checks Used: {props.numChecks}</h4>
                                    <h4>Reveals Used: {props.numReveals}</h4>
                                </div>
                                <div className="resultsCopyField">
                                    <textarea className="resultsShareText" defaultValue={shareText} />
                                    <button onClick={shareResults} className="iconBtn" type="button">
                                        <i className="fa-regular fa-copy"></i>
                                    </button>
                                </div>
                                <button onClick={props.onClose}>Show Puzzle</button>
                                <Toaster
                                    toasterId={toasterId}
                                    position="bottom-left"
                                    containerStyle={{
                                        position: "relative"
                                    }}
                                    toastOptions={{
                                        duration: 2000,
                                        style: (theme === "light" ?
                                            {
                                                background: "#fafafa",
                                                color: "#000000",
                                                padding: "0.25rem"
                                            } :
                                            {
                                                background: "#222222",
                                                color: "#dddddd",
                                                padding: "0.25rem"
                                            }
                                        )
                                    }}
                                />
                            </div>
                        </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar className="scrollbar">
                        <ScrollArea.Thumb className="thumb"/>
                    </ScrollArea.Scrollbar>
                </ScrollArea.Root>
            )}
        </ModalLayer>
    )
}
