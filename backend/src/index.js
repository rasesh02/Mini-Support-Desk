import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({path:'./.env'})
await connectDB().then(
    ()=>{
        app.listen(process.env.PORT || 6000,()=>{
            console.log(`server running at port ${process.env.PORT}`)
        })
    }
).catch(err=>{console.log(`error while listening : ${err}`)})
