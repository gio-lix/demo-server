"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModule_1 = __importDefault(require("../moduls/userModule"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({ msg: "Invalid Authorization" });
        }
        const accessToken = token.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`);
        if (!decoded) {
            return res.status(400).json({ msg: "Invalid Authorization" });
        }
        const user = yield userModule_1.default.findOne({ _id: decoded.id }).select("-password");
        if (!user)
            return res.status(400).json({ msg: "Invalid Authorization" });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
exports.default = auth;
