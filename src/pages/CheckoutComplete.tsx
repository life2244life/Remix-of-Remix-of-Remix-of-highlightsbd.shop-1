import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { executeBkash, verifyNagad } from '@/lib/payments';
import { sendTransactionalEmail } from '@/lib/api';

type State = 'verifying' | 'success' | 'failed' | 'cancelled';

const CheckoutComplete = () => {
  const [params] = useSearchParams();
  const order = params.get('order') || '';
  const gw = params.get('gw') || '';
  const txn = params.get('txn') || '';
  const initialStatus = params.get('status');
  // For gateway flows (bkash/nagad) we must verify server-side first, so always start "verifying".
  const [state, setState] = useState<State>(!gw && initialStatus ? (initialStatus as State) : 'verifying');
  const ran = useRef(false);
  const emailed = useRef(false);

  // Send payment outcome email once the gateway result is known (gateway flows only).
  useEffect(() => {
    if (emailed.current || !order || !gw) return;
    if (state === 'success') { emailed.current = true; sendTransactionalEmail('payment_success', order); }
    else if (state === 'failed') { emailed.current = true; sendTransactionalEmail('payment_failed', order); }
  }, [state, order, gw]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        if (gw === 'bkash') {
          const paymentID = params.get('paymentID') || '';
          const cbStatus = params.get('status'); // bKash sends status=success/failure/cancel
          if (cbStatus && cbStatus.toLowerCase() !== 'success') { setState(cbStatus.toLowerCase().includes('cancel') ? 'cancelled' : 'failed'); return; }
          if (!paymentID) { setState('failed'); return; }
          const res = await executeBkash(paymentID, txn);
          setState(res?.status === 'success' ? 'success' : 'failed');
        } else if (gw === 'nagad') {
          const paymentRefId = params.get('payment_ref_id') || params.get('paymentRefId') || '';
          const nstatus = params.get('status');
          if (nstatus && nstatus.toLowerCase() !== 'success') { setState('failed'); return; }
          if (!paymentRefId) { setState('failed'); return; }
          const res = await verifyNagad(paymentRefId, txn);
          setState(res?.status === 'success' ? 'success' : 'failed');
        } else if (initialStatus) {
          setState(initialStatus as State);
        } else {
          setState('failed');
        }
      } catch {
        setState('failed');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shortId = order ? order.slice(0, 8).toUpperCase() : '';

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Payment Status" description="Your EIDLIP payment status." path="/checkout/complete" noIndex />
      <Header />
      <main className="max-w-xl mx-auto px-4 pt-40 pb-24 text-center">
        {state === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Verifying your payment…</p>
          </div>
        )}
        {state === 'success' && (
          <div className="space-y-5">
            <CheckCircle2 className="h-14 w-14 mx-auto text-green-600" />
            <h1 className="luxury-heading text-2xl tracking-[0.12em]">Payment Successful</h1>
            <p className="text-sm text-muted-foreground">Thank you! Your order {shortId && <span className="font-mono">#{shortId}</span>} has been confirmed.</p>
            <Link to="/" className="luxury-button-primary inline-block text-xs">Continue Shopping</Link>
          </div>
        )}
        {(state === 'failed' || state === 'cancelled') && (
          <div className="space-y-5">
            <XCircle className="h-14 w-14 mx-auto text-destructive" />
            <h1 className="luxury-heading text-2xl tracking-[0.12em]">{state === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed'}</h1>
            <p className="text-sm text-muted-foreground">
              {state === 'cancelled' ? 'You cancelled the payment.' : 'We could not confirm your payment.'} Your order {shortId && <span className="font-mono">#{shortId}</span>} is saved — you can retry or contact support.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/checkout" className="luxury-button-primary inline-block text-xs">Back to Checkout</Link>
              <Link to="/" className="luxury-button-outline inline-block text-xs">Home</Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutComplete;
