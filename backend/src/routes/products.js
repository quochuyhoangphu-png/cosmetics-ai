/**
 * Product Routes - Định tuyến sản phẩm
 * Handles listing commercial products and getting personalized recommendations
 */
const express = require('express');
const router = express.Router();
const { getAllProducts, getRecommendations } = require('../controllers/productController');

// GET /api/products - Get all seeded products
router.get('/', getAllProducts);

// GET /api/products/recommendations/:analysisId - Get personalized product recommendations
router.get('/recommendations/:analysisId', getRecommendations);

module.exports = router;
