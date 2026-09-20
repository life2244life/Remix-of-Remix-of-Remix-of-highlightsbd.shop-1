UPDATE public.custom_pages
SET blocks = replace(blocks::text, 'highlightsbdofficial@gmail.com', 'support@demo.eidlip.com')::jsonb
WHERE blocks::text ILIKE '%highlightsbdofficial@gmail.com%';

UPDATE public.custom_pages
SET blocks = replace(blocks::text, 'info@highlightbd.com', 'info@demo.eidlip.com')::jsonb
WHERE blocks::text ILIKE '%info@highlightbd.com%';