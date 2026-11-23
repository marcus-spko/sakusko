// SakuSKO — v0.2 Tahap 2: Modul 11 Neuromotor, Modul 12 Daya Tahan & Power Otot, Modul 13 Fleksibilitas.
// Daftar tes mengikuti ACSM 2026 (Riebe dkk.). Ambang hanya ditampilkan bila tertulis di pedoman/sumber primer;
// tes tanpa norma valid ditampilkan sebagai hasil + selisih kiri-kanan tanpa kategori (keputusan dr. Marcus 2A).
import { gaitSpeed, ybtComposite, YBT_SEM, jumpHeightCm, stairPower, cs30Cut, fourStage, codDeficit, meanOf } from './formulas.js';

export const REF2 = {
  acsm26: { ref: 'Riebe D, Magal M, Kaminsky LA, Ross R, Phillips SM, Alhassan S, et al. The components of physical fitness: a roundtable statement by the American College of Sports Medicine. Med Sci Sports Exerc. 2026;58(8):1827-50.', doi: '10.1249/MSS.0000000000003997' },
  wfg22: { ref: 'Montero-Odasso M, van der Velde N, Martin FC, Petrovic M, Tan MP, Ryg J, et al. World guidelines for falls prevention and management for older adults: a global initiative. Age Ageing. 2022;51(9):afac205.', doi: '10.1093/ageing/afac205' },
  ewgsop2: { ref: 'Cruz-Jentoft AJ, Bahat G, Bauer J, Boirie Y, Bruyère O, Cederholm T, et al. Sarcopenia: revised European consensus on definition and diagnosis. Age Ageing. 2019;48(1):16-31.', doi: '10.1093/ageing/afy169' },
  awgs19b: { ref: 'Chen LK, Woo J, Assantachai P, Auyeung TW, Chou MY, Iijima K, et al. Asian Working Group for Sarcopenia: 2019 consensus update on sarcopenia diagnosis and treatment. J Am Med Dir Assoc. 2020;21(3):300-7.e2.', doi: '10.1016/j.jamda.2019.12.012' },
  podsiadlo: { ref: 'Podsiadlo D, Richardson S. The timed "Up & Go": a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc. 1991;39(2):142-8.', doi: '10.1111/j.1532-5415.1991.tb01616.x' },
  steadi: { ref: 'Centers for Disease Control and Prevention. STEADI assessment: Timed Up & Go, 30-second chair stand, and 4-stage balance test [lembar penilaian]. Atlanta: CDC; 2017.', doi: null },
  ficsit: { ref: 'Rossiter-Fornoff JE, Wolf SL, Wolfson LI, Buchner DM. A cross-sectional validation study of the FICSIT common data base static balance measures. J Gerontol A Biol Sci Med Sci. 1995;50(6):M291-7.', doi: '10.1093/gerona/50a.6.m291' },
  duncan90: { ref: 'Duncan PW, Weiner DK, Chandler J, Studenski S. Functional reach: a new clinical measure of balance. J Gerontol. 1990;45(6):M192-7.', doi: '10.1093/geronj/45.6.m192' },
  weiner92: { ref: 'Weiner DK, Duncan PW, Chandler J, Studenski SA. Functional reach: a marker of physical frailty. J Am Geriatr Soc. 1992;40(3):203-7.', doi: '10.1111/j.1532-5415.1992.tb02068.x' },
  plisky09: { ref: 'Plisky PJ, Gorman PP, Butler RJ, Kiesel KB, Underwood FB, Elkins B. The reliability of an instrumented device for measuring components of the Star Excursion Balance Test. N Am J Sports Phys Ther. 2009;4(2):92-9.', doi: null },
  plisky21: { ref: 'Plisky P, Schwartkopf-Phifer K, Huebner B, Garner MB, Bullock G. Systematic review and meta-analysis of the Y-Balance Test Lower Quarter: reliability, discriminant validity, and predictive validity. Int J Sports Phys Ther. 2021;16(5):1190-209.', doi: '10.26603/001c.27634' },
  nimphius16: { ref: 'Nimphius S, Callaghan SJ, Spiteri T, Lockie RG. Change of direction deficit: a more isolated measure of change of direction performance than total 505 time. J Strength Cond Res. 2016;30(11):3024-32.', doi: '10.1519/JSC.0000000000001421' },
  semenick: { ref: 'Semenick D. Tests and measurements: the T-test. NSCA J. 1990;12(1):36-7.', doi: null },
  getchell: { ref: 'Getchell B. Physical fitness: a way of life. 1979. (Buku; dikutip dari sumber sekunder, belum dibaca langsung.)', doi: null },
  csep03: { ref: 'Canadian Society for Exercise Physiology. The Canadian physical activity, fitness & lifestyle approach: CSEP-Health & Fitness Program\'s health-related appraisal and counselling strategy. 3rd ed. Ottawa: CSEP; 2003. (Buku; protokol dikutip dari sumber sekunder.)', doi: null },
  bohannon18: { ref: 'Bohannon RW, Steffl M, Glenney SS, Green M, Cashwell L, Prajerova K, et al. The prone bridge test: performance, validity, and reliability among older and younger adults. J Bodyw Mov Ther. 2018;22(2):385-9.', doi: '10.1016/j.jbmt.2017.07.005' },
  biering84: { ref: 'Biering-Sørensen F. Physical measurements as risk indicators for low-back trouble over a one-year period. Spine. 1984;9(2):106-19.', doi: '10.1097/00007632-198403000-00002' },
  rikli99: { ref: 'Rikli RE, Jones CJ. Development and validation of a functional fitness test for community-residing older adults. J Aging Phys Act. 1999;7(2):129-61.', doi: null },
  jones99: { ref: 'Jones CJ, Rikli RE, Beam WC. A 30-s chair-stand test as a measure of lower body strength in community-residing older adults. Res Q Exerc Sport. 1999;70(2):113-9.', doi: '10.1080/02701367.1999.10608028' },
  ni17: { ref: 'Ni M, Brown LG, Lawler D, Bean JF. Reliability, validity, and minimal detectable change of four-step stair climb power test in community-dwelling older adults. Phys Ther. 2017;97(7):767-73.', doi: '10.1093/ptj/pzx039' },
  bosco83: { ref: 'Bosco C, Luhtanen P, Komi PV. A simple method for measurement of mechanical power in jumping. Eur J Appl Physiol Occup Physiol. 1983;50(2):273-82.', doi: '10.1007/BF00422166' },
  balsalobre15: { ref: 'Balsalobre-Fernández C, Glaister M, Lockey RA. The validity and reliability of an iPhone app for measuring vertical jump performance. J Sports Sci. 2015;33(15):1574-9.', doi: '10.1080/02640414.2014.996184' },
  mayorga14: { ref: 'Mayorga-Vega D, Merino-Marban R, Viciana J. Criterion-related validity of sit-and-reach tests for estimating hamstring and lumbar extensibility: a meta-analysis. J Sports Sci Med. 2014;13(1):1-14.', doi: null },
  hershkovich22: { ref: 'Hershkovich O, Grevitt MP, Lotan R. Schober test and its modifications revisited—what are we actually measuring? Computerized tomography-based analysis. J Clin Med. 2022;11(23):6895.', doi: '10.3390/jcm11236895' },
  powden15: { ref: 'Powden CJ, Hoch JM, Hoch MC. Reliability and minimal detectable change of the weight-bearing lunge test: a systematic review. Man Ther. 2015;20(4):524-32.', doi: '10.1016/j.math.2015.01.004' },
  hanks23: { ref: 'Hanks J, Myers B. Validity, reliability, and efficiency of a standard goniometer, medical inclinometer, and builder\'s inclinometer. Int J Sports Phys Ther. 2023;18(4):989-96.', doi: '10.26603/001c.83944' },
};

const S_ = { id: 'dtk', en: 's' };
const CM = { id: 'cm', en: 'cm' };
const DEG = { id: '°', en: '°' };
const REP = { id: 'kali', en: 'reps' };
const sideOpt = k => ({ k, opt: true, def: 1, label: { id: 'Posisi ujung jari', en: 'Fingertip position' },
  options: [{ v: 1, label: { id: 'Melewati titik nol (+)', en: 'Beyond zero (+)' } }, { v: 2, label: { id: 'Belum mencapai titik nol (−)', en: 'Short of zero (−)' } }] });
const signed = (d, o) => (o === 2 ? -d : d);
const sgn = (x, f) => (x > 0 ? '+' : x < 0 ? '−' : '') + f(Math.abs(x));
const ELDER = 60;
const elderInfo = L => (L === 'id' ? 'Ambang pedoman hanya berlaku untuk lansia (pedoman memakai batas 60 atau 65 tahun); untuk usia lebih muda hasil ditampilkan tanpa kategori.' : 'Guideline thresholds apply only to older adults (guidelines use 60 or 65 years); for younger people the result is shown without a category.');
const yn = (L, yes) => (L === 'id' ? (yes ? 'Ya' : 'Tidak') : (yes ? 'Yes' : 'No'));
const lrRows = (c, l, r, unit, d = 0) => {
  const f = d ? c.f1 : c.f0, rows = [], u = x => (unit === '°' ? `${f(x)}°` : `${f(x)} ${unit}`);
  if (Number.isFinite(r)) rows.push([c.L === 'id' ? 'Kanan' : 'Right', u(r)]);
  if (Number.isFinite(l)) rows.push([c.L === 'id' ? 'Kiri' : 'Left', u(l)]);
  if (Number.isFinite(l) && Number.isFinite(r)) rows.push([c.L === 'id' ? 'Selisih kanan-kiri' : 'Right-left difference', u(Math.abs(r - l))]);
  return rows;
};
const lrCopy = (c, l, r, unit, d = 0) => {
  const f = d ? c.f1 : c.f0, p = [], u = x => (unit === '°' ? `${f(x)}°` : `${f(x)} ${unit}`);
  if (Number.isFinite(r)) p.push(`${c.L === 'id' ? 'kanan' : 'right'} ${u(r)}`);
  if (Number.isFinite(l)) p.push(`${c.L === 'id' ? 'kiri' : 'left'} ${u(l)}`);
  if (Number.isFinite(l) && Number.isFinite(r)) p.push(`${c.L === 'id' ? 'selisih' : 'difference'} ${u(Math.abs(r - l))}`);
  return p.join(', ');
};

