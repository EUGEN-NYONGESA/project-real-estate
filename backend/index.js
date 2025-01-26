import express from 'express';
import 'dotenv/config'
import { connectDB } from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from "./routes/auth.routes.js";

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json()); //allows us to parse incoming requests: req.body
app.use(cookieParser()); //allows us to pass incoming cookies
app.use(cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    credentials: true, // Allow cookies to be sent
  }));

app.get('/', (req,res) => res.send("API is working"));

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    connectDB();
    console.log(`The server is running is PORT: ${port}`);
});