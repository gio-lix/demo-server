import express from "express"
import blogCtrl from "../controllers/blogCtrl";
import auth from "../middleware/auth";

const router = express.Router()

router.route("/blog/:id")
    .put(auth, blogCtrl.updateBlog)
    .get(blogCtrl.getBlog)
    .delete(auth,blogCtrl.deleteBlog)

router.post("/blog", auth ,blogCtrl.createBlog)

router.get("/home/blogs" ,blogCtrl.getBlogs)

router.get("/blogs/:category_id" ,blogCtrl.getBlogsByCategory)

router.get("/blogs/user/:id" ,blogCtrl.getBlogsByUser)

router.get("/search/blogs", blogCtrl.searchBlog)



export default router