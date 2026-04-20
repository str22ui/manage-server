import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pgPkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';

const { Pool } = pgPkg;
const { PrismaClient } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// List all
app.get('/api/infrastructure', async (req, res) => {
  try {
    const data = await prisma.infrastructure.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('GET /api/infrastructure Error:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Create
app.post('/api/infrastructure', async (req, res) => {
  const { name, type, url, status } = req.body;
  try {
    const result = await prisma.infrastructure.create({
      data: { name, type, url, status }
    });
    res.json(result);
  } catch (error) {
    console.error('POST /api/infrastructure Error:', error);
    res.status(500).json({ error: 'Failed to create' });
  }
});

// Update
app.put('/api/infrastructure/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, url, status } = req.body;
  try {
    const result = await prisma.infrastructure.update({
      where: { id: Number(id) },
      data: { name, type, url, status }
    });
    res.json(result);
  } catch (error) {
    console.error(`PUT /api/infrastructure/${id} Error:`, error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// Delete
app.delete('/api/infrastructure/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.infrastructure.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/infrastructure/${id} Error:`, error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database successfully.');
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

startServer();
