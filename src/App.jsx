import { useState, useEffect } from "react"
import { v4 } from "uuid"
import { det } from "mathjs"
import Puzzle from "./components/Puzzle.jsx"
import LeftPanel from "./components/LeftPanel.jsx"
import RightPanel from "./components/RightPanel.jsx"
import { generatePuzzle } from "./utils/generatePuzzle.js"
import tutorialPuzzles from "./utils/tutorialPuzzles.js"
import "./styles/App.css"

export default function App() {
    const [currPuzzle, setCurrPuzzle] = useState(null)
    const [numbersUsed, setNumbersUsed] = useState({})
    const [puzzleData, setPuzzleData] = useState({width: 3, height: 3, id: 0})
    const [puzzleID, setPuzzleID] = useState(0)
    const [boxKeys, setBoxKeys] = useState([])
    const [startTime, setStartTime] = useState(Date.now())
	const [isSolved, setIsSolved] = useState(false)
    const [resultsShown, setResultsShown] = useState(false)
    const [boxCorrectness, setBoxCorrectness] = useState({1: false})
    const [boxEmptiness, setBoxEmptiness] = useState({1: false})
	const [boxStates, setBoxStates] = useState(null)
	const [numChecks, setNumChecks] = useState(0)
	const [numReveals, setNumReveals] = useState(0)
	const TUTORIAL_IDS = [1, 2, 3, 4, 5]

	// Wait for puzzle data to get puzzle
    useEffect(() => {
		const newPuzzle = getPuzzleByID(puzzleData.id)
		const keys = []
		for (let i = 0; i < 2 * newPuzzle.puzzle.boxes.length; i++) {
			keys.push(v4())
		}
		setBoxKeys(keys)
		setCurrPuzzle(newPuzzle)
		setStartTime(Date.now())
    }, [puzzleData])

	// Once puzzle is retrieved, set box states
	useEffect(() => {
		if (currPuzzle) {
			const allStates = {}
			for (const box of currPuzzle.puzzle.boxes) {
				allStates[box.bottomVal] = {
					checkHighlighted: false,
					checkedCorrect: false,
					checkedIncorrect: false,
					revealHighlighted: false,
					revealed: false
				}
			}
			setBoxStates(allStates)
		}
	}, [currPuzzle])

	function anyIsolatedBoxes(puzzle) {
		for (const box of puzzle.boxes) {
			if (box.connections.length === 0) {
				return true
			}
		}
		return false
	}

	function checkAllBoxes() {
		let checks = 0
		setRevealHighlights(false)
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates[box] = {...prevBoxStates[box], checkHighlighted: false}
				if (!boxEmptiness[Number(box)] && !prevBoxStates[box].revealed && !prevBoxStates[box].checkedCorrect && !prevBoxStates[box].checkedIncorrect) {
					checks += 1
					if (boxCorrectness[Number(box)]) {
						newBoxStates[box].checkedCorrect = true
					} else {
						newBoxStates[box].checkedIncorrect = true
					}
				}
			}
			return newBoxStates
		})
		setNumChecks(prevNumChecks => prevNumChecks + checks)
	}

	function checkBox(boxID, isCorrect) {
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates[box] = {...prevBoxStates[box], checkHighlighted: false}
				if (box === boxID && !prevBoxStates[box].revealed) {
					if (isCorrect) {
						newBoxStates[box].checkedCorrect = true
					} else {
						newBoxStates[box].checkedIncorrect = true
					}
				}
			}
			return newBoxStates 
		})
		setNumChecks(prevNumChecks => prevNumChecks + 1)
	}

	function generateNewPuzzle(data) {
		setNumChecks(0)
		setNumReveals(0)
		setBoxStates(null)
		setPuzzleData(data)
		setIsSolved(false)
	}

	function getPuzzleByID(prevPuzzleID) {
		if (TUTORIAL_IDS.includes(prevPuzzleID)) {
			setPuzzleID(newPuzzleID)
			return tutorialPuzzles[prevPuzzleID - 1]
		}

		let newPuzzleID
		if (prevPuzzleID) {
			newPuzzleID = prevPuzzleID
		} else {
			newPuzzleID = Date.now() - 1734480000000
		}

		let newPuzzle = generatePuzzle(puzzleData.width, puzzleData.height, newPuzzleID)
		while (anyIsolatedBoxes(newPuzzle) || noUniqueSolution(newPuzzle)) {
			newPuzzleID += 1
			newPuzzle = generatePuzzle(puzzleData.width, puzzleData.height, newPuzzleID)
		}
		setPuzzleID(newPuzzleID)
	
		return {puzzle: newPuzzle, width: puzzleData.width, height: puzzleData.height}
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

	function resetCheckState(boxID) {
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates[box] = {...prevBoxStates[box], checkedIncorrect: (box === boxID ? false : prevBoxStates[box].checkedIncorrect)}
			}
			return newBoxStates 
		})
	}
	
	function revealAllBoxes() {
		let reveals = 0
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates[box] = {...prevBoxStates[box]}
				if (!prevBoxStates[box].revealed && !prevBoxStates[box].checkedCorrect) {
					reveals += 1
					newBoxStates[box].revealed = true
				}
			}
			return newBoxStates 
		})
		setNumReveals(prevNumReveals => prevNumReveals + reveals)
	}
	
	function revealBox(boxID) {
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates[box] = {...prevBoxStates[box], revealHighlighted: false}
				if (box === boxID) {
					newBoxStates[box].revealed = true
				}
			}
			return newBoxStates 
		})
		setNumReveals(prevNumReveals => prevNumReveals + 1)
	}

	function setCheckHighlights(isHighlighted) {
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates[box] = {...prevBoxStates[box]}
				if (!prevBoxStates[box].revealed && !prevBoxStates[box].checkedCorrect && !prevBoxStates[box].checkedIncorrect) {
					newBoxStates[box].checkHighlighted = isHighlighted
				}
			}
			return newBoxStates 
		})
	}

	function setRevealHighlights(isHighlighted) {
		setBoxStates(prevBoxStates => {
			const newBoxStates = {}
			for (const box of Object.keys(prevBoxStates)) {
				newBoxStates[box] = {...prevBoxStates[box]}
				if (!prevBoxStates[box].revealed && !prevBoxStates[box].checkedCorrect) {
					newBoxStates[box].revealHighlighted = isHighlighted
				}
			}
			return newBoxStates 
		})
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

	return (
		<div className="app">
			<LeftPanel
				generateNewPuzzle={generateNewPuzzle}
				puzzleID={puzzleID}
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
					boxCorrectness={boxCorrectness}
					boxEmptiness={boxEmptiness}
					setBoxCorrectness={setBoxCorrectness}
					setBoxEmptiness={setBoxEmptiness}
					boxStates={boxStates}
					checkBox={checkBox}
					revealBox={revealBox}
					resetCheckState={resetCheckState}
                    numChecks={numChecks}
                    numReveals={numReveals}
				/>
			}
			<RightPanel
				numBoxes={currPuzzle ? currPuzzle.puzzle.boxes.length : 0}
				numbersUsed={Object.values(numbersUsed)}
				isSolved={isSolved}
				setResultsShown={setResultsShown}
				setCheckHighlights={setCheckHighlights}
				setRevealHighlights={setRevealHighlights}
				checkAllBoxes={checkAllBoxes}
				revealAllBoxes={revealAllBoxes}
				checkActive={boxStates && Object.values(boxStates).some(state => state.checkHighlighted)}
				revealActive={boxStates && Object.values(boxStates).some(state => state.revealHighlighted)}
			/>
		</div>
	)
}