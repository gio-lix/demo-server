import {Response, NextFunction} from "express"
import Users from "../moduls/userModule"
import jwt from "jsonwebtoken";
import {IDecodedToken, IReqAuth} from "../config/interface";

const auth = async (req: IReqAuth, res:Response, next:NextFunction) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(400).json({msg: "Invalid Authorization"})
        }
        const accessToken = token.split(" ")[1]


        const decoded = <IDecodedToken>jwt.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`)
        if (!decoded) {
            return res.status(400).json({msg: "Invalid Authorization"})
        }

        const user = await Users.findOne({_id: decoded.id}).select("-password")
        if (!user) return res.status(400).json({msg: "Invalid Authorization"})
        req.user = user
        next()

    } catch (err: any) {
        return res.status(500).json({msg: err.message})
    }
}
export default auth