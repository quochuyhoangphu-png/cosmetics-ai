/**
 * Upload Controller - Controller xử lý tải file
 * Handles PDF upload and triggers the full agent pipeline
 * Also supports demo mode for presentations
 */
const fs = require('fs');
const path = require('path');
const { runPipeline } = require('../services/agents/orchestrator');
const { SkinAnalysis, Formulation } = require('../models');

/**
 * Handle PDF upload and run full analysis pipeline
 * Xử lý tải PDF và chạy toàn bộ pipeline phân tích
 *
 * POST /api/upload
 */
async function handleUpload(req, res, next) {
  try {
    // Validate file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'No PDF file uploaded. Chưa tải file PDF.',
        },
      });
    }

    console.log(`\n📥 Received PDF: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    // Read the uploaded PDF file
    const pdfPath = req.file.path;
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Run the full agent pipeline
    const pipelineResult = await runPipeline(pdfBuffer);

    // Save results to database - Lưu kết quả vào DB
    const savedAnalysis = await saveAnalysisToDb(pipelineResult, req.file.filename);

    return res.status(200).json({
      success: true,
      data: {
        analysisId: savedAnalysis.id,
        pipelineStatus: pipelineResult.pipelineStatus,
        totalProcessingTimeMs: pipelineResult.totalProcessingTimeMs,
        agentSteps: pipelineResult.agentSteps,
        skinData: pipelineResult.validatedData,
        formulation: pipelineResult.formulation,
        review: pipelineResult.review,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle demo mode - run pipeline with mock data (no PDF needed)
 * Chế độ demo - chạy pipeline với dữ liệu giả (không cần PDF)
 *
 * POST /api/upload/demo
 */
async function handleDemoUpload(req, res, next) {
  try {
    console.log('\n🎬 Running demo mode with mock data...');

    // Run pipeline without PDF buffer (will use mock data)
    const pipelineResult = await runPipeline(null);

    // Save results to database
    const savedAnalysis = await saveAnalysisToDb(pipelineResult, 'demo_mock_data.pdf');

    return res.status(200).json({
      success: true,
      data: {
        analysisId: savedAnalysis.id,
        isDemo: true,
        pipelineStatus: pipelineResult.pipelineStatus,
        totalProcessingTimeMs: pipelineResult.totalProcessingTimeMs,
        agentSteps: pipelineResult.agentSteps,
        skinData: pipelineResult.validatedData,
        formulation: pipelineResult.formulation,
        review: pipelineResult.review,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Save pipeline results to database
 * Lưu kết quả pipeline vào cơ sở dữ liệu
 */
async function saveAnalysisToDb(pipelineResult, pdfFilename) {
  const validatedData = pipelineResult.validatedData || {};

  // Create SkinAnalysis record - Tạo bản ghi phân tích da
  const analysis = await SkinAnalysis.create({
    pdfFilename: pdfFilename,
    tzoneSebum: validatedData.tzoneSebum || null,
    tzonePoreSize: validatedData.tzonePoreSize || null,
    tzonePoreDepth: validatedData.tzonePoreDepth || null,
    uzoneMoisture: validatedData.uzoneMoisture || null,
    uzonePigmentation: validatedData.uzonePigmentation || null,
    overallSensitivity: validatedData.overallSensitivity || null,
    acneSeverity: validatedData.acneSeverity || null,
    skinType: validatedData.skinType || null,
    ageGroup: validatedData.ageGroup || 'under_25',
    dataValidated: pipelineResult.validationResult?.isValid || false,
    validationNotes: pipelineResult.validationResult?.validationNotes || '',
    rawPdfText: pipelineResult.extractedData?.rawText || '',
  });

  // Create Formulation record if available - Tạo bản ghi công thức nếu có
  if (pipelineResult.formulation) {
    const formData = pipelineResult.formulation;
    await Formulation.create({
      analysisId: analysis.id,
      tzoneBaseType: formData.tzone?.baseType || null,
      tzoneIngredients: formData.tzone?.ingredients || [],
      uzoneBaseType: formData.uzone?.baseType || null,
      uzoneIngredients: formData.uzone?.ingredients || [],
      vBase: formData.vBase || 100,
      formulaNotes: formData.formulaNotes || '',
      legalCompliance: formData.legalCompliance || false,
      modelVersion: formData.modelVersion || '2.1.0',
      confidence: formData.confidence || 0,
    });
  }

  return analysis;
}

module.exports = {
  handleUpload,
  handleDemoUpload,
};
