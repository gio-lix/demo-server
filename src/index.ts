import dotenv from 'dotenv'
dotenv.config()

import express, {Request, Response} from 'express'
import {Server, Socket} from "socket.io"
import {createServer} from "http"
import cors from 'cors'
import cookieParser from 'cookie-parser'

import './config/dataBase'


const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

const http = createServer(app)
export const io = new Server(http)
import {SocketServer} from "./config/socket";


io.on("connection",(socket: Socket) => {
    SocketServer(socket)
})





app.get('/', (req: Request, res: Response) => {
    res.json({msg: "hello"})
});



const PORT = process.env.PORT || 5555
http.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})