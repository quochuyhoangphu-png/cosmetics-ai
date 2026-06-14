/**
 * File Upload Middleware - Middleware tải file lên
 * Multer configuration for PDF upload
 * Filters: only .pdf files, max 10MB
 */
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage configuration - Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: uuid_originalname.pdf
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter: only accept PDF files - Bộ lọc: chỉ chấp nhận PDF
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (ext === '.pdf' && mimeType === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed. Chỉ chấp nhận file PDF.'), false);
  }
};

// Multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max - Tối đa 10MB
    files: 1, // Only 1 file at a time
  },
});

module.exports = upload;
