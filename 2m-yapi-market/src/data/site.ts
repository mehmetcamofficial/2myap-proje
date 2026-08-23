// ----------------------------------------------------------------------------
// Central site identity + business facts.
// Edit these values to reflect verified 2M Yapı Market Proje Bianca details.
// Never invent facts. Demo fields below are placeholders for future real data.
// ----------------------------------------------------------------------------

export const SITE = {
  name: '2M YAPI MARKET PROJE BIANCA',
  shortName: '2M YAPI MARKET',
  tagline: 'Malzeme. Usta. Uygulama. Tek muhatap.',
  description:
    'Kuşadası, Soğucak, Davutlar ve Güzelçamlı’da malzeme, uygulama ve proje hizmetlerini tek noktada buluşturuyoruz.',
  locale: 'tr_TR',
  lang: 'tr',
  // Replace with the production origin when live (no trailing slash).
  url: 'https://2myapimarket.example',
} as const;

export const CONTACT = {
  phoneRaw: import.meta.env.VITE_BUSINESS_PHONE || '05437280711',
  phoneDisplay: '+90 543 728 07 11',
  whatsapp: import.meta.env.VITE_WHATSAPP_PHONE || '905437280711',
  // Real storefront / actual registered address:
  addressLines: ['TNR Corner Loft', 'Kuşadası Davutlar Yolu No:75', '09400 Kuşadası / Aydın'],
  areas: ['Kuşadası', 'Soğucak', 'Davutlar', 'Güzelçamlı'],
} as const;

export const NAV = [
  { href: '/', label: 'Ana sayfa', anchor: '' },
  { href: '/hizmetler', label: 'Hizmetler', anchor: '' },
  { href: '/#uygulama', label: 'Uygulamalar', anchor: 'uygulama' },
  { href: '/#hakkımızda', label: 'Hakkımızda', anchor: 'hakkımızda' },
  { href: '/iletisim', label: 'İletişim', anchor: '' },
] as const;

export const whatsappUrl = (message: string) =>
  `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_DEFAULT = 'Merhaba, 2M Yapı Market Proje Bianca hakkında bilgi almak istiyorum.';