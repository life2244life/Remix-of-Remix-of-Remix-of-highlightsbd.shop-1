// Single dataLayer push per event. Same event carries data for both GA4 and Meta Pixel.
// Server-side: ALSO fires Meta CAPI through the meta-capi edge function with the SAME event_id for dedup.

import { callMetaCapi } from '@/lib/api';
import { trackTikTok } from '@/lib/tiktok';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

const CURRENCY = 'BDT';

function dl(obj: Record<string, any>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(obj);
}

function eventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

function commonFields() {
  return {
    event_id: eventId(),
    event_time: Math.floor(Date.now() / 1000),
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_referrer: typeof document !== 'undefined' ? document.referrer : '',
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    currency: CURRENCY,
  };
}

function normalizeItem(it: any) {
  const p = it?.product || it || {};
  const id = String(p.id ?? it?.product_id ?? it?.id ?? '');
  const name = p.name ?? it?.name ?? '';
  const category = p.category ?? it?.category ?? '';
  const price = Number(p.price ?? it?.price ?? 0);
  const quantity = Number(it?.quantity ?? 1);
  return {
    item_id: id,
    item_name: name,
    item_category: category,
    item_brand: p.brand ?? '',
    item_variant: [it?.size, it?.color].filter(Boolean).join(' / '),
    price,
    quantity,
    id,
    title: name,
  };
}

function metaContents(items: any[]) {
  return items.map(i => ({ id: i.item_id, quantity: i.quantity, item_price: i.price }));
}

// Fire-and-forget CAPI send. Errors are swallowed so tracking never breaks UX.
function sendCapi(eventName: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase', payload: {
  event_id: string;
  event_time: number;
  fbp?: string;
  fbc?: string;
  user_data?: Record<string, any>;
  custom_data: Record<string, any>;
}) {
  try {
    callMetaCapi('track_client_event', {
      event_name: eventName,
      event_id: payload.event_id,
      event_time: payload.event_time,
      event_source_url: typeof window !== 'undefined' ? window.location.href : '',
      fbp: payload.fbp,
      fbc: payload.fbc,
      user_data: payload.user_data || {},
      custom_data: payload.custom_data,
    }).catch(() => {});
  } catch {
    /* noop */
  }
}

// ---------------- Events ----------------

export function pushPageView() {
  dl({
    event: 'page_view',
    ...commonFields(),
    value: 0.01,
    currency: CURRENCY,
  });
}

export function pushViewItem(product: any) {
  const item = normalizeItem({ product, quantity: 1 });
  const value = item.price;
  const c = commonFields();
  dl({
    event: 'view_item',
    ...c,
    ecommerce: {
      currency: CURRENCY,
      value,
      content_ids: [item.item_id],
      content_name: item.item_name,
      content_category: item.item_category,
      content_type: 'product',
      contents: metaContents([item]),
      num_items: 1,
      items: [item],
    },
  });
  sendCapi('ViewContent', {
    event_id: c.event_id,
    event_time: c.event_time,
    fbp: c.fbp,
    fbc: c.fbc,
    custom_data: {
      currency: CURRENCY,
      value,
      content_ids: [item.item_id],
      content_name: [item].map(i => i.item_name).join(', '),
      content_category: item.item_category,
      content_type: 'product',
      contents: metaContents([item]),
      num_items: 1,
    },
  });
  trackTikTok('ViewContent', { content_id: item.item_id, content_type: 'product', value, currency: CURRENCY }, c.event_id);
}

