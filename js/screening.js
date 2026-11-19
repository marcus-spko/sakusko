// SakuSKO — Skrining prapartisipasi: algoritma ACSM (Riebe 2015), PAR-Q+ resmi, dan daftar 14 elemen AHA/ACC.
// Semua teks ditulis ulang dengan kalimat sendiri; formulir PAR-Q+ dipakai utuh sebagai PDF resmi tanpa perubahan.

export const SKR_REF = {
  riebe: { ref: "Riebe D, Franklin BA, Thompson PD, Garber CE, Whitfield GP, Magal M, et al. Updating ACSM's recommendations for exercise preparticipation health screening. Med Sci Sports Exerc. 2015;47(11):2473-9.", doi: '10.1249/MSS.0000000000000664' },
  getp: { ref: "American College of Sports Medicine. ACSM's guidelines for exercise testing and prescription. 12th ed. Philadelphia: Wolters Kluwer; 2025.", doi: null },
  parq: { ref: 'PAR-Q+ Collaboration. The Physical Activity Readiness Questionnaire for Everyone (PAR-Q+) 2025. Versi 01-11-2024. www.eparmedx.com', doi: null },
  parqId: { ref: "Turu' Allo IJ, dkk. Adaptation and validation of the PAR-Q+ 2020 for the Indonesian population. Korean J Fam Med. 2026;47(1):59-68. Supplement 1 (CC BY-NC 4.0).", doi: '10.4082/kjfm.24.0288' },
  maron: { ref: 'Maron BJ, Friedman RA, Kligfield P, Levine BD, Viskin S, Chaitman BR, et al. Assessment of the 12-lead ECG as a screening test for detection of cardiovascular disease in healthy general populations of young people (12-25 years of age): a scientific statement from the American Heart Association and the American College of Cardiology. Circulation. 2014;130(15):1303-34.', doi: '10.1161/CIR.0000000000000025' },
  ppe: { ref: 'American Academy of Family Physicians, American Academy of Pediatrics, American College of Sports Medicine, American Medical Society for Sports Medicine, dkk. Preparticipation Evaluation (PPE). 6th ed. Itasca (IL): American Academy of Pediatrics; 2026.', doi: null },
};

export const LINKS = {
  parq25: 'docs/PARQplus-2025-English.pdf',
  parqId: 'docs/PARQplus-2020-Indonesia-Supplement1.pdf',
  eparmed: 'https://eparmedx.com/',
  ppe: 'https://www.aap.org/en/patient-care/preparticipation-evaluation/',
};

// ---------- A. Algoritma ACSM ----------
export const ACSM_Q = [
  { k: 'active', def: 'skrActive', label: { id: 'Rutin berolahraga saat ini?', en: 'Currently exercising regularly?' },
    hint: { id: 'Latihan terencana intensitas sedang ≥30 menit, ≥3 hari/minggu, selama ≥3 bulan terakhir.', en: 'Planned moderate-intensity exercise ≥30 min, ≥3 days/week, for the last ≥3 months.' } },
  { k: 'known', def: 'skrKmr', label: { id: 'Ada penyakit kardiovaskular, metabolik, atau ginjal yang sudah diketahui?', en: 'Known cardiovascular, metabolic or renal disease?' },
    hint: { id: 'Penyakit jantung, pembuluh darah perifer, atau serebrovaskular; diabetes tipe 1 atau 2; penyakit ginjal. Penyakit paru tidak otomatis memerlukan clearance, tetapi perhatikan tanda dan gejala kardiovaskular.', en: 'Cardiac, peripheral vascular or cerebrovascular disease; type 1 or 2 diabetes; renal disease. Pulmonary disease does not automatically require clearance, but watch for cardiovascular signs and symptoms.' } },
  { k: 'symp', def: 'skrSymp', label: { id: 'Ada tanda atau gejala penyakit tersebut?', en: 'Signs or symptoms of such disease?' },
    hint: { id: 'Saat istirahat atau aktivitas. Tekan ikon i untuk daftar tanda dan gejala.', en: 'At rest or during activity. Tap the i icon for the list of signs and symptoms.' } },
];
export const ACSM_Q_INTENT = { k: 'intent', label: { id: 'Intensitas latihan yang diinginkan', en: 'Desired exercise intensity' },
  hint: { id: 'Ringan 30–<40% HRR (2–<3 MET, RPE 9–11); sedang 40–<60% HRR (3–<6 MET, RPE 12–13); berat ≥60% HRR (≥6 MET, RPE ≥14).', en: 'Light 30–<40% HRR (2–<3 METs, RPE 9–11); moderate 40–<60% HRR (3–<6 METs, RPE 12–13); vigorous ≥60% HRR (≥6 METs, RPE ≥14).' },
  opts: [['mod', { id: 'Ringan–sedang', en: 'Light–moderate' }], ['vig', { id: 'Berat', en: 'Vigorous' }]] };
