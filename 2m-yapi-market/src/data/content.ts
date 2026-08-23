// Uygulama alanları, SSS ve süreç içerikleri.
// Görseller stok fotoğraftır (source:'demo'); arayüzde kaynak etiketi gösterilmez
// ve tamamlanmış 2M işi olarak sunulmaz.

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export interface ApplicationArea {
  no: string;
  title: string;
  tags: string;
  image: string;
  imageAlt: string;
  source: 'demo' | 'business';
}

export const applicationAreas: ApplicationArea[] = [
  {
    no: '01',
    title: 'Tadilat & Yenileme',
    tags: 'İç mekân · Dekorasyon · Yenileme',
    image: px(1643383),
    imageAlt: 'Tadilat ve yenileme uygulamasına dair görsel',
    source: 'demo',
  },
  {
    no: '02',
    title: 'Çelik Konstrüksiyon',
    tags: 'Çelik · İmalat · Montaj',
    image: px(280222),
    imageAlt: 'Çelik konstrüksiyon uygulamasına dair görsel',
    source: 'demo',
  },
  {
    no: '03',
    title: 'Pergola & Dış Mekân',
    tags: 'Pergola · Teras · Bahçe',
    image: px(2102587),
    imageAlt: 'Pergola ve dış mekân uygulamasına dair görsel',
    source: 'demo',
  },
  {
    no: '04',
    title: 'Çatı Sistemleri',
    tags: 'Çatı · Onarım · Yenileme',
    image: px(681333),
    imageAlt: 'Çatı sistemleri uygulamasına dair görsel',
    source: 'demo',
  },
  {
    no: '05',
    title: 'Cephe & Mantolama',
    tags: 'Dış cephe · Mantolama · Boya',
    image: px(259588),
    imageAlt: 'Dış cephe ve mantolama uygulamasına dair görsel',
    source: 'demo',
  },
  {
    no: '06',
    title: 'Havuz Uygulamaları',
    tags: 'Havuz · Yenileme · Dış alan',
    image: px(1080721),
    imageAlt: 'Havuz uygulamasına dair görsel',
    source: 'demo',
  },
];

export interface BeforeAfter {
  before: string;
  after: string;
  label: string;
}

export const beforeAfter: BeforeAfter = {
  label: 'Yenileme',
  before: px(106400, 900),
  after: px(106399, 900),
};

export const processSteps: [string, string, string][] = [
  ['01', 'Dinliyoruz', 'Yapılacak işi, kullanım amacını ve beklentinizi anlamakla başlıyoruz.'],
  ['02', 'Yerinde İnceliyoruz', 'Gerekli durumlarda alanı yerinde değerlendiriyor, uygulama koşullarını netleştiriyoruz.'],
  ['03', 'Planlıyor ve Tekliflendiriyoruz', 'Malzeme, iş kapsamı ve uygulama adımlarını açık bir plan ve teklif hâline getiriyoruz.'],
  ['04', 'Uyguluyoruz', 'Planlanan işi uygun ekip ve malzemeyle hayata geçiriyor, süreci düzenli şekilde takip ediyoruz.'],
];

export const faqItems: [string, string][] = [
  [
    'Tadilat ve yapı hizmetlerini hangi bölgelerde veriyorsunuz?',
    'Merkezimiz Kuşadası\'nda olmakla birlikte Ege Bölgesi genelindeki tadilat, yapı ve uygulama taleplerini değerlendiriyoruz. İşin kapsamına ve konumuna göre keşif ve uygulama planlaması yapıyoruz.',
  ],
  [
    'Anahtar teslim tadilat yapıyor musunuz?',
    'İşin kapsamına göre malzeme, usta ve uygulama süreçlerini birlikte planlayabiliyoruz. Detayları keşif ve ihtiyaç değerlendirmesi sonrasında netleştiriyoruz.',
  ],
  [
    'Çelik konstrüksiyon işleri yapıyor musunuz?',
    'Evet. İhtiyaca göre çelik konstrüksiyon, imalat ve montaj işleri için çözüm sunuyoruz.',
  ],
  [
    'Fotoğraf göndererek ön bilgi alabilir miyim?',
    'Evet. WhatsApp üzerinden mevcut alanın ve yapılacak işin fotoğraflarını gönderebilirsiniz. Böylece ilk değerlendirmeyi daha hızlı yapabiliriz.',
  ],
  [
    'Keşif nasıl yapılıyor?',
    'Önce ihtiyacınızı ve bulunduğunuz bölgeyi öğreniyoruz. Gerekli durumlarda yerinde inceleme yaparak iş kapsamını ve uygulama koşullarını netleştiriyoruz.',
  ],
  [
    'Çatı tamiri ve yenileme yapıyor musunuz?',
    'Evet. Çatının mevcut durumuna göre bakım, onarım veya yenileme seçeneklerini değerlendiriyoruz.',
  ],
  [
    'Pergola yapımı hizmetiniz var mı?',
    'Evet. Bahçe, teras ve açık alanlar için ihtiyaca uygun pergola uygulamalarını değerlendiriyoruz.',
  ],
  [
    'Prefabrik ve konteyner uygulamaları yapıyor musunuz?',
    'Evet. Kullanım amacına ve proje ihtiyacına göre prefabrik ve konteyner yapı seçenekleri sunuyoruz.',
  ],
  [
    'Mantolama ve dış cephe işleri yapıyor musunuz?',
    'Evet. Dış cephe yenileme, boya ve mantolama uygulamaları hizmetlerimiz arasındadır.',
  ],
  [
    'Elektrik ve sıhhi tesisat hizmetiniz var mı?',
    'Evet. Tadilat ve yapı işleri kapsamında elektrik ve sıhhi tesisat uygulamalarını da planlayabiliyoruz.',
  ],
  [
    'Havuz yapımı yapıyor musunuz?',
    'Evet. Yeni havuz yapımı ve mevcut havuzların yenilenmesine yönelik işleri değerlendiriyoruz.',
  ],
];