export function pushAddToCart(product: any, quantity: number, size?: string, color?: string) {
  const item = normalizeItem({ product, quantity, size, color });
  const value = item.price * item.quantity;
  const c = commonFields();
  dl({
    event: 'add_to_cart',
    ...c,
    ecommerce: {
      currency: CURRENCY,
      value,
      content_ids: [item.item_id],
      content_name: [item].map(i => i.item_name).join(', '),
      content_category: item.item_category,
      content_type: 'product',
      contents: metaContents([item]),
      num_items: item.quantity,
      items: [item],
    },
  });
  sendCapi('AddToCart', {
    event_id: c.event_id,
    event_time: c.event_time,
    fbp: c.fbp,
    fbc: c.fbc,
    custom_data: {
      currency: CURRENCY,
      value,
      content_ids: [item.item_id],
      content_name: [item].map(i => i.item_name).join(', '),
      content_category: item.item_category,
      content_type: 'product',
      contents: metaContents([item]),
      num_items: item.quantity,
    },
  });
  trackTikTok('AddToCart', { content_id: item.item_id, content_type: 'product', quantity: item.quantity, value, currency: CURRENCY }, c.event_id);
}

export function pushBeginCheckout(cartItems: any[], total: number) {
  const items = cartItems.map(normalizeItem);
  const c = commonFields();
  dl({
    event: 'begin_checkout',
    ...c,
    ecommerce: {
      currency: CURRENCY,
      value: total,
      content_ids: items.map(i => i.item_id),
      content_name: items.map(i => i.item_name).join(', '),
      content_category: items[0]?.item_category || '',
      content_type: 'product',
      contents: metaContents(items),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
      items,
    },
  });
  sendCapi('InitiateCheckout', {
    event_id: c.event_id,
    event_time: c.event_time,
    fbp: c.fbp,
    fbc: c.fbc,
    custom_data: {
      currency: CURRENCY,
      value: total,
      content_ids: items.map(i => i.item_id),
      content_name: items.map(i => i.item_name).join(', '),
      content_category: items[0]?.item_category || '',
      content_type: 'product',
      contents: metaContents(items),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
    },
  });
  trackTikTok('InitiateCheckout', { contents: items.map(i => ({ content_id: i.item_id, quantity: i.quantity, price: i.price })), value: total, currency: CURRENCY }, c.event_id);
}

