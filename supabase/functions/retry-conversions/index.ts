import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_ATTEMPTS = 5;

// Background job: retry failed server-side conversion events; dead-letter after MAX_ATTEMPTS.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const url = Deno.env.get('SUPABASE_URL')!;
  const supabase = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // 1. Dead-letter: anything that exhausted retries.
  const { data: dead } = await supabase.from('conversion_events')
    .update({ status: 'dead' })
    .eq('status', 'failed').gte('attempts', MAX_ATTEMPTS)
    .select('id');

  // 2. Retry the rest (oldest first, capped).
  const { data: failed } = await supabase.from('conversion_events')
    .select('payload, environment').eq('status', 'failed').lt('attempts', MAX_ATTEMPTS)
    .order('created_at', { ascending: true }).limit(50);

  let retried = 0;
  if (failed && failed.length > 0) {
    // Re-dispatch through analytics-ingest, which re-attempts non-sent rows.
    const byEnv: Record<string, any[]> = {};
    for (const row of failed) {
      const env = (row as any).environment || 'production';
      (byEnv[env] ||= []).push((row as any).payload);
    }
    for (const [environment, events] of Object.entries(byEnv)) {
      const res = await fetch(`${url}/functions/v1/analytics-ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` },
        body: JSON.stringify({ environment, events }),
      });
      await res.text();
      retried += events.length;
    }
  }

  const summary = { dead_lettered: dead?.length || 0, retried };
  console.log(JSON.stringify({ level: 'info', job: 'retry-conversions', ...summary }));
  return new Response(JSON.stringify({ success: true, ...summary }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
