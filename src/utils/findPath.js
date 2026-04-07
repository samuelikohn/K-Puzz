export function findPath(blocked, start, end, width, height) {
    const directions = [
        [1, 0], // right
        [0, -1], // up
        [-1, 0],  // left
        [0, 1] // down
    ]

    // Helper to convert coordinates to a string for Set storage and lookup
    const pointToString = (p) => `${p[0]},${p[1]}`

    const queue = [] // Use a simple array as a queue (shift/push)
    queue.push({ point: start, path: [start] })

    const visited = new Set()
    visited.add(pointToString(start))

    // Convert blocked coordinates to a Set of strings for efficient lookup
    const blockedSet = new Set()
    for (const b of blocked) {
        const bStr = pointToString(b)
        
        // Ensure start and end points are not considered blocked for the path itself
        if (bStr !== pointToString(start) && bStr !== pointToString(end)) {
            blockedSet.add(bStr)
        }
    }

    while (queue.length > 0) {
        const { point, path } = queue.shift() // Dequeue
        const [row, col] = point

        if (row === end[0] && col === end[1]) {
            return path // Path found
        }

        for (const [dr, dc] of directions) {
            const r = row + dr
            const c = col + dc
            const newPoint = [r, c]
            const newPointStr = pointToString(newPoint)

            if (!blockedSet.has(newPointStr) && !visited.has(newPointStr) && (r <= width) && (r >= -1) && (c <= height) && (c >= -1)) {
                visited.add(newPointStr)
                const newPath = [...path, newPoint]
                queue.push({ point: newPoint, path: newPath }) // Enqueue
            }
        }
    }

    return null
}