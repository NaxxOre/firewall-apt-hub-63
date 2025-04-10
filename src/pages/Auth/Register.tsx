import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import RegistrationAnimation from '@/components/animations/RegistrationAnimation';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // First, create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData?.user) {
        // Profile creation should happen automatically via the database trigger now
        // We just need to update local store for immediate UI feedback
        register(username, email, password);
        
        setShowAnimation(true);
        toast.success('Registration successful! Waiting for admin approval');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  if (showAnimation) {
    return <RegistrationAnimation />;
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-card p-6 rounded-lg border border-border shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Join f!R3wA11Apt community today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Choose a username"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Create a password (min 8 characters)"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Confirm your password"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Note: After registration, your account will need approval from an admin before you can login.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
