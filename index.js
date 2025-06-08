const express = require("express")
const path = require("path")
const cors = require("cors")
require("dotenv").config()

const Router = require("./routes/index")

require("./db-connect")
const app = express()
app.use(cors())

app.use(express.json())
app.use("/public", express.static("./public"))
app.use(express.static(path.join(__dirname, 'build')))

app.use("/api", Router)
app.use((req, res) => {
    express.static(path.join(__dirname, 'build'))
});
 
const PORT = process.env.PORT || 8000
app.listen(PORT, console.log(`Server is Running at http://localhost:${PORT}`))