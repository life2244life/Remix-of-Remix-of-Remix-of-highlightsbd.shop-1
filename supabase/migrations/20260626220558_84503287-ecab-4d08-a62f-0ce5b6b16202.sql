-- Customers (anon or signed-in) may upload payment proof screenshots at checkout
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Only admins can view payment proofs
CREATE POLICY "Admins can view payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete payment proofs
CREATE POLICY "Admins can delete payment proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));