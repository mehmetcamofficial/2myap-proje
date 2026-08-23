// Service catalogue with per-service demo imagery and contextual WhatsApp copy.
// DEMO NOTICE: every image is a royalty-free Pexels demo photo (source:'demo').
// Once real 2M photography exists, replace only `image` (source:'business').
// Never present demo images as real completed work in live copy.

import type { LucideIcon } from 'lucide-react';
import {
  Building2, Container, Droplets, Hammer, Home, Layers, PaintBucket, ShieldCheck, Umbrella, Waves, Zap,
} from 'lucide-react';

export type ServiceCategory = 'interior' | 'exterior' | 'structural' | 'technical' | 'outdoor';

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  interior: 'Ici mekan',
  exterior: 'Dis yapi',
  structural: 'Yapisal',
  technical: 'Teknik',
  outdoor: 'Dis alan',
};

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  short: string;
  text: string;
  image: string;
  imageAlt: string;
  whatsapp: string;
  icon: LucideIcon;
  source: 'demo' | 'business';
  seoTitle: string;
  seoDesc: string;
}

const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export const services: Service[] = [
  {
    id: 'kusadasi-tadilat', slug: 'kusadasi-tadilat', name: 'Tadilat & Dekorasyon', category: 'interior',
    icon: Home, source: 'demo',
    short: 'Renovation, decoration and finishing under one roof.',
    text: 'From the first visit to full handover, we run interior renovation with a clear plan, the right materials and a reliable team.',
    image: px(1571460),
    imageAlt: 'Interior renovation example',
    whatsapp: 'Merhaba, I would like information about a renovation in Kusadasi.',
    seoTitle: 'Kusadasi Tadilat | 2M Building Market',
    seoDesc: 'Interior renovation and decoration services in Kusadasi with material and application.',
  },
  {
    id: 'kusadasi-cati-tamiri', slug: 'kusadasi-cati-tamiri', name: 'Cati Tamiri', category: 'exterior',
    icon: ShieldCheck, source: 'demo',
    short: 'Roof repair, waterproofing and renewal.',
    text: 'We inspect the roof with leaks and wear, then repair and apply insulation and waterproof layers so it lasts.',
    image: px(681333),
    imageAlt: 'Roof repair example',
    whatsapp: 'Merhaba, I would like a quote for roof repair and waterproofing.',
    seoTitle: 'Kusadasi Cati Tamiri | Roofing',
    seoDesc: 'Roof repair and leak fixing in Kusadasi.',
  },
  {
    id: 'kusadasi-celik', slug: 'kusadasi-celik', name: 'Celik Konstruksiyon', category: 'structural',
    icon: Layers, source: 'demo',
    short: 'Steel structures, frames and support work.',
    text: 'Steel structures and frames - from pergola structural systems to mezzanines and site support - designed and installed.',
    image: px(280222),
    imageAlt: 'Steel structure example',
    whatsapp: 'Merhaba, I would like a quote for steel work.',
    seoTitle: 'Kusadasi Celik Konstruksiyon',
    seoDesc: 'Steel construction and frame services in Kusadasi.',
  },
  {
    id: 'kusadasi-prefabrik', slug: 'kusadasi-prefabrik', name: 'Prefabrik Yapilar', category: 'structural',
    icon: Building2, source: 'demo',
    short: 'Prefabricated buildings, site offices and storage.',
    text: 'Site offices, depots and small prefab structures - planned for practical use, delivered and installed.',
    image: px(1216589),
    imageAlt: 'Prefabricated building example',
    whatsapp: 'Merhaba, quote for prefabricated building.',
    seoTitle: 'Kusadasi Prefabrik Yapilar',
    seoDesc: 'Prefabricated buildings and site offices in Kusadasi.',
  },
  {
    id: 'koneyner', slug: 'koneyner', name: 'Koneynter', category: 'structural',
    icon: Container, source: 'demo',
    short: 'Container structures for site and storage.',
    text: 'New and refit containers for site, storages and housing needs - delivered and placed.',
    image: px(1740287),
    imageAlt: 'Container example',
    whatsapp: 'Merhaba, I would like info on container solutions.',
    seoTitle: 'Koneyner Solutions',
    seoDesc: 'Container and storage module solutions in Kusadasi Turkey.',
  },
  {
    id: 'su-tesisat', slug: 'kusadasi-su-tesisatci', name: 'Su Tesisatci', category: 'technical',
    icon: Droplets, source: 'demo',
    short: 'Plumbing, renewal and new installations.',
    text: 'New plumbing lines, renewal and repair works in baths, kitchens and whole apartments.',
    image: px(1396132),
    imageAlt: 'Plumbing example',
    whatsapp: 'Merhaba, I would like a quote for plumbing works.',
    seoTitle: 'Kusadasi Su Tesisatci | Plumbing',
    seoDesc: 'Plumbing and sanitary installation services in Kusadasi.',
  },
  {
    id: 'elektrik', slug: 'elektrik', name: 'Elektrik Isleri', category: 'technical',
    icon: Zap, source: 'demo',
    short: 'Electrical installation and repairs.',
    text: 'Distribution boards, rewiring and new electrical points, done safely and in order.',
    image: px(1740287),
    imageAlt: 'Electrical works example',
    whatsapp: 'Merhaba, I would like a quote for electrical works.',
    seoTitle: 'Kusadasi Elektrik Isleri',
    seoDesc: 'Electrical installation and repair services in Kusadasi.',
  },
  {
    id: 'havuz-yapimi', slug: 'havuz-yapimi', name: 'Havuz Yapimi', category: 'outdoor',
    icon: Waves, source: 'demo',
    short: 'Pool construction and renewal.',
    text: 'Private pools designed for your garden and usage needs, from structure to finish.',
    image: px(1080721),
    imageAlt: 'Swimming pool example',
    whatsapp: 'Merhaba, I would like information about pool construction.',
    seoTitle: 'Kusadasi Havuz Yapimi',
    seoDesc: 'Swimming pool construction services in Kusadasi.',
  },
  {
    id: 'pergola', slug: 'pergola', name: 'Pergola', category: 'outdoor',
    icon: Umbrella, source: 'demo',
    short: 'Pergolas, shades and outdoor spaces.',
    text: 'Covered terraces and pergolas planned to suit your house and open-air living spaces.',
    image: px(1643383),
    imageAlt: 'Pergola example',
    whatsapp: 'Merhaba, I would like prices and a quote for a pergola.',
    seoTitle: 'Kusadasi Pergola',
    seoDesc: 'Pergola and outdoor shading construction in Kusadasi.',
  },
  {
    id: 'kusadasi-boya', slug: 'kusadasi-boya', name: 'Boya & Badana', category: 'interior',
    icon: PaintBucket, source: 'demo',
    short: 'Painting and clean finishing for walls and rooms.',
    text: 'Surface prep, the right coating and a clean finish - for walls, plaster and whole rooms.',
    image: px(106399),
    imageAlt: 'Painting application example',
    whatsapp: 'Merhaba, I would like a quote for painting services.',
    seoTitle: 'Kusadasi Boya | Painting',
    seoDesc: 'Painting and finishing services in Kusadasi.',
  },
  {
    id: 'mantolama', slug: 'mantolama', name: 'Mantolama', category: 'exterior',
    icon: ShieldCheck, source: 'demo',
    short: 'External wall insulation and facade coating.',
    text: 'Thermal insulation and smooth facade plaster to renew the exterior and cut energy loss.',
    image: px(259588),
    imageAlt: 'Facade insulation example',
    whatsapp: 'Merhaba, a quote for mantolama and facade plaster please.',
    seoTitle: 'Kusadasi Mantolama',
    seoDesc: 'Mantolama thermal insulation in Kusadasi.',
  },
  {
    id: 'seramik-doseme', slug: 'seramik-doseme', name: 'Seramik & Doseme', category: 'interior',
    icon: Hammer, source: 'demo',
    short: 'Ceramic tile installation for floors and walls.',
    text: 'Correct measuring, the right adhesive and exact installation for floors and walls that last.',
    image: px(323780),
    imageAlt: 'Ceramic tile installation example',
    whatsapp: 'Merhaba, I would like a quote for ceramic tiling.',
    seoTitle: 'Kusadasi Seramik Doseme',
    seoDesc: 'Ceramic tile and tiling services in Kusadasi.',
  },
];