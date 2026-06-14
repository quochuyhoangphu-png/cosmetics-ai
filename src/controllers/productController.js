/**
 * Product Controller - Controller sản phẩm thương mại
 * Handles product listing and personalized recommendations
 * based on skin analysis results
 */
const { Product, SkinAnalysis } = require('../models');
const { Op } = require('sequelize');

/**
 * Get personalized product recommendations for a skin analysis
 * Lấy gợi ý sản phẩm cá nhân hóa cho một phân tích da
 *
 * GET /api/products/recommendations/:analysisId
 */
async function getRecommendations(req, res, next) {
  try {
    const { analysisId } = req.params;

    // Get the analysis to determine skin profile
    const analysis = await SkinAnalysis.findByPk(analysisId);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Analysis #${analysisId} not found. Không tìm thấy phân tích #${analysisId}.`,
        },
      });
    }

    const allProducts = await Product.findAll({
      order: [['routineStep', 'ASC']],
    });

    // Score and rank products
    // Xếp hạng sản phẩm theo độ phù hợp
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      const reasons = [];

      // Skin type match
      if (product.skinTypes && product.skinTypes.includes(analysis.skinType)) {
        score += 3;
        reasons.push(`Phù hợp tuyệt đối với da ${translateSkinType(analysis.skinType)}`);
      }

      // Acne suitability
      if (product.suitableForAcne && analysis.acneSeverity >= 2) {
        score += 2;
        reasons.push('Tập trung giải quyết tình trạng mụn');
      }

      // Oily skin suitability
      if (product.suitableForOily && (analysis.skinType === 'oily' || analysis.tzoneSebum > 60)) {
        score += 2;
        reasons.push('Khả năng kiềm dầu tốt cho T-Zone');
      }

      // Key ingredient benefits
      if (product.keyIngredients && product.keyIngredients.length > 0) {
        reasons.push(`Thành phần nổi bật: ${product.keyIngredients.join(', ')}`);
      }

      if (reasons.length === 0) {
        reasons.push('Sản phẩm chăm sóc da cơ bản an toàn');
      }

      return {
        ...product.toJSON(),
        matchScore: score,
        matchReasons: reasons
      };
    });

    // Sort by score descending
    scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

    // Group by category
    const groupedRecommendations = {
      toner: scoredProducts.filter(p => p.category === 'toner'),
      serum: scoredProducts.filter(p => p.category === 'serum'),
      moisturizer: scoredProducts.filter(p => p.category === 'moisturizer')
    };



    return res.status(200).json({
      success: true,
      data: {
        analysisId: parseInt(analysisId, 10),
        skinProfile: {
          skinType: analysis.skinType,
          acneSeverity: analysis.acneSeverity,
          tzoneSebum: analysis.tzoneSebum,
        },
        recommendations: groupedRecommendations,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all products
 * Lấy danh sách tất cả sản phẩm
 *
 * GET /api/products
 */
async function getAllProducts(req, res, next) {
  try {
    const products = await Product.findAll({
      order: [['routineStep', 'ASC'], ['name', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      data: {
        products,
        total: products.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Generate human-readable match reasons for a product recommendation
 * Tạo lý do gợi ý sản phẩm dạng dễ đọc
 */
function generateMatchReasons(product, analysis) {
  const reasons = [];

  // Skin type match - Phù hợp loại da
  if (product.skinTypes && product.skinTypes.includes(analysis.skinType)) {
    reasons.push(`Phù hợp da ${translateSkinType(analysis.skinType)} - Suitable for ${analysis.skinType} skin`);
  }

  // Acne suitability - Phù hợp da mụn
  if (product.suitableForAcne && analysis.acneSeverity >= 2) {
    reasons.push('Phù hợp cho da mụn - Suitable for acne-prone skin');
  }

  // Oily skin suitability - Phù hợp da dầu
  if (product.suitableForOily && (analysis.skinType === 'oily' || analysis.tzoneSebum > 60)) {
    reasons.push('Phù hợp cho da dầu - Suitable for oily skin');
  }

  // Key ingredient benefits
  if (product.keyIngredients && product.keyIngredients.length > 0) {
    reasons.push(`Thành phần chính: ${product.keyIngredients.join(', ')}`);
  }

  if (reasons.length === 0) {
    reasons.push('Sản phẩm chăm sóc da cơ bản - Basic skincare product');
  }

  return reasons;
}

function translateSkinType(type) {
  const map = { oily: 'dầu', dry: 'khô', combination: 'hỗn hợp', normal: 'thường' };
  return map[type] || type;
}

module.exports = {
  getRecommendations,
  getAllProducts,
};
