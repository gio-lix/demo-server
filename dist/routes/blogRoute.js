"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogCtrl_1 = __importDefault(require("../controllers/blogCtrl"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.route("/blog/:id")
    .put(auth_1.default, blogCtrl_1.default.updateBlog)
    .get(blogCtrl_1.default.getBlog)
    .delete(auth_1.default, blogCtrl_1.default.deleteBlog);
router.post("/blog", auth_1.default, blogCtrl_1.default.createBlog);
router.get("/home/blogs", blogCtrl_1.default.getBlogs);
router.get("/blogs/:category_id", blogCtrl_1.default.getBlogsByCategory);
router.get("/blogs/user/:id", blogCtrl_1.default.getBlogsByUser);
router.get("/search/blogs", blogCtrl_1.default.searchBlog);
exports.default = router;