export const TESTS2 = {
  // ===================== MODUL 11 · NEUROMOTOR =====================
  m11: [
    {
      id: 'gait', def: 'gait', short: 'WFG 2022; EWGSOP2; AWGS 2019', name: { id: 'Kecepatan jalan (gait speed)', en: 'Gait speed' }, needs: ['age'], noVo2: true,
      fields: [
        { k: 'd', label: { id: 'Jarak yang diukur waktunya', en: 'Timed distance' }, unit: { id: 'm', en: 'm' }, lim: [2, 20], req: true, dec: true,
          hint: { id: 'AWGS memakai 6 m, EWGSOP2 4 m, ACSM menyebut 10 m.', en: 'AWGS uses 6 m, EWGSOP2 4 m, ACSM mentions 10 m.' } },
        { k: 't', label: { id: 'Waktu tempuh', en: 'Time taken' }, unit: S_, lim: [0.5, 60], req: true, dec: true },
      ],
      protocol: { id: 'Jalan dengan kecepatan biasa (bukan secepat mungkin) di lintasan datar; ukur waktu untuk jarak yang ditentukan. Catat jarak yang sama dengan pedoman yang dipakai sebagai acuan.', en: 'Walk at usual (not maximal) pace on a level course; time the set distance. Use the same distance as the guideline you compare against.' },
      pop: { id: 'Ambang untuk lansia: WFG 2022 (risiko jatuh), EWGSOP2 dan AWGS 2019 (performa fisik pada sarkopenia)', en: 'Older-adult thresholds: WFG 2022 (fall risk), EWGSOP2 and AWGS 2019 (physical performance in sarcopenia)' },
      refs: ['acsm26', 'wfg22', 'ewgsop2', 'awgs19b'],
      caveat: { id: 'Ambang berasal dari jarak tertentu (AWGS 6 m, EWGSOP2 4 m) dan tujuan berbeda. AWGS 2025 menjadikan performa fisik ukuran luaran, bukan syarat diagnosis sarkopenia.', en: 'Thresholds come from specific distances (AWGS 6 m, EWGSOP2 4 m) and serve different purposes. AWGS 2025 treats physical performance as an outcome measure, not a sarcopenia diagnostic criterion.' },
      calc(v, b, c) {
        const sp = gaitSpeed(v.d, v.t), L = c.L;
        const base = { val: sp, d: 2, unit: 'm/s', mainLabel: L === 'id' ? 'Kecepatan jalan' : 'Gait speed', f: ['v = jarak / waktu'], s: [`${c.f1(v.d)} / ${c.f1(v.t)} = ${c.f2(sp)} m/s`] };
        if (!(b.age >= ELDER)) return { ...base, flag: { level: 'info', text: elderInfo(L) }, copy: `${L === 'id' ? 'Kecepatan jalan' : 'Gait speed'}: ${c.f1(v.d)} m / ${c.f1(v.t)} ${L === 'id' ? 'dtk' : 's'} = ${c.f2(sp)} m/s` };
        const wfg = sp < 0.8, ew = sp <= 0.8, aw = sp < 1.0;
        const rows = [
          [L === 'id' ? 'WFG 2022 <0,8 m/s (risiko jatuh)' : 'WFG 2022 <0.8 m/s (fall risk)', yn(L, wfg)],
          [L === 'id' ? 'EWGSOP2 ≤0,8 m/s (performa rendah)' : 'EWGSOP2 ≤0.8 m/s (low performance)', yn(L, ew)],
          [L === 'id' ? 'AWGS 2019 <1,0 m/s (performa rendah)' : 'AWGS 2019 <1.0 m/s (low performance)', yn(L, aw)],
        ];
        const any = wfg || ew || aw;
        return { ...base, rows, flag: { level: any ? 'warn' : 'info', text: L === 'id' ? (any ? 'Memenuhi minimal satu ambang di atas; tafsirkan sesuai tujuan pedomannya.' : 'Tidak memenuhi ambang mana pun di atas.') : (any ? 'Meets at least one threshold above; interpret according to each guideline\'s purpose.' : 'Meets none of the thresholds above.') },
          copy: L === 'id' ? `Kecepatan jalan: ${c.f2(sp)} m/s (${c.f1(v.d)} m) — WFG <0,8: ${yn(L, wfg)}; EWGSOP2 ≤0,8: ${yn(L, ew)}; AWGS 2019 <1,0: ${yn(L, aw)}` : `Gait speed: ${c.f2(sp)} m/s (${c.f1(v.d)} m) — WFG <0.8: ${yn(L, wfg)}; EWGSOP2 ≤0.8: ${yn(L, ew)}; AWGS 2019 <1.0: ${yn(L, aw)}` };
      },
    },
    {
      id: 'tug', def: 'tug', short: 'Podsiadlo 1991; STEADI 2017; WFG 2022; EWGSOP2', name: { id: 'Timed Up and Go (TUG)', en: 'Timed Up and Go (TUG)' }, needs: ['age'], noVo2: true,
      fields: [{ k: 't', label: { id: 'Waktu TUG', en: 'TUG time' }, unit: S_, lim: [3, 120], req: true, dec: true }],
      protocol: { id: 'Duduk bersandar di kursi berlengan, alas kaki biasa, alat bantu jalan boleh dipakai. Saat aba-aba "mulai": berdiri, jalan 3 m dengan kecepatan biasa, berbalik, kembali, dan duduk. Waktu dihentikan saat duduk kembali. Selalu dampingi.', en: 'Sit back in an armchair, regular footwear, usual walking aid allowed. On "go": stand, walk 3 m at normal pace, turn, walk back and sit. Stop timing when seated. Always stand by.' },
      pop: { id: 'Lansia: STEADI ≥12 dtk dan WFG >15 dtk (risiko jatuh); EWGSOP2 ≥20 dtk (performa rendah)', en: 'Older adults: STEADI ≥12 s and WFG >15 s (fall risk); EWGSOP2 ≥20 s (low performance)' },
      refs: ['podsiadlo', 'steadi', 'wfg22', 'ewgsop2', 'acsm26'],
      caveat: { id: 'WFG 2022 menilai bukti TUG untuk stratifikasi risiko jatuh "campuran" dan mengutamakan gait speed.', en: 'WFG 2022 rates the evidence for TUG in fall-risk stratification as "mixed" and prefers gait speed.' },
      calc(v, b, c) {
        const L = c.L, base = { val: v.t, d: 1, unit: L === 'id' ? 'dtk' : 's', mainLabel: 'TUG', f: [L === 'id' ? 'Waktu dari aba-aba sampai duduk kembali' : 'Time from "go" until seated again'], s: [] };
        if (!(b.age >= ELDER)) return { ...base, flag: { level: 'info', text: elderInfo(L) }, copy: `TUG: ${c.f1(v.t)} ${L === 'id' ? 'dtk' : 's'}` };
        const st = v.t >= 12, wf = v.t > 15, ew = v.t >= 20;
        const rows = [
          [L === 'id' ? 'STEADI ≥12 dtk (risiko jatuh)' : 'STEADI ≥12 s (fall risk)', yn(L, st)],
          [L === 'id' ? 'WFG 2022 >15 dtk (risiko jatuh)' : 'WFG 2022 >15 s (fall risk)', yn(L, wf)],
          [L === 'id' ? 'EWGSOP2 ≥20 dtk (performa rendah)' : 'EWGSOP2 ≥20 s (low performance)', yn(L, ew)],
        ];
        return { ...base, rows, flag: { level: st ? 'warn' : 'info', text: L === 'id' ? (st ? 'Memenuhi minimal satu ambang di atas.' : 'Tidak memenuhi ambang mana pun di atas.') : (st ? 'Meets at least one threshold above.' : 'Meets none of the thresholds above.') },
          copy: L === 'id' ? `TUG: ${c.f1(v.t)} dtk — STEADI ≥12: ${yn(L, st)}; WFG >15: ${yn(L, wf)}; EWGSOP2 ≥20: ${yn(L, ew)}` : `TUG: ${c.f1(v.t)} s — STEADI ≥12: ${yn(L, st)}; WFG >15: ${yn(L, wf)}; EWGSOP2 ≥20: ${yn(L, ew)}` };
      },
    },
    {
      id: 'fourstage', def: 'fourstage', short: 'STEADI 2017; Rossiter-Fornoff 1995', name: { id: 'Four Stage Balance Test', en: 'Four Stage Balance Test' }, needs: ['age'], noVo2: true,
      fields: [
        { k: 's1', label: { id: 'Tahap 1 · kaki berdampingan', en: 'Stage 1 · feet side by side' }, unit: S_, lim: [0, 10], req: true, dec: true },
        { k: 's2', label: { id: 'Tahap 2 · semi-tandem', en: 'Stage 2 · semi-tandem' }, unit: S_, lim: [0, 10], req: false, dec: true, hint: { id: 'Lengkung kaki satu menyentuh ibu jari kaki lainnya.', en: 'Instep of one foot touching the big toe of the other.' } },
        { k: 's3', label: { id: 'Tahap 3 · tandem', en: 'Stage 3 · tandem' }, unit: S_, lim: [0, 10], req: false, dec: true, hint: { id: 'Tumit satu kaki tepat di depan jari kaki lainnya.', en: 'Heel of one foot directly in front of the other\'s toes.' } },
        { k: 's4', label: { id: 'Tahap 4 · satu kaki', en: 'Stage 4 · one foot' }, unit: S_, lim: [0, 10], req: false, dec: true },
      ],
      protocol: { id: 'Tanpa alat bantu, mata terbuka. Tahan tiap posisi 10 detik tanpa memindah kaki atau berpegangan; lengan dan badan boleh bergerak. Bila tidak sanggup 10 detik, hentikan tes. Berdiri di samping pasien untuk berjaga.', en: 'No walking aid, eyes open. Hold each position for 10 s without moving the feet or holding on; arms and body may move. If unable to hold 10 s, stop the test. Stand beside the patient for safety.' },
      pop: { id: 'Lansia; CDC STEADI: tidak mampu tandem 10 detik = risiko jatuh meningkat', en: 'Older adults; CDC STEADI: unable to hold tandem for 10 s = increased fall risk' },
      refs: ['steadi', 'ficsit', 'acsm26'],
      calc(v, b, c) {
        const L = c.L, r = fourStage([v.s1, v.s2, v.s3, v.s4]);
        const base = { val: r.reached, d: 0, unit: L === 'id' ? 'dari 4 tahap' : 'of 4 stages', mainLabel: L === 'id' ? 'Tahap tertinggi (≥10 dtk)' : 'Highest stage (≥10 s)', f: [L === 'id' ? 'Tahap dihitung lulus bila ditahan 10 detik' : 'A stage passes when held for 10 s'], s: [] };
        if (r.tandem === null) return { ...base, flag: { level: 'info', text: L === 'id' ? 'Isi waktu tahap 3 (tandem) untuk menilai ambang STEADI.' : 'Enter the stage 3 (tandem) time to apply the STEADI threshold.' }, copy: `Four Stage Balance: ${L === 'id' ? 'tahap' : 'stage'} ${r.reached}/4` };
        if (!(b.age >= ELDER)) return { ...base, flag: { level: 'info', text: elderInfo(L) }, copy: `Four Stage Balance: ${L === 'id' ? 'tahap' : 'stage'} ${r.reached}/4` };
        const risk = !r.tandem;
        return { ...base, flag: { level: risk ? 'warn' : 'info', text: L === 'id' ? (risk ? 'Tidak mampu menahan tandem 10 detik: risiko jatuh meningkat (CDC STEADI).' : 'Mampu menahan tandem 10 detik.') : (risk ? 'Unable to hold tandem for 10 s: increased fall risk (CDC STEADI).' : 'Able to hold tandem for 10 s.') },
          copy: L === 'id' ? `Four Stage Balance: tahap ${r.reached}/4 — tandem 10 dtk: ${risk ? 'tidak mampu (risiko jatuh meningkat, STEADI)' : 'mampu'}` : `Four Stage Balance: stage ${r.reached}/4 — tandem 10 s: ${risk ? 'unable (increased fall risk, STEADI)' : 'able'}` };
      },
    },
    {
      id: 'freach', def: 'freach', short: 'Duncan 1990; Weiner 1992', name: { id: 'Functional Reach Test', en: 'Functional Reach Test' }, needs: [], noVo2: true,
      fields: [
        { k: 'r1', label: { id: 'Percobaan 1', en: 'Trial 1' }, unit: CM, lim: [0, 80], req: true, dec: true },
        { k: 'r2', label: { id: 'Percobaan 2', en: 'Trial 2' }, unit: CM, lim: [0, 80], req: false, dec: true },
        { k: 'r3', label: { id: 'Percobaan 3', en: 'Trial 3' }, unit: CM, lim: [0, 80], req: false, dec: true },
      ],
      protocol: { id: 'Berdiri menyamping di dekat dinding, penggaris dipasang setinggi akromion. Bahu fleksi 90°, tangan mengepal; catat posisi kepala metakarpal 3. Raih ke depan sejauh mungkin tanpa melangkah atau mengangkat tumit; skor = selisih posisi akhir dan awal. Dua kali latihan, lalu tiga percobaan dirata-rata.', en: 'Stand side-on near a wall with a ruler at acromion height. Shoulder flexed 90°, fist closed; note the 3rd metacarpal head. Reach forward as far as possible without stepping or lifting the heels; score = end minus start position. Two practice trials, then three trials averaged.' },
      pop: { id: 'Duncan 1990: 128 orang dewasa usia 21–87 tahun', en: 'Duncan 1990: 128 adults aged 21–87 years' },
      refs: ['duncan90', 'weiner92', 'acsm26'],
      caveat: { id: 'Tanpa kategori: ambang risiko jatuh berbeda-beda antarstudi. Jumlah percobaan mengikuti Weiner 1992; naskah asli Duncan 1990 belum dibaca utuh, dan sumber lain memakai variasi jumlah percobaan. Pakai protokol yang sama setiap kali.', en: 'No category: fall-risk cut-offs vary between studies. Number of trials follows Weiner 1992; the original Duncan 1990 paper has not been read in full, and other sources vary the trial count. Use the same protocol every time.' },
      calc(v, b, c) {
        const L = c.L, m = meanOf([v.r1, v.r2, v.r3]), n = [v.r1, v.r2, v.r3].filter(Number.isFinite).length;
        return { val: m, d: 1, unit: 'cm', mainLabel: L === 'id' ? `Rerata ${n} percobaan` : `Mean of ${n} trial${n > 1 ? 's' : ''}`, f: [L === 'id' ? 'Rerata percobaan yang diisi' : 'Mean of entered trials'], s: [],
          copy: L === 'id' ? `Functional Reach: rerata ${c.f1(m)} cm (${n} percobaan)` : `Functional Reach: mean ${c.f1(m)} cm (${n} trial${n > 1 ? 's' : ''})` };
      },
    },
    {
      id: 'ybt', def: 'ybt', short: 'Plisky 2009; Plisky 2021', name: { id: 'Y-Balance Test (tungkai bawah)', en: 'Y-Balance Test (lower quarter)' }, needs: [], noVo2: true,
      fields: [
        { k: 'll', label: { id: 'Panjang tungkai kanan', en: 'Right limb length' }, unit: CM, lim: [50, 130], req: true, dec: true, hint: { id: 'Telentang; SIAS sampai ujung bawah maleolus medial.', en: 'Supine; ASIS to the distal tip of the medial malleolus.' } },
        { k: 'llL', label: { id: 'Panjang tungkai kiri', en: 'Left limb length' }, unit: CM, lim: [50, 130], req: false, dec: true, tag: { id: 'Opsional', en: 'Optional' }, hint: { id: 'Kosong = memakai panjang tungkai kanan (seperti Plisky 2009).', en: 'Blank = uses the right limb length (as in Plisky 2009).' } },
        { k: 'aR', label: { id: 'Kanan · anterior', en: 'Right · anterior' }, unit: CM, lim: [10, 160], req: true, dec: true },
        { k: 'pmR', label: { id: 'Kanan · posteromedial', en: 'Right · posteromedial' }, unit: CM, lim: [10, 200], req: true, dec: true },
        { k: 'plR', label: { id: 'Kanan · posterolateral', en: 'Right · posterolateral' }, unit: CM, lim: [10, 200], req: true, dec: true },
        { k: 'aL', label: { id: 'Kiri · anterior', en: 'Left · anterior' }, unit: CM, lim: [10, 160], req: true, dec: true },
        { k: 'pmL', label: { id: 'Kiri · posteromedial', en: 'Left · posteromedial' }, unit: CM, lim: [10, 200], req: true, dec: true },
        { k: 'plL', label: { id: 'Kiri · posterolateral', en: 'Left · posterolateral' }, unit: CM, lim: [10, 200], req: true, dec: true },
      ],
      protocol: { id: 'Kit Y-Balance. Enam kali latihan tiap arah, lalu tiga percobaan; catat raihan terjauh yang berhasil. Urutan: anterior kanan-kiri, posteromedial kanan-kiri, posterolateral kanan-kiri (kanan = tungkai tumpu kanan). Gagal bila menapak lantai, menendang indikator, bertumpu pada indikator, atau tidak kembali terkendali.', en: 'Y-Balance kit. Six practice trials per direction, then three trials; record the farthest successful reach. Order: anterior right-left, posteromedial right-left, posterolateral right-left (right = right stance limb). Fail if touching down, kicking the indicator, resting on it, or not returning under control.' },
      pop: { id: 'Plisky 2009: 15 pemain sepak bola pria mahasiswa (reliabilitas)', en: 'Plisky 2009: 15 male collegiate soccer players (reliability)' },
      refs: ['plisky09', 'plisky21', 'acsm26'],
      caveat: { id: 'Tanpa ambang risiko cedera: tinjauan sistematis 2021 menyimpulkan patokan umum mungkin tidak memprediksi cedera dan nilai berbeda menurut jenis kelamin, cabor, dan usia.', en: 'No injury-risk threshold: a 2021 systematic review concluded generic cut-offs may not predict injury and values differ by sex, sport and age.' },
      calc(v, b, c) {
        const L = c.L, llR = v.ll, llL = Number.isFinite(v.llL) ? v.llL : v.ll;
        const cR = ybtComposite(v.aR, v.pmR, v.plR, llR), cL = ybtComposite(v.aL, v.pmL, v.plL, llL);
        const dir = [['a', 'Anterior', v.aR, v.aL], ['pm', 'Posteromedial', v.pmR, v.pmL], ['pl', 'Posterolateral', v.plR, v.plL]];
        const rows = [[L === 'id' ? 'Komposit kanan' : 'Right composite', `${c.f1(cR)}%`], [L === 'id' ? 'Komposit kiri' : 'Left composite', `${c.f1(cL)}%`]];
        const within = [];
        for (const [k, nm, r, l] of dir) {
          const df = Math.abs(r - l), inErr = df <= YBT_SEM[k];
          rows.push([`${L === 'id' ? 'Selisih' : 'Difference'} ${nm}`, `${c.f1(df)} cm${inErr ? (L === 'id' ? ' (≤ SEM)' : ' (≤ SEM)') : ''}`]);
          if (inErr) within.push(nm);
        }
        return { valText: `${c.f1(cR)}% / ${c.f1(cL)}%`, val: cR, d: 1, unit: L === 'id' ? 'kanan / kiri' : 'right / left', mainLabel: L === 'id' ? 'Skor komposit' : 'Composite score', rows,
          flag: { level: 'info', text: L === 'id' ? 'SEM intrarater Plisky 2009: anterior 2,0; posteromedial 2,8; posterolateral 3,1 cm. Selisih yang tidak melebihi SEM kemungkinan masih dalam galat ukur.' : 'Plisky 2009 intrarater SEM: anterior 2.0; posteromedial 2.8; posterolateral 3.1 cm. A difference not exceeding the SEM is likely within measurement error.' },
          f: [L === 'id' ? 'Komposit = (anterior + posteromedial + posterolateral) / (3 × panjang tungkai) × 100' : 'Composite = (anterior + posteromedial + posterolateral) / (3 × limb length) × 100'],
          s: [`${L === 'id' ? 'Kanan' : 'Right'}: (${c.f1(v.aR)} + ${c.f1(v.pmR)} + ${c.f1(v.plR)}) / (3 × ${c.f1(llR)}) × 100 = ${c.f1(cR)}%`, `${L === 'id' ? 'Kiri' : 'Left'}: (${c.f1(v.aL)} + ${c.f1(v.pmL)} + ${c.f1(v.plL)}) / (3 × ${c.f1(llL)}) × 100 = ${c.f1(cL)}%`],
          copy: L === 'id' ? `Y-Balance: komposit kanan ${c.f1(cR)}%, kiri ${c.f1(cL)}%; selisih anterior ${c.f1(Math.abs(v.aR - v.aL))} cm, posteromedial ${c.f1(Math.abs(v.pmR - v.pmL))} cm, posterolateral ${c.f1(Math.abs(v.plR - v.plL))} cm` : `Y-Balance: right composite ${c.f1(cR)}%, left ${c.f1(cL)}%; difference anterior ${c.f1(Math.abs(v.aR - v.aL))} cm, posteromedial ${c.f1(Math.abs(v.pmR - v.pmL))} cm, posterolateral ${c.f1(Math.abs(v.plR - v.plL))} cm` };
      },
    },
    {
      id: 'illinois', def: 'agility', short: 'Getchell 1979', name: { id: 'Illinois Agility Test', en: 'Illinois Agility Test' }, needs: [], noVo2: true,
      fields: [{ k: 't1', label: { id: 'Percobaan 1', en: 'Trial 1' }, unit: S_, lim: [8, 60], req: true, dec: true }, { k: 't2', label: { id: 'Percobaan 2', en: 'Trial 2' }, unit: S_, lim: [8, 60], req: false, dec: true }],
      protocol: { id: 'Lintasan 10 × 5 m: 4 kerucut di sudut, 4 kerucut di tengah berjarak 3,3 m. Mulai telungkup di garis start; saat aba-aba, berdiri, lari 10 m dan kembali, zig-zag melewati kerucut tengah pergi-pulang, lalu lari 10 m dan kembali ke garis finis.', en: '10 × 5 m course: 4 corner cones, 4 centre cones 3.3 m apart. Start prone at the start line; on "go", get up, run 10 m and back, weave through the centre cones up and back, then run 10 m and back to the finish.' },
      pop: { id: 'Tes untuk atlet; tanpa norma yang valid untuk populasi Indonesia', en: 'Athlete test; no valid norms for the Indonesian population' },
      refs: ['getchell', 'acsm26'],
      caveat: { id: 'ACSM 2026: tes kelincahan umumnya hanya mengukur sebagian aspek (perubahan arah dan kecepatan) dan banyak dirancang untuk atlet. Naskah asli Getchell (buku) belum dibaca; protokol konsisten di beberapa sumber sekunder.', en: 'ACSM 2026: agility tests usually measure only some aspects (change of direction and speed) and many were designed for athletes. Getchell\'s original book has not been read; the protocol is consistent across several secondary sources.' },
      calc(v, b, c) {
        const L = c.L, best = Math.min(...[v.t1, v.t2].filter(Number.isFinite));
        return { val: best, d: 2, unit: L === 'id' ? 'dtk' : 's', mainLabel: L === 'id' ? 'Waktu terbaik' : 'Best time', f: [L === 'id' ? 'Waktu terbaik dari percobaan yang diisi' : 'Best of the entered trials'], s: [], copy: `Illinois: ${c.f2(best)} ${L === 'id' ? 'dtk (terbaik)' : 's (best)'}` };
      },
    },
    {
      id: 'ttest', def: 'agility', short: 'Semenick 1990', name: { id: 'Agility T-test', en: 'Agility T-test' }, needs: [], noVo2: true,
      fields: [{ k: 't1', label: { id: 'Percobaan 1', en: 'Trial 1' }, unit: S_, lim: [6, 40], req: true, dec: true }, { k: 't2', label: { id: 'Percobaan 2', en: 'Trial 2' }, unit: S_, lim: [6, 40], req: false, dec: true }],
      protocol: { id: 'Empat kerucut berbentuk T. Lari maju 9,14 m ke kerucut tengah, geser ke kiri 4,57 m, geser ke kanan 9,14 m, geser ke kiri 4,57 m kembali ke tengah, lalu lari mundur ke garis start; sentuh tiap kerucut.', en: 'Four cones in a T. Sprint 9.14 m forward to the centre cone, shuffle 4.57 m left, shuffle 9.14 m right, shuffle 4.57 m left back to centre, then backpedal to the start; touch each cone.' },
      pop: { id: 'Tes untuk atlet; tanpa norma yang valid untuk populasi Indonesia', en: 'Athlete test; no valid norms for the Indonesian population' },
      refs: ['semenick', 'acsm26'],
      caveat: { id: 'ACSM 2026: tes kelincahan umumnya hanya mengukur sebagian aspek dan banyak dirancang untuk atlet. Naskah asli Semenick 1990 belum dibaca; protokol konsisten di beberapa sumber sekunder.', en: 'ACSM 2026: agility tests usually measure only some aspects and many were designed for athletes. Semenick\'s 1990 original has not been read; the protocol is consistent across several secondary sources.' },
      calc(v, b, c) {
        const L = c.L, best = Math.min(...[v.t1, v.t2].filter(Number.isFinite));
        return { val: best, d: 2, unit: L === 'id' ? 'dtk' : 's', mainLabel: L === 'id' ? 'Waktu terbaik' : 'Best time', f: [L === 'id' ? 'Waktu terbaik dari percobaan yang diisi' : 'Best of the entered trials'], s: [], copy: `T-test: ${c.f2(best)} ${L === 'id' ? 'dtk (terbaik)' : 's (best)'}` };
      },
    },
    {
      id: 'cod505', def: 'cod', short: 'Nimphius 2016', name: { id: '505 + COD deficit (atlet)', en: '505 + COD deficit (athletes)' }, needs: [], noVo2: true,
      fields: [
        { k: 'r', label: { id: '505 · berbalik dengan kaki kanan', en: '505 · turning on the right foot' }, unit: S_, lim: [1.5, 6], req: true, dec: true },
        { k: 'l', label: { id: '505 · berbalik dengan kaki kiri', en: '505 · turning on the left foot' }, unit: S_, lim: [1.5, 6], req: true, dec: true },
        { k: 's10', label: { id: 'Sprint 10 m', en: '10 m sprint' }, unit: S_, lim: [1.2, 4], req: true, dec: true, hint: { id: 'Waktu split 10 m dari tes sprint.', en: '10 m split time from a sprint test.' } },
      ],
      protocol: { id: 'Ancang-ancang 10 m melewati gerbang waktu, lari 5 m lagi ke garis balik, berbalik 180°, dan kembali melewati gerbang; waktu = 5 m pergi dan 5 m kembali. Lakukan untuk kaki kanan dan kiri.', en: '10 m run-up past a timing gate, 5 m further to the turn line, 180° turn, and back through the gate; time = 5 m out and 5 m back. Test both the right and left foot.' },
      pop: { id: 'Nimphius 2016: 17 pemain kriket', en: 'Nimphius 2016: 17 cricketers' },
      refs: ['nimphius16', 'acsm26'],
      caveat: { id: 'Tanpa norma. Tes 505 tidak disebut di ACSM 2026; ditambahkan untuk atlet sesuai keputusan dr. Marcus. Naskah asli 505 (Draper & Lancaster 1985) belum dibaca; protokol konsisten di beberapa sumber.', en: 'No norms. The 505 is not named in ACSM 2026; added for athletes per Dr Marcus\'s decision. The original 505 paper (Draper & Lancaster 1985) has not been read; the protocol is consistent across several sources.' },
      calc(v, b, c) {
        const L = c.L, dR = codDeficit(v.r, v.s10), dL = codDeficit(v.l, v.s10), m = (dR + dL) / 2;
        const rows = [[L === 'id' ? 'COD deficit kanan' : 'Right COD deficit', `${c.f2(dR)} ${L === 'id' ? 'dtk' : 's'}`], [L === 'id' ? 'COD deficit kiri' : 'Left COD deficit', `${c.f2(dL)} ${L === 'id' ? 'dtk' : 's'}`], [L === 'id' ? 'Selisih 505 kanan-kiri' : '505 right-left difference', `${c.f2(Math.abs(v.r - v.l))} ${L === 'id' ? 'dtk' : 's'}`]];
        return { val: m, d: 2, unit: L === 'id' ? 'dtk' : 's', mainLabel: L === 'id' ? 'Rerata COD deficit' : 'Mean COD deficit', rows,
          f: ['COD deficit = waktu 505 − waktu sprint 10 m'], s: [`${c.f2(v.r)} − ${c.f2(v.s10)} = ${c.f2(dR)}`, `${c.f2(v.l)} − ${c.f2(v.s10)} = ${c.f2(dL)}`],
          copy: L === 'id' ? `505: kanan ${c.f2(v.r)} dtk, kiri ${c.f2(v.l)} dtk; sprint 10 m ${c.f2(v.s10)} dtk; COD deficit kanan ${c.f2(dR)}, kiri ${c.f2(dL)} dtk` : `505: right ${c.f2(v.r)} s, left ${c.f2(v.l)} s; 10 m sprint ${c.f2(v.s10)} s; COD deficit right ${c.f2(dR)}, left ${c.f2(dL)} s` };
      },
    },
  ],

  // ===================== MODUL 12 · DAYA TAHAN & POWER OTOT =====================
  m12: [
    {
      id: 'pushup', def: 'pushup', short: 'CSEP 2003; ACSM 2026', name: { id: 'Push-up', en: 'Push-up' }, needs: [], noVo2: true,
      fields: [
        { k: 'var', opt: true, def: 1, label: { id: 'Variasi', en: 'Variation' }, options: [{ v: 1, label: { id: 'Standar (tumpuan jari kaki)', en: 'Standard (on the toes)' } }, { v: 2, label: { id: 'Modifikasi (tumpuan lutut)', en: 'Modified (on the knees)' } }] },
        { k: 'n', label: { id: 'Jumlah push-up benar', en: 'Correct push-ups' }, unit: REP, lim: [0, 150], req: true, int: true },
      ],
      protocol: { id: 'Mulai dari posisi bawah, tangan di bawah bahu menghadap depan, punggung lurus. Dorong sampai siku lurus penuh lalu turun kembali; lakukan berturut-turut tanpa istirahat sampai lelah. Hanya repetisi dengan bentuk benar yang dihitung.', en: 'Start in the down position, hands under the shoulders pointing forward, back straight. Push to full elbow extension and lower again; perform consecutively without rest until fatigue. Count only correct repetitions.' },
      pop: { id: 'Protokol CSEP/ACSM; tanpa norma yang valid untuk populasi Indonesia', en: 'CSEP/ACSM protocol; no valid norms for the Indonesian population' },
      refs: ['csep03', 'acsm26'],
      caveat: { id: 'Protokol ACSM/CSEP lazim memakai variasi standar untuk pria dan lutut untuk wanita; pilih variasi sesuai kemampuan dan pakai yang sama saat tes ulang. Buku ACSM GETP belum dibaca langsung; protokol konsisten di beberapa sumber.', en: 'ACSM/CSEP protocols usually use the standard version for men and the knee version for women; choose by ability and keep the same version on retest. The ACSM GETP book has not been read directly; the protocol is consistent across several sources.' },
      calc(v, b, c) {
        const L = c.L, vr = v.var === 2 ? (L === 'id' ? 'modifikasi (lutut)' : 'modified (knees)') : (L === 'id' ? 'standar' : 'standard');
        return { val: v.n, d: 0, unit: L === 'id' ? 'kali' : 'reps', mainLabel: L === 'id' ? `Push-up ${vr}` : `${vr[0].toUpperCase()}${vr.slice(1)} push-up`, f: [L === 'id' ? 'Jumlah repetisi benar berturut-turut' : 'Number of consecutive correct repetitions'], s: [], copy: `Push-up ${vr}: ${c.f0(v.n)} ${L === 'id' ? 'kali' : 'reps'}` };
      },
    },
    {
      id: 'plank', def: 'plank', short: 'Bohannon 2018', name: { id: 'Plank (prone bridge)', en: 'Plank (prone bridge)' }, needs: [], noVo2: true,
      fields: [{ k: 't', label: { id: 'Waktu bertahan', en: 'Hold time' }, unit: S_, lim: [0, 1200], req: true, dec: true }],
      protocol: { id: 'Posisi plank telungkup; tahan sampai lelah atau sampai teknik gagal berulang. Catat waktunya.', en: 'Prone plank position; hold until volitional exhaustion or repeated technique failure. Record the time.' },
      pop: { id: 'Bohannon 2018: 60 dewasa muda (20–35 th) dan 60 lansia (60–79 th) di AS; reliabilitas ICC 0,915', en: 'Bohannon 2018: 60 younger (20–35 y) and 60 older (60–79 y) US adults; reliability ICC 0.915' },
      refs: ['bohannon18', 'acsm26'],
      caveat: { id: 'Tanpa norma yang valid; dipakai untuk memantau perubahan pada orang yang sama.', en: 'No valid norms; use it to track change in the same person.' },
      calc(v, b, c) { const L = c.L; return { val: v.t, d: 0, unit: L === 'id' ? 'dtk' : 's', mainLabel: L === 'id' ? 'Waktu plank' : 'Plank time', f: [L === 'id' ? 'Waktu sampai lelah atau teknik gagal' : 'Time to exhaustion or technique failure'], s: [], copy: `Plank: ${c.f0(v.t)} ${L === 'id' ? 'dtk' : 's'}` }; },
    },
    {
      id: 'backext', def: 'backext', short: 'Biering-Sørensen 1984', name: { id: 'Ketahanan ekstensor punggung (Biering-Sørensen)', en: 'Back extensor endurance (Biering-Sørensen)' }, needs: [], noVo2: true,
      fields: [{ k: 't', label: { id: 'Waktu bertahan', en: 'Hold time' }, unit: S_, lim: [0, 240], req: true, dec: true }],
      protocol: { id: 'Telungkup di meja dengan tepi atas krista iliaka di tepi meja; panggul, lutut, dan pergelangan kaki difiksasi tali. Lengan menyilang di dada; tahan badan atas lurus horizontal selama mungkin, maksimal 240 detik.', en: 'Prone on a table with the upper iliac crest at the edge; pelvis, knees and ankles strapped. Arms crossed on the chest; hold the upper body horizontal as long as possible, up to 240 s.' },
      pop: { id: 'Biering-Sørensen 1984: 928 penduduk Glostrup (Denmark) usia 30–60 tahun', en: 'Biering-Sørensen 1984: 928 Glostrup (Denmark) residents aged 30–60' },
      refs: ['biering84', 'acsm26'],
      caveat: { id: 'Tanpa kategori. Ambang 176/198 detik yang sering dikutip berasal dari satu kohort pria Denmark, sehingga tidak dipakai sebagai patokan.', en: 'No category. The often-quoted 176/198 s cut-offs come from a single cohort of Danish men and are not used as a standard.' },
      calc(v, b, c) { const L = c.L; return { val: v.t, d: 0, unit: L === 'id' ? 'dtk' : 's', mainLabel: L === 'id' ? 'Waktu bertahan' : 'Hold time', f: [L === 'id' ? 'Waktu menahan posisi horizontal (maks. 240 dtk)' : 'Time holding the horizontal position (max 240 s)'], s: [], copy: `Biering-Sørensen: ${c.f0(v.t)} ${L === 'id' ? 'dtk' : 's'}` }; },
    },
    {
      id: 'cs30', def: 'cs30', short: 'Jones 1999; Rikli & Jones 1999; STEADI 2017', name: { id: '30-s chair stand', en: '30-s chair stand' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Jumlah berdiri dalam 30 detik', en: 'Stands in 30 seconds' }, unit: REP, lim: [0, 60], req: true, int: true }],
      protocol: { id: 'Kursi tanpa sandaran tangan setinggi ±43 cm, disandarkan ke dinding. Duduk di tengah kursi, punggung tegak, kaki rata di lantai, lengan menyilang di dada. Saat aba-aba, berdiri penuh lalu duduk penuh sebanyak mungkin dalam 30 detik. Satu latihan 1–3 repetisi, lalu satu percobaan. Bila lebih dari setengah jalan saat 30 detik habis, dihitung satu.', en: 'Armless chair about 43 cm high, placed against a wall. Sit in the middle, back straight, feet flat, arms crossed on the chest. On "go", stand fully and sit fully as many times as possible in 30 s. One practice of 1–3 reps, then one trial. More than halfway up at 30 s counts as a stand.' },
      pop: { id: 'Tabel batas bawah rentang normal: lansia AS 60–94 tahun (Rikli & Jones), dipakai CDC STEADI', en: 'Lower-bound table of the normal range: US older adults aged 60–94 (Rikli & Jones), used by CDC STEADI' },
      refs: ['jones99', 'rikli99', 'steadi', 'acsm26'],
      caveat: { id: '"Di bawah rata-rata" = di bawah rentang normal (tengah 50%) data lansia AS, bukan ambang risiko jatuh yang divalidasi; CDC STEADI memakainya sebagai indikasi risiko jatuh.', en: '"Below average" = below the normal range (middle 50%) of US older-adult data, not a validated fall-risk cut-off; CDC STEADI uses it as a fall-risk indicator.' },
      calc(v, b, c) {
        const L = c.L, cut = cs30Cut(b.age, b.sex === 'M');
        const base = { val: v.n, d: 0, unit: L === 'id' ? 'kali' : 'stands', mainLabel: L === 'id' ? 'Jumlah berdiri' : 'Number of stands', f: [L === 'id' ? 'Jumlah berdiri penuh yang benar dalam 30 detik' : 'Correct full stands in 30 s'], s: [] };
        if (cut === null) return { ...base, flag: { level: 'info', text: L === 'id' ? 'Tabel STEADI hanya untuk usia 60–94 tahun; hasil ditampilkan tanpa kategori.' : 'The STEADI table covers ages 60–94 only; the result is shown without a category.' }, copy: `30-s chair stand: ${c.f0(v.n)} ${L === 'id' ? 'kali' : 'stands'}` };
        const low = v.n < cut;
        return { ...base, s: [`${c.f0(v.n)} ${low ? '<' : '≥'} ${cut}`], flag: { level: low ? 'warn' : 'info', text: L === 'id' ? (low ? `Di bawah rentang normal (<${cut}) untuk usia dan jenis kelamin ini; CDC STEADI: indikasi risiko jatuh.` : `Tidak di bawah rentang normal (batas bawah ${cut}).`) : (low ? `Below the normal range (<${cut}) for this age and sex; CDC STEADI: fall-risk indicator.` : `Not below the normal range (lower bound ${cut}).`) },
          copy: L === 'id' ? `30-s chair stand: ${c.f0(v.n)} kali — ${low ? 'di bawah' : 'tidak di bawah'} rentang normal (batas bawah ${cut}, STEADI)` : `30-s chair stand: ${c.f0(v.n)} stands — ${low ? 'below' : 'not below'} normal range (lower bound ${cut}, STEADI)` };
      },
    },
    {
      id: 'armcurl', def: 'armcurl', short: 'Rikli & Jones 1999', name: { id: '30-s arm curl', en: '30-s arm curl' }, needs: [], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Jumlah curl dalam 30 detik', en: 'Curls in 30 seconds' }, unit: REP, lim: [0, 60], req: true, int: true }],
      protocol: { id: 'Duduk di kursi tanpa sandaran tangan, sisi dominan dekat tepi kursi; dumbel 2,27 kg (wanita) atau 3,63 kg (pria) di tangan dominan. Curl penuh sambil memutar telapak ke atas, lalu kembali lurus; lengan atas tetap diam. Satu latihan 1–2 repetisi, lalu satu percobaan 30 detik. Lebih dari setengah jalan saat waktu habis dihitung satu.', en: 'Seated on an armless chair, dominant side near the edge; 2.27 kg (women) or 3.63 kg (men) dumbbell in the dominant hand. Curl fully while turning the palm up, then return to full extension; keep the upper arm still. One practice of 1–2 reps, then one 30-s trial. More than halfway up when time ends counts.' },
      pop: { id: 'Rikli & Jones 1999: lansia komunitas AS', en: 'Rikli & Jones 1999: US community-dwelling older adults' },
      refs: ['rikli99', 'acsm26'],
      caveat: { id: 'Tanpa kategori: norma Rikli & Jones berasal dari lansia AS dan tidak dipakai CDC sebagai indikator risiko.', en: 'No category: Rikli & Jones norms come from US older adults and are not used by CDC as a risk indicator.' },
      calc(v, b, c) { const L = c.L; return { val: v.n, d: 0, unit: L === 'id' ? 'kali' : 'curls', mainLabel: L === 'id' ? 'Jumlah curl' : 'Number of curls', f: [L === 'id' ? 'Jumlah curl benar dalam 30 detik' : 'Correct curls in 30 s'], s: [], copy: `30-s arm curl: ${c.f0(v.n)} ${L === 'id' ? 'kali' : 'curls'}` }; },
    },
    {
      id: 'scpt', def: 'scpt', short: 'Ni 2017', name: { id: 'Stair climb power (4 anak tangga)', en: 'Stair climb power (4 steps)' }, needs: ['weight'], noVo2: true,
      fields: [
        { k: 'h', label: { id: 'Tinggi total anak tangga', en: 'Total stair height' }, unit: CM, lim: [30, 400], req: true, dec: true, hint: { id: 'Ni 2017: 4 anak tangga = 76,2 cm.', en: 'Ni 2017: 4 steps = 76.2 cm.' } },
        { k: 't1', label: { id: 'Waktu percobaan 1', en: 'Trial 1 time' }, unit: S_, lim: [0.5, 30], req: true, dec: true },
        { k: 't2', label: { id: 'Waktu percobaan 2', en: 'Trial 2 time' }, unit: S_, lim: [0.5, 30], req: false, dec: true },
      ],
      protocol: { id: 'Berdiri di dasar tangga; saat "siap, mulai", naik secepat mungkin. Waktu dari aba-aba sampai kedua kaki di anak tangga teratas. Pegangan boleh dipakai demi keamanan. Dua percobaan berturut-turut dirata-rata.', en: 'Stand at the foot of the stairs; on "ready, set, go", climb as fast as possible. Time from "go" until both feet are on the top step. The handrail may be used for safety. Two consecutive trials are averaged.' },
      pop: { id: 'Ni 2017: 50 lansia ≥65 tahun berisiko penurunan mobilitas; reliabilitas ICC 0,951', en: 'Ni 2017: 50 adults ≥65 years at risk of mobility decline; reliability ICC 0.951' },
      refs: ['ni17', 'acsm26'],
      caveat: { id: 'Tanpa norma. MDC90 versi 4 anak tangga = 44 W (Ni 2017): perubahan lebih kecil dari ini mungkin hanya galat ukur.', en: 'No norms. MDC90 for the 4-step version = 44 W (Ni 2017): smaller changes may be measurement error.' },
      calc(v, b, c) {
        const L = c.L, t = meanOf([v.t1, v.t2]), p = stairPower(b.weight, v.h / 100, t);
        return { val: p, d: 0, unit: 'W', mainLabel: 'Stair climb power', rows: [[L === 'id' ? 'Per kg berat badan' : 'Per kg body mass', `${c.f2(p / b.weight)} W/kg`], [L === 'id' ? 'Waktu dipakai (rerata)' : 'Time used (mean)', `${c.f2(t)} ${L === 'id' ? 'dtk' : 's'}`]],
          f: [L === 'id' ? 'Power = BB (kg) × 9,8 × tinggi total (m) / waktu (dtk)' : 'Power = mass (kg) × 9.8 × total height (m) / time (s)'], s: [`${c.f1(b.weight)} × ${c.k('9,8')} × ${c.f2(v.h / 100)} / ${c.f2(t)} = ${c.f0(p)} W`],
          copy: L === 'id' ? `Stair climb power: ${c.f0(p)} W (${c.f2(p / b.weight)} W/kg; tinggi ${c.f1(v.h)} cm, waktu ${c.f2(t)} dtk)` : `Stair climb power: ${c.f0(p)} W (${c.f2(p / b.weight)} W/kg; height ${c.f1(v.h)} cm, time ${c.f2(t)} s)` };
      },
    },
    {
      id: 'cmj', def: 'cmj', short: 'Bosco 1983; Balsalobre-Fernández 2015', name: { id: 'Countermovement jump (waktu melayang)', en: 'Countermovement jump (flight time)' }, needs: [], noVo2: true,
      fields: [{ k: 'ft', label: { id: 'Waktu melayang terbaik', en: 'Best flight time' }, unit: { id: 'ms', en: 'ms' }, lim: [100, 1200], req: true, dec: true, hint: { id: 'Dari jump mat atau aplikasi kamera HP yang sudah divalidasi.', en: 'From a jump mat or a validated phone-camera app.' } }],
      protocol: { id: 'Tangan di pinggang, turun cepat lalu lompat setinggi mungkin; mendarat dengan lutut dan pergelangan kaki lurus seperti saat lepas landas. Catat waktu melayang terbaik.', en: 'Hands on hips, dip quickly and jump as high as possible; land with knees and ankles extended as at take-off. Record the best flight time.' },
      pop: { id: 'Rumus fisika gerak jatuh bebas; validasi aplikasi: 20 pria aktif (bias +1,1 cm terhadap force plate)', en: 'Free-fall physics; app validation: 20 active men (bias +1.1 cm versus force plate)' },
      refs: ['bosco83', 'balsalobre15'],
      caveat: { id: 'Hanya tinggi lompat; power tidak dihitung (keputusan dr. Marcus). Menekuk lutut saat mendarat memperpanjang waktu melayang sehingga tinggi terlalu besar.', en: 'Jump height only; power is not calculated (Dr Marcus\'s decision). Bending the knees on landing lengthens flight time and overestimates height.' },
      calc(v, b, c) {
        const L = c.L, h = jumpHeightCm(v.ft);
        return { val: h, d: 1, unit: 'cm', mainLabel: L === 'id' ? 'Tinggi lompat' : 'Jump height', f: [L === 'id' ? 'h = g × t² / 8 (g = 9,81 m/s²; t = waktu melayang)' : 'h = g × t² / 8 (g = 9.81 m/s²; t = flight time)'], s: [`${c.k('9,81')} × ${c.f2(v.ft / 1000)}² / 8 = ${c.f1(h)} cm`],
          copy: L === 'id' ? `CMJ: waktu melayang ${c.f0(v.ft)} ms → tinggi ${c.f1(h)} cm` : `CMJ: flight time ${c.f0(v.ft)} ms → height ${c.f1(h)} cm` };
      },
    },
  ],

  // ===================== MODUL 13 · FLEKSIBILITAS =====================
  m13: [
    {
      id: 'sitreach', def: 'sitreach', short: 'Mayorga-Vega 2014', name: { id: 'Sit-and-reach klasik', en: 'Classic sit-and-reach' }, needs: [], noVo2: true,
      fields: [
        { k: 'd', label: { id: 'Jarak ujung jari dari telapak kaki', en: 'Fingertip distance from the soles' }, unit: CM, lim: [0, 60], req: true, dec: true },
        sideOpt('o'),
      ],
      protocol: { id: 'Duduk, lutut lurus, telapak kaki menempel kotak tanpa sepatu. Tangan bertumpuk, raih ke depan perlahan tanpa menyentak dan tahan ±2 detik. Titik nol = permukaan telapak kaki. Catat hasil terbaik.', en: 'Sit with knees straight and bare soles against the box. Hands stacked, reach forward slowly without bouncing and hold about 2 s. Zero = level of the soles. Record the best result.' },
      pop: { id: 'Meta-analisis 34 studi: validitas sedang untuk hamstring, rendah untuk lumbal', en: 'Meta-analysis of 34 studies: moderate validity for the hamstrings, low for the lumbar spine' },
      refs: ['mayorga14', 'acsm26'],
      caveat: { id: 'Tafsirkan sebagai perkiraan fleksibilitas hamstring, bukan punggung bawah. Titik nol kotak berbeda-beda (23 atau 26 cm), jadi hasil di sini selalu relatif terhadap telapak kaki. Tanpa norma.', en: 'Interpret as an estimate of hamstring flexibility, not the low back. Box zero points differ (23 or 26 cm), so results here are always relative to the soles. No norms.' },
      calc(v, b, c) { const L = c.L, x = signed(v.d, v.o); return { valText: sgn(x, c.f1), val: x, d: 1, unit: 'cm', mainLabel: L === 'id' ? 'Terhadap telapak kaki' : 'Relative to the soles', f: [L === 'id' ? '+ melewati telapak kaki; − belum mencapai' : '+ beyond the soles; − short of them'], s: [], copy: `Sit-and-reach: ${sgn(x, c.f1)} cm` }; },
    },
    {
      id: 'chairsr', def: 'sitreach', short: 'Rikli & Jones 1999', name: { id: 'Chair sit-and-reach (lansia)', en: 'Chair sit-and-reach (older adults)' }, needs: [], noVo2: true,
      fields: [{ k: 'd', label: { id: 'Jarak ujung jari dari ujung sepatu', en: 'Fingertip distance from the shoe tip' }, unit: CM, lim: [0, 45], req: true, dec: true }, sideOpt('o')],
      protocol: { id: 'Duduk di tepi depan kursi ±43 cm (disandarkan ke dinding). Satu tungkai lurus, tumit di lantai, kaki dorsofleksi ±90°; tungkai lain ditekuk. Tangan bertumpuk, raih ke ujung jari kaki dan tahan 2 detik; lutut tetap lurus. Pilih tungkai terbaik; dua latihan lalu dua percobaan, ambil terbaik; catat ke cm terdekat.', en: 'Sit on the front edge of a ~43 cm chair (against a wall). One leg straight, heel on the floor, foot dorsiflexed ~90°; the other leg bent. Hands stacked, reach toward the toes and hold 2 s with the knee straight. Use the better leg; two practice then two trials, take the best; record to the nearest cm.' },
      pop: { id: 'Rikli & Jones 1999: lansia komunitas AS', en: 'Rikli & Jones 1999: US community-dwelling older adults' },
      refs: ['rikli99', 'acsm26'],
      caveat: { id: 'Tanpa kategori (norma lansia AS tidak dipakai).', en: 'No category (US older-adult norms not used).' },
      calc(v, b, c) { const L = c.L, x = signed(v.d, v.o); return { valText: sgn(x, c.f1), val: x, d: 1, unit: 'cm', mainLabel: L === 'id' ? 'Terhadap ujung jari kaki' : 'Relative to the toes', f: [L === 'id' ? '+ melewati ujung kaki; − belum mencapai' : '+ beyond the toes; − short of them'], s: [], copy: `Chair sit-and-reach: ${sgn(x, c.f1)} cm` }; },
    },
    {
      id: 'scratch', def: 'scratch', short: 'Rikli & Jones 1999', name: { id: 'Back scratch', en: 'Back scratch' }, needs: [], noVo2: true,
      fields: [
        { k: 'r', label: { id: 'Tangan kanan di atas · jarak jari tengah', en: 'Right hand over · middle-finger distance' }, unit: CM, lim: [0, 60], req: false, dec: true },
        sideOpt('ro'),
        { k: 'l', label: { id: 'Tangan kiri di atas · jarak jari tengah', en: 'Left hand over · middle-finger distance' }, unit: CM, lim: [0, 60], req: false, dec: true },
        sideOpt('lo'),
      ],
      protocol: { id: 'Berdiri; satu tangan ke belakang bahu sisi yang sama (telapak menghadap punggung, siku ke atas), tangan lain dari bawah ke tengah punggung. Usahakan jari tengah kedua tangan bersentuhan atau tumpang tindih tanpa menarik. Dua latihan lalu dua percobaan, ambil terbaik; − = belum bersentuhan, + = tumpang tindih.', en: 'Standing; one hand over the same-side shoulder (palm to back, elbow up), the other hand up the middle of the back from below. Try to touch or overlap the middle fingers without pulling. Two practice then two trials, take the best; − = not touching, + = overlap.' },
      pop: { id: 'Rikli & Jones 1999: lansia komunitas AS', en: 'Rikli & Jones 1999: US community-dwelling older adults' },
      refs: ['rikli99', 'acsm26'],
      caveat: { id: 'Tanpa kategori. Rikli & Jones hanya memakai sisi terbaik untuk norma; mengukur kedua sisi membantu melihat asimetri.', en: 'No category. Rikli & Jones used only the better side for norms; measuring both sides helps reveal asymmetry.' },
      calc(v, b, c) {
        const L = c.L, r = Number.isFinite(v.r) ? signed(v.r, v.ro) : NaN, l = Number.isFinite(v.l) ? signed(v.l, v.lo) : NaN;
        if (!Number.isFinite(r) && !Number.isFinite(l)) return null;
        const best = Math.max(...[r, l].filter(Number.isFinite));
        const rows = [];
        if (Number.isFinite(r)) rows.push([L === 'id' ? 'Kanan di atas' : 'Right over', `${sgn(r, c.f1)} cm`]);
        if (Number.isFinite(l)) rows.push([L === 'id' ? 'Kiri di atas' : 'Left over', `${sgn(l, c.f1)} cm`]);
        if (Number.isFinite(r) && Number.isFinite(l)) rows.push([L === 'id' ? 'Selisih kanan-kiri' : 'Right-left difference', `${c.f1(Math.abs(r - l))} cm`]);
        return { valText: sgn(best, c.f1), val: best, d: 1, unit: 'cm', mainLabel: L === 'id' ? 'Sisi terbaik' : 'Better side', rows, f: [L === 'id' ? '+ tumpang tindih; − belum bersentuhan' : '+ overlap; − not touching'], s: [],
          copy: `Back scratch: ${rows.map(x => `${x[0].toLowerCase()} ${x[1]}`).join(', ')}` };
      },
    },
    {
      id: 'slr', def: 'slr', short: 'ACSM 2026; Mayorga-Vega 2014', name: { id: 'Straight leg raise pasif', en: 'Passive straight leg raise' }, needs: [], noVo2: true,
      fields: [{ k: 'r', label: { id: 'Kanan', en: 'Right' }, unit: DEG, lim: [20, 140], req: false, dec: true }, { k: 'l', label: { id: 'Kiri', en: 'Left' }, unit: DEG, lim: [20, 140], req: false, dec: true }],
      protocol: { id: 'Telentang, tungkai lain lurus di meja. Pemeriksa mengangkat tungkai dengan lutut lurus sampai pelvis mulai berotasi, lutut mulai menekuk, atau timbul rasa tidak nyaman. Ukur sudut fleksi panggul dengan inklinometer atau goniometer; pakai alat yang sama tiap kali.', en: 'Supine, the other leg straight on the table. The examiner raises the leg with the knee straight until the pelvis starts to rotate, the knee starts to bend, or discomfort appears. Measure hip flexion with an inclinometer or goniometer; use the same device each time.' },
      pop: { id: 'Ukuran sudut; ACSM 2026 dan meta-analisis Mayorga-Vega menganggap uji sudut lebih baik daripada sit-and-reach untuk hamstring', en: 'Angular measure; ACSM 2026 and the Mayorga-Vega meta-analysis regard angular tests as better than sit-and-reach for the hamstrings' },
      refs: ['acsm26', 'mayorga14', 'hanks23'],
      caveat: { id: 'Tanpa nilai normal (sumber berbeda-beda). Gejala menjalar ke tungkai saat tes = pertimbangkan uji neurodinamik, bukan sekadar fleksibilitas.', en: 'No normal value (sources differ). Radiating leg symptoms during the test = consider neurodynamic testing, not just flexibility.' },
      calc(v, b, c) {
        const L = c.L; if (!Number.isFinite(v.r) && !Number.isFinite(v.l)) return null;
        const rows = lrRows(c, v.l, v.r, '°'), main = Number.isFinite(v.r) && Number.isFinite(v.l) ? Math.abs(v.r - v.l) : (Number.isFinite(v.r) ? v.r : v.l);
        const both = Number.isFinite(v.r) && Number.isFinite(v.l);
        return { val: main, d: 0, unit: '°', mainLabel: both ? (L === 'id' ? 'Selisih kanan-kiri' : 'Right-left difference') : 'SLR', rows: both ? rows.slice(0, 2) : rows, f: [L === 'id' ? 'Sudut fleksi panggul saat batas tes' : 'Hip flexion angle at the test end point'], s: [], copy: `SLR: ${lrCopy(c, v.l, v.r, '°')}` };
      },
    },
    {
      id: 'ktw', def: 'ktw', short: 'Powden 2015', name: { id: 'Knee-to-wall (weight-bearing lunge)', en: 'Knee-to-wall (weight-bearing lunge)' }, needs: [], noVo2: true,
      fields: [{ k: 'r', label: { id: 'Kanan', en: 'Right' }, unit: CM, lim: [0, 25], req: false, dec: true }, { k: 'l', label: { id: 'Kiri', en: 'Left' }, unit: CM, lim: [0, 25], req: false, dec: true }],
      protocol: { id: 'Lunge menghadap dinding; tumit tetap menempel lantai dan lutut menyentuh dinding. Geser kaki menjauh sampai jarak terjauh yang masih memungkinkan lutut menyentuh dinding tanpa tumit terangkat; ukur jarak ibu jari kaki ke dinding.', en: 'Lunge facing a wall; keep the heel down and touch the knee to the wall. Move the foot back to the farthest distance at which the knee still touches without the heel lifting; measure big toe to wall.' },
      pop: { id: 'Tinjauan sistematis 12 studi reliabilitas: ICC antarpemeriksa 0,80–0,99', en: 'Systematic review of 12 reliability studies: inter-rater ICC 0.80–0.99' },
      refs: ['powden15', 'acsm26'],
      caveat: { id: 'Tanpa nilai normal. MDC 1,6 cm (antarpemeriksa) dan 1,9 cm (pemeriksa sama): selisih atau perubahan lebih kecil dari ini mungkin hanya galat ukur.', en: 'No normal value. MDC 1.6 cm (inter-rater) and 1.9 cm (same rater): differences or changes smaller than this may be measurement error.' },
      calc(v, b, c) {
        const L = c.L; if (!Number.isFinite(v.r) && !Number.isFinite(v.l)) return null;
        const both = Number.isFinite(v.r) && Number.isFinite(v.l), df = both ? Math.abs(v.r - v.l) : NaN;
        const rows = lrRows(c, v.l, v.r, 'cm', 1);
        const r = { val: both ? df : (Number.isFinite(v.r) ? v.r : v.l), d: 1, unit: 'cm', mainLabel: both ? (L === 'id' ? 'Selisih kanan-kiri' : 'Right-left difference') : 'Knee-to-wall', rows: both ? rows.slice(0, 2) : rows, f: [L === 'id' ? 'Jarak ibu jari kaki ke dinding' : 'Big toe to wall distance'], s: [], copy: `Knee-to-wall: ${lrCopy(c, v.l, v.r, 'cm', 1)}` };
        if (both) r.flag = { level: 'info', text: L === 'id' ? (df <= 1.9 ? 'Selisih ≤1,9 cm: masih dalam rentang galat ukur (MDC).' : 'Selisih >1,9 cm: melebihi galat ukur (MDC) pemeriksa yang sama.') : (df <= 1.9 ? 'Difference ≤1.9 cm: within measurement error (MDC).' : 'Difference >1.9 cm: exceeds the same-rater measurement error (MDC).') };
        return r;
      },
    },
    {
      id: 'mmst', def: 'mmst', short: 'Hershkovich 2022', name: { id: 'Modified-modified Schober', en: 'Modified-modified Schober' }, needs: [], noVo2: true,
      fields: [{ k: 'x', label: { id: 'Jarak kedua tanda saat fleksi maksimal', en: 'Distance between marks at full flexion' }, unit: CM, lim: [15, 30], req: true, dec: true }],
      protocol: { id: 'Berdiri tegak. Tandai garis tengah setinggi kedua SIPS, lalu tanda kedua 15 cm di atasnya. Bungkuk ke depan semaksimal mungkin dengan lutut lurus, lalu ukur ulang jarak kedua tanda. Hasil = pertambahan dari 15 cm.', en: 'Stand upright. Mark the midline at the level of both PSIS, then a second mark 15 cm above. Bend forward maximally with knees straight and remeasure the distance. Result = increase over 15 cm.' },
      pop: { id: 'Hershkovich 2022 (CT, 25 pasien): versi 15 cm di atas SIPS mencakup seluruh segmen L1–S1 pada 76% kasus', en: 'Hershkovich 2022 (CT, 25 patients): the 15 cm above PSIS version spans all L1–S1 segments in 76% of cases' },
      refs: ['hershkovich22', 'acsm26'],
      caveat: { id: 'Schober asli dan modified Schober tidak dipakai karena studi CT yang dirujuk ACSM menunjukkan keduanya tidak mencakup segmen L1–L2. Tanpa nilai normal.', en: 'The original and modified Schober are not used because the CT study cited by ACSM showed neither spans the L1–L2 segment. No normal value.' },
      calc(v, b, c) { const L = c.L, inc = v.x - 15; return { val: inc, d: 1, unit: 'cm', mainLabel: L === 'id' ? 'Pertambahan panjang' : 'Increase in length', f: [L === 'id' ? 'Pertambahan = jarak saat fleksi − 15 cm' : 'Increase = distance at flexion − 15 cm'], s: [`${c.f1(v.x)} − 15 = ${c.f1(inc)} cm`], copy: L === 'id' ? `Modified-modified Schober: pertambahan ${c.f1(inc)} cm` : `Modified-modified Schober: increase ${c.f1(inc)} cm` }; },
    },
    {
      id: 'rom', def: 'rom', short: 'Hanks 2023', name: { id: 'ROM sendi kanan-kiri (goniometer/inklinometer)', en: 'Joint ROM right-left (goniometer/inclinometer)' }, needs: [], noVo2: true,
      fields: [{ k: 'r', label: { id: 'Kanan', en: 'Right' }, unit: DEG, lim: [0, 200], req: true, dec: true }, { k: 'l', label: { id: 'Kiri', en: 'Left' }, unit: DEG, lim: [0, 200], req: true, dec: true }],
      protocol: { id: 'Ukur gerak dan posisi yang sama di kedua sisi, dengan alat dan pemeriksa yang sama. Catat nama sendi dan gerakan di catatan pemeriksaan (aplikasi tidak menyimpan teks bebas).', en: 'Measure the same motion and position on both sides with the same device and examiner. Record the joint and motion in your notes (the app stores no free text).' },
      pop: { id: 'Perbandingan dalam satu orang', en: 'Within-person comparison' },
      refs: ['hanks23', 'acsm26'],
      caveat: { id: 'Tanpa nilai normal. Goniometer standar dan inklinometer dapat berbeda ±4°; jangan membandingkan hasil dari alat yang berbeda.', en: 'No normal values. A standard goniometer and an inclinometer can differ by about 4°; do not compare results from different devices.' },
      calc(v, b, c) { const L = c.L, df = Math.abs(v.r - v.l); return { val: df, d: 0, unit: '°', mainLabel: L === 'id' ? 'Selisih kanan-kiri' : 'Right-left difference', rows: lrRows(c, v.l, v.r, '°').slice(0, 2), f: [L === 'id' ? 'Selisih = |kanan − kiri|' : 'Difference = |right − left|'], s: [`|${c.f0(v.r)} − ${c.f0(v.l)}| = ${c.f0(df)}°`], copy: `ROM: ${lrCopy(c, v.l, v.r, '°')}` }; },
    },
  ],
};
