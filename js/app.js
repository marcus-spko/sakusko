// SakuSKO — aplikasi utama. Tanpa server, tanpa penyimpanan data pasien.
import { HRMAX, HRMAX_ORDER, hrmax, hrmaxApplies, acsmZones, karvonen, LIMITS } from './formulas.js';
import { MODULES, T, M1_FORMULAS, KARVONEN_REF, GLOSSARY, ABOUT } from './i18n.js';

// ---------- Ikon (garis, tanpa emoji) ----------
const ICONS = {
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.5 12h4l1.5-3 3 6 1.5-3h7"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  dumbbell: '<path d="M6 6v12"/><path d="M18 6v12"/><path d="M3 9v6"/><path d="M21 9v6"/><path d="M6 12h12"/>',
  food: '<path d="M12 7c-2-2-7-1.5-7 4 0 4 3 9 7 9s7-5 7-9c0-5.5-5-6-7-4Z"/><path d="M12 7c0-2 1-3.5 3-4.5"/>',
  ruler: '<path d="M3 17 17 3l4 4L7 21Z"/><path d="m7 13 2 2"/><path d="m10 10 2 2"/><path d="m13 7 2 2"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
  pill: '<path d="m10.5 20.5-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z"/><path d="m8.5 8.5 7 7"/>',
  body: '<circle cx="12" cy="5" r="2"/><path d="M12 7v7"/><path d="M7 10h10"/><path d="m9.5 21 2.5-7 2.5 7"/>',
  balance: '<path d="M7 20V9"/><path d="M17 20V5"/><path d="M4 20h16"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5Z"/><path d="M4 21.5V4.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5v.5"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
};
const svg = (name, color = 'currentColor', size = 20, sw = 2) =>
  `<svg aria-hidden="true" focusable="false" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

// ---------- Status ----------
let lang = 'id';
try { const s = localStorage.getItem('sakusko-lang'); if (s === 'id' || s === 'en') lang = s; } catch (e) { /* abaikan */ }
let offline = 'wait';           // 'wait' | 'ready' | 'none'
let installEvt = null;
let query = '';
// Data Modul 1 hanya di memori (hilang saat halaman ditutup)
const m1 = { age: '', sex: '', hrRest: '', hrMeas: '', base: 'tanaka', open: new Set(), karvOpen: false, touched: new Set() };

const t = () => T[lang];
const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v, d = 0) => Number(v).toLocaleString(lang === 'id' ? 'id-ID' : 'en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
const dec = v => (Number.isInteger(+v.toFixed(2)) ? num(v, 0) : num(v, 1));
const parse = s => { const x = parseFloat(String(s).replace(',', '.')); return Number.isFinite(x) ? x : NaN; };

// ---------- Rangka layar ----------
function langToggle() {
  return `<div class="lang" role="group" aria-label="Bahasa / Language">
    <button type="button" data-lang="id" aria-pressed="${lang === 'id'}">ID</button>
    <button type="button" data-lang="en" aria-pressed="${lang === 'en'}">EN</button></div>`;
}
function chip() {
  const txt = offline === 'ready' ? t().offlineReady : offline === 'wait' ? t().offlinePreparing : t().offlineNone;
  return `<span class="chip ${offline === 'ready' ? '' : 'wait'}" id="offChip" role="status"><span class="dot"></span>${esc(txt)}</span>`;
}
function nav(active) {
  const items = [['#/', 'grid', t().navCalc, 'calc'], ['#/glosarium', 'book', t().navGloss, 'gloss'], ['#/tentang', 'info', t().navAbout, 'about']];
  return `<nav class="nav" aria-label="Navigasi utama"><div class="nav-in">${items.map(([h, ic, l, k]) =>
    `<a href="${h}" ${active === k ? 'aria-current="page"' : ''}>${svg(ic)}<span>${esc(l)}</span></a>`).join('')}</div></nav>`;
}
function brandHeader() {
  return `<header class="hdr"><div class="hdr-row"><div class="brand"><span class="logo">${svg('heart', '#FF8A3D', 22, 2.2)}</span>
    <div><div class="brand-name">SakuSKO</div><div class="brand-tag">${esc(t().tagline)}</div></div></div>${langToggle()}</div>${chip()}</header>`;
}
function pageHeader(kicker, title, sub) {
  return `<header class="hdr"><div class="hdr-row"><a class="back" href="#/" aria-label="${esc(t().back)}">${svg('back', '#1C1206', 22, 2.4)}</a>${langToggle()}</div>
    <div>${kicker ? `<div class="kicker">${esc(kicker)}</div>` : ''}<h1 class="h1">${esc(title)}</h1>${sub ? `<div class="sub">${esc(sub)}</div>` : ''}</div></header>`;
}
const ibtn = (key, label) => `<button type="button" class="ibtn" data-def="${key}" aria-label="${esc(t().defTitle)}: ${esc(label)}">${svg('info', '#9A3412', 18)}</button>`;

// ---------- Beranda ----------
function homeTiles() {
  const q = query.trim().toLowerCase();
  const list = MODULES.map((m, i) => ({ ...m, n: i + 1 })).filter(m => !q ||
    [m.title.id, m.title.en, m.cat.id, m.cat.en].some(s => s.toLowerCase().includes(q)));
  const tiles = list.map(m => `<a class="tile" href="#/m/${m.id}">
      <div class="tile-top"><span class="tile-ic">${svg(m.icon, '#C2410C')}</span>
      ${m.ready ? `<span class="tile-num">${String(m.n).padStart(2, '0')}</span>` : `<span class="soon">${esc(t().soon)}</span>`}</div>
      <div><div class="tile-title">${esc(m.title[lang])}</div><div class="tile-cat">${esc(m.cat[lang])}</div></div></a>`).join('');
  return tiles || `<p class="empty">${esc(t().noResult)}</p>`;
}
function renderHomeTiles() { const g = document.getElementById('tiles'); if (g) g.innerHTML = homeTiles(); }
function renderHome() {
  app.innerHTML = `${brandHeader()}<main class="main">
    <label class="search">${svg('search', '#5C4F45')}<span class="sr-only">${esc(t().search)}</span>
      <input type="search" id="q" value="${esc(query)}" placeholder="${esc(t().searchPh)}" autocomplete="off"></label>
    <div class="row-between"><h2 class="h2">${esc(t().calculators)}</h2><span class="muted">${esc(t().modulesCount(MODULES.length))}</span></div>
    <div class="grid" id="tiles">${homeTiles()}</div></main>${nav('calc')}`;
}

// ---------- Modul belum siap ----------
function renderWip(m, n) {
  app.innerHTML = `${pageHeader(t().moduleLabel(String(n).padStart(2, '0'), m.cat[lang]), m.title[lang], '')}
    <main class="main"><div class="note">${svg('info', '#9A3412')}<span>${esc(t().wip)}</span></div></main>${nav('calc')}`;
}

// ---------- Modul 1: HRmax & zona ----------
function m1State() {
  const age = parse(m1.age), hrRest = parse(m1.hrRest), hrMeas = parse(m1.hrMeas);
  const err = {};
  const inR = (v, [lo, hi]) => v >= lo && v <= hi;
  if (m1.age !== '' && !inR(age, LIMITS.age)) err.age = t().errRange(...LIMITS.age);
  if (m1.hrRest !== '' && !inR(hrRest, LIMITS.hrRest)) err.hrRest = t().errRange(...LIMITS.hrRest);
  if (m1.hrMeas !== '') {
    if (!inR(hrMeas, LIMITS.hrMeasured)) err.hrMeas = t().errRange(...LIMITS.hrMeasured);
    else if (Number.isFinite(hrRest) && hrMeas <= hrRest) err.hrMeas = t().errMeasLow;
  }
  const shown = Object.fromEntries(Object.entries(err).filter(([k]) => m1.touched.has(k)));
  const ok = m1.age !== '' && !err.age && m1.sex && m1.hrRest !== '' && !err.hrRest;
  const measOk = ok && m1.hrMeas !== '' && !err.hrMeas;
  return { age, hrRest, hrMeas, err: shown, allErr: err, ok, measOk };
}

function field(id, label, unit, value, { req = true, hint = '', def = null, err = '' } = {}) {
  return `<div class="field ${err ? 'invalid' : ''}" id="f-${id}">
    <div class="lbl-row"><label class="lbl" for="${id}">${esc(label)}</label>${req ? '<span class="req" aria-hidden="true">*</span>' : `<span class="opt">${esc(t().optional)}</span>`}${def ? ibtn(def, label) : ''}</div>
    <div class="inbox"><input id="${id}" name="${id}" type="text" inputmode="numeric" autocomplete="off" enterkeyhint="next" value="${esc(value)}" ${req ? 'aria-required="true"' : ''} ${err ? `aria-invalid="true" aria-describedby="e-${id}"` : ''}><span class="unit">${esc(unit)}</span></div>
    <div id="m-${id}" data-hint="${esc(hint)}">${msgHtml(id, err, hint)}</div></div>`;
}
function msgHtml(id, err, hint) {
  return err ? `<div class="err" id="e-${id}">${svg('alert', '#B91C1C', 16)}<span>${esc(err)}</span></div>` : hint ? `<span class="hint">${esc(hint)}</span>` : '';
}
// Perbarui pesan kesalahan tanpa mengganti kotak isian (keyboard HP tidak tertutup)
function updateFieldMsgs(s) {
  for (const id of ['age', 'hrRest', 'hrMeas']) {
    const err = s.err[id] || '';
    const box = document.getElementById(`f-${id}`), input = document.getElementById(id), slot = document.getElementById(`m-${id}`);
    if (!box || !input || !slot) continue;
    box.classList.toggle('invalid', !!err);
    if (err) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', `e-${id}`); }
    else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    slot.innerHTML = msgHtml(id, err, slot.dataset.hint);
  }
}

function renderM1() {
  const s = m1State();
  app.innerHTML = `${pageHeader(t().moduleLabel('01', MODULES[0].cat[lang]), MODULES[0].title[lang], t().m1Sub)}
  <main class="main">
    <div class="note">${svg('body', '#9A3412')}<span>${esc(t().m1Pop)}</span></div>
    <section class="card" aria-labelledby="h-in">
      <div class="row-between"><h2 class="h2" id="h-in">${esc(t().dataIn)}</h2><span class="muted"><span class="req">*</span> ${esc(t().required)}</span></div>
      <div id="fields">${m1Fields(s)}</div>
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().notStored)}</span></div>
    </section>
    <div id="m1out">${m1Out(s)}</div>
    <div class="foot"><span>${esc(t().m1Sources)}</span><span>${esc(t().meta)}</span></div>
  </main>${nav('calc')}`;
}

function m1Fields(s) {
  return `<div style="display:flex;flex-direction:column;gap:14px">
    ${field('age', t().age, t().years, m1.age, { err: s.err.age })}
    <div class="field"><div class="lbl-row"><span class="lbl" id="sexLbl">${esc(t().sex)}</span><span class="req" aria-hidden="true">*</span></div>
      <div class="seg" role="group" aria-labelledby="sexLbl">
        <button type="button" data-sex="M" aria-pressed="${m1.sex === 'M'}">${esc(t().male)}</button>
        <button type="button" data-sex="F" aria-pressed="${m1.sex === 'F'}">${esc(t().female)}</button></div></div>
    ${field('hrRest', t().hrRest, t().bpm, m1.hrRest, { hint: t().hrRestHint, def: 'hrrest', err: s.err.hrRest })}
    ${field('hrMeas', t().hrMeas, t().bpm, m1.hrMeas, { req: false, hint: t().hrMeasHint, def: 'hrmeas', err: s.err.hrMeas })}</div>`;
}

const coef = key => num(HRMAX[key].b, 2).replace(/([.,]\d)0$/, '$1');
function formulaText(key) {
  const f = HRMAX[key];
  if (key === 'fox') return `HRmax = 220 − ${lang === 'id' ? 'usia' : 'age'}`;
  return `HRmax = ${f.a} − ${coef(key)} × ${lang === 'id' ? 'usia' : 'age'}`;
}

function m1Out(s) {
  if (!s.ok) return `<section class="card"><h2 class="h2">${esc(t().estHr)}</h2><p class="empty" style="margin:0">${esc(t().fillFirst)}</p></section>`;
  const keys = HRMAX_ORDER.filter(k => hrmaxApplies(k, m1.sex));
  const vals = Object.fromEntries(HRMAX_ORDER.map(k => [k, hrmax(k, s.age)]));
  const rounded = keys.map(k => Math.round(vals[k]));
  const lo = Math.min(...rounded), hi = Math.max(...rounded);
  // dasar zona
  if (s.measOk && m1._measWasOk !== true) m1.base = 'measured';
  if (!s.measOk && m1.base === 'measured') m1.base = 'tanaka';
  if (m1.base !== 'measured' && !keys.includes(m1.base)) m1.base = 'tanaka';
  m1._measWasOk = s.measOk;
  const baseVal = m1.base === 'measured' ? s.hrMeas : Math.round(vals[m1.base]);
  const baseName = m1.base === 'measured' ? t().measuredName : HRMAX[m1.base].name;
  const zones = acsmZones(baseVal, s.hrRest);
  const hrr = baseVal - s.hrRest;

  const rows = HRMAX_ORDER.map(k => {
    const on = hrmaxApplies(k, m1.sex);
    const info = M1_FORMULAS[k];
    const open = m1.open.has(k);
    const v = on ? num(Math.round(vals[k])) : '—';
    const box = open ? `<div class="fbox" id="fx-${k}">
        <span class="k">${esc(t().fFormula)}</span><span class="f">${esc(formulaText(k))}</span>
        ${on ? `<span class="k">${esc(t().fWithData)}</span><span class="s">${k === 'fox' ? `220 − ${num(s.age)}` : `${HRMAX[k].a} − ${esc(coef(k))} × ${num(s.age)}`} = ${esc(dec(vals[k]))}</span>` : ''}
        <span class="k">${esc(t().fPop)}</span><span class="r">${esc(info.pop[lang])}</span>
        ${info.ref ? `<span class="k">${esc(t().fSource)}</span><span class="r">${esc(info.ref)} <a href="https://doi.org/${info.doi}" target="_blank" rel="noopener">doi:${info.doi}</a></span><span class="hint">${esc(t().doiNote)}</span>` : ''}
      </div>` : '';
    return `<div class="frow ${on ? '' : 'off'}"><div class="frow-main"><div class="frow-name">${esc(HRMAX[k].name)}${m1.base === k ? `<span class="badge">${esc(t().base)}</span>` : ''}</div>
        <span class="hint">${esc(on ? info.pop[lang] : t().womenOnly)}</span></div><span class="frow-val">${v}</span></div>
      <button type="button" class="linkbtn" data-fx="${k}" aria-expanded="${open}" aria-controls="fx-${k}">${esc(open ? t().hideFormula(HRMAX[k].name) : t().showFormula(HRMAX[k].name))}${svg('chev', '#9A3412', 16)}</button>${box}`;
  }).join('');

  const opts = keys.map(k => `<option value="${k}" ${m1.base === k ? 'selected' : ''}>${esc(HRMAX[k].name)} · ${num(Math.round(vals[k]))} ${esc(t().bpm)}</option>`).join('')
    + (s.measOk ? `<option value="measured" ${m1.base === 'measured' ? 'selected' : ''}>${esc(t().measuredOpt(num(s.hrMeas)))}</option>` : '');

  const zoneCol = ['var(--z1)', 'var(--z2)', 'var(--z3)'];
  const zr = zones.map((z, i) => `<div class="zone" style="background:${zoneCol[i]}"><div class="zone-main"><span class="zone-name">${esc(t().zoneNames[z.key])}</span>
      <span class="zone-pct">${Math.round(z.lo * 100)}–${Math.round(z.hi * 100)}% HRR</span></div>
      <div><span class="zone-bpm">${num(z.bpmLo)}–${num(z.bpmHi)}</span> <span class="zone-unit">${esc(t().bpm)}</span></div></div>`).join('');

  const karv = m1.karvOpen ? `<div class="fbox" id="fx-karv">
      <span class="k">${esc(t().fFormula)}</span><span class="f">${lang === 'id' ? 'Target = (HRmax − HR istirahat) × % intensitas + HR istirahat' : 'Target = (HRmax − resting HR) × % intensity + resting HR'}</span>
      <span class="k">${esc(t().fWithData)}</span>
      ${zones.map(z => `<span class="r"><b>${esc(t().zoneNames[z.key])}:</b> ${num(hrr)} × ${num(z.lo, 2)} + ${num(s.hrRest)} = ${dec(karvonen(baseVal, s.hrRest, z.lo))} → ${num(z.bpmLo)}; ${num(hrr)} × ${num(z.hi, 2)} + ${num(s.hrRest)} = ${dec(karvonen(baseVal, s.hrRest, z.hi))} → ${num(z.bpmHi)}</span>`).join('')}
      <span class="k">${esc(t().fSource)}</span><span class="r">${esc(KARVONEN_REF.ref)}</span><span class="r">${esc(KARVONEN_REF.acsm)}</span></div>` : '';

  const today = new Date();
  const d = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  const zt = zones.map(z => `${z.bpmLo}–${z.bpmHi}`);
  const baseShort = m1.base === 'measured' ? t().measuredName : M1_FORMULAS[m1.base].short;
  const lines = [t().copyHeader(d), t().copyInput(m1.sex, num(s.age), num(s.hrRest)),
    m1.base === 'measured' ? t().copyRangeOnly(lo, hi) : t().copyRange(lo, hi, baseName, baseVal)];
  if (m1.base === 'measured') lines.push(t().copyMeasured(s.hrMeas));
  lines.push(t().copyZones(zt), t().copySrc(baseShort));
  m1._copy = lines.join('\n');

  return `<section class="card" aria-labelledby="h-est">
      <div class="lbl-row"><h2 class="h2" id="h-est">${esc(t().estHr)}</h2>${ibtn('hrmax', 'HRmax')}</div>
      <div class="big"><b>${num(lo)}–${num(hi)}</b><span>${esc(t().bpm)}</span></div>
      <span class="hint" style="margin-top:-8px">${esc(t().rangeNote(keys.length, m1.sex))}</span>
      <div>${rows}</div>
      <div class="note">${svg('alert', '#9A3412')}<span>${esc(t().accuracyWarn)}</span></div>
    </section>
    <section class="card" aria-labelledby="h-z" style="margin-top:14px">
      <div class="lbl-row"><h2 class="h2" id="h-z">${esc(t().zones)}</h2>${ibtn('karvonen', 'Karvonen')}</div>
      <label class="field"><span class="lbl">${esc(t().basis)}</span><select class="sel" id="base">${opts}</select></label>
      <span class="hint">${esc(t().karvLine(num(baseVal), num(s.hrRest), num(hrr)))}</span>
      <button type="button" class="linkbtn" data-karv aria-expanded="${m1.karvOpen}" aria-controls="fx-karv">${esc(m1.karvOpen ? t().hideKarv : t().showKarv)}${svg('chev', '#9A3412', 16)}</button>${karv}
      <div style="display:flex;flex-direction:column;gap:8px">${zr}</div>
      <span class="hint">${esc(t().zoneNote)}</span>
    </section>
    <section class="card" aria-labelledby="h-cp" style="margin-top:14px">
      <h2 class="h2" id="h-cp">${esc(t().copyPreview)}</h2>
      <div class="copybox" id="copyText">${esc(m1._copy)}</div>
      <button type="button" class="btn-primary" id="copyBtn">${svg('copy', '#1C1206', 20, 2.2)}<span id="copyLbl">${esc(t().copy)}</span></button>
      <span class="err" id="copyErr" hidden></span>
    </section>`;
}

function refreshM1(keepInputs = false) {
  const s = m1State();
  if (keepInputs) updateFieldMsgs(s); else document.getElementById('fields').innerHTML = m1Fields(s);
  document.getElementById('m1out').innerHTML = m1Out(s);
}

// ---------- Glosarium & Tentang ----------
function renderGloss() {
  const items = [...GLOSSARY].sort((a, b) => a[1].localeCompare(b[1]))
    .map(g => `<div class="gl" id="g-${g[0]}"><dt>${esc(g[1])}</dt><dd>${esc(lang === 'id' ? g[2] : g[3])}</dd></div>`).join('');
  app.innerHTML = `${pageHeader('', t().glossTitle, t().glossIntro)}<main class="main"><section class="card"><dl style="margin:0">${items}</dl></section></main>${nav('gloss')}`;
}
function renderAbout() {
  const items = ABOUT[lang].map(([h, p]) => `<div style="display:flex;flex-direction:column;gap:6px"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('');
  app.innerHTML = `${pageHeader('', t().aboutTitle, '')}<main class="main"><section class="card about">${items}
    ${installEvt ? `<button type="button" class="btn-primary" id="installBtn">${esc(t().install)}</button>` : ''}</section></main>${nav('about')}`;
}

