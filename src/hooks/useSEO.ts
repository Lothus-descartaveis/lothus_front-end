import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  keywords?: string[];
}

export const useSEO = ({
  title,
  description,
  canonical = 'https://lothusdescartaveis.com.br/',
  type = 'website',
  image = 'https://lothusdescartaveis.com.br/assets/logo-lothus-header.png',
  keywords = []
}: SEOProps) => {
  useEffect(() => {
    // 1. Atualizar Título da Página
    document.title = `${title} | Lothus Descartáveis`;

    // 2. Atualizar ou Criar Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Atualizar Meta Keywords se fornecido
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // 4. Atualizar Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // 5. Open Graph Meta Tags
    const updateOG = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOG('og:title', `${title} | Lothus Descartáveis`);
    updateOG('og:description', description);
    updateOG('og:url', canonical);
    updateOG('og:type', type);
    updateOG('og:image', image);
    updateOG('og:site_name', 'Lothus Descartáveis & Suprimentos');

    // 6. Twitter Card Meta Tags
    const updateTwitter = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateTwitter('twitter:card', 'summary_large_image');
    updateTwitter('twitter:title', `${title} | Lothus Descartáveis`);
    updateTwitter('twitter:description', description);
    updateTwitter('twitter:image', image);

  }, [title, description, canonical, type, image, keywords]);
};
