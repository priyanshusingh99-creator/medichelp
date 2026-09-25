const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihelp';
  
  try {
    console.log(`Connecting to primary MongoDB: ${primaryUri}...`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`Could not connect to primary MongoDB (${err.message}). Initializing MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`MongoDB Connected to MongoMemoryServer at ${memoryUri}`);
    } catch (memErr) {
      console.error('Failed to initialize MongoDB connection:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
