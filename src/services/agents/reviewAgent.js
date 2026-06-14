/**
 * Review Agent - Agent Kiểm duyệt công thức
 * Final agent in the pipeline: reviews formulation output
 * Checks legal compliance, ingredient interactions, and safety
 */

// Known ingredient interactions/contraindications - Tương tác đã biết
const CONTRAINDICATION_PAIRS = [
  {
    a: 'Salicylic Acid (BHA)',
    b: 'Azelaic Acid',
    severity: 'caution',
    note: 'Both are exfoliants - use with caution to avoid over-exfoliation. ' +
          'Cả hai đều tẩy da chết - cẩn thận tránh tẩy quá mức.',
  },
  {
    a: 'Salicylic Acid (BHA)',
    b: 'Retinol',
    severity: 'warning',
    note: 'Strong combination that can cause irritation. ' +
          'Kết hợp mạnh có thể gây kích ứng.',
  },
  {
    a: 'Niacinamide',
    b: 'Vitamin C (L-Ascorbic Acid)',
    severity: 'caution',
    note: 'May reduce efficacy if applied simultaneously at low pH. ' +
          'Có thể giảm hiệu quả khi dùng cùng lúc ở pH thấp.',
  },
  {
    a: 'Azelaic Acid',
    b: 'AHA',
    severity: 'warning',
    note: 'Multiple exfoliants can damage skin barrier. ' +
          'Nhiều chất tẩy da chết có thể hại hàng rào da.',
  },
];

// Legal concentration limits - Giới hạn nồng độ pháp lý
const LEGAL_LIMITS = {
  'Salicylic Acid (BHA)': { min: 0.5, max: 2.0, unit: '%' },
  'Niacinamide':           { min: 2.0, max: 10.0, unit: '%' },
  'Azelaic Acid':          { min: 5.0, max: 20.0, unit: '%' },
  'Tea Tree Oil':          { min: 0.5, max: 5.0, unit: '%' },
  'Zinc PCA':              { min: 0.1, max: 1.0, unit: '%' },
  'Hyaluronic Acid':       { min: 0.1, max: 2.0, unit: '%' },
  'Ceramide NP':           { min: 0.5, max: 3.0, unit: '%' },
  'Centella Asiatica':     { min: 0.5, max: 5.0, unit: '%' },
};

/**
 * Run the review agent on a formulation result
 * Chạy agent kiểm duyệt trên kết quả pha chế
 *
 * @param {Object} formulationData - Formulation result from FormulationAgent
 * @returns {Object} Review result with approval status and warnings
 */
