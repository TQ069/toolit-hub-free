import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { vaultApi } from '@/services/api/vaultApi';
import { SavedPassword } from '@/types/password';
import { ViewPasswordDialog } from './ViewPasswordDialog';

export default function PasswordVault() {
  const [passwords, setPasswords] = useState<Omit<SavedPassword, 'encryptedPassword'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPassword, setSelectedPassword] = useState<SavedPassword | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const loadPasswords = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vaultApi.listPasswords();
      setPasswords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load passwords');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: string) => {
    try {
      const password = await vaultApi.getPassword(id);
      setSelectedPassword(password);
      setViewDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load password');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this password?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await vaultApi.deletePassword(id);
      setPasswords(passwords.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete password');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Load passwords from localStorage (client-side only)
  useEffect(() => {
    loadPasswords();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Password Vault</CardTitle>
              <CardDescription className="text-sm">Your securely encrypted passwords</CardDescription>
            </div>
            <Button 
              onClick={loadPasswords} 
              variant="outline" 
              size="sm" 
              disabled={loading}
              className="touch-manipulation min-h-[44px] w-full sm:w-auto"
              aria-label={loading ? 'Refreshing passwords' : 'Refresh password list'}
            >
              {loading ? '⟳' : '🔄'} Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div 
              className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-muted-foreground" role="status" aria-live="polite">
              Loading passwords...
            </div>
          ) : passwords.length === 0 ? (
            <div className="text-center py-8" role="status">
              <p className="text-muted-foreground mb-2">No saved passwords yet</p>
              <p className="text-sm text-muted-foreground">
                Generate a password and save it to your vault to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3" role="list" aria-label="Saved passwords">
              {passwords.map((password) => (
                <div
                  key={password.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3"
                  role="listitem"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{password.label}</h3>
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <p>Length: {password.metadata.length} characters</p>
                      <p>Created: {new Date(password.createdAt).toLocaleDateString()}</p>
                      {password.lastAccessed && (
                        <p>
                          Last accessed: {new Date(password.lastAccessed).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(password.id)}
                      className="flex-1 sm:flex-none touch-manipulation min-h-[44px]"
                      aria-label={`View password for ${password.label}`}
                    >
                      👁️ View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(password.id)}
                      disabled={deleteLoading === password.id}
                      className="flex-1 sm:flex-none touch-manipulation min-h-[44px]"
                      aria-label={`Delete password for ${password.label}`}
                    >
                      {deleteLoading === password.id ? '...' : '🗑️'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ViewPasswordDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        savedPassword={selectedPassword}
      />
    </div>
  );
}
