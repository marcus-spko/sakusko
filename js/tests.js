// SakuSKO — definisi tes Modul 2 (VO₂max lapangan) dan Modul 3 (kekuatan).
// Setiap tes: isian, data dasar yang dibutuhkan, protokol singkat, populasi asal, sumber, dan fungsi hitung.
import {
  vo2Cooper, vo2Rockport, legerSpeed, vo2Leger, vo2Queens,
  vo2YoYo1, sixMwtPred, rmEpley, rmBrzycki, gripCut, stsCut,
} from './formulas.js';

const VO2U = { id: 'mL/kg/mnt', en: 'mL/kg/min' };
const minSecFields = (minLim) => [
  { k: 'min', label: { id: 'Waktu (menit)', en: 'Time (minutes)' }, unit: { id: 'mnt', en: 'min' }, lim: minLim, req: true },
  { k: 'sec', label: { id: 'Waktu (detik)', en: 'Time (seconds)' }, unit: { id: 'dtk', en: 's' }, lim: [0, 59], req: false },
];
const timeOf = v => v.min + (Number.isFinite(v.sec) ? v.sec : 0) / 60;
const mmss = v => `${v.min}:${String(Number.isFinite(v.sec) ? v.sec : 0).padStart(2, '0')}`;

export const REF = {
  cooper: { ref: 'Cooper KH. A means of assessing maximal oxygen intake. Correlation between field and treadmill testing. JAMA. 1968;203(3):201-4.', doi: null },
  kline: { ref: 'Kline GM, Porcari JP, Hintermeister R, Freedson PS, Ward A, McCarron RF, et al. Estimation of VO2max from a one-mile track walk, gender, age, and body weight. Med Sci Sports Exerc. 1987;19(3):253-9.', doi: null },
  leger: { ref: 'Léger LA, Mercier D, Gadoury C, Lambert J. The multistage 20 metre shuttle run test for aerobic fitness. J Sports Sci. 1988;6(2):93-101.', doi: '10.1080/02640418808729800' },
  mcardle: { ref: 'McArdle WD, Katch FI, Pechar GS, Jacobson L, Ruck S. Reliability and interrelationships between maximal oxygen intake, physical work capacity and step-test scores in college women. Med Sci Sports. 1972;4(4):182-6.', doi: null },
  bangsbo: { ref: 'Bangsbo J, Iaia FM, Krustrup P. The Yo-Yo intermittent recovery test: a useful tool for evaluation of physical performance in intermittent sports. Sports Med. 2008;38(1):37-51.', doi: '10.2165/00007256-200838010-00004' },
  buchheit: { ref: 'Buchheit M. The 30-15 intermittent fitness test: accuracy for individualizing interval training of young intermittent sport players. J Strength Cond Res. 2008;22(2):365-74.', doi: '10.1519/JSC.0b013e3181635b2e' },
  cheng: { ref: 'Cheng R, Lin W, Song L, Pan J, Wang N, Li X. Re-examining the reliability and validity of 30-15IFT for VO2max prediction in male collegiate soccer players: a pilot study. Front Physiol. 2025;16:1668250.', doi: '10.3389/fphys.2025.1668250' },
  enright: { ref: 'Enright PL, Sherrill DL. Reference equations for the six-minute walk in healthy adults. Am J Respir Crit Care Med. 1998;158(5 Pt 1):1384-7.', doi: '10.1164/ajrccm.158.5.9710086' },
  epley: { ref: 'Epley B. Poundage chart. In: Boyd Epley workout. Lincoln (NE): Body Enterprises; 1985.', doi: null },
  brzycki: { ref: 'Brzycki M. Strength testing—predicting a one-rep max from reps-to-fatigue. J Phys Educ Recreat Dance. 1993;64(1):88-90.', doi: '10.1080/07303084.1993.10606684' },
  lesuer: { ref: 'LeSuer DA, McCormick JH, Mayhew JL, Wasserstein RL, Arnold MD. The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift. J Strength Cond Res. 1997;11(4):211-3.', doi: '10.1519/00124278-199711000-00001' },
  nuzzo: { ref: 'Nuzzo JL, Pinto MD, Nosaka K, Steele J. Maximal number of repetitions at percentages of the one repetition maximum: a meta-regression and moderator analysis of sex, age, training status, and exercise. Sports Med. 2024;54(2):303-21.', doi: '10.1007/s40279-023-01937-7' },
  currier: { ref: 'Currier BS, D\'Souza AC, Singh MAF, Lowisz CV, Rawson ES, Schoenfeld BJ, et al. American College of Sports Medicine position stand. Resistance training prescription for muscle function, hypertrophy, and physical performance in healthy adults: an overview of reviews. Med Sci Sports Exerc. 2026;58(4):851-72.', doi: '10.1249/MSS.0000000000003897' },
  awgs19: { ref: 'Chen LK, Woo J, Assantachai P, Auyeung TW, Chou MY, Iijima K, et al. Asian Working Group for Sarcopenia: 2019 consensus update on sarcopenia diagnosis and treatment. J Am Med Dir Assoc. 2020;21(3):300-7.e2.', doi: '10.1016/j.jamda.2019.12.012' },
  awgs25: { ref: 'Chen LK, Hsiao FY, Akishita M, Assantachai P, Lee WJ, Lim WS, et al. A focus shift from sarcopenia to muscle health in the Asian Working Group for Sarcopenia 2025 Consensus Update. Nat Aging. 2025;5(11):2164-75.', doi: '10.1038/s43587-025-01004-y' },
};

