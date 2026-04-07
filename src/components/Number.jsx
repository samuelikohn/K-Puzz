import "../styles/Number.css"

export default function Number(props) {
    return (
        <p className={props.numbersUsed.includes(props.number + 1) ? "numberItemBlocked" : "numberItem"}>
            {props.number + 1}
        </p>
    )
}