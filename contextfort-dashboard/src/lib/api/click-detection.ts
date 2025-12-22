import type { ClickEvent, ClickStats } from '@/types/incidents';

export class ClickDetectionAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:9999') {
    this.baseURL = baseURL;
  }

  async getStats(): Promise<ClickStats> {
    try {
      const response = await fetch(`${this.baseURL}/api/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching click detection stats:', error);
      throw error;
    }
  }

  async getRecent(limit: number = 50): Promise<ClickEvent[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/recent?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recent clicks:', error);
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const clickDetectionAPI = new ClickDetectionAPI(
  process.env.NEXT_PUBLIC_CLICK_DETECTION_API || 'http://localhost:9999'
);
