// TypeScript types for ContextFort Incident Dashboard

export interface POSTRequest {
  id: number;
  timestamp: string;
  target_url: string;
  target_hostname: string;
  source_url: string;
  matched_fields: string[];
  matched_values: Record<string, string>;
  request_method: string;
  status: string;

  // Human/Bot Classification Fields
  is_bot?: boolean;
  click_correlation_id?: number;
  click_time_diff_ms?: number;
  click_coordinates?: { x: number; y: number };
  has_click_correlation: boolean;
}

export interface ClickEvent {
  id: number;
  timestamp: number;
  x: number;
  y: number;
  is_suspicious: boolean;
  confidence?: number;
  reason?: string;
  action_type?: string;
  action_details?: string;
  page_url?: string;
  page_title?: string;
  target_tag?: string;
  target_id?: string;
  target_class?: string;
  is_trusted?: boolean;
  created_at: string;
}

export interface POSTStats {
  total_requests: number;
  today_requests: number;
  blocked_domains: Array<{
    hostname: string;
    count: number;
  }>;
  recent_activity: Array<{
    date: string;
    count: number;
  }>;
}

export interface ClickStats {
  total_clicks: number;
  suspicious_clicks: number;
  legitimate_clicks: number;
  unique_pages: number;
  total_os_clicks: number;
}

export interface CombinedStats {
  post: POSTStats;
  click: ClickStats;
}

export interface ClassificationStats {
  total_requests: number;
  human_requests: number;
  bot_requests: number;
  uncorrelated_requests: number;
  correlation_rate: number;
}

export type IncidentType = 'post' | 'click';

export interface CombinedIncident {
  id: string;
  type: IncidentType;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  metadata: POSTRequest | ClickEvent;
}
