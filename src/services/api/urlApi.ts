const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ShortenUrlRequest {
  originalUrl: string;
}

export interface ShortenUrlResponse {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export interface UrlStatsResponse {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastAccessed?: string;
}

class UrlApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async shortenUrl(data: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    return this.request<ShortenUrlResponse>('/api/urls/shorten', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUrlStats(shortCode: string): Promise<UrlStatsResponse> {
    return this.request<UrlStatsResponse>(`/api/urls/stats/${shortCode}`);
  }

  async getUserUrls(): Promise<UrlStatsResponse[]> {
    return this.request<UrlStatsResponse[]>('/api/urls/my-urls');
  }

  async deleteUrl(id: string): Promise<void> {
    return this.request<void>(`/api/urls/${id}`, {
      method: 'DELETE',
    });
  }

  getShortUrl(shortCode: string): string {
    return `${API_BASE_URL}/s/${shortCode}`;
  }
}

export const urlApi = new UrlApi();
