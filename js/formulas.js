// SakuSKO — rumus (formulas). Fungsi murni: tidak menyimpan data apa pun.
// Setiap rumus harus cocok dengan Kartu Spesifikasi SakuSKO v0.1.1 dan diuji di tests/formulas.test.mjs.

// ---------- Modul 1: HRmax & zona ----------
export const HRMAX = {
  fox:     { name: 'Fox',     a: 220, b: 1.00, sex: 'all' },  // 220 − usia (tradisional)
  tanaka:  { name: 'Tanaka',  a: 208, b: 0.70, sex: 'all' },  // Tanaka 2001
  nes:     { name: 'Nes',     a: 211, b: 0.64, sex: 'all' },  // Nes 2013
};
// Dirampingkan 20 Nov 2026: Gellish (selalu 1 kali/mnt di bawah Tanaka) dan Gulati dihapus.
export const HRMAX_ORDER = ['tanaka', 'nes', 'fox'];

export function hrmax(key, age) {
  const f = HRMAX[key];
  return f.a - f.b * age;
}

export function hrmaxApplies(key, sex) {
  return HRMAX[key].sex === 'all' || HRMAX[key].sex === sex;
}

// Karvonen: target = (HRmax − HR istirahat) × fraksi + HR istirahat
export function karvonen(hrMax, hrRest, frac) {
  return (hrMax - hrRest) * frac + hrRest;
}

// Kategori intensitas ACSM (%HRR)
export const ACSM_ZONES = [
  { key: 'light',    lo: 0.30, hi: 0.39 },
  { key: 'moderate', lo: 0.40, hi: 0.59 },
  { key: 'vigorous', lo: 0.60, hi: 0.89 },
];

export function acsmZones(hrMax, hrRest) {
  return ACSM_ZONES.map(z => ({
    key: z.key, lo: z.lo, hi: z.hi,
    bpmLo: Math.round(karvonen(hrMax, hrRest, z.lo)),
    bpmHi: Math.round(karvonen(hrMax, hrRest, z.hi)),
  }));
}

// Batas isian yang masuk akal (validasi)
export const LIMITS = {
  age: [18, 100],
  hrRest: [30, 120],
  hrMeasured: [100, 230],
  weight: [20, 300],
  height: [100, 250],
};

// ================= Modul 2 — VO₂max lapangan (mL/kg/menit) =================
export const vo2Cooper = d => (d - 504.9) / 44.73;                                   // Cooper 1968
export function vo2Rockport(wKg, age, male, tMin, hr) {                               // Kline 1987 (BB dalam pon)
  return 132.853 - 0.0769 * (wKg * 2.20462) - 0.3877 * age + 6.315 * (male ? 1 : 0) - 3.2649 * tMin - 0.1565 * hr;
}
export const legerSpeed = stage => 8 + 0.5 * stage;                                  // Léger 1988, km/jam
export function vo2Leger(stage, age) {                                                // dewasa: usia ditetapkan 18
  const s = legerSpeed(stage), a = age >= 18 ? 18 : age;
  return 31.025 + 3.238 * s - 3.248 * a + 0.1536 * a * s;
}
export const vo2Queens = (male, hr) => male ? 111.33 - 0.42 * hr : 65.81 - 0.1847 * hr; // McArdle 1972
export const vo2YoYo1 = d => d * 0.0084 + 36.4;                                      // Bangsbo 2008
export function sixMwtPred(male, age, hCm, wKg) {                                     // Enright & Sherrill 1998, 40–80 th
  return male ? 7.57 * hCm - 5.02 * age - 1.76 * wKg - 309 : 2.11 * hCm - 2.29 * wKg - 5.78 * age + 667;
}

