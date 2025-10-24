import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { decryptPassword, validateUserKey } from '@/utils/encryption';
import { copyToClipboard } from '@/utils/passwordGenerator';
import { SavedPassword } from '@/types/password';

interface ViewPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedPassword: SavedPassword | null;
}

export function ViewPasswordDialog({
  open,
  onOpenChange,
  savedPassword,
}: ViewPasswordDialogProps) {
  const [userKey, setUserKey] = useState('');
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDecrypt = async () => {
    if (!savedPassword) return;

    setError('');

    const keyValidation = validateUserKey(userKey);
    if (!keyValidation.valid) {
      setError(keyValidation.message || 'Invalid user key');
      return;
    }

    setLoading(true);

    try {
      const password = await decryptPassword(
        {
          encryptedPassword: savedPassword.encryptedPassword,
          salt: savedPassword.salt,
          iv: savedPassword.iv,
        },
        userKey
      );

      setDecryptedPassword(password);
      setError('');
    } catch (err) {
      setError('Decryption failed. Invalid user key or corrupted data.');
      setDecryptedPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (decryptedPassword) {
      const success = await copyToClipboard(decryptedPassword);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      setUserKey('');
      setDecryptedPassword('');
      setError('');
      setCopied(false);
      setShowPassword(false);
      onOpenChange(false);
    }
  };

  if (!savedPassword) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Password</DialogTitle>
          <DialogDescription>
            Enter your encryption key to decrypt and view this password.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Label</Label>
            <p className="text-sm font-medium">{savedPassword.label}</p>
          </div>

          <div className="space-y-2">
            <Label>Password Details</Label>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Length: {savedPassword.metadata.length} characters</p>
              <p>
                Contains:{' '}
                {[
                  savedPassword.metadata.hasUppercase && 'Uppercase',
                  savedPassword.metadata.hasLowercase && 'Lowercase',
                  savedPassword.metadata.hasNumbers && 'Numbers',
                  savedPassword.metadata.hasSpecialChars && 'Special chars',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p>Created: {new Date(savedPassword.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {!decryptedPassword ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="userKey">User Encryption Key</Label>
                <Input
                  id="userKey"
                  type="password"
                  placeholder="Enter your encryption key"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleDecrypt()}
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="password">Decrypted Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={decryptedPassword}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? '✓' : '📋'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          {!decryptedPassword && (
            <Button onClick={handleDecrypt} disabled={loading || !userKey}>
              {loading ? 'Decrypting...' : 'Decrypt'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
