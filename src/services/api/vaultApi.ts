import { SavePasswordRequest, SavedPassword } from '@/types/password';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const vaultApi = {
  async savePassword(data: SavePasswordRequest): Promise<SavedPassword> {
    const response = await fetch(`${API_URL}/api/vault/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save password');
    }

    return response.json();
  },

  async listPasswords(): Promise<Omit<SavedPassword, 'encryptedPassword'>[]> {
    const response = await fetch(`${API_URL}/api/vault/list`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch passwords');
    }

    return response.json();
  },

  async getPassword(id: string): Promise<SavedPassword> {
    const response = await fetch(`${API_URL}/api/vault/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch password');
    }

    return response.json();
  },

  async deletePassword(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/vault/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete password');
    }
  },
};
