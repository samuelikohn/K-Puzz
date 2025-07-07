import { useState, useEffect } from "react"
import { v4 } from "uuid"
import { det } from "mathjs"
import Puzzle from "./components/Puzzle.jsx"
import LeftPanel from "./components/LeftPanel.jsx"
import RightPanel from "./components/RightPanel.jsx"
import { generatePuzzle } from "./utils/generatePuzzle.js"
import "./styles/App.css"

export default function App() {
    const [currPuzzle, setCurrPuzzle] = useState(null)
    const [numbersUsed, setNumbersUsed] = useState({})
    const [puzzleData, setPuzzleData] = useState({width: 3, height: 3, id: 0})
    const [boxKeys, setBoxKeys] = useState([])
    const [startTime, setStartTime] = useState(Date.now())
	const [isSolved, setIsSolved] = useState(false)
    const [resultsShown, setResultsShown] = useState(false)
	const [boxStates, setBoxStates] = useState(null)

	function anyIsolatedBoxes(puzzle) {
		for (const box of puzzle.boxes) {
			if (box.connections.length === 0) {
				return true
			}
		}
		return false
	}

	function noUniqueSolution(puzzle) {
		const matrixRepresentation = []
		for (const box of puzzle.boxes) {
			const boxEquation = Array(puzzle.boxes.length).fill(0)
			for (const connection of box.connections) {
				for (const box2 of puzzle.boxes) {
					if (box2.x === connection[0] && box2.y === connection[1]) {
						boxEquation[box2.bottomVal - 1] = 1
						break
					}
				}
			}
			matrixRepresentation.push(boxEquation)
		}
		return det(matrixRepresentation) === 0
	}

	function generateNewPuzzle(data) {
		setBoxStates(null)
		setPuzzleData(data)
		setIsSolved(false)
	}

	function updateNumbersUsed(boxID, currentValue) {
		if (boxID === null && currentValue === null) {
			setNumbersUsed({})
		} else {
			setNumbersUsed(prevNumbersUsed => ({
				...prevNumbersUsed,
				[boxID]: currentValue
			}))
		}
	}

	function revealAllBoxes() {
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates [box] = {
					checkedCorrect: false,
					checkedIncorrect: false,
					revealed: true
				}
			}
			return newBoxStates 
		})
	}

	function writeToDB(newID, newPuzzle, width, height) {
		fetch("/puzzle", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({newID, newPuzzle, width, height})
		}).then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			return response.json()
		}).catch(error => {
			console.error("Error:", error)
		})
	}

	// Wait for puzzle data to get puzzle
    useEffect(() => {
		async function getPuzzleByID(puzzleID) {
			try {
				if (!puzzleID) {
					throw new Error("No puzzle ID provided")
				}

				const response = await fetch(`/puzzle/${puzzleID}`)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const data = await response.json()

				// On successful GET, set states
				const newPuzzle = {...data, puzzle: JSON.parse(data.puzzle)}
				const keys = []
				for (let i = 0; i < 2 * newPuzzle.puzzle.boxes.length; i++) {
					keys.push(v4())
				}
				setBoxKeys(keys)
				setCurrPuzzle(newPuzzle)
				setStartTime(Date.now())

			} catch (err) {

				// If no ID or no puzzle found, generate new puzzle and ID
				let newPuzzle = generatePuzzle(puzzleData.width, puzzleData.height)
				while (anyIsolatedBoxes(newPuzzle) || noUniqueSolution(newPuzzle)) {
					newPuzzle = generatePuzzle(puzzleData.width, puzzleData.height)
				}
				const newID = Date.now() - 1734480000000
				writeToDB(newID, newPuzzle, puzzleData.width, puzzleData.height)

				// Setting new ID calls effect again
				setPuzzleData(prevPuzzleData => ({...prevPuzzleData, id: newID}))
			}
		}
		getPuzzleByID(puzzleData.id)
    }, [puzzleData])

	// Once puzzle is retrieved, set box states
	useEffect(() => {
		if (currPuzzle) {
			const allStates = {}
			for (const box of currPuzzle.puzzle.boxes) {
				allStates[box.bottomVal] = {
					checkedCorrect: false,
					checkedIncorrect: false,
					revealed: false
				}
			}
			setBoxStates(allStates)
		}
	}, [currPuzzle])

	return (
		<div className="app">
			<LeftPanel
				generateNewPuzzle={generateNewPuzzle}
				puzzleID={puzzleData.id}
			/>
			{
				currPuzzle &&
				<Puzzle
					puzzle={currPuzzle}
					keys={boxKeys}
					updateNumbersUsed={updateNumbersUsed}
					startTime={startTime}
					resultsShown={resultsShown}
					setResultsShown={setResultsShown}
					isSolved={isSolved}
					setIsSolved={setIsSolved}
					boxStates={boxStates}
				/>
			}
			<RightPanel
				numBoxes={currPuzzle ? currPuzzle.puzzle.boxes.length : 0}
				numbersUsed={Object.values(numbersUsed)}
				isSolved={isSolved}
				setResultsShown={setResultsShown}
				revealAllBoxes={revealAllBoxes}
			/>
		</div>
	)
}