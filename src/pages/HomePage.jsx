import AboutSection from '@/components/AboutSection';
import ChefsRecommendations from '@/components/ChefsRecommendations';
import FAQSection from '@/components/FAQSection';
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
      <FAQSection />
    </div>
  );
};

export default HomePage;
