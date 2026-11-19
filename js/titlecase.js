// SakuSKO — huruf kapital di awal setiap kata untuk label, judul, tombol, dan pilihan (permintaan dr. Marcus, 19 Nov 2026).
// Kalimat (catatan, petunjuk, definisi, protokol) tetap huruf kapital hanya di awal kalimat.
// Pengecualian: kata tugas di tengah judul (EYD: di, ke, dari, dan, yang, untuk, ...), satuan (kg, cm, km/jam, mL/kg/mnt),
// istilah dengan huruf campuran yang sudah baku (iPhone, mL), dan token yang diawali angka (1RM, 5×, 12).
const SMALL = new Set(['di', 'ke', 'dari', 'dan', 'yang', 'untuk', 'pada', 'atau', 'dengan', 'per', 'dalam', 'oleh', 'sebagai', 'tanpa', 'bila', 'vs', 'vs.',
  'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'at', 'for', 'by', 'with', 'from', 'as']);
const UNITS = new Set(['kg', 'cm', 'm', 'km', 'ml', 'dtk', 'mnt', 's', 'min', 'rep', 'reps', 'th', 'y', 'bpm', 'lb', 'mil', 'mmol', 'mg', 'g', 'l']);

function capWord(w, first) {
  const m = w.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
  const [, pre, core, post] = m;
  if (!core || !/^\p{Ll}/u.test(core)) return w;            // diawali angka/huruf besar → biarkan
  if (/\p{Lu}/u.test(core.slice(1))) return w;              // huruf campuran baku: iPhone, mL
  if (core.includes('/')) return w;                         // satuan gabungan: kali/mnt, km/jam
  const low = core.toLowerCase();
  if (UNITS.has(low)) return w;
  if (!first && SMALL.has(low) && pre === '') return w;
  const parts = core.split(/([-–])/).map((p, i) => (p === '-' || p === '–' || (i > 0 && SMALL.has(p)) ? p : p.charAt(0).toUpperCase() + p.slice(1)));
  return pre + parts.join('') + post;
}
export function titleCase(str) {
  let first = true;
  return str.split(/(\s+)/).map(tok => {
    if (/^\s+$/.test(tok) || tok === '') return tok;
    const out = capWord(tok, first); first = false; return out;
  }).join('');
}

const SEL = '.lbl, .h1, .h2, h3, .sheet-title, .tile-title, .tile-cat, .kicker, option, .seg button, th, .frow-name, .btn-primary span, .btn-primary, .btn-sec span, .linkbtn, .opt, .badge, .nav a span, .gl dt';
function fixEl(el) {
  for (const n of el.childNodes) {
    if (n.nodeType === 3 && n.nodeValue.trim()) { const v = titleCase(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  }
}
function fixTree(root) {
  if (root.nodeType === 3) { if (root.parentElement && root.parentElement.matches(SEL)) fixEl(root.parentElement); return; }
  if (root.nodeType !== 1) return;
  if (root.matches(SEL)) fixEl(root);
  root.querySelectorAll(SEL).forEach(fixEl);
}
export function startTitleCase() {
  fixTree(document.body);
  new MutationObserver(muts => { for (const m of muts) { if (m.target.nodeType === 1 && m.target.matches(SEL)) fixEl(m.target); m.addedNodes.forEach(fixTree); } })
    .observe(document.body, { childList: true, subtree: true });
}
