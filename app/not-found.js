import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center pt-20">
      <div className="text-center px-4">
        <p className="text-gold text-sm tracking-widest uppercase mb-4">404 — Page Not Found</p>
        <h1 className="text-5xl sm:text-7xl font-light text-black mb-4">Oops.</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It may have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold text-black px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
