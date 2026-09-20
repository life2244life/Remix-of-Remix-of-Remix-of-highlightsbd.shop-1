import { supabase } from '@/integrations/supabase/client';

export async function callApi(endpoint: string, body: any) {
  const { data, error } = await supabase.functions.invoke(endpoint, {
    body,
  });

  if (error) {
    throw new Error(error.message || `API call failed`);
  }

  return data;
}

export async function callCourier(provider: 'steadfast' | 'pathao', action: string, data?: any) {
  const endpoint = provider === 'steadfast' ? 'steadfast-courier' : 'pathao-courier';
  return callApi(endpoint, { action, data });
}

export async function sendOrderEmail(body: any) {
  return callApi('send-order-email', body);
}

// Fire-and-forget transactional email via the unified dispatcher.
// type: 'order_confirmation' | 'payment_success' | 'payment_failed' | 'shipping_notification'
export async function sendTransactionalEmail(
  type: 'order_confirmation' | 'payment_success' | 'payment_failed' | 'shipping_notification',
  orderId: string,
) {
  try {
    await callApi('send-email', { type, order_id: orderId });
  } catch {
    // Non-blocking: email failures must never interrupt the user flow.
  }
}

export async function callMetaCapi(action: string, data?: any) {
  return callApi('meta-capi', { action, data });
}

// Server-side analytics ingestion (GA4 Measurement Protocol, Meta CAPI, TikTok Events API).
// Fire-and-forget: tracking must never block UX.
export async function ingestAnalyticsEvents(payload: {
  environment?: string;
  events: Array<{
    provider: 'ga4' | 'meta' | 'tiktok';
    event_name: string;
    event_id: string;
    value?: number;
    currency?: string;
    order_id?: string;
    user_data?: Record<string, any>;
    custom_data?: Record<string, any>;
    event_source_url?: string;
    fbp?: string;
    fbc?: string;
    ttclid?: string;
    client_id?: string;
  }>;
}) {
  try {
    return await callApi('analytics-ingest', payload);
  } catch {
    return null;
  }
}

// Server-side Facebook CAPI for order status events.
// Status: 'Cancelled' | 'Returned' | 'ReturnCancel' | 'Delivered'
export async function trackOrderToMetaCapi(order: {
  order_id: string;
  status: string;
  value?: number;
  currency?: string;
  payment_method?: string;
  delivery_method?: string;
  customer: {
    name?: string;
    email?: string | null;
    phone?: string;
    city?: string;
    country?: string;
    postal_code?: string;
  };
  items?: Array<{ product_id?: string; id?: string; price?: number; quantity?: number }>;
  fbp?: string;
  fbc?: string;
}) {
  return callApi('meta-capi', { action: 'track_order', data: order });
}
