import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ============================================================
// Types
// ============================================================
export type EmailTemplateRow = {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  html_body: string;
  text_body: string | null;
  category: string;
  is_active: boolean;
  variables: string[];
  created_at: string;
  updated_at: string;
};

export type EmailLogRow = {
  id: string;
  recipient: string;
  template_key: string | null;
  subject: string | null;
  status: string;
  provider: string;
  provider_message_id: string | null;
  error_message: string | null;
  order_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type AbandonedCartRow = {
  id: string;
  email: string | null;
  customer_name: string | null;
  user_id: string | null;
  session_id: string | null;
  items: any[];
  total: number;
  status: string;
  reminders_sent: number;
  last_reminder_at: string | null;
  recovered_at: string | null;
  created_at: string;
  updated_at: string;
};

const db = supabase as any;

// ============================================================
// Templates
// ============================================================
export const useEmailTemplates = () => {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: async (): Promise<EmailTemplateRow[]> => {
      const { data, error } = await db.from('email_templates').select('*').order('category').order('name');
      if (error) throw error;
      return (data || []) as EmailTemplateRow[];
    },
  });
};

export const useUpdateEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<EmailTemplateRow> & { id: string }) => {
      const { error } = await db.from('email_templates').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['email-templates'] }),
  });
};

// ============================================================
// Logs (analytics / history)
// ============================================================
export const useEmailLogs = (limit = 200) => {
  return useQuery({
    queryKey: ['email-logs', limit],
    queryFn: async (): Promise<EmailLogRow[]> => {
      const { data, error } = await db
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []) as EmailLogRow[];
    },
  });
};

// ============================================================
// Abandoned carts
// ============================================================
export const useAbandonedCarts = () => {
  return useQuery({
    queryKey: ['abandoned-carts'],
    queryFn: async (): Promise<AbandonedCartRow[]> => {
      const { data, error } = await db.from('abandoned_carts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as AbandonedCartRow[];
    },
  });
};

// ============================================================
// Send a test email via the email edge function (sandbox until a domain is verified)
// ============================================================
export const useSendTestEmail = () => {
  return useMutation({
    mutationFn: async ({ to, template_key }: { to: string; template_key: string }) => {
      const { data, error } = await supabase.functions.invoke('send-transactional-email', {
        body: { to, template_key, test: true },
      });
      if (error) throw error;
      return data;
    },
  });
};