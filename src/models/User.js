/**
 * User Model - Mô hình Người dùng
 * Stores user profile information
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 10,
      max: 120,
    },
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['male', 'female', 'other', 'prefer_not_to_say']],
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
  updatedAt: false, // Only createdAt as specified
});

module.exports = User;