// ================= Modul 3 — kekuatan =================
export const rmEpley = (w, r) => w * (1 + r / 30);
export const rmBrzycki = (w, r) => w * 36 / (37 - r);
// Nuzzo dkk. Sports Med 2024 — rerata repetisi maksimal & SD antarindividu per %1RM (tabel model utama, bench press, leg press)
export const NUZZO = {
  general: [[95, 3.28, 1.66], [90, 4.94, 1.90], [85, 7.15, 2.19], [80, 9.75, 2.51], [75, 12.37, 2.88], [70, 14.80, 3.31],
    [65, 17.11, 3.80], [60, 19.53, 4.37], [55, 22.43, 5.02], [50, 25.99, 5.76], [45, 30.37, 6.61], [40, 35.75, 7.60]],
  bench: [[95, 2.59, 1.25], [90, 4.11, 1.46], [85, 6.23, 1.71], [80, 8.82, 1.99], [75, 11.51, 2.33], [70, 14.08, 2.72],
    [65, 16.59, 3.17], [60, 19.34, 3.70], [55, 22.79, 4.31], [50, 27.25, 5.03], [45, 33.01, 5.87], [40, 40.45, 6.86]],
  leg: [[95, 7.04, 2.63], [90, 8.69, 3.08], [85, 10.69, 3.62], [80, 13.05, 4.24], [75, 15.79, 4.98], [70, 18.96, 5.84],
    [65, 22.59, 6.85], [60, 26.74, 8.03], [55, 31.47, 9.42], [50, 36.86, 11.05], [45, 42.96, 12.96], [40, 49.87, 15.21]],
};
export const round05 = x => Math.round(x * 2) / 2;
// Handgrip: AWGS 2019 (≥65 th) dan AWGS 2025 (50–64 th). null = tidak ada ambang AWGS untuk usia ini.
export function gripCut(age, male) {
  if (age >= 65) return male ? 28 : 18;
  if (age >= 50) return male ? 34 : 20;
  return null;
}
// 5× sit-to-stand: AWGS 2019, ≥12 dtk = performa fisik rendah (≥65 th). null = tidak ada ambang.
export const stsCut = age => (age >= 65 ? 12 : null);

// ================= Modul 4 — energi (kkal/hari) =================
export const rmrTenHaaf = (w, hM, age, male) => 11.936 * w + 587.728 * hM - 8.129 * age + 191.027 * (male ? 1 : 0) + 29.279; // ten Haaf & Weijs 2014
export const rmrMifflin = (w, hCm, age, male) => 10 * w + 6.25 * hCm - 5 * age + (male ? 5 : -161);                  // Mifflin 1990
export const rmrCunningham = ffm => 500 + 22 * ffm;                                                                       // Cunningham 1980
export const energyAvail = (ei, eee, ffm) => (ei - eee) / ffm;                                                           // IOC 2023
// Karbohidrat (g/kg/hari) menurut beban latihan — ACSM/AND/DC 2016
export const CHO = { light: [3, 5], mod: [5, 7], high: [6, 10], vhigh: [8, 12] };
export const PROTEIN = [1.2, 2.0];   // g/kg/hari
export const FAT_PCT = [20, 35];     // % energi
export const PAL_BANDS = [{ k: 'sed', lo: 1.40, hi: 1.69 }, { k: 'act', lo: 1.70, hi: 1.99 }, { k: 'vig', lo: 2.00, hi: 2.40 }]; // FAO/WHO/UNU 2004

// ================= Modul 8 — antropometri dasar =================
export const bmi = (w, hCm) => w / ((hCm / 100) ** 2);
export function bmiCat(b) {                                   // PNPK Tata Laksana Obesitas Dewasa 2025 (Asia-Pasifik)
  if (b < 18.5) return 'under';
  if (b < 23) return 'normal';
  if (b < 25) return 'over';
  if (b < 30) return 'ob1';
  return 'ob2';
}
export const centralObese = (wc, male) => wc > (male ? 90 : 80);  // PNPK 2025
export const whtr = (wc, hCm) => wc / hCm;                          // NICE NG246: ≥0,5 risiko meningkat
export const whr = (wc, hc) => wc / hc;                             // WHO 2008/2011: ≥0,90 pria, ≥0,85 wanita
export const whrHigh = (r, male) => r >= (male ? 0.90 : 0.85);

