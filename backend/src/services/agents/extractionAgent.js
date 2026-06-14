/**
 * Extraction Agent - Agent Trích xuất dữ liệu
 * First agent in the pipeline: extracts skin metrics from PDF
 * Wraps the pdfParser service with agent metadata
 */
const { parseSkinReport, generateMockSkinData } = require('../pdfParser');

/**
 * Run the extraction agent on a PDF buffer
 * Chạy agent trích xuất trên buffer PDF
 *
 * @param {Buffer|null} pdfBuffer - PDF file buffer (null for demo mode)
 * @returns {Object} Extraction result with agent metadata
 */
async function run(pdfBuffer) {
  const agentName = 'ExtractionAgent';
  const startTime = Date.now();

  try {
    let extractedData;

    if (pdfBuffer) {
      // Real PDF extraction - Trích xuất từ PDF thật
      extractedData = await parseSkinReport(pdfBuffer);
    } else {
      // Demo mode: generate mock data - Chế độ demo: tạo dữ liệu giả
      extractedData = generateMockSkinData();
    }

    const processingTime = Date.now() - startTime;

    return {
      agent: agentName,
      status: 'completed',
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
      data: extractedData,
      summary: pdfBuffer
        ? `Extracted ${Object.keys(extractedData).filter(k => k !== 'rawText').length} metrics from PDF`
        : 'Generated mock skin data for demo mode',
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

module.exports = { run };
