// Blog yazı verileri — fallback data, CMS'ten yönetilebilir
// Gerçek 2M içerikleriyle değiştirilmek üzere hazırlanmıştır.

const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export type BlogCategory = 'Tadilat' | 'Çatı & Yalıtım' | 'Çelik Yapı' | 'Cephe' | 'Havuz' | 'Proje Yönetimi';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  readingTime: string;
  seoTitle: string;
  seoDesc: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Tadilat',
  'Çatı & Yalıtım',
  'Çelik Yapı',
  'Cephe',
  'Havuz',
  'Proje Yönetimi',
];

export const blogArticles: BlogArticle[] = [
  {
    id: 'villa-tadilatina-baslamadan-once',
    slug: 'villa-tadilatina-baslamadan-once',
    title: 'Villa Tadilatına Başlamadan Önce Bilmeniz Gerekenler',
    category: 'Tadilat',
    excerpt: 'Villa tadilatında doğru planlama, keşif, bütçe ve uygulama sıralamasının neden önemli olduğunu anlat.',
    content: `<h2>Tadilat Sürecinin İlk Adımı: İhtiyacı Netleştirmek</h2>
<p>Villa tadilatı, küçük bir onarım gibi görünse de sürecin doğru planlanmasının temelini oluşturur. İlk adım, neyin değiştirilmesi gerektiğini netleştirmektir.</p>
<p>Bu aşamada şu soruları kendinize yöneltin:</p>
<ul>
<li>Mevcut alanın en büyük sorunu nedir?</li>
<li>Kullanım amacı değişecek mi?</li>
<li>Bütçe aralığınız nedir?</li>
<li>Zaman planlamanız nasıl?</li>
</ul>

<h2>Keşif ve Değerlendirme</h2>
<p>Profesyonel bir keşif, tadilatın maliyetini ve süresini belirler. Uzman ekip, mevcut yapısal durumu, tesisatı ve elektrik altyapısını değerlendirir.</p>
<p>Keşif sırasında şu noktalar değerlendirilir:</p>
<ul>
<li>Yapısal durum ve dayanıklılık</li>
<li>Mevcut tesisat ve elektrik altyapısı</li>
<li>Isı ve ses yalıtımı ihtiyacı</li>
<li>Malzeme seçenekleri ve maliyet karşılaştırması</li>
</ul>

<h2>Bütçe Planlaması</h2>
<p>Tadilat bütçesi belirlerken şu kalemleri hesaba katın:</p>
<ul>
<li>Malzeme maliyeti</li>
<li>İşçilik maliyeti</li>
<li>Beklenmedik giderler için %15-20 pay</li>
<li>Projelendirme ve danışmanlık ücreti</li>
</ul>
<p>Gerçekçi bir bütçe, sürecin sorunsuz ilerlemesini sağlar.</p>

<h2>Uygulama Sıralaması</h2>
<p>Doğru uygulama sıralaması şu şekildedir:</p>
<ol>
<li>Hafriyat ve yıkım işleri</li>
<li>Yapısal güçlendirme</li>
<li>Tesisat ve elektrik</li>
<li>İç cephe uygulamaları</li>
<li>Zemin ve kaplama</li>
<li>Boyama ve son dokunuşlar</li>
</ol>
<p>Her aşama bir sonraki ile bağlantılıdır. Sıralamanın değişmesi zaman ve maliyet kaybına neden olabilir.</p>`,
    image: px(15798781, 1200),
    imageAlt: 'Villa tadilat çalışması — yenileme aşaması',
    readingTime: '6 dk',
    seoTitle: 'Villa Tadilatına Başlamadan Önce Bilmeniz Gerekenler | 2M Yapı Market',
    seoDesc: 'Villa tadilatında doğru planlama, keşif, bütçe ve uygulama sıralaması hakkında bilgiler.',
  },
  {
    id: 'cati-yalitiminda-dogru-sistem',
    slug: 'cati-yalitiminda-dogru-sistem',
    title: 'Çatı Yalıtımında Doğru Sistem Nasıl Seçilir?',
    category: 'Çatı & Yalıtım',
    excerpt: 'Çatı yalıtımında malzeme seçimi, uygulama koşulları ve iklim faktörleri nasıl değerlendirilir?',
    content: `<h2>Çatı Yalıtımının Önemi</h2>
<p>Çatı yalıtımı, bir yapıda enerji verimliliğini doğrudan etkiler. Doğru sistem seçimi, uzun vadede bakım maliyetlerini azaltır ve yaşam konforunu artırır.</p>

<h2>Malzeme Seçenekleri</h2>
<p>Çatı yalıtımında şu malzeme türleri değerlendirilir:</p>
<ul>
<li><strong>XPS (Ekstrüde Polistiren):</strong> Yüksek basınç dayanımı, su geçirmez. Bodrum ve çatı uygulamaları için uygun.</li>
<li><strong>EPS (Genişletilmiş Polistiren):</strong> Ekonomik seçenek, iyi yalıtım değeri.</li>
<li><strong>Mineral Yün:</strong> Yangın dayanımı yüksek, ses yalıtımı sağlar.</li>
<li><strong>PU (Poliüretan):</strong> En yüksek yalıtım değeri, püskürtme uygulama ile kesintisiz tabaka.</li>
</ul>

<h2>İklim Faktörü</h2>
<p>Ege Bölgesi'nde şu koşullar değerlendirilir:</p>
<ul>
<li>Yaz sıcaklığı ve güneş maruziyeti</li>
<li>Kış aylarında yağış ve nem</li>
<li>Rüzgar yükü ve yönü</li>
<li>Bölgesel deprem riski</li>
</ul>
<p>Kuşadası ve çevresi için UV dayanımı yüksek malzemeler tercih edilmelidir.</p>

<h2>Uygulama Koşulları</h2>
<p>Çatı yapısına göre şu seçenekler değerlendirilir:</p>
<ul>
<li>Düz çatılarda su yalıtımı ile birlikte ısı yalıtımı</li>
<li>Eğimli çatılarda ventilli çatı sistemi</li>
<li>Çelik çatılarda çelik konstrüksiyon ile uyumlu yalıtım</li>
</ul>
<p>Her çatı tipi için farklı uygulama yöntemleri mevcuttur. Keşifte hangi sistemin uygun olduğu belirlenir.</p>`,
    image: px(31771166, 1200),
    imageAlt: 'Çatı yalıtım uygulaması — malzeme montajı',
    readingTime: '5 dk',
    seoTitle: 'Çatı Yalıtımında Doğru Sistem Nasıl Seçilir? | 2M Yapı Market',
    seoDesc: 'Çatı yalıtımında malzeme seçimi, iklim faktörleri ve uygulama koşulları hakkında bilgiler.',
  },
  {
    id: 'celik-yapi-mi-betonarme-mi',
    slug: 'celik-yapi-mi-betonarme-mi',
    title: 'Çelik Yapı mı Betonarme mi?',
    category: 'Çelik Yapı',
    excerpt: 'Doğru tercih, projenin ihtiyacına göre değişir. Her iki sistemin avantajlarını ve kullanım alanlarını karşılaştırın.',
    content: `<h2>Çelik ve Betonarme: Doğru Tercih Projeye Göre Belirlenir</h2>
<p>Yapı seçiminde tek bir "en iyi sistem" yoktur. Doğru tercih, projenin ihtiyacına, bütçesine ve kullanım amacına göre değişir.</p>

<h2>Çelik Yapının Avantajları</h2>
<ul>
<li><strong>Hızlı montaj:</strong> Fabrikada üretilen elemanlar sahada hızlıca monte edilir.</li>
<li><strong>Esnek tasarım:</strong> Büyük açıklıklar ve farklı planlama seçenekleri.</li>
<li><strong>Deprem dayanımı:</strong> Yüksek süneklik özelliği.</li>
<li><strong>Yeniden kullanılabilirlik:</strong> Sökülüp başka yerde yeniden kurulabilir.</li>
<li><strong>Hafif ağırlık:</strong> Temel yüklerini azaltır.</li>
</ul>

<h2>Betonarmanın Avantajları</h2>
<ul>
<li><strong>Yangın dayanımı:</strong> Doğal olarak yüksek yangın direnci.</li>
<li><strong>Kütle etkisi:</strong> Isı kütlesi ile doğal iklimlendirme.</li>
<li><strong>Düşük bakım:</strong> Uzun vadede bakım maliyeti düşüktür.</li>
<li><strong>Yerel malzeme:</strong> Bölgesel tedarik kolaylığı.</li>
</ul>

<h2>Hangi Durumda Hangi Tercih?</h2>
<table>
<tr><th>Proje Türü</th><th>Önerilen Sistem</th></tr>
<tr><td>Deprem bölgesinde hızlı yapılaşma</td><td>Çelik</td></tr>
<tr><td>Büyük açıklık gerektiren endüstriyel yapı</td><td>Çelik</td></tr>
<tr><td>Konut projesi (düşük bakım)</td><td>Betonarme</td></tr>
<tr><td>Geçici yapı / şantiye</td><td>Çelik</td></tr>
<tr><td>Yüksek katlı bina</td><td>Betonarme + Çelik hibrit</td></tr>
</table>

<h2>Karar Süreci</h2>
<p>Doğru kararı vermek için şu faktörler değerlendirilir:</p>
<ul>
<li>Proje büyüklüğü ve karmaşıklığı</li>
<li>Bütçe ve zaman kısıtlamaları</li>
<li>Bölgesel deprem riski</li>
<li>Uzun vadeli bakım planlaması</li>
</ul>
<p>Keşif ve değerlendirme aşamasında bu faktörler detaylı olarak incelenir.</p>`,
    image: px(16045267, 1200),
    imageAlt: 'Çelik konstrüksiyon montajı — kaynak çalışması',
    readingTime: '7 dk',
    seoTitle: 'Çelik Yapı mı Betonarme mi? | 2M Yapı Market',
    seoDesc: 'Çelik ve betonarme yapı sistemlerinin karşılaştırması, avantajları ve kullanım alanları.',
  },
  {
    id: 'dis-cephe-yenileme',
    slug: 'dis-cephe-yenileme',
    title: 'Dış Cephe Yenilemesinde Nelere Dikkat Edilmeli?',
    category: 'Cephe',
    excerpt: 'Dış cephe yenileme sürecinde malzeme seçimi, uygulama yöntemleri ve dikkat edilmesi gereken noktalar.',
    content: `<h2>Dış Cephe Yenilemenin Önemi</h2>
<p>Dış cephe, bir yapıyı dış etkenlerden korumanın ilk savunma hattıdır. Doğru yenileme, yapı ömrünü uzatır ve enerji verimliliğini artırır.</p>

<h2>Mevcut Durum Değerlendirmesi</h2>
<p>Yenileme öncesi şu noktalar kontrol edilmelidir:</p>
<ul>
<li>Duvar yüzeyinde çatlak ve dökülme</li>
<li>Nem ve küf oluşumu</li>
<li>Mantolama levhasında kabarma</li>
<li>Boya ve kaplama durumu</li>
<li>Su tahliye sistemi</li>
</ul>

<h2>Malzeme Seçimi</h2>
<p>Ege Bölgesi'nde şu malzemeler değerlendirilir:</p>
<ul>
<li><strong>Mineral sıva:</strong> Nefes alabilir, nem dengesi sağlar.</li>
<li><strong>Silikonlu boya:</strong> Su itici, uzun ömürlü.</li>
<li><strong>Akrilik boya:</strong> Esnek, çatlak köprüleme özelliğine sahip.</li>
<li><strong>Bordex:</strong> Dekoratif, yüksek dayanıklılık.</li>
</ul>

<h2>Uygulama Süreci</h2>
<ol>
<li>Mevcut yüzeyin temizlenmesi ve hazırlanması</li>
<li>Çatlakların onarılması</li>
<li>Primer uygulaması</li>
<li>Sıva veya kaplama uygulaması</li>
<li>Boya uygulaması</li>
<li>Son kontrol ve temizlik</li>
</ol>
<p>Her aşama arasında kontrol edilmelidir.</p>`,
    image: px(6124239, 1200),
    imageAlt: 'Dış cephe yenileme çalışması — mantolama uygulaması',
    readingTime: '5 dk',
    seoTitle: 'Dış Cephe Yenilemesinde Nelere Dikkat Edilmeli? | 2M Yapı Market',
    seoDesc: 'Dış cephe yenileme sürecinde malzeme seçimi, uygulama yöntemleri ve dikkat noktaları.',
  },
  {
    id: 'havuz-yapimi-oncesi',
    slug: 'havuz-yapimi-oncesi',
    title: 'Havuz Yapımı Öncesinde Bilinmesi Gerekenler',
    category: 'Havuz',
    excerpt: 'Havuz yapımında planlama, ruhsat, malzeme seçimi ve uygulama süreçleri hakkında bilgiler.',
    content: `<h2>Havuz Yapımının Temel Aşamaları</h2>
<p>Havuz yapımı, detaylı planlama gerektiren bir süreçtir. Doğru adımlar, uzun yıllar sorunsuz kullanıma olanak tanır.</p>

<h2>Planlama Aşaması</h2>
<ul>
<li><strong>Alan değerlendirmesi:</strong> Zemin yapısı, eğim ve drenaj koşulları</li>
<li><strong>Kullanım amacı:</strong> Yüzme havuzu, süs havuzu veya termal havuz</li>
<li><strong>Boyut ve derinlik:</strong> Kullanıcı sayısına ve amaca göre</li>
<li><strong>Malzeme seçimi:</strong> Betonarme, liner veya cam lif</li>
</ul>

<h2>Ruhsat ve İzinler</h2>
<p>Türkiye'de havuz yapımı için şu izinler gereklidir:</p>
<ul>
<li>Yapı ruhsatı</li>
<li>İmar durum belgesi</li>
<li>Komşu muvafakatnamesi (gerekli durumlarda)</li>
<li>İskan belgesi (proje tamamlandığında)</li>
</ul>

<h2>Malzeme Seçenekleri</h2>
<table>
<tr><th>Malzeme</th><th>Avantajı</th><th>Dezavantajı</th></tr>
<tr><td>Betonarme</td><td>Dayanıklı, özelleştirilebilir</td><td>Yüksek maliyet, uzun süre</td></tr>
<tr><td>Liner</td><td>Hızlı uygulama, ekonomik</td><td>Sınırlı ömür</td></tr>
<tr><td>Cam lif</td><td>Pürüzsüz yüzey, orta maliyet</td><td>Çatlak riski</td></tr>
</table>

<h2>Bakım ve İşletme</h2>
<p>Havuz yapımı kadar önemli olan bir diğer konu düzenli bakım ve işletmedir:</p>
<ul>
<li>Su kalitesi kontrolü</li>
<li>Filtre temizliği</li>
<li>Kimyasal dengeleme</li>
<li>Mekanik ekipman bakımı</li>
</ul>`,
    image: px(9379484, 1200),
    imageAlt: 'Havuz yapım çalışması — betonarme havuz kabuğu',
    readingTime: '6 dk',
    seoTitle: 'Havuz Yapımı Öncesinde Bilinmesi Gerekenler | 2M Yapı Market',
    seoDesc: 'Havuz yapımında planlama, ruhsat, malzeme seçimi ve uygulama süreçleri.',
  },
  {
    id: 'tadilat-maliyeti-nasil-belirlenir',
    slug: 'tadilat-maliyeti-nasil-belirlenir',
    title: 'Tadilat Maliyeti Nasıl Belirlenir?',
    category: 'Proje Yönetimi',
    excerpt: 'Tadilat maliyetlerini etkileyen temel değişkenler ve bütçe planlaması hakkında bilgiler.',
    content: `<h2>Tadilat Maliyetini Etkileyen Faktörler</h2>
<p>Her tadilat projesi farklıdır ve maliyet, birçok değişkene bağlı olarak belirlenir. Sabit bir fiyat listesi yerine, projenin kapsamına göre değerlendirme yapılması gerekir.</p>

<h2>Temel Maliyet Değişkenleri</h2>
<ul>
<li><strong>Alan büyüklüğü:</strong> Metrekare cinsinden yapılacak işin kapsamı</li>
<li><strong>Kapsam:</strong> Sadece boya mı, yoksa komple yenileme mi?</li>
<li><strong>Malzeme kalitesi:</strong> Segment ve marka tercihi</li>
<li><strong>İşçilik:</strong> Uzmanlık alanı ve iş gücü ihtiyacı</li>
<li><strong>Proje karmaşıklığı:</strong> Tasarım detayları ve uygulama zorluğu</li>
<li><strong>Lojistik:</strong> Malzeme taşınması ve saha koşulları</li>
</ul>

<h2>Maliyet Kalemleri</h2>
<ol>
<li><strong>Keşif ve projelendirme:</strong> Uzman incelemesi ve planlama</li>
<li><strong>Hafriyat ve yıkım:</strong> Mevcut yapının sökülmesi</li>
<li><strong>Malzeme:</strong> Tüm inşaat malzemeleri</li>
<li><strong>İşçilik:</strong> Usta ve yardımcı iş gücü</li>
<li><strong>Tesisat:</strong> Elektrik ve sıhhi tesisat</li>
<li><strong>Bitirme:</strong> Boya, kaplama ve son dokunuşlar</li>
</ol>

<h2>Bütçe Planlaması İpuçları</h2>
<ul>
<li>Proje başlamadan önce net bir keşif yaptırın</li>
<li>Bütçenizin %15-20'sini beklenmedik giderler için ayırın</li>
<li>Malzeme fiyatlarını karşılaştırın</li>
<li>Referans projeleri inceleyin</li>
<li>Yazılı teklif ve sözleşme talep edin</li>
</ul>
<p>Doğru planlama, sürpriz maliyetleri önler ve sürecin sorunsuz ilerlemesini sağlar.</p>`,
    image: px(5691622, 1200),
    imageAlt: 'Tadilat projesi planlama çalışması',
    readingTime: '5 dk',
    seoTitle: 'Tadilat Maliyeti Nasıl Belirlenir? | 2M Yapı Market',
    seoDesc: 'Tadilat maliyetlerini etkileyen temel değişkenler ve bütçe planlaması.',
  },
];
