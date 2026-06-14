/**
 * Models Index - Tập hợp và thiết lập quan hệ giữa các models
 * Central point for importing all models and defining associations
 */
const { sequelize } = require('../config/database');
const User = require('./User');
const SkinAnalysis = require('./SkinAnalysis');
const Formulation = require('./Formulation');
const Product = require('./Product');
const Ingredient = require('./Ingredient');

// ===== Associations - Quan hệ giữa các bảng =====

// User has many SkinAnalyses - Người dùng có nhiều phân tích da
User.hasMany(SkinAnalysis, {
  foreignKey: 'userId',
  as: 'skinAnalyses',
});
SkinAnalysis.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// SkinAnalysis has one Formulation - Phân tích da có 1 công thức
SkinAnalysis.hasOne(Formulation, {
  foreignKey: 'analysisId',
  as: 'formulation',
});
Formulation.belongsTo(SkinAnalysis, {
  foreignKey: 'analysisId',
  as: 'analysis',
});

module.exports = {
  sequelize,
  User,
  SkinAnalysis,
  Formulation,
  Product,
  Ingredient,
};