export const ACSM_Q_CLEAR = { k: 'cleared', label: { id: 'Sudah mendapat medical clearance dalam 12 bulan terakhir dan gejala tidak berubah?', en: 'Medically cleared within the last 12 months with no change in symptoms?' } };

// Mengembalikan null bila jawaban belum cukup; level: 'ok' | 'warn' | 'stop'
export function acsmResult(a) {
  if (!a.active || !a.symp) return null;
  if (a.symp === 'y') {
    if (a.active === 'y') return { cell: 6, level: 'stop',
      id: 'Hentikan latihan dan lakukan evaluasi medis (medical clearance) sebelum kembali berlatih dengan intensitas apa pun. Setelah clearance, boleh kembali berlatih dan naik bertahap sesuai toleransi.',
      en: 'Stop exercising and obtain medical clearance before resuming exercise of any intensity. After clearance, exercise may resume and progress gradually as tolerated.' };
    return { cell: 3, level: 'warn',
      id: 'Medical clearance dianjurkan sebelum mulai berlatih. Setelah clearance: mulai intensitas ringan–sedang, naik bertahap sesuai toleransi.',
      en: 'Medical clearance is recommended before starting. After clearance: begin at light–moderate intensity and progress as tolerated.' };
  }
  if (!a.known) return null;
  if (a.active === 'n') {
    if (a.known === 'n') return { cell: 1, level: 'ok',
      id: 'Medical clearance tidak diperlukan. Mulai intensitas ringan–sedang, lalu naik bertahap ke intensitas berat sesuai panduan ACSM.',
      en: 'Medical clearance is not necessary. Begin at light–moderate intensity and progress gradually to vigorous per ACSM guidance.' };
    return { cell: 2, level: 'warn',
      id: 'Medical clearance dianjurkan. Setelah clearance: mulai intensitas ringan–sedang, naik bertahap sesuai toleransi.',
      en: 'Medical clearance is recommended. After clearance: begin at light–moderate intensity and progress as tolerated.' };
  }
  if (a.known === 'n') return { cell: 4, level: 'ok',
    id: 'Medical clearance tidak diperlukan. Lanjutkan intensitas sedang atau berat, naik bertahap sesuai panduan ACSM.',
    en: 'Medical clearance is not necessary. Continue moderate or vigorous intensity and progress gradually per ACSM guidance.' };
  // rutin berolahraga + penyakit diketahui + tanpa gejala
  if (!a.intent) return null;
  if (a.intent === 'mod') return { cell: 5, level: 'ok',
    id: 'Intensitas sedang: medical clearance tidak diperlukan; latihan dapat dilanjutkan.',
    en: 'Moderate intensity: medical clearance is not necessary; exercise may continue.' };
  if (!a.cleared) return null;
  if (a.cleared === 'y') return { cell: 5, level: 'ok',
    id: 'Clearance ≤12 bulan dengan gejala tetap: lanjutkan intensitas sedang atau naik bertahap ke berat.',
    en: 'Clearance within 12 months and unchanged symptoms: continue moderate intensity or progress gradually to vigorous.' };
  return { cell: 5, level: 'warn',
    id: 'Medical clearance dianjurkan sebelum naik ke intensitas berat. Intensitas sedang boleh dilanjutkan.',
    en: 'Medical clearance is recommended before progressing to vigorous intensity. Moderate intensity may continue.' };
}
export const ACSM_ALWAYS = {
  id: 'Algoritma ini untuk latihan aerobik. Bila sewaktu-waktu muncul tanda atau gejala, hentikan latihan dan lakukan evaluasi medis. Hitungan faktor risiko tidak lagi dipakai untuk memutuskan rujukan, tetapi tetap penting untuk pencegahan penyakit.',
  en: 'This algorithm is for aerobic exercise. If signs or symptoms appear at any time, stop exercising and seek medical evaluation. Risk-factor counts no longer decide referral, but remain important for disease prevention.',
};

