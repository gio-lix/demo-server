"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
require("./config/dataBase");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "https://aaaapppp12-app.onrender.com"
}));
const http = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(http);
const socket_1 = require("./config/socket");
exports.io.on("connection", (socket) => {
    (0, socket_1.SocketServer)(socket);
});
app.use('/api', index_1.default);
// const PORT = process.env.PORT || 5000
const PORT = 5000;
http.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
