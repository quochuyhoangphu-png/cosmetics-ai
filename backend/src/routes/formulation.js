/**
 * Formulation Routes - Định tuyến công thức pha chế
 * Handles getting kit formulation and mock RapidMiner endpoint
 */
const express = require('express');
const router = express.Router();
const { getFormulation, getMockRapidMinerScore } = require('../controllers/formulationController');

// GET /api/formulation/:analysisId - Get custom kit formulation
router.get('/:analysisId', getFormulation);

// POST /api/formulation/mock/rapidminer/score - Mock RapidMiner AI Hub endpoint
// Note: Placed in formulation routes as it acts as scoring engine
router.post('/mock/rapidminer/score', getMockRapidMinerScore);

module.exports = router;
