export type WebhookEvent = 
  | 'campaign.created'
  | 'campaign.updated'
  | 'campaign.deleted'
  | 'metric.updated'
  | 'meeting.created'
  | 'meeting.updated'
  | 'meeting.deleted'
  | 'client.created'
  | 'client.updated'
  | 'test.webhook';

export interface Webhook {
  id: string;
  user_id: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  is_active: boolean;
  retry_count: number;
  timeout_ms: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: any;
  status: 'success' | 'failed' | 'retrying';
  response_code?: number;
  response_body?: string;
  error_message?: string;
  attempt_number: number;
  created_at: string;
}

export interface WebhookFormData {
  name: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  retry_count: number;
  timeout_ms: number;
}
