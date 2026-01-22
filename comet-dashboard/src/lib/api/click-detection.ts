import type { ClickEvent, ClickStats } from '@/types/incidents';

export class ClickDetectionAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  async getStats(): Promise<ClickStats> {
    // Return dummy data for testing
    return {
      total_clicks: 1025,
      suspicious_clicks: 874,
      legitimate_clicks: 151,
      total_os_clicks: 0,
      unique_pages: 152
    };
  }

  async getRecent(limit: number = 50): Promise<ClickEvent[]> {
    // Return dummy data for testing
    return [
      {
        id: 1,
        timestamp: Date.now() / 1000,
        x: 450,
        y: 250,
        is_suspicious: true,
        confidence: 0.92,
        reason: 'Rapid automated clicks detected',
        action_type: 'click',
        action_details: '{}',
        page_url: 'https://example.com/page1',
        page_title: 'Example Page',
        target_tag: 'BUTTON',
        target_id: 'submit-btn',
        target_class: 'btn-primary',
        is_trusted: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        timestamp: Date.now() / 1000 - 60,
        x: 320,
        y: 180,
        is_suspicious: false,
        confidence: 0.15,
        reason: 'Natural click pattern',
        action_type: 'click',
        action_details: '{}',
        page_url: 'https://example.com/page2',
        page_title: 'Another Page',
        target_tag: 'A',
        target_id: 'link',
        target_class: 'nav-link',
        is_trusted: true,
        created_at: new Date(Date.now() - 60000).toISOString()
      }
    ].slice(0, limit);
  }

  async checkConnection(): Promise<boolean> {
    // Return true for dummy data testing
    return true;
  }
}

// Export singleton instance (now using unified backend on port 8000)
export const clickDetectionAPI = new ClickDetectionAPI(
  process.env.NEXT_PUBLIC_CLICK_DETECTION_API || 'http://localhost:8000'
);
