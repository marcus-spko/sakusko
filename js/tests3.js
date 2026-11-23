// SakuSKO — v0.2 Tahap 3: Modul 14 Tes Kebugaran Pelajar Nusantara (TKPN), Pedoman Kemenpora edisi 2024.
// Norma per usia dan jenis kelamin di tkpn-norm.js. Cacat tabel tidak ditebak: rentang yang tumpang tindih, celah tabel,
// dan baris yang tampak salah salin ditandai di layar. Skor gabungan edisi 2024 (PACER 85%, squat thrust, sit up, V-sit
// masing-masing 5%) dihitung hanya bila keempat tes punya satu kategori yang pasti.
// Pembanding PACER: norma internasional Tomkinson 2017 (tabel balikan), dengan catatan protokol.
import { TKPN_NORM, TKPN_SUSPECT } from './tkpn-norm.js';
import { TOMK_LAPS, tomkCentile } from './tomkinson.js';

export const REF3 = {
  tkpn24: { ref: 'Deputi Bidang Pembudayaan Olahraga Kementerian Pemuda dan Olahraga Republik Indonesia. Pedoman Tes Kebugaran Pelajar Nusantara (TKPN). Jakarta: Kemenpora; 2024. (Pencatatan ciptaan EC00202329312.)', doi: null },
  tkpn22: { ref: 'Kementerian Pemuda dan Olahraga Republik Indonesia. Pedoman pelaksanaan Tes Kebugaran Pelajar Nusantara (TKPN). Jakarta: Asisten Deputi Pengelolaan Olahraga Pendidikan, Deputi Bidang Pembudayaan Olahraga, Kemenpora; 2022. (Edisi lama; hanya pembanding.)', doi: null },
  tomk17: { ref: 'Tomkinson GR, Lang JJ, Tremblay MS, Dale M, LeBlanc AG, Belanger K, et al. International normative 20 m shuttle run values from 1 142 026 children and youth representing 50 countries. Br J Sports Med. 2017;51(21):1545-54.', doi: '10.1136/bjsports-2016-095987' },
  buchan19: { ref: 'Buchan DS, Knox G, Jones AM, Tomkinson GR, Baker JS. Utility of international normative 20 m shuttle run values for identifying youth at increased cardiometabolic risk. J Sports Sci. 2019;37(5):507-14.', doi: '10.1080/02640414.2018.1511318' },
};

