import express from "express";
import auth from "../middleware/auth";
import commentCtrl from "../controllers/commentCtrl";

const router = express.Router()


router.post("/comment", auth, commentCtrl.createComment)

router.post("/reply_comment",auth, commentCtrl.replyComments)

router.put("/comment/:id", auth, commentCtrl.updateComment)
router.delete("/comment/:id", auth, commentCtrl.deleteComment)

router.get("/comments/blog/:id", commentCtrl.getComments)

// @ts-ignore
export default router