export type PurchasePayload = {
  order_id: string;
  total: number;
  subtotal?: number;
  delivery_charge?: number;
  discount?: number;
  coupon?: string;
  items: any[];
  customer: {
    name: string;
    email?: string | null;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  payment_method?: string;
  delivery_method?: string;
};

export function pushPurchase(p: PurchasePayload) {
  const items = p.items.map(normalizeItem);
  const [firstName, ...rest] = (p.customer.name || '').trim().split(' ');
  const c = commonFields();
  const user_data = {
    email_address: p.customer.email || '',
    phone_number: p.customer.phone || '',
    first_name: firstName || '',
    last_name: rest.join(' ') || '',
    country: p.customer.country || 'BD',
    city: p.customer.city || '',
    postal_code: p.customer.postal_code || '',
    coupon: p.coupon || '',
  };
  dl({
    event: 'purchase',
    ...c,
    ecommerce: {
      transaction_id: p.order_id,
      currency: CURRENCY,
      value: p.total,
      tax: 0,
      shipping: p.delivery_charge || 0,
      coupon: p.coupon || '',
      content_ids: items.map(i => i.item_id),
      content_name: items.map(i => i.item_name).join(', '),
      content_category: items[0]?.item_category || '',
      content_type: 'product',
      contents: metaContents(items),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
      items,
    },
    user_data,
    payment_method: p.payment_method || '',
    delivery_method: p.delivery_method || '',
  });
  sendCapi('Purchase', {
    event_id: c.event_id,
    event_time: c.event_time,
    fbp: c.fbp,
    fbc: c.fbc,
    user_data,
    custom_data: {
      currency: CURRENCY,
      value: p.total,
      order_id: p.order_id,
      content_ids: items.map(i => i.item_id),
      content_name: items.map(i => i.item_name).join(', '),
      content_category: items[0]?.item_category || '',
      content_type: 'product',
      contents: metaContents(items),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
      payment_method: p.payment_method || '',
      delivery_method: p.delivery_method || '',
    },
  });
  trackTikTok('CompletePayment', { contents: items.map(i => ({ content_id: i.item_id, quantity: i.quantity, price: i.price })), value: p.total, currency: CURRENCY }, c.event_id);
}

export type OrderEventPayload = {
  order_id: string;
  total?: number;
  items?: any[];
  customer_name?: string;
  customer_email?: string | null;
  customer_phone?: string;
  customer_city?: string;
  [key: string]: any;
};

export function fireOrderEvent(eventName: string, order: OrderEventPayload) {
  const rawItems = Array.isArray(order.items) ? order.items : [];
  const items = rawItems.map(normalizeItem);
  const value = Number(order.total ?? 0);
  const c = commonFields();

  const [firstName, ...rest] = (order.customer_name || '').trim().split(' ');
  const customer = {
    name: order.customer_name || '',
    first_name: firstName || '',
    last_name: rest.join(' ') || '',
    email: order.customer_email || '',
    phone: order.customer_phone || '',
    address: order.customer_address || '',
    city: order.customer_city || '',
    country: 'BD',
  };
  const user_data = {
    email_address: customer.email,
    phone_number: customer.phone,
    first_name: customer.first_name,
    last_name: customer.last_name,
    country: customer.country,
    city: customer.city,
    address: customer.address,
  };

  dl({
    event: eventName,
    ...c,
    ...order,
    ecommerce: {
      transaction_id: order.order_id,
      currency: CURRENCY,
      value,
      content_ids: items.map(i => i.item_id),
      content_name: items.map(i => i.item_name).join(', '),
      content_category: items[0]?.item_category || '',
      content_type: 'product',
      contents: metaContents(items),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
      items,
    },
    customer,
    user_data,
  });
}

// ---------------- Additional GA4 ecommerce events (+ TikTok forwarding) ----------------

export function pushViewItemList(products: any[], listName = '', listId = '') {
  const items = products.map((p, i) => ({ ...normalizeItem({ product: p, quantity: 1 }), index: i }));
  dl({
    event: 'view_item_list',
    ...commonFields(),
    ecommerce: {
      item_list_name: listName,
      item_list_id: listId,
      currency: CURRENCY,
      items,
    },
  });
}

export function pushSearch(searchTerm: string, resultCount?: number) {
  const c = commonFields();
  dl({ event: 'search', ...c, search_term: searchTerm, results_count: resultCount ?? 0 });
  trackTikTok('Search', { query: searchTerm }, c.event_id);
}

export function pushRemoveFromCart(product: any, quantity: number, size?: string, color?: string) {
  const item = normalizeItem({ product, quantity, size, color });
  dl({
    event: 'remove_from_cart',
    ...commonFields(),
    ecommerce: { currency: CURRENCY, value: item.price * item.quantity, items: [item] },
  });
}

export function pushViewCart(cartItems: any[], total: number) {
  const items = cartItems.map(normalizeItem);
  dl({
    event: 'view_cart',
    ...commonFields(),
    ecommerce: { currency: CURRENCY, value: total, items },
  });
}

export function pushAddShippingInfo(cartItems: any[], total: number, shippingTier = '') {
  const items = cartItems.map(normalizeItem);
  dl({
    event: 'add_shipping_info',
    ...commonFields(),
    ecommerce: { currency: CURRENCY, value: total, shipping_tier: shippingTier, items },
  });
}

export function pushAddPaymentInfo(cartItems: any[], total: number, paymentType = '') {
  const items = cartItems.map(normalizeItem);
  const c = commonFields();
  dl({
    event: 'add_payment_info',
    ...c,
    ecommerce: { currency: CURRENCY, value: total, payment_type: paymentType, items },
  });
  trackTikTok('AddPaymentInfo', { value: total, currency: CURRENCY }, c.event_id);
}

export function pushRefund(orderId: string, value: number, items?: any[]) {
  const norm = Array.isArray(items) ? items.map(normalizeItem) : [];
  dl({
    event: 'refund',
    ...commonFields(),
    ecommerce: { transaction_id: orderId, currency: CURRENCY, value, items: norm },
  });
}
