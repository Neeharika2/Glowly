import HeroSection from '../../components/home/HeroSection';
import BeautyQuote from '../../components/home/BeautyQuote';
import PopularServices from '../../components/home/PopularServices';
import FeaturedSalons from '../../components/home/FeaturedSalons';
import AIConciergeCTA from '../../components/home/AIConciergeCTA';
import Testimonials from '../../components/home/Testimonials';
import AIBeautyTip from '../../components/home/AIBeautyTip';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BeautyQuote />
      <PopularServices />
      <FeaturedSalons />
      <AIBeautyTip />
      <AIConciergeCTA />
      <Testimonials />
    </>
  );
}
