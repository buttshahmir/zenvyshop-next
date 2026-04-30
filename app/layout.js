import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ZenvyShop.pk - Anti-Tarnish Jewellery',
  description: "Pakistan's finest anti-tarnish jewellery. Crafted with precision, designed for the modern woman who deserves timeless beauty.",
  keywords: 'anti-tarnish jewellery, gold jewellery Pakistan, waterproof jewellery, ZenvyShop',
  openGraph: {
    title: 'ZenvyShop.pk - Anti-Tarnish Jewellery',
    description: "Pakistan's finest anti-tarnish jewellery collection.",
    url: 'https://zenvyshop.pk',
    siteName: 'ZenvyShop',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-offwhite">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
