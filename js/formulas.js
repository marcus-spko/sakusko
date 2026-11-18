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
