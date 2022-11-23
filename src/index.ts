import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import {Server, Socket} from "socket.io"
import {createServer} from "http"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import routes from './routes/index'

import './config/dataBase'


const app = express()



app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: "*"
}))

const http = createServer(app)
export const io = new Server(http)
import {SocketServer} from "./config/socket";


io.on("connection",(socket: Socket) => {
    SocketServer(socket)
})



app.use('/api', routes)



// const PORT = process.env.PORT || 5000
const PORT = 5000
http.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})