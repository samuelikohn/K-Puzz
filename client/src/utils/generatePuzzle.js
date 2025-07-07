import { findPath } from "./findPath.js"

export function generatePuzzle(width, height) {

    function createConnection(box, dir, chance) {
        const newX = box.x + dir[0]
        const newY = box.y + dir[1]
        const newBox = getBoxByCoords(newX, newY, boxes)
        if (newBox && (Math.random() < chance) && !connectionExists(newBox, [box.x, box.y])) {
            const path = findPath(blocked, [box.x, box.y], [newX, newY], width, height)
            if (path) {
                connections.push(path)
                for (const point of path) {
                    blocked.push(point)
                }
                box.connections.push([newX, newY])
                newBox.connections.push([box.x, box.y])
                box.topVal += newBox.bottomVal
                newBox.topVal += box.bottomVal

                return true
            }
        }
        return false
    }

    // Relative coords of boxes `i` units away
    const dirs = [
        [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ],
        [
            [0, 2],
            [2, 0],
            [0, -2],
            [-2, 0],
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1]
        ],
        [
            [0, 3],
            [3, 0],
            [0, -3],
            [-3, 0],
            [1, 2],
            [2, 1],
            [-1, 2],
            [-2, 1],
            [1, -2],
            [2, -1],
            [-1, -2],
            [-2, -1]
        ]
    ]

    // Chances of connecting to boxes `i` units away
    const chances = [0.9, 0.6, 0.3]

    // Coordinates occupied by boxes or connections
    const blocked = []

    // Fill coords with boxes, pop 25%
    const boxes = []
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (Math.random() < 0.75) {
                boxes.push({
                    x: i,
                    y: j,
                    topVal: 0,
                    bottomVal: 0,
                    connections: []
                })
                blocked.push([i, j])
            }
        }
    }

    // Box vals are ints from 1 to number of boxes
    const bottomVals = shuffle([...Array(boxes.length).keys()])

    // Assign shuffled vals to boxes
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].bottomVal = bottomVals[i] + 1
    }

    // X% chance to connect to boxes Y units away
    const connections = []
    for (let i = 0; i < 3; i++) {
        for (const box of boxes) {
            for (const dir of dirs[i]) {
                let _ = createConnection(box, dir, chances[i])
            }
        }
    }

    // Do another pass to connect isolated boxes
    const flatDirs = dirs.flat()
    for (const box of boxes) {
        if (box.connections.length === 0) {
            for (const dir of flatDirs) {
                if (createConnection(box, dir, 1)) {
                    break
                }
            }
        }
        if (box.connections.length === 1) {
            for (const dir of flatDirs) {
                if (createConnection(box, dir, 1)) {
                    break
                }
            }
        }
    }

    return {
        boxes,
        connections
    }
}

// Fisher-Yates shuffle
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = arr[j]
        arr[j] = arr[i]
        arr[i] = temp
    }
    return arr
}

// Get box by coords if exists, else null
function getBoxByCoords(x, y, boxes) {
    for (const box of boxes) {
        if (box.x === x && box.y === y) {
            return box
        }
    }
    return null
}

// Check if two boxes are already connected
function connectionExists(box, point) {
    for (const p of box.connections) {
        if (p[0] === point[0] && p[1] === point[1]) {
            return true
        }
    }
    return false
}