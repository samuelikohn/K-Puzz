import { useRef } from "react"
import { useTheme } from '../contexts/ThemeContext'
import toast, { Toaster } from 'react-hot-toast'
import copy from "copy-to-clipboard"
import "../styles/Settings.css"

export default function Settings(props) {
    const {theme, toggleTheme} = useTheme()
    const textRef = useRef()
    const toasterId = "settings-toast"

    function copyToClipboard() {
        const copyText = textRef.current.value
        const didCopy = copy(copyText)
        if (didCopy) {
            toast("Copied!", { toasterId: toasterId })
        }
    }

    function filterInput(event) {
        const input = event.target
        input.value = input.value.replace(/[^0-9]/g, "")
        if (input.value.charAt(0) === "0") {
            input.value = input.value.slice(1)
        }
    }

    function generateNewPuzzle() {
        const width = Number(props.selectedWidth)
        const height = Number(props.selectedHeight)
        const id = props.enteredPuzzleID.trim()
        props.generateNewPuzzle({width, height, id})
    }

    return (
        <form className="settingsForm" action={generateNewPuzzle}>
            <button className="newGameBtn" type="submit">Generate Puzzle</button>
            <div className="controlBox">
                <h4>Settings</h4>
                <div className="setting">
                    <label htmlFor="puzzleWidth">Width</label>
                    <select
                        name="puzzleWidth"
                        id="puzzleWidth"
                        value={props.selectedWidth}
                        onChange={(event) => props.setSelectedWidth(event.target.value)}
                    >
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="setting height">
                    <label htmlFor="puzzleHeight">Height</label>
                    <select
                        name="puzzleHeight"
                        id="puzzleHeight"
                        value={props.selectedHeight}
                        onChange={(event) => props.setSelectedHeight(event.target.value)}
                    >
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="setting getID">
                    <label htmlFor="idInput" id="idInputLabel">Enter Puzzle ID</label>
                    <input
                        type="text"
                        name="idInput"
                        id="idInput"
                        onChange={(event) => {
                            filterInput(event)
                            props.setEnteredPuzzleID(event.target.value)
                        }}
                        value={props.enteredPuzzleID}
                    />
                    <label htmlFor="idOutput">Puzzle ID</label>
                    <div className="copyField">
                        <input type="text" name="idOutput" id="idOutput" value={props.puzzleID} ref={textRef} disabled/>
                        <button onClick={copyToClipboard} className="iconBtn" type="button">
                            <i className="fa-regular fa-copy"></i>
                        </button>
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
                </div>
                <div className="setting themeToggle">
                    <label htmlFor="themeToggle">Theme</label>
                    <button name="themeToggle" id="themeToggle" className="iconBtn" type="button" onClick={toggleTheme}>
                        <i className={`fa-regular fa-${theme === "light" ? "sun" : "moon"}`}></i>
                    </button>
                </div>
            </div>
        </form>
    )
}
