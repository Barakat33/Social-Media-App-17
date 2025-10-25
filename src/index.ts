import { log } from "console";
import express from "express";
import { config } from "dotenv";
import { bootstrap } from "./app.controller.js";
import { initSocket } from "./socket-io";
// تحميل ملف env من root
config();
const app = express();
const port = process.env.PORT || 3000;

// اطبع القيم عشان نتاكد انها متشافة
console.log("PORT:", process.env.PORT);
console.log("DB_URL:", process.env.DB_URL);

bootstrap(app, express);

const server= app.listen(port, () => {
    log(`Server is running on port ${port}`);
    
    });
    initSocket(server);
