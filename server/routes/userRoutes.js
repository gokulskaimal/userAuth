const express = require("express")
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")
const { upload } = require("../config/cloudinary")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)
router.post("/profile/upload", protect, upload.single("profileImage"), uploadProfileImage)

module.exports = router

