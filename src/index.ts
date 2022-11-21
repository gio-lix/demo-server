import dotenv from 'dotenv'
dotenv.config()

import express, {Express, Request, Response} from 'express'


const app: Express = express();
const port = process.env.PORT || 5005;



app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});