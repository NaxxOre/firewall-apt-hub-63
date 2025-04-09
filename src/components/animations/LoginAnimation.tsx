
import React from 'react';

const LoginAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-20 h-20 relative mb-4">
        <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-loading-spinner"></div>
      </div>
      <div className="flex flex-col items-center space-y-2 animate-fade-in">
        <h3 className="text-xl font-bold">Login Successful</h3>
        <p className="text-muted-foreground">Welcome back to f!R3wA11Apt</p>
        <div className="mt-2 flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-hacker-green animate-pulse"></div>
          <p className="text-sm text-hacker-green">Access granted</p>
        </div>
      </div>
    </div>
  );
};

export default LoginAnimation;
