const express = require("express")
const router = express.Router()
const { loginAdmin, getUsers, createUser, updateUser, deleteUser } = require("../controllers/adminController")
const { admin } = require("../middleware/authMiddleware")

router.post("/login", loginAdmin)
router.get("/users", admin, getUsers)
router.post("/users", admin, createUser)
router.put("/users/:id", admin, updateUser)
router.delete("/users/:id", admin, deleteUser)

module.exports = router

