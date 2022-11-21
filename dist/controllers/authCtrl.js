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
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../config/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
const CLIENT_URL = `${process.env.BASE_URL}`;
const authCtrl = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, account, password } = req.body;
            const user = yield userModule_1.default.findOne({ account });
            if (user)
                return res.status(400).json({ msg: "Email or Phone number already exists." });
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const newUser = new userModule_1.default({
                name, account, password: passwordHash
            });
            const active_token = (0, generateToken_1.generateActiveToken)({ newUser });
            yield newUser.save();
            res.json({
                status: "OK",
                msg: "Register successfully",
                data: newUser,
                active_token
            });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { account, password } = req.body;
            const user = yield userModule_1.default.findOne({ account });
            if (!user)
                return res.status(400).json({ msg: "This account does not exits" });
            yield loginUser(user, password, res);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication." });
        try {
            res.clearCookie("refreshtoken", { path: `/api/refresh_token` });
            yield userModule_1.default.findOneAndUpdate({ _id: req.user._id }, { rf_token: "" });
            return res.json({ msg: "logged out!" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rf_token = req.cookies.refresh_token;
            if (!rf_token)
                return res.status(400).json({ msg: "Please login now!" });
            const decoded = jsonwebtoken_1.default.verify(rf_token, `${process.env.ACTIVE_REFRESH_SECRET}`);
            if (!decoded.id)
                return res.status(400).json({ msg: "Please login now!" });
            const user = yield userModule_1.default.findById(decoded.id).select("-password +rf_token");
            if (!user)
                return res.status(400).json({ msg: "This account does not exist." });
            if (rf_token !== user.rf_token) {
                return res.status(400).json({ msg: "Please login now!" });
            }
            const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
            const refresh_token = (0, generateToken_1.generateRefreshToken)({ id: user._id }, res);
            yield userModule_1.default.findOneAndUpdate({ _id: user._id }, { rf_token: refresh_token });
            res.json({ access_token, user });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    googleLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id_token } = req.body;
            const verify = yield client.verifyIdToken({
                idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`
            });
            const { email, email_verified, name, picture } = verify.getPayload();
            if (!email_verified) {
                return res.status(500).json({ msg: "Email verification failed." });
            }
            const user = yield userModule_1.default.findOne({ account: email });
            const password = email + "Your google secret password";
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            if (user) {
                yield loginUser(user, password, res);
            }
            else {
                const newUserRegister = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture,
                    type: "google"
                };
                yield registerUser(newUserRegister, res);
            }
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    })
};
const loginUser = (user, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(500).json({ msg: "Password is incorrect." });
    const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
    const refresh_token = (0, generateToken_1.generateRefreshToken)({ id: user._id }, res);
    yield userModule_1.default.findOneAndUpdate({ _id: user._id }, { rf_token: refresh_token });
    res.json({
        msg: 'Login Success!',
        access_token,
        user: Object.assign(Object.assign({}, user._doc), { password: '' })
    });
});
const registerUser = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new userModule_1.default(user);
    yield newUser.save();
    const access_token = (0, generateToken_1.generateAccessToken)({ id: newUser._id });
    const refresh_token = (0, generateToken_1.generateRefreshToken)({ id: newUser._id }, res);
    newUser.rf_token = refresh_token;
    yield newUser.save();
    res.json({
        msg: 'Login Success!',
        access_token,
        user: Object.assign(Object.assign({}, newUser._doc), { password: '' })
    });
});
exports.default = authCtrl;
