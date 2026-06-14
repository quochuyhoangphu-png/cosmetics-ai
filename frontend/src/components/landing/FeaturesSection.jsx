import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BiBarChartAlt2, BiBulb, BiTestTube } from 'react-icons/bi';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2 },
  }),
};

function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      key: 'analysis',
      icon: <BiBarChartAlt2 />,
      iconClass: 'features__card-icon--analysis',
    },
    {
      key: 'recommendation',
      icon: <BiBulb />,
      iconClass: 'features__card-icon--recommendation',
    },
    {
      key: 'mini_factory',
      icon: <BiTestTube />,
      iconClass: 'features__card-icon--factory',
    },
  ];

  return (
    <section className="features">
      <Container>
        <motion.header
          className="features__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="features__title">{t('features.section_title')}</h2>
          <p className="features__subtitle">{t('features.section_subtitle')}</p>
        </motion.header>

        <div className="features__grid">
          {features.map((feature, index) => (
            <motion.article
              key={feature.key}
              className="features__card"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <div className={`features__card-icon ${feature.iconClass}`}>
                {feature.icon}
              </div>
              <h3 className="features__card-title">
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className="features__card-desc">
                {t(`features.${feature.key}.description`)}
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturesSection;
