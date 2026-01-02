import type { POSTRequest, POSTStats, ClassificationStats } from '@/types/incidents';

export class POSTMonitorAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://127.0.0.1:8000') {
    this.baseURL = baseURL;
  }

  async getStats(): Promise<POSTStats> {
    // Return dummy data for testing
    return {
      total_requests: 1234,
      today_requests: 56,
      blocked_domains: [
        { hostname: 'malicious-site.com', count: 45 },
        { hostname: 'tracker.ads.com', count: 32 },
        { hostname: 'data-collector.io', count: 28 },
        { hostname: 'analytics-evil.net', count: 15 },
        { hostname: 'suspicious.xyz', count: 12 }
      ],
      recent_activity: [
        { date: '2025-12-26', count: 56 },
        { date: '2025-12-25', count: 78 },
        { date: '2025-12-24', count: 92 },
        { date: '2025-12-23', count: 64 },
        { date: '2025-12-22', count: 45 }
      ]
    };
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
    // Return dummy data for testing
    return [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        target_url: 'https://malicious-site.com/collect',
        target_hostname: 'malicious-site.com',
        source_url: 'https://example.com/page1',
        matched_fields: ['email', 'password'],
        matched_values: { 'email': 'test@example.com', 'password': '***' } as Record<string, string>,
        request_method: 'POST',
        status: 'blocked',
        is_bot: false,
        has_click_correlation: true,
        click_correlation_id: 101,
        click_time_diff_ms: 250
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        target_url: 'https://tracker.ads.com/track',
        target_hostname: 'tracker.ads.com',
        source_url: 'https://example.com/page2',
        matched_fields: ['user_id'],
        matched_values: { 'user_id': '12345' } as Record<string, string>,
        request_method: 'POST',
        status: 'blocked',
        is_bot: false,
        has_click_correlation: true,
        click_correlation_id: 102,
        click_time_diff_ms: 180
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        target_url: 'https://data-collector.io/api/send',
        target_hostname: 'data-collector.io',
        source_url: 'https://example.com/page3',
        matched_fields: ['session_id', 'token'],
        matched_values: { 'session_id': 'abc123', 'token': 'xyz789' } as Record<string, string>,
        request_method: 'POST',
        status: 'blocked',
        is_bot: false,
        has_click_correlation: true,
        click_correlation_id: 103,
        click_time_diff_ms: 320
      }
    ].slice(offset, offset + limit);
  }

  async getHumanBackgroundRequests(limit: number = 100, offset: number = 0): Promise<POSTRequest[]> {
    // Return dummy data for testing
    return [
      {
        id: 4,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        target_url: 'https://background-tracker.com/ping',
        target_hostname: 'background-tracker.com',
        source_url: 'https://example.com/page4',
        matched_fields: ['session'],
        matched_values: { 'session': 'background123' } as Record<string, string>,
        request_method: 'POST',
        status: 'blocked',
        is_bot: false,
        has_click_correlation: false
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        target_url: 'https://analytics-bg.com/event',
        target_hostname: 'analytics-bg.com',
        source_url: 'https://example.com/page5',
        matched_fields: ['event'],
        matched_values: { 'event': 'idle' } as Record<string, string>,
        request_method: 'POST',
        status: 'blocked',
        is_bot: false,
        has_click_correlation: false
      }
    ].slice(offset, offset + limit);
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
    // Return true for dummy data testing
    return true;
  }
}

// Export singleton instance
export const postMonitorAPI = new POSTMonitorAPI(
  process.env.NEXT_PUBLIC_POST_MONITOR_API || 'http://127.0.0.1:8000'
);
