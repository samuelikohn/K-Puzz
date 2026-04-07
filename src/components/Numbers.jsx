import Number from "./Number.jsx"
import "../styles/Numbers.css"

export default function Numbers(props) {
    return (
        <div className="numbers controlBox">
            <h4>Available Numbers</h4>
            <div className="numbersList">
                {
                    [...Array(props.numBoxes).keys()].map(i =>
                        <Number key={i} number={i} numbersUsed={props.numbersUsed}/>
                    )
                }
            </div>
        </div>
    )
}