// SakuSKO — rumus (formulas). Fungsi murni: tidak menyimpan data apa pun.
// Setiap rumus harus cocok dengan Kartu Spesifikasi SakuSKO v0.1.1 dan diuji di tests/formulas.test.mjs.

// ---------- Modul 1: HRmax & zona ----------
export const HRMAX = {
  fox:     { name: 'Fox',     a: 220, b: 1.00, sex: 'all' },  // 220 − usia (tradisional)
  tanaka:  { name: 'Tanaka',  a: 208, b: 0.70, sex: 'all' },  // Tanaka 2001
  gellish: { name: 'Gellish', a: 207, b: 0.70, sex: 'all' },  // Gellish 2007
  nes:     { name: 'Nes',     a: 211, b: 0.64, sex: 'all' },  // Nes 2013
  gulati:  { name: 'Gulati',  a: 206, b: 0.88, sex: 'F' },    // Gulati 2010 (wanita)
};
export const HRMAX_ORDER = ['tanaka', 'gellish', 'fox', 'nes', 'gulati'];

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
export const vo2Run24 = tMin => 483 / tMin + 3.5;                                    // lari 2,4 km / 1,5 mil
export const vo2Queens = (male, hr) => male ? 111.33 - 0.42 * hr : 65.81 - 0.1847 * hr; // McArdle 1972
export const harvardLong = (durS, c1, c2, c3) => (100 * durS) / (2 * (c1 + c2 + c3)); // Brouha 1943
export const harvardShort = (durS, c1) => (100 * durS) / (5.5 * c1);
export const vo2YoYo1 = d => d * 0.0084 + 36.4;                                      // Bangsbo 2008
export function vo2Ift(male, age, wKg, vift) {                                        // Buchheit 2008; G pria 1, wanita 2
  const G = male ? 1 : 2;
  return 28.3 - 2.15 * G - 0.741 * age - 0.0357 * wKg + 0.0586 * age * vift + 1.03 * vift;
}
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
