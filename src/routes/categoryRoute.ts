import express from "express";
import categoryCtrl from "../controllers/categoryCtrl";
import auth from "../middleware/auth";

const router = express.Router()

router.route("/category")
    .post(auth, categoryCtrl.createCategory)
    .get(categoryCtrl.getCategory)


router.route("/category/:id")
    .put(auth, categoryCtrl.updateCategory)
    .delete(auth, categoryCtrl.deleteCategory)


export default router