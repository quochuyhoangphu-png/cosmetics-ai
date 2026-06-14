import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PDFUploader from '../components/upload/PDFUploader';
import UploadProgress from '../components/upload/UploadProgress';

function UploadPage() {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="upload">
        <Container>
          <header className="upload__header">
            <h1 className="upload__title">{t('upload.title')}</h1>
            <p className="upload__description">{t('upload.description')}</p>
          </header>

          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            {isProcessing ? (
              <UploadProgress />
            ) : (
              <PDFUploader onProcessingStart={() => setIsProcessing(true)} />
            )}
          </div>
        </Container>
      </section>
    </motion.div>
  );
}

export default UploadPage;
