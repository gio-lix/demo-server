import dotenv from 'dotenv'
dotenv.config()

import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import {createServer} from "http"
import {Server, Socket} from "socket.io"
import routes from './routes/index'

import './config/dataBase'

const app: Express = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cookieParser())


const http = createServer(app)
export const io = new Server(http)
import {SocketServer} from "./config/socket";


io.on("connection",(socket: Socket) => {
    SocketServer(socket)
})


app.use('/api', routes)


const port = process.env.PORT || 5005;

http.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});