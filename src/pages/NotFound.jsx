import { Link } from "react-router-dom";

/**
 * 404 Not Found page - Midnight Ivory theme
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-8xl font-semibold text-primary/20">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-textDark mt-4">Page Not Found</h2>
        <p className="text-muted mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