export const TKPN_CAT = {
  id: ['Kurang sekali', 'Kurang', 'Cukup', 'Baik', 'Baik sekali'],
  en: ['Very poor', 'Poor', 'Fair', 'Good', 'Very good'],
};
export const TOMK_Q = {
  id: ['sangat rendah', 'rendah', 'sedang', 'tinggi', 'sangat tinggi'],
  en: ['very low', 'low', 'moderate', 'high', 'very high'],
};
// Baris norma: usia 9–17 th → baris 0–8; "17+" → baris 9 (ditafsirkan usia 18 th). Di luar 9 ≤ usia < 19: tidak ada norma.
export const tkpnRow = age => (age >= 9 && age < 19 ? Math.min(9, Math.floor(age) - 9) : -1);
// Kategori: { k } satu kategori; { k, alt } tumpang tindih; { gap: [bawah, atas] } celah tabel; { suspect } baris diragukan; null bila tanpa norma.
// Kategori i mencakup batas yang tertulis. Untuk V-sit (sentimeter, bisa desimal), nilai di antara batas atas satu kategori dan batas bawah
// kategori berikutnya yang selisihnya ≤1 cm (mis. "1–2,9 | 3–7" atau "4–9 | ≥10") dimasukkan ke kategori bawah, sama seperti membaca
// "x,9" sebagai "kurang dari batas berikut". Celah yang lebih lebar, atau angka bulat yang tidak tercantum, ditandai sebagai celah.
export function tkpnCat(test, male, age, x) {
  const i = tkpnRow(age); if (i < 0 || !Number.isFinite(x)) return null;
  const sx = male ? 'L' : 'P', sus = TKPN_SUSPECT[test]?.[sx]?.[i];
  if (sus) return { suspect: sus };
  const r = TKPN_NORM[test][sx][i];
  const R = [[-Infinity, r[0]], [r[1], r[2]], [r[3], r[4]], [r[5], r[6]], [r[7], Infinity]];
  const hits = R.map((q, j) => (x >= q[0] && x <= q[1] ? j : -1)).filter(j => j >= 0);
  if (hits.length === 1) return { k: hits[0] };
  if (hits.length > 1) return { k: hits[0], alt: hits[hits.length - 1] };
  for (let j = 0; j < 4; j++) {
    if (x > R[j][1] && x < R[j + 1][0]) return test === 'vsit' && R[j + 1][0] - R[j][1] <= 1 ? { k: j } : { gap: [j, j + 1] };
  }
  return { gap: [0, 1] };   // tidak terjangkau dengan tabel yang ada; pengaman
}
// Skor gabungan edisi 2024: skor tiap tes 1 (Kurang sekali) … 5 (Baik sekali); total = 0,85·PACER + 0,05·(squat thrust + sit up + V-sit)
const COMP_CUT = [[1, 1.8], [1.9, 2.6], [2.7, 3.4], [3.5, 4.2], [4.3, 5]];
export function tkpnComposite(k) {
  const total = Math.round((0.85 * (k.pacer + 1) + 0.05 * ((k.squat + 1) + (k.situp + 1) + (k.vsit + 1))) * 100) / 100;
  const c = COMP_CUT.findIndex(([lo, hi]) => total >= lo - 1e-9 && total <= hi + 1e-9);
  if (c >= 0) return { total, k: c };
  const j = COMP_CUT.findIndex(([, hi], n) => total > hi && total < COMP_CUT[n + 1][0]);
  return { total, gap: [j, j + 1] };
}
// Lembar penilaian PACER TKPN: jumlah balikan per level 1–15
const PACER_LAPS = [7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13, 13, 13];
export function pacerLevel(laps) {
  let acc = 0;
  for (let i = 0; i < PACER_LAPS.length; i++) { if (laps <= acc + PACER_LAPS[i]) return { level: i + 1, lap: laps - acc }; acc += PACER_LAPS[i]; }
  return null;
}

