import type { POSTRequest, POSTStats, ClassificationStats } from '@/types/incidents';

export class POSTMonitorAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://127.0.0.1:8000') {
    this.baseURL = baseURL;
  }

  async getStats(): Promise<POSTStats> {
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
      console.error('Error fetching POST monitor stats:', error);
      throw error;
    }
  }

  async getRequests(limit?: number, offset?: number): Promise<POSTRequest[]> {
    try {
      let url = `${this.baseURL}/api/blocked-requests`;
      const params = new URLSearchParams();

      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
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
      console.error('Error fetching POST requests:', error);
      throw error;
    }
  }

  async deleteRequest(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/blocked-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting POST request ${id}:`, error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/blocked-requests`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error clearing all POST requests:', error);
      throw error;
    }
  }

  async getHumanRequests(limit: number = 100, offset: number = 0): Promise<POSTRequest[]> {
    try {
      const url = `${this.baseURL}/api/blocked-requests/human?limit=${limit}&skip=${offset}`;
      const response = await fetch(url, {
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
      console.error('Error fetching human requests:', error);
      throw error;
    }
  }

  async getBotRequests(limit: number = 100, offset: number = 0): Promise<POSTRequest[]> {
    try {
      const url = `${this.baseURL}/api/blocked-requests/bot?limit=${limit}&skip=${offset}`;
      const response = await fetch(url, {
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
      console.error('Error fetching bot requests:', error);
      throw error;
    }
  }

  async getClassificationStats(): Promise<ClassificationStats> {
    try {
      const response = await fetch(`${this.baseURL}/api/stats/classification`, {
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
      console.error('Error fetching classification stats:', error);
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
export const postMonitorAPI = new POSTMonitorAPI(
  process.env.NEXT_PUBLIC_POST_MONITOR_API || 'http://127.0.0.1:8000'
);
