/**
 * Mock RapidMiner Scoring Service - Dịch vụ giả lập RapidMiner AI Hub
 * Simulates ML model predictions for skin analysis and formulation
 * Uses rule-based logic inspired by Kaggle skincare/cosmetics datasets
 *
 * In production, this would call the actual RapidMiner AI Hub REST API
 */

/**
 * Simulate RapidMiner AI Hub scoring endpoint
 * Giả lập endpoint chấm điểm của RapidMiner AI Hub
 *
 * @param {Object} skinMetrics - Validated skin metrics payload
 * @returns {Object} ML prediction with confidence and recommended formulation
 */
function mockRapidMinerScore(skinMetrics) {
  const startTime = Date.now();

  const {
    tzoneSebum = 50,
    tzonePoreSize = 40,
    tzonePoreDepth = 35,
    uzoneMoisture = 45,
    uzonePigmentation = 25,
    overallSensitivity = 40,
    acneSeverity = 2,
    skinType = 'combination',
    ageGroup = 'under_25',
  } = skinMetrics;

  // ===== T-Zone Recommendations - Khuyến nghị vùng T =====
  const tzoneRecommendations = [];

  // Rule 1: High sebum + acne → BHA (Salicylic Acid) + Niacinamide
  // Quy tắc 1: Bã nhờn cao + mụn → BHA + Niacinamide
  if (tzoneSebum > 55 && acneSeverity >= 2) {
    // BHA concentration scales with acne severity
    const bhaConc = Math.min(2.0, 0.5 + (acneSeverity * 0.3));
    tzoneRecommendations.push({
      ingredient: 'Salicylic Acid (BHA)',
      concentration: Math.round(bhaConc * 100) / 100,
      minConcentration: 0.5,
      maxConcentration: 2.0,
      reason: 'Tiêu sừng, thông thoáng lỗ chân lông - Keratolytic, unclogs pores',
      priority: 1,
    });

    // Niacinamide concentration scales inversely with sensitivity
    const niaConc = overallSensitivity > 60 ? 4 : overallSensitivity > 40 ? 6 : 8;
    tzoneRecommendations.push({
      ingredient: 'Niacinamide',
      concentration: niaConc,
      minConcentration: 2,
      maxConcentration: 10,
      reason: 'Kiềm dầu, giảm viêm, thu nhỏ lỗ chân lông - Oil control, anti-inflammatory',
      priority: 2,
    });
  }

  // Rule 2: Large pores → Zinc PCA
  // Quy tắc 2: Lỗ chân lông to → Zinc PCA
  if (tzonePoreSize > 45) {
    const zincConc = Math.min(1.0, 0.1 + (tzonePoreSize / 100) * 0.9);
    tzoneRecommendations.push({
      ingredient: 'Zinc PCA',
      concentration: Math.round(zincConc * 100) / 100,
      minConcentration: 0.1,
      maxConcentration: 1.0,
      reason: 'Kiểm soát bã nhờn, se khít lỗ chân lông - Sebum control, pore minimizing',
      priority: 3,
    });
  }

  // Rule 3: Moderate+ acne → Azelaic Acid or Tea Tree
  // Quy tắc 3: Mụn trung bình+ → Azelaic Acid hoặc Tea Tree
  if (acneSeverity >= 3) {
    if (overallSensitivity < 50) {
      // Non-sensitive → Azelaic Acid (stronger)
      const azConc = Math.min(15, 5 + acneSeverity * 2);
      tzoneRecommendations.push({
        ingredient: 'Azelaic Acid',
        concentration: azConc,
        minConcentration: 5,
        maxConcentration: 15,
        reason: 'Kháng khuẩn, giảm viêm mụn, sáng da - Antibacterial, anti-acne',
        priority: 4,
      });
    } else {
      // Sensitive → Tea Tree (gentler)
      const ttConc = Math.min(5, 1 + acneSeverity * 0.8);
      tzoneRecommendations.push({
        ingredient: 'Tea Tree Oil',
        concentration: Math.round(ttConc * 100) / 100,
        minConcentration: 1,
        maxConcentration: 5,
        reason: 'Kháng khuẩn tự nhiên, nhẹ nhàng - Natural antibacterial, gentle',
        priority: 4,
      });
    }
  }

  // ===== U-Zone Recommendations - Khuyến nghị vùng U =====
  const uzoneRecommendations = [];

  // Rule 4: Low moisture → Hyaluronic Acid + Ceramide
  // Quy tắc 4: Độ ẩm thấp → Hyaluronic Acid + Ceramide
  if (uzoneMoisture < 50) {
    const haConc = Math.min(2.0, 0.1 + ((50 - uzoneMoisture) / 50) * 1.9);
    uzoneRecommendations.push({
      ingredient: 'Hyaluronic Acid',
      concentration: Math.round(haConc * 100) / 100,
      minConcentration: 0.1,
      maxConcentration: 2.0,
      reason: 'Cấp ẩm sâu, giữ nước - Deep hydration, water retention',
      priority: 1,
    });

    const cerConc = Math.min(3.0, 0.5 + ((50 - uzoneMoisture) / 50) * 2.5);
    uzoneRecommendations.push({
      ingredient: 'Ceramide NP',
      concentration: Math.round(cerConc * 100) / 100,
      minConcentration: 0.5,
      maxConcentration: 3.0,
      reason: 'Phục hồi hàng rào bảo vệ da - Restores skin barrier',
      priority: 2,
    });
  }

  // Rule 5: Pigmentation → Niacinamide for U-zone too
  // Quy tắc 5: Sắc tố → Niacinamide cho vùng U
  if (uzonePigmentation > 30) {
    const niaConcU = Math.min(10, 3 + (uzonePigmentation / 100) * 7);
    uzoneRecommendations.push({
      ingredient: 'Niacinamide',
      concentration: Math.round(niaConcU * 100) / 100,
      minConcentration: 2,
      maxConcentration: 10,
      reason: 'Giảm sắc tố, đều màu da - Reduces pigmentation, evens skin tone',
      priority: 3,
    });
  }

  // Rule 6: Sensitivity + acne → Centella Asiatica
  // Quy tắc 6: Nhạy cảm + mụn → Centella Asiatica
  if (overallSensitivity > 35 || acneSeverity >= 2) {
    const cenConc = Math.min(5, 0.5 + (overallSensitivity / 100) * 4.5);
    uzoneRecommendations.push({
      ingredient: 'Centella Asiatica',
      concentration: Math.round(cenConc * 100) / 100,
      minConcentration: 0.5,
      maxConcentration: 5.0,
      reason: 'Phục hồi, làm dịu, chống viêm - Healing, soothing, anti-inflammatory',
      priority: 4,
    });
  }

  // ===== Base type recommendations - Khuyến nghị dạng nền =====
  const tzoneBaseType = tzoneSebum > 60 ? 'gel' : 'serum';
  const uzoneBaseType = uzoneMoisture < 35 ? 'cream' : 'emulsion';

  // ===== Confidence calculation - Tính điểm tin cậy =====
  // Higher confidence when metrics are in typical ranges
  let confidence = 0.85;
  if (acneSeverity >= 2 && tzoneSebum > 55) confidence += 0.05; // Clear pattern
  if (uzoneMoisture < 50 && uzonePigmentation > 20) confidence += 0.03; // Clear pattern
  if (overallSensitivity > 70) confidence -= 0.05; // High sensitivity = more uncertainty
  if (ageGroup === 'under_25' && skinType === 'oily') confidence += 0.02; // Common profile
  confidence = Math.min(0.98, Math.max(0.60, confidence));

  const processingTime = Date.now() - startTime;

  return {
    modelName: 'CosmeticsAI-SkinFormulator-v2.1',
    modelVersion: '2.1.0',
    scoringTimestamp: new Date().toISOString(),
    processingTimeMs: processingTime + 150, // Add simulated model inference time

    input: {
      skinType,
      ageGroup,
      tzoneSebum,
      uzoneMoisture,
      acneSeverity,
      overallSensitivity,
    },

    predictions: {
      skinConditionClass: determineSkinConditionClass(skinMetrics),
      treatmentUrgency: acneSeverity >= 4 ? 'high' : acneSeverity >= 2 ? 'moderate' : 'low',
      tzoneBaseType,
      uzoneBaseType,
      tzoneRecommendations,
      uzoneRecommendations,
    },

    confidence: Math.round(confidence * 100) / 100,

    metadata: {
      datasetReference: 'Kaggle Skincare & Cosmetics Dataset (simulated)',
      featureImportance: {
        tzoneSebum: 0.28,
        acneSeverity: 0.25,
        uzoneMoisture: 0.18,
        overallSensitivity: 0.12,
        tzonePoreSize: 0.09,
        uzonePigmentation: 0.08,
      },
    },
  };
}

/**
 * Determine skin condition classification
 * Phân loại tình trạng da
 */
function determineSkinConditionClass(metrics) {
  const { tzoneSebum = 50, acneSeverity = 0, uzoneMoisture = 50, overallSensitivity = 30 } = metrics;

  if (acneSeverity >= 4 && tzoneSebum > 70) {
    return 'severe_oily_acne'; // Da dầu mụn nặng
  }
  if (acneSeverity >= 2 && tzoneSebum > 55) {
    return 'moderate_oily_acne'; // Da dầu mụn trung bình
  }
  if (tzoneSebum > 65 && uzoneMoisture < 40) {
    return 'combination_dehydrated'; // Da hỗn hợp thiếu nước
  }
  if (tzoneSebum > 60) {
    return 'oily_mild'; // Da dầu nhẹ
  }
  if (uzoneMoisture < 30) {
    return 'dry_dehydrated'; // Da khô thiếu nước
  }
  if (overallSensitivity > 65) {
    return 'sensitive_reactive'; // Da nhạy cảm
  }
  return 'normal_balanced'; // Da bình thường
}

module.exports = {
  mockRapidMinerScore,
  determineSkinConditionClass,
};
