require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: {
    //   rejectUnauthorized: false // Consider setting this to true in production and configuring CA certificates
    // }
})

app.get("/", (req, res) => {
    res.send("Hello from the backend!")
})

// TODO: Implement API endpoints

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
