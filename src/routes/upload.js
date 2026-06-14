/**
 * Upload Routes - Định tuyến tải file
 * Handles PDF uploads and demo uploads
 */
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { handleUpload, handleDemoUpload } = require('../controllers/uploadController');

// POST /api/upload - Upload and process skin report PDF
router.post('/', upload.single('pdf'), handleUpload);

// POST /api/upload/demo - Process mockup data for demo purposes
router.post('/demo', handleDemoUpload);

module.exports = router;
