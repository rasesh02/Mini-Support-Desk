import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import commentRouter from './routes/comment.routes.js'
import tickerRouter from './routes/tickets.routes.js'

app.use(commentRouter);
app.use(tickerRouter);

export {app};