// c = { L, f1, f0, u: satuan VO₂ }
export const TESTS = {
  m2: [
    {
      id: 'cooper', short: 'Cooper 1968', name: { id: 'Lari 12 menit (Cooper)', en: '12-minute run (Cooper)' }, needs: [],
      fields: [{ k: 'dist', label: { id: 'Jarak tempuh', en: 'Distance covered' }, unit: { id: 'm', en: 'm' }, lim: [500, 5000], req: true }],
      protocol: { id: 'Lari/jalan sejauh mungkin selama 12 menit di lintasan terukur; usaha maksimal.', en: 'Run/walk as far as possible in 12 minutes on a measured track; maximal effort.' },
      pop: { id: 'Pria dewasa anggota Angkatan Udara AS', en: 'Adult men in the US Air Force' },
      refs: ['cooper'],
      caveat: { id: 'Butuh usaha maksimal; tidak cocok untuk pemula berisiko tinggi.', en: 'Requires maximal effort; not suitable for high-risk beginners.' },
      calc(v, b, c) {
        const r = vo2Cooper(v.dist);
        return { val: r, f: ['VO₂max = (jarak − 504,9) / 44,73'], s: [`(${c.f0(v.dist)} − 504,9) / 44,73 = ${c.f1(r)}`],
          copy: c.L === 'id' ? `Lari 12 menit (Cooper): ${c.f0(v.dist)} m → VO₂max ${c.f1(r)} ${c.u}` : `12-min run (Cooper): ${c.f0(v.dist)} m → VO₂max ${c.f1(r)} ${c.u}` };
      },
    },
    {
      id: 'rockport', short: 'Kline 1987', name: { id: 'Jalan cepat 1 mil (Rockport)', en: '1-mile walk (Rockport)' }, needs: ['age', 'sex', 'weight'],
      fields: [...minSecFields([8, 40]), { k: 'hr', label: { id: 'Denyut di akhir jalan', en: 'Heart rate at finish' }, unit: { id: 'kali/mnt', en: 'bpm' }, lim: [60, 220], req: true }],
      protocol: { id: 'Jalan secepat mungkin 1 mil (1.609 m) tanpa berlari; catat waktu dan denyut tepat di garis akhir.', en: 'Walk 1 mile (1,609 m) as fast as possible without running; record time and heart rate right at the finish.' },
      pop: { id: '343 orang dewasa sehat usia 30–69 tahun', en: '343 healthy adults aged 30–69 years' }, ageRange: [30, 69],
      refs: ['kline'],
      caveat: { id: 'Naskah Kline melaporkan persamaan utama dalam L/menit; versi mL/kg/menit ini dikutip luas dan baru terverifikasi dari sumber sekunder.', en: 'Kline reported the main equation in L/min; this mL/kg/min version is widely cited and verified only from secondary sources.' },
      calc(v, b, c) {
        const t = timeOf(v), male = b.sex === 'M', r = vo2Rockport(b.weight, b.age, male, t, v.hr), lb = b.weight * 2.20462;
        return { val: r,
          f: [c.L === 'id' ? 'VO₂max = 132,853 − 0,0769×BB(lb) − 0,3877×usia + 6,315×JK − 3,2649×waktu − 0,1565×denyut' : 'VO₂max = 132.853 − 0.0769×mass(lb) − 0.3877×age + 6.315×sex − 3.2649×time − 0.1565×HR',
            c.L === 'id' ? 'JK: pria = 1, wanita = 0; waktu dalam menit desimal; 1 kg = 2,20462 lb' : 'Sex: male = 1, female = 0; time in decimal minutes; 1 kg = 2.20462 lb'],
          s: [`132,853 − 0,0769×${c.f1(lb)} − 0,3877×${c.f0(b.age)} + 6,315×${male ? 1 : 0} − 3,2649×${c.f2(t)} − 0,1565×${c.f0(v.hr)} = ${c.f1(r)}`],
          copy: c.L === 'id' ? `Jalan 1 mil (Rockport): ${mmss(v)} menit, denyut ${c.f0(v.hr)} → VO₂max ${c.f1(r)} ${c.u}` : `1-mile walk (Rockport): ${mmss(v)} min, HR ${c.f0(v.hr)} → VO₂max ${c.f1(r)} ${c.u}` };
      },
    },
    {
      id: 'leger', short: 'Léger 1988', name: { id: 'Shuttle run 20 m (Léger)', en: '20 m shuttle run (Léger)' }, needs: [],
      fields: [{ k: 'stage', label: { id: 'Tahap terakhir', en: 'Last stage' }, unit: { id: 'tahap', en: 'stage' }, lim: [1, 21], req: true, int: true,
        hint: { id: 'Protokol Léger 1988: tahap 1 = 8,5 km/jam, naik 0,5 km/jam tiap tahap.', en: 'Léger 1988 protocol: stage 1 = 8.5 km/h, +0.5 km/h per stage.' } }],
      protocol: { id: 'Lari bolak-balik 20 m mengikuti bunyi; berhenti saat dua kali gagal mencapai garis tepat waktu.', en: 'Run back and forth over 20 m to the beeps; stop after failing twice to reach the line in time.' },
      pop: { id: '188 anak usia 8–19 tahun; dewasa 18–50 tahun memakai persamaan yang sama dengan usia tetap 18 (r = 0,90)', en: '188 children aged 8–19; adults 18–50 use the same equation with age fixed at 18 (r = 0.90)' }, ageRange: [18, 50],
      refs: ['leger'],
      caveat: { id: 'Versi beep test lain dapat memakai tabel kecepatan berbeda; pastikan protokol Léger 1988.', en: 'Other beep-test versions may use different speed tables; make sure the Léger 1988 protocol was used.' },
      calc(v, b, c) {
        const s = legerSpeed(v.stage), r = vo2Leger(v.stage, 18);
        return { val: r, rows: [[c.L === 'id' ? 'Kecepatan akhir' : 'Final speed', `${c.f1(s)} ${c.L === 'id' ? 'km/jam' : 'km/h'}`]],
          f: [c.L === 'id' ? 'Kecepatan = 8 + 0,5 × tahap (km/jam)' : 'Speed = 8 + 0.5 × stage (km/h)',
            'VO₂max = 31,025 + 3,238×V − 3,248×A + 0,1536×A×V', c.L === 'id' ? 'Dewasa: A (usia) ditetapkan 18' : 'Adults: A (age) fixed at 18'],
          s: [`V = 8 + 0,5×${c.f0(v.stage)} = ${c.f1(s)}`, `31,025 + 3,238×${c.f1(s)} − 3,248×18 + 0,1536×18×${c.f1(s)} = ${c.f1(r)}`],
          copy: c.L === 'id' ? `Shuttle run 20 m (Léger): tahap ${c.f0(v.stage)} (${c.f1(s)} km/jam) → VO₂max ${c.f1(r)} ${c.u}` : `20 m shuttle run (Léger): stage ${c.f0(v.stage)} (${c.f1(s)} km/h) → VO₂max ${c.f1(r)} ${c.u}` };
      },
    },
    {
      id: 'queens', short: 'McArdle 1972', name: { id: 'Step test Queens College', en: 'Queens College step test' }, needs: ['sex'],
      fields: [{ k: 'c15', label: { id: 'Hitungan nadi 15 detik', en: '15-second pulse count' }, unit: { id: 'denyut', en: 'beats' }, lim: [10, 60], req: true,
        hint: { id: 'Mulai 5 detik setelah berhenti melangkah; aplikasi mengalikan 4.', en: 'Start 5 seconds after stepping stops; the app multiplies by 4.' } }],
      protocol: { id: 'Bangku 41,3 cm; 3 menit; pria 24 langkah/menit (metronom 96), wanita 22 langkah/menit (metronom 88).', en: 'Bench 41.3 cm; 3 minutes; men 24 steps/min (metronome 96), women 22 steps/min (metronome 88).' },
      pop: { id: 'Persamaan wanita dari mahasiswi (McArdle 1972); persamaan pria dikutip dari kelompok penulis yang sama', en: 'Women’s equation from college women (McArdle 1972); men’s equation cited from the same author group' },
      refs: ['mcardle'],
      calc(v, b, c) {
        const hr = v.c15 * 4, male = b.sex === 'M', r = vo2Queens(male, hr);
        return { val: r, rows: [[c.L === 'id' ? 'Denyut pemulihan' : 'Recovery HR', `${c.f0(hr)} ${c.L === 'id' ? 'kali/mnt' : 'bpm'}`]],
          f: [c.L === 'id' ? 'Pria: VO₂max = 111,33 − 0,42 × HR' : 'Men: VO₂max = 111.33 − 0.42 × HR', c.L === 'id' ? 'Wanita: VO₂max = 65,81 − 0,1847 × HR' : 'Women: VO₂max = 65.81 − 0.1847 × HR', 'HR = hitungan 15 dtk × 4'],
          s: [`HR = ${c.f0(v.c15)} × 4 = ${c.f0(hr)}`, male ? `111,33 − 0,42 × ${c.f0(hr)} = ${c.f1(r)}` : `65,81 − 0,1847 × ${c.f0(hr)} = ${c.f1(r)}`],
          copy: c.L === 'id' ? `Step test Queens College: HR pemulihan ${c.f0(hr)} → VO₂max ${c.f1(r)} ${c.u}` : `Queens College step test: recovery HR ${c.f0(hr)} → VO₂max ${c.f1(r)} ${c.u}` };
      },
    },
    {
      id: 'yoyo', short: 'Bangsbo 2008', name: { id: 'Yo-Yo IR1', en: 'Yo-Yo IR1' }, needs: [],
      fields: [{ k: 'dist', label: { id: 'Jarak total', en: 'Total distance' }, unit: { id: 'm', en: 'm' }, lim: [40, 5000], req: true }],
      protocol: { id: 'Lari bolak-balik 2 × 20 m dengan kecepatan naik, diselingi 10 detik pemulihan aktif; catat jarak total saat berhenti.', en: '2 × 20 m shuttles at rising speed with 10 s active recovery; record total distance at the end.' },
      pop: { id: 'Persamaan Yo-Yo IR1 dalam ulasan Bangsbo dkk. 2008', en: 'Yo-Yo IR1 equation reported in the Bangsbo et al. 2008 review' },
      refs: ['bangsbo'],
      caveat: { id: 'Hanya untuk level 1 (IR1), bukan IR2.', en: 'Level 1 (IR1) only, not IR2.' },
      calc(v, b, c) {
        const r = vo2YoYo1(v.dist);
        return { val: r, f: [c.L === 'id' ? 'VO₂max = jarak (m) × 0,0084 + 36,4' : 'VO₂max = distance (m) × 0.0084 + 36.4'], s: [`${c.f0(v.dist)} × 0,0084 + 36,4 = ${c.f1(r)}`],
          copy: `Yo-Yo IR1: ${c.f0(v.dist)} m → VO₂max ${c.f1(r)} ${c.u}` };
      },
    },
    {
      id: 'ift', short: 'Buchheit 2008', name: { id: '30-15 IFT (VIFT)', en: '30-15 IFT (VIFT)' }, needs: [], noVo2: true,
      fields: [{ k: 'vift', label: { id: 'Kecepatan akhir (VIFT)', en: 'Final speed (VIFT)' }, unit: { id: 'km/jam', en: 'km/h' }, lim: [8, 30], req: true, dec: true,
        hint: { id: 'Kecepatan tahap terakhir yang diselesaikan.', en: 'Speed of the last completed stage.' } }],
      protocol: { id: 'Lari 30 detik di lintasan 40 m, jalan 15 detik; kecepatan naik 0,5 km/jam tiap tahap 45 detik.', en: '30 s runs over a 40 m course with 15 s walking; speed rises 0.5 km/h every 45 s stage.' },
      pop: { id: 'Studi Buchheit 2008: 59 pemain olahraga intermiten muda, usia 16,2 ± 2,3 tahun; hasil dipakai untuk meresepkan latihan interval', en: 'Buchheit 2008 study: 59 young intermittent-sport players aged 16.2 ± 2.3 years; the result is used to prescribe interval training' },
      refs: ['buchheit', 'cheng'],
      caveat: { id: 'Aplikasi sengaja tidak menghitung VO₂max dari tes ini: asal persamaannya belum terkonfirmasi dan studi 2025 pada pemain sepak bola mahasiswa menemukan bias sistematis terhadap uji lab. VIFT paling berguna untuk memantau kebugaran intermiten dan meresepkan latihan interval.', en: 'The app deliberately does not compute VO₂max from this test: the equation’s origin is unconfirmed and a 2025 study in collegiate soccer players found systematic bias versus lab testing. VIFT is most useful for monitoring intermittent fitness and prescribing interval training.' },
      calc(v, b, c) {
        return { val: v.vift, mainLabel: 'VIFT', unit: c.L === 'id' ? 'km/jam' : 'km/h', d: 1,
          f: [c.L === 'id' ? 'Hasil = kecepatan tahap terakhir yang diselesaikan (tanpa rumus)' : 'Result = speed of the last completed stage (no formula)'], s: [],
          copy: c.L === 'id' ? `30-15 IFT: VIFT ${c.f1(v.vift)} km/jam` : `30-15 IFT: VIFT ${c.f1(v.vift)} km/h` };
      },
    },
    {
      id: 'smwt', short: 'Enright 1998', name: { id: 'Jalan 6 menit (6MWT)', en: '6-minute walk (6MWT)' }, needs: ['age', 'sex', 'weight', 'height'], noVo2: true,
      fields: [{ k: 'dist', label: { id: 'Jarak tempuh', en: 'Distance walked' }, unit: { id: 'm', en: 'm' }, lim: [50, 1000], req: true }],
      protocol: { id: 'Jalan secepat mungkin selama 6 menit di lorong datar 30 m; boleh berhenti istirahat.', en: 'Walk as far as possible in 6 minutes along a flat 30 m corridor; resting is allowed.' },
      pop: { id: 'Dewasa sehat usia 40–80 tahun; mengukur kapasitas fungsional, bukan VO₂max', en: 'Healthy adults aged 40–80; measures functional capacity, not VO₂max' },
      refs: ['enright'],
      calc(v, b, c) {
        const inAge = b.age >= 40 && b.age <= 80;
        const base = { mainLabel: c.L === 'id' ? 'Jarak tempuh' : 'Distance walked', unit: 'm', d: 0,
          f: [c.L === 'id' ? 'Pria: 7,57×TB(cm) − 5,02×usia − 1,76×BB(kg) − 309' : 'Men: 7.57×Ht(cm) − 5.02×age − 1.76×Wt(kg) − 309',
            c.L === 'id' ? 'Wanita: 2,11×TB − 2,29×BB − 5,78×usia + 667' : 'Women: 2.11×Ht − 2.29×Wt − 5.78×age + 667', c.L === 'id' ? '% prediksi = jarak / prediksi × 100' : '% predicted = distance / predicted × 100'] };
        if (!inAge) return { ...base, val: v.dist, s: [],
          flag: { level: 'info', text: c.L === 'id' ? 'Persamaan Enright hanya berlaku untuk usia 40–80 tahun, jadi % prediksi tidak dihitung.' : 'The Enright equation is valid only for ages 40–80, so % predicted is not calculated.' },
          copy: c.L === 'id' ? `6MWT: ${c.f0(v.dist)} m (% prediksi tidak dihitung: usia di luar 40–80 th)` : `6MWT: ${c.f0(v.dist)} m (% predicted not calculated: age outside 40–80 y)` };
        const male = b.sex === 'M', p = sixMwtPred(male, b.age, b.height, b.weight), pct = v.dist / p * 100;
        return { ...base, val: v.dist,
          rows: [[c.L === 'id' ? 'Prediksi' : 'Predicted', `${c.f0(p)} m`], [c.L === 'id' ? '% prediksi' : '% predicted', `${c.f0(pct)}%`]],
          s: [male ? `7,57×${c.f1(b.height)} − 5,02×${c.f0(b.age)} − 1,76×${c.f1(b.weight)} − 309 = ${c.f0(p)}` : `2,11×${c.f1(b.height)} − 2,29×${c.f1(b.weight)} − 5,78×${c.f0(b.age)} + 667 = ${c.f0(p)}`,
            `${c.f0(v.dist)} / ${c.f0(p)} × 100 = ${c.f0(pct)}%`],
          copy: c.L === 'id' ? `6MWT: ${c.f0(v.dist)} m = ${c.f0(pct)}% prediksi (${c.f0(p)} m)` : `6MWT: ${c.f0(v.dist)} m = ${c.f0(pct)}% predicted (${c.f0(p)} m)` };
      },
    },
  ],
  m3: [
    {
      id: 'rm', short: 'Epley 1985; Brzycki 1993', name: { id: 'Estimasi 1RM & tabel beban', en: '1RM estimate & load table' }, needs: [], special: 'rm',
      fields: [
        { k: 'load', label: { id: 'Beban yang diangkat', en: 'Load lifted' }, unit: { id: 'kg', en: 'kg' }, lim: [1, 500], req: true, dec: true },
        { k: 'reps', label: { id: 'Repetisi sampai gagal', en: 'Repetitions to failure' }, unit: { id: 'rep', en: 'reps' }, lim: [1, 10], req: true, int: true,
          hint: { id: 'Maksimal 10 repetisi; akurasi rumus menurun pada repetisi tinggi.', en: 'Maximum 10 repetitions; accuracy drops at high repetitions.' } },
        { k: 'meas', label: { id: '1RM terukur', en: 'Measured 1RM' }, unit: { id: 'kg', en: 'kg' }, lim: [1, 500], req: false, dec: true,
          hint: { id: 'Bila 1RM diuji langsung; menggantikan estimasi untuk tabel beban.', en: 'If 1RM was tested directly; replaces the estimate for the load table.' } },
      ],
      protocol: { id: 'Pemanasan, lalu satu set sampai gagal dengan teknik benar pada beban yang memberi ≤10 repetisi.', en: 'Warm up, then one set to failure with correct technique at a load allowing ≤10 repetitions.' },
      pop: { id: 'Epley: tabel praktisi (bukan studi tertelaah sejawat); Brzycki: artikel praktisi 1993', en: 'Epley: practitioner table (not peer reviewed); Brzycki: 1993 practitioner article' },
      refs: ['epley', 'brzycki', 'lesuer'],
      caveat: { id: 'LeSuer dkk. menguji tujuh persamaan pada bench press, squat, dan deadlift; akurasi berbeda antargerakan.', en: 'LeSuer et al. tested seven equations in the bench press, squat and deadlift; accuracy differs between lifts.' },
    },
    {
      id: 'grip', short: 'AWGS 2019; AWGS 2025', name: { id: 'Kekuatan genggam (handgrip)', en: 'Handgrip strength' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'kg', label: { id: 'Nilai genggam tertinggi', en: 'Highest grip value' }, unit: { id: 'kg', en: 'kg' }, lim: [2, 100], req: true, dec: true,
        hint: { id: 'Nilai tertinggi dari beberapa percobaan dinamometer.', en: 'Highest value from several dynamometer trials.' } }],
      protocol: { id: 'Dinamometer genggam; ikuti posisi baku alat yang dipakai; catat nilai tertinggi.', en: 'Hand-grip dynamometer; follow the standard position for the device used; record the highest value.' },
      pop: { id: 'Ambang Asia (AWGS): ≥65 tahun dari AWGS 2019; 50–64 tahun dari AWGS 2025', en: 'Asian thresholds (AWGS): ≥65 years from AWGS 2019; 50–64 years from AWGS 2025' },
      refs: ['awgs19', 'awgs25'],
      caveat: { id: 'Kekuatan rendah saja bukan diagnosis sarkopenia; AWGS 2025 mensyaratkan kekuatan rendah dan massa otot rendah bersamaan.', en: 'Low strength alone is not a sarcopenia diagnosis; AWGS 2025 requires concurrent low strength and low muscle mass.' },
      calc(v, b, c) {
        const male = b.sex === 'M', cut = gripCut(b.age, male);
        const base = { val: v.kg, mainLabel: c.L === 'id' ? 'Kekuatan genggam' : 'Grip strength', unit: 'kg', d: 1,
          f: [c.L === 'id' ? 'Ambang kekuatan rendah: ≥65 th <28 kg (pria) / <18 kg (wanita); 50–64 th <34 / <20 kg' : 'Low strength threshold: ≥65 y <28 kg (men) / <18 kg (women); 50–64 y <34 / <20 kg'], s: [] };
        if (cut === null) return { ...base,
          flag: { level: 'info', text: c.L === 'id' ? 'AWGS tidak menetapkan ambang untuk usia di bawah 50 tahun; nilai ditampilkan tanpa kategori.' : 'AWGS sets no threshold below age 50; the value is shown without a category.' },
          copy: c.L === 'id' ? `Handgrip: ${c.f1(v.kg)} kg (tanpa ambang AWGS untuk usia <50 th)` : `Handgrip: ${c.f1(v.kg)} kg (no AWGS threshold below 50 y)` };
        const low = v.kg < cut, src = b.age >= 65 ? 'AWGS 2019' : 'AWGS 2025';
        const txt = c.L === 'id' ? (low ? `Di bawah ambang ${src} (<${cut} kg): kekuatan otot rendah.` : `Tidak di bawah ambang ${src} (<${cut} kg).`) : (low ? `Below the ${src} threshold (<${cut} kg): low muscle strength.` : `Not below the ${src} threshold (<${cut} kg).`);
        return { ...base, s: [`${c.f1(v.kg)} ${low ? '<' : '≥'} ${cut} kg`], flag: { level: low ? 'warn' : 'info', text: txt },
          copy: c.L === 'id' ? `Handgrip: ${c.f1(v.kg)} kg — ${low ? 'di bawah' : 'tidak di bawah'} ambang ${src} (<${cut} kg)` : `Handgrip: ${c.f1(v.kg)} kg — ${low ? 'below' : 'not below'} ${src} threshold (<${cut} kg)` };
      },
    },
    {
      id: 'sts', short: 'AWGS 2019', name: { id: '5× sit-to-stand', en: '5× sit-to-stand' }, needs: ['age'], noVo2: true,
      fields: [{ k: 's', label: { id: 'Waktu 5 kali berdiri', en: 'Time for 5 stands' }, unit: { id: 'dtk', en: 's' }, lim: [2, 60], req: true, dec: true }],
      protocol: { id: 'Kursi tanpa sandaran tangan, lengan menyilang di dada; berdiri penuh dan duduk 5 kali secepat mungkin.', en: 'Chair without armrests, arms crossed on the chest; stand fully and sit 5 times as fast as possible.' },
      pop: { id: 'Ambang AWGS 2019 untuk usia ≥65 tahun', en: 'AWGS 2019 threshold for age ≥65 years' },
      refs: ['awgs19', 'awgs25'],
      caveat: { id: 'AWGS 2025 menjadikan performa fisik ukuran luaran, bukan kriteria diagnosis sarkopenia.', en: 'AWGS 2025 treats physical performance as an outcome measure, not a sarcopenia diagnostic criterion.' },
      calc(v, b, c) {
        const cut = stsCut(b.age);
        const base = { val: v.s, mainLabel: c.L === 'id' ? 'Waktu 5× sit-to-stand' : '5× sit-to-stand time', unit: c.L === 'id' ? 'dtk' : 's', d: 1,
          f: [c.L === 'id' ? 'Ambang performa fisik rendah: ≥12 detik (usia ≥65 th)' : 'Low physical performance threshold: ≥12 s (age ≥65 y)'], s: [] };
        if (cut === null) return { ...base,
          flag: { level: 'info', text: c.L === 'id' ? 'Ambang AWGS 2019 hanya untuk usia ≥65 tahun; waktu ditampilkan tanpa kategori.' : 'The AWGS 2019 threshold applies only to age ≥65; the time is shown without a category.' },
          copy: c.L === 'id' ? `5× sit-to-stand: ${c.f1(v.s)} dtk (tanpa ambang untuk usia <65 th)` : `5× sit-to-stand: ${c.f1(v.s)} s (no threshold below 65 y)` };
        const low = v.s >= cut;
        return { ...base, s: [`${c.f1(v.s)} ${low ? '≥' : '<'} 12`],
          flag: { level: low ? 'warn' : 'info', text: c.L === 'id' ? (low ? 'Mencapai ambang AWGS 2019 (≥12 dtk): performa fisik rendah.' : 'Di bawah ambang AWGS 2019 (≥12 dtk).') : (low ? 'Meets the AWGS 2019 threshold (≥12 s): low physical performance.' : 'Below the AWGS 2019 threshold (≥12 s).') },
          copy: c.L === 'id' ? `5× sit-to-stand: ${c.f1(v.s)} dtk — ${low ? 'mencapai' : 'di bawah'} ambang AWGS 2019 (≥12 dtk)` : `5× sit-to-stand: ${c.f1(v.s)} s — ${low ? 'meets' : 'below'} AWGS 2019 threshold (≥12 s)` };
      },
    },
  ],
};

