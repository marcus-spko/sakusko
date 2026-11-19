// SakuSKO — aplikasi utama. Tanpa server, tanpa penyimpanan data pasien.
import { HRMAX, HRMAX_ORDER, hrmax, hrmaxApplies, acsmZones, karvonen, LIMITS, rmEpley, rmBrzycki, NUZZO, round05 } from './formulas.js';
import { TESTS, REF, RM_INFO } from './tests.js';
import { MODULES, T, M1_FORMULAS, KARVONEN_REF, GLOSSARY, ABOUT } from './i18n.js';
import { S, load, save, clear, expireIfDue, expiresAt, isEmpty } from './session.js';

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
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
};
const svg = (name, color = 'currentColor', size = 20, sw = 2) =>
  `<svg aria-hidden="true" focusable="false" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

// ---------- Status ----------
let lang = 'id';
try { const s = localStorage.getItem('sakusko-lang'); if (s === 'id' || s === 'en') lang = s; } catch (e) { /* abaikan */ }
let offline = 'wait';           // 'wait' | 'ready' | 'none'
let installEvt = null;
let query = '';
// Data pemeriksaan ada di S (session.js); UI hanya status tampilan
const UI = { open: new Set(), karvOpen: false, touched: new Set(), measWasOk: undefined, copy: null, flash: '', clearArmed: false, mfx: new Set(), rmMeasWas: undefined };
const loaded = load();
if (loaded === 'expired') UI.flash = 'expired';

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
  const items = [['#/', 'grid', t().navCalc, 'calc'], ['#/ringkasan', 'list', t().navSum, 'sum'], ['#/glosarium', 'book', t().navGloss, 'gloss'], ['#/tentang', 'info', t().navAbout, 'about']];
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
    [m.title.id, m.title.en, m.cat.id, m.cat.en, m.kw || ''].some(s => s.toLowerCase().includes(q)));
  const tiles = list.map(m => `<a class="tile" href="#/m/${m.id}">
      <div class="tile-top"><span class="tile-ic">${svg(m.icon, '#C2410C')}</span>
      ${m.ready ? `<span class="tile-num">${String(m.n).padStart(2, '0')}</span>` : `<span class="soon">${esc(t().soon)}</span>`}</div>
      <div><div class="tile-title">${esc(m.title[lang])}</div><div class="tile-cat">${esc(m.cat[lang])}</div></div></a>`).join('');
  return tiles || `<p class="empty">${esc(t().noResult)}</p>`;
}
function renderHomeTiles() { const g = document.getElementById('tiles'); if (g) g.innerHTML = homeTiles(); }
function renderHome() {
  const flash = UI.flash ? `<div class="note" role="status">${svg('info', '#9A3412')}<span>${esc(UI.flash === 'expired' ? t().expiredMsg : t().clearedMsg)}</span></div>` : '';
  UI.flash = '';
  app.innerHTML = `${brandHeader()}<main class="main">${flash}${sessionCard()}
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
  const age = parse(S.base.age), hrRest = parse(S.m1.hrRest), hrMeas = parse(S.m1.hrMeas);
  const err = {};
  const inR = (v, [lo, hi]) => v >= lo && v <= hi;
  if (S.base.age !== '' && !inR(age, LIMITS.age)) err.age = t().errRange(...LIMITS.age);
  if (S.m1.hrRest !== '' && !inR(hrRest, LIMITS.hrRest)) err.hrRest = t().errRange(...LIMITS.hrRest);
  if (S.m1.hrMeas !== '') {
    if (!inR(hrMeas, LIMITS.hrMeasured)) err.hrMeas = t().errRange(...LIMITS.hrMeasured);
    else if (Number.isFinite(hrRest) && hrMeas <= hrRest) err.hrMeas = t().errMeasLow;
  }
  const w = parse(S.base.weight), h = parse(S.base.height);
  if (S.base.weight !== '' && !inR(w, LIMITS.weight)) err.weight = t().errRange(...LIMITS.weight);
  if (S.base.height !== '' && !inR(h, LIMITS.height)) err.height = t().errRange(...LIMITS.height);
  const shown = Object.fromEntries(Object.entries(err).filter(([k]) => UI.touched.has(k)));
  const ok = S.base.age !== '' && !err.age && !!S.base.sex;            // HRmax hanya butuh usia (+ jenis kelamin untuk Gulati)
  const restOk = ok && S.m1.hrRest !== '' && !err.hrRest;          // zona Karvonen butuh denyut istirahat
  const measOk = ok && S.m1.hrMeas !== '' && !err.hrMeas;
  return { age, hrRest, hrMeas, err: shown, allErr: err, ok, restOk, measOk };
}

