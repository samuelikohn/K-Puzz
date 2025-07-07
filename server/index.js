import express from "express"
import { Pool } from "pg"
import cors from "cors"
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(express.json())
app.use(cors())

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432
})

// Test database connection
pool.connect((err, client, done) => {
    if (err) {
        console.error("Database connection error:", err.stack)
        return
    }
    client.release()
})

// GET route to retrieve a puzzle by its ID
app.get("/puzzle/:id", async (req, res) => {
    const puzzleID = req.params.id

    if (!puzzleID) {
        return res.status(400).json({ message: "Puzzle ID is required." })
    }

    try {
        const selectQuery = `
            SELECT puzzle, width, height
            FROM public."Puzzles"
            WHERE id = $1
        `

        const result = await pool.query(selectQuery, [puzzleID])

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Puzzle with ID ${puzzleID} not found.` })
        }
        res.status(200).json(result.rows[0])

    } catch (error) {
        console.error(`Error retrieving puzzle with ID ${puzzleID}:`, error)
        res.status(500).json({ message: "Failed to retrieve puzzle.", error: error.message })
    }
})


// POST route to receive new puzzle data
app.post("/puzzle", async (req, res) => {
    const {newID, newPuzzle, width, height} = req.body

    if (!newPuzzle) {
        return res.status(400).json({ message: "Request body cannot be empty." })
    }

    try {
        const insertQuery = `
            INSERT INTO public."Puzzles" (id, puzzle, width, height)
            VALUES ($1, $2, $3, $4)
        `
        await pool.query(insertQuery, [newID, newPuzzle, width, height])

        res.status(201).json({
            message: "Puzzle saved successfully!"
        })

    } catch (error) {
        console.error("Error saving puzzle:", error)
        res.status(500).json({ message: "Failed to save puzzle.", error: error.message })
    }
})

// Start Express server
app.listen(port)
