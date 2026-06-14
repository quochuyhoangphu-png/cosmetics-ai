/**
 * Data Validator Service - Dịch vụ xác thực dữ liệu da
 * Validates, cleans, and normalizes skin metrics extracted from PDF
 * Simulates expert review with automated validation rules
 */

// Valid ranges for each metric - Khoảng giá trị hợp lệ cho mỗi chỉ số
const VALID_RANGES = {
  tzoneSebum:         { min: 0, max: 100, label: 'T-Zone Sebum' },
  tzonePoreSize:      { min: 0, max: 100, label: 'T-Zone Pore Size' },
  tzonePoreDepth:     { min: 0, max: 100, label: 'T-Zone Pore Depth' },
  uzoneMoisture:      { min: 0, max: 100, label: 'U-Zone Moisture' },
  uzonePigmentation:  { min: 0, max: 100, label: 'U-Zone Pigmentation' },
  overallSensitivity: { min: 0, max: 100, label: 'Overall Sensitivity' },
  acneSeverity:       { min: 0, max: 5,   label: 'Acne Severity' },
};

/**
 * Validate and clean skin analysis data
 * Xác thực và làm sạch dữ liệu phân tích da
 *
 * @param {Object} rawMetrics - Raw extracted metrics from PDF parser
 * @returns {Object} { validatedData, isValid, warnings, validationNotes }
 */
function validateSkinData(rawMetrics) {
  const warnings = [];
  const validatedData = { ...rawMetrics };
  let isValid = true;

  // ===== Step 1: Check required fields exist - Kiểm tra các trường bắt buộc =====
  const requiredFields = ['tzoneSebum', 'uzoneMoisture', 'acneSeverity'];
  for (const field of requiredFields) {
    if (validatedData[field] === null || validatedData[field] === undefined) {
      warnings.push(`Missing required field: ${field} - Thiếu trường bắt buộc: ${field}`);
      // Don't fail validation, but note it
    }
  }

  // ===== Step 2: Range validation and clamping - Kiểm tra khoảng giá trị =====
  for (const [field, range] of Object.entries(VALID_RANGES)) {
    const value = validatedData[field];
    if (value === null || value === undefined) continue;

    if (typeof value !== 'number' || isNaN(value)) {
      warnings.push(`${range.label}: Invalid non-numeric value "${value}" - Giá trị không hợp lệ`);
      validatedData[field] = null;
      continue;
    }

    // Clamp to valid range - Giới hạn trong khoảng hợp lệ
    if (value < range.min) {
      warnings.push(`${range.label}: Value ${value} below minimum ${range.min}, clamped - Dưới mức tối thiểu`);
      validatedData[field] = range.min;
    } else if (value > range.max) {
      warnings.push(`${range.label}: Value ${value} above maximum ${range.max}, clamped - Trên mức tối đa`);
      validatedData[field] = range.max;
    }

    // Round to 1 decimal place for consistency
    if (field !== 'acneSeverity') {
      validatedData[field] = Math.round(validatedData[field] * 10) / 10;
    } else {
      validatedData[field] = Math.round(validatedData[field]);
    }
  }

  // ===== Step 3: Cross-field outlier detection - Phát hiện bất thường liên trường =====

  // Suspicious: very high sebum AND very high moisture (unlikely combination)
  // Đáng ngờ: bã nhờn rất cao VÀ độ ẩm rất cao (kết hợp khó xảy ra)
  if (validatedData.tzoneSebum > 90 && validatedData.uzoneMoisture > 80) {
    warnings.push(
      'OUTLIER: Very high sebum (>90) combined with very high moisture (>80) is unusual. ' +
      'Possible measurement error. - BẤT THƯỜNG: Bã nhờn và độ ẩm đều rất cao, có thể sai đo.'
    );
    isValid = false;
  }

  // Suspicious: high acne but very low sebum (acne usually correlates with sebum)
  // Đáng ngờ: mụn nặng nhưng bã nhờn rất thấp
  if (validatedData.acneSeverity >= 4 && validatedData.tzoneSebum !== null && validatedData.tzoneSebum < 20) {
    warnings.push(
      'OUTLIER: High acne severity (≥4) with very low sebum (<20) is unusual. ' +
      'May indicate hormonal acne. - BẤT THƯỜNG: Mụn nặng nhưng ít dầu, có thể mụn nội tiết.'
    );
    // Don't invalidate, just warn - this could be hormonal acne
  }

  // Suspicious: very low sensitivity but high acne (inflamed acne usually = sensitive)
  if (validatedData.acneSeverity >= 3 && validatedData.overallSensitivity !== null && validatedData.overallSensitivity < 10) {
    warnings.push(
      'NOTE: Moderate/high acne with very low sensitivity score. ' +
      'Verify sensitivity measurement. - LƯU Ý: Mụn nhiều nhưng da không nhạy cảm.'
    );
  }

  // ===== Step 4: Determine skin type if missing - Xác định loại da nếu thiếu =====
  if (!validatedData.skinType && validatedData.tzoneSebum !== null) {
    if (validatedData.tzoneSebum > 65) {
      validatedData.skinType = 'oily';
    } else if (validatedData.tzoneSebum < 30 && validatedData.uzoneMoisture !== null && validatedData.uzoneMoisture < 35) {
      validatedData.skinType = 'dry';
    } else if (validatedData.tzoneSebum > 50 && validatedData.uzoneMoisture !== null && validatedData.uzoneMoisture < 40) {
      validatedData.skinType = 'combination';
    } else {
      validatedData.skinType = 'normal';
    }
    warnings.push(
      `Skin type auto-classified as "${validatedData.skinType}" based on metrics. ` +
      `Loại da tự phân loại: "${validatedData.skinType}".`
    );
  }

  // ===== Step 5: Determine age group if missing - Xác định nhóm tuổi =====
  if (!validatedData.ageGroup) {
    // Default to under_25 for the target demographic
    validatedData.ageGroup = 'under_25';
    warnings.push('Age group defaulted to "under_25" - Nhóm tuổi mặc định: dưới 25.');
  }

  // ===== Step 6: Build validation notes - Tổng hợp ghi chú =====
  const validationNotes = [
    `Validation completed at ${new Date().toISOString()}`,
    `Status: ${isValid ? 'PASSED' : 'NEEDS REVIEW'} - ${isValid ? 'ĐẠT' : 'CẦN KIỂM TRA'}`,
    `Warnings: ${warnings.length}`,
    ...warnings.map((w, i) => `  [${i + 1}] ${w}`),
  ].join('\n');

  return {
    validatedData,
    isValid,
    warnings,
    validationNotes,
  };
}

module.exports = {
  validateSkinData,
  VALID_RANGES,
};
