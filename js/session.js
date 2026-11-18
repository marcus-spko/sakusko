// SakuSKO — sesi pemeriksaan.
// Satu pasien per sesi, TANPA nama/identitas. Disimpan di HP ini saja (localStorage)
// dan terhapus otomatis setelah TTL_MIN menit sejak terakhir dipakai, atau saat tombol "Hapus data" ditekan.
export const TTL_MIN = 60;
const KEY = 'sakusko-session';

const blank = () => ({
  base: { age: '', sex: '', weight: '', height: '' },  // data dasar dipakai lintas modul
  m1: { hrRest: '', hrMeas: '', basis: 'tanaka' },
  updatedAt: 0,
});

export const S = blank();

function assign(src) {
  const b = blank();
  S.base = { ...b.base, ...(src.base || {}) };
  S.m1 = { ...b.m1, ...(src.m1 || {}) };
  S.updatedAt = src.updatedAt || 0;
}

export function isEmpty() {
  return Object.values(S.base).every(v => v === '') && S.m1.hrRest === '' && S.m1.hrMeas === '';
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
    else localStorage.setItem(KEY, JSON.stringify({ base: S.base, m1: S.m1, updatedAt: S.updatedAt }));
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