// ================= Modul 5 — skinfold & somatotipe =================
export const siri = D => 495 / D - 450;                                                          // Siri 1961
export const jp3Men = (S, age) => 1.10938 - 0.0008267 * S + 0.0000016 * S * S - 0.0002574 * age; // dada+abdomen+paha
export const jpw3Women = (S, age) => 1.0994921 - 0.0009929 * S + 0.0000023 * S * S - 0.0001392 * age; // triseps+suprailiaka+paha
// Durnin-Womersley 1974: [usia bawah, usia atas, C, M]
export const DW = {
  M: [[17, 19, 1.1620, 0.0630], [20, 29, 1.1631, 0.0632], [30, 39, 1.1422, 0.0544], [40, 49, 1.1620, 0.0700], [50, 72, 1.1715, 0.0779]],
  F: [[16, 19, 1.1549, 0.0678], [20, 29, 1.1599, 0.0717], [30, 39, 1.1423, 0.0632], [40, 49, 1.1333, 0.0612], [50, 68, 1.1339, 0.0645]],
};
export function dwRow(age, sex) { const t = DW[sex]; return t.find(r => age >= r[0] && age <= r[1]) || (age > t[t.length - 1][1] ? t[t.length - 1] : t[0]); }
export const dwDensity = (S4, age, sex) => { const r = dwRow(age, sex); return r[2] - r[3] * Math.log10(S4); };
export const hastutiAbd = (abd, tri, age) => 8.000 + 0.402 * abd + 0.486 * tri + 0.059 * age;     // Hastuti 2013, pria
export const ffmFrom = (w, pct) => w * (1 - pct / 100);
export const targetWeight = (ffm, pct) => ffm / (1 - pct / 100);
// Heath-Carter, persamaan desimal (Carter 2002); komponen ≤0 diberi 0,1
const floor01 = x => (x <= 0 ? 0.1 : x);
export function endomorphy(tri, sub, ss, hCm) { const X = (tri + sub + ss) * (170.18 / hCm); return floor01(-0.7182 + 0.1451 * X - 0.00068 * X * X + 0.0000014 * X ** 3); }
export function mesomorphy(hum, fem, armG, triMm, calfG, calfMm, hCm) {
  const CAG = armG - triMm / 10, CCG = calfG - calfMm / 10;
  return floor01(0.858 * hum + 0.601 * fem + 0.188 * CAG + 0.161 * CCG - 0.131 * hCm + 4.5);
}
export const hwr = (hCm, w) => hCm / Math.cbrt(w);
export function ectomorphy(h) { if (h >= 40.75) return floor01(0.732 * h - 28.58); if (h > 38.25) return floor01(0.463 * h - 17.63); return 0.1; }
export const somatoXY = (en, me, ec) => ({ x: ec - en, y: 2 * me - (en + ec) });
// 13 kategori somatotipe (Carter 2002). "Sama" = selisih ≤0,5; sentral = tidak ada komponen yang berbeda >1 dari dua lainnya.
export function somatoCategory(en, me, ec) {
  const c = { endo: en, meso: me, ecto: ec };
  if (Math.max(en, me, ec) - Math.min(en, me, ec) <= 1) return 'central';
  const [a, b, d] = Object.keys(c).sort((x, y) => c[y] - c[x]);
  const eps = 1e-9;
  if (c[a] - c[b] <= 0.5 + eps) return [a, b].sort().join('-');          // dua komponen setara, ketiga lebih kecil
  if (c[b] - c[d] <= 0.5 + eps) return `balanced-${a}`;                   // satu dominan, dua lainnya setara
  return `${b}ic-${a}`;                                                   // dominan a, kedua b
}

// ================= Modul 10 — sweat rate =================
export const sweatLoss = (pre, post, fluidL, urineL) => pre - post + fluidL - urineL;  // L (1 kg ≈ 1 L)
export const sweatRate = (lossL, hours) => lossL / hours;
export const bmChangePct = (pre, post) => (pre - post) / pre * 100;

// ================= Modul 9 — rehabilitasi =================
export const lsiDist = (inj, healthy) => inj / healthy * 100;        // jarak atau torsi (Noyes 1991)
export const lsiTime = (inj, healthy) => healthy / inj * 100;        // tes berwaktu: waktu sehat / waktu cedera
export const hqRatio = (h, q) => h / q;                               // konvensional (Hkon/Qkon) atau fungsional (Heks/Qkon)