const REP = { id: 'kali', en: 'reps' };
const ageLbl = (L, age) => { const i = tkpnRow(age); return i === 9 ? (L === 'id' ? '17+ th (dibaca 18 th)' : '17+ y (read as 18 y)') : `${Math.floor(age)} ${L === 'id' ? 'th' : 'y'}`; };
// Baris hasil + teks salin untuk satu kategori TKPN
function catOut(c, test, b, x, fmt, unit) {
  const L = c.L, male = b.sex === 'M', C = TKPN_CAT[L], i = tkpnRow(b.age);
  const sexL = male ? (L === 'id' ? 'putra' : 'boys') : (L === 'id' ? 'putri' : 'girls');
  if (i < 0) {
    return { rows: [], flag: { level: 'info', text: L === 'id' ? 'Norma TKPN hanya tersedia untuk usia 9–18 tahun; hasil ditampilkan tanpa kategori.' : 'TKPN norms exist only for ages 9–18; the result is shown without a category.' },
      catTxt: L === 'id' ? 'tanpa kategori (usia di luar norma TKPN 9–18 th)' : 'no category (age outside TKPN norms 9–18 y)', s: [], k: null };
  }
  const r = TKPN_NORM[test][male ? 'L' : 'P'][i], k = tkpnCat(test, male, b.age, x);
  const f = v => fmt(v);
  const bnd = q => `${C[0]} ≤${f(q[0])}; ${C[1]} ${f(q[1])}–${f(q[2])}; ${C[2]} ${f(q[3])}–${f(q[4])}; ${C[3]} ${f(q[5])}–${f(q[6])}; ${C[4]} ≥${f(q[7])}`;
  const rowLbl = `${ageLbl(L, b.age)}, ${sexL}`;
  const s = [`${L === 'id' ? 'Norma 2024' : '2024 norms'} ${ageLbl(L, b.age)} ${sexL}: ${bnd(r)}${unit ? ` ${unit}` : ''}`];
  let catTxt, flag, kk = null;
  if (k.suspect) {
    const g = R => { const R2 = [[-Infinity, R[0]], [R[1], R[2]], [R[3], R[4]], [R[5], R[6]], [R[7], Infinity]]; return R2.findIndex(q => x >= q[0] && x <= q[1]); };
    const k22 = g(k.suspect.ref2022);
    catTxt = L === 'id' ? 'tidak ditampilkan (baris norma 2024 diragukan)' : 'not shown (2024 norm row in doubt)';
    flag = { level: 'warn', text: L === 'id'
      ? `Baris norma ${rowLbl} di pedoman 2024 identik dengan baris PACER usia yang sama, kemungkinan salah salin. Kategori tidak ditampilkan. Sebagai pembanding saja, edisi 2022 menggolongkan ${f(x)} sebagai "${k22 >= 0 ? C[k22] : '—'}".`
      : `The ${rowLbl} norm row in the 2024 guideline is identical to the PACER row for the same age, probably a copying error. No category is shown. For comparison only, the 2022 edition classifies ${f(x)} as "${k22 >= 0 ? C[k22] : '—'}".` };
    s.push(`${L === 'id' ? 'Edisi 2022 (pembanding)' : '2022 edition (comparison)'}: ${bnd(k.suspect.ref2022)}`);
  } else if (k.gap) {
    catTxt = L === 'id' ? `di antara ${C[k.gap[0]]} dan ${C[k.gap[1]]} (celah di tabel TKPN)` : `between ${C[k.gap[0]]} and ${C[k.gap[1]]} (gap in the TKPN table)`;
    flag = { level: 'warn', text: L === 'id' ? `Nilai ${f(x)} tidak tercantum di tabel TKPN (tabel melompat). Kategori tidak ditebak; catat sebagai di antara ${C[k.gap[0]]} dan ${C[k.gap[1]]}.` : `The value ${f(x)} is not covered by the TKPN table (the table skips it). The category is not guessed; record it as between ${C[k.gap[0]]} and ${C[k.gap[1]]}.` };
  } else if (k.alt !== undefined) {
    catTxt = L === 'id' ? `${C[k.k]} atau ${C[k.alt]} (rentang tabel TKPN tumpang tindih)` : `${C[k.k]} or ${C[k.alt]} (TKPN table ranges overlap)`;
    flag = { level: 'warn', text: L === 'id' ? `Tabel TKPN mencantumkan nilai ${f(x)} di dua kategori sekaligus (${C[k.k]} dan ${C[k.alt]}); kemungkinan salah ketik di pedoman. Kategori tidak dipilihkan.` : `The TKPN table lists ${f(x)} under two categories (${C[k.k]} and ${C[k.alt]}); probably a typo in the guideline. No category is chosen.` };
  } else { catTxt = C[k.k]; kk = k.k; }
  return { rows: [[L === 'id' ? 'Kategori TKPN 2024' : 'TKPN 2024 category', catTxt], [L === 'id' ? 'Baris norma' : 'Norm row', rowLbl]], flag, catTxt, s, k: kk };
}
const common = L => (L === 'id'
  ? 'Norma dari Pedoman TKPN Kemenpora edisi 2024 (menggantikan edisi 2022). Pedoman tidak menjelaskan sampel atau cara penyusunan norma; gunakan sebagai patokan program sekolah, bukan rujukan klinis.'
  : 'Norms from the 2024 Kemenpora TKPN guideline (replacing the 2022 edition). The guideline does not describe the sample or how the norms were built; use them as a school-programme benchmark, not a clinical reference.');

