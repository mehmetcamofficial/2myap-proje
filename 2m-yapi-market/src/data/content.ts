// Surec ve icerik verileri.
// application artik services.ts'ten turetiliyor.

export interface BeforeAfter {
  image: string;
  label: string;
  alt: string;
}

const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export const beforeAfter: BeforeAfter = {
  label: 'Dönüşüm',
  image: px(5691622, 900),
  alt: 'Yapı yenileme ve tadilat uygulamasından görünüm',
};

export const processSteps: [string, string, string][] = [
  ['01', 'Dinliyoruz', 'Yapılacak işi, kullanım amacını ve beklentinizi anlamakla başlıyoruz.'],
  ['02', 'Yerinde İnceliyoruz', 'Gerekli durumlarda alanı yerinde değerlendiriyor, uygulama koşullarını netleştiriyoruz.'],
  ['03', 'Planlıyor ve Tekliflendiriyoruz', 'Malzeme, iş kapsamı ve uygulama adımlarını açık bir plan ve teklif haline getiriyoruz.'],
  ['04', 'Uyguluyoruz', 'Planlanan işi uygun ekip ve malzemeyle hayata geçiriyor, süreci düzenli şekilde takip ediyoruz.'],
];

export const faqItems: [string, string][] = [
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
    'Evet. Bahçe, teras ve açık alanlar için ihtiyaca uygun pergola uygulamaları yapıyoruz.',
  ],
  [
    'Prefabrik ve konteyner uygulamaları yapıyor musunuz?',
    'Evet. Kullanım amacına ve proje ihtiyacına göre prefabrik ve konteyner yapı çözümleri sunuyoruz.',
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
    'Evet. Yeni havuz yapımı ve mevcut havuzların yenilenmesine yönelik uygulamalar gerçekleştiriyoruz.',
  ],
  [
    'Anahtar teslim tadilat yapıyor musunuz?',
    'İşin kapsamına göre malzeme, usta ve uygulama süreçlerini birlikte planlayabiliyoruz. Detayları keşif ve ihtiyaç değerlendirmesi sonrasında netleştiriyoruz.',
  ],
  [
    'Fotoğraf göndererek ön bilgi alabilir miyim?',
    'Evet. WhatsApp üzerinden mevcut alanın ve yapılacak işin fotoğraflarını gönderebilirsiniz. Böylece ilk değerlendirmeyi daha hızlı yapabiliriz.',
  ],
  [
    'Hangi bölgelere hizmet veriyorsunuz?',
    'Merkezimiz Kuşadası\'nda olmakla birlikte Ege Bölgesi genelindeki yapı, tadilat ve uygulama taleplerini değerlendiriyoruz.',
  ],
];
