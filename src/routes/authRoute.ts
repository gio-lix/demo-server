import express from "express"
import authCtrl from "../controllers/authCtrl";
import {validRegister} from "../middleware/valid"
import auth from "../middleware/auth";

const router = express.Router()

router.get("/refresh_token", authCtrl.refreshToken)
router.post("/google_token", authCtrl.googleLogin)
router.post("/register", validRegister, authCtrl.register)

router.post("/login", authCtrl.login)
router.get("/logout",auth, authCtrl.logout)

export default router
