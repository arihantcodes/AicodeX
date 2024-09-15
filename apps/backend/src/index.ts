import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@repo/db';
import userrouter from './routes/user.route';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const corsOptions = {
  origin: 'http://localhost:3000', // Allow specific domain
  methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
  credentials: true, // Allow sending cookies
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/v1/user",userrouter)

app.on("error", (error) => {
  console.log("Error on the server", error);
});



const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
