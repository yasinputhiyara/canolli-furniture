import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.canollifurniture.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * Reusable SEO head component.
 * Props: title, description, url, image, type, keywords, noIndex, jsonLd
 */
export default function SEOHead({
  title = "Canolli Furniture | Premium Nilambur Teak Furniture",
  description = "Shop GI-certified Nilambur teak furniture handcrafted by master artisans in Kerala. Free delivery & lifetime warranty.",
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  type = "website",
  keywords,
  noIndex = false,
  jsonLd = null,
}) {
  const fullTitle = title.includes("Canolli") ? title : `${title} | Canolli Furniture`;
  const canonicalUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Canolli Furniture" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
