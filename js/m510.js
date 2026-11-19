// SakuSKO — teks, isian, dan sumber Modul 5 (skinfold & somatotipe) dan Modul 10 (sweat rate & hidrasi).
export const M510_REF = {
  jp: { ref: 'Jackson AS, Pollock ML. Generalized equations for predicting body density of men. Br J Nutr. 1978;40(3):497-504.', doi: '10.1079/bjn19780152' },
  jpw: { ref: 'Jackson AS, Pollock ML, Ward A. Generalized equations for predicting body density of women. Med Sci Sports Exerc. 1980;12(3):175-81.', doi: null },
  dw: { ref: 'Durnin JV, Womersley J. Body fat assessed from total body density and its estimation from skinfold thickness: measurements on 481 men and women aged from 16 to 72 years. Br J Nutr. 1974;32(1):77-97.', doi: '10.1079/bjn19740060' },
  siri: { ref: 'Siri WE. Body composition from fluid spaces and density: analysis of methods. In: Brozek J, Henschel A, editors. Techniques for measuring body composition. Washington DC: National Academy of Sciences; 1961. p. 223-44.', doi: null },
  h13: { ref: 'Hastuti J, Kagawa M, Byrne NM, Hills AP. Development and validation of anthropometric prediction equations for estimation of body fat in Indonesian men. Asia Pac J Clin Nutr. 2013;22(4):522-9.', doi: '10.6133/apjcn.2013.22.4.14' },
  h18: { ref: 'Hastuti J, Kagawa M, Byrne NM, Hills AP. Anthropometry to assess body fat in Indonesian adults. Asia Pac J Clin Nutr. 2018;27(3):592-8.', doi: '10.6133/apjcn.092017.02' },
  ackland: { ref: 'Ackland TR, Lohman TG, Sundgot-Borgen J, Maughan RJ, Meyer NL, Stewart AD, et al. Current status of body composition assessment in sport. Sports Med. 2012;42(3):227-49.', doi: '10.2165/11597140-000000000-00000' },
  carter: { ref: 'Carter JEL. The Heath-Carter anthropometric somatotype: instruction manual. San Diego (CA): San Diego State University; 2002.', doi: null },
  sawka: { ref: 'American College of Sports Medicine; Sawka MN, Burke LM, Eichner ER, Maughan RJ, Montain SJ, Stachenfeld NS. American College of Sports Medicine position stand. Exercise and fluid replacement. Med Sci Sports Exerc. 2007;39(2):377-90.', doi: '10.1249/mss.0b013e31802ca597' },
  nata: { ref: "McDermott BP, Anderson SA, Armstrong LE, Casa DJ, Cheuvront SN, Cooper L, et al. National Athletic Trainers' Association position statement: fluid replacement for the physically active. J Athl Train. 2017;52(9):877-95.", doi: '10.4085/1062-6050-52.9.02' },
  eah: { ref: 'Hew-Butler T, Rosner MH, Fowkes-Godek S, Dugas JP, Hoffman MD, Lewis DP, et al. Statement of the Third International Exercise-Associated Hyponatremia Consensus Development Conference, Carlsbad, California, 2015. Clin J Sport Med. 2015;25(4):303-20.', doi: '10.1097/JSM.0000000000000221' },
};

