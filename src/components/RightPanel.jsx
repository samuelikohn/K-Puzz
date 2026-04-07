import { useState } from "react"
import Numbers from "./Numbers.jsx"
import ConfirmCheck from "./ConfirmCheck.jsx"
import ConfirmReveal from "./ConfirmReveal.jsx"
import HowToPlay from "./HowToPlay.jsx"
import CheckSelect from "./CheckSelect.jsx"
import RevealSelect from "./RevealSelect.jsx"
import About from "./About.jsx"
import "../styles/RightPanel.css"

export default function RightPanel(props) {
    const [confirmCheckShown, setConfirmCheckShown] = useState(false)
    const [confirmRevealShown, setConfirmRevealShown] = useState(false)
    const [howToPlayPageShown, setHowToPlayPageShown] = useState(false)
    const [aboutPageShown, setAboutPageShown] = useState(false)
    const [checkSelectShown, setCheckSelectShown] = useState(false)
    const [revealSelectShown, setRevealSelectShown] = useState(false)
    const [cursorPos, setCursorPos] = useState(null)

    function handleCheckClick(event) {
        if (props.checkActive) {
            props.setCheckHighlights(false)
        } else {
            setCheckSelectShown(true)
            setCursorPos([event.clientX, event.clientY])
        }
    }

    function handleRevealClick(event) {
        if (props.revealActive) {
            props.setRevealHighlights(false)
        } else {
            setRevealSelectShown(true)
            setCursorPos([event.clientX, event.clientY])
        }
    }

    return (
        <>
            <div className="rightPanel">
                <Numbers numBoxes={props.numBoxes} numbersUsed={props.numbersUsed}/>
                {
                    props.isSolved ?
                    <button className="resultsBtn" onClick={() => props.setResultsShown(true)}>Show Results</button> :
                    <div className="checkReveal">
                        <button className="check" onClick={handleCheckClick}>{props.checkActive ? "Cancel" : "Check..."}</button>
                        <button className="reveal" onClick={handleRevealClick}>{props.revealActive ? "Cancel" : "Reveal..."}</button>
                    </div>
                }
                <button onClick={() => setHowToPlayPageShown(true)}>How to Play</button>
                <button onClick={() => setAboutPageShown(true)}>About</button>
                <a href="https://github.com/samuelikohn/K-Puzz/issues/new" target="_blank" referrerPolicy="no-referrer">
                    <button>Report a Bug</button>
                </a>
            </div>
            {
                checkSelectShown &&
                <CheckSelect
                    onClose={() => setCheckSelectShown(false)}
                    cursorPos={cursorPos}
                    setConfirmCheckShown={setConfirmCheckShown}
                    setCheckHighlights={props.setCheckHighlights}
                    setRevealHighlights={props.setRevealHighlights}
                />
            }
            {
                revealSelectShown &&
                <RevealSelect
                    onClose={() => setRevealSelectShown(false)}
                    cursorPos={cursorPos}
                    setConfirmRevealShown={setConfirmRevealShown}
                    setRevealHighlights={props.setRevealHighlights}
                    setCheckHighlights={props.setCheckHighlights}
                />
            }
            {confirmCheckShown && <ConfirmCheck onClose={() => setConfirmCheckShown(false)} checkAllBoxes={props.checkAllBoxes}/>}
            {confirmRevealShown && <ConfirmReveal onClose={() => setConfirmRevealShown(false)} revealAllBoxes={props.revealAllBoxes}/>}
            {howToPlayPageShown && <HowToPlay onClose={() => setHowToPlayPageShown(false)}/>}
            {aboutPageShown && <About onClose={() => setAboutPageShown(false)}/>}
        </>
    )
}