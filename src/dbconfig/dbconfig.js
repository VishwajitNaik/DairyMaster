import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection;
        connection.on('connected', () =>{
            console.log("Mongoose connected success...");
        })

        connection.on("error", (err) =>{
            console.log("mongodb connection error. plz make sure DB is running. " + err);
        })
    } catch (error) {
        console.log("something wrong going with DB conn...!");
        console.log(error);
    }
}
