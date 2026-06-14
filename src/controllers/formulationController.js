/**
 * Formulation Controller - Controller công thức pha chế
 * Handles formulation retrieval and mock RapidMiner endpoint
 */
const { Formulation, SkinAnalysis } = require('../models');
const { mockRapidMinerScore } = require('../services/rapidminerMock');

/**
 * Get formulation for a given analysis
 * Lấy công thức pha chế cho một phân tích
 *
 * GET /api/formulation/:analysisId
 */
async function getFormulation(req, res, next) {
  try {
    const { analysisId } = req.params;

    // Find formulation with its parent analysis
    const formulation = await Formulation.findOne({
      where: { analysisId },
      include: [
        {
          model: SkinAnalysis,
          as: 'analysis',
          attributes: [
            'id', 'skinType', 'ageGroup', 'acneSeverity',
            'tzoneSebum', 'uzoneMoisture', 'overallSensitivity',
          ],
        },
      ],
    });

    if (!formulation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `No formulation found for analysis #${analysisId}. ` +
                   `Không tìm thấy công thức cho phân tích #${analysisId}.`,
        },
      });
    }

    // Format the response for frontend consumption
    const response = {
      id: formulation.id,
      analysisId: formulation.analysisId,
      skinProfile: formulation.analysis ? {
        skinType: formulation.analysis.skinType,
        ageGroup: formulation.analysis.ageGroup,
        acneSeverity: formulation.analysis.acneSeverity,
        tzoneSebum: formulation.analysis.tzoneSebum,
        uzoneMoisture: formulation.analysis.uzoneMoisture,
      } : null,
      tzone: {
        baseType: formulation.tzoneBaseType,
        ingredients: formulation.tzoneIngredients || [],
      },
      uzone: {
        baseType: formulation.uzoneBaseType,
        ingredients: formulation.uzoneIngredients || [],
      },
      vBase: formulation.vBase,
      formulaNotes: formulation.formulaNotes,
      legalCompliance: formulation.legalCompliance,
      modelVersion: formulation.modelVersion,
      confidence: formulation.confidence,
      createdAt: formulation.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: {
        formulation: response,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Expose mock RapidMiner scoring endpoint
 * Lộ endpoint chấm điểm RapidMiner giả lập
 *
 * POST /api/mock/rapidminer/score
 * Body: { skinMetrics: { tzoneSebum, uzoneMoisture, acneSeverity, ... } }
 */
async function getMockRapidMinerScore(req, res, next) {
  try {
    const { skinMetrics } = req.body;

    if (!skinMetrics || typeof skinMetrics !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Request body must include "skinMetrics" object. ' +
                   'Body phải có trường "skinMetrics".',
        },
      });
    }

    const prediction = mockRapidMinerScore(skinMetrics);

    return res.status(200).json({
      success: true,
      data: {
        prediction,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFormulation,
  getMockRapidMinerScore,
};