const mm = { id: 'mm', en: 'mm' }, cm = { id: 'cm', en: 'cm' };
// Titik ukur (lipatan dalam mm; lebar & lingkar dalam cm)
export const SITES = {
  tri: { label: { id: 'Triseps', en: 'Triceps' }, unit: mm, lim: [2, 60] },
  bic: { label: { id: 'Biseps', en: 'Biceps' }, unit: mm, lim: [2, 60] },
  sub: { label: { id: 'Subskapula', en: 'Subscapular' }, unit: mm, lim: [2, 70] },
  ic: { label: { id: 'Krista iliaka (ISAK)', en: 'Iliac crest (ISAK)' }, unit: mm, lim: [2, 70], hint: { id: 'Persamaan Hastuti dan Durnin-Womersley untuk pengguna Indonesia memakai titik krista iliaka ISAK.', en: 'Hastuti and Durnin-Womersley for Indonesian users use the ISAK iliac crest site.' } },
  ss: { label: { id: 'Supraspinale (ISAK)', en: 'Supraspinale (ISAK)' }, unit: mm, lim: [2, 70], hint: { id: 'Dahulu disebut suprailiaka; berbeda dari titik krista iliaka.', en: 'Formerly called suprailiac; differs from the iliac crest site.' } },
  abd: { label: { id: 'Abdomen', en: 'Abdominal' }, unit: mm, lim: [2, 80] },
  chest: { label: { id: 'Dada', en: 'Chest' }, unit: mm, lim: [2, 60] },
  thigh: { label: { id: 'Paha', en: 'Thigh' }, unit: mm, lim: [2, 80] },
  sil: { label: { id: 'Suprailiaka (protokol Jackson-Pollock)', en: 'Suprailiac (Jackson-Pollock protocol)' }, unit: mm, lim: [2, 70] },
  calf: { label: { id: 'Betis medial', en: 'Medial calf' }, unit: mm, lim: [2, 60] },
  hum: { label: { id: 'Lebar biepikondilus humerus', en: 'Biepicondylar humerus breadth' }, unit: cm, lim: [4, 10], dec: true },
  fem: { label: { id: 'Lebar biepikondilus femur', en: 'Biepicondylar femur breadth' }, unit: cm, lim: [6, 14], dec: true },
  arm: { label: { id: 'Lingkar lengan fleksi dan tegang', en: 'Arm girth, flexed and tensed' }, unit: cm, lim: [15, 60], dec: true },
  calfg: { label: { id: 'Lingkar betis maksimal', en: 'Maximal calf girth' }, unit: cm, lim: [20, 60], dec: true },
  target: { label: { id: 'Target %lemak', en: 'Target %fat' }, unit: { id: '%', en: '%' }, lim: [3, 50], dec: true, opt: true },
};
// Persamaan %lemak
export const EQS = {
  hastuti: { sex: 'M', sites: ['tri', 'bic', 'sub', 'ic'], name: { id: 'Hastuti Σ4 (pria Indonesia)', en: 'Hastuti Σ4 (Indonesian men)' }, age: [18, 65], refs: ['h13'],
    pop: { id: '292 pria Jawa 18–65 th, rujukan deuterium, protokol ISAK; bukan atlet (IMT ±21,5)', en: '292 Javanese men 18–65 y, deuterium reference, ISAK protocol; non-athletes (BMI ~21.5)' } },
  hastutiAlt: { sex: 'M', sites: ['abd', 'tri'], name: { id: 'Hastuti abdomen + triseps (pria Indonesia)', en: 'Hastuti abdominal + triceps (Indonesian men)' }, age: [18, 65], refs: ['h13'],
    pop: { id: 'Sampel sama dengan Hastuti Σ4; SEE 3,7% (Σ4: 3,9%)', en: 'Same sample as Hastuti Σ4; SEE 3.7% (Σ4: 3.9%)' } },
  dw: { sex: 'both', sites: ['bic', 'tri', 'sub', 'ic'], name: { id: 'Durnin-Womersley 4 titik', en: 'Durnin-Womersley 4-site' }, age: [17, 72], refs: ['dw', 'siri', 'h18'],
    pop: { id: '481 pria dan wanita 16–72 th; pada wanita Indonesia tanpa bias bermakna dengan titik krista iliaka ISAK (Hastuti 2018)', en: '481 men and women 16–72 y; no significant bias in Indonesian women using the ISAK iliac crest (Hastuti 2018)' } },
  jp3: { sex: 'M', sites: ['chest', 'abd', 'thigh'], name: { id: 'Jackson-Pollock 3 titik (pria)', en: 'Jackson-Pollock 3-site (men)' }, age: [18, 61], refs: ['jp', 'siri'],
    pop: { id: '308 pria 18–61 th', en: '308 men 18–61 y' } },
  jpw3: { sex: 'F', sites: ['tri', 'sil', 'thigh'], name: { id: 'Jackson-Pollock-Ward 3 titik (wanita)', en: 'Jackson-Pollock-Ward 3-site (women)' }, age: [18, 55], refs: ['jpw', 'siri'],
    pop: { id: '249 wanita 18–55 th; hati-hati di atas 40 th', en: '249 women 18–55 y; caution above 40 y' } },
};
export const EQ_ORDER = ['hastuti', 'hastutiAlt', 'dw', 'jp3', 'jpw3'];
export const SOMATO_SITES = ['tri', 'sub', 'ss', 'calf', 'hum', 'fem', 'arm', 'calfg'];

