// SakuSKO — aplikasi utama. Tanpa server, tanpa penyimpanan data pasien.
import { HRMAX, HRMAX_ORDER, hrmax, hrmaxApplies, acsmZones, karvonen, LIMITS, rmEpley, rmBrzycki, NUZZO, round05,
  rmrTenHaaf, rmrTenHaafFfm, rmrMifflin, rmrHarrisRev, rmrCunningham, energyAvail, CHO, PROTEIN, FAT_PCT, PAL_BANDS,
  bmi, bmiCat, centralObese, whtr, whr, whrHigh,
  siri, jp3Men, jpw3Women, dwRow, dwDensity, hastutiS4, hastutiAbd, ffmFrom, targetWeight, endomorphy, mesomorphy, hwr, ectomorphy, somatoXY,
  sweatLoss, sweatRate, bmChangePct } from './formulas.js';
import { TESTS, REF, RM_INFO } from './tests.js';
import { M48_REF, M4_FIELDS, M8_FIELDS, M48_T } from './m48.js';
import { M510_REF, SITES, EQS, EQ_ORDER, SOMATO_SITES, M10_FIELDS, M510_T } from './m510.js';
import { MODULES, T, M1_FORMULAS, KARVONEN_REF, GLOSSARY, ABOUT } from './i18n.js';
import { S, load, save, clear, expireIfDue, expiresAt, isEmpty } from './session.js';
import { startTitleCase } from './titlecase.js';
import { SKR_REF, LINKS, ACSM_Q, ACSM_Q_INTENT, ACSM_Q_CLEAR, acsmResult, ACSM_ALWAYS, PARQ_OUT, AHA14, AHA_GROUPS } from './screening.js';

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
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
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
startTitleCase();
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
  return tiles || (skrTile() ? '' : `<p class="empty">${esc(t().noResult)}</p>`);
}
const SKR_KW = 'skrining screening prapartisipasi preparticipation par-q parq acsm aha 14 elemen ppe clearance kelaikan';
function skrTile() {
  const q = query.trim().toLowerCase();
  if (q && ![t().skrTitle, SKR_KW].some(x => x.toLowerCase().includes(q))) return '';
  return `<a class="tile tile-wide" href="#/m/skr"><span class="tile-ic">${svg('shield', '#C2410C')}</span>
    <div style="flex:1;min-width:0"><div class="tile-num">${esc(t().skrStart.toUpperCase())}</div><div class="tile-title">${esc(t().skrTitle)}</div><div class="tile-cat">${esc(t().skrTileSub)}</div></div>
    <span style="transform:rotate(-90deg);display:flex">${svg('chev', '#9A3412')}</span></a>`;
}
function renderHomeTiles() { const g = document.getElementById('tiles'); if (g) g.innerHTML = homeTiles(); const f = document.getElementById('skrSlot'); if (f) f.innerHTML = skrTile(); }
function renderHome() {
  const flash = UI.flash ? `<div class="note" role="status">${svg('info', '#9A3412')}<span>${esc(UI.flash === 'expired' ? t().expiredMsg : t().clearedMsg)}</span></div>` : '';
  UI.flash = '';
  app.innerHTML = `${brandHeader()}<main class="main">${flash}${sessionCard()}
    <label class="search">${svg('search', '#5C4F45')}<span class="sr-only">${esc(t().search)}</span>
      <input type="search" id="q" value="${esc(query)}" placeholder="${esc(t().searchPh)}" autocomplete="off"></label>
    <div id="skrSlot">${skrTile()}</div>
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



// ---------- Skrining prapartisipasi ----------
const ynSeg = (attr, key, val, labelId) => `<div class="seg" role="group" aria-labelledby="${labelId}">
  <button type="button" data-${attr}="${key}" data-v="y" aria-pressed="${val === 'y'}">${esc(t().yes)}</button>
  <button type="button" data-${attr}="${key}" data-v="n" aria-pressed="${val === 'n'}">${esc(t().no)}</button></div>`;
function qField(q, val) {
  const lid = `q-${q.k}`;
  return `<div class="field"><div class="lbl-row"><span class="qtext" id="${lid}">${esc(q.label[lang])}</span>${q.def ? ibtn(q.def, q.label[lang]) : ''}</div>
    ${ynSeg('yn', q.k, val, lid)}${q.hint ? `<span class="hint">${esc(q.hint[lang])}</span>` : ''}</div>`;
}
function acsmNeedIntent() { const a = S.skr; return a.active === 'y' && a.known === 'y' && a.symp === 'n'; }
function skrAcsm() {
  const a = S.skr, r = acsmResult(a);
  const qs = ACSM_Q.map(q => qField(q, a[q.k])).join('');
  let extra = '';
  if (acsmNeedIntent()) {
    extra += `<div class="field"><span class="qtext" id="q-intent">${esc(ACSM_Q_INTENT.label[lang])}</span>
      <div class="seg" role="group" aria-labelledby="q-intent">${ACSM_Q_INTENT.opts.map(([k, l]) => `<button type="button" data-yn="intent" data-v="${k}" aria-pressed="${a.intent === k}">${esc(l[lang])}</button>`).join('')}</div><span class="hint">${esc(ACSM_Q_INTENT.hint[lang])}</span></div>`;
    if (a.intent === 'vig') extra += qField(ACSM_Q_CLEAR, a.cleared);
  }
  const icon = r ? (r.level === 'ok' ? 'check' : 'alert') : 'info';
  const res = !r ? `<p class="empty" style="margin:0">${esc(t().answerAll)}</p>`
    : `<div class="note ${r.level === 'stop' ? 'danger' : ''}" role="status">${svg(icon, r.level === 'stop' ? '#B91C1C' : '#9A3412')}<span>${esc(r[lang])}</span></div>`;
  return `<section class="card" aria-labelledby="h-q"><h2 class="h2" id="h-q">${esc(t().questions)}</h2>
      <div style="display:flex;flex-direction:column;gap:14px">${qs}${extra}</div></section>
    <section class="card" aria-labelledby="h-rec" style="margin-top:14px"><div class="lbl-row"><h2 class="h2" id="h-rec">${esc(t().recommendation)}</h2>${ibtn('clearance', 'Medical clearance')}</div>
      ${res}
      <div class="note">${svg('info', '#9A3412')}<span>${esc(ACSM_ALWAYS[lang])}</span></div>
      <span class="hint">${esc(t().popLbl)}: ${esc(t().acsmPop)}</span>
      ${fxBtn('acsm', true)}${UI.mfx.has('acsm') ? `<div class="fbox" id="mfx-acsm"><span class="k">${esc(t().fSource)}</span>${skrRefs(['riebe', 'getp'])}<span class="hint">${esc(t().doiNote)}</span></div>` : ''}
    </section>`;
}
const skrRefs = keys => keys.map(k => `<span class="r">${esc(SKR_REF[k].ref)}${SKR_REF[k].doi ? ` <a href="https://doi.org/${SKR_REF[k].doi}" target="_blank" rel="noopener">doi:${SKR_REF[k].doi}</a>` : ''}</span>`).join('');
const linkBtn = (href, icon, label, ext = false) => `<a class="btn-sec" href="${href}" target="_blank" rel="noopener">${svg(icon, '#9A3412', 18)}<span>${esc(label)}</span></a>${ext ? '' : ''}`;
function skrParq() {
  return `<section class="card" aria-labelledby="h-pq"><h2 class="h2" id="h-pq">${esc(t().parqHead)}</h2>
      ${linkBtn(LINKS.parq25, 'file', t().parqOpen25)}${linkBtn(LINKS.parqId, 'file', t().parqOpenId)}${linkBtn(LINKS.eparmed, 'link', t().parqEpar)}
      <div class="note">${svg('alert', '#9A3412')}<span>${esc(t().parqRules)}</span></div>
      <span class="hint">${esc(t().parqIdNote)}</span>
      ${fxBtn('parq', true)}${UI.mfx.has('parq') ? `<div class="fbox" id="mfx-parq"><span class="k">${esc(t().fSource)}</span>${skrRefs(['parq', 'parqId'])}<span class="hint">${esc(t().doiNote)}</span></div>` : ''}</section>
    <section class="card" aria-labelledby="h-pr" style="margin-top:14px"><div class="lbl-row"><h2 class="h2" id="h-pr">${esc(t().parqRecord)}</h2><span class="opt">${esc(t().optional)}</span></div>
      <div class="optlist" role="group" aria-labelledby="h-pr">${PARQ_OUT.map(([k, l]) => `<button type="button" data-parq="${k}" aria-pressed="${S.skr.parq === k}">${esc(l[lang])}</button>`).join('')}</div>
      <span class="hint">${esc(t().parqRecordHint)}</span></section>`;
}
function ahaState() {
  const ans = S.skr.aha, answered = AHA14.filter(x => ans[x.k]).length, pos = AHA14.filter(x => ans[x.k] === 'y');
  return { answered, pos, n: AHA14.length };
}
function skrAha() {
  const st = ahaState();
  const groups = Object.keys(AHA_GROUPS).map(g => `<section class="card" aria-labelledby="h-g${g}" style="margin-bottom:14px"><h2 class="h2" id="h-g${g}">${esc(AHA_GROUPS[g][lang])}</h2>
      <div style="display:flex;flex-direction:column;gap:14px">${AHA14.filter(x => x.g === g).map(x => `<div class="field"><span class="qtext" id="q-${x.k}">${esc(x[lang])}</span>${ynSeg('aha', x.k, S.skr.aha[x.k] || '', `q-${x.k}`)}</div>`).join('')}</div></section>`).join('');
  let res;
  if (st.answered < st.n) res = `<p class="empty" style="margin:0">${esc(t().ahaIncomplete)}</p>`;
  else if (st.pos.length) res = `<div class="note" role="status">${svg('alert', '#9A3412')}<span><b>${esc(t().ahaPos(st.pos.length))}.</b> ${esc(t().ahaPosNote)}</span></div>
      <ul class="poslist">${st.pos.map(x => `<li>${esc(x[lang])}</li>`).join('')}</ul>`;
  else res = `<div class="note" role="status">${svg('check', '#9A3412')}<span><b>${esc(t().ahaNone)}.</b> ${esc(t().ahaNoneNote)}</span></div>`;
  return `${groups}
    <section class="card" aria-labelledby="h-ah"><div class="lbl-row"><h2 class="h2" id="h-ah">${esc(t().result)}</h2>${ibtn('aha14', 'AHA')}</div>
      <span class="sess-sum">${esc(t().ahaAnswered(st.answered, st.n))}</span>
      ${st.answered < st.n ? `<button type="button" class="btn-sec" data-aharest>${svg('check', '#9A3412', 18)}<span>${esc(t().ahaRest)}</span></button>` : ''}
      ${res}
      <span class="hint">${esc(t().popLbl)}: ${esc(t().ahaPop)}</span>
      ${linkBtn(LINKS.ppe, 'link', t().ppeLink)}
      <span class="hint">${esc(t().ppeNote)}</span>
      ${fxBtn('aha', true)}${UI.mfx.has('aha') ? `<div class="fbox" id="mfx-aha"><span class="k">${esc(t().fSource)}</span>${skrRefs(['maron', 'ppe'])}<span class="hint">${esc(t().doiNote)}</span></div>` : ''}
    </section>`;
}
function skrCopy() {
  const lines = [], a = S.skr, r = acsmResult(a);
  if (r) {
    const yn = v => (v === 'y' ? t().yes : t().no).toLowerCase();
    const parts = ['active', 'known', 'symp'].filter(k => a[k] && !(k === 'known' && a.symp === 'y')).map(k => `${t().acsmAns[k]} ${yn(a[k])}`);
    if (acsmNeedIntent() && a.intent) parts.push(`${t().acsmAns.intent} ${ACSM_Q_INTENT.opts.find(o => o[0] === a.intent)[1][lang].toLowerCase()}`);
    if (acsmNeedIntent() && a.intent === 'vig' && a.cleared) parts.push(`${t().acsmAns.cleared} ${yn(a.cleared)}`);
    lines.push(t().copyAcsm(parts.join('; '), r[lang]));
  }
  if (a.parq) lines.push(t().copyParq(PARQ_OUT.find(o => o[0] === a.parq)[1][lang]));
  const st = ahaState();
  if (st.answered === st.n) lines.push(t().copyAha(st.answered, st.n, st.pos.length ? `${t().ahaPos(st.pos.length)}: ${st.pos.map(x => x[lang]).join('; ')}` : t().ahaNone));
  if (!lines.length) return null;
  const refs = [r ? 'Riebe 2015' : '', a.parq ? 'PAR-Q+ 2025' : '', st.answered === st.n ? 'Maron (AHA/ACC) 2014' : ''].filter(Boolean).join('; ');
  const body = [...lines, t().srcLine(refs), t().skrNote];
  const bs = baseSummary();
  const text = [t().copyHeaderMod(0, t().skrTitle, todayStr()).replace(/Modul 0 |Module 0 /, ''), ...(bs ? [`${t().baseLabel}: ${bs}`] : []), ...body].join('\n');
  return { text, body };
}
function skrBody() {
  const p = S.skr.part;
  return `${p === 'parq' ? skrParq() : p === 'aha' ? skrAha() : skrAcsm()}${copyCard(skrCopy())}`;
}
function renderSkr() {
  app.innerHTML = `${pageHeader(t().skrKicker, t().skrTitle, t().skrSub)}
  <main class="main">
    <div class="note">${svg('shield', '#9A3412')}<span>${esc(t().skrNote)}</span></div>
    <div class="seg" role="group" aria-label="${esc(t().skrTitle)}">${['acsm', 'parq', 'aha'].map(k => `<button type="button" data-part="${k}" aria-pressed="${S.skr.part === k}">${esc(t().skrParts[k])}</button>`).join('')}</div>
    <div id="skrbody">${skrBody()}</div>
    <div class="foot"><span>${esc(t().skrSources)}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('calc')}`;
}
function refreshSkr(focusSel) {
  document.getElementById('skrbody').innerHTML = skrBody();
  document.querySelectorAll('[data-part]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.part === S.skr.part)));
  if (focusSel) document.querySelector(focusSel)?.focus();
}


// ---------- Modul 4 (energi & makro) dan Modul 8 (antropometri dasar) ----------
const tt = () => ({ ...t(), ...M48_T[lang] });
const CUSTOM = { m4: { fields: M4_FIELDS, needs: ['age', 'sex', 'weight', 'height'] }, m8: { fields: M8_FIELDS, needs: ['sex', 'weight', 'height'] } };
const unitOf = u => (typeof u === 'string' ? u : u[lang]);
function customState(mod) {
  const cfg = CUSTOM[mod], base = m1State(), v = {}, err = {};
  for (const f of cfg.fields) {
    const id = fid(mod, 'x', f.k), raw = S[mod].v[`x.${f.k}`] ?? '', x = parse(raw);
    v[f.k] = NaN;
    if (raw !== '') { if (!(x >= f.lim[0] && x <= f.lim[1])) err[id] = t().errRange(...f.lim); else v[f.k] = x; }
  }
  const b = baseVals();
  if (mod === 'm4' && Number.isFinite(v.ffm) && Number.isFinite(b.weight) && v.ffm >= b.weight) { err[fid(mod, 'x', 'ffm')] = tt().ffmErr; v.ffm = NaN; }
  for (const k of ['age', 'weight', 'height']) if (base.allErr[k]) err[k] = base.allErr[k];
  const missing = cfg.needs.filter(k => (k === 'sex' ? !S.base.sex : S.base[k] === '' || !!base.allErr[k]));
  const shown = Object.fromEntries(Object.entries(err).filter(([k]) => UI.touched.has(k)));
  return { v, b, err: shown, missing, ok: !missing.length };
}
function customFields(mod, s) {
  const cfg = CUSTOM[mod], out = [];
  for (const k of cfg.needs) {
    if (k === 'age') out.push(field('age', t().age, t().years, S.base.age, { err: s.err.age }));
    if (k === 'sex') out.push(sexField());
    if (k === 'weight') out.push(field('weight', t().weight, 'kg', S.base.weight, { err: s.err.weight, dec: true }));
    if (k === 'height') out.push(field('height', t().height, 'cm', S.base.height, { err: s.err.height, dec: true }));
  }
  for (const f of cfg.fields) {
    const id = fid(mod, 'x', f.k);
    out.push(field(id, f.label[lang], unitOf(f.unit), S[mod].v[`x.${f.k}`] ?? '', { req: false, tag: f.tag ? f.tag[lang] : '', hint: f.hint ? f.hint[lang] : '', err: s.err[id], dec: !!f.dec, key: `x.${f.k}`, mod }));
  }
  return `<div style="display:flex;flex-direction:column;gap:14px">${out.join('')}</div>`;
}
const m48Refs = keys => keys.map(k => `<span class="r">${esc(M48_REF[k].ref)}${M48_REF[k].doi ? ` <a href="https://doi.org/${M48_REF[k].doi}" target="_blank" rel="noopener">doi:${M48_REF[k].doi}</a>` : ''}</span>`).join('');
function fxBox48(id, f, sLines, refs) {
  return `<div class="fbox" id="mfx-${id}"><span class="k">${esc(t().fFormula)}</span>${f.map(x => `<span class="f" style="font-size:14px">${esc(x)}</span>`).join('')}
    ${sLines.length ? `<span class="k">${esc(t().fWithData)}</span>${sLines.map(x => `<span class="s" style="font-size:14px">${esc(x)}</span>`).join('')}` : ''}
    <span class="k">${esc(t().fSource)}</span>${m48Refs(refs)}<span class="hint">${esc(t().doiNote)}</span></div>`;
}
const card = (hid, title, def, inner, mt = true) => `<section class="card" aria-labelledby="${hid}"${mt ? ' style="margin-top:14px"' : ''}><div class="lbl-row"><h2 class="h2" id="${hid}">${esc(title)}</h2>${def ? ibtn(def, title) : ''}</div>${inner}</section>`;
const emptyP = txt => `<p class="empty" style="margin:0">${esc(txt)}</p>`;

function m4Calc(s) {
  const { v, b } = s, male = b.sex === 'M', T = tt();
  if (!s.ok) return null;
  const r = { eq: {} };
  r.eq.th = rmrTenHaaf(b.weight, b.height / 100, b.age, male);
  if (Number.isFinite(v.ffm)) r.eq.thf = rmrTenHaafFfm(v.ffm);
  r.eq.mif = rmrMifflin(b.weight, b.height, b.age, male);
  r.eq.hb = rmrHarrisRev(b.weight, b.height, b.age, male);
  if (Number.isFinite(v.ffm)) r.eq.cun = rmrCunningham(v.ffm);
  if (!r.eq[S.m4.basis]) S.m4.basis = 'th';
  r.basis = S.m4.basis; r.rmr = r.eq[r.basis];
  if (Number.isFinite(v.pal)) { r.pal = v.pal; r.tdee = r.rmr * v.pal; r.band = PAL_BANDS.find(x => v.pal >= x.lo && v.pal <= x.hi + 0.005)?.k; }
  if (S.m4.cho && CHO[S.m4.cho]) r.cho = CHO[S.m4.cho].map(g => [g, g * b.weight]);
  r.pro = PROTEIN.map(g => [g, g * b.weight]);
  if (r.tdee) r.fat = FAT_PCT.map(p => r.tdee * p / 100 / 9);
  if ([v.ffm, v.ei, v.eee].every(Number.isFinite)) r.ea = energyAvail(v.ei, v.eee, v.ffm);
  r.outAge = b.age < 18 || b.age > 35;
  return r;
}
const n1 = x => num(x, Number.isInteger(x) ? 0 : 1);
const rng = (a, b2, d = 0) => `${num(a, d)}–${num(b2, d)}`;
function m4Out(s) {
  const T = tt(), r = m4Calc(s), b = s.b, male = b.sex === 'M';
  if (!r) return card('h-rmr', T.rmrHead, 'rmr', emptyP(t().needBase(s.missing.map(k => t().baseNames[k]).join(', '))), false);
  const row = (k, val, badge) => `<div class="frow ${r.eq[k] ? '' : 'off'}"><div class="frow-main"><div class="frow-name" style="font-size:14px">${esc(T.eq[k])}${badge ? `<span class="badge">${esc(badge)}</span>` : ''}</div></div><span class="frow-val" style="font-size:17px">${val}</span></div>`;
  const rows = ['th', 'thf', 'mif', 'hb', 'cun'].map(k => row(k, r.eq[k] ? `${num(r.eq[k])} <small>${esc(T.kcal)}</small>` : `<span class="opt">${esc(T.needFfm)}</span>`, k === 'th' ? T.main : '')).join('');
  const fRmr = lang === 'id'
    ? ['Ten Haaf (BB): 11,936×BB + 587,728×TB(m) − 8,129×usia + 191,027×JK + 29,279', 'Ten Haaf (FFM): 22,771×FFM + 484,264',
      'Mifflin-St Jeor: 10×BB + 6,25×TB(cm) − 5×usia + 5 (pria) / − 161 (wanita)', 'Harris-Benedict revisi, pria: 88,362 + 13,397×BB + 4,799×TB(cm) − 5,677×usia',
      'Harris-Benedict revisi, wanita: 447,593 + 9,247×BB + 3,098×TB(cm) − 4,330×usia', 'Cunningham: 500 + 22×FFM', 'BB = berat badan (kg); TB = tinggi badan; JK: pria = 1, wanita = 0']
    : ['Ten Haaf (mass): 11.936×W + 587.728×H(m) − 8.129×age + 191.027×sex + 29.279', 'Ten Haaf (FFM): 22.771×FFM + 484.264',
      'Mifflin-St Jeor: 10×W + 6.25×H(cm) − 5×age + 5 (men) / − 161 (women)', 'Revised Harris-Benedict, men: 88.362 + 13.397×W + 4.799×H(cm) − 5.677×age',
      'Revised Harris-Benedict, women: 447.593 + 9.247×W + 3.098×H(cm) − 4.330×age', 'Cunningham: 500 + 22×FFM', 'W = body mass (kg); H = height; sex: male = 1, female = 0'];
  const cf = c => (lang === 'id' ? String(c).replace('.', ',') : String(c));
  const sRmr = [`Ten Haaf: ${cf(11.936)}×${num(b.weight, 1)} + ${cf(587.728)}×${num(b.height / 100, 2)} − ${cf(8.129)}×${num(b.age)} + ${cf(191.027)}×${male ? 1 : 0} + ${cf(29.279)} = ${num(r.eq.th)}`];
  const rmrCard = card('h-rmr', T.rmrHead, 'rmr', `${rows}
    ${r.outAge ? `<div class="note">${svg('alert', '#9A3412')}<span>${esc(T.tenHaafAge)}</span></div>` : ''}
    <span class="hint">${esc(t().popLbl)}: ${esc(lang === 'id' ? 'Ten Haaf: 90 atlet rekreasional Belanda 18–35 th; meta-analisis 2023 (29 studi, 1.430 atlet) menilainya paling presisi; Mifflin-St Jeor cenderung meleset pada atlet.' : 'Ten Haaf: 90 Dutch recreational athletes aged 18–35; a 2023 meta-analysis (29 studies, 1,430 athletes) found it most precise; Mifflin-St Jeor tends to miss in athletes.')}</span>
    ${fxBtn('rmr')}${UI.mfx.has('rmr') ? fxBox48('rmr', fRmr, sRmr, ['tenhaaf', 'oneill', 'mifflin', 'roza', 'cunningham']) : ''}`, false);
  const bopts = Object.keys(r.eq).map(k => `<option value="${k}" ${r.basis === k ? 'selected' : ''}>${esc(T.eq[k])} · ${num(r.eq[k])}</option>`).join('');
  const tdeeInner = !r.tdee ? emptyP(T.tdeeNeed) : `<label class="field"><span class="lbl">${esc(T.tdeeBasis)}</span><select class="sel" id="rmrBasis">${bopts}</select></label>
    <div class="big"><b>${num(r.tdee)}</b><span>${esc(T.kcal)}</span></div>
    <span class="hint">PAL ${num(r.pal, 2)}${r.band ? ` · ${esc(T.palBand[r.band])}` : ''}</span>
    ${fxBtn('tdee')}${UI.mfx.has('tdee') ? fxBox48('tdee', ['TDEE = RMR × PAL'], [`${num(r.rmr)} × ${num(r.pal, 2)} = ${num(r.tdee)}`], ['fao']) : ''}`;
  const choSeg = `<div class="field"><span class="lbl" id="choLbl">${esc(T.choLoad)}</span><div class="optlist" role="group" aria-labelledby="choLbl">${Object.keys(CHO).map(k => `<button type="button" data-cho="${k}" aria-pressed="${S.m4.cho === k}">${esc(T.cho[k])} · ${CHO[k][0]}–${CHO[k][1]} g/kg</button>`).join('')}</div></div>`;
  const gday = lang === 'id' ? 'g/hari' : 'g/day';
  const macro = `${choSeg}
    ${r.cho ? kvRow(T.choRow, `${rng(r.cho[0][1], r.cho[1][1])} ${gday}`) : emptyP(T.choNeed)}
    ${kvRow(T.proRow, `${rng(r.pro[0][1], r.pro[1][1])} ${gday}`)}
    ${r.fat ? kvRow(T.fatRow, `${rng(r.fat[0], r.fat[1])} ${gday}`) : `<span class="hint">${esc(T.fatNeed)}</span>`}
    <div class="note">${svg('info', '#9A3412')}<span>${esc(T.macroNote)}</span></div>
    ${fxBtn('mac')}${UI.mfx.has('mac') ? fxBox48('mac', [lang === 'id' ? 'Karbohidrat: 3–5 / 5–7 / 6–10 / 8–12 g/kg/hari sesuai beban latihan' : 'Carbohydrate: 3–5 / 5–7 / 6–10 / 8–12 g/kg/day by training load',
      lang === 'id' ? 'Protein: 1,2–2,0 g/kg/hari' : 'Protein: 1.2–2.0 g/kg/day', lang === 'id' ? 'Lemak: 20–35% energi; 1 g lemak = 9 kkal' : 'Fat: 20–35% of energy; 1 g fat = 9 kcal'], [], ['thomas']) : ''}`;
  const eaInner = r.ea === undefined ? emptyP(T.eaNeed) : `<div class="big"><b>${num(r.ea, 1)}</b><span>${esc(T.eaUnit)}</span></div>
    ${r.ea < 30 ? `<div class="note">${svg('alert', '#9A3412')}<span>${esc(T.eaLow)}</span></div>` : ''}
    <span class="hint">${esc(T.eaNote)}</span>
    ${fxBtn('ea')}${UI.mfx.has('ea') ? fxBox48('ea', [lang === 'id' ? 'EA = (asupan energi − energi latihan) / FFM' : 'EA = (energy intake − exercise energy expenditure) / FFM'], [`(${num(s.v.ei)} − ${num(s.v.eee)}) / ${num(s.v.ffm, 1)} = ${num(r.ea, 1)}`], ['ioc']) : ''}`;
  return `${rmrCard}${card('h-tdee', T.tdeeHead, 'tdee', tdeeInner)}${card('h-mac', T.macroHead, null, macro)}${card('h-ea', T.eaHead, 'ea', eaInner)}${copyCard(customCopy('m4'))}`;
}

function m8Calc(s) {
  if (!s.ok) return null;
  const { v, b } = s, male = b.sex === 'M', r = {};
  r.bmi = bmi(b.weight, b.height); r.cat = bmiCat(r.bmi);
  if (Number.isFinite(v.wc)) { r.wc = v.wc; r.central = centralObese(v.wc, male); r.whtr = whtr(v.wc, b.height); }
  if (Number.isFinite(v.wc) && Number.isFinite(v.hc)) { r.whr = whr(v.wc, v.hc); r.whrHigh = whrHigh(r.whr, male); }
  return r;
}
function m8Out(s) {
  const T = tt(), r = m8Calc(s), b = s.b, male = b.sex === 'M';
  if (!r) return card('h-bmi', T.bmiHead, 'bmi', emptyP(t().needBase(s.missing.map(k => t().baseNames[k]).join(', '))), false);
  const bmiCard = card('h-bmi', T.bmiHead, 'bmi', `<div class="big"><b>${num(r.bmi, 1)}</b><span>kg/m²</span></div>
    ${kvRow(lang === 'id' ? 'Kategori' : 'Category', T.bmiCat[r.cat])}
    ${r.bmi >= 23 ? `<div class="note">${svg('info', '#9A3412')}<span>${esc(T.bmiMuscle)}</span></div>` : ''}
    ${fxBtn('bmi')}${UI.mfx.has('bmi') ? fxBox48('bmi', [lang === 'id' ? 'IMT = BB (kg) / TB (m)²' : 'BMI = mass (kg) / height (m)²', lang === 'id' ? '<18,5 BB kurang; 18,5–22,9 normal; 23–24,9 BB lebih; 25–29,9 obesitas I; ≥30 obesitas II' : '<18.5 underweight; 18.5–22.9 normal; 23–24.9 overweight; 25–29.9 obesity I; ≥30 obesity II'],
      [`${num(b.weight, 1)} / ${num(b.height / 100, 2)}² = ${num(r.bmi, 1)}`], ['pnpk']) : ''}`, false);
  const wcInner = r.wc === undefined ? emptyP(T.wcNeed) : `${kvRow(T.wcRow, `${n1(r.wc)} cm`)}<span class="hint">${esc(r.central ? T.wcCentral : T.wcNot)} (${male ? '>90' : '>80'} cm)</span>
    ${kvRow(T.whtrRow, num(r.whtr, 3))}<span class="hint">${esc(r.whtr >= 0.5 ? T.whtrHigh : T.whtrOk)}</span>
    ${r.whr !== undefined ? `${kvRow(T.whrRow, num(r.whr, 3))}<span class="hint">${esc(r.whrHigh ? T.whrHighTxt(male) : T.whrOk(male))}</span>` : ''}
    ${fxBtn('wc')}${UI.mfx.has('wc') ? fxBox48('wc', [lang === 'id' ? 'Obesitas sentral: lingkar pinggang >90 cm (pria), >80 cm (wanita)' : 'Central obesity: waist >90 cm (men), >80 cm (women)', lang === 'id' ? 'WHtR = lingkar pinggang / TB (cm); ≥0,5 risiko meningkat' : 'WHtR = waist / height (cm); ≥0.5 increased risk', lang === 'id' ? 'WHR = lingkar pinggang / lingkar panggul; ≥0,90 pria, ≥0,85 wanita' : 'WHR = waist / hip; ≥0.90 men, ≥0.85 women'],
      [`WHtR = ${n1(r.wc)} / ${n1(b.height)} = ${num(r.whtr, 3)}`, ...(r.whr !== undefined ? [`WHR = ${n1(r.wc)} / ${n1(s.v.hc)} = ${num(r.whr, 3)}`] : [])], ['pnpk', 'nice', 'whowc']) : ''}`;
  return `${bmiCard}${card('h-wc', T.wcHead, 'whtr', wcInner)}${copyCard(customCopy('m8'))}`;
}

function customCopy(mod) {
  const s = customState(mod), T = tt(), lines = [], gday = lang === 'id' ? 'g/hari' : 'g/day';
  let src = '';
  if (mod === 'm4') {
    const r = m4Calc(s); if (!r) return null;
    lines.push(`RMR ${T.eq[r.basis]} ${num(r.rmr)} ${T.kcal}${r.outAge ? (lang === 'id' ? ' (usia di luar populasi asal Ten Haaf)' : ' (age outside Ten Haaf sample)') : ''}`);
    if (r.tdee) lines.push(`TDEE (PAL ${num(r.pal, 2)}) ${num(r.tdee)} ${T.kcal}`);
    if (r.cho) lines.push(`${T.choRow} ${CHO[S.m4.cho][0]}–${CHO[S.m4.cho][1]} g/kg = ${rng(r.cho[0][1], r.cho[1][1])} ${gday}`);
    lines.push(`${T.proRow} 1,2–2,0 g/kg = ${rng(r.pro[0][1], r.pro[1][1])} ${gday}`.replace('1,2–2,0', lang === 'id' ? '1,2–2,0' : '1.2–2.0'));
    if (r.fat) lines.push(`${T.fatRow} ${rng(r.fat[0], r.fat[1])} ${gday}`);
    if (r.ea !== undefined) lines.push(`EA ${num(r.ea, 1)} ${T.eaUnit}`);
    src = 'ten Haaf & Weijs 2014; ACSM/AND/DC 2016' + (r.ea !== undefined ? '; IOC 2023' : '');
  } else {
    const r = m8Calc(s); if (!r) return null;
    const male = s.b.sex === 'M';
    lines.push(`IMT ${num(r.bmi, 1)} kg/m² (${T.bmiCat[r.cat]}, PNPK 2025)`.replace('IMT', lang === 'id' ? 'IMT' : 'BMI'));
    if (r.wc !== undefined) lines.push(`${T.wcRow} ${n1(r.wc)} cm — ${r.central ? T.wcCentral : T.wcNot}`, `WHtR ${num(r.whtr, 3)} — ${r.whtr >= 0.5 ? T.whtrHigh : T.whtrOk}`);
    if (r.whr !== undefined) lines.push(`WHR ${num(r.whr, 3)} — ${r.whrHigh ? T.whrHighTxt(male) : T.whrOk(male)}`);
    src = 'PNPK Obesitas Dewasa 2025' + (r.wc !== undefined ? '; NICE NG246' : '') + (r.whr !== undefined ? '; WHO 2011' : '');
  }
  const body = [...lines, t().srcLine(src)];
  const M = MODULES.find(m => m.id === mod), bs = baseSummary();
  const text = [t().copyHeaderMod(Number(mod.slice(1)), M.title[lang], todayStr()), ...(bs ? [`${t().baseLabel}: ${bs}`] : []), ...body].join('\n');
  return { text, body };
}
function renderCustom(mod) {
  const i = MODULES.findIndex(m => m.id === mod), M = MODULES[i], s = customState(mod), T = tt();
  app.innerHTML = `${pageHeader(t().moduleLabel(String(i + 1).padStart(2, '0'), M.cat[lang]), M.title[lang], T[`${mod}Sub`])}
  <main class="main">
    <div class="note">${svg('body', '#9A3412')}<span>${esc(T[`${mod}Pop`])}</span></div>
    <section class="card" aria-labelledby="h-in">
      <div class="row-between"><h2 class="h2" id="h-in">${esc(t().dataIn)}</h2><span class="muted"><span class="req">*</span> ${esc(t().required)}</span></div>
      <div id="fields">${customFields(mod, s)}</div>
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().storedNote)}</span></div>
    </section>
    <div id="modout">${mod === 'm4' ? m4Out(s) : m8Out(s)}</div>
    <div class="foot"><span>${esc(T[`${mod}Sources`])}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('calc')}`;
}
function refreshCustom(mod, keepInputs = false) {
  const s = customState(mod);
  if (keepInputs) updateFieldMsgs(s); else document.getElementById('fields').innerHTML = customFields(mod, s);
  document.getElementById('modout').innerHTML = mod === 'm4' ? m4Out(s) : m8Out(s);
}


// ---------- Modul 5 (skinfold & somatotipe) dan Modul 10 (sweat rate) ----------
const T5 = () => ({ ...t(), ...M510_T[lang] });
const r510 = keys => keys.map(k => `<span class="r">${esc(M510_REF[k].ref)}${M510_REF[k].doi ? ` <a href="https://doi.org/${M510_REF[k].doi}" target="_blank" rel="noopener">doi:${M510_REF[k].doi}</a>` : ''}</span>`).join('');
function fxBox510(id, f, sLines, refs) {
  return `<div class="fbox" id="mfx-${id}"><span class="k">${esc(t().fFormula)}</span>${f.map(x => `<span class="f" style="font-size:14px">${esc(x)}</span>`).join('')}
    ${sLines.length ? `<span class="k">${esc(t().fWithData)}</span>${sLines.map(x => `<span class="s" style="font-size:14px">${esc(x)}</span>`).join('')}` : ''}
    <span class="k">${esc(t().fSource)}</span>${r510(refs)}<span class="hint">${esc(t().doiNote)}</span></div>`;
}
function m5Eq() {
  const sex = S.base.sex || 'M';
  const ok = k => EQS[k].sex === 'both' || EQS[k].sex === sex;
  if (!S.m5.eq || !ok(S.m5.eq)) S.m5.eq = sex === 'F' ? 'dw' : 'hastuti';
  return S.m5.eq;
}
function m5Sites() { return S.m5.tab === 'som' ? SOMATO_SITES : [...EQS[m5Eq()].sites, 'target']; }
function m5State() {
  const base = m1State(), v = {}, err = {};
  for (const k of Object.keys(SITES)) {
    const f = SITES[k], raw = S.m5.v[`x.${k}`] ?? '', x = parse(raw), id = fid('m5', 'x', k);
    v[k] = NaN;
    if (raw !== '') { if (!(x >= f.lim[0] && x <= f.lim[1])) err[id] = t().errRange(...f.lim); else v[k] = x; }
  }
  for (const k of ['age', 'weight', 'height']) if (base.allErr[k]) err[k] = base.allErr[k];
  const needs = S.m5.tab === 'som' ? ['weight', 'height'] : ['age', 'sex', 'weight'];
  const missing = needs.filter(k => (k === 'sex' ? !S.base.sex : S.base[k] === '' || !!base.allErr[k]));
  const shown = Object.fromEntries(Object.entries(err).filter(([k]) => UI.touched.has(k)));
  return { v, b: baseVals(), err: shown, missing, needs };
}
function m5Fields(s) {
  const out = [];
  for (const k of s.needs) {
    if (k === 'age') out.push(field('age', t().age, t().years, S.base.age, { err: s.err.age }));
    if (k === 'sex') out.push(sexField());
    if (k === 'weight') out.push(field('weight', t().weight, 'kg', S.base.weight, { err: s.err.weight, dec: true }));
    if (k === 'height') out.push(field('height', t().height, 'cm', S.base.height, { err: s.err.height, dec: true }));
  }
  if (S.m5.tab !== 'som') {
    const sex = S.base.sex || 'M', eq = m5Eq();
    const opts = EQ_ORDER.filter(k => EQS[k].sex === 'both' || EQS[k].sex === sex).map(k => `<option value="${k}" ${k === eq ? 'selected' : ''}>${esc(EQS[k].name[lang])}</option>`).join('');
    out.push(`<label class="field"><span class="lbl">${esc(T5().eqLbl)}</span><select class="sel" id="eqSel">${opts}</select></label>`);
  }
  for (const k of m5Sites()) {
    const f = SITES[k], id = fid('m5', 'x', k);
    out.push(field(id, f.label[lang], f.unit[lang], S.m5.v[`x.${k}`] ?? '', { req: !f.opt, hint: f.hint ? f.hint[lang] : '', err: s.err[id], dec: f.dec !== false, key: `x.${k}`, mod: 'm5' }));
  }
  return `<div style="display:flex;flex-direction:column;gap:14px">${out.join('')}</div>`;
}
function m5FatCalc(s) {
  const eq = m5Eq(), E = EQS[eq], v = s.v, b = s.b;
  if (s.missing.length || !E.sites.every(k => Number.isFinite(v[k]))) return null;
  const sum = E.sites.reduce((a, k) => a + v[k], 0), r = { eq, sum };
  if (eq === 'hastuti') r.pct = hastutiS4(sum, b.age);
  else if (eq === 'hastutiAlt') r.pct = hastutiAbd(v.abd, v.tri, b.age);
  else {
    r.D = eq === 'dw' ? dwDensity(sum, b.age, b.sex) : eq === 'jp3' ? jp3Men(sum, b.age) : jpw3Women(sum, b.age);
    r.pct = siri(r.D);
  }
  r.ffm = ffmFrom(b.weight, r.pct); r.fm = b.weight - r.ffm;
  if (Number.isFinite(v.target)) r.tw = targetWeight(r.ffm, v.target);
  r.outAge = b.age < E.age[0] || b.age > E.age[1];
  return r;
}
function m5SomCalc(s) {
  const v = s.v, b = s.b;
  if (s.missing.length || !SOMATO_SITES.every(k => Number.isFinite(v[k]))) return null;
  const en = endomorphy(v.tri, v.sub, v.ss, b.height), me = mesomorphy(v.hum, v.fem, v.arm, v.tri, v.calfg, v.calf, b.height);
  const h = hwr(b.height, b.weight), ec = ectomorphy(h), xy = somatoXY(en, me, ec);
  return { en, me, ec, h, ...xy };
}
function somatochart(r, T) {
  // Sumbu X = ekto − endo (−10…10), Y = 2·meso − (endo + ekto) (−12…16). Arah kutub mengikuti rumus koordinat.
  const W = 300, H = 300, sx = x => 150 + x * 13, sy = y => 190 - y * 10.5;
  const px = Math.max(-10, Math.min(10, r.x)), py = Math.max(-12, Math.min(16, r.y));
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(T.chartTitle)}: X ${num(r.x, 1)}, Y ${num(r.y, 1)}" style="max-width:320px;display:block;margin:0 auto">
    <rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="#FFF8F1"/>
    ${[-8, -4, 4, 8].map(x => `<line x1="${sx(x)}" y1="16" x2="${sx(x)}" y2="${H - 16}" stroke="#FFE3CC"/>`).join('')}
    ${[-8, -4, 4, 8, 12].map(y => `<line x1="12" y1="${sy(y)}" x2="${W - 12}" y2="${sy(y)}" stroke="#FFE3CC"/>`).join('')}
    <line x1="${sx(0)}" y1="16" x2="${sx(0)}" y2="${H - 16}" stroke="#9A3412" stroke-width="1.2"/>
    <line x1="12" y1="${sy(0)}" x2="${W - 12}" y2="${sy(0)}" stroke="#9A3412" stroke-width="1.2"/>
    <text x="${sx(0) + 8}" y="30" font-size="12" font-weight="700" fill="#9A3412">↑ ${esc(T.chartMeso)}</text>
    <text x="18" y="${H - 22}" font-size="12" font-weight="700" fill="#9A3412">↙ ${esc(T.chartEndo)}</text>
    <text x="${W - 18}" y="${H - 22}" text-anchor="end" font-size="12" font-weight="700" fill="#9A3412">${esc(T.chartEcto)} ↘</text>
    <text x="${W - 16}" y="${sy(0) - 6}" text-anchor="end" font-size="10" fill="#5C4F45">X</text><text x="${sx(0) + 6}" y="${H - 20}" font-size="10" fill="#5C4F45">Y</text>
    <circle cx="${sx(px)}" cy="${sy(py)}" r="7" fill="#FF8A3D" stroke="#1C1206" stroke-width="2"/>
    <text x="${sx(px)}" y="${sy(py) - 12}" text-anchor="middle" font-size="12" font-weight="800" fill="#1C1206">${num(r.en, 1)}-${num(r.me, 1)}-${num(r.ec, 1)}</text>
  </svg>`;
}
function m5Out(s) {
  const T = T5();
  if (S.m5.tab === 'som') {
    const r = m5SomCalc(s);
    const inner = !r ? emptyP(T.somNeed) : `<div class="big"><b>${num(r.en, 1)}-${num(r.me, 1)}-${num(r.ec, 1)}</b></div>
      ${kvRow(T.endo, num(r.en, 1))}${kvRow(T.meso, num(r.me, 1))}${kvRow(T.ecto, num(r.ec, 1))}${kvRow(T.hwrRow, num(r.h, 1))}${kvRow(T.xy, `${num(r.x, 1)}; ${num(r.y, 1)}`)}
      <h3 class="h2" style="font-size:15px;margin-top:6px">${esc(T.chartTitle)}</h3>${somatochart(r, T)}
      <div class="note">${svg('info', '#9A3412')}<span>${esc(T.somNote)}</span></div>
      ${fxBtn('som')}${UI.mfx.has('som') ? fxBox510('som', [
        lang === 'id' ? 'Endomorfi = −0,7182 + 0,1451X − 0,00068X² + 0,0000014X³; X = (triseps + subskapula + supraspinale) × 170,18 / TB' : 'Endomorphy = −0.7182 + 0.1451X − 0.00068X² + 0.0000014X³; X = (triceps + subscapular + supraspinale) × 170.18 / height',
        lang === 'id' ? 'Mesomorfi = 0,858×lebar humerus + 0,601×lebar femur + 0,188×(lingkar lengan − triseps/10) + 0,161×(lingkar betis − lipatan betis/10) − 0,131×TB + 4,5' : 'Mesomorphy = 0.858×humerus + 0.601×femur + 0.188×(arm girth − triceps/10) + 0.161×(calf girth − calf skinfold/10) − 0.131×height + 4.5',
        lang === 'id' ? 'Ektomorfi: HWR ≥40,75 → 0,732×HWR − 28,58; 38,25<HWR<40,75 → 0,463×HWR − 17,63; ≤38,25 → 0,1' : 'Ectomorphy: HWR ≥40.75 → 0.732×HWR − 28.58; 38.25<HWR<40.75 → 0.463×HWR − 17.63; ≤38.25 → 0.1',
        lang === 'id' ? 'Komponen ≤0 diberi 0,1. X = ekto − endo; Y = 2×meso − (endo + ekto)' : 'Components ≤0 are set to 0.1. X = ecto − endo; Y = 2×meso − (endo + ecto)'], [], ['carter']) : ''}`;
    return `${card('h-som', T.somRating, 'somato', inner, false)}${copyCard(m5Copy())}`;
  }
  const r = m5FatCalc(s), E = EQS[m5Eq()];
  let inner;
  if (!r) inner = emptyP(s.missing.length ? t().needBase(s.missing.map(k => t().baseNames[k]).join(', ')) : T.fatNeed);
  else {
    const fx = r.D !== undefined
      ? [r.eq === 'dw' ? (lang === 'id' ? 'D = C − M × log₁₀(Σ4); C dan M menurut usia dan jenis kelamin' : 'D = C − M × log₁₀(Σ4); C and M by age and sex') : r.eq === 'jp3' ? 'D = 1,10938 − 0,0008267×S + 0,0000016×S² − 0,0002574×usia' : 'D = 1,0994921 − 0,0009929×S + 0,0000023×S² − 0,0001392×usia', 'Siri: %lemak = 495/D − 450']
      : [r.eq === 'hastuti' ? '%lemak = 7,579 + 0,237×Σ4 + 0,073×usia' : '%lemak = 8,000 + 0,402×abdomen + 0,486×triseps + 0,059×usia'];
    const fxL = lang === 'id' ? fx : fx.map(x => x.replace(/(\d),(\d)/g, '$1.$2').replace(/usia/g, 'age').replace(/%lemak/g, '%fat').replace('abdomen', 'abdominal').replace('triseps', 'triceps'));
    const row = r.eq === 'dw' ? dwRow(s.b.age, s.b.sex) : null;
    const sL = [`Σ = ${n1(r.sum)} mm`, ...(row ? [`C = ${num(row[2], 4)}, M = ${num(row[3], 4)} (${row[0]}–${row[1]} ${t().yearsShort})`] : []), ...(r.D !== undefined ? [`D = ${num(r.D, 5)}`] : []), `%lemak = ${num(r.pct, 1)}`.replace('%lemak', lang === 'id' ? '%lemak' : '%fat'), `FFM = ${num(s.b.weight, 1)} × (1 − ${num(r.pct, 1)}/100) = ${num(r.ffm, 1)} kg`];
    inner = `${kvRow(T.sumRaw, `${n1(r.sum)} mm`)}<span class="hint">${esc(T.sumNote)}</span>
      <div class="big"><b>${num(r.pct, 1)}</b><span>% ${esc(lang === 'id' ? 'lemak' : 'fat')}</span></div>
      ${r.D !== undefined ? kvRow(T.density, `${num(r.D, 4)} g/mL`) : ''}${kvRow(T.fatMass, `${num(r.fm, 1)} kg`)}${kvRow(T.ffmRow, `${num(r.ffm, 1)} kg`)}
      ${r.tw !== undefined ? kvRow(T.targetRow, `${num(r.tw, 1)} kg`) : ''}
      ${r.outAge ? `<div class="note">${svg('alert', '#9A3412')}<span>${esc(T.eqAge)} (${E.age[0]}–${E.age[1]} ${t().yearsShort})</span></div>` : ''}
      <span class="hint">${esc(t().popLbl)}: ${esc(E.pop[lang])}</span>
      <button type="button" class="btn-sec" data-useffm>${svg('copy', '#9A3412', 18)}<span>${esc(UI.ffmCopied ? T.usedFfm : T.useFfm)}</span></button>
      ${fxBtn('fat')}${UI.mfx.has('fat') ? fxBox510('fat', [...fxL, lang === 'id' ? 'FFM = BB × (1 − %lemak/100); BB target = FFM / (1 − target%/100)' : 'FFM = mass × (1 − %fat/100); target mass = FFM / (1 − target%/100)'], sL, [...E.refs, 'ackland']) : ''}`;
  }
  return `${card('h-fat', T.pctFat, 'ffm', inner, false)}${copyCard(m5Copy())}`;
}
function m5Copy() {
  const s = m5State(), T = T5(), lines = [], src = [];
  const r = m5FatCalc(s);
  if (r) {
    const E = EQS[r.eq];
    lines.push(`${E.name[lang]}: Σ ${n1(r.sum)} mm → ${num(r.pct, 1)}% ${lang === 'id' ? 'lemak' : 'fat'}; FFM ${num(r.ffm, 1)} kg${r.tw !== undefined ? `; ${lang === 'id' ? 'BB target' : 'target mass'} (${n1(s.v.target)}% ${lang === 'id' ? 'lemak' : 'fat'}) ${num(r.tw, 1)} kg` : ''}${r.outAge ? (lang === 'id' ? ' (usia di luar populasi asal)' : ' (age outside derivation sample)') : ''}`);
    src.push({ hastuti: 'Hastuti 2013', hastutiAlt: 'Hastuti 2013', dw: 'Durnin & Womersley 1974', jp3: 'Jackson & Pollock 1978', jpw3: 'Jackson, Pollock & Ward 1980' }[r.eq]);
  }
  const so = m5SomCalc(s);
  if (so) { lines.push(`${T.somRating} Heath-Carter: ${num(so.en, 1)}-${num(so.me, 1)}-${num(so.ec, 1)} (X ${num(so.x, 1)}; Y ${num(so.y, 1)})`); src.push('Carter 2002'); }
  if (!lines.length) return null;
  const body = [...lines, t().srcLine(src.join('; '))], M = MODULES.find(m => m.id === 'm5'), bs = baseSummary();
  return { text: [t().copyHeaderMod(5, M.title[lang], todayStr()), ...(bs ? [`${t().baseLabel}: ${bs}`] : []), ...body].join('\n'), body };
}
// m5State membaca semua titik, jadi m5Copy di Ringkasan memuat %lemak dan somatotipe sekaligus walau m5FatCalc/m5SomCalc tidak bergantung tab
function m10State() {
  const v = {}, err = {};
  for (const f of M10_FIELDS) {
    const raw = S.m10.v[`x.${f.k}`] ?? '', x = parse(raw), id = fid('m10', 'x', f.k);
    v[f.k] = NaN;
    if (raw !== '') { if (!(x >= f.lim[0] && x <= f.lim[1])) err[id] = t().errRange(...f.lim); else v[f.k] = x; }
  }
  const shown = Object.fromEntries(Object.entries(err).filter(([k]) => UI.touched.has(k)));
  return { v, err: shown };
}
function m10Calc(s) {
  const v = s.v;
  if (!['pre', 'post', 'fluid', 'dur'].every(k => Number.isFinite(v[k]))) return null;
  const urine = Number.isFinite(v.urine) ? v.urine : 0, loss = sweatLoss(v.pre, v.post, v.fluid, urine), hrs = v.dur / 60;
  return { loss, rate: sweatRate(loss, hrs), pct: bmChangePct(v.pre, v.post), gain: v.post > v.pre, urine, hrs };
}
function m10Fields(s) {
  return `<div style="display:flex;flex-direction:column;gap:14px">${M10_FIELDS.map(f => { const id = fid('m10', 'x', f.k);
    return field(id, f.label[lang], unitOf(f.unit), S.m10.v[`x.${f.k}`] ?? '', { req: f.req, hint: f.hint ? f.hint[lang] : '', err: s.err[id], dec: !!f.dec, key: `x.${f.k}`, mod: 'm10' }); }).join('')}</div>`;
}
function m10Out(s) {
  const T = T5(), r = m10Calc(s);
  if (!r) return card('h-sw', T.rateRow, 'sweat', emptyP(T.m10Need), false);
  const pctTxt = r.gain ? `+${num(-r.pct, 2)}%` : `−${num(r.pct, 2)}%`;
  const flag = r.gain ? `<div class="note danger" role="status">${svg('alert', '#B91C1C')}<span>${esc(T.gainDanger)}</span></div>`
    : `<div class="note" role="status">${svg(r.pct > 2 ? 'alert' : 'check', '#9A3412')}<span>${esc(r.pct > 2 ? T.over2 : T.under2)}</span></div>`;
  const inner = `<div class="big"><b>${num(r.rate, 2)}</b><span>${esc(T.rateUnit)}</span></div>
    ${kvRow(T.lossRow, `${num(r.loss, 2)} L`)}${kvRow(T.pctRow, pctTxt)}
    ${flag}<div class="note">${svg('info', '#9A3412')}<span>${esc(T.thirst)}</span></div>
    ${fxBtn('sw')}${UI.mfx.has('sw') ? fxBox510('sw', lang === 'id'
      ? ['Kehilangan keringat (L) = BB sebelum − BB sesudah + cairan diminum − urine', 'Sweat rate (L/jam) = kehilangan keringat / durasi (jam)', '% perubahan BB = (BB sebelum − BB sesudah) / BB sebelum × 100', '1 kg perubahan BB dianggap ±1 L cairan']
      : ['Sweat loss (L) = mass before − mass after + fluid drunk − urine', 'Sweat rate (L/h) = sweat loss / duration (h)', '% mass change = (before − after) / before × 100', '1 kg of mass change is taken as ~1 L of fluid'],
      [`${num(s.v.pre, 1)} − ${num(s.v.post, 1)} + ${num(s.v.fluid, 2)} − ${num(r.urine, 2)} = ${num(r.loss, 2)} L`, `${num(r.loss, 2)} / ${num(r.hrs, 2)} = ${num(r.rate, 2)} ${T.rateUnit}`], ['sawka', 'nata', 'eah']) : ''}`;
  return `${card('h-sw', T.rateRow, 'sweat', inner, false)}${copyCard(m10Copy())}`;
}
function m10Copy() {
  const s = m10State(), r = m10Calc(s), T = T5();
  if (!r) return null;
  const pctTxt = r.gain ? `+${num(-r.pct, 2)}%` : `−${num(r.pct, 2)}%`;
  const lines = [`${T.rateRow} ${num(r.rate, 2)} ${T.rateUnit}; ${T.lossRow.toLowerCase()} ${num(r.loss, 2)} L dalam ${num(s.v.dur)} ${lang === 'id' ? 'menit' : 'min'}; ${T.pctRow.toLowerCase()} ${pctTxt}`.replace(' dalam ', lang === 'id' ? ' dalam ' : ' over '),
    r.gain ? (lang === 'id' ? 'PERINGATAN: BB naik — minum berlebihan, risiko EAH' : 'WARNING: mass gain — overdrinking, EAH risk') : (r.pct > 2 ? (lang === 'id' ? 'Kehilangan >2% BB' : 'Loss >2% of body mass') : (lang === 'id' ? 'Kehilangan ≤2% BB' : 'Loss ≤2% of body mass'))];
  const body = [...lines, t().srcLine('ACSM 2007; NATA 2017; EAH 2015')], M = MODULES.find(m => m.id === 'm10');
  return { text: [t().copyHeaderMod(10, M.title[lang], todayStr()), ...body].join('\n'), body };
}
function renderM510(mod) {
  const i = MODULES.findIndex(m => m.id === mod), M = MODULES[i], T = T5();
  const s = mod === 'm5' ? m5State() : m10State();
  const tabs = mod === 'm5' ? `<div class="seg" role="group" aria-label="${esc(M.title[lang])}">${[['fat', T.tabFat], ['som', T.tabSomato]].map(([k, l]) => `<button type="button" data-m5tab="${k}" aria-pressed="${S.m5.tab === k}">${esc(l)}</button>`).join('')}</div>` : '';
  app.innerHTML = `${pageHeader(t().moduleLabel(String(i + 1).padStart(2, '0'), M.cat[lang]), M.title[lang], T[`${mod}Sub`])}
  <main class="main">
    <div class="note">${svg('body', '#9A3412')}<span>${esc(T[`${mod}Pop`])}</span></div>
    ${tabs}
    <section class="card" aria-labelledby="h-in">
      <div class="row-between"><h2 class="h2" id="h-in">${esc(t().dataIn)}</h2><span class="muted"><span class="req">*</span> ${esc(t().required)}</span></div>
      <div id="fields">${mod === 'm5' ? m5Fields(s) : m10Fields(s)}</div>
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().storedNote)}</span></div>
    </section>
    <div id="modout">${mod === 'm5' ? m5Out(s) : m10Out(s)}</div>
    <div class="foot"><span>${esc(T[`${mod}Sources`])}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('calc')}`;
}
function refreshM510(mod, keepInputs = false) {
  const s = mod === 'm5' ? m5State() : m10State();
  if (keepInputs) updateFieldMsgs(s); else document.getElementById('fields').innerHTML = mod === 'm5' ? m5Fields(s) : m10Fields(s);
  document.getElementById('modout').innerHTML = mod === 'm5' ? m5Out(s) : m10Out(s);
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
const fxBtn = (id, src = false) => `<button type="button" class="linkbtn" data-mfx="${id}" aria-expanded="${UI.mfx.has(id)}" aria-controls="mfx-${id}">${esc(UI.mfx.has(id) ? (src ? t().hideSrc : t().hideF) : (src ? t().showSrc : t().showF))}${svg('chev', '#9A3412', 16)}</button>`;
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
    const rows = NUZZO[ex].filter(([p]) => p >= 50).map(([p, m, sd]) => `<tr><td>${p}%</td><td><b>${num(round05(basisVal * p / 100), 1)}</b> kg</td><td>${num(m, 1)} ± ${num(sd, 1)}</td></tr>`).join('');
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
  else { const mm = h.match(/^#\/m\/(m2|m3)$/); if (mm) refreshMod(mm[1], keepInputs); const mc = h.match(/^#\/m\/(m4|m8)$/); if (mc) refreshCustom(mc[1], keepInputs); const md = h.match(/^#\/m\/(m5|m10)$/); if (md) refreshM510(md[1], keepInputs); }
}
function currentState() { const mm = location.hash.match(/^#\/m\/(m2|m3)$/); if (mm) return modState(mm[1]); const mc = location.hash.match(/^#\/m\/(m4|m8)$/); if (mc) return customState(mc[1]); if (location.hash === '#/m/m5') return m5State(); if (location.hash === '#/m/m10') return m10State(); return m1State(); }

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
  const sk = skrCopy();
  if (sk) out.push({ id: 'skr', title: t().skrTitle, text: sk.text, body: sk.body });
  m1Out(m1State());
  if (UI.copy) out.push({ id: 'm1', title: MODULES[0].title[lang], text: UI.copy, body: UI.copy.split('\n').slice(1) });
  for (const mod of ['m2', 'm3', 'm4', 'm5', 'm8', 'm10']) {
    const c = mod === 'm4' || mod === 'm8' ? customCopy(mod) : mod === 'm5' ? m5Copy() : mod === 'm10' ? m10Copy() : modCopy(mod);
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
  if (h === '#/m/skr') renderSkr();
  else if (mm) {
    const i = MODULES.findIndex(m => m.id === mm[1]);
    if (i === 0) renderM1(); else if (mm[1] === 'm2' || mm[1] === 'm3') renderMod(mm[1]); else if (mm[1] === 'm4' || mm[1] === 'm8') renderCustom(mm[1]); else if (mm[1] === 'm5' || mm[1] === 'm10') renderM510(mm[1]); else if (i > 0) renderWip(MODULES[i], i + 1); else renderHome();
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
  if (e.target.id === 'eqSel') { S.m5.eq = e.target.value; save(); UI.ffmCopied = false; refreshM510('m5'); document.getElementById('eqSel')?.focus(); return; }
  if (e.target.id === 'rmrBasis') { S.m4.basis = e.target.value; save(); refreshCustom('m4'); document.getElementById('rmrBasis')?.focus(); return; }
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
  if (b.dataset.mfx && location.hash === '#/m/skr') { const k = b.dataset.mfx; UI.mfx.has(k) ? UI.mfx.delete(k) : UI.mfx.add(k); refreshSkr(`[data-mfx="${k}"]`); return; }
  if (b.dataset.part) { S.skr.part = b.dataset.part; save(); refreshSkr(`[data-part="${b.dataset.part}"]`); return; }
  if (b.dataset.yn) { S.skr[b.dataset.yn] = S.skr[b.dataset.yn] === b.dataset.v ? '' : b.dataset.v; if (!acsmNeedIntent()) { S.skr.intent = ''; S.skr.cleared = ''; } if (S.skr.intent !== 'vig') S.skr.cleared = ''; save(); UI.clearArmed = false; refreshSkr(`[data-yn="${b.dataset.yn}"][data-v="${b.dataset.v}"]`); return; }
  if (b.dataset.aha) { const k = b.dataset.aha; if (S.skr.aha[k] === b.dataset.v) delete S.skr.aha[k]; else S.skr.aha[k] = b.dataset.v; save(); UI.clearArmed = false; refreshSkr(`[data-aha="${k}"][data-v="${b.dataset.v}"]`); return; }
  if ('aharest' in b.dataset) { AHA14.forEach(x => { if (!S.skr.aha[x.k]) S.skr.aha[x.k] = 'n'; }); save(); refreshSkr('#h-ah'); return; }
  if (b.dataset.parq) { S.skr.parq = S.skr.parq === b.dataset.parq ? '' : b.dataset.parq; save(); refreshSkr(`[data-parq="${b.dataset.parq}"]`); return; }
  if (b.dataset.m5tab) { S.m5.tab = b.dataset.m5tab; save(); renderM510('m5'); document.querySelector(`[data-m5tab="${b.dataset.m5tab}"]`)?.focus(); return; }
  if ('useffm' in b.dataset) { const r = m5FatCalc(m5State()); if (r) { S.m4.v['x.ffm'] = String(Math.round(r.ffm * 10) / 10).replace('.', lang === 'id' ? ',' : '.'); save(); UI.ffmCopied = true; refreshM510('m5'); document.querySelector('[data-useffm]')?.focus(); } return; }
  if (b.dataset.mfx && /^#\/m\/(m5|m10)$/.test(location.hash)) { const k = b.dataset.mfx, mod = location.hash.slice(4); UI.mfx.has(k) ? UI.mfx.delete(k) : UI.mfx.add(k); refreshM510(mod); document.querySelector(`[data-mfx="${k}"]`)?.focus(); return; }
  if (b.dataset.cho) { S.m4.cho = S.m4.cho === b.dataset.cho ? '' : b.dataset.cho; save(); refreshCustom('m4'); document.querySelector(`[data-cho="${b.dataset.cho}"]`)?.focus(); return; }
  if (b.dataset.mfx && /^#\/m\/(m4|m8)$/.test(location.hash)) { const k = b.dataset.mfx, mod = location.hash.slice(4); UI.mfx.has(k) ? UI.mfx.delete(k) : UI.mfx.add(k); refreshCustom(mod); document.querySelector(`[data-mfx="${k}"]`)?.focus(); return; }
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
