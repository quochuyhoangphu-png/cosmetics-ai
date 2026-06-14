/**
 * Orchestrator Agent - Agent Điều phối
 * Main orchestration function that coordinates all agents in sequence:
 *   Extraction → Validation → Planning → Formulation → Review
 *
 * Tracks processing time for each step for UI pipeline display
 */
const extractionAgent = require('./extractionAgent');
const { validateSkinData } = require('../dataValidator');
const planningAgent = require('./planningAgent');
const formulationAgent = require('./formulationAgent');
const reviewAgent = require('./reviewAgent');

/**
 * Run the complete agent pipeline
 * Chạy toàn bộ pipeline agent
 *
 * @param {Buffer|null} pdfBuffer - PDF file buffer (null for demo mode)
 * @returns {Object} Complete analysis results with all agent steps
 */
async function runPipeline(pdfBuffer) {
  const pipelineStartTime = Date.now();
  const agentSteps = [];
  let currentStep = 0;
  const totalSteps = 5;

  console.log('🚀 Starting AI Agent Pipeline - Bắt đầu pipeline Agent AI');
  console.log('═══════════════════════════════════════════════════════════');

  // ===== Step 1: Extraction Agent =====
  // Bước 1: Agent trích xuất dữ liệu từ PDF
  currentStep++;
  console.log(`\n📄 [${currentStep}/${totalSteps}] Running Extraction Agent...`);
  const extractionResult = await extractionAgent.run(pdfBuffer);
  agentSteps.push(extractionResult);

  if (extractionResult.status === 'error') {
    console.error('❌ Extraction failed:', extractionResult.error);
    return buildPipelineResult(agentSteps, pipelineStartTime, 'failed', 'Extraction failed');
  }
  console.log(`   ✅ ${extractionResult.summary} (${extractionResult.processingTimeMs}ms)`);

  // ===== Step 2: Validation =====
  // Bước 2: Xác thực và làm sạch dữ liệu
  currentStep++;
  console.log(`\n🔍 [${currentStep}/${totalSteps}] Running Data Validation...`);
  const validationStartTime = Date.now();

  const validationResult = validateSkinData(extractionResult.data);
  const validationTime = Date.now() - validationStartTime;

  const validationStep = {
    agent: 'ValidationAgent',
    status: 'completed',
    processingTimeMs: validationTime,
    timestamp: new Date().toISOString(),
    data: validationResult,
    summary: `Validation ${validationResult.isValid ? 'PASSED' : 'NEEDS REVIEW'} with ${validationResult.warnings.length} warnings`,
  };
  agentSteps.push(validationStep);

  console.log(`   ✅ ${validationStep.summary} (${validationTime}ms)`);
  if (validationResult.warnings.length > 0) {
    console.log(`   ⚠️  Warnings: ${validationResult.warnings.length}`);
  }

  // ===== Step 3: Planning Agent =====
  // Bước 3: Agent lập kế hoạch điều trị
  currentStep++;
  console.log(`\n🧠 [${currentStep}/${totalSteps}] Running Planning Agent...`);
  const planningResult = await planningAgent.run(validationResult.validatedData);
  agentSteps.push(planningResult);

  if (planningResult.status === 'error') {
    console.error('❌ Planning failed:', planningResult.error);
    return buildPipelineResult(agentSteps, pipelineStartTime, 'partial', 'Planning failed');
  }
  console.log(`   ✅ ${planningResult.summary} (${planningResult.processingTimeMs}ms)`);

  // ===== Step 4: Formulation Agent =====
  // Bước 4: Agent pha chế công thức (CORE)
  currentStep++;
  console.log(`\n⚗️  [${currentStep}/${totalSteps}] Running Formulation Agent (CORE)...`);
  const formulationResult = await formulationAgent.run(
    planningResult.data.treatmentPlan,
    validationResult.validatedData,
    planningResult.data.mlPrediction
  );
  agentSteps.push(formulationResult);

  if (formulationResult.status === 'error') {
    console.error('❌ Formulation failed:', formulationResult.error);
    return buildPipelineResult(agentSteps, pipelineStartTime, 'partial', 'Formulation failed');
  }
  console.log(`   ✅ ${formulationResult.summary} (${formulationResult.processingTimeMs}ms)`);

  // ===== Step 5: Review Agent =====
  // Bước 5: Agent kiểm duyệt
  currentStep++;
  console.log(`\n📋 [${currentStep}/${totalSteps}] Running Review Agent...`);
  const reviewResult = await reviewAgent.run(formulationResult.data);
  agentSteps.push(reviewResult);

  if (reviewResult.status === 'error') {
    console.error('❌ Review failed:', reviewResult.error);
    return buildPipelineResult(agentSteps, pipelineStartTime, 'partial', 'Review failed');
  }
  console.log(`   ✅ ${reviewResult.summary} (${reviewResult.processingTimeMs}ms)`);

  // ===== Pipeline Complete =====
  const totalTime = Date.now() - pipelineStartTime;
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`🎉 Pipeline completed in ${totalTime}ms`);
  console.log(`   Formulation: ${reviewResult.data.approved ? '✅ APPROVED' : '❌ REJECTED'}`);

  return buildPipelineResult(agentSteps, pipelineStartTime, 'completed', null);
}

/**
 * Build the final pipeline result object
 * Xây dựng kết quả cuối cùng của pipeline
 */
function buildPipelineResult(agentSteps, startTime, status, errorMessage) {
  const totalTime = Date.now() - startTime;

  // Extract key data from each step
  const extraction = agentSteps.find(s => s.agent === 'ExtractionAgent');
  const validation = agentSteps.find(s => s.agent === 'ValidationAgent');
  const planning = agentSteps.find(s => s.agent === 'PlanningAgent');
  const formulation = agentSteps.find(s => s.agent === 'FormulationAgent');
  const review = agentSteps.find(s => s.agent === 'ReviewAgent');

  return {
    pipelineStatus: status,
    totalProcessingTimeMs: totalTime,
    errorMessage,
    timestamp: new Date().toISOString(),

    // Individual agent results for pipeline visualization
    agentSteps: agentSteps.map((step) => ({
      agent: step.agent,
      status: step.status,
      processingTimeMs: step.processingTimeMs,
      timestamp: step.timestamp,
      summary: step.summary,
      hasError: step.status === 'error',
    })),

    // Extracted and validated data
    extractedData: extraction?.data || null,
    validatedData: validation?.data?.validatedData || null,
    validationResult: validation?.data || null,

    // Treatment plan
    treatmentPlan: planning?.data?.treatmentPlan || null,
    mlPrediction: planning?.data?.mlPrediction || null,
    skinCondition: planning?.data?.skinCondition || null,

    // Formulation result
    formulation: formulation?.data || null,

    // Review result
    review: review?.data || null,
  };
}

module.exports = { runPipeline };
