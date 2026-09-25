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
}).catch(err => console.error('MongoDB connection error:', err));

const app = express();

// CORS configuration (Netlify frontend aur localhost dono allow karne ke liye)
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route (Vercel domain directly open karne par dikhega)
app.get('/', (req, res) => {
  res.send('MediHelp Backend Server is running successfully on Vercel!');
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const Disease = require('./models/Disease');
    const count = await Disease.countDocuments();
    res.status(200).json({
      status: 'online',
      system: 'MediHelp Intelligence Engine',
      conditionsCount: count,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`MediHelp Backend Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
module.exports = app;