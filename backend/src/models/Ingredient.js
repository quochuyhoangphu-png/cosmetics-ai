/**
 * Ingredient Model - Mô hình Thành phần hoạt chất
 * Stores active ingredients, their concentration ranges, and legal limits
 * Used by the Formulation Agent to generate personalized formulas
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ingredient = sequelize.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Common name - Tên thông dụng',
  },
  inciName: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'inci_name',
    comment: 'INCI (International Nomenclature of Cosmetic Ingredients) name',
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Category: active, base, or preservative - Phân loại',
    validate: {
      isIn: [['active', 'base', 'preservative']],
    },
  },
  function: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'function',
    comment: 'Ingredient function/purpose - Công dụng',
  },
  minConcentration: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'min_concentration',
    comment: 'Minimum effective concentration (%) - Nồng độ tối thiểu',
  },
  maxConcentration: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'max_concentration',
    comment: 'Maximum recommended concentration (%) - Nồng độ tối đa',
  },
  suitableZones: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
    field: 'suitable_zones',
    comment: 'Applicable zones: tzone, uzone - Vùng da phù hợp',
  },
  contraindications: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
    comment: 'Ingredients that should not be combined - Chống chỉ định kết hợp',
  },
  legalMaxPercent: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'legal_max_percent',
    comment: 'Legal maximum concentration (%) per regulations - Giới hạn pháp lý',
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Benefits description - Mô tả lợi ích',
  },
}, {
  tableName: 'ingredients',
  timestamps: true,
});

module.exports = Ingredient;
