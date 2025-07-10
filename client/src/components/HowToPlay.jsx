import { ScrollArea } from '@base-ui-components/react/scroll-area'
import { useTheme } from '../contexts/ThemeContext'
import "../styles/Overlay.css"

export default function HowToPlay(props) {
    const {theme, toggleTheme} = useTheme()

    return (
        <div className="overlayBackdrop" onClick={props.onClose}>
            <ScrollArea.Root className="scrollArea">
                <ScrollArea.Viewport className="viewport">
                    <ScrollArea.Content>
                        <div className="overlay" onClick={(event) => event.stopPropagation()}>
                            <h2>How to Play</h2>
                            <div className="controlBox">
                                <h4>There is only one rule:</h4>
                                <p>
                                    Using the available numbers exactly once each,
                                    fill in the bottom of each box such that the
                                    number in the top of each box is equal to the
                                    sum of the bottom numbers in the boxes directly
                                    connected to it, excluding the box's own bottom number.
                                </p>
                            </div>
                            <div className="controlBox">
                                <p>For example, in the following puzzle, the numbers placed in the highlighted boxes must sum to 8.</p>
                            </div>
                            <img src={`src/assets/example_${theme}.png`} alt="Example Puzzle"/>
                            <div className="controlBox">
                                <p>Enter a <b>Puzzle ID</b> of <b>1</b>, <b>2</b>, <b>3</b>, <b>4</b>, or <b>5</b> for simple tutorial puzzles.</p>
                            </div>
                            <div className="controlBox">
                                <p>Every puzzle is guaranteed to have a unique solution.</p>
                            </div>
                            <button onClick={props.onClose}>Close</button>
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