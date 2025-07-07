import { useState, useEffect } from "react"
import "../styles/Connections.css"

export default function Connections(props) {
    const [rootFontSize, setRootFontSize] = useState(16) // Default to 16px

    useEffect(() => {
        const htmlElement = document.documentElement
        if (htmlElement) {
            const computedStyle = window.getComputedStyle(htmlElement)
            const fontSize = parseFloat(computedStyle.fontSize)
            setRootFontSize(fontSize)
        }
    }, [])

    return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {
                props.paths.map((path, i) =>
                    <path
                        key={i}
                        d={"M " + path.map(
                            
                            // Align paths with box centers
                            // 12px difference between box and svg origins
                            point => `
                                ${rootFontSize * (point[0] * (props.width + props.margin) + props.offsetX + 1.75)}
                                ${rootFontSize * (point[1] * (props.height + props.margin) + props.offsetY + 3.375)}
                            `
                        ).join(" L ")}
                    />
                )
            }
        </svg>
    )
}