import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@repo/db';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users/create', async (req, res) => {
  const { email, password, name } = req.body;
  const newUser = await prisma.user.create({
    data: { email, password, name },
  });
  res.json(newUser);
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
