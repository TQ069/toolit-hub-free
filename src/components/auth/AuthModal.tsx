import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuthStore } from '../../store/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  if (!isOpen) return null;

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const { authApi } = await import('../../services/api/authApi');
      const response = await authApi.login({ email, password });
      
      login({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        createdAt: new Date(response.user.createdAt),
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const { authApi } = await import('../../services/api/authApi');
      const response = await authApi.register({ email, name, password });
      
      login({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        createdAt: new Date(response.user.createdAt),
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { authApi } = await import('../../services/api/authApi');
      // Redirect to Google OAuth
      window.location.href = authApi.getGoogleAuthUrl();
    } catch (err) {
      setError('Google authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded">
            {error}
          </div>
        )}
        
        {mode === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            onGoogleLogin={handleGoogleAuth}
            onSwitchToRegister={() => setMode('register')}
            isLoading={isLoading}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onGoogleRegister={handleGoogleAuth}
            onSwitchToLogin={() => setMode('login')}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
