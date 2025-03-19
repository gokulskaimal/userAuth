const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const cors = require("cors")
const { errorHandler } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()
 
// Middleware
app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes  
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))
 
// Error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold)
})

