import authRouter from "./authRoute"
import userRouter from "./userRoute"
import categoryRouter from "./categoryRoute"
import blogRouter from "./blogRoute"
import commentRouter from "./commentRouter";


const routes = [
    authRouter,
    userRouter,
    categoryRouter,
    blogRouter,
    commentRouter
]

export default routes