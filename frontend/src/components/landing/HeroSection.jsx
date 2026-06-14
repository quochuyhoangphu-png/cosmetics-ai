import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BiRightArrowAlt } from 'react-icons/bi';

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero__background">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
      </div>

      <div className="hero__floating">
        <div className="hero__floating-circle hero__floating-circle--1" />
        <div className="hero__floating-circle hero__floating-circle--2" />
        <div className="hero__floating-circle hero__floating-circle--3" />
        <div className="hero__floating-circle hero__floating-circle--4" />
        <div className="hero__floating-diamond hero__floating-diamond--1" />
        <div className="hero__floating-diamond hero__floating-diamond--2" />
      </div>

      <Container>
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h3
            className="text-uppercase tracking-wider fw-bold mb-3"
            style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '2px', fontSize: '1.2rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Qui Quàng nủi lọn
          </motion.h3>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/upload" className="hero__cta">
              {t('hero.cta')}
              <BiRightArrowAlt className="hero__cta-icon" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

export default HeroSection;
