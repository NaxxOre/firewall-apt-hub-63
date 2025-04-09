
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <div className="bg-hacker-darkgray border border-hacker-lightgray p-4 mb-6 rounded-md font-mono">
          <div className="text-xs text-muted-foreground mb-1 text-left">// Error</div>
          <p className="text-left text-sm mb-2">
            <span className="text-red-500">ERROR:</span> Path not found
          </p>
          <p className="text-left text-sm">
            <span className="text-yellow-400">{'>'}</span> Location: {location.pathname}
          </p>
        </div>
        <p className="text-xl mb-4">The page you're looking for doesn't exist</p>
        <Link 
          to="/" 
          className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
