/**
 * Database Configuration - Cấu hình kết nối PostgreSQL
 * Uses Sequelize ORM with environment variables
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Bắt buộc đối với chứng chỉ tự ký của Render
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'cosmetics_ai',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        underscored: true,
        timestamps: true,
      },
    }
  );
}

/**
 * Test database connection - Kiểm tra kết nối DB
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    return false;
  }
}

module.exports = { sequelize, testConnection };
