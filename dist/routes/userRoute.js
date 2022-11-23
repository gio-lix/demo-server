"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const userCtrl_1 = __importDefault(require("../controllers/userCtrl"));
const router = express_1.default.Router();
router.get("/user/:id", userCtrl_1.default.getUsers);
router.put("/user", auth_1.default, userCtrl_1.default.updateUser);
router.put("/reset_password", auth_1.default, userCtrl_1.default.updatePassword);
exports.default = router;
