import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  BiCloudUpload,
  BiSearchAlt,
  BiCheckShield,
  BiTestTube,
  BiShieldQuarter,
} from 'react-icons/bi';

function UploadProgress() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      key: 'upload',
      icon: <BiCloudUpload />,
      name: t('upload.progress.upload'),
      desc: t('upload.progress.upload_desc'),
    },
    {
      key: 'extract',
      icon: <BiSearchAlt />,
      name: t('upload.progress.extract'),
      desc: t('upload.progress.extract_desc'),
    },
    {
      key: 'validate',
      icon: <BiCheckShield />,
      name: t('upload.progress.validate'),
      desc: t('upload.progress.validate_desc'),
    },
    {
      key: 'formulate',
      icon: <BiTestTube />,
      name: t('upload.progress.formulate'),
      desc: t('upload.progress.formulate_desc'),
    },
    {
      key: 'review',
      icon: <BiShieldQuarter />,
      name: t('upload.progress.review'),
      desc: t('upload.progress.review_desc'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [steps.length]);

  const getStepState = (index) => {
    if (index < currentStep) return 'complete';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStatusText = (state) => {
    switch (state) {
      case 'complete':
        return '✓';
      case 'active':
        return t('agents.processing');
      default:
        return t('agents.pending');
    }
  };

  return (
    <motion.div
      className="upload-progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <header className="upload-progress__header">
        <h3 className="upload-progress__title">{t('upload.progress.title')}</h3>
        <p className="upload-progress__subtitle">
          {t('upload.progress.subtitle')}
        </p>
      </header>

      <div className="upload-progress__steps">
        {steps.map((step, index) => {
          const state = getStepState(index);
          return (
            <motion.div
              key={step.key}
              className={`upload-progress__step upload-progress__step--${state}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="upload-progress__step-icon">{step.icon}</div>
              <div className="upload-progress__step-info">
                <div className="upload-progress__step-name">{step.name}</div>
                <p className="upload-progress__step-desc">{step.desc}</p>
              </div>
              <span className="upload-progress__step-status">
                {getStatusText(state)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default UploadProgress;
