// Sureç ve icerik verileri — V5 kurumsal guncelleme

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
  alt: 'Yenileme ve tadilat uygulamasından profesyonel görünüm',
};

export const processSteps: [string, string, string][] = [
  ['01', 'İhtiyaç', 'İş kapsamını ve beklentiyi netleştiriyoruz.'],
  ['02', 'Keşif', 'Gerekli durumlarda alanı yerinde inceliyoruz.'],
  ['03', 'Teklif & Plan', 'Malzeme, işçilik ve uygulama adımlarını planlıyoruz.'],
  ['04', 'Uygulama', 'Süreci uygun ekiplerle yürütüyoruz.'],
  ['05', 'Kontrol', 'İş kapsamını teslim öncesinde kontrol ediyoruz.'],
];

export const faqItems: [string, string][] = [
  [
    'Keşif süreci nasıl ilerliyor?',
    'Önce ihtiyacınızı ve bulunduğunuz bölgeyi öğreniyoruz. Gerekli durumlarda yerinde inceleme yaparak iş kapsamını ve uygulama koşullarını netleştiriyoruz.',
  ],
  [
    'Hangi bölgelerde hizmet veriyorsunuz?',
    'Merkezimiz Kuşadası\'nda. Aydın, İzmir, Muğla, Manisa, Denizli ve Ege Bölgesi genelindeki yapı ve uygulama taleplerini değerlendiriyoruz.',
  ],
  [
    'Birden fazla işi aynı proje kapsamında yürütebilir misiniz?',
    'Evet. Tadilat, çelik, çatı, cephe, tesisat gibi farklı iş kalemlerini tek çatı altında planlayabilir ve yürütebiliriz.',
  ],
  [
    'Malzeme ve işçilik birlikte planlanabiliyor mu?',
    'Evet. Malzeme tedariki ve uygulama işçiliğini birlikte planlayarak süreci tek noktadan yönetiyoruz.',
  ],
  [
    'Çelik konstrüksiyon ve çatı uygulamalarınız var mı?',
    'Evet. Çelik konstrüksiyon imalatı, çatı sistemleri, kenet çatı, çelik çatı ve mantolama uygulamaları hizmetlerimiz arasındadır.',
  ],
  [
    'Fotoğraf göndererek ön değerlendirme alabilir miyim?',
    'Evet. WhatsApp üzerinden mevcut alanın ve yapılacak işin fotoğraflarını gönderebilirsiniz. Böylece ilk değerlendirmeyi daha hızlı yapabiliriz.',
  ],
  [
    'Anahtar teslim çalışabiliyor musunuz?',
    'İşin kapsamına göre malzeme, usta ve uygulama süreçlerini birlikte planlayabiliyoruz. Detayları keşif ve ihtiyaç değerlendirmesi sonrasında netleştiriyoruz.',
  ],
  [
    'Havuz yapımı ve yenileme hizmetiniz var mı?',
    'Evet. Yeni havuz yapımı ve mevcut havuzların yenilenmesine yönelik uygulamalar gerçekleştiriyoruz.',
  ],
];
