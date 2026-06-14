import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BiCloudUpload, BiBot, BiShieldQuarter, BiGift } from 'react-icons/bi';

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2 },
  }),
};

function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { key: 'step1', icon: <BiCloudUpload /> },
    { key: 'step2', icon: <BiBot /> },
    { key: 'step3', icon: <BiShieldQuarter /> },
    { key: 'step4', icon: <BiGift /> },
  ];

  return (
    <section className="how-it-works">
      <Container>
        <motion.header
          className="how-it-works__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="how-it-works__title">{t('how_it_works.title')}</h2>
          <p className="how-it-works__subtitle">{t('how_it_works.subtitle')}</p>
        </motion.header>

        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <motion.article
              key={step.key}
              className="how-it-works__step"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stepVariants}
            >
              <div className="how-it-works__step-number">
                <span className="how-it-works__step-icon">{step.icon}</span>
              </div>
              <h4 className="how-it-works__step-title">
                {t(`how_it_works.${step.key}.title`)}
              </h4>
              <p className="how-it-works__step-desc">
                {t(`how_it_works.${step.key}.description`)}
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;