// ---------- Router ----------
function route() {
  document.documentElement.lang = lang;
  const h = location.hash || '#/';
  const mm = h.match(/^#\/m\/(m\d+)$/);
  if (mm) {
    const i = MODULES.findIndex(m => m.id === mm[1]);
    if (i === 0) renderM1(); else if (i > 0) renderWip(MODULES[i], i + 1); else renderHome();
  } else if (h === '#/glosarium') renderGloss();
  else if (h === '#/tentang') renderAbout();
  else renderHome();
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

// ---------- Interaksi (delegasi) ----------
app.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'q') {
    query = el.value;
    renderHomeTiles(); return;
  }
  if (['age', 'hrRest', 'hrMeas'].includes(el.id)) {
    const clean = el.value.replace(/[^\d.,]/g, '').slice(0, 5);
    if (clean !== el.value) el.value = clean;
    m1[el.id] = clean;
    refreshM1(true);
  }
});
app.addEventListener('focusout', e => {
  const id = e.target.id;
  if (['age', 'hrRest', 'hrMeas'].includes(id) && !m1.touched.has(id)) { m1.touched.add(id); updateFieldMsgs(m1State()); }
});
app.addEventListener('change', e => {
  if (e.target.id === 'base') { m1.base = e.target.value; refreshM1(); document.getElementById('base')?.focus(); }
});
app.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.lang) {
    lang = b.dataset.lang;
    try { localStorage.setItem('sakusko-lang', lang); } catch (err) { /* abaikan */ }
    route(); return;
  }
  if (b.dataset.sex) { m1.sex = b.dataset.sex; refreshM1(); document.querySelector(`[data-sex="${m1.sex}"]`)?.focus(); return; }
  if (b.dataset.fx) { const k = b.dataset.fx; m1.open.has(k) ? m1.open.delete(k) : m1.open.add(k); refreshM1(); document.querySelector(`[data-fx="${k}"]`)?.focus(); return; }
  if ('karv' in b.dataset) { m1.karvOpen = !m1.karvOpen; refreshM1(); document.querySelector('[data-karv]')?.focus(); return; }
  if (b.dataset.def) { openDef(b.dataset.def); return; }
  if (b.id === 'copyBtn') { copyResult(); return; }
  if (b.id === 'installBtn' && installEvt) { installEvt.prompt(); installEvt = null; return; }
});

