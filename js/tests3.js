// SakuSKO — v0.2 Tahap 3: Modul 14 Tes Kebugaran Pelajar Nusantara (TKPN), Kemenpora 2022.
// Norma per usia dan jenis kelamin diambil dari Pedoman Pelaksanaan TKPN (lihat tkpn-norm.js).
// Masalah tabel yang ditemukan saat telaah ditampilkan apa adanya, tidak ditebak:
//  - squat thrust putra 11 th: Cukup 9–11 dan Baik 10–14 tumpang tindih (10–11 masuk dua kategori);
//  - PACER putra 13 dan 14 th: Baik 76–81, Baik sekali ≥83 (82 balikan tidak masuk kategori mana pun).
// Skor gabungan TKPN sengaja tidak dihitung: rumus di pedoman memuat "Curl up" yang tidak ada di rangkaian tes,
// tidak memuat squat thrust, dan rentang kategorinya tidak menutup nilai 3,9–4,0.
import { TKPN_NORM } from './tkpn-norm.js';

export const REF3 = {
  tkpn22: { ref: 'Kementerian Pemuda dan Olahraga Republik Indonesia. Pedoman pelaksanaan Tes Kebugaran Pelajar Nusantara (TKPN). Jakarta: Asisten Deputi Pengelolaan Olahraga Pendidikan, Deputi Bidang Pembudayaan Olahraga, Kemenpora; 2022.', doi: null },
};

export const TKPN_CAT = {
  id: ['Sangat rendah', 'Rendah', 'Cukup', 'Baik', 'Baik sekali'],
  en: ['Very low', 'Low', 'Fair', 'Good', 'Very good'],
};
// Baris norma: usia 9–17 th → baris 0–8; "17+" → baris 9 (ditafsirkan usia 18 th). Di luar 9 ≤ usia < 19: tidak ada norma.
export const tkpnRow = age => (age >= 9 && age < 19 ? Math.min(9, Math.floor(age) - 9) : -1);
// Kategori: { k } satu kategori; { k, alt } tumpang tindih; { gap: [bawah, atas] } celah tabel; null bila tanpa norma
export function tkpnCat(test, male, age, x) {
  const i = tkpnRow(age); if (i < 0 || !Number.isFinite(x)) return null;
  const r = TKPN_NORM[test][male ? 'L' : 'P'][i];
  if (test === 'vsit') {                     // sentimeter, kontinu: batas bawah tiap kategori dipakai, angka ",9" dibaca "< batas berikut"
    if (x < r[0]) return { k: 0 };
    if (x < r[3]) return { k: 1 };
    if (x < r[5]) return { k: 2 };
    if (x <= r[6]) return { k: 3 };
    return { k: 4 };
  }
  const hits = [];
  if (x <= r[0]) hits.push(0);
  if (x >= r[1] && x <= r[2]) hits.push(1);
  if (x >= r[3] && x <= r[4]) hits.push(2);
  if (x >= r[5] && x <= r[6]) hits.push(3);
  if (x >= r[7]) hits.push(4);
  if (hits.length === 1) return { k: hits[0] };
  if (hits.length > 1) return { k: hits[0], alt: hits[1] };
  const below = [r[0], r[2], r[4], r[6]].reduce((a, hi, j) => (x > hi ? j : a), 0);
  return { gap: [below, below + 1] };
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
      catTxt: L === 'id' ? 'tanpa kategori (usia di luar norma TKPN 9–18 th)' : 'no category (age outside TKPN norms 9–18 y)', s: [] };
  }
  const r = TKPN_NORM[test][male ? 'L' : 'P'][i], k = tkpnCat(test, male, b.age, x);
  const f = v => fmt(v);
  const bounds = test === 'vsit'
    ? `${C[0]} <${f(r[0])}; ${C[1]} ${f(r[1])}–${f(r[2])}; ${C[2]} ${f(r[3])}–${f(r[4])}; ${C[3]} ${f(r[5])}–${f(r[6])}; ${C[4]} >${f(r[7])}`
    : `${C[0]} ≤${f(r[0])}; ${C[1]} ${f(r[1])}–${f(r[2])}; ${C[2]} ${f(r[3])}–${f(r[4])}; ${C[3]} ${f(r[5])}–${f(r[6])}; ${C[4]} ≥${f(r[7])}`;
  let catTxt, flag;
  if (k.gap) {
    catTxt = L === 'id' ? `di antara ${C[k.gap[0]]} dan ${C[k.gap[1]]} (celah di tabel TKPN)` : `between ${C[k.gap[0]]} and ${C[k.gap[1]]} (gap in the TKPN table)`;
    flag = { level: 'warn', text: L === 'id' ? `Nilai ${f(x)} tidak tercantum di tabel TKPN (tabel melompat). Kategori tidak ditebak; catat sebagai di antara ${C[k.gap[0]]} dan ${C[k.gap[1]]}.` : `The value ${f(x)} is not covered by the TKPN table (the table skips it). The category is not guessed; record it as between ${C[k.gap[0]]} and ${C[k.gap[1]]}.` };
  } else if (k.alt !== undefined) {
    catTxt = L === 'id' ? `${C[k.k]} atau ${C[k.alt]} (rentang tabel TKPN tumpang tindih)` : `${C[k.k]} or ${C[k.alt]} (TKPN table ranges overlap)`;
    flag = { level: 'warn', text: L === 'id' ? `Tabel TKPN mencantumkan nilai ${f(x)} di dua kategori sekaligus (${C[k.k]} dan ${C[k.alt]}); kemungkinan salah ketik di pedoman. Kategori tidak dipilihkan.` : `The TKPN table lists ${f(x)} under two categories (${C[k.k]} and ${C[k.alt]}); probably a typo in the guideline. No category is chosen.` };
  } else catTxt = C[k.k];
  return { rows: [[L === 'id' ? 'Kategori TKPN' : 'TKPN category', catTxt], [L === 'id' ? 'Baris norma' : 'Norm row', `${ageLbl(L, b.age)}, ${sexL}`]], flag, catTxt,
    s: [`${L === 'id' ? 'Norma' : 'Norms'} ${ageLbl(L, b.age)} ${sexL}: ${bounds}${unit ? ` ${unit}` : ''}`] };
}
const common = L => (L === 'id'
  ? 'Norma dari Pedoman TKPN Kemenpora 2022. Pedoman tidak menjelaskan sampel atau cara penyusunan norma, dan norma sit-up dicantumkan berasal dari North Thurston Public Schools (AS). Gunakan sebagai patokan program sekolah, bukan rujukan klinis.'
  : 'Norms from the 2022 Kemenpora TKPN guideline. The guideline does not describe the sample or how the norms were built, and the sit-up norms are attributed to North Thurston Public Schools (USA). Use them as a school-programme benchmark, not a clinical reference.');

