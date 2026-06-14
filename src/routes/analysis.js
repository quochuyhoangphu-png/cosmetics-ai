/**
 * Analysis Routes - Định tuyến phân tích da
 * Handles fetching list and detailed info of skin analyses
 */
const express = require('express');
const router = express.Router();
const { getAnalysis, getAllAnalyses } = require('../controllers/analysisController');

// GET /api/analysis - Get all analyses (with pagination)
router.get('/', getAllAnalyses);

// GET /api/analysis/:id - Get details of a single analysis
router.get('/:id', getAnalysis);

module.exports = router;
