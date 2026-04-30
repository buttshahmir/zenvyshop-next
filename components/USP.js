'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Award } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Anti-Tarnish Guarantee',
    description: "Our proprietary coating ensures your jewellery stays radiant for years, backed by our quality promise.",
  },
  {
    icon: Truck,
    title: 'Free Nationwide Delivery',
    description: 'Enjoy complimentary shipping across Pakistan on all orders above Rs. 3,000. Tracked and insured.',
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    description: 'Not completely satisfied? Return within 7 days for a full refund, no questions asked.',
  },
  {
    icon: Award,
    title: 'Premium Craftsmanship',
    description: 'Each piece is handcrafted by skilled artisans using the finest materials and techniques.',
  },
];

export default function USP() {
  return (
    <section className="py-16 sm:py-24 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold text-sm tracking-widest uppercase mb-3">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-light text-black mb-4">
            The <span className="font-semibold">Zenvy</span> Difference
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-5 bg-black rounded-2xl flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                <feature.icon
                  size={28}
                  className="text-gold group-hover:text-black transition-colors duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
