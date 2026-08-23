// Hizmet kataloğu. Görseller stok fotoğraftır (source:'demo');
// arayüzde kaynak etiketi gösterilmez ve tamamlanmış 2M işi olarak sunulmaz.

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
  whatsapp: string;
  icon: LucideIcon;
  source: 'demo' | 'business';
  seoTitle: string;
  seoDesc: string;
}

const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

const regionLine = '\nBulunduğum bölge: ';

export const services: Service[] = [
  {
    id: 'kusadasi-tadilat',
    slug: 'kusadasi-tadilat',
    name: 'Tadilat & Dekorasyon',
    category: 'interior',
    icon: Home,
    source: 'demo',
    short: 'Ev, villa ve iş yerlerinde yenileme ve dekorasyon uygulamaları.',
    text: 'Yapılacak işi, kullanım amacını ve beklentinizi birlikte netleştiriyoruz. Malzeme seçiminden uygulamaya kadar süreci tek muhatapta yürütüyor; küçük bir tadilatı da kapsamlı bir yenilemeyi de aynı özenle planlıyoruz.',
    image: px(1571460),
    imageAlt: 'Tadilat ve dekorasyon uygulamasına dair görsel',
    whatsapp: `Merhaba, yaptırmak istediğim bir tadilat işi için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Tadilat & Dekorasyon | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde ev, villa ve iş yeri tadilatı ile dekorasyon uygulamaları sunar.',
  },
  {
    id: 'kusadasi-celik',
    slug: 'kusadasi-celik',
    name: 'Çelik Konstrüksiyon',
    category: 'structural',
    icon: Layers,
    source: 'demo',
    short: 'İhtiyaca göre çelik konstrüksiyon, imalat ve montaj.',
    text: 'Çelik taşıyıcı sistem, imalat ve montaj işlerinde ölçüden uygulamaya kadar süreci biz yürütüyoruz. İhtiyaca uygun malzemeyi belirliyor, sahada montajı planlı biçimde tamamlıyoruz.',
    image: px(280222),
    imageAlt: 'Çelik konstrüksiyon uygulamasına dair görsel',
    whatsapp: `Merhaba, çelik konstrüksiyon işi için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Çelik Konstrüksiyon | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde çelik konstrüksiyon, imalat ve montaj işlerini planlar.',
  },
  {
    id: 'kusadasi-cati-tamiri',
    slug: 'kusadasi-cati-tamiri',
    name: 'Çatı Sistemleri',
    category: 'exterior',
    icon: ShieldCheck,
    source: 'demo',
    short: 'Çatı bakım, onarım ve yenileme uygulamaları.',
    text: 'Mevcut çatının durumuna göre bakım, onarım veya yenileme seçeneklerini değerlendiriyoruz. Keşifte kapsamı netleştirip uygun malzeme ve uygulama adımlarını birlikte belirliyoruz.',
    image: px(681333),
    imageAlt: 'Çatı sistemleri uygulamasına dair görsel',
    whatsapp: `Merhaba, çatı tamiri ve yenileme için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Çatı Sistemleri | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde çatı bakımı, onarımı ve yenilemesi sunar.',
  },
  {
    id: 'pergola',
    slug: 'pergola',
    name: 'Pergola & Dış Mekân',
    category: 'outdoor',
    icon: Umbrella,
    source: 'demo',
    short: 'Bahçe, teras ve açık alanlar için pergola uygulamaları.',
    text: 'Bahçe, teras ve açık alanlarınıza uygun pergola ve dış mekân uygulamalarını kullanım amacına göre planlıyoruz. Ölçü, malzeme ve montajı tek süreçte yürütüyoruz.',
    image: px(1643383),
    imageAlt: 'Pergola ve dış mekân uygulamasına dair görsel',
    whatsapp: `Merhaba, pergola ve dış mekân işi için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Pergola & Dış Mekân | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde bahçe, teras ve açık alanlar için pergola uygulamaları sunar.',
  },
  {
    id: 'mantolama',
    slug: 'mantolama',
    name: 'Dış Cephe & Mantolama',
    category: 'exterior',
    icon: Building2,
    source: 'demo',
    short: 'Dış cephe yenileme, boya ve mantolama uygulamaları.',
    text: 'Dış cephe yenileme, boya ve mantolama işlerinde mevcut durumu yerinde değerlendiriyor; uygun sistem ve malzemeyle uygulamayı planlıyoruz.',
    image: px(259588),
    imageAlt: 'Dış cephe ve mantolama uygulamasına dair görsel',
    whatsapp: `Merhaba, dış cephe ve mantolama işi için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Dış Cephe & Mantolama | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde dış cephe yenileme, boya ve mantolama uygulamaları sunar.',
  },
  {
    id: 'kusadasi-prefabrik',
    slug: 'kusadasi-prefabrik',
    name: 'Prefabrik & Konteyner',
    category: 'structural',
    icon: Container,
    source: 'demo',
    short: 'Kullanım amacına göre prefabrik ve konteyner yapı seçenekleri.',
    text: 'Şantiye, depolama veya yaşam alanı ihtiyacına göre prefabrik ve konteyner yapı seçeneklerini değerlendiriyoruz. Kullanım amacını netleştirip uygun çözümü planlıyoruz.',
    image: px(1216589),
    imageAlt: 'Prefabrik ve konteyner yapısına dair görsel',
    whatsapp: `Merhaba, prefabrik veya konteyner yapı için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Prefabrik & Konteyner | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde prefabrik ve konteyner yapı uygulamaları sunar.',
  },
  {
    id: 'seramik-doseme',
    slug: 'seramik-doseme',
    name: 'Seramik & Zemin',
    category: 'interior',
    icon: Hammer,
    source: 'demo',
    short: 'Seramik, zemin kaplama ve döşeme uygulamaları.',
    text: 'Zemin ve duvar kaplamalarında ölçü, malzeme ve işçiliği birlikte planlıyoruz. Seramik ve zemin işlerini tadilat sürecinin parçası olarak yürütüyoruz.',
    image: px(323780),
    imageAlt: 'Seramik ve zemin uygulamasına dair görsel',
    whatsapp: `Merhaba, seramik ve zemin işi için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Seramik & Zemin | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde seramik, zemin kaplama ve döşeme uygulamaları sunar.',
  },
  {
    id: 'kusadasi-boya',
    slug: 'kusadasi-boya',
    name: 'Boya, Alçı & Sıva',
    category: 'interior',
    icon: PaintBucket,
    source: 'demo',
    short: 'Boya, alçı ve sıva ile yüzey hazırlığı ve bitirme işleri.',
    text: 'Yüzey hazırlığı, alçı, sıva ve boya işlerini mekânın mevcut durumuna göre planlıyoruz. Temiz ve düzenli bir bitiş için uygulama adımlarını keşifte netleştiriyoruz.',
    image: px(106399),
    imageAlt: 'Boya, alçı ve sıva uygulamasına dair görsel',
    whatsapp: `Merhaba, boya, alçı ve sıva işi için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Boya, Alçı & Sıva | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde boya, alçı ve sıva uygulamaları sunar.',
  },
  {
    id: 'elektrik',
    slug: 'elektrik',
    name: 'Elektrik & Sıhhi Tesisat',
    category: 'technical',
    icon: Zap,
    source: 'demo',
    short: 'Tadilat ve yapı işleri kapsamında elektrik ve sıhhi tesisat.',
    text: 'Tadilat ve yapı işlerinin parçası olarak elektrik ve sıhhi tesisat uygulamalarını planlayabiliyoruz. Mevcut tesisatın durumuna göre yenileme veya yeni hat ihtiyacını keşifte değerlendiriyoruz.',
    image: px(1396132),
    imageAlt: 'Elektrik ve sıhhi tesisat uygulamasına dair görsel',
    whatsapp: `Merhaba, elektrik ve sıhhi tesisat işi için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Elektrik & Sıhhi Tesisat | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde tadilat kapsamında elektrik ve sıhhi tesisat uygulamaları sunar.',
  },
  {
    id: 'havuz-yapimi',
    slug: 'havuz-yapimi',
    name: 'Havuz Yapımı',
    category: 'outdoor',
    icon: Waves,
    source: 'demo',
    short: 'Yeni havuz yapımı ve mevcut havuzların yenilenmesi.',
    text: 'Yeni havuz yapımı ile mevcut havuzların yenilenmesine yönelik işleri değerlendiriyoruz. Kullanım amacı, alan ve uygulama koşullarına göre kapsamı birlikte netleştiriyoruz.',
    image: px(1080721),
    imageAlt: 'Havuz yapımı uygulamasına dair görsel',
    whatsapp: `Merhaba, havuz yapımı veya yenileme için bilgi ve keşif almak istiyorum.${regionLine}`,
    seoTitle: 'Havuz Yapımı | Kuşadası & Ege Bölgesi | 2M Yapı Market Proje',
    seoDesc: 'Kuşadası merkezli 2M Yapı Market Proje; Ege Bölgesi genelinde yeni havuz yapımı ve mevcut havuz yenileme işlerini değerlendirir.',
  },
];
