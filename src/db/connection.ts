import mongoose from "mongoose";
import { DB } from "../constants";

const connect = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.DATABASE_URL}/${DB}`)
        console.log("connection successfull with database");
        console.log(`the host is ${connection.connection.host}`);
    } catch (error) {
        console.log("something is wrong while connecting with database", error)
    }
}

export default connect;