/**
 * Formulation Agent - Agent Pha chế công thức (THE CORE AGENT)
 * Takes treatment plan + skin metrics and generates complete kit formulations
 * for T-Zone and U-Zone using the formula calculator
 *
 * C_final = Σ(V_active_i × C_active_i) / (V_base + Σ V_active_i)
 */
const { optimizeFormulation, calculateFinalConcentration } = require('../formulaCalculator');

/**
 * Run the formulation agent
 * Chạy agent pha chế công thức
 *
 * @param {Object} treatmentPlan - Treatment plan from planning agent
 * @param {Object} skinMetrics - Validated skin metrics
 * @param {Object} mlPrediction - ML prediction from RapidMiner
 * @returns {Object} Complete kit formulation with agent metadata
 */
async function run(treatmentPlan, skinMetrics, mlPrediction) {
  const agentName = 'FormulationAgent';
  const startTime = Date.now();

  try {
    // ===== Step 1: Generate T-Zone formula - Tạo công thức vùng T =====
    const tzoneFormula = generateTZoneFormula(
      treatmentPlan,
      skinMetrics,
      mlPrediction
    );

    // ===== Step 2: Generate U-Zone formula - Tạo công thức vùng U =====
    const uzoneFormula = generateUZoneFormula(
      treatmentPlan,
      skinMetrics,
      mlPrediction
    );

    // ===== Step 3: Calculate final concentrations - Tính nồng độ cuối =====
    const vBase = 100; // 100mL base volume

    const tzoneCalc = calculateConcentrations(vBase, tzoneFormula.ingredients);
    const uzoneCalc = calculateConcentrations(vBase, uzoneFormula.ingredients);

    // ===== Step 4: Build formulation result =====
    const formulationResult = {
      vBase,
      tzone: {
        baseType: tzoneFormula.baseType,
        ingredients: tzoneCalc.ingredients,
        totalVolume: tzoneCalc.totalVolume,
      },
      uzone: {
        baseType: uzoneFormula.baseType,
        ingredients: uzoneCalc.ingredients,
        totalVolume: uzoneCalc.totalVolume,
      },
      formulaNotes: generateFormulaNotes(skinMetrics, tzoneFormula, uzoneFormula),
      legalCompliance: tzoneCalc.allCompliant && uzoneCalc.allCompliant,
      modelVersion: mlPrediction.modelVersion || '2.1.0',
      confidence: mlPrediction.confidence || 0.85,
    };

    const processingTime = Date.now() - startTime;

    return {
      agent: agentName,
      status: 'completed',
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
      data: formulationResult,
      summary: `Generated T-zone ${tzoneFormula.baseType} with ${tzoneFormula.ingredients.length} actives ` +
               `and U-zone ${uzoneFormula.baseType} with ${uzoneFormula.ingredients.length} actives`,
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
 * Generate T-Zone formula based on treatment plan and ML predictions
 * Tạo công thức vùng T dựa trên kế hoạch điều trị và dự đoán ML
 */
function generateTZoneFormula(treatmentPlan, skinMetrics, mlPrediction) {
  const baseType = treatmentPlan.tzoneBaseType || 'gel';
  const recommendations = mlPrediction.predictions.tzoneRecommendations || [];

  // Build ingredients from ML recommendations
  const ingredients = recommendations.map((rec) => ({
    name: rec.ingredient,
    targetPercent: rec.concentration,
    minPercent: rec.minConcentration,
    maxPercent: rec.maxConcentration,
    stockConcentration: 100, // Pure active ingredient
    function: rec.reason,
  }));

  // Ensure at least Niacinamide for T-zone if nothing was recommended
  if (ingredients.length === 0) {
    ingredients.push({
      name: 'Niacinamide',
      targetPercent: 5,
      minPercent: 2,
      maxPercent: 10,
      stockConcentration: 100,
      function: 'Kiềm dầu, giảm viêm - Oil control, anti-inflammatory',
    });
  }

  return { baseType, ingredients };
}

/**
 * Generate U-Zone formula based on treatment plan and ML predictions
 * Tạo công thức vùng U dựa trên kế hoạch điều trị và dự đoán ML
 */
function generateUZoneFormula(treatmentPlan, skinMetrics, mlPrediction) {
  const baseType = treatmentPlan.uzoneBaseType || 'cream';
  const recommendations = mlPrediction.predictions.uzoneRecommendations || [];

  // Build ingredients from ML recommendations
  const ingredients = recommendations.map((rec) => ({
    name: rec.ingredient,
    targetPercent: rec.concentration,
    minPercent: rec.minConcentration,
    maxPercent: rec.maxConcentration,
    stockConcentration: 100,
    function: rec.reason,
  }));

  // Ensure at least Hyaluronic Acid for U-zone
  if (ingredients.length === 0) {
    ingredients.push({
      name: 'Hyaluronic Acid',
      targetPercent: 1,
      minPercent: 0.1,
      maxPercent: 2,
      stockConcentration: 100,
      function: 'Cấp ẩm sâu - Deep hydration',
    });
  }

  return { baseType, ingredients };
}

/**
 * Calculate final concentrations using the formula calculator
 * Tính nồng độ cuối sử dụng bộ tính công thức
 */
function calculateConcentrations(vBase, ingredients) {
  // Use the optimizer to get compliant concentrations
  const optimized = optimizeFormulation(vBase, ingredients);

  // Format ingredients for output
  const formattedIngredients = optimized.optimizedIngredients.map((ing) => ({
    name: ing.name,
    optimalPercent: Math.round(ing.optimalPercent * 1000) / 1000,
    minPercent: ing.minPercent,
    maxPercent: ing.maxPercent,
    function: ing.function,
    isCompliant: ing.isCompliant,
  }));

  return {
    ingredients: formattedIngredients,
    totalVolume: Math.round(optimized.totalVolume * 100) / 100,
    allCompliant: optimized.allCompliant,
  };
}

/**
 * Generate formula notes based on skin profile
 * Tạo ghi chú công thức dựa trên hồ sơ da
 */
function generateFormulaNotes(skinMetrics, tzoneFormula, uzoneFormula) {
  const notes = [];

  notes.push(`Skin Profile: ${skinMetrics.skinType || 'combination'}, Age Group: ${skinMetrics.ageGroup || 'under_25'}`);
  notes.push(`Hồ sơ da: ${translateSkinType(skinMetrics.skinType)}, Nhóm tuổi: ${translateAgeGroup(skinMetrics.ageGroup)}`);
  notes.push('');
  notes.push(`T-Zone: ${tzoneFormula.baseType} base with ${tzoneFormula.ingredients.length} active ingredients`);
  notes.push(`U-Zone: ${uzoneFormula.baseType} base with ${uzoneFormula.ingredients.length} active ingredients`);
  notes.push('');

  if (skinMetrics.acneSeverity >= 3) {
    notes.push('⚠️ Moderate-to-severe acne detected. Formulation includes anti-acne actives.');
    notes.push('⚠️ Phát hiện mụn trung bình-nặng. Công thức bao gồm hoạt chất trị mụn.');
  }

  if (skinMetrics.overallSensitivity > 60) {
    notes.push('⚠️ High sensitivity detected. Concentrations kept conservative.');
    notes.push('⚠️ Độ nhạy cảm cao. Nồng độ được giữ ở mức thận trọng.');
  }

  notes.push('');
  notes.push('Formula: C_final = Σ(V_active_i × C_active_i) / (V_base + Σ V_active_i)');

  return notes.join('\n');
}

function translateSkinType(type) {
  const map = { oily: 'Da dầu', dry: 'Da khô', combination: 'Da hỗn hợp', normal: 'Da thường' };
  return map[type] || 'Không xác định';
}

function translateAgeGroup(group) {
  const map = { under_25: 'Dưới 25', '25_35': '25-35', over_35: 'Trên 35' };
  return map[group] || 'Không xác định';
}

module.exports = { run };
