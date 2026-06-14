const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { testConnection, sequelize } = require('./src/config/database');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const autoSeed = require('./src/seeders/autoSeed');

const uploadRouter = require('./src/routes/upload');
const analysisRouter = require('./src/routes/analysis');
const productsRouter = require('./src/routes/products');
const formulationRouter = require('./src/routes/formulation');

const app = express();
const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'DermAI API online', version: '1.0.0', status: 'online' });
});

app.use('/api/upload', uploadRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/products', productsRouter);
app.use('/api/formulation', formulationRouter);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  const isDbConnected = await testConnection();
  if (!isDbConnected) {
    console.error('⚠️ DB Connection failed, starting server anyway.');
  } else {
    try {
      await sequelize.sync();
      console.log('✅ Sequelize schemas synced with PostgreSQL.');
    } catch (dbSyncError) {
      console.error('❌ Failed to sync database models:', dbSyncError.message);
    }

    try {
      if (typeof autoSeed === 'function') {
        await autoSeed();
      } else {
        console.warn('⚠️ autoSeed not a function, skipping.');
      }
    } catch (seedError) {
      console.error('❌ Auto-seed error:', seedError.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
