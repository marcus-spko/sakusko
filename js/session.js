// SakuSKO — sesi pemeriksaan.
// Satu pasien per sesi, TANPA nama/identitas. Disimpan di HP ini saja (localStorage)
// dan terhapus otomatis setelah TTL_MIN menit sejak terakhir dipakai, atau saat tombol "Hapus data" ditekan.
export const TTL_MIN = 60;
const KEY = 'sakusko-session';

const blank = () => ({
  base: { age: '', sex: '', weight: '', height: '' },  // data dasar dipakai lintas modul
  m1: { hrRest: '', hrMeas: '', basis: 'tanaka' },
  m2: { test: 'cooper', v: {} },                        // v: { 'idTes.kunci': 'angka' }
  m3: { test: 'rm', v: {}, basis: 'brzycki', ex: 'general' },
  m4: { v: {}, basis: 'th', cho: '' },
  m8: { v: {} },
  m5: { v: {}, tab: 'fat', eq: '' },
  m10: { v: {} },
  m6: { view: 'back', s: {} },
  m9: { v: {}, test: 'single' },
  m11: { test: 'gait', v: {} },   // v0.2 Tahap 2: neuromotor
  m12: { test: 'pushup', v: {} }, // daya tahan & power otot
  m13: { test: 'sitreach', v: {} }, // fleksibilitas
  m7: { sel: 'cre', picked: [] }, // picked: kunci suplemen yang masuk Ringkasan
  sos: { rf: {}, rm: {}, os: {} }, // konkusi: red flag, tanda keluar lapangan, tanda terlihat SCAT6 + keluhan gejala (os.sy)
  skr: { part: 'acsm', active: '', known: '', symp: '', intent: '', cleared: '', aha: {}, pqLang: '', pq: { g: {}, q1: {}, txt: {}, f: {} } },
  updatedAt: 0,
});

export const S = blank();

function assign(src) {
  const b = blank();
  S.base = { ...b.base, ...(src.base || {}) };
  S.m1 = { ...b.m1, ...(src.m1 || {}) };
  S.m2 = { ...b.m2, ...(src.m2 || {}), v: { ...((src.m2 || {}).v || {}) } };
  S.m3 = { ...b.m3, ...(src.m3 || {}), v: { ...((src.m3 || {}).v || {}) } };
  S.m4 = { ...b.m4, ...(src.m4 || {}), v: { ...((src.m4 || {}).v || {}) } };
  S.m5 = { ...b.m5, ...(src.m5 || {}), v: { ...((src.m5 || {}).v || {}) } };
  S.m6 = { ...b.m6, ...(src.m6 || {}), s: { ...((src.m6 || {}).s || {}) } };
  S.sos = { ...b.sos, ...(src.sos || {}), rf: { ...((src.sos || {}).rf || {}) }, rm: { ...((src.sos || {}).rm || {}) }, os: { ...((src.sos || {}).os || {}) } };
  delete S.sos.rts;
  S.m7 = { ...b.m7, ...(src.m7 || {}), picked: [...((src.m7 || {}).picked || [])] };
  S.m9 = { ...b.m9, ...(src.m9 || {}), v: { ...((src.m9 || {}).v || {}) } };
  S.m10 = { ...b.m10, ...(src.m10 || {}), v: { ...((src.m10 || {}).v || {}) } };
  S.m8 = { ...b.m8, ...(src.m8 || {}), v: { ...((src.m8 || {}).v || {}) } };
  for (const k of ['m11', 'm12', 'm13']) S[k] = { ...b[k], ...(src[k] || {}), v: { ...((src[k] || {}).v || {}) } };
  const spq = (src.skr || {}).pq || {};
  S.skr = { ...b.skr, ...(src.skr || {}), aha: { ...((src.skr || {}).aha || {}) }, pq: { g: { ...(spq.g || {}) }, q1: { ...(spq.q1 || {}) }, txt: { ...(spq.txt || {}) }, f: { ...(spq.f || {}) } } };
  delete S.skr.parq;
  S.updatedAt = src.updatedAt || 0;
}

export function isEmpty() {
  const noVals = o => Object.values(o.v).every(v => v === '');
  return Object.values(S.base).every(v => v === '') && S.m1.hrRest === '' && S.m1.hrMeas === '' && noVals(S.m2) && noVals(S.m3) && noVals(S.m4) && noVals(S.m8) && noVals(S.m5) && noVals(S.m10) && noVals(S.m9) && noVals(S.m11) && noVals(S.m12) && noVals(S.m13) && Object.keys(S.m6.s).length === 0 && !S.m4.cho && S.m7.picked.length === 0 && Object.keys(S.sos.rf).length === 0 && Object.keys(S.sos.rm).length === 0 && Object.keys(S.sos.os).length === 0
    && ['active', 'known', 'symp', 'intent', 'cleared'].every(k => S.skr[k] === '') && Object.keys(S.skr.aha).length === 0
    && ['g', 'f'].every(k => Object.values(S.skr.pq[k]).every(v => !v)) && Object.values(S.skr.pq.q1).every(v => !v) && Object.values(S.skr.pq.txt).every(v => !v);
}

export function expiresAt() { return S.updatedAt ? S.updatedAt + TTL_MIN * 60000 : 0; }

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data.updatedAt || Date.now() - data.updatedAt > TTL_MIN * 60000) { localStorage.removeItem(KEY); return 'expired'; }
    assign(data);
    return 'loaded';
  } catch (e) { return false; }
}

export function save() {
  S.updatedAt = Date.now();
  try {
    if (isEmpty()) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify({ base: S.base, m1: S.m1, m2: S.m2, m3: S.m3, m4: S.m4, m8: S.m8, m5: S.m5, m10: S.m10, m6: S.m6, m7: S.m7, sos: S.sos, m9: S.m9, m11: S.m11, m12: S.m12, m13: S.m13, skr: S.skr, updatedAt: S.updatedAt }));
  } catch (e) { /* penyimpanan tidak tersedia: data tetap di memori */ }
}

export function clear() {
  assign(blank());
  try { localStorage.removeItem(KEY); } catch (e) { /* abaikan */ }
}

// true bila sesi kedaluwarsa dan baru saja dihapus
export function expireIfDue() {
  if (S.updatedAt && Date.now() - S.updatedAt > TTL_MIN * 60000) { clear(); return true; }
  return false;
}