function field(id, label, unit, value, { req = true, tag = '', hint = '', def = null, err = '', dec: isDec = false, key = '', mod = '' } = {}) {
  return `<div class="field ${err ? 'invalid' : ''}" id="f-${id}">
    <div class="lbl-row"><label class="lbl" for="${id}">${esc(label)}</label>${req ? '<span class="req" aria-hidden="true">*</span>' : `<span class="opt">${esc(tag || t().optional)}</span>`}${def ? ibtn(def, label) : ''}</div>
    <div class="inbox"><input id="${id}" name="${id}" type="text" inputmode="${isDec ? 'decimal' : 'numeric'}" autocomplete="off" enterkeyhint="next" ${key ? `data-key="${key}" data-mod="${mod}"` : ''} value="${esc(value)}" ${req ? 'aria-required="true"' : ''} ${err ? `aria-invalid="true" aria-describedby="e-${id}"` : ''}><span class="unit">${esc(unit)}</span></div>
    <div id="m-${id}" data-hint="${esc(hint)}">${msgHtml(id, err, hint)}</div></div>`;
}
function msgHtml(id, err, hint) {
  return err ? `<div class="err" id="e-${id}">${svg('alert', '#B91C1C', 16)}<span>${esc(err)}</span></div>` : hint ? `<span class="hint">${esc(hint)}</span>` : '';
}
// Perbarui pesan kesalahan tanpa mengganti kotak isian (keyboard HP tidak tertutup)
function updateFieldMsgs(s) {
  for (const fbox of document.querySelectorAll('.field[id^="f-"]')) {
    const id = fbox.id.slice(2);
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
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().storedNote)}</span></div>
    </section>
    <div id="m1out">${m1Out(s)}</div>
    <div class="foot"><span>${esc(t().m1Sources)}</span><span>${esc(t().meta)}</span></div>
  </main>${nav('calc')}`;
}

function m1Fields(s) {
  return `<div style="display:flex;flex-direction:column;gap:14px">
    ${field('age', t().age, t().years, S.base.age, { err: s.err.age })}
    ${sexField()}
    ${field('hrRest', t().hrRest, t().bpm, S.m1.hrRest, { req: false, tag: t().forZones, hint: t().hrRestHint, def: 'hrrest', err: s.err.hrRest })}
    ${field('hrMeas', t().hrMeas, t().bpm, S.m1.hrMeas, { req: false, hint: t().hrMeasHint, def: 'hrmeas', err: s.err.hrMeas })}</div>`;
}

const coef = key => num(HRMAX[key].b, 2).replace(/([.,]\d)0$/, '$1');
function formulaText(key) {
  const f = HRMAX[key];
  if (key === 'fox') return `HRmax = 220 − ${lang === 'id' ? 'usia' : 'age'}`;
  return `HRmax = ${f.a} − ${coef(key)} × ${lang === 'id' ? 'usia' : 'age'}`;
}

function m1Out(s) {
  if (!s.ok) UI.copy = null;
  if (!s.ok) return `<section class="card"><h2 class="h2">${esc(t().estHr)}</h2><p class="empty" style="margin:0">${esc(t().fillFirst)}</p></section>`;
  const keys = HRMAX_ORDER.filter(k => hrmaxApplies(k, S.base.sex));
  const vals = Object.fromEntries(HRMAX_ORDER.map(k => [k, hrmax(k, s.age)]));
  const rounded = keys.map(k => Math.round(vals[k]));
  const lo = Math.min(...rounded), hi = Math.max(...rounded);
  // dasar zona
  if (s.measOk && UI.measWasOk !== true) S.m1.basis = 'measured';
  if (!s.measOk && S.m1.basis === 'measured') S.m1.basis = 'tanaka';
  if (S.m1.basis !== 'measured' && !keys.includes(S.m1.basis)) S.m1.basis = 'tanaka';
  UI.measWasOk = s.measOk;
  const baseVal = S.m1.basis === 'measured' ? s.hrMeas : Math.round(vals[S.m1.basis]);
  const baseName = S.m1.basis === 'measured' ? t().measuredName : HRMAX[S.m1.basis].name;
  const zones = s.restOk ? acsmZones(baseVal, s.hrRest) : [];
  const hrr = s.restOk ? baseVal - s.hrRest : NaN;

  const rows = HRMAX_ORDER.map(k => {
    const on = hrmaxApplies(k, S.base.sex);
    const info = M1_FORMULAS[k];
    const open = UI.open.has(k);
    const v = on ? num(Math.round(vals[k])) : '—';
    const box = open ? `<div class="fbox" id="fx-${k}">
        <span class="k">${esc(t().fFormula)}</span><span class="f">${esc(formulaText(k))}</span>
        ${on ? `<span class="k">${esc(t().fWithData)}</span><span class="s">${k === 'fox' ? `220 − ${num(s.age)}` : `${HRMAX[k].a} − ${esc(coef(k))} × ${num(s.age)}`} = ${esc(dec(vals[k]))}</span>` : ''}
        <span class="k">${esc(t().fPop)}</span><span class="r">${esc(info.pop[lang])}</span>
        ${info.ref ? `<span class="k">${esc(t().fSource)}</span><span class="r">${esc(info.ref)} <a href="https://doi.org/${info.doi}" target="_blank" rel="noopener">doi:${info.doi}</a></span><span class="hint">${esc(t().doiNote)}</span>` : ''}
      </div>` : '';
    return `<div class="frow ${on ? '' : 'off'}"><div class="frow-main"><div class="frow-name">${esc(HRMAX[k].name)}${S.m1.basis === k ? `<span class="badge">${esc(t().base)}</span>` : ''}</div>
        <span class="hint">${esc(on ? info.pop[lang] : t().womenOnly)}</span></div><span class="frow-val">${v}</span></div>
      <button type="button" class="linkbtn" data-fx="${k}" aria-expanded="${open}" aria-controls="fx-${k}">${esc(open ? t().hideFormula(HRMAX[k].name) : t().showFormula(HRMAX[k].name))}${svg('chev', '#9A3412', 16)}</button>${box}`;
  }).join('');

  const opts = keys.map(k => `<option value="${k}" ${S.m1.basis === k ? 'selected' : ''}>${esc(HRMAX[k].name)} · ${num(Math.round(vals[k]))} ${esc(t().bpm)}</option>`).join('')
    + (s.measOk ? `<option value="measured" ${S.m1.basis === 'measured' ? 'selected' : ''}>${esc(t().measuredOpt(num(s.hrMeas)))}</option>` : '');

  const zoneCol = ['var(--z1)', 'var(--z2)', 'var(--z3)'];
  const zr = zones.map((z, i) => `<div class="zone" style="background:${zoneCol[i]}"><div class="zone-main"><span class="zone-name">${esc(t().zoneNames[z.key])}</span>
      <span class="zone-pct">${Math.round(z.lo * 100)}–${Math.round(z.hi * 100)}% HRR</span></div>
      <div><span class="zone-bpm">${num(z.bpmLo)}–${num(z.bpmHi)}</span> <span class="zone-unit">${esc(t().bpm)}</span></div></div>`).join('');

  const karv = UI.karvOpen ? `<div class="fbox" id="fx-karv">
      <span class="k">${esc(t().fFormula)}</span><span class="f">${lang === 'id' ? 'Target = (HRmax − HR istirahat) × % intensitas + HR istirahat' : 'Target = (HRmax − resting HR) × % intensity + resting HR'}</span>
      <span class="k">${esc(t().fWithData)}</span>
      ${zones.map(z => `<span class="r"><b>${esc(t().zoneNames[z.key])}:</b> ${num(hrr)} × ${num(z.lo, 2)} + ${num(s.hrRest)} = ${dec(karvonen(baseVal, s.hrRest, z.lo))} → ${num(z.bpmLo)}; ${num(hrr)} × ${num(z.hi, 2)} + ${num(s.hrRest)} = ${dec(karvonen(baseVal, s.hrRest, z.hi))} → ${num(z.bpmHi)}</span>`).join('')}
      <span class="k">${esc(t().fSource)}</span><span class="r">${esc(KARVONEN_REF.ref)}</span><span class="r">${esc(KARVONEN_REF.acsm)}</span></div>` : '';

  const today = new Date();
  const d = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  const zt = zones.map(z => `${z.bpmLo}–${z.bpmHi}`);
  const baseShort = S.m1.basis === 'measured' ? t().measuredName : M1_FORMULAS[S.m1.basis].short;
  const lines = [t().copyHeader(d), t().copyInput(S.base.sex, num(s.age), s.restOk ? num(s.hrRest) : '')];
  if (s.restOk) {
    lines.push(S.m1.basis === 'measured' ? t().copyRangeOnly(lo, hi) : t().copyRange(lo, hi, baseName, baseVal));
    if (S.m1.basis === 'measured') lines.push(t().copyMeasured(s.hrMeas));
    lines.push(t().copyZones(zt), t().copySrc(baseShort));
  } else {
    lines.push(t().copyRangeNoZone(lo, hi));
    if (s.measOk) lines.push(t().copyMeasuredPlain(s.hrMeas));
    lines.push(t().copySrcNoZone(keys.map(k => M1_FORMULAS[k].short).filter(x => !x.startsWith('Fox')).join('; ')));
  }
  UI.copy = lines.join('\n');

  return `<section class="card" aria-labelledby="h-est">
      <div class="lbl-row"><h2 class="h2" id="h-est">${esc(t().estHr)}</h2>${ibtn('hrmax', 'HRmax')}</div>
      <div class="big"><b>${num(lo)}–${num(hi)}</b><span>${esc(t().bpm)}</span></div>
      <span class="hint" style="margin-top:-8px">${esc(t().rangeNote(keys.length, S.base.sex))}</span>
      <div>${rows}</div>
      <div class="note">${svg('alert', '#9A3412')}<span>${esc(t().accuracyWarn)}</span></div>
    </section>
    <section class="card" aria-labelledby="h-z" style="margin-top:14px">
      <div class="lbl-row"><h2 class="h2" id="h-z">${esc(t().zones)}</h2>${ibtn('karvonen', 'Karvonen')}</div>
      <label class="field"><span class="lbl">${esc(t().basis)}</span><select class="sel" id="base">${opts}</select></label>
      ${s.restOk ? `<span class="hint">${esc(t().karvLine(num(baseVal), num(s.hrRest), num(hrr)))}</span>
      <button type="button" class="linkbtn" data-karv aria-expanded="${UI.karvOpen}" aria-controls="fx-karv">${esc(UI.karvOpen ? t().hideKarv : t().showKarv)}${svg('chev', '#9A3412', 16)}</button>${karv}
      <div style="display:flex;flex-direction:column;gap:8px">${zr}</div>
      <span class="hint">${esc(t().zoneNote)}</span>` : `<div class="note">${svg('info', '#9A3412')}<span>${esc(t().needRest)}</span></div>`}
    </section>
    <section class="card" aria-labelledby="h-cp" style="margin-top:14px">
      <h2 class="h2" id="h-cp">${esc(t().copyPreview)}</h2>
      <div class="copybox" id="copyText">${esc(UI.copy)}</div>
      <button type="button" class="btn-primary" id="copyBtn">${svg('copy', '#1C1206', 20, 2.2)}<span id="copyLbl">${esc(t().copy)}</span></button>
      <span class="err" id="copyErr" hidden></span>
    </section>`;
}

function refreshM1(keepInputs = false) {
  const s = m1State();
  if (keepInputs) updateFieldMsgs(s); else document.getElementById('fields').innerHTML = m1Fields(s);
  document.getElementById('m1out').innerHTML = m1Out(s);
}


// ---------- Modul 2 & 3: tes berbasis data (lihat tests.js) ----------
const MODNUM = { m2: '02', m3: '03' };
const DEFKEY = { ymca: 'steptest', harvard: 'fi', yoyo: 'yoyo', ift: 'vift', smwt: 'smwt', grip: 'grip', sts: 'sts' };
const ctx = () => ({ L: lang, f0: x => num(x, 0), f1: x => num(x, 1), f2: x => num(x, 2), u: lang === 'id' ? 'mL/kg/mnt' : 'mL/kg/min' });
const fid = (mod, tid, k) => `t-${mod}-${tid}-${k}`;
const curTest = mod => TESTS[mod].find(x => x.id === S[mod].test) || TESTS[mod][0];
const baseVals = () => ({ age: parse(S.base.age), sex: S.base.sex, weight: parse(S.base.weight), height: parse(S.base.height) });

// Nilai, kesalahan, dan hasil satu tes (tanpa menyentuh layar; dipakai juga oleh Ringkasan)
function evalTest(mod, test) {
  const baseErr = m1State().allErr;
  const v = {}, err = {};
  let fieldsOk = true;
  for (const f of test.fields) {
    const raw = S[mod].v[`${test.id}.${f.k}`] ?? '';
    const x = parse(raw);
    v[f.k] = NaN;
    if (raw !== '') {
      if (!(x >= f.lim[0] && x <= f.lim[1]) || (f.int && !Number.isInteger(x))) err[fid(mod, test.id, f.k)] = f.int ? t().errInt(...f.lim) : t().errRange(...f.lim);
      else v[f.k] = x;
    }
    if (f.req && !Number.isFinite(v[f.k])) fieldsOk = false;
  }
  const missing = test.needs.filter(k => (k === 'sex' ? !S.base.sex : S.base[k] === '' || !!baseErr[k]));
  const b = baseVals();
  let res = null;
  if (test.special === 'rm') res = rmCalc(v);
  else if (fieldsOk && !missing.length) res = test.calc(v, b, ctx());
  // usia di luar populasi asal: tetap dihitung, diberi catatan (juga di teks salin)
  const outAge = !!(res && test.ageRange && S.base.age !== '' && !baseErr.age && (b.age < test.ageRange[0] || b.age > test.ageRange[1]));
  if (outAge && res.copy) res.copy += t().copyOutAge;
  return { v, err, missing, res, fieldsOk, outAge };
}

function modState(mod) {
  const test = curTest(mod), e = evalTest(mod, test), base = m1State();
  const err = { ...e.err };
  for (const k of ['age', 'weight', 'height']) if (base.allErr[k]) err[k] = base.allErr[k];
  const shown = Object.fromEntries(Object.entries(err).filter(([k]) => UI.touched.has(k)));
  return { ...e, test, err: shown };
}

function renderMod(mod) {
  const i = MODULES.findIndex(m => m.id === mod), M = MODULES[i], s = modState(mod);
  const opts = TESTS[mod].map(x => `<option value="${x.id}" ${x.id === s.test.id ? 'selected' : ''}>${esc(x.name[lang])}</option>`).join('');
  app.innerHTML = `${pageHeader(t().moduleLabel(MODNUM[mod], M.cat[lang]), M.title[lang], t()[`${mod}Sub`])}
  <main class="main">
    <div class="note">${svg('body', '#9A3412')}<span>${esc(t()[`${mod}Pop`])}</span></div>
    <section class="card" aria-labelledby="h-test">
      <label class="field"><span class="lbl" id="h-test">${esc(t().chooseTest)}</span><select class="sel" id="testSel">${opts}</select></label>
      <div class="fbox" style="margin:0"><span class="k">${esc(t().protocol.toUpperCase())}</span><span class="r" id="protoTxt">${esc(s.test.protocol[lang])}</span></div>
    </section>
    <section class="card" aria-labelledby="h-in">
      <div class="row-between"><h2 class="h2" id="h-in">${esc(t().dataIn)}</h2><span class="muted"><span class="req">*</span> ${esc(t().required)}</span></div>
      <div id="fields">${modFields(mod, s)}</div>
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().storedNote)}</span></div>
    </section>
    <div id="modout">${modOut(mod, s)}</div>
    <div class="foot"><span>${esc(t()[`${mod}Sources`])}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('calc')}`;
}

function modFields(mod, s) {
  const test = s.test, out = [];
  for (const k of test.needs) {
    if (k === 'age') out.push(field('age', t().age, t().years, S.base.age, { err: s.err.age }));
    if (k === 'sex') out.push(sexField());
    if (k === 'weight') out.push(field('weight', t().weight, 'kg', S.base.weight, { err: s.err.weight, dec: true }));
    if (k === 'height') out.push(field('height', t().height, 'cm', S.base.height, { err: s.err.height, dec: true }));
  }
  for (const f of test.fields) {
    const id = fid(mod, test.id, f.k);
    out.push(field(id, f.label[lang], f.unit[lang], S[mod].v[`${test.id}.${f.k}`] ?? '', {
      req: f.req, tag: f.tag ? f.tag[lang] : '', hint: f.hint ? f.hint[lang] : '', err: s.err[id], dec: !!f.dec, key: `${test.id}.${f.k}`, mod,
    }));
  }
  return `<div style="display:flex;flex-direction:column;gap:14px">${out.join('')}</div>`;
}

const refHtml = keys => keys.map(k => `<span class="r">${esc(REF[k].ref)}${REF[k].doi ? ` <a href="https://doi.org/${REF[k].doi}" target="_blank" rel="noopener">doi:${REF[k].doi}</a>` : ''}</span>`).join('');
function fxBox(id, f, sLines, pop, refs) {
  return `<div class="fbox" id="mfx-${id}">
    <span class="k">${esc(t().fFormula)}</span>${f.map(x => `<span class="f" style="font-size:14px">${esc(x)}</span>`).join('')}
    ${sLines.length ? `<span class="k">${esc(t().fWithData)}</span>${sLines.map(x => `<span class="s" style="font-size:14px">${esc(x)}</span>`).join('')}` : ''}
    <span class="k">${esc(t().fPop)}</span><span class="r">${esc(pop)}</span>
    ${refs.length ? `<span class="k">${esc(t().fSource)}</span>${refHtml(refs)}<span class="hint">${esc(t().doiNote)}</span>` : ''}</div>`;
}
const fxBtn = id => `<button type="button" class="linkbtn" data-mfx="${id}" aria-expanded="${UI.mfx.has(id)}" aria-controls="mfx-${id}">${esc(UI.mfx.has(id) ? t().hideF : t().showF)}${svg('chev', '#9A3412', 16)}</button>`;
const kvRow = (k, v) => `<div class="frow"><div class="frow-main"><div class="frow-name" style="font-weight:600;font-size:14px">${esc(k)}</div></div><span class="frow-val" style="font-size:17px">${esc(v)}</span></div>`;

function modOut(mod, s) {
  const test = s.test;
  if (test.special === 'rm') return rmOut(s);
  const head = r => (r && r.mainLabel) || (test.noVo2 ? t().result : t().vo2Est);
  let body;
  if (s.missing.length) body = `<p class="empty" style="margin:0">${esc(t().needBase(s.missing.map(k => t().baseNames[k]).join(', ')))}</p>`;
  else if (!s.res) body = `<p class="empty" style="margin:0">${esc(t().fillTest)}</p>`;
  else {
    const r = s.res, d = r.d ?? 1, unit = r.unit ?? ctx().u;
    body = `<div class="big"><b>${num(r.val, d)}</b><span>${esc(unit)}</span></div>
      ${(r.rows || []).map(([k, v]) => kvRow(k, v)).join('')}
      ${r.flag ? `<div class="note">${svg(r.flag.level === 'warn' ? 'alert' : 'info', '#9A3412')}<span>${esc(r.flag.text)}</span></div>` : ''}
      ${s.outAge ? `<div class="note">${svg('alert', '#9A3412')}<span>${esc(t().outAge(test.ageRange[0], test.ageRange[1]))}${test.ageNote ? ` ${esc(test.ageNote[lang])}` : ''}</span></div>` : ''}
      <span class="hint">${esc(t().popLbl)}: ${esc(test.pop[lang])}</span>
      ${fxBtn(test.id)}${UI.mfx.has(test.id) ? fxBox(test.id, r.f, r.s, test.pop[lang], test.refs) : ''}`;
  }
  const def = DEFKEY[test.id] || 'vo2max';
  const copy = modCopy(mod);
  return `<section class="card" aria-labelledby="h-res">
      <div class="lbl-row"><h2 class="h2" id="h-res">${esc(head(s.res))}</h2>${ibtn(def, head(s.res))}</div>
      ${body}
      ${test.caveat ? `<div class="note">${svg('alert', '#9A3412')}<span>${esc(test.caveat[lang])}</span></div>` : ''}
    </section>${copyCard(copy)}`;
}

function copyCard(copy) {
  UI.copy = copy ? copy.text : null;
  if (!copy) return '';
  return `<section class="card" aria-labelledby="h-cp" style="margin-top:14px">
      <h2 class="h2" id="h-cp">${esc(t().copyPreview)}</h2>
      <div class="copybox" id="copyText">${esc(copy.text)}</div>
      <button type="button" class="btn-primary" id="copyBtn">${svg('copy', '#1C1206', 20, 2.2)}<span id="copyLbl">${esc(t().copy)}</span></button>
      <span class="err" id="copyErr" hidden></span></section>`;
}

// Teks salin satu modul: semua tes yang sudah lengkap (bukan hanya tes yang sedang dibuka)
function modCopy(mod) {
  const lines = [], shorts = [];
  for (const test of TESTS[mod]) {
    const e = evalTest(mod, test);
    if (!e.res) continue;
    if (test.special === 'rm') { const l = rmCopyLines(e.res); if (!l.length) continue; lines.push(...l); }
    else lines.push(e.res.copy);
    shorts.push(test.short);
  }
  if (!lines.length) return null;
  const body = [...lines, t().srcLine([...new Set(shorts.join('; ').split('; '))].join('; '))];
  const M = MODULES.find(m => m.id === mod);
  const bs = baseSummary();
  const text = [t().copyHeaderMod(Number(MODNUM[mod]), M.title[lang], todayStr()), ...(bs ? [`${t().baseLabel}: ${bs}`] : []), ...body].join('\n');
  return { text, body };
}

// ----- 1RM & tabel beban -----
function rmCalc(v) {
  const estOk = Number.isFinite(v.load) && Number.isFinite(v.reps);
  const r = { estOk, load: v.load, reps: v.reps, meas: v.meas, measOk: Number.isFinite(v.meas) };
  if (estOk) { r.epley = rmEpley(v.load, v.reps); r.brzycki = rmBrzycki(v.load, v.reps); }
  if (!estOk && !r.measOk) return null;
  return r;
}
function rmCopyLines(r) {
  const l = [];
  if (r.estOk) l.push(t().copyRm(num(r.load, 1).replace(/[.,]0$/, ''), num(r.reps), num(r.epley, 1), num(r.brzycki, 1)));
  if (r.measOk) l.push(t().copyRmMeas(num(r.meas, 1).replace(/[.,]0$/, '')));
  return l;
}
function rmOut(s) {
  const test = s.test, r = s.res;
  // dasar tabel: 1RM terukur otomatis dipakai saat baru diisi (seperti HRmax terukur di Modul 1)
  if (r && r.measOk && UI.rmMeasWas !== true) S.m3.basis = 'meas';
  if (S.m3.basis === 'meas' && !(r && r.measOk)) S.m3.basis = 'brzycki';
  if (r && !r.estOk && r.measOk) S.m3.basis = 'meas';
  UI.rmMeasWas = !!(r && r.measOk);
  const est = !r || !r.estOk ? `<p class="empty" style="margin:0">${esc(t().rmNeedEst)}</p>`
    : `${kvRow('Epley', `${num(r.epley, 1)} kg`)}${kvRow('Brzycki', `${num(r.brzycki, 1)} kg`)}
       <span class="hint">${esc(t().popLbl)}: ${esc(test.pop[lang])}</span>
       ${fxBtn('rm')}${UI.mfx.has('rm') ? fxBox('rm', [RM_INFO.epleyF, RM_INFO.brzyckiF],
        [`${num(r.load, 1)} × (1 + ${num(r.reps)}/30) = ${num(r.epley, 1)}`, `${num(r.load, 1)} × 36 / (37 − ${num(r.reps)}) = ${num(r.brzycki, 1)}`], test.pop[lang], test.refs) : ''}`;
  let table = `<p class="empty" style="margin:0">${esc(t().rmNeed)}</p>`;
  if (r) {
    const basisVal = S.m3.basis === 'meas' ? r.meas : S.m3.basis === 'epley' ? r.epley : r.brzycki;
    const bopts = [...(r.estOk ? [['brzycki', `Brzycki · ${num(r.brzycki, 1)} kg`], ['epley', `Epley · ${num(r.epley, 1)} kg`]] : []),
      ...(r.measOk ? [['meas', `${t().measured1rm} · ${num(r.meas, 1)} kg`]] : [])]
      .map(([k, l]) => `<option value="${k}" ${S.m3.basis === k ? 'selected' : ''}>${esc(l)}</option>`).join('');
    const ex = NUZZO[S.m3.ex] ? S.m3.ex : 'general';
    const rows = NUZZO[ex].map(([p, m, sd]) => `<tr><td>${p}%</td><td><b>${num(round05(basisVal * p / 100), 1)}</b> kg</td><td>${num(m, 1)} ± ${num(sd, 1)}</td></tr>`).join('');
    table = `<label class="field"><span class="lbl">${esc(t().rmBasis)}</span><select class="sel" id="rmBasis">${bopts}</select></label>
      <div class="field"><span class="lbl" id="exLbl">${esc(t().exLbl)}</span>
        <div class="seg" role="group" aria-labelledby="exLbl">${['general', 'bench', 'leg'].map(k => `<button type="button" data-ex="${k}" aria-pressed="${ex === k}">${esc(t().ex[k])}</button>`).join('')}</div></div>
      <table class="tbl"><thead><tr><th scope="col">${esc(t().colPct)}</th><th scope="col">${esc(t().colLoad)}</th><th scope="col">${esc(t().colReps)}</th></tr></thead><tbody>${rows}</tbody></table>
      <span class="hint">${esc(t().roundNote)} ${esc(RM_INFO.nuzzoNote[lang])}</span>
      <div class="note">${svg('info', '#9A3412')}<span>${esc(RM_INFO.acsm[lang])}</span></div>
      ${fxBtn('nz')}${UI.mfx.has('nz') ? `<div class="fbox" id="mfx-nz"><span class="k">${esc(t().fFormula)}</span><span class="f" style="font-size:14px">${lang === 'id' ? 'Beban = 1RM × %1RM' : 'Load = 1RM × %1RM'}</span><span class="k">${esc(t().fSource)}</span>${refHtml(['nuzzo', 'currier'])}<span class="hint">${esc(t().doiNote)}</span></div>` : ''}`;
  }
  return `<section class="card" aria-labelledby="h-rm"><div class="lbl-row"><h2 class="h2" id="h-rm">${esc(t().rmEst)}</h2>${ibtn('1RM', '1RM')}</div>${est}
      ${test.caveat ? `<div class="note">${svg('alert', '#9A3412')}<span>${esc(test.caveat[lang])}</span></div>` : ''}</section>
    <section class="card" aria-labelledby="h-tb" style="margin-top:14px"><div class="lbl-row"><h2 class="h2" id="h-tb">${esc(t().rmTable)}</h2>${ibtn('pct1rm', '%1RM')}</div>${table}</section>
    ${copyCard(modCopy('m3'))}`;
}

function refreshMod(mod, keepInputs = false) {
  const s = modState(mod);
  if (keepInputs) updateFieldMsgs(s); else document.getElementById('fields').innerHTML = modFields(mod, s);
  document.getElementById('modout').innerHTML = modOut(mod, s);
}

// Kolom isian → tempat datanya di sesi
const FIELD_STORE = { age: () => S.base, weight: () => S.base, height: () => S.base, hrRest: () => S.m1, hrMeas: () => S.m1 };
function refreshCurrent(keepInputs = false) {
  const h = location.hash;
  if (h === '#/data') { if (keepInputs) updateFieldMsgs(m1State()); else document.getElementById('fields').innerHTML = baseFields(m1State()); }
  else if (/^#\/m\/m1$/.test(h)) refreshM1(keepInputs);
  else { const mm = h.match(/^#\/m\/(m2|m3)$/); if (mm) refreshMod(mm[1], keepInputs); }
}
function currentState() { const mm = location.hash.match(/^#\/m\/(m2|m3)$/); return mm ? modState(mm[1]) : m1State(); }

// ---------- Sesi: data dasar & ringkasan ----------
const hhmm = ts => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`; };
function baseSummary() {
  const b = S.base, parts = [];
  if (b.sex) parts.push(b.sex === 'F' ? t().female : t().male);
  if (b.age) parts.push(`${b.age} ${t().yearsShort}`);
  if (b.weight) parts.push(`${b.weight} kg`);
  if (b.height) parts.push(`${b.height} cm`);
  return parts.join(' · ');
}
function clearBtn() {
  return `<button type="button" class="btn-sec ${UI.clearArmed ? 'armed' : ''}" data-clear>${svg('trash', UI.clearArmed ? '#B91C1C' : '#9A3412', 18)}<span>${esc(UI.clearArmed ? t().clearConfirm : t().clearData)}</span></button>`;
}
function sessionCard() {
  const empty = isEmpty();
  return `<section class="card" aria-labelledby="h-sess" style="gap:10px">
    <div class="row-between"><h2 class="h2" id="h-sess">${esc(t().sessTitle)}</h2><a class="linkbtn" href="#/data">${esc(empty ? t().sessFill : t().sessEdit)}</a></div>
    ${empty ? `<span class="hint">${esc(t().sessEmpty)}</span>` : `<span class="sess-sum">${esc(baseSummary() || '—')}</span>
      <span class="hint">${esc(t().expiresNote(hhmm(expiresAt())))}</span>${clearBtn()}`}
  </section>`;
}
function renderBase() {
  const s = m1State();
  app.innerHTML = `${pageHeader('', t().baseTitle, t().baseSub)}
  <main class="main">
    <section class="card" aria-labelledby="h-base">
      <div class="row-between"><h2 class="h2" id="h-base">${esc(t().dataIn)}</h2><span class="muted"><span class="req">*</span> ${esc(t().required)}</span></div>
      <div id="fields">${baseFields(s)}</div>
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().storedNote)}</span></div>
      <div class="note">${svg('alert', '#9A3412')}<span>${esc(t().noName)}</span></div>
      ${isEmpty() ? '' : clearBtn()}
    </section>
  </main>${nav('calc')}`;
}
function baseFields(s) {
  return `<div style="display:flex;flex-direction:column;gap:14px">
    ${field('age', t().age, t().years, S.base.age, { err: s.err.age })}
    ${sexField()}
    ${field('weight', t().weight, 'kg', S.base.weight, { req: false, tag: t().forOthers, err: s.err.weight, dec: true })}
    ${field('height', t().height, 'cm', S.base.height, { req: false, tag: t().forOthers, err: s.err.height, dec: true })}</div>`;
}
function sexField() {
  return `<div class="field"><div class="lbl-row"><span class="lbl" id="sexLbl">${esc(t().sex)}</span><span class="req" aria-hidden="true">*</span></div>
      <div class="seg" role="group" aria-labelledby="sexLbl">
        <button type="button" data-sex="M" aria-pressed="${S.base.sex === 'M'}">${esc(t().male)}</button>
        <button type="button" data-sex="F" aria-pressed="${S.base.sex === 'F'}">${esc(t().female)}</button></div></div>`;
}
// Hasil tiap modul untuk ringkasan (null bila belum lengkap)
function moduleCopies() {
  const out = [];
  m1Out(m1State());
  if (UI.copy) out.push({ id: 'm1', title: MODULES[0].title[lang], text: UI.copy, body: UI.copy.split('\n').slice(1) });
  for (const mod of ['m2', 'm3']) {
    const c = modCopy(mod);
    if (c) out.push({ id: mod, title: MODULES.find(m => m.id === mod).title[lang], text: c.text, body: c.body });
  }
  return out;
}
function todayStr() { const d = new Date(); return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`; }
function summaryText(mods) {
  const lines = [t().sumHeader(todayStr())];
  const bs = baseSummary();
  if (bs) lines.push(`${t().baseLabel}: ${bs}`);
  for (const m of mods) { lines.push('', `[${m.title}]`, ...m.body); }
  lines.push('', t().sumNote);
  return lines.join('\n');
}
function renderSummary() {
  const mods = moduleCopies();
  UI.sumAll = summaryText(mods);
  UI.sumMods = Object.fromEntries(mods.map(m => [m.id, m.text]));
  const cards = mods.map(m => `<section class="card" aria-labelledby="h-s-${m.id}">
      <div class="row-between"><h2 class="h2" id="h-s-${m.id}">${esc(m.title)}</h2><a class="linkbtn" href="#/m/${m.id}">${esc(t().open)}</a></div>
      <div class="copybox">${esc(m.text)}</div>
      <button type="button" class="btn-sec" data-copy="${m.id}">${svg('copy', '#9A3412', 18)}<span>${esc(t().copyOne)}</span></button>
    </section>`).join('');
  app.innerHTML = `${pageHeader('', t().sumTitle, t().sumSub)}
  <main class="main">
    ${sessionCard()}
    ${mods.length ? `${cards}
      <section class="card" aria-labelledby="h-all"><h2 class="h2" id="h-all">${esc(t().sumAllTitle)}</h2>
        <div class="copybox">${esc(UI.sumAll)}</div>
        <button type="button" class="btn-primary" data-copy="all">${svg('copy', '#1C1206', 20, 2.2)}<span>${esc(t().copyAll)}</span></button>
        <span class="hint">${esc(t().sumNote)}</span></section>`
      : `<div class="note">${svg('info', '#9A3412')}<span>${esc(t().sumEmpty)}</span></div>`}
  </main>${nav('sum')}`;
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
    if (i === 0) renderM1(); else if (mm[1] === 'm2' || mm[1] === 'm3') renderMod(mm[1]); else if (i > 0) renderWip(MODULES[i], i + 1); else renderHome();
  } else if (h === '#/data') renderBase();
  else if (h === '#/ringkasan') renderSummary();
  else if (h === '#/glosarium') renderGloss();
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
  if (el.dataset.key && S[el.dataset.mod]) {
    const clean = el.value.replace(/[^\d.,]/g, '').slice(0, 6);
    if (clean !== el.value) el.value = clean;
    S[el.dataset.mod].v[el.dataset.key] = clean;
    save(); UI.clearArmed = false;
    refreshCurrent(true); return;
  }
  if (FIELD_STORE[el.id]) {
    const clean = el.value.replace(/[^\d.,]/g, '').slice(0, 5);
    if (clean !== el.value) el.value = clean;
    FIELD_STORE[el.id]()[el.id] = clean;
    save(); UI.clearArmed = false;
    refreshCurrent(true);
  }
});
app.addEventListener('focusout', e => {
  const id = e.target.id;
  if ((FIELD_STORE[id] || e.target.dataset.key) && !UI.touched.has(id)) { UI.touched.add(id); updateFieldMsgs(currentState()); }
});
app.addEventListener('change', e => {
  if (e.target.id === 'testSel') {
    const mod = location.hash.match(/^#\/m\/(m2|m3)$/)?.[1]; if (!mod) return;
    S[mod].test = e.target.value; save(); renderMod(mod); document.getElementById('testSel')?.focus(); return;
  }
  if (e.target.id === 'rmBasis') { S.m3.basis = e.target.value; save(); refreshMod('m3'); document.getElementById('rmBasis')?.focus(); return; }
  if (e.target.id === 'base') { S.m1.basis = e.target.value; save(); refreshM1(); document.getElementById('base')?.focus(); }
});
app.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.lang) {
    lang = b.dataset.lang;
    try { localStorage.setItem('sakusko-lang', lang); } catch (err) { /* abaikan */ }
    route(); return;
  }
  if (b.dataset.sex) { S.base.sex = b.dataset.sex; save(); UI.clearArmed = false; refreshCurrent(); document.querySelector(`[data-sex="${S.base.sex}"]`)?.focus(); return; }
  if (b.dataset.fx) { const k = b.dataset.fx; UI.open.has(k) ? UI.open.delete(k) : UI.open.add(k); refreshM1(); document.querySelector(`[data-fx="${k}"]`)?.focus(); return; }
  if (b.dataset.mfx) { const k = b.dataset.mfx, mod = location.hash.slice(4); UI.mfx.has(k) ? UI.mfx.delete(k) : UI.mfx.add(k); refreshMod(mod); document.querySelector(`[data-mfx="${k}"]`)?.focus(); return; }
  if (b.dataset.ex) { S.m3.ex = b.dataset.ex; save(); refreshMod('m3'); document.querySelector(`[data-ex="${b.dataset.ex}"]`)?.focus(); return; }
  if ('karv' in b.dataset) { UI.karvOpen = !UI.karvOpen; refreshM1(); document.querySelector('[data-karv]')?.focus(); return; }
  if (b.dataset.def) { openDef(b.dataset.def); return; }
  if (b.id === 'copyBtn') { copyText(UI.copy, b); return; }
  if (b.dataset.copy) { copyText(b.dataset.copy === 'all' ? UI.sumAll : UI.sumMods?.[b.dataset.copy], b); return; }
  if ('clear' in b.dataset) {
    if (!UI.clearArmed) { UI.clearArmed = true; route(); setTimeout(() => { if (UI.clearArmed) { UI.clearArmed = false; route(); } }, 4000); return; }
    UI.clearArmed = false; clear(); UI.touched.clear(); UI.open.clear(); UI.mfx.clear(); UI.karvOpen = false; UI.measWasOk = undefined; UI.rmMeasWas = undefined;
    UI.flash = 'cleared'; goHome(); return;
  }
  if (b.id === 'installBtn' && installEvt) { installEvt.prompt(); installEvt = null; return; }
});

async function copyText(text, btn) {
  if (!text) return;
  const lbl = btn.querySelector('span');
  const orig = lbl ? lbl.textContent : '';
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    ta.remove();
  }
  if (lbl) { lbl.textContent = ok ? t().copied : t().copyFailShort; setTimeout(() => { if (lbl.isConnected) lbl.textContent = orig; }, 2000); }
  if (!ok) { const errEl = document.getElementById('copyErr'); if (errEl) { errEl.hidden = false; errEl.innerHTML = `${svg('alert', '#B91C1C', 16)}<span>${esc(t().copyFail)}</span>`; } }
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

// ---------- Hapus otomatis ----------
function goHome() { if (location.hash && location.hash !== '#/') location.hash = '#/'; else route(); }
function checkExpiry() { if (expireIfDue()) { UI.flash = 'expired'; UI.touched.clear(); UI.open.clear(); goHome(); } }
setInterval(checkExpiry, 30000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkExpiry(); });

// ---------- Mode tanpa sinyal ----------
function setOffline(v) { offline = v; const c = document.getElementById('offChip'); if (c) c.outerHTML = chip(); }
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => setOffline('none'));
  navigator.serviceWorker.ready.then(() => setOffline('ready'));
} else { offline = 'none'; }
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (location.hash === '#/tentang') renderAbout(); });

route();
