import {Request, Response} from "express"

import Users from "../moduls/userModule"

import {IReqAuth} from "../config/interface";
import bcrypt from "bcrypt";


const userCtrl = {
    updateUser: async (req: IReqAuth, res: Response) => {
        if (!req.user) return res.status(400).json({msg: "Invalid Authorization"})
        try {
            const {avatar, name} = req.body
            const user = await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, name
            })
            res.json({msg: "Update Success!", user})
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },

    updatePassword: async (req: IReqAuth, res: Response) => {
        if (!req.user)
            return res.status(400).json({msg: "Invalid Authorization"})

        if (req.user.type !== "register")
            return res.status(400).json({
                msg: `* Quick login account with ${req.user.type} can't use this function! *`
            })

        try {
            const {password} = req.body
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({_id: req.user._id}, {
                password: passwordHash
            })

            res.json({msg: "Reset password success!"})
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUsers: async (req: Request, res: Response) => {
        try {
            const user = await Users.findById(req.params.id).select("-password")
            res.json(user)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    }
}
export default userCtrl