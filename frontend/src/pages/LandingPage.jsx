import { motion } from 'framer-motion';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import CompetitorComparison from '../components/landing/CompetitorComparison';

function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CompetitorComparison />
    </motion.div>
  );
}

export default LandingPage;
