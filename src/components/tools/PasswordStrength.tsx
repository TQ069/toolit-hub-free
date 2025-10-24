import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { analyzePasswordStrength } from '@/utils/passwordStrength';

export default function PasswordStrength() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const strength = password ? analyzePasswordStrength(password) : null;

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
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Password Strength Checker</CardTitle>
          <CardDescription>Analyze the strength and security of your passwords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password-input">Enter Password</Label>
            <div className="relative">
              <Input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type a password to check its strength"
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>

          {/* Strength Analysis */}
          {strength && (
            <div className="space-y-4">
              {/* Strength Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Strength:</span>
                  <span className={`text-sm font-bold ${getStrengthColor(strength.strength)}`}>
                    {strength.strength.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getStrengthBgColor(strength.strength)}`}
                    style={{ width: `${(strength.score / 7) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Entropy</p>
                  <p className="text-lg font-semibold">{strength.entropy.toFixed(1)} bits</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Crack Time</p>
                  <p className="text-lg font-semibold">{strength.crackTime}</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label>Analysis & Recommendations</Label>
                <ul className="space-y-2">
                  {strength.feedback.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-lg">
                        {item.includes('strong') || item.includes('Great') || item.includes('Excellent') 
                          ? '✅' 
                          : '⚠️'}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Character Composition */}
              <div className="space-y-2">
                <Label>Character Composition</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{/[A-Z]/.test(password) ? '✅' : '❌'}</span>
                    <span>Uppercase Letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{/[a-z]/.test(password) ? '✅' : '❌'}</span>
                    <span>Lowercase Letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{/[0-9]/.test(password) ? '✅' : '❌'}</span>
                    <span>Numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{/[^A-Za-z0-9]/.test(password) ? '✅' : '❌'}</span>
                    <span>Special Characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{password.length >= 12 ? '✅' : '❌'}</span>
                    <span>12+ Characters</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!password && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Enter a password above to see its strength analysis</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
