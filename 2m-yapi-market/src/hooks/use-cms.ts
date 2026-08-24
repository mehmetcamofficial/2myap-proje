// CMS hooks — fetch CMS data with fallback to hardcoded data.
// If API is unavailable, the public site still works with bundled data.

import { useState, useEffect, useCallback } from 'react';
import { fetchSiteData, fetchPublicFaqs, fetchPublicApplications, fetchPublicGalleries, fetchPublicSettings, fetchPublicNavigation } from '@/lib/cms';
import { services } from '@/data/services';
import { faqItems, processSteps } from '@/data/content';
import { BUSINESS, NAV } from '@/data/site';
import type { Faq, Application, Gallery, NavigationItem } from '@/lib/cms';

interface CmsState<T> {
  data: T;
  fromApi: boolean;
  loading: boolean;
}

// Convert hardcoded FAQ items to Faq shape
function hardcodedFaqs(): Faq[] {
  return faqItems.map(([q, a], i) => ({
    id: -(i + 1), // negative IDs for hardcoded
    question: q,
    answer: a,
    category: 'genel',
    serviceSlug: null,
    displayOrder: i,
    published: true,
  }));
}

// Convert hardcoded navigation to NavigationItem shape
function hardcodedNavigation(): NavigationItem[] {
  return NAV.map((n, i) => ({
    id: -(i + 1),
    label: n.label,
    href: n.href,
    parentId: null,
    type: 'header' as const,
    displayOrder: i,
    published: true,
    openInNewTab: false,
  }));
}

export function useCmsFaqs(serviceSlug?: string): CmsState<Faq[]> {
  const [state, setState] = useState<CmsState<Faq[]>>({
    data: hardcodedFaqs(),
    fromApi: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const apiFaqs = await fetchPublicFaqs(serviceSlug);
      if (cancelled) return;
      if (apiFaqs && apiFaqs.length > 0) {
        setState({ data: apiFaqs, fromApi: true, loading: false });
      } else {
        setState({ data: hardcodedFaqs(), fromApi: false, loading: false });
      }
    })();
    return () => { cancelled = true; };
  }, [serviceSlug]);

  return state;
}

export function useCmsApplications(): CmsState<Application[]> {
  const [state, setState] = useState<CmsState<Application[]>>({
    data: [],
    fromApi: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const apiApps = await fetchPublicApplications();
      if (cancelled) return;
      if (apiApps && apiApps.length > 0) {
        setState({ data: apiApps, fromApi: true, loading: false });
      } else {
        setState({ data: [], fromApi: false, loading: false });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function useCmsGalleries(): CmsState<Gallery[]> {
  const [state, setState] = useState<CmsState<Gallery[]>>({
    data: [],
    fromApi: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const apiGalleries = await fetchPublicGalleries();
      if (cancelled) return;
      if (apiGalleries && apiGalleries.length > 0) {
        setState({ data: apiGalleries, fromApi: true, loading: false });
      } else {
        setState({ data: [], fromApi: false, loading: false });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function useCmsNavigation(): CmsState<NavigationItem[]> {
  const [state, setState] = useState<CmsState<NavigationItem[]>>({
    data: hardcodedNavigation(),
    fromApi: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const apiNav = await fetchPublicNavigation();
      if (cancelled) return;
      if (apiNav && apiNav.length > 0) {
        setState({ data: apiNav, fromApi: true, loading: false });
      } else {
        setState({ data: hardcodedNavigation(), fromApi: false, loading: false });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function useCmsSettings(): CmsState<Record<string, string>> {
  const [state, setState] = useState<CmsState<Record<string, string>>>({
    data: {},
    fromApi: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const apiSettings = await fetchPublicSettings();
      if (cancelled) return;
      if (apiSettings && Object.keys(apiSettings).length > 0) {
        setState({ data: apiSettings, fromApi: true, loading: false });
      } else {
        setState({ data: {}, fromApi: false, loading: false });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}

// Composed hook that fetches all site data in one request
export function useCmsSiteData(): {
  services: typeof services;
  faqs: Faq[];
  applications: Application[];
  navigation: NavigationItem[];
  settings: Record<string, string>;
  fromApi: boolean;
  loading: boolean;
} {
  const [state, setState] = useState({
    services,
    faqs: hardcodedFaqs(),
    applications: [] as Application[],
    navigation: hardcodedNavigation(),
    settings: {} as Record<string, string>,
    fromApi: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const siteData = await fetchSiteData();
      if (cancelled) return;
      if (siteData) {
        setState({
          services: siteData.services.length > 0 ? siteData.services : services,
          faqs: siteData.faqs.length > 0 ? siteData.faqs : hardcodedFaqs(),
          applications: siteData.applications,
          navigation: siteData.navigation.length > 0 ? siteData.navigation : hardcodedNavigation(),
          settings: siteData.settings,
          fromApi: true,
          loading: false,
        });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}
