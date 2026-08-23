// Surec ve icerik verileri.
// application artik services.ts'ten turetiliyor.

export interface BeforeAfter {
  before: string;
  after: string;
  label: string;
}

const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export const beforeAfter: BeforeAfter = {
  label: 'Yenileme',
  before: px(106400, 900),
  after: px(106399, 900),
};

export const processSteps: [string, string, string][] = [
  ['01', 'Dinliyoruz', 'Yılacak işi, kullanım amacını ve beklentinizi anlamakla başlıyoruz.'],
  ['02', 'Yerinde İnceliyoruz', 'Gerekli durumlarda alanı yerinde değerlendiriyor, uygulama koşullarını netleştiriyoruz.'],
  ['03', 'Planlıyor ve Tekliflendiriyoruz', 'Malzeme, iş kapsamı ve uygulama adımlarını açık bir plan ve teklif haline getiriyoruz.'],
  ['04', 'Uyguluyoruz', 'Planlanan işi uygun ekip ve malzemeyle hayata geçiriyor, süreci düzenli şekilde takip ediyoruz.'],
];

export const faqItems: [string, string][] = [
  [
    'Tadilat ve yapı hizmetlerini hangi bölgelerde veriyorsunuz?',
    'Merkezimiz Kuşadasıında olmakla birlikte Ege Bölgesi genelindeki tadilat, yapı ve uygulama taleplerini değerlendiriyoruz. İşin kapsamına ve konumuna göre keşif ve uygulama planlaması yapıyoruz.',
  ],
  [
    'Anahtar teslim tadilat yıkıyor musunuz?',
    'İşin kapsamına göre malzeme, usta ve uygulama sürelerini birlikte planlayabiliyoruz. Detayları keşif ve iş değerlendirmesi sonrasında netleştiriyoruz.',
  ],
  [
    'Çelik konstrüksiyon işleri yıkıyor musunuz?',
    'Evet. İhtiyaca göre çelik konstrüksiyon, ımalat ve montaj işleri için çözüm sunuyoruz.',
  ],
  [
    'Fotoğraf göndererek ön bilgi alabilir miyim?',
    'Evet. WhatsApp üzerinden mevcut alanın ve yapılacak işin fotoğraflarını gönderebilirsiniz. Böylece ilk değerlendirmeyi daha hızlı yapabiliriz.',
  ],
  [
    'Keşif nasıl yapılıyor?',
    'Önce işinizi ve bulunduğunuz bölgeyi öğreniyoruz. Gerekli durumlarda yerinde inceleme yaparak iş kapsamını ve uygulama koşullarını netleştiriyoruz.',
  ],
  [
    'Çatı tamiri ve yenileme yıkıyor musunuz?',
    'Evet. Çatının mevcut durumuna göre bakım, onarım veya yenileme seçeneklerini değerlendiriyoruz.',
  ],
  [
    'Pergola yapımı hizmetiniz var mı?',
    'Evet. Bahçe, teras ve açık alanlar için ihtiyaca uygun pergola uygulamalarını değerlendiriyoruz.',
  ],
  [
    'Prefabrik ve konteyner uygulamaları yıkıyor musunuz?',
    'Evet. Kullanım amacına ve proje ihtiyacına göre prefabrik ve konteyner yapı seçenekleri sunuyoruz.',
  ],
  [
    'Mantolama ve dış cephe işleri yıkıyor musunuz?',
    'Evet. Dış cephe yenileme, boya ve mantolama uygulamaları hizmetlerimiz arasındadır.',
  ],
  [
    'Elektrik ve sıhhi tesisat hizmetiniz var mı?',
    'Evet. Tadilat ve yapı işleri kapsamında elektrik ve sıhhi tesisat uygulamalarını da planlayabiliyoruz.',
  ],
  [
    'Havuz yapımı yıkıyor musunuz?',
    'Evet. Yeni havuz yapımı ve mevcut havuzların yenilenmesine yönelik işleri değerlendiriyoruz.',
  ],
];
