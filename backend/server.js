const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { autoSeedIfEmpty } = require('./seed');

// Load environment variables
dotenv.config();

// Connect to MongoDB and run Auto-Seed check
connectDB().then(async () => {
  await autoSeedIfEmpty();
});

const app = express();

// Explicit CORS configuration for Vite dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const Disease = require('./models/Disease');
  const count = await Disease.countDocuments();
  res.status(200).json({
    status: 'online',
    system: 'MediHelp Intelligence Engine',
    conditionsCount: count,
    timestamp: new Date()
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/diseases', require('./routes/diseases'));
app.use('/api/tools', require('./routes/tools'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  MediHelp Backend Server running on port ${PORT}`);
  console.log(`  Auto-Seeding Persistence Activated`);
  console.log(`===================================================`);
});
