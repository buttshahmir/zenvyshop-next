import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import BestSellers from '@/components/BestSellers';
import USP from '@/components/USP';
import Testimonials from '@/components/Testimonials';

export const metadata = {
  title: 'ZenvyShop.pk - Anti-Tarnish Jewellery | Home',
  description: "Pakistan's finest anti-tarnish jewellery. Shop necklaces, earrings, bracelets, and rings that last forever.",
};

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <USP />
      <BestSellers />
      <Testimonials />
    </div>
  );
}
