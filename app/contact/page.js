'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram, Facebook } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+92 333 845 5459', '+92 21 3XXX XXXX'],
      action: 'tel:+923338455459',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@zenvyshop.pk', 'support@zenvyshop.pk'],
      action: 'mailto:hello@zenvyshop.pk',
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['Karachi, Pakistan', 'Nationwide Delivery'],
      action: '#',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Sat: 10AM - 8PM', 'Sunday: 12PM - 6PM'],
      action: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      {/* Header */}
      <div className="bg-black py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-light text-white mb-3"
          >
            Get in <span className="font-semibold text-gold-gradient">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            We'd love to hear from you. Reach out for inquiries, support, or just to say hello.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.a
              key={index}
              href={info.action}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
                <info.icon size={22} className="text-gold group-hover:text-black transition-colors" />
              </div>
              <h3 className="font-semibold text-black mb-2">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-500 text-sm">{detail}</p>
              ))}
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-light text-black mb-2">
              Send us a <span className="font-semibold">Message</span>
            </h2>
            <p className="text-gray-500 mb-8">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-600">Thank you for reaching out. We'll respond shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Your Name *</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg" required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email Address *</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg" required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Subject</label>
                  <select
                    name="subject" value={formData.subject} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Message *</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange}
                    rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none"
                    placeholder="How can we help you?" required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-black py-4 rounded-lg font-semibold tracking-wider hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* WhatsApp & Social */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-green-600 rounded-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={28} />
                <h3 className="text-xl font-semibold">Chat on WhatsApp</h3>
              </div>
              <p className="text-green-100 mb-6">
                Prefer instant messaging? Reach us directly on WhatsApp for quick responses and order updates.
              </p>
              <a
                href="https://wa.me/923338455459"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                <MessageCircle size={18} />
                Start Chat
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-black mb-4">Follow Us</h3>
              <p className="text-gray-500 mb-6">
                Stay updated with our latest collections, offers, and behind-the-scenes.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={22} />
                </a>
              </div>
            </div>

            <div className="bg-black rounded-xl p-8 text-white">
              <h3 className="text-lg font-semibold mb-3">Need Urgent Help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                For urgent inquiries regarding existing orders, please call us directly during business hours.
              </p>
              <a href="tel:+923338455459" className="text-gold font-semibold hover:text-gold-light transition-colors">
                +92 333 845 5459
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
