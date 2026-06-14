/**
 * Analysis Controller - Controller phân tích da
 * Handles retrieval of skin analysis results
 */
const { SkinAnalysis, Formulation, User } = require('../models');

/**
 * Get a single analysis by ID with full details
 * Lấy phân tích theo ID kèm đầy đủ chi tiết
 *
 * GET /api/analysis/:id
 */
async function getAnalysis(req, res, next) {
  try {
    const { id } = req.params;

    const analysis = await SkinAnalysis.findByPk(id, {
      include: [
        {
          model: Formulation,
          as: 'formulation',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'age', 'gender'],
        },
      ],
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Analysis with ID ${id} not found. Không tìm thấy phân tích #${id}.`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        analysis: formatAnalysisResponse(analysis),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List all analyses with pagination
 * Liệt kê tất cả phân tích với phân trang
 *
 * GET /api/analysis?page=1&limit=10
 */
async function getAllAnalyses(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await SkinAnalysis.findAndCountAll({
      include: [
        {
          model: Formulation,
          as: 'formulation',
          attributes: ['id', 'tzoneBaseType', 'uzoneBaseType', 'legalCompliance', 'confidence'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: {
        analyses: rows.map(formatAnalysisResponse),
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Format analysis for API response
 * Định dạng phân tích cho response API
 */
function formatAnalysisResponse(analysis) {
  const plain = analysis.toJSON();
  return {
    id: plain.id,
    userId: plain.userId,
    user: plain.user || null,
    pdfFilename: plain.pdfFilename,
    skinMetrics: {
      tzone: {
        sebum: plain.tzoneSebum,
        poreSize: plain.tzonePoreSize,
        poreDepth: plain.tzonePoreDepth,
      },
      uzone: {
        moisture: plain.uzoneMoisture,
        pigmentation: plain.uzonePigmentation,
      },
      overall: {
        sensitivity: plain.overallSensitivity,
        acneSeverity: plain.acneSeverity,
      },
    },
    classification: {
      skinType: plain.skinType,
      ageGroup: plain.ageGroup,
    },
    validation: {
      dataValidated: plain.dataValidated,
      validationNotes: plain.validationNotes,
    },
    formulation: plain.formulation || null,
    createdAt: plain.createdAt,
  };
}

module.exports = {
  getAnalysis,
  getAllAnalyses,
};
