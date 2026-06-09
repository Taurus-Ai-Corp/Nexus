import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = '1086002727074-aacl72grlcpe1m3ck0ooct99k9v6b7g7.apps.googleusercontent.com';

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Check if Google library is loaded
      if (typeof window.google === 'undefined' || !window.google?.accounts?.id) {
        setError('Google OAuth service is temporarily unavailable. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Initialize Google OAuth
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          try {
            // Decode the JWT token to get user info
            const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));
            
            console.log('Google login successful:', {
              email: responsePayload.email,
              name: responsePayload.name,
              picture: responsePayload.picture
            });

            // Handle successful login
            setIsLoading(false);
            onClose();
            
            // In real implementation, you would:
            // 1. Send the credential to your backend
            // 2. Verify the token
            // 3. Create/update user session
            // 4. Redirect to dashboard
            
          } catch (err) {
            console.error('Error processing Google login:', err);
            setError('Failed to process Google login. Please try again.');
            setIsLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: false
      });

      // Prompt the user to select an account
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // User dismissed the popup or it didn't show
          setError('Google login was cancelled. Please try again.');
          setIsLoading(false);
        }
      });

    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful login
      console.log('Login successful:', formData);
      onClose();
      // In real implementation, handle authentication here
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-dgsm-secondary rounded-xl shadow-2xl w-full max-w-md border border-dgsm-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dgsm-border">
          <h2 className="text-2xl font-bold text-dgsm-text-primary">Welcome Back</h2>
          <button
            onClick={onClose}
            className="text-dgsm-text-muted hover:text-dgsm-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dgsm-primary border border-dgsm-border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dgsm-text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dgsm-primary border border-dgsm-border rounded-lg text-dgsm-text-primary placeholder-dgsm-text-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-500 bg-dgsm-primary border-dgsm-border rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-dgsm-text-secondary">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dgsm-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dgsm-secondary text-dgsm-text-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-3 px-4 border border-dgsm-border rounded-lg bg-dgsm-primary hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2 text-dgsm-text-primary text-sm font-medium">
                  {isLoading ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>
            </div>
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 text-center">
            <p className="text-dgsm-text-secondary">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
              >
                Start your free trial
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
