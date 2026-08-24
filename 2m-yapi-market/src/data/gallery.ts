// Galeri proje verileri — fallback data, CMS'ten yönetilebilir
// Gerçek 2M projeleriyle değiştirilmek üzere hazırlanmıştır.

const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export type GalleryCategory = 'Tadilat & Renovasyon' | 'Çatı & Yalıtım' | 'Çelik Yapı' | 'Cephe' | 'Havuz' | 'İç Mekân' | 'Dış Mekân';

export type GallerySize = 'large' | 'medium' | 'portrait';

export interface GalleryProject {
  id: string;
  title: string;
  slug: string;
  category: GalleryCategory;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  size: GallerySize;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Tadilat & Renovasyon',
  'Çatı & Yalıtım',
  'Çelik Yapı',
  'Cephe',
  'Havuz',
  'İç Mekân',
  'Dış Mekân',
];

export const galleryProjects: GalleryProject[] = [
  {
    id: 'villa-tadilat',
    title: 'Villa Tadilat Uygulaması',
    slug: 'villa-tadilat-uygulamasi',
    category: 'Tadilat & Renovasyon',
    location: 'Kuşadası / Aydın',
    description: 'Villa iç ve dış mekân yenileme çalışması — komple tadilat uygulaması.',
    image: px(15798781, 1200),
    imageAlt: 'Villa tadilat uygulaması — yenilenmiş iç mekân görünümü',
    size: 'large',
  },
  {
    id: 'cati-yenileme',
    title: 'Çatı Yenileme ve Yalıtım',
    slug: 'cati-yenileme-ve-yalitim',
    category: 'Çatı & Yalıtım',
    location: 'Davutlar / Kuşadası',
    description: 'Mevcut çatının yenilenmesi ve termal yalıtım uygulaması.',
    image: px(31771166, 1200),
    imageAlt: 'Çatı yenileme çalışması — kiremit montajı',
    size: 'medium',
  },
  {
    id: 'celik-tasayici',
    title: 'Çelik Taşıyıcı Sistem',
    slug: 'celik-tasayici-sistem',
    category: 'Çelik Yapı',
    location: 'Kuşadası',
    description: 'Çelik konstrüksiyon taşıyıcı sistem imalatı ve montajı.',
    image: px(16045267, 1200),
    imageAlt: 'Çelik kiriş montajı — kaynak çalışması',
    size: 'portrait',
  },
  {
    id: 'dis-cephe-uygulamasi',
    title: 'Villa Dış Cephe Uygulaması',
    slug: 'dis-cephe-uygulamasi',
    category: 'Cephe',
    location: 'Aydın',
    description: 'Dış cephe yenileme ve mantolama uygulaması.',
    image: px(6124239, 1200),
    imageAlt: 'Dış cephe yalıtım levhası montajı — bina yenileme',
    size: 'medium',
  },
  {
    id: 'havuz-yenileme',
    title: 'Havuz Yenileme Uygulaması',
    slug: 'havuz-yenileme-uygulamasi',
    category: 'Havuz',
    location: 'Kuşadası',
    description: 'Mevcut havuzun yenilenmesi ve su yalıtımı çalışması.',
    image: px(9379484, 1200),
    imageAlt: 'Havuz yenileme çalışması — betonarme havuz kabuğu',
    size: 'large',
  },
  {
    id: 'ic-mekan-renovasyon',
    title: 'İç Mekân Renovasyonu',
    slug: 'ic-mekan-renovasyonu',
    category: 'İç Mekân',
    location: 'Kuşadası',
    description: 'İç mekân renovasyonu — zemin, duvar ve tavan uygulamaları.',
    image: px(8488031, 1200),
    imageAlt: 'İç mekân yenileme çalışması — renovasyon aşaması',
    size: 'medium',
  },
  {
    id: 'pergola-uygulamasi',
    title: 'Teras Pergola Uygulaması',
    slug: 'teras-pergola-uygulamasi',
    category: 'Dış Mekân',
    location: 'Kuşadası / Aydın',
    description: 'Açık alan pergola ve teras uygulaması.',
    image: px(33287940, 1200),
    imageAlt: 'Teras pergola uygulaması — ahşap çatı sistemi',
    size: 'portrait',
  },
  {
    id: 'seramik-doseme',
    title: 'Seramik Zemin Uygulaması',
    slug: 'seramik-zemin-uygulamasi',
    category: 'İç Mekân',
    location: 'Kuşadası',
    description: 'Seramik ve fayans zemin döşeme uygulaması.',
    image: px(29181494, 1200),
    imageAlt: 'Seramik döşeme çalışması — zemin kaplama',
    size: 'medium',
  },
  {
    id: 'boya-alci',
    title: 'Boya ve Alçı Uygulaması',
    slug: 'boya-ve-alci-uygulamasi',
    category: 'Tadilat & Renovasyon',
    location: 'Kuşadası',
    description: 'Duvar alçı, sıva ve boya uygulaması.',
    image: px(6764289, 1200),
    imageAlt: 'Duvar boyama çalışması — boya uygulaması',
    size: 'portrait',
  },
  {
    id: 'prefabrik-konteyner',
    title: 'Prefabrik Yapı Montajı',
    slug: 'prefabrik-yapi-montaji',
    category: 'Çelik Yapı',
    location: 'Aydın',
    description: 'Prefabrik yapı üretimi ve saha montajı.',
    image: px(12444968, 1200),
    imageAlt: 'Prefabrik yapı montajı — modüler inşaat',
    size: 'medium',
  },
];
