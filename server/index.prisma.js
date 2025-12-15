require('dotenv').config();
const express = require('express');
const cors = require('cors');
let PrismaClientPackage;
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// test connection
(async () => {
  try {
    await prisma.$connect();
    console.log('✓ Connected to database via Prisma');
  } catch (err) {
    console.error('Prisma connection error:', err.message || err);
  }
})();

app.get('/', (req, res) => {
  res.json({ message: 'CMS API Server (Prisma)', status: 'running', environment: process.env.NODE_ENV });
});

// GET /api/certifications
app.get('/api/certifications', async (req, res) => {
  try {
    const rows = await prisma.certification.findMany();

    // Map certification_id -> id for frontend compatibility (if present)
    const mapped = rows.map((r) => ({ ...r, id: r.certification_id ?? r.id }));

    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error('Error fetching certifications (Prisma):', error);
    res.status(500).json({ success: false, error: 'Failed to fetch certifications', message: String(error) });
  }
});

//shutting down server
process.on('SIGINT', async () => {
  console.log('\nShutting down Prisma server...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`✓ Express (Prisma) server running on http://localhost:${port}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  if (!process.env.DATABASE_URL) {
    console.log('Note: DATABASE_URL not set.');
  } else {
    console.log('Using DATABASE_URL from environment');
  }
});
