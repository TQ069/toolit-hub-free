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
import { encryptPassword, validateUserKey } from '@/utils/encryption';
import { vaultApi } from '@/services/api/vaultApi';
import { PasswordMetadata } from '@/types/password';

interface SavePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  onSaved: () => void;
}

export function SavePasswordDialog({
  open,
  onOpenChange,
  password,
  onSaved,
}: SavePasswordDialogProps) {
  const [label, setLabel] = useState('');
  const [userKey, setUserKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    if (!label.trim()) {
      setError('Please enter a label for this password');
      return;
    }

    const keyValidation = validateUserKey(userKey);
    if (!keyValidation.valid) {
      setError(keyValidation.message || 'Invalid user key');
      return;
    }

    setLoading(true);

    try {
      const encrypted = await encryptPassword(password, userKey);

      const metadata: PasswordMetadata = {
        length: password.length,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumbers: /[0-9]/.test(password),
        hasSpecialChars: /[^A-Za-z0-9]/.test(password),
      };

      await vaultApi.savePassword({
        label: label.trim(),
        encryptedPassword: encrypted.encryptedPassword,
        salt: encrypted.salt,
        iv: encrypted.iv,
        metadata,
      });

      // Clear form
      setLabel('');
      setUserKey('');
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setLabel('');
      setUserKey('');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Password to Vault</DialogTitle>
          <DialogDescription>
            Enter a label and your personal encryption key to securely save this password.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              placeholder="e.g., Gmail Account, Work VPN"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userKey">User Encryption Key</Label>
            <Input
              id="userKey"
              type="password"
              placeholder="Enter your personal encryption key"
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              This key is used to encrypt your password. You'll need it to decrypt later.
              It's never stored on our servers.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
