// ----------------------------------------------------------------------------
// TEK İŞLETME VERİSİ KAYNAĞI (single source of truth)
// Fiziksel adres: Kuşadası. Hizmet bölgesi: Ege Bölgesi.
// ----------------------------------------------------------------------------

export const BUSINESS = {
  name: '2M YAPI MARKET PROJE BIANCA',
  shortName: '2M YAPI MARKET',
  tagline: 'Malzeme. Usta. Uygulama. Tek muhatap.',
  description:
    'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde tadilat, çatı, pergola, çelik konstrüksiyon, dış cephe, prefabrik, seramik, tesisat ve yapı uygulamaları sunar.',
  phoneRaw: import.meta.env.VITE_BUSINESS_PHONE || '05437280711',
  phoneDisplay: '0543 728 07 11',
  whatsapp: import.meta.env.VITE_WHATSAPP_PHONE || '905437280711',
  address: {
    building: 'TNR Corner Loft',
    street: 'Soğucak, Kuşadası Davutlar Yolu No:75',
    city: '09400 Kuşadası / Aydın',
    locality: 'Kuşadası',
    region: 'Aydın',
    postalCode: '09400',
    country: 'TR',
    streetAddress: 'Kuşadası Davutlar Yolu No:75',
  },
  baseCity: 'Kuşadası',
  serviceRegion: 'Ege Bölgesi',
  serviceProvinces: ['Kuşadası', 'Aydın', 'İzmir', 'Muğla', 'Manisa', 'Denizli'],
  mapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=2M+Yap%C4%B1+Market+Proje+Bianca%2C+So%C4%9Fucak%2C+Ku%C5%9Fadas%C4%B1+Davutlar+Yolu+75',
  mapsEmbed:
    'https://www.google.com/maps?q=2M+Yap%C4%B1+Market+Proje+Bianca,+Ku%C5%9Fadas%C4%B1+Davutlar+Yolu+75,+So%C4%9Fucak&output=embed',
  googleProfile: '',
  whatsappDefaultMessage:
    'Merhaba, 2M Yapı Market web sitesinden ulaşıyorum. Yaptırmak istediğim işle ilgili bilgi ve keşif almak istiyorum.\nBulunduğum bölge: ',
} as const;

export const SITE = {
  name: BUSINESS.name,
  shortName: BUSINESS.shortName,
  tagline: BUSINESS.tagline,
  description: BUSINESS.description,
  locale: 'tr_TR',
  lang: 'tr',
  url: (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://2myapimarket.vercel.app').replace(/\/+$/, ''),
} as const;

export const CONTACT = {
  phoneRaw: BUSINESS.phoneRaw,
  phoneDisplay: BUSINESS.phoneDisplay,
  whatsapp: BUSINESS.whatsapp,
  addressLines: [BUSINESS.address.building, BUSINESS.address.street, BUSINESS.address.city],
  baseCity: BUSINESS.baseCity,
  serviceRegion: BUSINESS.serviceRegion,
  serviceProvinces: BUSINESS.serviceProvinces,
} as const;

export const NAV = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/uygulamalar', label: 'Uygulamalar' },
  { href: '/iletisim', label: '\u0130leti\u015Fim' },
] as const;

export const whatsappUrl = (message: string) =>
  `https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_DEFAULT = BUSINESS.whatsappDefaultMessage;
