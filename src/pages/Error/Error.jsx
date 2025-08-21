import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <h1 className="text-9xl font-extrabold text-primary tracking-widest">
        404
      </h1>
      <p className="text-2xl md:text-3xl font-semibold text-foreground mt-4">
        Oops! Page not found
      </p>
      <p className="text-text-secondary mt-2 text-center max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
        Don’t worry, you can always head back home.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-hover transition"
        >
          Go Home
        </Link>
        <Link
          to="/menu"
          className="bg-secondary text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary-hover transition"
        >
          Explore Menu
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
