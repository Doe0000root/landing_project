import HeroSection from '../components/HeroSection';
import InsuranceTypes from '../components/InsuranceTypes';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CoveragePlans from '../components/CoveragePlans';
import FooterSection from '../components/FooterSection';
import Chatbot from '../components/ChatBot';

interface LandingProps {
  onNavigate: (page: any) => void;
  user: any;
}

export default function Landing({ onNavigate, user }: LandingProps) {
  const handleGetConsultation = () => {
    if (user) {
      onNavigate('buy-insurance');
    } else {
      onNavigate('register');
    }
  };

  const handleBuyInsurance = () => {
    if (user) {
      onNavigate('buy-insurance');
    } else {
      onNavigate('register');
    }
  };

  const handleSelectPlan = () => {
    if (user) {
      onNavigate('buy-insurance');
    } else {
      onNavigate('register');
    }
  };

  return (
    <main>
      <HeroSection onGetConsultation={handleGetConsultation} onBuyInsurance={handleBuyInsurance} />
      <InsuranceTypes onGetQuote={() => handleBuyInsurance()} />
      <ServicesSection />
      <TestimonialsSection />
      <CoveragePlans onSelectPlan={handleSelectPlan} />
      <FooterSection />
      <Chatbot user={user} /> 
    </main>
  );
}
