import { Helmet } from 'react-helmet-async';
import { useSEOSettings } from '@/hooks/useSEOSettings';
import { buildGlobalSchemas } from '@/lib/seoSchemas';

/**
 * Injects site-wide head metadata and JSON-LD once, driven by admin SEO settings.
 * Per-route <SEO /> components add page-specific tags on top of these.
 */
const GlobalSEO = () => {
  const { data } = useSEOSettings();
  if (!data) return null;

  const schemas = buildGlobalSchemas(data);
  const indexable = data.robots_allow_indexing !== 'false';

  return (
    <Helmet>
      {data.gsc_verification && (
        <meta name="google-site-verification" content={data.gsc_verification} />
      )}
      {data.facebook_app_id && <meta property="fb:app_id" content={data.facebook_app_id} />}
      {!indexable && <meta name="robots" content="noindex, nofollow" />}
      {schemas.map((schema, i) => (
        <script key={`global-ld-${i}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default GlobalSEO;