// ---------- B. PAR-Q+: catatan hasil (bukan formulir) ----------
export const PARQ_OUT = [
  ['allno', { id: 'Semua jawaban halaman 1 "Tidak"', en: 'All page-1 answers "No"' }],
  ['fu', { id: 'Ada "Ya"; semua pertanyaan lanjutan "Tidak"', en: 'Some "Yes"; all follow-up questions "No"' }],
  ['fuyes', { id: 'Ada "Ya" pada pertanyaan lanjutan', en: '"Yes" to a follow-up question' }],
];

// ---------- C. Daftar 14 elemen AHA/ACC ----------
export const AHA14 = [
  { g: 'p', k: 'p1', id: 'Nyeri, rasa tidak nyaman, sesak, atau tertekan di dada terkait aktivitas fisik', en: 'Chest pain, discomfort, tightness or pressure related to exertion' },
  { g: 'p', k: 'p2', id: 'Pingsan atau hampir pingsan tanpa sebab jelas dan bukan vasovagal, terutama saat atau setelah aktivitas', en: 'Unexplained fainting or near-fainting, not vasovagal, especially during or after exertion' },
  { g: 'p', k: 'p3', id: 'Sesak, lelah, atau berdebar berlebihan saat aktivitas tanpa sebab jelas', en: 'Excessive, unexplained breathlessness, fatigue or palpitations with exercise' },
  { g: 'p', k: 'p4', id: 'Pernah diketahui ada bising jantung', en: 'Previously known heart murmur' },
  { g: 'p', k: 'p5', id: 'Riwayat tekanan darah tinggi', en: 'History of high blood pressure' },
  { g: 'p', k: 'p6', id: 'Pernah dilarang atau dibatasi berolahraga', en: 'Previously restricted from sport' },
  { g: 'p', k: 'p7', id: 'Pernah diminta dokter menjalani pemeriksaan jantung', en: 'Previous heart testing ordered by a physician' },
  { g: 'f', k: 'f1', id: 'Kerabat meninggal mendadak atau dini (<50 tahun) karena penyakit jantung', en: 'Relative with sudden or premature (<50 y) death from heart disease' },
  { g: 'f', k: 'f2', id: 'Kerabat dekat <50 tahun dengan disabilitas karena penyakit jantung', en: 'Close relative <50 y disabled by heart disease' },
  { g: 'f', k: 'f3', id: 'Keluarga dengan kardiomiopati hipertrofik atau dilatasi, sindrom QT panjang atau kanalopati lain, sindrom Marfan, aritmia bermakna, atau kelainan jantung genetik lain yang diketahui', en: 'Family history of hypertrophic or dilated cardiomyopathy, long-QT or other channelopathy, Marfan syndrome, significant arrhythmia, or other known genetic heart condition' },
  { g: 'e', k: 'e1', id: 'Bising jantung yang kemungkinan organik, bukan innocent (auskultasi berbaring dan berdiri, atau dengan manuver Valsalva)', en: 'Heart murmur likely organic rather than innocent (auscultate supine and standing, or with Valsalva)' },
  { g: 'e', k: 'e2', id: 'Denyut femoral lemah atau terlambat (curiga koarktasio aorta)', en: 'Weak or delayed femoral pulses (possible aortic coarctation)' },
  { g: 'e', k: 'e3', id: 'Tanda fisik sindrom Marfan', en: 'Physical stigmata of Marfan syndrome' },
  { g: 'e', k: 'e4', id: 'Tekanan darah brakialis (posisi duduk, sebaiknya kedua lengan) tinggi', en: 'Elevated brachial blood pressure (seated, preferably both arms)' },
];
export const AHA_GROUPS = { p: { id: 'Riwayat Pribadi', en: 'Personal History' }, f: { id: 'Riwayat Keluarga', en: 'Family History' }, e: { id: 'Pemeriksaan Fisik', en: 'Physical Examination' } };