export const TESTS3 = {
  m14: [
    {
      id: 'tkvsit', def: 'tkpn', short: 'Kemenpora 2024 (TKPN)', name: { id: 'V sit and reach', en: 'V sit and reach' }, needs: ['age', 'sex'], noVo2: true,
      fields: [
        { k: 'side', opt: true, def: 1, label: { id: 'Posisi ujung jari', en: 'Fingertip position' }, options: [{ v: 1, label: { id: 'Melewati garis tumit (+)', en: 'Beyond the heel line (+)' } }, { v: 2, label: { id: 'Belum mencapai garis tumit (−)', en: 'Short of the heel line (−)' } }] },
        { k: 'd', label: { id: 'Jangkauan terjauh dari 3 percobaan', en: 'Best reach of 3 trials' }, unit: { id: 'cm', en: 'cm' }, lim: [0, 60], req: true, dec: true },
      ],
      protocol: { id: 'Duduk di lantai, kedua tumit menempel pada garis (titik nol), lutut lurus, kaki dibuka membentuk V sekitar 30 cm. Penggaris di antara kedua kaki. Satukan kedua tangan lalu raih sejauh mungkin di sepanjang penggaris dan tahan sekitar 3 detik. Jarak sebelum garis bernilai negatif, sesudah garis positif. Catat jangkauan terjauh dari 3 percobaan.', en: 'Sit on the floor with both heels on the line (zero point), knees straight, legs apart in a V of about 30 cm. Place the ruler between the legs. Put the hands together and reach as far as possible along the ruler, holding about 3 s. Distance short of the line is negative, beyond it positive. Record the best of 3 trials.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN)', en: 'Indonesian students aged 9–18 (TKPN)' },
      refs: ['tkpn24', 'tkpn22'],
      caveat: { id: 'Nilai desimal di antara dua kategori yang batasnya berselisih ≤1 cm (mis. 2,95 cm pada "1–2,9 | 3–7", atau 9,5 cm pada "4–9 | ≥10") dimasukkan ke kategori bawah. Celah yang lebih lebar dan rentang yang tumpang tindih ditandai.', en: 'Decimal values between two categories whose limits differ by ≤1 cm (e.g. 2.95 cm in "1–2.9 | 3–7", or 9.5 cm in "4–9 | ≥10") go to the lower category. Wider gaps and overlapping ranges are flagged.' },
      calc(v, b, c) {
        const L = c.L, x = v.side === 2 ? -v.d : v.d, fx = n => (n < 0 ? '−' : '') + c.f1(Math.abs(n)).replace(/[.,]0$/, '');
        const o = catOut(c, 'vsit', b, x, fx, 'cm');
        return { val: x, valText: fx(x), d: 1, unit: 'cm', mainLabel: 'V sit and reach', rows: o.rows, flag: o.flag, cat: o.k,
          f: [L === 'id' ? 'Jangkauan terjauh dari 3 percobaan; sebelum garis tumit negatif' : 'Best of 3 reaches; short of the heel line is negative', common(L)], s: o.s,
          copy: `V sit and reach (TKPN): ${fx(x)} cm — ${o.catTxt}` };
      },
    },
    {
      id: 'tksitup', def: 'tkpn', short: 'Kemenpora 2024 (TKPN)', name: { id: 'Sit up 60 detik', en: '60-second sit-up' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Sit up sempurna dalam 60 detik', en: 'Correct sit-ups in 60 s' }, unit: REP, lim: [0, 100], req: true, int: true }],
      protocol: { id: 'Berbaring di matras, lutut ditekuk, telapak kaki rata di lantai dan dipegang teman. Kedua lengan menyilang rapat di depan dada. Saat aba-aba, turunkan badan sampai punggung menyentuh lantai lalu angkat sampai siku menyentuh paha. Ulangi selama 60 detik; hanya gerakan sempurna yang dihitung.', en: 'Lie on a mat with knees bent, feet flat and held by a partner, arms crossed tightly on the chest. On the signal, lower until the back touches the floor, then rise until the elbows touch the thighs. Repeat for 60 s; count only correct repetitions.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN); edisi 2022 menyebut norma sit up dari North Thurston Public Schools (AS), edisi 2024 tidak menyebut sumbernya', en: 'Indonesian students aged 9–18 (TKPN); the 2022 edition attributed the sit-up norms to North Thurston Public Schools (USA), the 2024 edition names no source' },
      refs: ['tkpn24', 'tkpn22'],
      calc(v, b, c) {
        const L = c.L, o = catOut(c, 'situp', b, v.n, c.f0, '');
        return { val: v.n, d: 0, unit: L === 'id' ? 'kali' : 'reps', mainLabel: L === 'id' ? 'Sit up 60 detik' : '60-s sit-up', rows: o.rows, flag: o.flag, cat: o.k,
          f: [L === 'id' ? 'Jumlah sit up sempurna dalam 60 detik' : 'Correct sit-ups in 60 s', common(L)], s: o.s,
          copy: `${L === 'id' ? 'Sit up 60 dtk' : '60-s sit-up'} (TKPN): ${c.f0(v.n)} ${L === 'id' ? 'kali' : 'reps'} — ${o.catTxt}` };
      },
    },
    {
      id: 'tksquat', def: 'tkpn', short: 'Kemenpora 2024 (TKPN)', name: { id: 'Squat thrust 30 detik', en: '30-second squat thrust' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Squat thrust sempurna dalam 30 detik', en: 'Correct squat thrusts in 30 s' }, unit: REP, lim: [0, 60], req: true, int: true }],
      protocol: { id: 'Berdiri tegak, kaki selebar bahu. Saat aba-aba: jongkok dan letakkan tangan di lantai, dorong kedua kaki ke belakang ke posisi push-up, kembali ke jongkok, lalu kembali berdiri. Satu gerakan dihitung sempurna bila dimulai dan diakhiri berdiri. Ulangi selama 30 detik.', en: 'Stand upright, feet shoulder-width apart. On the signal: squat and place the hands on the floor, thrust both legs back to a push-up position, return to the squat, then stand up. A repetition counts only if it starts and ends standing. Repeat for 30 s.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN)', en: 'Indonesian students aged 9–18 (TKPN)' },
      refs: ['tkpn24', 'tkpn22'],
      calc(v, b, c) {
        const L = c.L, o = catOut(c, 'squat', b, v.n, c.f0, '');
        return { val: v.n, d: 0, unit: L === 'id' ? 'kali' : 'reps', mainLabel: L === 'id' ? 'Squat thrust 30 detik' : '30-s squat thrust', rows: o.rows, flag: o.flag, cat: o.k,
          f: [L === 'id' ? 'Jumlah squat thrust sempurna dalam 30 detik' : 'Correct squat thrusts in 30 s', common(L)], s: o.s,
          copy: `Squat thrust 30 ${L === 'id' ? 'dtk' : 's'} (TKPN): ${c.f0(v.n)} ${L === 'id' ? 'kali' : 'reps'} — ${o.catTxt}` };
      },
    },
    {
      id: 'tkpacer', def: 'tkpn', short: 'Kemenpora 2024 (TKPN)', name: { id: 'PACER (lari bolak-balik 20 m)', en: 'PACER (20 m shuttle run)' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Jumlah balikan', en: 'Number of laps' }, unit: { id: 'balikan', en: 'laps' }, lim: [0, 250], req: true, int: true,
        hint: { id: 'Total balikan sampai peserta dua kali gagal mencapai garis sebelum bunyi.', en: 'Total laps until the participant twice fails to reach the line before the beep.' } }],
      protocol: { id: 'Lintasan 20 m (tambah 2,5 m di tiap ujung), lebar minimal 1 m per peserta. Lari bolak-balik mengikuti irama audio PACER; satu kaki menyentuh garis sebelum bunyi, bila tiba lebih awal tunggu di garis. Kecepatan naik tiap level. Tes berhenti saat peserta dua kali gagal mencapai garis tepat waktu; catat jumlah balikan.', en: '20 m course (plus 2.5 m at each end), at least 1 m wide per participant. Run back and forth to the PACER audio; one foot must touch the line before the beep, and early arrivals wait at the line. Speed rises each level. Stop when the participant twice fails to reach the line in time; record the number of laps.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN)', en: 'Indonesian students aged 9–18 (TKPN)' },
      refs: ['tkpn24', 'tkpn22', 'tomk17', 'buchan19'],
      caveat: { id: 'Pedoman TKPN tidak menyebut versi audio PACER dan tidak memuat persamaan VO₂max, jadi aplikasi tidak menghitung VO₂max dari PACER. Jumlah balikan per level di lembar TKPN sama dengan protokol Léger 1 menit yang dipakai Tomkinson 2017, tetapi kecepatan audionya tidak disebut; persentil Tomkinson berlaku bila audio mengikuti protokol Léger (mulai 8,5 km/jam, naik 0,5 km/jam per menit). Persentil ini norma, bukan ambang kesehatan: pada 961 anak Inggris, kemampuannya membedakan risiko kardiometabolik lemah (AUC 0,58–0,59; Buchan 2019). Data Tomkinson berpusat di tahun 2000 dan sebagian besar dari negara berpenghasilan tinggi.', en: 'The TKPN guideline does not state the PACER audio version and gives no VO₂max equation, so the app does not compute VO₂max from PACER. The laps per level on the TKPN sheet match the Léger 1-min protocol used by Tomkinson 2017, but the audio speed is not stated; the Tomkinson centiles apply if the audio follows the Léger protocol (start 8.5 km/h, +0.5 km/h per minute). These centiles are norms, not health cut-offs: in 961 UK children their ability to discriminate cardiometabolic risk was weak (AUC 0.58–0.59; Buchan 2019). Tomkinson data centre on the year 2000 and come mostly from high-income countries.' },
      calc(v, b, c) {
        const L = c.L, o = catOut(c, 'pacer', b, v.n, c.f0, ''), lv = pacerLevel(v.n), tk = tomkCentile(TOMK_LAPS, b.sex === 'M', b.age, v.n);
        const tkTxt = tk ? `${tk.band} (${TOMK_Q[L][tk.q]})` : '';
        const rows = [...(lv && v.n > 0 ? [[L === 'id' ? 'Posisi di lembar penilaian' : 'Score-sheet position', L === 'id' ? `Level ${lv.level}, balikan ke-${lv.lap}` : `Level ${lv.level}, lap ${lv.lap}`]] : []), ...o.rows,
          ...(tk ? [[L === 'id' ? 'Persentil internasional (Tomkinson 2017)' : 'International centile (Tomkinson 2017)', tkTxt]] : [])];
        const s = [...o.s, ...(tk ? [`Tomkinson 2017, ${Math.floor(b.age)} ${L === 'id' ? 'th' : 'y'} ${b.sex === 'M' ? (L === 'id' ? 'putra' : 'boys') : (L === 'id' ? 'putri' : 'girls')} (${L === 'id' ? 'balikan' : 'laps'}): P20 ${tk.row[2]}, P40 ${tk.row[4]}, P60 ${tk.row[6]}, P80 ${tk.row[8]}`] : [])];
        return { val: v.n, d: 0, unit: L === 'id' ? 'balikan' : 'laps', mainLabel: 'PACER', rows, flag: o.flag, cat: o.k,
          f: [L === 'id' ? 'Jumlah balikan sampai dua kali gagal' : 'Laps completed until two failures', common(L),
            L === 'id' ? 'Tomkinson 2017: kuintil <P20 sangat rendah, P20–<P40 rendah, P40–<P60 sedang, P60–<P80 tinggi, ≥P80 sangat tinggi; usia = usia pada ulang tahun terakhir (9–17 th)' : 'Tomkinson 2017: quintiles <P20 very low, P20–<P40 low, P40–<P60 moderate, P60–<P80 high, ≥P80 very high; age = age at last birthday (9–17 y)'], s,
          copy: `PACER (TKPN): ${c.f0(v.n)} ${L === 'id' ? 'balikan' : 'laps'}${lv && v.n > 0 ? ` (level ${lv.level})` : ''} — ${o.catTxt}${tk ? `; Tomkinson 2017 ${tkTxt}` : ''}`, src: tk ? 'Kemenpora 2024 (TKPN); Tomkinson 2017' : undefined };
      },
    },
  ],
};
