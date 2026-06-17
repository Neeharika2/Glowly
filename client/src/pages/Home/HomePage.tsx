import HeroSection from '../../components/home/HeroSection';
import PopularServices from '../../components/home/PopularServices';
import FeaturedSalons from '../../components/home/FeaturedSalons';
import AIConciergeCTA from '../../components/home/AIConciergeCTA';
import Testimonials from '../../components/home/Testimonials';
import AIBeautyTip from '../../components/home/AIBeautyTip';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AIBeautyTip />
      <PopularServices />
      <FeaturedSalons />
      <AIConciergeCTA />
      <Testimonials />
    </>
  );
}
