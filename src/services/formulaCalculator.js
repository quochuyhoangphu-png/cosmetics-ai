/**
 * Formula Calculator Service - Dịch vụ tính toán công thức
 * Implements the core formulation math:
 *   C_final = Σ(V_active_i × C_active_i) / (V_base + Σ V_active_i)
 *
 * This ensures that when active ingredients are mixed into a base,
 * the final concentration of each active is within safe/legal limits.
 */

/**
 * Calculate final concentration of an active ingredient in the mixture
 * Tính nồng độ cuối cùng của hoạt chất trong hỗn hợp
 *
 * Formula: C_final = Σ(V_active_i × C_active_i) / (V_base + Σ V_active_i)
 *
 * @param {number} vBase - Volume of base (mL) - Thể tích dung dịch nền
 * @param {Array} activeIngredients - Array of { name, volume, concentration }
 *   volume: mL of active solution added
 *   concentration: concentration of the active solution (as percentage, 0-100)
 * @returns {Object} { totalVolume, finalConcentrations: [{ name, cFinal }] }
 */
function calculateFinalConcentration(vBase, activeIngredients) {
  if (!vBase || vBase <= 0) {
    throw new Error('Base volume (V_base) must be positive - Thể tích nền phải dương');
  }
  if (!Array.isArray(activeIngredients) || activeIngredients.length === 0) {
    throw new Error('At least one active ingredient required - Cần ít nhất 1 hoạt chất');
  }

  // Sum of all active volumes - Tổng thể tích hoạt chất
  const totalActiveVolume = activeIngredients.reduce((sum, ing) => sum + (ing.volume || 0), 0);

  // Total mixture volume - Tổng thể tích hỗn hợp
  const totalVolume = vBase + totalActiveVolume;

  // Calculate C_final for each ingredient
  // C_final_i = (V_active_i × C_active_i) / (V_base + Σ V_active_j)
  const finalConcentrations = activeIngredients.map((ing) => {
    const cFinal = (ing.volume * ing.concentration) / totalVolume;
    return {
      name: ing.name,
      cFinal: Math.round(cFinal * 1000) / 1000, // Round to 3 decimal places
      inputVolume: ing.volume,
      inputConcentration: ing.concentration,
    };
  });

  return {
    vBase,
    totalActiveVolume,
    totalVolume,
    finalConcentrations,
  };
}

/**
 * Check if a final concentration is within legal limits
 * Kiểm tra nồng độ cuối có nằm trong giới hạn pháp lý không
 *
 * @param {number} cFinal - Final concentration (%)
 * @param {number} legalMin - Minimum legal concentration (%)
 * @param {number} legalMax - Maximum legal concentration (%)
 * @returns {Object} { isCompliant, message }
 */
function validateLegalCompliance(cFinal, legalMin, legalMax) {
  if (cFinal < legalMin) {
    return {
      isCompliant: false,
      message: `Concentration ${cFinal}% is below minimum effective level ${legalMin}% - ` +
               `Nồng độ ${cFinal}% dưới mức hiệu quả tối thiểu ${legalMin}%`,
    };
  }
  if (cFinal > legalMax) {
    return {
      isCompliant: false,
      message: `Concentration ${cFinal}% exceeds legal maximum ${legalMax}% - ` +
               `Nồng độ ${cFinal}% vượt giới hạn pháp lý ${legalMax}%`,
    };
  }
  return {
    isCompliant: true,
    message: `Concentration ${cFinal}% is within legal range [${legalMin}%, ${legalMax}%] - Đạt`,
  };
}

/**
 * Optimize formulation to meet target concentrations within constraints
 * Tối ưu hóa công thức để đạt nồng độ mục tiêu trong giới hạn
 *
 * Uses iterative adjustment: starts with target volumes and adjusts
 * to ensure all final concentrations are within legal limits.
 *
 * @param {number} vBase - Base volume (mL)
 * @param {Array} targetIngredients - Array of {
 *   name, targetPercent, minPercent, maxPercent,
 *   stockConcentration (concentration of stock solution, default 100%)
 * }
 * @returns {Object} Optimized formulation with volumes and final concentrations
 */
function optimizeFormulation(vBase, targetIngredients) {
  const maxIterations = 20;
  let currentIngredients = targetIngredients.map((ing) => ({
    name: ing.name,
    volume: (ing.targetPercent / 100) * vBase, // Initial volume estimate
    concentration: ing.stockConcentration || 100, // Stock solution concentration
    targetPercent: ing.targetPercent,
    minPercent: ing.minPercent,
    maxPercent: ing.maxPercent,
    function: ing.function || '',
  }));

  let bestResult = null;
  let allCompliant = false;

  for (let iter = 0; iter < maxIterations; iter++) {
    // Calculate current final concentrations
    const result = calculateFinalConcentration(vBase, currentIngredients);

    // Check compliance for each ingredient
    let compliant = true;
    const adjustments = [];

    for (let i = 0; i < result.finalConcentrations.length; i++) {
      const fc = result.finalConcentrations[i];
      const target = currentIngredients[i];
      const compliance = validateLegalCompliance(fc.cFinal, target.minPercent, target.maxPercent);

      if (!compliance.isCompliant) {
        compliant = false;
        // Adjust volume to get closer to target
        const targetCFinal = target.targetPercent;
        // New volume = targetCFinal * totalVolume / stockConcentration
        const newVolume = (targetCFinal / 100) * result.totalVolume / (target.concentration / 100);
        adjustments.push({ index: i, newVolume: Math.max(0.001, newVolume) });
      }
    }

    bestResult = result;

    if (compliant) {
      allCompliant = true;
      break;
    }

    // Apply adjustments for next iteration
    for (const adj of adjustments) {
      // Gradual adjustment (damping factor) to avoid oscillation
      const oldVol = currentIngredients[adj.index].volume;
      currentIngredients[adj.index].volume = oldVol * 0.5 + adj.newVolume * 0.5;
    }
  }

  // Build optimized result
  const optimizedIngredients = currentIngredients.map((ing, i) => {
    const fc = bestResult.finalConcentrations[i];
    return {
      name: ing.name,
      optimalPercent: fc.cFinal,
      minPercent: ing.minPercent,
      maxPercent: ing.maxPercent,
      volume: Math.round(ing.volume * 100) / 100,
      function: ing.function,
      isCompliant: fc.cFinal >= ing.minPercent && fc.cFinal <= ing.maxPercent,
    };
  });

  return {
    vBase,
    totalVolume: bestResult.totalVolume,
    allCompliant,
    optimizedIngredients,
  };
}

module.exports = {
  calculateFinalConcentration,
  validateLegalCompliance,
  optimizeFormulation,
};
