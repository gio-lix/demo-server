import express from "express"
import blogCtrl from "../controllers/blogCtrl";

const router = express.Router()


router.get("/home/blogs" ,blogCtrl.getBlogs)



export default router