export const TESTS3 = {
  m14: [
    {
      id: 'tkvsit', def: 'tkpn', short: 'Kemenpora 2022 (TKPN)', name: { id: 'V sit and reach', en: 'V sit and reach' }, needs: ['age', 'sex'], noVo2: true,
      fields: [
        { k: 'side', opt: true, def: 1, label: { id: 'Posisi ujung jari', en: 'Fingertip position' }, options: [{ v: 1, label: { id: 'Melewati garis tumit (+)', en: 'Beyond the heel line (+)' } }, { v: 2, label: { id: 'Belum mencapai garis tumit (−)', en: 'Short of the heel line (−)' } }] },
        { k: 'd', label: { id: 'Jangkauan terjauh dari 3 percobaan', en: 'Best reach of 3 trials' }, unit: { id: 'cm', en: 'cm' }, lim: [0, 60], req: true, dec: true },
      ],
      protocol: { id: 'Duduk di lantai, kedua tumit menempel pada garis (titik nol), lutut lurus, kaki dibuka membentuk V sekitar 30 cm. Penggaris di antara kedua kaki. Satukan kedua tangan lalu raih sejauh mungkin di sepanjang penggaris dan tahan sekitar 3 detik. Jarak sebelum garis bernilai negatif, sesudah garis positif. Catat jangkauan terjauh dari 3 percobaan.', en: 'Sit on the floor with both heels on the line (zero point), knees straight, legs apart in a V of about 30 cm. Place the ruler between the legs. Put the hands together and reach as far as possible along the ruler, holding about 3 s. Distance short of the line is negative, beyond it positive. Record the best of 3 trials.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN)', en: 'Indonesian students aged 9–18 (TKPN)' },
      refs: ['tkpn22'],
      caveat: { id: 'Angka ",9" pada tabel (mis. 1–2,9) dibaca sebagai "kurang dari batas kategori berikutnya", jadi 2,95 cm masuk kategori yang sama dengan 2,9 cm.', en: 'Values ending in ".9" in the table (e.g. 1–2.9) are read as "below the next category limit", so 2.95 cm falls in the same category as 2.9 cm.' },
      calc(v, b, c) {
        const L = c.L, x = v.side === 2 ? -v.d : v.d, fx = n => (n < 0 ? '−' : '') + c.f1(Math.abs(n)).replace(/[.,]0$/, '');
        const o = catOut(c, 'vsit', b, x, fx, 'cm');
        return { val: x, valText: fx(x), d: 1, unit: 'cm', mainLabel: 'V sit and reach', rows: o.rows, flag: o.flag,
          f: [L === 'id' ? 'Jangkauan terjauh dari 3 percobaan; sebelum garis tumit negatif' : 'Best of 3 reaches; short of the heel line is negative', common(L)], s: o.s,
          copy: `V sit and reach (TKPN): ${fx(x)} cm — ${o.catTxt}` };
      },
    },
    {
      id: 'tksitup', def: 'tkpn', short: 'Kemenpora 2022 (TKPN)', name: { id: 'Sit up 60 detik', en: '60-second sit-up' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Sit up sempurna dalam 60 detik', en: 'Correct sit-ups in 60 s' }, unit: REP, lim: [0, 100], req: true, int: true }],
      protocol: { id: 'Berbaring di matras, lutut ditekuk, telapak kaki rata di lantai dan dipegang teman. Kedua lengan menyilang rapat di depan dada. Saat aba-aba, turunkan badan sampai punggung menyentuh lantai lalu angkat sampai siku menyentuh paha. Ulangi selama 60 detik; hanya gerakan sempurna yang dihitung.', en: 'Lie on a mat with knees bent, feet flat and held by a partner, arms crossed tightly on the chest. On the signal, lower until the back touches the floor, then rise until the elbows touch the thighs. Repeat for 60 s; count only correct repetitions.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN); pedoman menyebut norma dari North Thurston Public Schools (AS)', en: 'Indonesian students aged 9–18 (TKPN); the guideline attributes the norms to North Thurston Public Schools (USA)' },
      refs: ['tkpn22'],
      calc(v, b, c) {
        const L = c.L, o = catOut(c, 'situp', b, v.n, c.f0, '');
        return { val: v.n, d: 0, unit: L === 'id' ? 'kali' : 'reps', mainLabel: L === 'id' ? 'Sit up 60 detik' : '60-s sit-up', rows: o.rows, flag: o.flag,
          f: [L === 'id' ? 'Jumlah sit up sempurna dalam 60 detik' : 'Correct sit-ups in 60 s', common(L)], s: o.s,
          copy: `${L === 'id' ? 'Sit up 60 dtk' : '60-s sit-up'} (TKPN): ${c.f0(v.n)} ${L === 'id' ? 'kali' : 'reps'} — ${o.catTxt}` };
      },
    },
    {
      id: 'tksquat', def: 'tkpn', short: 'Kemenpora 2022 (TKPN)', name: { id: 'Squat thrust 30 detik', en: '30-second squat thrust' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Squat thrust sempurna dalam 30 detik', en: 'Correct squat thrusts in 30 s' }, unit: REP, lim: [0, 60], req: true, int: true }],
      protocol: { id: 'Berdiri tegak, kaki selebar bahu. Saat aba-aba: jongkok dan letakkan tangan di lantai, dorong kedua kaki ke belakang ke posisi push-up, kembali ke jongkok, lalu kembali berdiri. Satu gerakan dihitung sempurna bila dimulai dan diakhiri berdiri. Ulangi selama 30 detik.', en: 'Stand upright, feet shoulder-width apart. On the signal: squat and place the hands on the floor, thrust both legs back to a push-up position, return to the squat, then stand up. A repetition counts only if it starts and ends standing. Repeat for 30 s.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN)', en: 'Indonesian students aged 9–18 (TKPN)' },
      refs: ['tkpn22'],
      calc(v, b, c) {
        const L = c.L, o = catOut(c, 'squat', b, v.n, c.f0, '');
        return { val: v.n, d: 0, unit: L === 'id' ? 'kali' : 'reps', mainLabel: L === 'id' ? 'Squat thrust 30 detik' : '30-s squat thrust', rows: o.rows, flag: o.flag,
          f: [L === 'id' ? 'Jumlah squat thrust sempurna dalam 30 detik' : 'Correct squat thrusts in 30 s', common(L)], s: o.s,
          copy: `Squat thrust 30 ${L === 'id' ? 'dtk' : 's'} (TKPN): ${c.f0(v.n)} ${L === 'id' ? 'kali' : 'reps'} — ${o.catTxt}` };
      },
    },
    {
      id: 'tkpacer', def: 'tkpn', short: 'Kemenpora 2022 (TKPN)', name: { id: 'PACER (lari bolak-balik 20 m)', en: 'PACER (20 m shuttle run)' }, needs: ['age', 'sex'], noVo2: true,
      fields: [{ k: 'n', label: { id: 'Jumlah balikan', en: 'Number of laps' }, unit: { id: 'balikan', en: 'laps' }, lim: [0, 250], req: true, int: true,
        hint: { id: 'Total balikan sampai peserta dua kali gagal mencapai garis sebelum bunyi.', en: 'Total laps until the participant twice fails to reach the line before the beep.' } }],
      protocol: { id: 'Lintasan 20 m (tambah 2,5 m di tiap ujung), lebar minimal 1 m per peserta. Lari bolak-balik mengikuti irama audio PACER; satu kaki menyentuh garis sebelum bunyi, bila tiba lebih awal tunggu di garis. Kecepatan naik tiap level. Tes berhenti saat peserta dua kali gagal mencapai garis tepat waktu; catat jumlah balikan.', en: '20 m course (plus 2.5 m at each end), at least 1 m wide per participant. Run back and forth to the PACER audio; one foot must touch the line before the beep, and early arrivals wait at the line. Speed rises each level. Stop when the participant twice fails to reach the line in time; record the number of laps.' },
      pop: { id: 'Pelajar Indonesia usia 9–18 tahun (TKPN)', en: 'Indonesian students aged 9–18 (TKPN)' },
      refs: ['tkpn22'],
      caveat: { id: 'Pedoman TKPN tidak menyebut versi audio PACER yang dipakai dan tidak memuat persamaan VO₂max. Protokolnya belum tentu sama dengan beep test Léger 1988 di Modul 2, jadi jangan masukkan hasil PACER ke rumus Léger tanpa memastikan audionya. Aplikasi tidak menghitung VO₂max dari PACER.', en: 'The TKPN guideline does not state which PACER audio version is used and gives no VO₂max equation. The protocol may not match the Léger 1988 beep test in Module 2, so do not enter PACER results into the Léger equation without confirming the audio. The app does not compute VO₂max from PACER.' },
      calc(v, b, c) {
        const L = c.L, o = catOut(c, 'pacer', b, v.n, c.f0, ''), lv = pacerLevel(v.n);
        const rows = [...(lv && v.n > 0 ? [[L === 'id' ? 'Posisi di lembar penilaian' : 'Score-sheet position', L === 'id' ? `Level ${lv.level}, balikan ke-${lv.lap}` : `Level ${lv.level}, lap ${lv.lap}`]] : []), ...o.rows];
        return { val: v.n, d: 0, unit: L === 'id' ? 'balikan' : 'laps', mainLabel: 'PACER', rows, flag: o.flag,
          f: [L === 'id' ? 'Jumlah balikan sampai dua kali gagal' : 'Laps completed until two failures', common(L)], s: o.s,
          copy: `PACER (TKPN): ${c.f0(v.n)} ${L === 'id' ? 'balikan' : 'laps'}${lv && v.n > 0 ? ` (level ${lv.level})` : ''} — ${o.catTxt}` };
      },
    },
  ],
};
