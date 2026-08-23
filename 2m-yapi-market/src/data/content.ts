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
  ['01', 'Dinliyoruz', 'Y\u0131lacak i\u015Fi, kullan\u0131m amac\u0131n\u0131 ve beklentinizi anlamakla ba\u015Fl\u0131yoruz.'],
  ['02', 'Yerinde \u0130nceliyoruz', 'Gerekli durumlarda alan\u0131 yerinde de\u011Ferlendiriyor, uygulama ko\u015Fullar\u0131n\u0131 netle\u015Ftiriyoruz.'],
  ['03', 'Planl\u0131yor ve Tekliflendiriyoruz', 'Malzeme, i\u015F kapsam\u0131 ve uygulama ad\u0131mlar\u0131n\u0131 a\u00E7\u0131k bir plan ve teklif haline getiriyoruz.'],
  ['04', 'Uyguluyoruz', 'Planlanan i\u015Fi uygun ekip ve malzemeyle hayata ge\u00E7iriyor, s\u00FCreci d\u00FCzenli \u015Fekilde takip ediyoruz.'],
];

export const faqItems: [string, string][] = [
  [
    'Tadilat ve yap\u0131 hizmetlerini hangi b\u00F6lgelerde veriyorsunuz?',
    'Merkezimiz Ku\u015Fadas\u0131\u0131nda olmakla birlikte Ege B\u00F6lgesi genelindeki tadilat, yap\u0131 ve uygulama taleplerini de\u011Ferlendiriyoruz. \u0130\u015Fin kapsam\u0131na ve konumuna g\u00F6re ke\u015Fif ve uygulama planlamas\u0131 yap\u0131yoruz.',
  ],
  [
    'Anahtar teslim tadilat y\u0131k\u0131yor musunuz?',
    '\u0130\u015Fin kapsam\u0131na g\u00F6re malzeme, usta ve uygulama s\u00FCrelerini birlikte planlayabiliyoruz. Detaylar\u0131 ke\u015Fif ve i\u015F de\u011Ferlendirmesi sonras\u0131nda netle\u015Ftiriyoruz.',
  ],
  [
    '\u00C7elik konstr\u00FCksiyon i\u015Fleri y\u0131k\u0131yor musunuz?',
    'Evet. \u0130htiyaca g\u00F6re \u00E7elik konstr\u00FCksiyon, \u0131malat ve montaj i\u015Fleri i\u00E7in \u00E7\u00F6z\u00FCm sunuyoruz.',
  ],
  [
    'Foto\u011Fraf g\u00F6ndererek \u00F6n bilgi alabilir miyim?',
    'Evet. WhatsApp \u00FCzerinden mevcut alan\u0131n ve yap\u0131lacak i\u015Fin foto\u011Fraflar\u0131n\u0131 g\u00F6nderebilirsiniz. B\u00F6ylece ilk de\u011Ferlendirmeyi daha h\u0131zl\u0131 yapabiliriz.',
  ],
  [
    'Ke\u015Fif nas\u0131l yap\u0131l\u0131yor?',
    '\u00D6nce i\u015Finizi ve bulundu\u011Funuz b\u00F6lgeyi \u00F6\u011Freniyoruz. Gerekli durumlarda yerinde inceleme yaparak i\u015F kapsam\u0131n\u0131 ve uygulama ko\u015Fullar\u0131n\u0131 netle\u015Ftiriyoruz.',
  ],
  [
    '\u00C7at\u0131 tamiri ve yenileme y\u0131k\u0131yor musunuz?',
    'Evet. \u00C7at\u0131n\u0131n mevcut durumuna g\u00F6re bak\u0131m, onar\u0131m veya yenileme se\u00E7eneklerini de\u011Ferlendiriyoruz.',
  ],
  [
    'Pergola yap\u0131m\u0131 hizmetiniz var m\u0131?',
    'Evet. Bah\u00E7e, teras ve a\u00E7\u0131k alanlar i\u00E7in ihtiyaca uygun pergola uygulamalar\u0131n\u0131 de\u011Ferlendiriyoruz.',
  ],
  [
    'Prefabrik ve konteyner uygulamalar\u0131 y\u0131k\u0131yor musunuz?',
    'Evet. Kullan\u0131m amac\u0131na ve proje ihtiyac\u0131na g\u00F6re prefabrik ve konteyner yap\u0131 se\u00E7enekleri sunuyoruz.',
  ],
  [
    'Mantolama ve d\u0131\u015F cephe i\u015Fleri y\u0131k\u0131yor musunuz?',
    'Evet. D\u0131\u015F cephe yenileme, boya ve mantolama uygulamalar\u0131 hizmetlerimiz aras\u0131ndad\u0131r.',
  ],
  [
    'Elektrik ve s\u0131hhi tesisat hizmetiniz var m\u0131?',
    'Evet. Tadilat ve yap\u0131 i\u015Fleri kapsam\u0131nda elektrik ve s\u0131hhi tesisat uygulamalar\u0131n\u0131 da planlayabiliyoruz.',
  ],
  [
    'Havuz yap\u0131m\u0131 y\u0131k\u0131yor musunuz?',
    'Evet. Yeni havuz yap\u0131m\u0131 ve mevcut havuzlar\u0131n yenilenmesine y\u00F6nelik i\u015Fleri de\u011Ferlendiriyoruz.',
  ],
];
