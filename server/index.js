import express from "express";
import morgan from 'morgan';
import dotenv from "dotenv";
import cors from "cors";
import { dbConfig } from './utils/dbConfig.js';

import gymRoutes from "./routes/gymRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRouter from "./routes/useRoutes.js";
import discussionRouter from "./routes/discussionRoutes.js";
import challengeRouter from "./routes/challengeRoutes.js";

const port = process.env.PORT || 5001;
const app = express();
app.use(express.json());
dotenv.config();

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.get('/', async (req,res)=>{
    res.status(200).json('Server is up and running');
})

app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/users", userRouter);
app.use("/api/gyms", gymRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/discussion', discussionRouter)
app.use("/api/challenges", challengeRouter);

dbConfig().then(()=>{
    app.listen(port,()=>{
        console.log(`🚀 Server is up and running on port ${port}`);
    })
}).catch((err)=>{
    console.log(err);
})