import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { generatePassword, copyToClipboard } from '@/utils/passwordGenerator';
import { analyzePasswordStrength } from '@/utils/passwordStrength';
import { PasswordConfig } from '@/types';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<PasswordConfig>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
    excludeSimilar: false,
  });

  const strength = password ? analyzePasswordStrength(password) : null;

  // Generate initial password on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  // Auto-regenerate password when config changes
  useEffect(() => {
    if (password) {
      handleGenerate();
    }
  }, [config]);

  const handleGenerate = () => {
    const newPassword = generatePassword(config);
    setPassword(newPassword);
    setCopied(false);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const updateConfig = (key: keyof PasswordConfig, value: boolean | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
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
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Password Generator</CardTitle>
          <CardDescription className="text-sm">Generate secure random passwords with customizable options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Generated Password Display */}
          <div className="space-y-2">
            <Label htmlFor="password">Generated Password</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="password"
                value={password}
                readOnly
                className="font-mono text-sm sm:text-lg break-all"
                placeholder="Click generate to create a password"
                aria-label="Generated password"
              />
              <Button 
                onClick={handleCopy} 
                variant="outline" 
                className="shrink-0 w-full sm:w-auto touch-manipulation min-h-[44px]"
                aria-label={copied ? 'Password copied' : 'Copy password to clipboard'}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </Button>
            </div>
          </div>

          {/* Strength Indicator */}
          {strength && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Strength:</span>
                <span className={`text-sm font-bold ${getStrengthColor(strength.strength)}`}>
                  {strength.strength.toUpperCase().replace('-', ' ')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getStrengthBgColor(strength.strength)}`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Entropy: {strength.entropy.toFixed(1)} bits</p>
                <p>Estimated crack time: {strength.crackTime}</p>
              </div>
            </div>
          )}

          {/* Length Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="length">Password Length</Label>
              <span className="text-sm font-medium">{config.length}</span>
            </div>
            <Slider
              id="length"
              min={4}
              max={128}
              value={config.length}
              onValueChange={(value) => updateConfig('length', value)}
            />
          </div>

          {/* Character Options */}
          <div className="space-y-3">
            <Label>Character Types</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={config.includeUppercase}
                  onChange={(e) => updateConfig('includeUppercase', e.target.checked)}
                />
                <Label htmlFor="uppercase" className="cursor-pointer">
                  Uppercase Letters (A-Z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={config.includeLowercase}
                  onChange={(e) => updateConfig('includeLowercase', e.target.checked)}
                />
                <Label htmlFor="lowercase" className="cursor-pointer">
                  Lowercase Letters (a-z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={config.includeNumbers}
                  onChange={(e) => updateConfig('includeNumbers', e.target.checked)}
                />
                <Label htmlFor="numbers" className="cursor-pointer">
                  Numbers (0-9)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="special"
                  checked={config.includeSpecialChars}
                  onChange={(e) => updateConfig('includeSpecialChars', e.target.checked)}
                />
                <Label htmlFor="special" className="cursor-pointer">
                  Special Characters (!@#$%^&*)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exclude-similar"
                  checked={config.excludeSimilar}
                  onChange={(e) => updateConfig('excludeSimilar', e.target.checked)}
                />
                <Label htmlFor="exclude-similar" className="cursor-pointer">
                  Exclude Similar Characters (i, l, 1, L, o, 0, O)
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleGenerate} 
              className="w-full touch-manipulation min-h-[44px]"
              aria-label="Generate new password"
            >
              🔄 Generate New Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
