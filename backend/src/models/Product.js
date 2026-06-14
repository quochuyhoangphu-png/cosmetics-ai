/**
 * Product Model - Mô hình Sản phẩm thương mại
 * Stores commercial skincare products for recommendation
 * Products are matched to skin analyses for personalized suggestions
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Product name - Tên sản phẩm',
  },
  brand: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Brand name - Thương hiệu',
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Product category - Loại sản phẩm',
    validate: {
      isIn: [['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen']],
    },
  },
  skinTypes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
    field: 'skin_types',
    comment: 'Suitable skin types - Loại da phù hợp',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Product description - Mô tả sản phẩm',
  },
  keyIngredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
    field: 'key_ingredients',
    comment: 'Key active ingredients - Thành phần chính',
  },
  priceRange: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'price_range',
    comment: 'Price range in VND - Khoảng giá (VNĐ)',
  },
  imageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'image_url',
    comment: 'Product image URL - Ảnh sản phẩm',
  },
  suitableForAcne: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'suitable_for_acne',
    comment: 'Suitable for acne-prone skin - Phù hợp da mụn',
  },
  suitableForOily: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'suitable_for_oily',
    comment: 'Suitable for oily skin - Phù hợp da dầu',
  },
  routineStep: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'routine_step',
    comment: 'Order in skincare routine (1=cleanser, 2=toner, etc.) - Thứ tự trong routine',
  },
  routineInstructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'routine_instructions',
    comment: 'How to use in routine - Hướng dẫn sử dụng',
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
