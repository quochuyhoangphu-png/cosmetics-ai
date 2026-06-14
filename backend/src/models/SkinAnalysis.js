/**
 * SkinAnalysis Model - Mô hình Phân tích Da
 * Stores parsed skin metrics from PDF reports and validation status
 * T-Zone: vùng chữ T (trán, mũi, cằm) - thường dầu hơn
 * U-Zone: vùng chữ U (má, thái dương) - thường khô hơn
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SkinAnalysis = sequelize.define('SkinAnalysis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow null for anonymous/demo analyses
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  pdfFilename: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'pdf_filename',
  },

  // ===== T-Zone metrics - Chỉ số vùng T =====
  tzoneSebum: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'tzone_sebum',
    comment: 'Sebum level in T-zone (0-100) - Mức bã nhờn vùng T',
  },
  tzonePoreSize: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'tzone_pore_size',
    comment: 'Pore size in T-zone (0-100) - Kích thước lỗ chân lông vùng T',
  },
  tzonePoreDepth: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'tzone_pore_depth',
    comment: 'Pore depth in T-zone (0-100) - Độ sâu lỗ chân lông vùng T',
  },

  // ===== U-Zone metrics - Chỉ số vùng U =====
  uzoneMoisture: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'uzone_moisture',
    comment: 'Moisture level in U-zone (0-100) - Độ ẩm vùng U',
  },
  uzonePigmentation: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'uzone_pigmentation',
    comment: 'Pigmentation level in U-zone (0-100) - Sắc tố vùng U',
  },

  // ===== Overall metrics - Chỉ số tổng thể =====
  overallSensitivity: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'overall_sensitivity',
    comment: 'Skin sensitivity (0-100) - Độ nhạy cảm da',
  },
  acneSeverity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'acne_severity',
    comment: 'Acne severity score (0-5) - Mức độ mụn',
    validate: {
      min: 0,
      max: 5,
    },
  },

  // ===== Classification - Phân loại =====
  skinType: {
    type: DataTypes.ENUM('oily', 'dry', 'combination', 'normal'),
    allowNull: true,
    field: 'skin_type',
    comment: 'Classified skin type - Loại da',
  },
  ageGroup: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'age_group',
    comment: 'Age group: under_25, 25_35, over_35 - Nhóm tuổi',
    validate: {
      isIn: [['under_25', '25_35', 'over_35']],
    },
  },

  // ===== Validation - Xác nhận dữ liệu =====
  dataValidated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'data_validated',
    comment: 'Whether the data has been validated - Dữ liệu đã xác thực chưa',
  },
  validationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'validation_notes',
    comment: 'Notes from validation process - Ghi chú xác thực',
  },

  // ===== Raw data - Dữ liệu thô =====
  rawPdfText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'raw_pdf_text',
    comment: 'Raw extracted text from PDF - Nội dung thô từ PDF',
  },
}, {
  tableName: 'skin_analyses',
  timestamps: true,
  updatedAt: false,
});

module.exports = SkinAnalysis;
