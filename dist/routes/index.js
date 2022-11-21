"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogRoute_1 = __importDefault(require("./blogRoute"));
const authRoute_1 = __importDefault(require("./authRoute"));
const routes = [
    blogRoute_1.default,
    authRoute_1.default
];
exports.default = routes;
