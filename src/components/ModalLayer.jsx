import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
].join(", ")

let activeModalCount = 0
const modalStack = []

function getFocusableElements(container) {
    if (!container) {
        return []
    }

    return Array.from(container.querySelectorAll(focusableSelector)).filter((element) => {
        if (element.hasAttribute("inert")) {
            return false
        }

        const ariaHidden = element.getAttribute("aria-hidden")
        if (ariaHidden === "true") {
            return false
        }

        return element.offsetParent !== null || document.activeElement === element
    })
}

function focusInitialElement(container) {
    const focusableElements = getFocusableElements(container)
    const initialElement = focusableElements[0] ?? container
    initialElement?.focus()
}

export default function ModalLayer(props) {
    const {
        ariaLabel,
        children,
        onClose,
        titleId,
        role = "dialog",
        backdropClassName = "overlayBackdrop",
        contentClassName = "overlay",
        contentStyle,
        contentRef = null
    } = props

    const generatedTitleId = useId()
    const fallbackRef = useRef(null)
    const containerRef = contentRef ?? fallbackRef
    const modalId = useId()
    const labelledBy = typeof children === "function" ? titleId ?? generatedTitleId : titleId

    useEffect(() => {
        const appShell = document.getElementById("app-shell")
        const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null

        activeModalCount += 1
        modalStack.push(modalId)

        if (appShell) {
            appShell.setAttribute("inert", "")
            appShell.setAttribute("aria-hidden", "true")
        }

        focusInitialElement(containerRef.current)

        return () => {
            const stackIndex = modalStack.lastIndexOf(modalId)
            if (stackIndex !== -1) {
                modalStack.splice(stackIndex, 1)
            }

            activeModalCount = Math.max(0, activeModalCount - 1)

            if (appShell && activeModalCount === 0) {
                appShell.removeAttribute("inert")
                appShell.removeAttribute("aria-hidden")
            }

            previousActiveElement?.focus()
        }
    }, [containerRef, modalId])

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key !== "Tab") {
                return
            }

            if (modalStack[modalStack.length - 1] !== modalId) {
                return
            }

            const container = containerRef.current
            if (!container) {
                return
            }

            const focusableElements = getFocusableElements(container)
            if (focusableElements.length === 0) {
                event.preventDefault()
                container.focus()
                return
            }

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
            } else if (!container.contains(document.activeElement)) {
                event.preventDefault()
                firstElement.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [containerRef, modalId])

    return createPortal(
        <div className={backdropClassName} onClick={onClose}>
            <div
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                aria-modal="true"
                className={contentClassName}
                onClick={(event) => event.stopPropagation()}
                ref={containerRef}
                role={role}
                style={contentStyle}
                tabIndex={-1}
            >
                {typeof children === "function" ? children({ titleId: titleId ?? generatedTitleId }) : children}
            </div>
        </div>,
        document.body
    )
}