async function run(formulationData) {
  const agentName = 'ReviewAgent';
  const startTime = Date.now();

  try {
    const warnings = [];
    const errors = [];
    let approved = true;

    // ===== Check 1: Legal compliance for each ingredient =====
    // Kiểm tra 1: Tuân thủ pháp lý cho mỗi thành phần
    const allIngredients = [
      ...(formulationData.tzone?.ingredients || []).map(i => ({ ...i, zone: 'T-Zone' })),
      ...(formulationData.uzone?.ingredients || []).map(i => ({ ...i, zone: 'U-Zone' })),
    ];

    for (const ing of allIngredients) {
      const limits = LEGAL_LIMITS[ing.name];
      if (limits) {
        if (ing.optimalPercent < limits.min) {
          warnings.push({
            type: 'below_effective',
            ingredient: ing.name,
            zone: ing.zone,
            value: ing.optimalPercent,
            limit: limits.min,
            message: `${ing.name} in ${ing.zone} at ${ing.optimalPercent}% is below minimum effective ${limits.min}%. ` +
                     `${ing.name} ở ${ing.zone}: ${ing.optimalPercent}% dưới mức hiệu quả ${limits.min}%.`,
          });
        }
        if (ing.optimalPercent > limits.max) {
          errors.push({
            type: 'exceeds_legal',
            ingredient: ing.name,
            zone: ing.zone,
            value: ing.optimalPercent,
            limit: limits.max,
            message: `${ing.name} in ${ing.zone} at ${ing.optimalPercent}% EXCEEDS legal max ${limits.max}%! ` +
                     `${ing.name} ở ${ing.zone}: ${ing.optimalPercent}% VƯỢT giới hạn ${limits.max}%!`,
          });
          approved = false;
        }
      }
    }

    // ===== Check 2: Ingredient interactions =====
    // Kiểm tra 2: Tương tác giữa các thành phần
    const ingredientNames = allIngredients.map(i => i.name);
    const interactions = checkInteractions(ingredientNames);
    warnings.push(...interactions);

    // ===== Check 3: Total active concentration per zone =====
    // Kiểm tra 3: Tổng nồng độ hoạt chất mỗi vùng
    const tzoneTotalConc = (formulationData.tzone?.ingredients || [])
      .reduce((sum, i) => sum + (i.optimalPercent || 0), 0);
    const uzoneTotalConc = (formulationData.uzone?.ingredients || [])
      .reduce((sum, i) => sum + (i.optimalPercent || 0), 0);

    if (tzoneTotalConc > 25) {
      warnings.push({
        type: 'high_total_concentration',
        zone: 'T-Zone',
        value: Math.round(tzoneTotalConc * 100) / 100,
        message: `Total T-Zone active concentration is ${Math.round(tzoneTotalConc * 100) / 100}%, ` +
                 `which is high. Consider reducing. ` +
                 `Tổng nồng độ hoạt chất vùng T cao, cân nhắc giảm.`,
      });
    }
    if (uzoneTotalConc > 20) {
      warnings.push({
        type: 'high_total_concentration',
        zone: 'U-Zone',
        value: Math.round(uzoneTotalConc * 100) / 100,
        message: `Total U-Zone active concentration is ${Math.round(uzoneTotalConc * 100) / 100}%, ` +
                 `which is high. Consider reducing. ` +
                 `Tổng nồng độ hoạt chất vùng U cao, cân nhắc giảm.`,
      });
    }

    // ===== Check 4: Base type compatibility =====
    // Kiểm tra 4: Tương thích dạng nền
    if (formulationData.tzone?.baseType === 'cream') {
      warnings.push({
        type: 'base_type_concern',
        zone: 'T-Zone',
        message: 'Cream base for T-Zone with oily skin may increase oiliness. Gel/serum recommended. ' +
                 'Dạng cream cho vùng T da dầu có thể tăng dầu. Nên dùng gel/serum.',
      });
    }

    const processingTime = Date.now() - startTime;

    return {
      agent: agentName,
      status: 'completed',
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
      data: {
        approved,
        errors,
        warnings,
        totalIngredients: allIngredients.length,
        tzoneTotalConcentration: Math.round(tzoneTotalConc * 100) / 100,
        uzoneTotalConcentration: Math.round(uzoneTotalConc * 100) / 100,
        reviewSummary: approved
          ? `✅ Formulation APPROVED with ${warnings.length} warnings. Công thức ĐẠT với ${warnings.length} cảnh báo.`
          : `❌ Formulation REJECTED: ${errors.length} errors found. Công thức BỊ TỪ CHỐI: ${errors.length} lỗi.`,
      },
      summary: approved
        ? `Approved with ${warnings.length} warnings`
        : `Rejected with ${errors.length} errors`,
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    return {
      agent: agentName,
      status: 'error',
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
      error: error.message,
      data: null,
    };
  }
}

/**
 * Check for known ingredient interactions
 * Kiểm tra tương tác đã biết giữa các thành phần
 */
function checkInteractions(ingredientNames) {
  const interactions = [];

  for (const pair of CONTRAINDICATION_PAIRS) {
    const hasA = ingredientNames.some(n => n.toLowerCase().includes(pair.a.toLowerCase()));
    const hasB = ingredientNames.some(n => n.toLowerCase().includes(pair.b.toLowerCase()));

    if (hasA && hasB) {
      interactions.push({
        type: `interaction_${pair.severity}`,
        ingredients: [pair.a, pair.b],
        severity: pair.severity,
        message: `Interaction: ${pair.a} + ${pair.b}: ${pair.note}`,
      });
    }
  }

  return interactions;
}

module.exports = { run };
