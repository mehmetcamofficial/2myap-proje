// CMS API client — fetches data from the backend public API.
// Falls back to hardcoded data if API is unavailable.

import type { Service } from '@/data/services';
import { apiFetch } from './api';

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  serviceSlug: string | null;
  displayOrder: number;
  published: boolean;
}

export interface Application {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  serviceSlug: string | null;
  primaryImage: string;
  primaryImageAlt: string;
  galleryImages: string[];
  displayOrder: number;
  published: boolean;
  seoTitle: string;
  metaDescription: string;
}

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  category: string;
  location: string;
  size: string;
  published: boolean;
  displayOrder: number;
}

export interface NavigationItem {
  id: number;
  label: string;
  href: string;
  parentId: number | null;
  type: string;
  displayOrder: number;
  published: boolean;
  openInNewTab: boolean;
}

async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await apiFetch(path, {
      ...init,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  published: boolean;
  seoTitle: string;
  seoDesc: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteData {
  services: Service[];
  faqs: Faq[];
  applications: Application[];
  navigation: NavigationItem[];
  settings: Record<string, string>;
}

export async function fetchSiteData(): Promise<SiteData | null> {
  return cmsFetch<SiteData>('/api/public/site');
}

export async function fetchPublicServices(): Promise<Service[] | null> {
  return cmsFetch<Service[]>('/api/public/services');
}

export async function fetchPublicService(slug: string): Promise<Service | null> {
  return cmsFetch<Service>(`/api/public/services/${slug}`);
}

export async function fetchPublicFaqs(serviceSlug?: string): Promise<Faq[] | null> {
  const qs = serviceSlug ? `?service=${encodeURIComponent(serviceSlug)}` : '';
  return cmsFetch<Faq[]>(`/api/public/faqs${qs}`);
}

export async function fetchPublicApplications(): Promise<Application[] | null> {
  return cmsFetch<Application[]>('/api/public/applications');
}

export async function fetchPublicApplication(slug: string): Promise<Application | null> {
  return cmsFetch<Application>(`/api/public/applications/${slug}`);
}

export async function fetchPublicGalleries(): Promise<Gallery[] | null> {
  return cmsFetch<Gallery[]>('/api/public/galleries');
}

export async function fetchPublicGallery(slug: string): Promise<(Gallery & { images: any[] }) | null> {
  return cmsFetch<Gallery & { images: any[] }>(`/api/public/galleries/${slug}`);
}

export async function fetchPublicSettings(): Promise<Record<string, string> | null> {
  return cmsFetch<Record<string, string>>('/api/public/settings');
}

export async function fetchPublicNavigation(): Promise<NavigationItem[] | null> {
  return cmsFetch<NavigationItem[]>('/api/public/navigation');
}
