/**
 * Formulation Model - Mô hình Công thức pha chế
 * Stores generated skincare kit formulations for T-zone and U-zone
 * Each formulation is linked to a skin analysis result
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Formulation = sequelize.define('Formulation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  analysisId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'analysis_id',
    references: {
      model: 'skin_analyses',
      key: 'id',
    },
  },

  // ===== T-Zone formula - Công thức vùng T =====
  tzoneBaseType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'tzone_base_type',
    comment: 'Base type for T-zone: gel or serum - Dạng nền vùng T',
    validate: {
      isIn: [['gel', 'serum']],
    },
  },
  tzoneIngredients: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    field: 'tzone_ingredients',
    comment: 'Array of {name, optimalPercent, minPercent, maxPercent, function} - Thành phần vùng T',
  },

  // ===== U-Zone formula - Công thức vùng U =====
  uzoneBaseType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'uzone_base_type',
    comment: 'Base type for U-zone: cream or emulsion - Dạng nền vùng U',
    validate: {
      isIn: [['cream', 'emulsion']],
    },
  },
  uzoneIngredients: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    field: 'uzone_ingredients',
    comment: 'Array of {name, optimalPercent, minPercent, maxPercent, function} - Thành phần vùng U',
  },

  // ===== Formula calculations - Tính toán công thức =====
  vBase: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'v_base',
    comment: 'Base volume for concentration calculation - Thể tích nền',
  },
  formulaNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'formula_notes',
    comment: 'Notes about the formulation - Ghi chú công thức',
  },

  // ===== Compliance & confidence - Tuân thủ & độ tin cậy =====
  legalCompliance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'legal_compliance',
    comment: 'Whether formulation passes legal concentration limits - Đạt giới hạn pháp lý',
  },
  modelVersion: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'model_version',
    comment: 'Version of the AI model used - Phiên bản mô hình AI',
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Model confidence score (0-1) - Điểm tin cậy',
    validate: {
      min: 0,
      max: 1,
    },
  },
}, {
  tableName: 'formulations',
  timestamps: true,
  updatedAt: false,
});

module.exports = Formulation;
