import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, any>;
}

export default function SEO({ title, description, url, image, type = "website", jsonLd }: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | SmartStayChur`;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Standard meta tags
    updateMeta("description", description);
    
    // Open Graph
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", url, true);
    updateMeta("og:type", type, true);
    if (image) {
      updateMeta("og:image", image, true);
    }

    // Twitter Cards
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    if (image) {
      updateMeta("twitter:image", image);
    }

    // JSON-LD structured data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, url, image, type, jsonLd]);

  return null;
}
