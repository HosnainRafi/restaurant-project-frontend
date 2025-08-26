import AboutSection from '@/components/AboutSection';
import ChefsRecommendations from '@/components/ChefsRecommendations';
import FeaturedCategory from '@/components/FeaturedCategory';
import FeaturedDishes from '@/components/FeaturedDishes';
import HeroSection from '@/components/Hero';
import OurChefs from '@/components/OurChefs';
import Testimonials from '@/components/Testimonials';
import TodaysMenu from '@/components/TodaysMenu';
import WhyChooseUs from '@/components/WhyChooseUs';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      {/* <AboutSection /> */}
      <FeaturedCategory />
      <FeaturedDishes />
      <TodaysMenu />
      <ChefsRecommendations />
      <Testimonials />
      <WhyChooseUs />
      <OurChefs />
    </div>
  );
};

export default HomePage;