// Tabel beban — detail sumber
export const RM_INFO = {
  epleyF: '1RM = beban × (1 + repetisi / 30)',
  brzyckiF: '1RM = beban × 36 / (37 − repetisi)',
  acsm: {
    id: 'ACSM 2026: kekuatan paling meningkat dengan beban ≥80% 1RM, 2–3 set, ≥2 sesi/minggu; hipertrofi dengan volume ≥10 set/minggu; power dengan beban sedang 30–70% 1RM.',
    en: 'ACSM 2026: strength improves most with loads ≥80% 1RM, 2–3 sets, ≥2 sessions/week; hypertrophy with ≥10 sets/week; power with moderate loads of 30–70% 1RM.',
  },
  nuzzoNote: {
    id: 'Repetisi = rerata ± SD antarindividu dari meta-regresi 269 studi (7.289 orang, mayoritas pria, sehat, usia <59 tahun). Nuzzo hanya membuat tabel khusus bench press dan leg press; squat, deadlift, dan latihan lain memakai tabel Umum. Squat sudah dianalisis dan tidak berbeda bermakna; deadlift tidak dianalisis tersendiri.',
    en: 'Reps = mean ± between-individual SD from a meta-regression of 269 studies (7,289 people, mostly male, healthy, aged <59). Nuzzo built separate tables only for the bench press and leg press; the squat, deadlift and other lifts use the General table. The squat was analysed without a meaningful difference; the deadlift was not analysed separately.',
  },
};

// v0.2 Tahap 2 — Modul 11–13 memakai mesin "pilih tes" yang sama
import { TESTS2, REF2 } from './tests2.js';
Object.assign(TESTS, TESTS2);
Object.assign(REF, REF2);
