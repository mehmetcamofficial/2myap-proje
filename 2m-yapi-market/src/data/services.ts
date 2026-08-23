// Hizmet kataloğu — tek işlenme verisi kaynağı (single source of truth).
// Görseller stok fotoğraftır (source:'demo'); arayüzde kaynak etiketi gösterilmez
// ve tamamlanmış 2M işi olarak sunulmaz.

import type { LucideIcon } from 'lucide-react';
import {
  Building2, Container, Hammer, Home, Layers, PaintBucket, ShieldCheck, Umbrella, Waves, Zap,
} from 'lucide-react';

export type ServiceCategory = 'interior' | 'exterior' | 'structural' | 'technical' | 'outdoor';

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  interior: 'İç Mekân',
  exterior: 'Dış Yapı',
  structural: 'Yapısal',
  technical: 'Teknik',
  outdoor: 'Dış Alan',
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
  applicationImage: string;
  applicationImageAlt: string;
  href: string;
  whatsapp: string;
  icon: LucideIcon;
  source: 'demo' | 'business';
  seoTitle: string;
  seoDesc: string;
}

const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

const regionLine = '\nBulundu\u011Fum b\u00F6lge: ';

export const services: Service[] = [
  {
    id: 'kusadasi-tadilat',
    slug: 'kusadasi-tadilat',
    name: 'Tadilat & Dekorasyon',
    category: 'interior',
    icon: Home,
    source: 'demo',
    short: 'Ev, villa ve i\u015F yerlerinde yenileme ve dekorasyon uygulamalar\u0131.',
    text: 'Yap\u0131lacak i\u015Fi, kullan\u0131m amac\u0131n\u0131 ve beklentinizi birlikte netle\u015Ftiriyoruz. Malzeme se\u00E7iminden uygulamaya kadar s\u00FCreci tek muhatapta y\u00FCr\u00FCt\u00FCyor; k\u00FC\u00E7\u00FCk bir tadilat\u0131 da kapsam\u0131 bir yenilemeyi de ayn\u0131 \u00F6zenle planl\u0131yoruz.',
    image: px(8488031),
    imageAlt: 'Yenileme \u00E7al\u0131\u015Fmas\u0131 yap\u0131lan i\u00E7 mek\u00E2n \u2014 duvar y\u0131k\u0131m\u0131 ve hafriyat g\u00F6r\u00FCn\u00FCm\u00FC',
    applicationImage: px(15798781, 1200),
    applicationImageAlt: 'K\u0131smen yenilenmi\u015F i\u00E7 mek\u00E2n \u2014 \u00E7\u0131plak duvar ve in\u015Faat a\u015Famas\u0131',
    href: '/kusadasi-tadilat',
    whatsapp: `Merhaba, yapt\u0131rmak istedi\u011Fim bir tadilat i\u015Fi i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'Tadilat & Dekorasyon | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde ev, villa ve i\u015F yeri tadilat\u0131 ile dekorasyon uygulamalar\u0131 sunar.',
  },
  {
    id: 'kusadasi-celik',
    slug: 'kusadasi-celik',
    name: '\u00C7elik Konstr\u00FCksiyon',
    category: 'structural',
    icon: Layers,
    source: 'demo',
    short: '\u0130htiyaca g\u00F6re \u00E7elik konstr\u00FCksiyon, \u0131malat ve montaj.',
    text: '\u00C7elik ta\u015F\u0131y\u0131c\u0131 sistem, \u0131malat ve montaj i\u015Flerinde \u00F6l\u00E7\u00FCden uygulamaya kadar s\u00FCreci bizi y\u00FCr\u00FCt\u00FCyoruz. \u0130htiyaca uygun malzemeyi belirliyor, sahada montaj\u0131 planl\u0131 bi\u00E7imde tamaml\u0131yoruz.',
    image: px(16045267),
    imageAlt: '\u00C7elik yap\u0131 kayna\u011F\u0131 yapan kaynak\u00E7\u0131 \u2014 \u00E7elik kiri\u015F montaj\u0131',
    applicationImage: px(16045267, 1200),
    applicationImageAlt: '\u00C7elik kiri\u015F \u00FCzerine kaynak yapan usta \u2014 k\u0131v\u0131lc\u0131mlar g\u00F6r\u00FCn\u00FCyor',
    href: '/kusadasi-celik',
    whatsapp: `Merhaba, \u00E7elik konstr\u00FCksiyon i\u015Fi i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: '\u00C7elik Konstr\u00FCksiyon | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde \u00E7elik konstr\u00FCksiyon, \u0131malat ve montaj i\u015Flerini planlar.',
  },
  {
    id: 'kusadasi-cati-tamiri',
    slug: 'kusadasi-cati-tamiri',
    name: '\u00C7at\u0131 Sistemleri',
    category: 'exterior',
    icon: ShieldCheck,
    source: 'demo',
    short: '\u00C7at\u0131 bak\u0131m, onar\u0131m ve yenileme uygulamalar\u0131.',
    text: 'Mevcut \u00E7at\u0131n\u0131n durumuna g\u00F6re bak\u0131m, onar\u0131m veya yenileme se\u00E7eneklerini de\u011Ferlendiriyoruz. Ke\u015Fifte kapsam\u0131 netle\u015Ftirip uygun malzeme ve uygulama ad\u0131mlar\u0131n\u0131 birlikte belirliyoruz.',
    image: px(31771166),
    imageAlt: 'Yeni bir binan\u0131n \u00E7at\u0131s\u0131nda kiremit d\u00F6\u015Feyen \u00E7at\u0131 ustas\u0131',
    applicationImage: px(31771166, 1200),
    applicationImageAlt: '\u0130\u011Fimli \u00E7at\u0131da kiremit montaj\u0131 yapan in\u015Faat i\u015F\u00E7isi',
    href: '/kusadasi-cati-tamiri',
    whatsapp: `Merhaba, \u00E7at\u0131 tamiri ve yenileme i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: '\u00C7at\u0131 Sistemleri | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde \u00E7at\u0131 bak\u0131m\u0131, onar\u0131m\u0131 ve yenilemesi sunar.',
  },
  {
    id: 'pergola',
    slug: 'pergola',
    name: 'Pergola & D\u0131\u015F Mek\u00E2n',
    category: 'outdoor',
    icon: Umbrella,
    source: 'demo',
    short: 'Bah\u00E7e, teras ve a\u00E7\u0131k alanlar i\u00E7in pergola uygulamalar\u0131.',
    text: 'Bah\u00E7e, teras ve a\u00E7\u0131k alanlar\u0131n\u0131za uygun pergola ve d\u0131\u015F mek\u00E2n uygulamalar\u0131n\u0131 kullan\u0131m amac\u0131na g\u00F6re planl\u0131yoruz. \u00D6l\u00E7\u00FC, malzeme ve montaj\u0131 tek s\u00FCre\u00E7te y\u00FCr\u00FCt\u00FCyoruz.',
    image: px(33287940),
    imageAlt: 'Modern terasta ah\u015Fap pergola yap\u0131s\u0131 \u2014 oturma grubu ile',
    applicationImage: px(33287940, 1200),
    applicationImageAlt: 'Bah\u00E7e teras\u0131nda tamamlanm\u0131\u015F pergola uygulamas\u0131',
    href: '/pergola',
    whatsapp: `Merhaba, pergola ve d\u0131\u015F mek\u00E2n i\u015Fi i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'Pergola & D\u0131\u015F Mek\u00E2n | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde bah\u00E7e, teras ve a\u00E7\u0131k alanlar i\u00E7in pergola uygulamalar\u0131 sunar.',
  },
  {
    id: 'mantolama',
    slug: 'mantolama',
    name: 'D\u0131\u015F Cephe & Mantolama',
    category: 'exterior',
    icon: Building2,
    source: 'demo',
    short: 'D\u0131\u015F cephe yenileme, boya ve mantolama uygulamalar\u0131.',
    text: 'D\u0131\u015F cephe yenileme, boya ve mantolama i\u015Flerinde mevcut durumu yerinde de\u011Ferlendiriyor; uygun sistem ve malzemeyle uygulamay\u0131 planl\u0131yoruz.',
    image: px(6124239),
    imageAlt: 'D\u0131\u015F cepheye ta\u015F y\u00FCn\u00FC yal\u0131t\u0131m plakas\u0131 yerle\u015Ftiren i\u015F\u00E7i \u2014 mantolama uygulamas\u0131',
    applicationImage: px(6124239, 1200),
    applicationImageAlt: 'Bina d\u0131\u015F cephesinde termal yal\u0131t\u0131m levhas\u0131 montaj\u0131',
    href: '/mantolama',
    whatsapp: `Merhaba, d\u0131\u015F cephe ve mantolama i\u015Fi i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'D\u0131\u015F Cephe & Mantolama | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde d\u0131\u015F cephe yenileme, boya ve mantolama uygulamalar\u0131 sunar.',
  },
  {
    id: 'kusadasi-prefabrik',
    slug: 'kusadasi-prefabrik',
    name: 'Prefabrik & Konteyner',
    category: 'structural',
    icon: Container,
    source: 'demo',
    short: 'Kullan\u0131m amac\u0131na g\u00F6re prefabrik ve konteyner yap\u0131 se\u00E7enekleri.',
    text: '\u015Eantiye, depolama veya ya\u015Fam alan\u0131 ihtiyac\u0131na g\u00F6re prefabrik ve konteyner yap\u0131 se\u00E7eneklerini de\u011Ferlendiriyoruz. Kullan\u0131m amac\u0131n\u0131 netle\u015Ftirip uygun \u00E7\u00F6z\u00FCm\u00FC planl\u0131yoruz.',
    image: px(12444968),
    imageAlt: 'Konteyner evler \u2014 mod\u00FCler yap\u0131 alan\u0131nda s\u0131ralanm\u0131\u015F konteyner birimleri',
    applicationImage: px(12444968, 1200),
    applicationImageAlt: '\u00C7oklu konteyner konut yap\u0131s\u0131 \u2014 mod\u00FCler in\u015Faat',
    href: '/kusadasi-prefabrik',
    whatsapp: `Merhaba, prefabrik veya konteyner yap\u0131 i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'Prefabrik & Konteyner | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde prefabrik ve konteyner yap\u0131 uygulamalar\u0131 sunar.',
  },
  {
    id: 'seramik-doseme',
    slug: 'seramik-doseme',
    name: 'Seramik & Zemin',
    category: 'interior',
    icon: Hammer,
    source: 'demo',
    short: 'Seramik, zemin kaplama ve d\u00F6\u015Feme uygulamalar\u0131.',
    text: 'Zemin ve duvar kaplamalar\u0131nda \u00F6l\u00E7\u00FC, malzeme ve i\u015F\u00E7ili\u011Fi birlikte planl\u0131yoruz. Seramik ve zemin i\u015Flerini tadilat s\u00FCrecinin par\u00E7as\u0131 olarak y\u00FCr\u00FCt\u00FCyoruz.',
    image: px(29181494),
    imageAlt: 'Yenileme projesinde fayans d\u00F6\u015Feme \u00E7al\u0131\u015Fmas\u0131 \u2014 zemin kaplama ustas\u0131',
    applicationImage: px(29181494, 1200),
    applicationImageAlt: 'Seramik karolar\u0131 zemine d\u00F6\u015Feyen in\u015Faat i\u015F\u00E7isi',
    href: '/seramik-doseme',
    whatsapp: `Merhaba, seramik ve zemin i\u015Fi i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'Seramik & Zemin | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde seramik, zemin kaplama ve d\u00F6\u015Feme uygulamalar\u0131 sunar.',
  },
  {
    id: 'kusadasi-boya',
    slug: 'kusadasi-boya',
    name: 'Boya, Al\u00E7\u0131 & S\u0131va',
    category: 'interior',
    icon: PaintBucket,
    source: 'demo',
    short: 'Boya, al\u00E7\u0131 ve s\u0131va ile y\u00FCzey haz\u0131rl\u0131\u011F\u0131 ve bitirme i\u015Fleri.',
    text: 'Y\u00FCzey haz\u0131rl\u0131\u011F\u0131, al\u00E7\u0131, s\u0131va ve boya i\u015Flerini mek\u00E2n\u0131n mevcut durumuna g\u00F6re planl\u0131yoruz. Temiz ve d\u00FCzenli bir biti\u015F i\u00E7in uygulama ad\u0131mlar\u0131n\u0131 ke\u015Fifte netle\u015Ftiriyoruz.',
    image: px(6764289),
    imageAlt: 'Boyac\u0131 rulosu ile duvar boyama \u00E7al\u0131\u015Fmas\u0131 \u2014 boya uygulamas\u0131',
    applicationImage: px(6764289, 1200),
    applicationImageAlt: 'Duvar \u00FCzerine boya s\u00FCren rulo \u2014 i\u00E7 mek\u00E2n boyama',
    href: '/kusadasi-boya',
    whatsapp: `Merhaba, boya, al\u00E7\u0131 ve s\u0131va i\u015Fi i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'Boya, Al\u00E7\u0131 & S\u0131va | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde boya, al\u00E7\u0131 ve s\u0131va uygulamalar\u0131 sunar.',
  },
  {
    id: 'tesisat',
    slug: 'elektrik',
    name: 'Elektrik & S\u0131hhi Tesisat',
    category: 'technical',
    icon: Zap,
    source: 'demo',
    short: 'Tadilat ve yap\u0131 i\u015Fleri kapsam\u0131nda elektrik ve s\u0131hhi tesisat.',
    text: 'Tadilat ve yap\u0131 i\u015Flerinin par\u00E7as\u0131 olarak elektrik ve s\u0131hhi tesisat uygulamalar\u0131n\u0131 planlayabiliyoruz. Mevcut tesisat\u0131n durumuna g\u00F6re yenileme veya yeni hat ihtiyac\u0131n\u0131 ke\u015Fifte de\u011Ferlendiriyoruz.',
    image: px(257736),
    imageAlt: 'Elektrik paneli \u00FCzerinde \u00E7al\u0131\u015Fan elektrik\u00E7i \u2014 kablo ba\u011Flant\u0131lar\u0131',
    applicationImage: px(6419128, 1200),
    applicationImageAlt: 'Tesisat borular\u0131 montaj\u0131 yapan usta \u2014 s\u0131hhi tesisat \u00E7al\u0131\u015Fmas\u0131',
    href: '/elektrik',
    whatsapp: `Merhaba, elektrik ve s\u0131hhi tesisat i\u015Fi i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'Elektrik & S\u0131hhi Tesisat | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde tadilat kapsam\u0131nda elektrik ve s\u0131hhi tesisat uygulamalar\u0131 sunar.',
  },
  {
    id: 'havuz-yapimi',
    slug: 'havuz-yapimi',
    name: 'Havuz Yap\u0131m\u0131',
    category: 'outdoor',
    icon: Waves,
    source: 'demo',
    short: 'Yeni havuz yap\u0131m\u0131 ve mevcut havuzlar\u0131n yenilenmesi.',
    text: 'Yeni havuz yap\u0131m\u0131 ile mevcut havuzlar\u0131n yenilenmesine y\u00F6nelik i\u015Fleri de\u011Ferlendiriyoruz. Kullan\u0131m amac\u0131, alan ve uygulama ko\u015Fullar\u0131na g\u00F6re kapsam\u0131 birlikte netle\u015Ftiriyoruz.',
    image: px(9379484),
    imageAlt: 'Havuz in\u015Fat\u0131 \u2014 betonarme havuz kabu\u011Fu ve su yal\u0131t\u0131m\u0131',
    applicationImage: px(9379484, 1200),
    applicationImageAlt: 'Betonarme havuz yap\u0131m a\u015Famas\u0131 \u2014 in\u015Faat \u00E7al\u0131\u015Fmas\u0131',
    href: '/havuz-yapimi',
    whatsapp: `Merhaba, havuz yap\u0131m\u0131 veya yenileme i\u00E7in bilgi ve ke\u015Fif almak istiyorum.${regionLine}`,
    seoTitle: 'Havuz Yap\u0131m\u0131 | Ku\u015Fadas\u0131 & Ege B\u00F6lgesi | 2M Yap\u0131 Market Proje',
    seoDesc: 'Ku\u015Fadas\u0131 merkezli 2M Yap\u0131 Market Proje; Ege B\u00F6lgesi genelinde yeni havuz yap\u0131m\u0131 ve mevcut havuz yenileme i\u015Flerini de\u011Ferlendirir.',
  },
];
