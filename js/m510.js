// SakuSKO — teks, isian, dan sumber Modul 5 (skinfold & somatotipe) dan Modul 10 (sweat rate & hidrasi).
export const M510_REF = {
  jp: { ref: 'Jackson AS, Pollock ML. Generalized equations for predicting body density of men. Br J Nutr. 1978;40(3):497-504.', doi: '10.1079/bjn19780152' },
  jpw: { ref: 'Jackson AS, Pollock ML, Ward A. Generalized equations for predicting body density of women. Med Sci Sports Exerc. 1980;12(3):175-81.', doi: null },
  dw: { ref: 'Durnin JV, Womersley J. Body fat assessed from total body density and its estimation from skinfold thickness: measurements on 481 men and women aged from 16 to 72 years. Br J Nutr. 1974;32(1):77-97.', doi: '10.1079/bjn19740060' },
  siri: { ref: 'Siri WE. Body composition from fluid spaces and density: analysis of methods. In: Brozek J, Henschel A, editors. Techniques for measuring body composition. Washington DC: National Academy of Sciences; 1961. p. 223-44.', doi: null },
  h13: { ref: 'Hastuti J, Kagawa M, Byrne NM, Hills AP. Development and validation of anthropometric prediction equations for estimation of body fat in Indonesian men. Asia Pac J Clin Nutr. 2013;22(4):522-9.', doi: '10.6133/apjcn.2013.22.4.14' },
  h18: { ref: 'Hastuti J, Kagawa M, Byrne NM, Hills AP. Anthropometry to assess body fat in Indonesian adults. Asia Pac J Clin Nutr. 2018;27(3):592-8.', doi: '10.6133/apjcn.092017.02' },
  mathisen: { ref: 'Mathisen TF, Ackland T, Burke LM, Constantini N, Haudum J, Macnaughton LS, et al. Best practice recommendations for body composition considerations in sport to reduce health and performance risks: a critical review, original survey and expert opinion by a subgroup of the IOC consensus on Relative Energy Deficiency in Sport (REDs). Br J Sports Med. 2023;57(17):1148-58.', doi: '10.1136/bjsports-2023-106812' },
  racinais: { ref: 'Racinais S, Hosokawa Y, Akama T, Bermon S, Bigard X, Casa DJ, et al. IOC consensus statement on recommendations and regulations for sport events in the heat. Br J Sports Med. 2023;57(1):8-25.', doi: '10.1136/bjsports-2022-105942' },
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
  ic: { label: { id: 'Krista iliaka (ISAK)', en: 'Iliac crest (ISAK)' }, unit: mm, lim: [2, 70], hint: { id: 'Durnin-Womersley untuk pengguna Indonesia memakai titik krista iliaka ISAK (Hastuti 2018).', en: 'Durnin-Womersley for Indonesian users uses the ISAK iliac crest site (Hastuti 2018).' } },
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
  hastuti: { sex: 'M', sites: ['abd', 'tri'], name: { id: 'Hastuti abdomen + triseps (pria Indonesia)', en: 'Hastuti abdominal + triceps (Indonesian men)' }, age: [18, 65], refs: ['h13'],
    pop: { id: '292 pria Jawa 18–65 th di Yogyakarta, rujukan deuterium, protokol ISAK; bukan atlet (IMT ±21,5). Uji silang: r 0,87, SEE 3,7%', en: '292 Javanese men aged 18–65 in Yogyakarta, deuterium reference, ISAK protocol; non-athletes (BMI ~21.5). Cross-validation: r 0.87, SEE 3.7%' } },
  dw: { sex: 'both', sites: ['bic', 'tri', 'sub', 'ic'], name: { id: 'Durnin-Womersley 4 titik', en: 'Durnin-Womersley 4-site' }, age: [17, 72], refs: ['dw', 'siri', 'h18'],
    pop: { id: '481 pria dan wanita 16–72 th; pada wanita Indonesia tanpa bias bermakna dengan titik krista iliaka ISAK (Hastuti 2018); pada pria Indonesia sekitar 1% lebih rendah dari rujukan (Hastuti 2013)', en: '481 men and women 16–72 y; no significant bias in Indonesian women using the ISAK iliac crest (Hastuti 2018); about 1% low in Indonesian men (Hastuti 2013)' } },
  jp3: { sex: 'M', sites: ['chest', 'abd', 'thigh'], name: { id: 'Jackson-Pollock 3 titik (pria)', en: 'Jackson-Pollock 3-site (men)' }, age: [18, 61], refs: ['jp', 'siri'],
    pop: { id: '308 pria 18–61 th', en: '308 men 18–61 y' } },
  jpw3: { sex: 'F', sites: ['tri', 'sil', 'thigh'], name: { id: 'Jackson-Pollock-Ward 3 titik (wanita)', en: 'Jackson-Pollock-Ward 3-site (women)' }, age: [18, 55], refs: ['jpw', 'siri'],
    pop: { id: '249 wanita 18–55 th; hati-hati di atas 40 th', en: '249 women 18–55 y; caution above 40 y' } },
};
export const EQ_ORDER = ['hastuti', 'dw', 'jp3', 'jpw3'];
// Panduan titik ukur — ringkasan protokol ISAK (dan ACSM untuk titik Jackson-Pollock), ditulis dengan kata-kata sendiri.
export const GUIDE_GENERAL = {
  id: 'Ukur di sisi kanan tubuh dengan subjek berdiri santai, dan tandai titik dengan pena lebih dulu. Cubit lipatan kulit beserta lemak di bawahnya dengan ibu jari dan telunjuk, tarik menjauhi otot, lalu pasang rahang kaliper tepat di titik tanda, tegak lurus terhadap lipatan. Baca angka 2 detik setelah tekanan kaliper penuh. Ukur dua kali; bila selisihnya lebih dari 5%, ukur ketiga kalinya. Pakai rerata dua ukuran atau median tiga ukuran.',
  en: 'Measure on the right side with the subject standing relaxed, and mark the site with a pen first. Grasp the skin and underlying fat between thumb and index finger, pull it away from the muscle, then apply the caliper jaws exactly at the mark, perpendicular to the fold. Read 2 seconds after full caliper pressure. Measure twice; if the two differ by more than 5%, take a third. Use the mean of two or the median of three.',
};
export const GUIDE = {
  tri: { id: 'Belakang lengan atas, setinggi titik tengah garis akromiale–radiale, pada bagian paling belakang otot triseps. Lengan tergantung santai dengan siku lurus. Lipatan vertikal, sejajar sumbu lengan.', en: 'Back of the upper arm, at the level of the mid acromiale–radiale line, over the most posterior part of triceps. Arm hanging relaxed, elbow extended. Vertical fold, parallel to the arm.' },
  bic: { id: 'Depan lengan atas, setinggi titik tengah akromiale–radiale yang sama, pada bagian paling depan otot biseps. Lipatan vertikal.', en: 'Front of the upper arm, at the same mid acromiale–radiale level, over the most anterior part of biceps. Vertical fold.' },
  sub: { id: '2 cm dari subskapulare (sudut bawah tulang belikat) pada garis miring 45° ke arah luar-bawah. Lipatan mengikuti garis miring itu. Lengan tergantung santai.', en: '2 cm from the subscapulare (inferior angle of the scapula) along a line running 45° laterally downward. The fold follows that line. Arm hanging relaxed.' },
  ic: { id: 'Tepat di atas iliokristale (titik paling lateral-atas krista iliaka) pada garis ilio-aksila, yaitu garis tegak dari tengah ketiak. Lengan kanan menyilang dada atau diangkat ke samping. Lipatan hampir horizontal, sedikit menurun ke depan mengikuti garis alami kulit.', en: 'Just above the iliocristale (most lateral-superior point of the iliac crest) on the ilio-axilla line, a vertical line from mid-axilla. Right arm across the chest or abducted. Near-horizontal fold, running slightly downward anteriorly along the natural skin line.' },
  ss: { id: 'Perpotongan dua garis: garis dari iliospinale (SIAS) ke batas depan ketiak, dan garis horizontal setinggi iliokristale. Lipatan miring sekitar 45° ke bawah dan ke tengah.', en: 'Intersection of two lines: from the iliospinale (ASIS) to the anterior axillary border, and a horizontal line at the level of the iliocristale. Fold runs about 45° downward and medially.' },
  abd: { id: 'Protokol ISAK (dipakai Hastuti): 5 cm di sebelah kanan omphalion (tengah pusar), setinggi pusar. Lipatan vertikal.', en: 'ISAK protocol (used by Hastuti): 5 cm to the right of the omphalion (centre of the navel), at navel level. Vertical fold.' },
  abdJp: { id: 'Protokol Jackson-Pollock (ACSM): 2 cm di sebelah kanan pusar. Lipatan vertikal. Titik ini berbeda dari titik ISAK (5 cm); pakai titik yang sesuai persamaan.', en: 'Jackson-Pollock protocol (ACSM): 2 cm to the right of the navel. Vertical fold. This differs from the ISAK site (5 cm); use the site that matches the equation.' },
  chest: { id: 'Pria: setengah jarak antara garis aksila depan (lipat ketiak depan) dan puting. Lipatan diagonal searah garis ketiak–puting.', en: 'Men: halfway between the anterior axillary line (front armpit fold) and the nipple. Diagonal fold along the armpit–nipple line.' },
  thigh: { id: 'Garis tengah depan paha, di tengah antara lipat paha (inguinal) dan batas atas tempurung lutut. Subjek berdiri dengan berat badan bertumpu pada tungkai kiri. Lipatan vertikal.', en: 'Anterior midline of the thigh, halfway between the inguinal crease and the top of the patella. Subject stands with weight on the left leg. Vertical fold.' },
  sil: { id: 'Tepat di atas krista iliaka pada garis aksila depan. Lipatan diagonal mengikuti sudut alami krista iliaka.', en: 'Just above the iliac crest on the anterior axillary line. Diagonal fold following the natural angle of the iliac crest.' },
  calf: { id: 'Sisi dalam betis kanan setinggi lingkar betis terbesar. Kaki kanan di atas bangku dengan lutut sekitar 90°. Lipatan vertikal.', en: 'Medial side of the right calf at the level of maximal girth. Right foot on a box with the knee at about 90°. Vertical fold.' },
  hum: { id: 'Lengan kanan diangkat ke depan setinggi bahu, siku ditekuk 90°. Ukur jarak epikondilus medial dan lateral humerus dengan kaliper lebar tulang; ujung kaliper mengarah ke atas membagi dua sudut siku, dengan tekanan kuat.', en: 'Right arm raised forward to shoulder height, elbow flexed 90°. Measure between the medial and lateral humeral epicondyles with a bone caliper, branches pointing upward bisecting the elbow angle, with firm pressure.' },
  fem: { id: 'Subjek duduk dengan lutut kanan ditekuk 90°. Ukur jarak epikondilus medial dan lateral femur; ujung kaliper mengarah ke bawah membagi dua sudut lutut, dengan tekanan kuat.', en: 'Subject seated with the right knee flexed 90°. Measure between the medial and lateral femoral epicondyles, branches pointing downward bisecting the knee angle, with firm pressure.' },
  arm: { id: 'Bahu difleksikan 90° (lengan ke depan setinggi bahu), siku ditekuk sekitar 45°, tangan mengepal, dan otot lengan dikontraksikan maksimal. Pita ukur tegak lurus sumbu lengan pada lingkar terbesar.', en: 'Shoulder flexed to 90° (arm forward at shoulder height), elbow flexed about 45°, fist clenched and arm muscles maximally contracted. Tape perpendicular to the arm at the largest girth.' },
  calfg: { id: 'Berdiri tegak dengan berat badan merata di kedua kaki. Pita ukur tegak lurus sumbu tungkai pada lingkar betis terbesar.', en: 'Stand upright with weight evenly on both feet. Tape perpendicular to the leg at the largest calf girth.' },
};
export const GUIDE_SRC = {
  id: 'Ringkasan protokol ISAK; titik Jackson-Pollock menurut ACSM. Ditulis ulang dengan kata-kata sendiri dan belum dicocokkan dengan manual ISAK cetak.',
  en: 'Summary of the ISAK protocol; Jackson-Pollock sites per ACSM. Rewritten in our own words and not yet checked against the printed ISAK manual.',
};
// Nama 13 kategori somatotipe (Carter 2002) dan penjelasannya
export const SOMATO_CAT = {
  central: ['Central', { id: 'tidak ada komponen yang berbeda lebih dari 1 dari dua lainnya', en: 'no component differs by more than 1 from the other two' }],
  'balanced-endo': ['Balanced endomorph', { id: 'endomorfi dominan; mesomorfi dan ektomorfi setara', en: 'endomorphy dominant; mesomorphy and ectomorphy equal' }],
  'mesoic-endo': ['Mesomorphic endomorph', { id: 'endomorfi dominan; mesomorfi lebih besar dari ektomorfi', en: 'endomorphy dominant; mesomorphy greater than ectomorphy' }],
  'endo-meso': ['Mesomorph-endomorph', { id: 'endomorfi dan mesomorfi setara; ektomorfi lebih kecil', en: 'endomorphy and mesomorphy equal; ectomorphy smaller' }],
  'endoic-meso': ['Endomorphic mesomorph', { id: 'mesomorfi dominan; endomorfi lebih besar dari ektomorfi', en: 'mesomorphy dominant; endomorphy greater than ectomorphy' }],
  'balanced-meso': ['Balanced mesomorph', { id: 'mesomorfi dominan; endomorfi dan ektomorfi setara', en: 'mesomorphy dominant; endomorphy and ectomorphy equal' }],
  'ectoic-meso': ['Ectomorphic mesomorph', { id: 'mesomorfi dominan; ektomorfi lebih besar dari endomorfi', en: 'mesomorphy dominant; ectomorphy greater than endomorphy' }],
  'ecto-meso': ['Mesomorph-ectomorph', { id: 'mesomorfi dan ektomorfi setara; endomorfi lebih kecil', en: 'mesomorphy and ectomorphy equal; endomorphy smaller' }],
  'mesoic-ecto': ['Mesomorphic ectomorph', { id: 'ektomorfi dominan; mesomorfi lebih besar dari endomorfi', en: 'ectomorphy dominant; mesomorphy greater than endomorphy' }],
  'balanced-ecto': ['Balanced ectomorph', { id: 'ektomorfi dominan; endomorfi dan mesomorfi setara', en: 'ectomorphy dominant; endomorphy and mesomorphy equal' }],
  'endoic-ecto': ['Endomorphic ectomorph', { id: 'ektomorfi dominan; endomorfi lebih besar dari mesomorfi', en: 'ectomorphy dominant; endomorphy greater than mesomorphy' }],
  'ecto-endo': ['Endomorph-ectomorph', { id: 'endomorfi dan ektomorfi setara; mesomorfi lebih kecil', en: 'endomorphy and ectomorphy equal; mesomorphy smaller' }],
  'ectoic-endo': ['Ectomorphic endomorph', { id: 'endomorfi dominan; ektomorfi lebih besar dari mesomorfi', en: 'endomorphy dominant; ectomorphy greater than mesomorphy' }],
};
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
    tabFat: '%Lemak', tabSomato: 'Somatotipe', eqLbl: 'Persamaan', sitesHead: 'Titik ukur', howTo: 'Cara ukur', hideHowTo: 'Tutup cara ukur', genTech: 'Teknik umum skinfold',
    sumRaw: 'Σ skinfold', sumNote: 'Untuk pemantauan atlet, Σ skinfold mentah lebih andal karena tidak bergantung pada asumsi persamaan. Kajian IOC 2023 mengingatkan bahwa fokus berlebihan pada komposisi tubuh meningkatkan risiko REDs dan gangguan makan, dan pengaruhnya terhadap performa tidak boleh dilebih-lebihkan.',
    density: 'Densitas tubuh', pctFat: '%Lemak', fatMass: 'Massa lemak', ffmRow: 'FFM', targetRow: 'BB pada target %lemak',
    useFfm: 'Pakai FFM ini di Modul 4', usedFfm: 'FFM disalin ke Modul 4', fatNeed: 'Isi semua titik ukur dan data dasar untuk melihat hasil.',
    eqAge: 'Usia di luar populasi asal persamaan; hasil kurang dapat dipercaya.',
    somNeed: 'Isi 4 lipatan, 2 lebar tulang, 2 lingkar, serta BB dan TB.', somRating: 'Somatotipe', hwrRow: 'HWR (TB/∛BB)',
    endo: 'Endomorfi', meso: 'Mesomorfi', ecto: 'Ektomorfi', xy: 'Koordinat somatochart (X, Y)',
    somNote: 'Endomorfi = lemak relatif; mesomorfi = kekokohan otot-rangka relatif; ektomorfi = linearitas relatif. Ukur sesuai protokol ISAK.',
    chartTitle: 'Posisi pada somatochart', chartEndo: 'ENDOMORFI', chartMeso: 'MESOMORFI', chartEcto: 'EKTOMORFI', catRow: 'Kategori', catNote: 'Kategori menurut 13 kategori Carter (2002); dua komponen dianggap setara bila selisihnya ≤0,5. Garis putus-putus adalah batas tempat dua komponen sama besar.',
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
    tabFat: '%Fat', tabSomato: 'Somatotype', eqLbl: 'Equation', sitesHead: 'Measurement sites', howTo: 'How to measure', hideHowTo: 'Hide how to measure', genTech: 'General skinfold technique',
    sumRaw: 'Σ skinfolds', sumNote: 'For athlete monitoring, the raw Σ skinfolds is more reliable because it does not depend on equation assumptions. A 2023 IOC review warns that overfocus on body composition raises the risk of REDs and disordered eating, and its influence on performance should not be overstated.',
    density: 'Body density', pctFat: '%Fat', fatMass: 'Fat mass', ffmRow: 'FFM', targetRow: 'Body mass at target %fat',
    useFfm: 'Use this FFM in Module 4', usedFfm: 'FFM copied to Module 4', fatNeed: 'Enter all sites and the basics to see results.',
    eqAge: 'Age outside the equation’s derivation sample; the result is less reliable.',
    somNeed: 'Enter 4 skinfolds, 2 bone breadths, 2 girths, plus body mass and height.', somRating: 'Somatotype', hwrRow: 'HWR (height/∛mass)',
    endo: 'Endomorphy', meso: 'Mesomorphy', ecto: 'Ectomorphy', xy: 'Somatochart coordinates (X, Y)',
    somNote: 'Endomorphy = relative fatness; mesomorphy = relative musculoskeletal robustness; ectomorphy = relative linearity. Measure per ISAK protocol.',
    chartTitle: 'Position on the somatochart', chartEndo: 'ENDOMORPHY', chartMeso: 'MESOMORPHY', chartEcto: 'ECTOMORPHY', catRow: 'Category', catNote: 'Category per Carter’s 13 categories (2002); two components count as equal when they differ by ≤0.5. Dashed lines mark where two components are equal.',
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
