import ChefsRecommendations from '@/components/ChefsRecommendations';
import FeaturedSection from '@/components/FeaturedSection';
import HeroSection from '@/components/Hero';
import TodaysMenu from '@/components/TodaysMenu';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedSection />
      <TodaysMenu />
      <ChefsRecommendations />
    </div>
  );
};

export default HomePage;
