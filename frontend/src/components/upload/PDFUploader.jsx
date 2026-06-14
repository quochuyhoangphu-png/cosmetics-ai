import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { BiCloudUpload, BiFile, BiX, BiRocket, BiPlay } from 'react-icons/bi';
import { uploadPDF, triggerDemo } from '../../services/api';

function PDFUploader({ onProcessingStart }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    if (rejectedFiles.length > 0) {
      setError(t('upload.pdf_only'));
      return;
    }
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    onProcessingStart?.();

    try {
      const result = await uploadPDF(selectedFile);
      const analysisId = result?.data?.analysisId || result?.analysisId || result?.id || 'demo-001';
      setTimeout(() => {
        navigate(`/dashboard/${analysisId}`);
      }, 8000);
    } catch (err) {
      // If API is not available, use demo mode
      console.warn('API not available, using demo mode:', err.message);
      setTimeout(() => {
        navigate('/dashboard/demo-001');
      }, 8000);
    }
  };

  const handleDemo = async () => {
    setUploading(true);
    setError(null);
    onProcessingStart?.();

    try {
      const result = await triggerDemo();
      const analysisId = result?.data?.analysisId || result?.analysisId || result?.id || 'demo-001';
      setTimeout(() => {
        navigate(`/dashboard/${analysisId}`);
      }, 8000);
    } catch (err) {
      console.warn('API not available, using demo mode:', err.message);
      setTimeout(() => {
        navigate('/dashboard/demo-001');
      }, 8000);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        {...getRootProps()}
        className={`upload__dropzone ${isDragActive ? 'upload__dropzone--active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="upload__dropzone-content">
          <BiCloudUpload className="upload__icon" />
          <p className="upload__dropzone-text">
            {t('upload.drag_drop_text')}{' '}
            <span className="upload__dropzone-highlight">
              {t('upload.or_click')}
            </span>
          </p>
          <p className="upload__dropzone-hint">{t('upload.pdf_only')}</p>
        </div>

        {selectedFile && (
          <div className="upload__file-preview" onClick={(e) => e.stopPropagation()}>
            <BiFile className="upload__file-icon" />
            <div className="upload__file-info">
              <div className="upload__file-name">{selectedFile.name}</div>
              <div className="upload__file-size">
                {formatFileSize(selectedFile.size)}
              </div>
            </div>
            <button
              className="upload__file-remove"
              onClick={removeFile}
              aria-label="Remove file"
            >
              <BiX />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
          {error}
        </p>
      )}

      <div className="upload__actions">
        <button
          className="upload__btn upload__btn--primary"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
        >
          <BiRocket />
          {uploading ? t('upload.processing') : t('upload.upload_btn')}
        </button>
      </div>

      <div className="upload__divider">{t('upload.or')}</div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
          {t('upload.demo_desc')}
        </p>
        <button
          className="upload__btn upload__btn--demo"
          onClick={handleDemo}
          disabled={uploading}
        >
          <BiPlay />
          {t('upload.demo_btn')}
        </button>
      </div>
    </motion.div>
  );
}

export default PDFUploader;
