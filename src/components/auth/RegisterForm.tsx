import { useState } from 'react';
import { analyzePasswordStrength } from '../../utils/passwordStrength';
import { generatePassword } from '../../utils/passwordGenerator';

interface RegisterFormProps {
  onSubmit: (email: string, name: string, password: string) => void;
  onGoogleRegister: () => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export function RegisterForm({
  onSubmit,
  onGoogleRegister,
  onSwitchToLogin,
  isLoading = false,
}: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = password ? analyzePasswordStrength(password) : null;

  const handleGeneratePassword = () => {
    const newPassword = generatePassword({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
      excludeSimilar: false,
    });
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setShowPassword(true); // Show password so user can see what was generated
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (passwordStrength && passwordStrength.strength === 'weak') {
      setError('Please use a stronger password');
      return;
    }

    onSubmit(email, name, password);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-blue-500';
      case 'very-strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthBgColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-blue-500';
      case 'very-strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            disabled={isLoading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              onClick={handleGeneratePassword}
              disabled={isLoading}
              className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
            >
              <span>🔑</span>
              <span>Generate Strong Password</span>
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 pr-20 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              {showPassword ? '🙈 Hide' : '👁️ Show'}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && passwordStrength && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Strength:</span>
                <span className={`font-semibold ${getStrengthColor(passwordStrength.strength)}`}>
                  {passwordStrength.strength.toUpperCase().replace('-', ' ')}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${getStrengthBgColor(passwordStrength.strength)}`}
                  style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                />
              </div>
              {passwordStrength.feedback.length > 0 && (
                <ul className="text-xs space-y-1">
                  {passwordStrength.feedback.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-start gap-1 text-muted-foreground">
                      <span className="text-xs">
                        {item.includes('strong') || item.includes('Great') || item.includes('Excellent') 
                          ? '✅' 
                          : '💡'}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button
          onClick={onGoogleRegister}
          disabled={isLoading}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-background border border-input hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-primary hover:text-primary/80 font-medium"
          disabled={isLoading}
        >
          Login
        </button>
      </p>
    </div>
  );
}
