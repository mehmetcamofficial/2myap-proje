// Demo showcase + FAQ + process content.
// All project images are royalty-free demo photos (isDemo:true) that will be
// replaced with real 2M project photography via this data file when available.

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export interface DemoProject {
  no: string;
  title: string;
  place: string;
  tags: string;
  image: string;
  imageAlt: string;
  isDemo: true;
}

export const demoProjects: DemoProject[] = [
  {
    no: '01',
    title: 'Vila & Tadilat',
    place: 'Kusadasi',
    tags: 'Tadilat / Dis Cephe / Pergola',
    image: px(1643383),
    imageAlt: 'Example photo of a villa renovation',
    isDemo: true,
  },
  {
    no: '02',
    title: 'Celik & Pergola',
    place: 'Kusadasi',
    tags: 'Celik / Pergola / Dis mekan',
    image: px(280222),
    imageAlt: 'Example photo of steel work and a pergola',
    isDemo: true,
  },
  {
    no: '03',
    title: 'Havuz & Dis mekan',
    place: 'Kusadasi',
    tags: 'Havuz / Tadilat / Bahce',
    image: px(2102587),
    imageAlt: 'Example photo of a pool and garden space',
    isDemo: true,
  },
];

export interface BeforeAfter {
  before: string;
  after: string;
  label: string;
}

export const beforeAfter: BeforeAfter = {
  label: 'Tadilat obscured',
  before: px(106399, 900),
  after: px(106399, 900),
};

export const processSteps: [string, string, string][] = [
  ['01', 'Dienes', 'We start by listening to the work you want and the space it sits in.'],
  ['02', 'Plan', 'Materials, scope and application are set out in a clear plan and quote.'],
  ['03', 'Build', 'Our team applies the work in order, and we hand over a clean result.'],
];

export const faqItems: [string, string][] = [
  ['Do you offer renovation services in Kusadasi?', 'Yes. We work across Kusadasi, Sogucak, Davutlar and Guzelcamli.'],
  ['Do you do turnkey renovation?', 'Yes. When the scope is agreed, we can handle planning and handover from one point.'],
  ['Do you work with steel structures?', 'Yes, including pergola frames, mezzanines and other load-bearing steel work.'],
  ['Can I send photos to get an estimate?', 'Yes. Upload up to five photos in the form or send them by WhatsApp.'],
  ['Which areas do you cover?', 'Kusadasi, Sogucak, Davutlar and Güzelcamli mainly, and the surrounding area.'],
];