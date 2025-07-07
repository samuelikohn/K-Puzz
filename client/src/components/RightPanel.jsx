import { useState } from "react"
import Numbers from "./Numbers.jsx"
import HowToPlay from "./HowToPlay.jsx"
import CheckSelect from "./CheckSelect.jsx"
import RevealSelect from "./RevealSelect.jsx"
import About from "./About.jsx"
import "../styles/RightPanel.css"

export default function RightPanel(props) {
    const [howToPlayPageShown, setHowToPlayPageShown] = useState(false)
    const [aboutPageShown, setAboutPageShown] = useState(false)
    const [checkSelectShown, setCheckSelectShown] = useState(false)
    const [revealSelectShown, setRevealSelectShown] = useState(false)
    const [cursorPos, setCursorPos] = useState(null)

    function handleCheckClick(event) {
        setCheckSelectShown(true)
        setCursorPos([event.clientX, event.clientY])
    }

    function handleRevealClick(event) {
        setRevealSelectShown(true)
        setCursorPos([event.clientX, event.clientY])
    }

    return (
        <>
            <div className="rightPanel">
                <Numbers numBoxes={props.numBoxes} numbersUsed={props.numbersUsed}/>
                {
                    props.isSolved ?
                    <button className="resultsBtn" onClick={() => props.setResultsShown(true)}>Show Results</button> :
                    <div className="checkReveal">
                        <button className="check" onClick={props.isSolved ? null : handleCheckClick}>Check...</button>
                        <button className="reveal" onClick={props.isSolved ? null : handleRevealClick}>Reveal...</button>
                    </div>
                }
                <button onClick={() => setHowToPlayPageShown(true)}>How to Play</button>
                <button onClick={() => setAboutPageShown(true)}>About</button>
            </div>
            {checkSelectShown && <CheckSelect onClose={() => setCheckSelectShown(false)} cursorPos={cursorPos}/>}
            {revealSelectShown && <RevealSelect onClose={() => setRevealSelectShown(false)} cursorPos={cursorPos} revealAllBoxes={props.revealAllBoxes}/>}
            {howToPlayPageShown && <HowToPlay onClose={() => setHowToPlayPageShown(false)}/>}
            {aboutPageShown && <About onClose={() => setAboutPageShown(false)}/>}
        </>
    )
}