async function copyResult() {
  const lbl = document.getElementById('copyLbl'), errEl = document.getElementById('copyErr');
  let ok = false;
  try { await navigator.clipboard.writeText(m1._copy); ok = true; } catch (e) {
    const ta = document.createElement('textarea'); ta.value = m1._copy; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    ta.remove();
  }
  if (ok) { lbl.textContent = t().copied; setTimeout(() => { if (document.getElementById('copyLbl')) document.getElementById('copyLbl').textContent = t().copy; }, 2000); }
  else { errEl.hidden = false; errEl.innerHTML = `${svg('alert', '#B91C1C', 16)}<span>${esc(t().copyFail)}</span>`; }
}

// ---------- Definisi (ikon "i") ----------
const dlg = document.getElementById('defDialog');
let lastFocus = null;
function openDef(key) {
  const g = GLOSSARY.find(x => x[0] === key);
  if (!g) return;
  lastFocus = document.activeElement;
  document.getElementById('defTitle').textContent = g[1];
  document.getElementById('defText').textContent = lang === 'id' ? g[2] : g[3];
  document.getElementById('defClose').textContent = t().close;
  if (dlg.showModal) dlg.showModal(); else alert(`${g[1]}: ${lang === 'id' ? g[2] : g[3]}`);
}
document.getElementById('defClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => lastFocus?.focus());

// ---------- Mode tanpa sinyal ----------
function setOffline(v) { offline = v; const c = document.getElementById('offChip'); if (c) c.outerHTML = chip(); }
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => setOffline('none'));
  navigator.serviceWorker.ready.then(() => setOffline('ready'));
} else { offline = 'none'; }
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (location.hash === '#/tentang') renderAbout(); });

route();
