import ChefsRecommendations from '@/components/ChefsRecommendations';
import FeaturedSection from '@/components/FeaturedSection';
import HeroSection from '@/components/Hero';
import OurChefs from '@/components/OurChefs';
import Testimonials from '@/components/Testimonials';
import TodaysMenu from '@/components/TodaysMenu';
import WhyChooseUs from '@/components/WhyChooseUs';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedSection />
      <TodaysMenu />
      <ChefsRecommendations />
      <Testimonials />
      <WhyChooseUs />
      <OurChefs />
    </div>
  );
};

export default HomePage;
