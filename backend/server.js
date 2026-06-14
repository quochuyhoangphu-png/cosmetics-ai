/**
 * Server Entry Point - Cổng vào chính của backend
 * Sets up Express server, CORS, middleware, static uploads, routes, and DB
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { testConnection, sequelize } = require('./src/config/database');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Import routers
const uploadRouter = require('./src/routes/upload');
const analysisRouter = require('./src/routes/analysis');
const productsRouter = require('./src/routes/products');
const formulationRouter = require('./src/routes/formulation');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads folder exists - Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads folder:', uploadsDir);
}

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for easy deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload files - Phục vụ file upload tĩnh
app.use('/uploads', express.static(uploadsDir));

// API Status Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to DermAI API (Personalized Skincare Platform)',
    version: '1.0.0',
    status: 'online'
  });
});

// Mount routes
app.use('/api/upload', uploadRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/products', productsRouter);
app.use('/api/formulation', formulationRouter);

// Handle 404 Route Not Found
app.use(notFoundHandler);

// Handle global errors
app.use(errorHandler);

// Start Server and connect to Database
async function startServer() {
  const isDbConnected = await testConnection();
  if (!isDbConnected) {
    console.error('⚠️ DB Connection failed, starting server anyway but routes relying on database might fail.');
  } else {
    try {
      // Sync DB models (creates tables if they do not exist, without dropping existing data)
      await sequelize.sync();
      console.log('✅ Sequelize schemas synced with PostgreSQL.');
    } catch (dbSyncError) {
      console.error('❌ Failed to sync database models:', dbSyncError.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/`);
  });
}

startServer();
