import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/dbConfig.js';
import router from './routes/authRoutes.js';
import cors from "cors"
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB()

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin:['https://spintowin-sigma.vercel.app'],
    credentials:true
}))

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