export const M10_FIELDS = [
  { k: 'pre', label: { id: 'BB sebelum latihan', en: 'Body mass before' }, unit: 'kg', lim: [20, 300], dec: true, req: true },
  { k: 'post', label: { id: 'BB sesudah latihan', en: 'Body mass after' }, unit: 'kg', lim: [20, 300], dec: true, req: true, hint: { id: 'Timbang dengan pakaian minimal dan kering dari keringat.', en: 'Weigh in minimal clothing, towelled dry.' } },
  { k: 'fluid', label: { id: 'Cairan yang diminum', en: 'Fluid drunk' }, unit: 'L', lim: [0, 10], dec: true, req: true },
  { k: 'urine', label: { id: 'Urine selama latihan', en: 'Urine during exercise' }, unit: 'L', lim: [0, 5], dec: true, req: false, hint: { id: 'Kosongkan bila tidak berkemih.', en: 'Leave empty if no urine was passed.' } },
  { k: 'dur', label: { id: 'Durasi latihan', en: 'Exercise duration' }, unit: { id: 'menit', en: 'min' }, lim: [10, 720], req: true },
];

export const M510_T = {
  id: {
    m5Sub: 'Persentase lemak dari skinfold, target berat badan, dan somatotipe Heath-Carter',
    m5Pop: 'Untuk dewasa. Hasil hanya boleh dibandingkan dengan persamaan dan protokol titik ukur yang sama.',
    tabFat: '%Lemak', tabSomato: 'Somatotipe', eqLbl: 'Persamaan', sitesHead: 'Titik ukur',
    sumRaw: 'Σ skinfold', sumNote: 'Untuk pemantauan atlet, Σ skinfold mentah lebih andal karena tidak bergantung pada asumsi persamaan.',
    density: 'Densitas tubuh', pctFat: '%Lemak', fatMass: 'Massa lemak', ffmRow: 'FFM', targetRow: 'BB pada target %lemak',
    useFfm: 'Pakai FFM ini di Modul 4', usedFfm: 'FFM disalin ke Modul 4', fatNeed: 'Isi semua titik ukur dan data dasar untuk melihat hasil.',
    eqAge: 'Usia di luar populasi asal persamaan; hasil kurang dapat dipercaya.',
    somNeed: 'Isi 4 lipatan, 2 lebar tulang, 2 lingkar, serta BB dan TB.', somRating: 'Somatotipe', hwrRow: 'HWR (TB/∛BB)',
    endo: 'Endomorfi', meso: 'Mesomorfi', ecto: 'Ektomorfi', xy: 'Koordinat somatochart (X, Y)',
    somNote: 'Endomorfi = lemak relatif; mesomorfi = kekokohan otot-rangka relatif; ektomorfi = linearitas relatif. Ukur sesuai protokol ISAK.',
    chartTitle: 'Posisi pada somatochart', chartEndo: 'Endomorf', chartMeso: 'Mesomorf', chartEcto: 'Ektomorf',
    m5Sources: 'Sumber: Hastuti dkk. 2013 & 2018; Durnin & Womersley 1974; Jackson & Pollock 1978; Jackson, Pollock & Ward 1980; Siri 1961; Ackland dkk. 2012; Carter 2002.',
    m10Sub: 'Laju keringat, perubahan berat badan, dan peringatan minum berlebihan',
    m10Pop: 'Ukur pada sesi latihan yang mewakili kondisi biasa; laju keringat berubah dengan cuaca, intensitas, dan pakaian.',
    lossRow: 'Kehilangan keringat', rateRow: 'Sweat rate', pctRow: 'Perubahan BB', rateUnit: 'L/jam',
    gainDanger: 'BB naik setelah latihan: minum melebihi kehilangan keringat. Risiko exercise-associated hyponatremia (EAH); jangan anjurkan menambah minum. Evaluasi bila ada gejala (sakit kepala, mual, bingung).',
    over2: 'Kehilangan >2% BB: defisit air bermakna. Panduan menganjurkan mencegah kehilangan >2% BB selama latihan dengan rencana minum individual.',
    under2: 'Kehilangan ≤2% BB.',
    thirst: 'Konsensus EAH 2015: strategi paling aman adalah minum sesuai rasa haus; rencana cairan sebaiknya cukup, tidak berlebihan.',
    m10Need: 'Isi BB sebelum dan sesudah, cairan yang diminum, dan durasi.',
    m10Sources: 'Sumber: ACSM (Sawka dkk.) 2007; NATA (McDermott dkk.) 2017; Konsensus EAH (Hew-Butler dkk.) 2015.',
  },
  en: {
    m5Sub: 'Body fat from skinfolds, target body mass, and Heath-Carter somatotype',
    m5Pop: 'For adults. Compare results only with the same equation and the same site protocol.',
    tabFat: '%Fat', tabSomato: 'Somatotype', eqLbl: 'Equation', sitesHead: 'Measurement sites',
    sumRaw: 'Σ skinfolds', sumNote: 'For athlete monitoring, the raw Σ skinfolds is more reliable because it does not depend on equation assumptions.',
    density: 'Body density', pctFat: '%Fat', fatMass: 'Fat mass', ffmRow: 'FFM', targetRow: 'Body mass at target %fat',
    useFfm: 'Use this FFM in Module 4', usedFfm: 'FFM copied to Module 4', fatNeed: 'Enter all sites and the basics to see results.',
    eqAge: 'Age outside the equation’s derivation sample; the result is less reliable.',
    somNeed: 'Enter 4 skinfolds, 2 bone breadths, 2 girths, plus body mass and height.', somRating: 'Somatotype', hwrRow: 'HWR (height/∛mass)',
    endo: 'Endomorphy', meso: 'Mesomorphy', ecto: 'Ectomorphy', xy: 'Somatochart coordinates (X, Y)',
    somNote: 'Endomorphy = relative fatness; mesomorphy = relative musculoskeletal robustness; ectomorphy = relative linearity. Measure per ISAK protocol.',
    chartTitle: 'Position on the somatochart', chartEndo: 'Endomorph', chartMeso: 'Mesomorph', chartEcto: 'Ectomorph',
    m5Sources: 'Sources: Hastuti et al. 2013 & 2018; Durnin & Womersley 1974; Jackson & Pollock 1978; Jackson, Pollock & Ward 1980; Siri 1961; Ackland et al. 2012; Carter 2002.',
    m10Sub: 'Sweat rate, body mass change and overdrinking warning',
    m10Pop: 'Measure in a session representative of usual conditions; sweat rate varies with weather, intensity and clothing.',
    lossRow: 'Sweat loss', rateRow: 'Sweat rate', pctRow: 'Body mass change', rateUnit: 'L/h',
    gainDanger: 'Body mass increased after exercise: drinking exceeded sweat loss. Risk of exercise-associated hyponatraemia (EAH); do not advise drinking more. Evaluate if symptomatic (headache, nausea, confusion).',
    over2: 'Loss >2% of body mass: meaningful water deficit. Guidelines advise preventing >2% loss during exercise with an individual drinking plan.',
    under2: 'Loss ≤2% of body mass.',
    thirst: 'EAH consensus 2015: the safest strategy is to drink to thirst; fluid plans should be adequate, not excessive.',
    m10Need: 'Enter body mass before and after, fluid drunk, and duration.',
    m10Sources: 'Sources: ACSM (Sawka et al.) 2007; NATA (McDermott et al.) 2017; EAH consensus (Hew-Butler et al.) 2015.',
  },
};
