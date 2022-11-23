import {Request, Response} from "express"
import Users from "../moduls/userModule"
import bcrypt from "bcrypt"
import {generateAccessToken, generateActiveToken, generateRefreshToken} from "../config/generateToken"
import {IDecodedToken, IGooglePayload, IReqAuth, IUser, IUserParams} from "../config/interface";
import jwt from "jsonwebtoken";
import {OAuth2Client} from "google-auth-library"


const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`)
const CLIENT_URL = `${process.env.BASE_URL}`

const authCtrl = {
    register: async (req: Request, res: Response) => {
        try {

            const {name, account, password} = req.body

            const user = await Users.findOne({account})
            if (user) return res.status(400).json({msg: "Email or Phone number already exists."})

            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = new Users({
                name, account, password: passwordHash
            })

            const active_token = generateActiveToken({newUser})

            await newUser.save()

            res.json({
                status: "OK",
                msg: "Register successfully",
                data: newUser,
                active_token
            })
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const {account, password} = req.body

            const user = await Users.findOne({account})
            if (!user) return res.status(400).json({msg: "This account does not exits"})

            await loginUser(user, password, res)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req: IReqAuth, res: Response) => {
        if  (!req.user) return res.status(400).json({msg: "Invalid Authentication."})
        try {
            res.clearCookie("refresh_token")
            await Users.findOneAndUpdate(
                {_id: req.user._id},
                {rf_token: ""})

            return res.json({msg: "logged out!"})
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        try {

            const rf_token = req.cookies.refresh_token
            if (!rf_token) return res.status(400).json({msg: "Please login now!"})

            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.ACTIVE_REFRESH_SECRET}`)

            if (!decoded.id) return res.status(400).json({msg: "Please login now!"})

            const user = await Users.findById(decoded.id).select("-password +rf_token")

            if (!user) return res.status(400).json({msg: "This account does not exist."})


            if (rf_token !== user.rf_token) {
                return res.status(400).json({msg: "Please login now!"})
            }

            const access_token = generateAccessToken({id: user._id})
            const refresh_token = generateRefreshToken({id: user._id}, res)

            await Users.findOneAndUpdate(
                {_id: user._id},
                {rf_token: refresh_token})


            res.json({access_token, user})
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },

    googleLogin: async (req: Request, res: Response) => {
        try {
            const {id_token} = req.body
            const verify = await client.verifyIdToken({
                idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`
            })
            const {email, email_verified, name, picture} = <IGooglePayload>verify.getPayload()
            if (!email_verified) {
                return res.status(500).json({msg: "Email verification failed."})
            }

            const user = await Users.findOne({account: email})

            const password = email + "Your google secret password"
            const passwordHash = await bcrypt.hash(password, 12)
            if (user) {
                await loginUser(user, password, res)
            } else {
                const newUserRegister = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture,
                    type: "google"
                }
                await registerUser(newUserRegister, res)
            }
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    }
}





const loginUser = async (user: IUser, password: string, res: Response) => {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(500).json({msg: "Password is incorrect."})


    const access_token = generateAccessToken({id: user._id})
    const refresh_token = generateRefreshToken({id: user._id}, res)

    await Users.findOneAndUpdate(
        {_id: user._id},
        {rf_token: refresh_token})

    res.json({
        msg: 'Login Success!',
        access_token,
        user: {...user._doc, password: ''}
    })

}
const registerUser = async (user: IUserParams, res: Response) => {
    const newUser = new Users(user)
    await newUser.save()

    const access_token = generateAccessToken({id: newUser._id})
    const refresh_token = generateRefreshToken({id: newUser._id}, res)



    newUser.rf_token = refresh_token
    await newUser.save()

    res.json({
        msg: 'Login Success!',
        access_token,
        user: {...newUser._doc, password: ''}
    })

}





export default authCtrl
