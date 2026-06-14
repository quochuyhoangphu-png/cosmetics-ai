/**
 * Planning Agent - Agent Lập kế hoạch điều trị
 * Analyzes validated skin metrics and generates a treatment plan
 * Calls mock RapidMiner for ML-based predictions
 * Determines ingredient categories needed for each skin zone
 */
const { mockRapidMinerScore } = require('../rapidminerMock');

/**
 * Run the planning agent on validated skin data
 * Chạy agent lập kế hoạch trên dữ liệu đã xác thực
 *
 * @param {Object} validatedData - Validated skin metrics
 * @returns {Object} Treatment plan with agent metadata
 */
async function run(validatedData) {
  const agentName = 'PlanningAgent';
  const startTime = Date.now();

  try {
    // Step 1: Get ML predictions from RapidMiner - Lấy dự đoán từ RapidMiner
    const mlPrediction = mockRapidMinerScore(validatedData);

    // Step 2: Analyze skin condition - Phân tích tình trạng da
    const skinCondition = analyzeSkinCondition(validatedData);

    // Step 3: Generate treatment plan - Lập kế hoạch điều trị
    const treatmentPlan = generateTreatmentPlan(skinCondition, mlPrediction);

    const processingTime = Date.now() - startTime;

    return {
      agent: agentName,
      status: 'completed',
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
      data: {
        skinCondition,
        mlPrediction,
        treatmentPlan,
      },
      summary: `Classified as "${mlPrediction.predictions.skinConditionClass}" ` +
               `with ${treatmentPlan.tzoneIngredientCategories.length} T-zone and ` +
               `${treatmentPlan.uzoneIngredientCategories.length} U-zone ingredient categories`,
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
 * Analyze skin condition from metrics
 * Phân tích tình trạng da từ các chỉ số
 */
function analyzeSkinCondition(metrics) {
  const conditions = [];

  // T-Zone analysis - Phân tích vùng T
  if (metrics.tzoneSebum > 60) {
    conditions.push({ zone: 'tzone', issue: 'excess_sebum', severity: metrics.tzoneSebum > 80 ? 'high' : 'moderate' });
  }
  if (metrics.tzonePoreSize > 50) {
    conditions.push({ zone: 'tzone', issue: 'enlarged_pores', severity: metrics.tzonePoreSize > 70 ? 'high' : 'moderate' });
  }
  if (metrics.acneSeverity >= 2) {
    conditions.push({ zone: 'tzone', issue: 'acne', severity: metrics.acneSeverity >= 4 ? 'high' : 'moderate' });
  }

  // U-Zone analysis - Phân tích vùng U
  if (metrics.uzoneMoisture < 40) {
    conditions.push({ zone: 'uzone', issue: 'dehydration', severity: metrics.uzoneMoisture < 25 ? 'high' : 'moderate' });
  }
  if (metrics.uzonePigmentation > 30) {
    conditions.push({ zone: 'uzone', issue: 'hyperpigmentation', severity: metrics.uzonePigmentation > 50 ? 'high' : 'moderate' });
  }

  // Overall
  if (metrics.overallSensitivity > 55) {
    conditions.push({ zone: 'overall', issue: 'sensitivity', severity: metrics.overallSensitivity > 75 ? 'high' : 'moderate' });
  }

  return {
    skinType: metrics.skinType || 'combination',
    ageGroup: metrics.ageGroup || 'under_25',
    conditions,
    primaryConcern: conditions.length > 0 ? conditions[0].issue : 'general_maintenance',
  };
}

/**
 * Generate treatment plan based on skin condition and ML predictions
 * Tạo kế hoạch điều trị dựa trên tình trạng da và dự đoán ML
 */
function generateTreatmentPlan(skinCondition, mlPrediction) {
  const { predictions } = mlPrediction;

  // Build T-Zone ingredient categories - Danh mục hoạt chất vùng T
  const tzoneIngredientCategories = [];
  const tzoneConditions = skinCondition.conditions.filter(c => c.zone === 'tzone' || c.zone === 'overall');

  for (const condition of tzoneConditions) {
    switch (condition.issue) {
      case 'excess_sebum':
        tzoneIngredientCategories.push({
          category: 'sebum_control',
          description: 'Kiểm soát bã nhờn - Sebum regulation',
          suggestedIngredients: ['Niacinamide', 'Zinc PCA'],
          priority: condition.severity === 'high' ? 1 : 2,
        });
        break;
      case 'acne':
        tzoneIngredientCategories.push({
          category: 'anti_acne',
          description: 'Trị mụn - Anti-acne treatment',
          suggestedIngredients: ['Salicylic Acid (BHA)', 'Azelaic Acid', 'Tea Tree Oil'],
          priority: 1,
        });
        break;
      case 'enlarged_pores':
        tzoneIngredientCategories.push({
          category: 'pore_minimizing',
          description: 'Se khít lỗ chân lông - Pore minimizing',
          suggestedIngredients: ['Zinc PCA', 'Niacinamide'],
          priority: 3,
        });
        break;
      case 'sensitivity':
        tzoneIngredientCategories.push({
          category: 'soothing',
          description: 'Làm dịu da - Skin soothing',
          suggestedIngredients: ['Centella Asiatica'],
          priority: 2,
        });
        break;
    }
  }

  // Build U-Zone ingredient categories - Danh mục hoạt chất vùng U
  const uzoneIngredientCategories = [];
  const uzoneConditions = skinCondition.conditions.filter(c => c.zone === 'uzone' || c.zone === 'overall');

  for (const condition of uzoneConditions) {
    switch (condition.issue) {
      case 'dehydration':
        uzoneIngredientCategories.push({
          category: 'hydration',
          description: 'Cấp ẩm sâu - Deep hydration',
          suggestedIngredients: ['Hyaluronic Acid', 'Ceramide NP'],
          priority: 1,
        });
        break;
      case 'hyperpigmentation':
        uzoneIngredientCategories.push({
          category: 'brightening',
          description: 'Sáng da, giảm sắc tố - Brightening, depigmenting',
          suggestedIngredients: ['Niacinamide', 'Azelaic Acid'],
          priority: 2,
        });
        break;
      case 'sensitivity':
        uzoneIngredientCategories.push({
          category: 'barrier_repair',
          description: 'Phục hồi hàng rào da - Barrier repair',
          suggestedIngredients: ['Ceramide NP', 'Centella Asiatica'],
          priority: 1,
        });
        break;
    }
  }

  // Ensure at least one category per zone
  if (tzoneIngredientCategories.length === 0) {
    tzoneIngredientCategories.push({
      category: 'maintenance',
      description: 'Duy trì sức khỏe da - Skin maintenance',
      suggestedIngredients: ['Niacinamide'],
      priority: 3,
    });
  }
  if (uzoneIngredientCategories.length === 0) {
    uzoneIngredientCategories.push({
      category: 'maintenance',
      description: 'Duy trì độ ẩm - Moisture maintenance',
      suggestedIngredients: ['Hyaluronic Acid'],
      priority: 3,
    });
  }

  return {
    tzoneBaseType: predictions.tzoneBaseType,
    uzoneBaseType: predictions.uzoneBaseType,
    tzoneIngredientCategories: tzoneIngredientCategories.sort((a, b) => a.priority - b.priority),
    uzoneIngredientCategories: uzoneIngredientCategories.sort((a, b) => a.priority - b.priority),
    treatmentGoals: buildTreatmentGoals(skinCondition),
    treatmentUrgency: predictions.treatmentUrgency,
  };
}

/**
 * Build treatment goals from skin condition
 * Xây dựng mục tiêu điều trị
 */
function buildTreatmentGoals(skinCondition) {
  const goals = [];

  for (const condition of skinCondition.conditions) {
    switch (condition.issue) {
      case 'excess_sebum':
        goals.push('Giảm tiết dầu vùng T - Reduce T-zone oiliness');
        break;
      case 'acne':
        goals.push('Kiểm soát và giảm mụn - Control and reduce acne');
        break;
      case 'enlarged_pores':
        goals.push('Thu nhỏ lỗ chân lông - Minimize pore appearance');
        break;
      case 'dehydration':
        goals.push('Tăng cường độ ẩm vùng U - Boost U-zone hydration');
        break;
      case 'hyperpigmentation':
        goals.push('Làm đều màu da - Even skin tone');
        break;
      case 'sensitivity':
        goals.push('Giảm kích ứng, phục hồi da - Reduce irritation, restore skin');
        break;
    }
  }

  if (goals.length === 0) {
    goals.push('Duy trì sức khỏe da tổng thể - Maintain overall skin health');
  }

  return [...new Set(goals)]; // Remove duplicates
}

module.exports = { run };
