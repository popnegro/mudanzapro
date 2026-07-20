import { useState, useEffect } from 'react';
import { VALID_PAGE_IDS, getPageFromPath, getRouteById } from '../routes';

export function useNavigation() {
  const [activePage, setActivePage] = useState<string>(() => {
    return getPageFromPath(window.location.pathname);
  });

  const [selectedGeographicZone, setSelectedGeographicZone] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'user' | 'dashboard'>('user');

  // Synchronize client page state with browser URL path (Deep linking support for SEO)
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
    const targetPath = activePage === 'inicio' ? '' : activePage;
    if (currentPath !== targetPath) {
      window.history.pushState(null, '', `/${targetPath}`);
    }

    // Update Document Meta/Title for SEO indexability
    const route = getRouteById(activePage);
    if (route) {
      if (route.seoTitle) {
        document.title = route.seoTitle;
      }
      if (route.seoDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', route.seoDescription);
      }
    }
  }, [activePage]);

  // Support back/forward browser buttons perfectly
  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    activePage,
    setActivePage,
    selectedGeographicZone,
    setSelectedGeographicZone,
    viewMode,
    setViewMode,
  };
}
