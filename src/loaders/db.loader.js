import { createConnection } from "mongoose"
import { environment } from "./environment.loader.js"

/**
 * Creating a connection below. For now going with a apporach of username and password
 * Later will move to certificate based authentication
 * TODO: Add certificate based authentication
 *  */
const db = createConnection(environment.MONGO_URI, {
    autoIndex: false
})

db.on('connected', () => {
    console.log("db connected");
});

db.on('error', (error) => {
    console.error("Error connecting to MongoDB:", error);
});

export { db }