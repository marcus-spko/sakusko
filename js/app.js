// SakuSKO — aplikasi utama. Tanpa server, tanpa penyimpanan data pasien.
import { HRMAX, HRMAX_ORDER, hrmax, hrmaxApplies, acsmZones, karvonen, LIMITS, rmEpley, rmBrzycki, NUZZO, round05,
  rmrTenHaaf, rmrMifflin, rmrCunningham, energyAvail, CHO, PROTEIN, FAT_PCT, PAL_BANDS,
  bmi, bmiCat, centralObese, whtr, whr, whrHigh,
  siri, jp3Men, jpw3Women, dwRow, dwDensity, hastutiAbd, ffmFrom, targetWeight, endomorphy, mesomorphy, hwr, ectomorphy, somatoXY, somatoCategory,
  sweatLoss, sweatRate, bmChangePct, lsiDist, lsiTime, hqRatio } from './formulas.js';
import { TESTS, REF, RM_INFO } from './tests.js';
import { M48_REF, M4_FIELDS, M8_FIELDS, M48_T } from './m48.js';
import { M510_REF, SITES, EQS, EQ_ORDER, SOMATO_SITES, M10_FIELDS, M510_T, GUIDE, GUIDE_GENERAL, GUIDE_SRC, SOMATO_CAT } from './m510.js';
import { NYPR, nyprSvg, NYPR_REF } from './nypr.js';
import { M79_REF, SUPPS, M7_SAFE, LSI_ROWS, HQ_FIELDS, M79_T } from './m79.js';
import { SOS, SOS_REF, SOS_T, CONC } from './darurat.js';
import { SCAT6, SCAT6C, scat6Scores, childScat6Scores } from './scat6.js';
import { MODULES, T, M1_FORMULAS, KARVONEN_REF, GLOSSARY, ABOUT } from './i18n.js';
import { S, load, save, clear, expireIfDue, expiresAt, isEmpty } from './session.js';
import { startTitleCase } from './titlecase.js';
import { SKR_REF, LINKS, ACSM_Q, ACSM_Q_INTENT, ACSM_Q_CLEAR, acsmResult, ACSM_ALWAYS, AHA14, AHA_GROUPS } from './screening.js';
import { PARQ_FORM, parqStatus } from './parq.js';

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
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  brain: '<path d="M9.5 3A2.5 2.5 0 0 0 7 5.5v.3A3 3 0 0 0 4.5 9a3 3 0 0 0 .5 5.2A3 3 0 0 0 9 19.5h.5V3Z"/><path d="M14.5 3A2.5 2.5 0 0 1 17 5.5v.3A3 3 0 0 1 19.5 9a3 3 0 0 1-.5 5.2 3 3 0 0 1-4 5.3h-.5V3Z"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3 0-3-1-6-4-9 0 4-4 7-4 13 0 4 3 7 7 7Z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/>',
  chevr: '<path d="m9 18 6-6-6-6"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
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
const UI = { guide: new Set(), open: new Set(), karvOpen: false, touched: new Set(), measWasOk: undefined, copy: null, flash: '', clearArmed: false, mfx: new Set(), rmMeasWas: undefined };
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
  const items = [['#/', 'grid', t().navCalc, 'calc'], ['#/ringkasan', 'list', t().navSum, 'sum'], ['#/darurat', 'alert', TS().sosTitle, 'sos'], ['#/glosarium', 'book', t().navGloss, 'gloss'], ['#/tentang', 'info', t().navAbout, 'about']];
  return `<nav class="nav" aria-label="Navigasi utama"><div class="nav-in">${items.map(([h, ic, l, k]) =>
    `<a href="${h}" ${k === 'sos' ? 'class="sos" ' : ''}${active === k ? 'aria-current="page"' : ''}>${svg(ic)}<span>${esc(l)}</span></a>`).join('')}</div></nav>`;
}
function brandHeader() {
  return `<header class="hdr"><div class="hdr-row"><div class="brand"><span class="logo">${svg('heart', '#FF8A3D', 22, 2.2)}</span>
    <div><div class="brand-name">SakuSKO</div><div class="brand-tag">${esc(t().tagline)}</div></div></div>${langToggle()}</div>${chip()}</header>`;
}
function pageHeader(kicker, title, sub, danger = false, backHref = '#/') {
  return `<header class="hdr${danger ? ' danger' : ''}"><div class="hdr-row"><a class="back" href="${backHref}" aria-label="${esc(t().back)}">${svg('back', '#1C1206', 22, 2.4)}</a>${langToggle()}</div>
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
  const ok = S.base.age !== '' && !err.age;                           // HRmax hanya butuh usia
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
        <span class="hint">${esc(info.pop[lang])}</span></div><span class="frow-val">${v}</span></div>
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
      <span class="hint" style="margin-top:-8px">${esc(t().rangeNote(keys.length))}</span>
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
// PAR-Q+ digital: teks kata per kata dari formulir resmi (lihat parq.js)
const pqForm = () => PARQ_FORM[S.skr.pqLang || lang];
const pqVerShort = () => ((S.skr.pqLang || lang) === 'id' ? 'PAR-Q+ 2020 (versi Indonesia)' : 'PAR-Q+ 2025');
function pqSeg(key, val, lid, F) {
  return `<div class="seg" role="group" aria-labelledby="${lid}">
    <button type="button" data-pq="${key}" data-v="y" aria-pressed="${val === 'y'}">${esc(F.yes)}</button>
    <button type="button" data-pq="${key}" data-v="n" aria-pressed="${val === 'n'}">${esc(F.no)}</button></div>`;
}
const pqList = (key, label) => `<label class="field pqlist"><span class="qtext pqcap">${esc(label)}</span>
  <span class="inbox"><input type="text" data-pqtxt="${key}" maxlength="200" autocomplete="off" value="${esc(S.skr.pq.txt[key] || '')}" placeholder="${esc(t().pqListPh)}"></span></label>`;
const pqUl = items => `<ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
function pqDecl(d) {
  return `<div class="pqbox"><span class="qtext pqcap">${esc(d.head)}</span>${pqUl(d.bullets)}<span class="pqtext">${esc(d.text)}</span>
    <span class="hint">${esc(d.fields)}</span><span class="hint">${esc(t().pqSignNote)}</span></div>`;
}
function skrParq() {
  const F = pqForm(), a = S.skr.pq, st = parqStatus(F, a), cur = S.skr.pqLang || lang;
  const gen = F.gen.map(q => {
    const lid = `pq-g${q.n}`, v = a.g[q.n];
    const chips = q.n === '1' && v === 'y' ? `<div class="optlist pqchips" role="group" aria-labelledby="${lid}">${F.q1parts.map((l, i) => `<button type="button" data-pqq1="${i}" aria-pressed="${!!a.q1[i]}">${esc(l)}</button>`).join('')}</div>` : '';
    return `<div class="field pqq"><span class="qtext" id="${lid}"><b>${q.n})</b> ${esc(q.t)}</span>${q.note ? `<span class="hint">${esc(q.note)}</span>` : ''}
      ${pqSeg(`g${q.n}`, v, lid, F)}${chips}${q.list && v === 'y' ? pqList(`g${q.n}`, q.list) : ''}</div>`;
  }).join('');
  let after = '';
  if (!st.genDone) after = `<section class="card" style="margin-top:14px"><p class="empty" style="margin:0">${esc(t().pqAnswerGen)}</p></section>`;
  else if (st.stage === 'p1clear') {
    after = `<section class="card" style="margin-top:14px" aria-label="${esc(t().result)}">
      <div class="pqbox ok" role="status">${F.p1Clear.head.map(h => `<span class="qtext pqcap">${esc(h)}</span>`).join('')}${pqUl(F.p1Clear.items)}</div>
      ${pqDecl(F.decl1)}
      <div class="pqbox warn"><span class="qtext pqcap">${esc(F.delay1.head)}</span>${pqUl(F.delay1.items)}</div></section>`;
  } else {
    const secs = F.fu.map(sec => {
      const lid = `pq-f${sec.n}`, v = a.f[sec.n];
      const subs = v === 'y' ? `<div class="pqsubs">${sec.subs.map(x => `<div class="field"><span class="qtext" id="pq-f${x.n}"><b>${x.n}.</b> ${esc(x.t)}</span>${pqSeg(`f${x.n}`, a.f[x.n], `pq-f${x.n}`, F)}</div>`).join('')}
        ${sec.list ? pqList('f10', sec.list) : ''}</div>` : '';
      return `<div class="field pqq"><span class="qtext" id="${lid}"><b>${sec.n}.</b> ${esc(sec.t)}</span><span class="hint">${esc(sec.ifYes)} · ${esc(sec.ifNo)}</span>${pqSeg(`f${sec.n}`, v, lid, F)}${subs}</div>`;
    }).join('');
    let p4 = '';
    if (st.stage === 'fu') p4 = `<p class="empty" style="margin:0">${esc(t().pqAnswerFu)}</p>`;
    else p4 = `<div class="pqbox info"><span class="qtext pqcap">${esc(F.goP4)}</span></div>
      ${st.stage === 'p4clear' ? `<div class="pqbox ok" role="status"><span class="qtext pqcap">${esc(F.p4Clear.head)}</span>${pqUl(F.p4Clear.items)}</div>`
        : `<div class="pqbox stop" role="status"><span class="qtext pqcap">${esc(F.p4Yes.head)}</span><span class="pqtext">${esc(F.p4Yes.text)}</span></div>`}
      <div class="pqbox warn"><span class="qtext pqcap">${esc(F.delay4.head)}</span>${pqUl(F.delay4.items)}</div>
      ${pqUl(F.notes).replace('<ul>', '<ul class="pqnotes">')}
      ${pqDecl(F.decl4)}`;
    after = `<section class="card" style="margin-top:14px"><div class="pqbox stop"><span class="qtext pqcap">${esc(F.p1Yes)}</span></div></section>
      <section class="card" style="margin-top:14px" aria-labelledby="h-pqf"><h2 class="h2 pqhead" id="h-pqf">${esc(F.fuHead)}</h2>
      <div style="display:flex;flex-direction:column;gap:16px">${secs}</div></section>
      <section class="card" style="margin-top:14px" aria-label="${esc(t().result)}">${p4}</section>`;
  }
  const src = UI.mfx.has('parq') ? `<div class="fbox" id="mfx-parq">${F.info.map(x => `${x.h ? `<span class="k">${esc(x.h)}</span>` : ''}<span class="r">${esc(x.t)}</span>`).join('')}
      <span class="k">${esc(F.refsHead)}</span>${F.refs.map(r => `<span class="r">${esc(r)}</span>`).join('')}
      <span class="k">${esc(t().fSource)}</span>${skrRefs(['parq', 'parqId'])}<span class="hint">${esc(t().doiNote)}</span></div>` : '';
  return `<section class="card" aria-labelledby="h-pq"><h2 class="h2" id="h-pq">${esc(F.title)}</h2>
      <span class="qtext pqcap">${esc(F.subtitle)}</span>
      <div class="field"><span class="lbl" id="pqVer">${esc(t().pqForm)}</span><div class="seg" role="group" aria-labelledby="pqVer">
        <button type="button" data-pqlang="id" aria-pressed="${cur === 'id'}">${esc(t().pqVerId)}</button><button type="button" data-pqlang="en" aria-pressed="${cur === 'en'}">${esc(t().pqVerEn)}</button></div>
        <span class="hint">${esc(F.version)}</span></div>
      <span class="pqtext">${esc(F.intro)}</span>
      <div class="note">${svg('info', '#9A3412')}<span>${esc(t().pqAppNote)}</span></div></section>
    <section class="card" style="margin-top:14px" aria-labelledby="h-pqg"><h2 class="h2 pqhead" id="h-pqg">${esc(F.genHead)}</h2>
      <span class="hint">${esc(F.genInstr)}</span>
      <div style="display:flex;flex-direction:column;gap:16px">${gen}</div></section>
    ${after}
    <section class="card" style="margin-top:14px" aria-labelledby="h-pqo"><h2 class="h2" id="h-pqo">${esc(t().parqHead)}</h2>
      ${linkBtn(LINKS.parq25, 'file', t().parqOpen25)}${linkBtn(LINKS.parqId, 'file', t().parqOpenId)}${linkBtn(LINKS.eparmed, 'link', t().parqEpar)}
      <span class="hint">${esc(t().parqIdNote)}</span>
      ${fxBtn('parq', true)}${src}
      <button type="button" class="linkbtn" data-pqreset>${esc(t().pqReset)}</button></section>`;
}
function pqCopyLines() {
  const F = pqForm(), a = S.skr.pq, st = parqStatus(F, a);
  if (!st.genDone) return [];
  const yesGen = F.gen.filter(q => a.g[q.n] === 'y').map(q => {
    const extra = [...(q.n === '1' ? F.q1parts.filter((l, i) => a.q1[i]) : []), ...(q.list && a.txt[`g${q.n}`] ? [a.txt[`g${q.n}`].trim()] : [])].filter(Boolean);
    return `${q.n}${extra.length ? ` (${extra.join('; ')})` : ''}`;
  });
  const lines = [`${pqVerShort()} — ${t().pqGen}: ${yesGen.length ? `${F.yes} ${t().pqOn} ${yesGen.join(', ')}` : t().pqAllNo(F.no)}`];
  if (st.stage === 'p1clear') lines.push(`${t().pqResult}: ${F.p1Clear.head[0]}`);
  else {
    const cond = F.fu.filter(sec => a.f[sec.n] === 'y').map(sec => sec.n);
    if (st.stage === 'fu') lines.push(t().pqFuIncomplete);
    else {
      lines.push(`${t().pqFu}: ${cond.length ? `${t().pqCond} ${cond.join(', ')}` : t().pqNoCond}${st.fuYes.length ? `; ${F.yes} ${t().pqOn} ${st.fuYes.join(', ')}` : cond.length ? `; ${t().pqAllNo(F.no)}` : ''}${a.f['10'] === 'y' && a.txt.f10 ? ` (${a.txt.f10.trim()})` : ''}`);
      lines.push(`${t().pqResult}: ${st.stage === 'p4yes' ? `${F.p4Yes.head} ${F.p4Yes.text}` : F.p4Clear.head.replace(/:\s*$/, '.')}`);
    }
  }
  return lines;
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
      ${fxBtn('aha', true)}${UI.mfx.has('aha') ? `<div class="fbox" id="mfx-aha"><span class="k">${esc(t().fSource)}</span>${skrRefs(['maron', 'kim25', 'ppe'])}<span class="hint">${esc(t().doiNote)}</span></div>` : ''}
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
  const pql = pqCopyLines(); lines.push(...pql);
  const st = ahaState();
  if (st.answered === st.n) lines.push(t().copyAha(st.answered, st.n, st.pos.length ? `${t().ahaPos(st.pos.length)}: ${st.pos.map(x => x[lang]).join('; ')}` : t().ahaNone));
  if (!lines.length) return null;
  const refs = [r ? 'Riebe 2015' : '', pql.length ? pqVerShort() : '', st.answered === st.n ? 'Maron (AHA/ACC) 2014' : ''].filter(Boolean).join('; ');
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
  if (Number.isFinite(v.ffm)) r.eq.cun = rmrCunningham(v.ffm);
  r.eq.mif = rmrMifflin(b.weight, b.height, b.age, male);
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
  const rows = ['th', 'cun', 'mif'].map(k => row(k, r.eq[k] ? `${num(r.eq[k])} <small>${esc(T.kcal)}</small>` : `<span class="opt">${esc(T.needFfm)}</span>`, k === 'th' ? T.main : '')).join('');
  const fRmr = lang === 'id'
    ? ['Ten Haaf (BB): 11,936×BB + 587,728×TB(m) − 8,129×usia + 191,027×JK + 29,279', 'Cunningham: 500 + 22×FFM',
      'Mifflin-St Jeor: 10×BB + 6,25×TB(cm) − 5×usia + 5 (pria) / − 161 (wanita)', 'BB = berat badan (kg); TB = tinggi badan; JK: pria = 1, wanita = 0']
    : ['Ten Haaf (mass): 11.936×W + 587.728×H(m) − 8.129×age + 191.027×sex + 29.279', 'Cunningham: 500 + 22×FFM',
      'Mifflin-St Jeor: 10×W + 6.25×H(cm) − 5×age + 5 (men) / − 161 (women)', 'W = body mass (kg); H = height; sex: male = 1, female = 0'];
  const cf = c => (lang === 'id' ? String(c).replace('.', ',') : String(c));
  const sRmr = [`Ten Haaf: ${cf(11.936)}×${num(b.weight, 1)} + ${cf(587.728)}×${num(b.height / 100, 2)} − ${cf(8.129)}×${num(b.age)} + ${cf(191.027)}×${male ? 1 : 0} + ${cf(29.279)} = ${num(r.eq.th)}`];
  const rmrCard = card('h-rmr', T.rmrHead, 'rmr', `${rows}
    ${r.outAge ? `<div class="note">${svg('alert', '#9A3412')}<span>${esc(T.tenHaafAge)}</span></div>` : ''}
    <span class="hint">${esc(t().popLbl)}: ${esc(lang === 'id' ? 'Ten Haaf: 90 atlet rekreasional Belanda 18–35 th; meta-analisis 2023 (29 studi, 1.430 atlet) menilainya paling presisi. Cunningham: butuh FFM; pada 125 atlet elit Malaysia meleset paling banyak ±6%. Mifflin-St Jeor: 498 dewasa sehat non-atlet; cenderung meleset pada atlet.' : 'Ten Haaf: 90 Dutch recreational athletes aged 18–35; a 2023 meta-analysis (29 studies, 1,430 athletes) found it most precise. Cunningham: needs FFM; within ±6% in 125 Malaysian elite athletes. Mifflin-St Jeor: 498 healthy non-athlete adults; tends to miss in athletes.')}</span>
    ${fxBtn('rmr')}${UI.mfx.has('rmr') ? fxBox48('rmr', fRmr, sRmr, ['tenhaaf', 'oneill', 'cunningham', 'wong', 'mifflin']) : ''}`, false);
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
    ${r.fat ? kvRow(T.fatRow, `${rng(r.fat[0], r.fat[1])} ${gday}`) : `${kvRow(T.fatRow, T.fatNeedShort)}<span class="hint">${esc(T.fatNeed)}</span>`}
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
  if (!S.m5.eq || !EQS[S.m5.eq] || !ok(S.m5.eq)) S.m5.eq = sex === 'F' ? 'dw' : 'hastuti';
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
    const gk = k === 'abd' && S.m5.tab !== 'som' && m5Eq() === 'jp3' ? 'abdJp' : k;
    if (GUIDE[gk]) {
      const open = UI.guide.has(k);
      out.push(`<button type="button" class="linkbtn guidebtn" data-guide="${k}" aria-expanded="${open}">${esc(open ? T5().hideHowTo : T5().howTo)}${svg('chev', '#9A3412', 16)}</button>${open ? `<div class="fbox guidebox"><span class="r">${esc(GUIDE[gk][lang])}</span></div>` : ''}`);
    }
  }
  const go = UI.guide.has('_gen');
  out.push(`<button type="button" class="linkbtn guidebtn" data-guide="_gen" aria-expanded="${go}">${esc(T5().genTech)}${svg('chev', '#9A3412', 16)}</button>${go ? `<div class="fbox guidebox"><span class="r">${esc(GUIDE_GENERAL[lang])}</span><span class="hint">${esc(GUIDE_SRC[lang])}</span></div>` : ''}`);
  return `<div style="display:flex;flex-direction:column;gap:14px">${out.join('')}</div>`;
}
function m5FatCalc(s) {
  const eq = m5Eq(), E = EQS[eq], v = s.v, b = s.b;
  if (s.missing.length || !E.sites.every(k => Number.isFinite(v[k]))) return null;
  const sum = E.sites.reduce((a, k) => a + v[k], 0), r = { eq, sum };
  if (eq === 'hastuti') r.pct = hastutiAbd(v.abd, v.tri, b.age);
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
  const h = hwr(b.height, b.weight), ec = ectomorphy(h), xy = somatoXY(en, me, ec), r1 = x => Math.round(x * 10) / 10;
  return { en, me, ec, h, ...xy, cat: somatoCategory(r1(en), r1(me), r1(ec)) };
}
function somatochart(r, T) {
  // Somatochart Carter: X = ekto − endo, Y = 2·meso − (endo + ekto). Bingkai menghubungkan kutub 7-1-1, 1-7-1, 1-1-7.
  const W = 344, H = 444, sx = x => 176 + x * 17.5, sy = y => 238 - y * 17;
  const P = (x, y) => `${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
  const px = Math.max(-8.5, Math.min(8.5, r.x)), py = Math.max(-10, Math.min(13.5, r.y));
  const frame = `M${P(-6, -6)} Q${P(-5.5, 7)} ${P(0, 12)} Q${P(5.5, 7)} ${P(6, -6)} Q${P(0, -11.4)} ${P(-6, -6)} Z`;
  const ticksX = [-8, -6, -4, -2, 2, 4, 6, 8], ticksY = [-10, -8, -6, -4, -2, 2, 4, 6, 8, 10, 12];
  const grid = ticksX.map(x => `<line x1="${sx(x)}" y1="${sy(13.5)}" x2="${sx(x)}" y2="${sy(-10.5)}" stroke="#F3E3D3" stroke-width="0.8"/>`).join('')
    + ticksY.map(y => `<line x1="${sx(-9)}" y1="${sy(y)}" x2="${sx(9)}" y2="${sy(y)}" stroke="#F3E3D3" stroke-width="0.8"/>`).join('');
  const lab = (x, y, t, o = {}) => `<text x="${sx(x)}" y="${sy(y)}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 8}" ${o.it === false ? '' : 'font-style="italic"'} font-weight="${o.fw || 600}" fill="${o.c || '#5C4F45'}">${esc(t)}</text>`;
  const two = (x, y, a, b) => lab(x, y + 0.3, a) + lab(x, y - 0.4, b);
  const hex = `M${P(0, 2)} L${P(1, 1)} L${P(1, -1)} L${P(0, -2)} L${P(-1, -1)} L${P(-1, 1)} Z`;
  const lbl = `${num(r.en, 1)}-${num(r.me, 1)}-${num(r.ec, 1)}`;
  const lx = sx(px) + (px > 3 ? -10 : 10), anchor = px > 3 ? 'end' : 'start';
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(T.chartTitle)}: ${lbl}; X ${num(r.x, 1)}, Y ${num(r.y, 1)}" style="max-width:360px;display:block;margin:0 auto">
    <defs><clipPath id="soclip"><path d="${frame}"/></clipPath></defs>
    <rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="#FFFFFF"/>${grid}
    <line x1="${sx(-9)}" y1="${sy(0)}" x2="${sx(9)}" y2="${sy(0)}" stroke="#C9B8A8" stroke-width="1"/>
    <line x1="${sx(0)}" y1="${sy(13.5)}" x2="${sx(0)}" y2="${sy(-10.5)}" stroke="#C9B8A8" stroke-width="1"/>
    <path d="${frame}" fill="#FFF1E6"/>
    <g clip-path="url(#soclip)" stroke="#9A3412" stroke-width="1" stroke-dasharray="4 3">
      <line x1="${sx(0)}" y1="${sy(12)}" x2="${sx(0)}" y2="${sy(-12)}"/><line x1="${sx(-6)}" y1="${sy(-6)}" x2="${sx(6)}" y2="${sy(6)}"/><line x1="${sx(6)}" y1="${sy(-6)}" x2="${sx(-6)}" y2="${sy(6)}"/></g>
    <path d="${hex}" fill="#FFE3CC" stroke="#E8A87C" stroke-width="1"/>
    <path d="${frame}" fill="none" stroke="#1C1206" stroke-width="2"/>
    ${two(-2.2, 5.6, 'Endomorphic', 'mesomorph')}${two(2.2, 5.6, 'Ectomorphic', 'mesomorph')}
    ${two(-3.9, -0.2, 'Mesomorphic', 'endomorph')}${two(3.9, -0.2, 'Mesomorphic', 'ectomorph')}
    ${two(-2.3, -6.6, 'Ectomorphic', 'endomorph')}${two(2.3, -6.6, 'Endomorphic', 'ectomorph')}
    ${lab(0, -1.25, 'Central', { fs: 8, c: '#9A3412' })}
    ${ticksX.map(x => `<text x="${sx(x)}" y="${sy(-10.5) + 12}" text-anchor="middle" font-size="8" fill="#5C4F45">${x}</text>`).join('')}
    ${ticksY.map(y => `<text x="${sx(-9) - 4}" y="${sy(y) + 3}" text-anchor="end" font-size="8" fill="#5C4F45">${y}</text>`).join('')}
    ${lab(0, 12.6, T.chartMeso, { fs: 10, fw: 800, c: '#1C1206', it: false })}
    ${lab(-8.8, -9.7, T.chartEndo, { fs: 10, fw: 800, c: '#1C1206', it: false, a: 'start' })}${lab(8.8, -9.7, T.chartEcto, { fs: 10, fw: 800, c: '#1C1206', it: false, a: 'end' })}
    <text x="${sx(9)}" y="${sy(0) - 4}" text-anchor="end" font-size="8" fill="#5C4F45">X</text><text x="${sx(0) + 4}" y="${sy(13.5) + 8}" font-size="8" fill="#5C4F45">Y</text>
    <circle cx="${sx(px)}" cy="${sy(py)}" r="6.5" fill="#FF8A3D" stroke="#1C1206" stroke-width="2"/>
    <text x="${lx}" y="${sy(py) - 8}" text-anchor="${anchor}" font-size="11" font-weight="800" fill="#1C1206" stroke="#FFFFFF" stroke-width="3" paint-order="stroke">${lbl}</text>
  </svg>`;
}
function m5Out(s) {
  const T = T5();
  if (S.m5.tab === 'som') {
    const r = m5SomCalc(s);
    const inner = !r ? emptyP(T.somNeed) : `<div class="big"><b>${num(r.en, 1)}-${num(r.me, 1)}-${num(r.ec, 1)}</b></div>
      ${kvRow(T.endo, num(r.en, 1))}${kvRow(T.meso, num(r.me, 1))}${kvRow(T.ecto, num(r.ec, 1))}${kvRow(T.hwrRow, num(r.h, 1))}${kvRow(T.xy, `${num(r.x, 1)}; ${num(r.y, 1)}`)}${kvRow(T.catRow, SOMATO_CAT[r.cat][0])}<span class="hint">${esc(SOMATO_CAT[r.cat][1][lang])}</span>
      <h3 class="h2" style="font-size:15px;margin-top:6px">${esc(T.chartTitle)}</h3>${somatochart(r, T)}<span class="hint">${esc(T.catNote)}</span>
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
      : ['%lemak = 8,000 + 0,402×abdomen + 0,486×triseps + 0,059×usia'];
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
      ${fxBtn('fat')}${UI.mfx.has('fat') ? fxBox510('fat', [...fxL, lang === 'id' ? 'FFM = BB × (1 − %lemak/100); BB target = FFM / (1 − target%/100)' : 'FFM = mass × (1 − %fat/100); target mass = FFM / (1 − target%/100)'], sL, [...E.refs, 'ackland', 'mathisen']) : ''}`;
  }
  return `${card('h-fat', T.pctFat, 'ffm', inner, false)}${copyCard(m5Copy())}`;
}
function m5Copy() {
  const s = m5State(), T = T5(), lines = [], src = [];
  const r = m5FatCalc(s);
  if (r) {
    const E = EQS[r.eq];
    lines.push(`${E.name[lang]}: Σ ${n1(r.sum)} mm → ${num(r.pct, 1)}% ${lang === 'id' ? 'lemak' : 'fat'}; FFM ${num(r.ffm, 1)} kg${r.tw !== undefined ? `; ${lang === 'id' ? 'BB target' : 'target mass'} (${n1(s.v.target)}% ${lang === 'id' ? 'lemak' : 'fat'}) ${num(r.tw, 1)} kg` : ''}${r.outAge ? (lang === 'id' ? ' (usia di luar populasi asal)' : ' (age outside derivation sample)') : ''}`);
    src.push({ hastuti: 'Hastuti 2013', dw: 'Durnin & Womersley 1974', jp3: 'Jackson & Pollock 1978', jpw3: 'Jackson, Pollock & Ward 1980' }[r.eq]);
  }
  const so = m5SomCalc(s);
  if (so) { lines.push(`${T.somRating} Heath-Carter: ${num(so.en, 1)}-${num(so.me, 1)}-${num(so.ec, 1)} (X ${num(so.x, 1)}; Y ${num(so.y, 1)}), ${SOMATO_CAT[so.cat][0]}`); src.push('Carter 2002'); }
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
      [`${num(s.v.pre, 1)} − ${num(s.v.post, 1)} + ${num(s.v.fluid, 2)} − ${num(r.urine, 2)} = ${num(r.loss, 2)} L`, `${num(r.loss, 2)} / ${num(r.hrs, 2)} = ${num(r.rate, 2)} ${T.rateUnit}`], ['sawka', 'nata', 'racinais', 'eah']) : ''}`;
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


// ---------- Modul 6 (Postur NYPR), 7 (suplemen), 9 (LSI & H:Q) ----------
const T7 = () => ({ ...t(), ...M79_T[lang] });
const refsOf = (OBJ, keys) => keys.map(k => `<span class="r">${esc(OBJ[k].ref)}${OBJ[k].doi ? ` <a href="https://doi.org/${OBJ[k].doi}" target="_blank" rel="noopener">doi:${OBJ[k].doi}</a>` : ''}${OBJ[k].url ? ` <a href="${esc(OBJ[k].url)}" target="_blank" rel="noopener">${esc(OBJ[k].url)}</a>` : ''}</span>`).join('');
const srcBox = (id, OBJ, keys, f = []) => `<div class="fbox" id="mfx-${id}">${f.length ? `<span class="k">${esc(t().fFormula)}</span>${f.map(x => `<span class="f" style="font-size:14px">${esc(x)}</span>`).join('')}` : ''}<span class="k">${esc(t().fSource)}</span>${refsOf(OBJ, keys)}<span class="hint">${esc(t().doiNote)}</span></div>`;
function modHeader(mod) { const i = MODULES.findIndex(m => m.id === mod), M = MODULES[i]; return { M, head: pageHeader(t().moduleLabel(String(i + 1).padStart(2, '0'), M.cat[lang]), M.title[lang], T7()[`${mod}Sub`]) }; }
function baseCopy(mod, lines, src) {
  if (!lines.length) return null;
  const body = [...lines, t().srcLine(src)], M = MODULES.find(m => m.id === mod), bs = baseSummary();
  return { text: [t().copyHeaderMod(Number(mod.slice(1)), M.title[lang], todayStr()), ...(bs ? [`${t().baseLabel}: ${bs}`] : []), ...body].join('\n'), body };
}

// ----- Modul 6: NYPR -----
function nyprState() { const sc = S.m6.s, rated = NYPR.filter(x => sc[x.k]), sum = rated.reduce((a, x) => a + sc[x.k], 0); return { rated, sum, done: rated.length === NYPR.length }; }
function nyprCards() {
  const T = T7(), view = S.m6.view;
  return NYPR.map((seg, idx) => ({ seg, no: idx + 1 })).filter(({ seg }) => seg.view === view).map(({ seg, no }) => `<section class="card" aria-labelledby="ny-${seg.k}" style="margin-top:14px">
    <div class="row-between"><h2 class="h2" id="ny-${seg.k}">${no}. ${esc(seg.name[lang])}</h2><span class="muted">${esc(seg.view === 'back' ? T.viewBackLbl : T.viewSideLbl)}</span></div>
    <div class="nylist" role="group" aria-labelledby="ny-${seg.k}">${seg.opts.map(([score, txt], i) => {
      const on = S.m6.s[seg.k] === score;
      return `<button type="button" class="nyopt" data-ny="${seg.k}" data-v="${score}" aria-pressed="${on}"><span class="nyimg">${nyprSvg(seg, i, lang)}</span>
        <span class="nytxt"><span class="nyhead"><b>${score}</b><span class="nylbl">${esc(T.scoreLbl[score])}</span>${on ? `<span class="nypick">${esc(T.picked)}</span>` : ''}</span><span>${esc(txt[lang])}</span></span></button>`; }).join('')}</div></section>`).join('');
}
function nyprResult() {
  const T = T7(), st = nyprState();
  const dev = NYPR.filter(x => S.m6.s[x.k] && S.m6.s[x.k] < 5).map(x => `${x.name[lang]} (${S.m6.s[x.k]})`);
  const inner = !st.done ? `${emptyP(T.nyprIncomplete)}${st.rated.length ? `<span class="hint">${esc(T.progress(st.rated.length, st.sum))}</span>` : ''}`
    : `<div class="big"><b>${st.sum}</b><span>${esc(T.of65)}</span></div><span style="font-size:14px;line-height:1.5"><b>${esc(T.devList)}:</b> ${esc(dev.length ? dev.join(', ') : T.none)}</span>`;
  return card('h-nyr', T.total, null, `${inner}<span class="hint">${esc(T.nyprNote)}</span>${fxBtn('ny', true)}${UI.mfx.has('ny') ? srcBox('ny', NYPR_REF, ['nysed', 'mcroberts']) : ''}`) + copyCard(m6Copy());
}
function m6Copy() {
  const st = nyprState(), T = T7(); if (!st.rated.length) return null;
  const dev = NYPR.filter(x => S.m6.s[x.k] && S.m6.s[x.k] < 5).map(x => `${x.name[lang]} (${S.m6.s[x.k]})`);
  const l = st.done ? `NYPR: ${st.sum}/65; ${T.devList.toLowerCase()}: ${dev.length ? dev.join(', ') : T.none.toLowerCase()}` : `NYPR: ${T.progress(st.rated.length, st.sum)}`;
  return baseCopy('m6', [l, lang === 'id' ? 'Tanpa label kategori (belum tervalidasi)' : 'No category label (not validated)'], 'NYSED 1958; McRoberts 2013');
}
function renderM6() {
  const T = T7(), { head } = modHeader('m6'), st = nyprState();
  app.innerHTML = `${head}<main class="main">
    <div class="note">${svg('body', '#9A3412')}<span><b>${esc(T.prepHead)}.</b> ${esc(T.m6Prep)}</span></div>
    <div class="seg" role="group" aria-label="${esc(T.prepHead)}">${[['back', `${T.viewBack} (6)`], ['side', `${T.viewSide} (7)`]].map(([k, l]) => `<button type="button" data-nyview="${k}" aria-pressed="${S.m6.view === k}">${esc(l)}</button>`).join('')}</div>
    <div class="row-between" style="font-size:12px;font-weight:600;color:var(--muted);flex-wrap:wrap;gap:8px">
      <span style="display:flex;align-items:center;gap:6px"><svg aria-hidden="true" width="22" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="#9A3412" stroke-width="1.5" stroke-dasharray="3 3"/></svg>${esc(T.legendPlumb)}</span>
      <span style="display:flex;align-items:center;gap:6px"><svg aria-hidden="true" width="22" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="#E8590C" stroke-width="2"/></svg>${esc(T.legendDev)}</span></div>
    <div class="sess-bar" id="nyProg">${esc(T.progress(st.rated.length, st.sum))}</div>
    <div id="nycards">${nyprCards()}</div>
    <div id="modout">${nyprResult()}</div>
    <div class="foot"><span>${esc(T.nyprCredit)}</span><span>${esc(T.m6Sources)}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('calc')}`;
}
function refreshM6(cardsToo = true) {
  const T = T7(), st = nyprState();
  if (cardsToo) document.getElementById('nycards').innerHTML = nyprCards();
  document.getElementById('nyProg').textContent = T.progress(st.rated.length, st.sum);
  document.getElementById('modout').innerHTML = nyprResult();
}

// ----- Modul 7: suplemen -----
const gUnit = u => (lang === 'id' ? u : u.replace('hari', 'day').replace('jam', 'h'));
const fmtDose = (vals, unit) => vals.map(v => num(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1)).join('–') + ' ' + gUnit(unit);
const m7W = () => { const w = parse(S.base.weight); return S.base.weight !== '' && !m1State().allErr.weight && Number.isFinite(w) ? w : NaN; };
const m7Cur = () => SUPPS.find(x => x.k === S.m7.sel) || SUPPS[0];
const m7Picked = () => SUPPS.filter(x => S.m7.picked.includes(x.k));
// Nilai satu baris dosis: angka, teks pengganti, atau penanda "isi BB"
const m7Val = (r, w) => (r.t ? r.t[lang] : r.w && !Number.isFinite(w) ? null : fmtDose(r.v, r.u));
function m7Safe() {
  const T = T7();
  return `<section class="card" aria-labelledby="h-safe" style="margin-top:14px"><h2 class="h2" id="h-safe">${esc(T.safeHead)}</h2>
    <div class="pqbox warn" style="margin:0"><ul>${M7_SAFE[lang].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></section>`;
}
function m7Sel() {
  const T = T7();
  const opts = SUPPS.map((sp, i) => `<option value="${sp.k}" ${sp.k === m7Cur().k ? 'selected' : ''}>${i + 1}. ${esc(sp.name[lang])} · ${esc(T.evShort[sp.ev])}${S.m7.picked.includes(sp.k) ? ' ✓' : ''}</option>`).join('');
  return `<section class="card" aria-labelledby="h-m7sel" style="margin-top:14px"><h2 class="h2" id="h-m7sel">${esc(T.suppSel)}</h2>
    <select class="sel" id="m7Sel" aria-labelledby="h-m7sel">${opts}</select>
    <span class="hint">${esc(T.suppHint)}</span></section>`;
}
const spSec = (k, txt) => `<div class="spsec"><span class="k">${esc(k.toUpperCase())}</span><p>${esc(txt)}</p></div>`;
function m7Card() {
  const T = T7(), sp = m7Cur(), w = m7W(), rows = sp.rows(w), on = S.m7.picked.includes(sp.k);
  const missW = rows.some(r => r.w) && !Number.isFinite(w);
  const doses = rows.map(r => { const v = m7Val(r, w); return r.t ? `<div class="frow"><div class="frow-main"><div class="frow-name" style="font-weight:600;font-size:14px">${esc(r.l[lang])}</div></div><span class="m7txt">${esc(v)}</span></div>` : kvRow(r.l[lang], v ?? T.needW); }).join('');
  const badges = `<div class="badges"><span class="badge ${sp.ev === 'moderate' ? 'alt' : ''}">${esc(T.ev[sp.ev])}</span><span class="badge alt">${esc(T.aisLbl(sp.ais))}</span>${on ? `<span class="badge ok">${esc(T.inSum)}</span>` : ''}</div>`;
  return card(`h-${sp.k}`, sp.name[lang], null, `${badges}
    ${spSec(T.fnLbl, sp.fn[lang])}${spSec(T.useLbl, sp.use[lang])}
    <div class="spsec"><span class="k">${esc(T.doseLbl.toUpperCase())}</span>${doses}${missW ? `<span class="hint">${esc(T.needWHint)}</span>` : ''}</div>
    ${spSec(T.timingLbl, sp.timing[lang])}${spSec(T.sideLbl, sp.side[lang])}${spSec(T.cautionLbl, sp.caution[lang])}${spSec(T.noteLbl, sp.note(w)[lang])}
    ${fxBtn(`s-${sp.k}`, true)}${UI.mfx.has(`s-${sp.k}`) ? srcBox(`s-${sp.k}`, M79_REF, sp.refs) : ''}
    <button type="button" class="btn-sec" data-m7pick="${sp.k}" aria-pressed="${on}">${svg(on ? 'check' : 'plus', '#9A3412', 18)}<span>${esc(on ? T.rmSum : T.addSum)}</span></button>`);
}
function m7PickedCard() {
  const T = T7(), list = m7Picked();
  return card('h-m7pick', T.pickedHead, null, list.length ? `<ul class="pqnotes" style="margin:0;color:var(--ink)">${list.map(sp => `<li>${esc(sp.name[lang])}</li>`).join('')}</ul>` : emptyP(T.pickedNone));
}
function m7Out() {
  return `${m7Sel()}${m7Card()}${m7PickedCard()}${copyCard(m7Copy())}`;
}
function m7Copy() {
  const list = m7Picked(); if (!list.length) return null;
  const T = T7(), w = m7W();
  const lines = list.map(sp => `${sp.name[lang]}: ${sp.rows(w).map(r => { const v = m7Val(r, w); return v === null ? null : `${r.l[lang]} = ${v}`; }).filter(Boolean).join('; ') || T.m7Need}`);
  lines.push(T.copyNote);
  const src = [...new Set(list.flatMap(sp => sp.src.split('; ')))].join('; ');
  return baseCopy('m7', lines, src);
}
function renderM7() {
  const T = T7(), { head } = modHeader('m7'), s = m1State();
  app.innerHTML = `${head}<main class="main">
    <section class="card" aria-labelledby="h-in"><div class="row-between"><h2 class="h2" id="h-in">${esc(t().dataIn)}</h2><span class="muted"><span class="req">*</span> ${esc(t().required)}</span></div>
      <div id="fields">${field('weight', t().weight, 'kg', S.base.weight, { err: UI.touched.has('weight') ? s.allErr.weight : '', dec: true })}</div>
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().storedNote)}</span></div></section>
    ${m7Safe()}
    <div id="modout">${m7Out()}</div>
    <div class="foot"><span>${esc(T.m7Sources)}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('calc')}`;
}

// ----- Modul 9: LSI & H:Q -----
const lsiId = (k, side) => fid('m9', 'x', `${k}_${side}`);
function m9State() {
  const v = {}, err = {};
  const chk = (key, lim) => { const raw = S.m9.v[`x.${key}`] ?? '', x = parse(raw), id = fid('m9', 'x', key); v[key] = NaN; if (raw !== '') { if (!(x >= lim[0] && x <= lim[1])) err[id] = t().errRange(...lim); else v[key] = x; } };
  LSI_ROWS.forEach(r => { chk(`${r.k}_i`, r.lim); chk(`${r.k}_u`, r.lim); });
  HQ_FIELDS.forEach(f => chk(f.k, f.lim));
  const shown = Object.fromEntries(Object.entries(err).filter(([k]) => UI.touched.has(k)));
  const rows = LSI_ROWS.map(r => { const a = v[`${r.k}_i`], b = v[`${r.k}_u`]; return Number.isFinite(a) && Number.isFinite(b) ? { ...r, inj: a, hea: b, lsi: r.type === 'time' ? lsiTime(a, b) : lsiDist(a, b) } : null; }).filter(Boolean);
  const hq = Number.isFinite(v.hcon) && Number.isFinite(v.qcon) ? { conv: hqRatio(v.hcon, v.qcon), func: Number.isFinite(v.hecc) ? hqRatio(v.hecc, v.qcon) : undefined } : null;
  return { v, err: shown, rows, hq };
}
function m9Fields(s) {
  const T = T7(), cur = S.m9.test || 'single';
  const opts = LSI_ROWS.map(r => `<option value="${r.k}" ${cur === r.k ? 'selected' : ''}>${esc(r.name[lang])}${s.rows.some(x => x.k === r.k) ? ' ✓' : ''}</option>`).join('')
    + `<option value="hq" ${cur === 'hq' ? 'selected' : ''}>${esc(T.hqOpt)}${s.hq ? ' ✓' : ''}</option>`;
  const sel = `<label class="field"><span class="lbl">${esc(T.testSel)}</span><select class="sel" id="m9Sel">${opts}</select></label><span class="hint">${esc(T.lsiHint)}</span>`;
  if (cur === 'hq') {
    const hq = HQ_FIELDS.map(f => { const id = fid('m9', 'x', f.k); return field(id, f.label[lang], f.unit, S.m9.v[`x.${f.k}`] ?? '', { req: f.req, tag: f.tag ? f.tag[lang] : '', err: s.err[id], dec: true, key: `x.${f.k}`, mod: 'm9' }); }).join('');
    return `${sel}<span class="hint">${esc(T.hqLimb)}</span><div style="display:flex;flex-direction:column;gap:14px">${hq}</div>`;
  }
  const r = LSI_ROWS.find(x => x.k === cur) || LSI_ROWS[0], u = typeof r.unit === 'string' ? r.unit : r.unit[lang];
  const res = s.rows.find(x => x.k === r.k);
  return `${sel}<div class="fbox" style="margin:0"><span class="k">${esc(t().protocol.toUpperCase())}</span><span class="r">${esc(r.proto[lang])}</span><span class="hint">${esc(T.trialNote)}</span></div>
    ${field(lsiId(r.k, 'u'), T.healthy, u, S.m9.v[`x.${r.k}_u`] ?? '', { req: true, err: s.err[lsiId(r.k, 'u')], dec: true, key: `x.${r.k}_u`, mod: 'm9' })}
    ${field(lsiId(r.k, 'i'), T.injured, u, S.m9.v[`x.${r.k}_i`] ?? '', { req: true, err: s.err[lsiId(r.k, 'i')], dec: true, key: `x.${r.k}_i`, mod: 'm9' })}
    <div id="m9live">${m9Live(s)}</div>`;
}
function m9Live(s) {
  const T = T7(), r = s.rows.find(x => x.k === (S.m9.test || 'single'));
  if (!r) return '';
  return `${kvRow(T.thisLsi, `${num(r.lsi, 1)}%`)}<span class="hint">${r.lsi >= 90 ? esc(T.lsiOk) : `<b style="color:var(--label)">${esc(T.lsiBelow)}</b>`}</span>`;
}
function m9Out(s) {
  const T = T7();
  const lsiInner = !s.rows.length ? emptyP(T.lsiNone) : `${s.rows.map(r => kvRow(r.name[lang], `${num(r.lsi, 1)}%`) + `<span class="hint">${r.lsi >= 90 ? esc(T.lsiOk) : `<b style="color:var(--label)">${esc(T.lsiBelow)}</b>`}</span>`).join('')}
    <span class="sess-sum">${esc(T.lsiCount(s.rows.filter(r => r.lsi >= 90).length, s.rows.length))}</span>
    <div class="note">${svg('info', '#9A3412')}<span>${esc(T.lsiNote)}</span></div><span class="hint">${esc(T.lsiCaveat)}</span>
    ${fxBtn('lsi')}${UI.mfx.has('lsi') ? srcBox('lsi', M79_REF, ['noyes', 'panther', 'wellsandt'], lang === 'id' ? ['LSI (jarak/torsi) = cedera / sehat × 100', 'LSI (tes berwaktu) = waktu sehat / waktu cedera × 100'] : ['LSI (distance/torque) = injured / uninjured × 100', 'LSI (timed test) = uninjured time / injured time × 100']) : ''}`;
  const hqInner = !s.hq ? emptyP(T.hqNeed) : `${kvRow(T.hqConv, num(s.hq.conv, 2))}${s.hq.func !== undefined ? kvRow(T.hqFunc, num(s.hq.func, 2)) : ''}
    <span class="hint">${esc(T.hqNote)}</span>
    ${fxBtn('hq')}${UI.mfx.has('hq') ? srcBox('hq', M79_REF, ['aagaard', 'ruas'], lang === 'id' ? ['H:Q konvensional = hamstring konsentrik / kuadriseps konsentrik', 'H:Q fungsional = hamstring eksentrik / kuadriseps konsentrik'] : ['Conventional H:Q = concentric hamstring / concentric quadriceps', 'Functional H:Q = eccentric hamstring / concentric quadriceps']) : ''}`;
  return `${card('h-lsi', T.lsiHead, 'lsi', lsiInner, false)}${card('h-hq', T.hqHead, null, hqInner)}${copyCard(m9Copy())}`;
}
function m9Copy() {
  const s = m9State(), T = T7(), lines = [];
  s.rows.forEach(r => { const u = typeof r.unit === 'string' ? r.unit : r.unit[lang]; lines.push(`LSI ${r.name[lang]}: ${num(r.lsi, 1)}% (${num(r.inj, r.type === 'time' ? 2 : 0)} vs ${num(r.hea, r.type === 'time' ? 2 : 0)} ${u})${r.lsi < 90 ? ` — ${T.lsiBelow}` : ''}`); });
  if (s.hq) lines.push(`${T.hqConv} ${num(s.hq.conv, 2)}${s.hq.func !== undefined ? `; ${T.hqFunc} ${num(s.hq.func, 2)}` : ''}`);
  return baseCopy('m9', lines, [s.rows.length ? 'Noyes 1991; Panther 2020' : '', s.hq ? 'Aagaard 1998' : ''].filter(Boolean).join('; '));
}
function renderM9() {
  const T = T7(), { head } = modHeader('m9'), s = m9State();
  app.innerHTML = `${head}<main class="main">
    <section class="card" aria-labelledby="h-in"><h2 class="h2" id="h-in">${esc(t().dataIn)}</h2>
      <div id="fields" style="display:flex;flex-direction:column;gap:10px">${m9Fields(s)}</div>
      <div class="privacy">${svg('lock', '#5C4F45', 16)}<span>${esc(t().storedNote)}</span></div></section>
    <div id="modout">${m9Out(s)}</div>
    <div class="foot"><span>${esc(T.m9Sources)}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('calc')}`;
}
function refreshM79(mod, keepInputs = false) {
  if (mod === 'm7') { const s = m1State(); if (keepInputs) updateFieldMsgs({ err: UI.touched.has('weight') && s.allErr.weight ? { weight: s.allErr.weight } : {} }); else return renderM7(); document.getElementById('modout').innerHTML = m7Out(); return; }
  const s = m9State();
  if (keepInputs) { updateFieldMsgs(s); const lv = document.getElementById('m9live'); if (lv) lv.innerHTML = m9Live(s);
    const sel = document.getElementById('m9Sel'); if (sel) [...sel.options].forEach(o => { const done = o.value === 'hq' ? !!s.hq : s.rows.some(x => x.k === o.value); o.textContent = o.textContent.replace(/ ✓$/, '') + (done ? ' ✓' : ''); }); }
  else document.getElementById('fields').innerHTML = m9Fields(s);
  document.getElementById('modout').innerHTML = m9Out(s);
}

// ---------- Modul 2 & 3: tes berbasis data (lihat tests.js) ----------
const MODNUM = { m2: '02', m3: '03' };
const DEFKEY = { queens: 'steptest', yoyo: 'yoyo', ift: 'vift', smwt: 'smwt', grip: 'grip', sts: 'sts' };
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
  const hs = h.match(/^#\/darurat\/(\w+)$/); if (hs) { const sp = SOS.find(x => x.k === hs[1]); const box = document.getElementById('dosebox'); if (sp && sp.dose && box) { updateFieldMsgs(m1State()); const w = sosW(); box.innerHTML = sp.dose.map(d => { const v = d.t ? d.t[lang] : Number.isFinite(w) ? d.calc(w)[lang] : TS().needW; return d.t ? `<div class="dsrow"><span class="dsl">${esc(d.l[lang])}</span><span class="dst">${esc(v)}</span></div>` : kvRow(d.l[lang], v); }).join(''); } return; }
  if (h === '#/data') { if (keepInputs) updateFieldMsgs(m1State()); else document.getElementById('fields').innerHTML = baseFields(m1State()); }
  else if (/^#\/m\/m1$/.test(h)) refreshM1(keepInputs);
  else { const mm = h.match(/^#\/m\/(m2|m3)$/); if (mm) refreshMod(mm[1], keepInputs); const mc = h.match(/^#\/m\/(m4|m8)$/); if (mc) refreshCustom(mc[1], keepInputs); const md = h.match(/^#\/m\/(m5|m10)$/); if (md) refreshM510(md[1], keepInputs); const me = h.match(/^#\/m\/(m7|m9)$/); if (me) refreshM79(me[1], keepInputs); if (h === '#/m/m6') refreshM6(); }
}
function currentState() { const mm = location.hash.match(/^#\/m\/(m2|m3)$/); if (mm) return modState(mm[1]); const mc = location.hash.match(/^#\/m\/(m4|m8)$/); if (mc) return customState(mc[1]); if (location.hash === '#/m/m5') return m5State(); if (location.hash === '#/m/m10') return m10State(); if (location.hash === '#/m/m9') return m9State(); return m1State(); }

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
  const cc = concCopy();
  if (cc) out.push({ id: 'conc', title: TS().concCopyHead, text: cc.text, body: cc.body });
  m1Out(m1State());
  if (UI.copy) out.push({ id: 'm1', title: MODULES[0].title[lang], text: UI.copy, body: UI.copy.split('\n').slice(1) });
  for (const mod of ['m2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10']) {
    const c = mod === 'm4' || mod === 'm8' ? customCopy(mod) : mod === 'm5' ? m5Copy() : mod === 'm10' ? m10Copy() : mod === 'm6' ? m6Copy() : mod === 'm7' ? m7Copy() : mod === 'm9' ? m9Copy() : modCopy(mod);
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
    if (i === 0) renderM1(); else if (mm[1] === 'm2' || mm[1] === 'm3') renderMod(mm[1]); else if (mm[1] === 'm4' || mm[1] === 'm8') renderCustom(mm[1]); else if (mm[1] === 'm5' || mm[1] === 'm10') renderM510(mm[1]); else if (mm[1] === 'm6') renderM6(); else if (mm[1] === 'm7') renderM7(); else if (mm[1] === 'm9') renderM9(); else if (i > 0) renderWip(MODULES[i], i + 1); else renderHome();
  } else if (h === '#/data') renderBase();
  else if (h === '#/darurat') renderSos();
  else if (/^#\/darurat\/\w+$/.test(h)) renderSosCard(h.split('/')[2]);
  else if (h === '#/ringkasan') renderSummary();
  else if (h === '#/glosarium') renderGloss();
  else if (h === '#/tentang') renderAbout();
  else renderHome();
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });


// ----- v0.2: Kartu Kegawatdaruratan Olahraga -----
const TS = () => SOS_T[lang];
UI.tmrs = UI.tmrs || {};
const tmrGet = k => (UI.tmrs[k] = UI.tmrs[k] || { t0: 0, acc: 0, run: false, log: [] });
const tmrMs = T => T.acc + (T.run ? Date.now() - T.t0 : 0);
const mmss = ms => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
setInterval(() => {
  const el = document.getElementById('tmrVal'); if (!el) return;
  const k = el.dataset.k, T = UI.tmrs[k]; if (!T || !T.run) return;
  const ms = tmrMs(T); el.textContent = mmss(ms);
  const cy = document.getElementById('tmrCycle'); if (cy) cy.textContent = TS().cycle(Math.floor(ms / 120000) + 1);
}, 250);
const sosRow = sp => `<a class="sosrow" href="#/darurat/${sp.k}"><span class="sosic">${svg(sp.icon, '#B91C1C', 20)}</span><span class="sostx"><span class="sosnm">${esc(sp.name[lang])}</span><span class="sossub">${esc(sp.sub[lang])}</span></span>${svg('chevr', '#B91C1C', 20)}</a>`;
function renderSos() {
  const T = TS();
  app.innerHTML = `${pageHeader(T.sosKicker, T.sosTitle, T.sosSub, true)}<main class="main">
    <div class="callrow"><a class="callbtn" href="tel:112">${svg('phone', '#fff', 20)}<span>${esc(T.call112)}</span></a><a class="callbtn" href="tel:119">${svg('phone', '#fff', 20)}<span>${esc(T.call119)}</span></a></div>
    <div class="soslist">${sosRow(SOS[0])}</div>
    <div class="soshead">${esc(T.other.toUpperCase())}</div>
    <div class="soslist">${SOS.slice(1).map(sosRow).join('')}</div>
    <div class="pqbox stop" style="margin-top:14px"><span>${esc(T.sosWarn)}</span></div>
    <div class="foot"><span>${esc(T.sources)}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('sos')}`;
}
const sosSec = (cls, title, items, ordered = false) => items && items.length ? `<section class="card sossec ${cls}" style="margin-top:14px"><h2 class="sosk">${esc(title.toUpperCase())}</h2>${ordered ? `<ol class="sosol">${items.map((x, i) => `<li><span class="sosn">${i + 1}</span><span>${esc(x[lang])}</span></li>`).join('')}</ol>` : `<ul class="sosul">${items.map(x => `<li>${esc(x[lang])}</li>`).join('')}</ul>`}</section>` : '';
function sosTimer(sp) {
  const T = TS(), R = tmrGet(sp.k), ms = tmrMs(R);
  const main = R.run ? T.pause : R.acc > 0 ? T.resume : T.start;
  const log = sp.timer === 'ehs' ? `<div class="tmrlog"><label class="field" style="margin:0"><span class="lbl" style="color:#FFE3CC">${esc(T.tempLbl)}</span><span class="inbox" style="background:#fff"><input id="tmrTemp" type="text" inputmode="decimal" autocomplete="off" aria-label="${esc(T.tempLbl)}"><span class="unit">°C</span></span></label>
      <button type="button" class="tmrbtn ghost" data-tmr="log">${esc(T.logTemp)}</button>
      <div class="tmrlist">${R.log.length ? R.log.map(x => `<span>${esc(x.v)} °C · ${mmss(x.ms)}</span>`).join('') : `<span>${esc(T.tempNone)}</span>`}</div></div>` : `<div class="tmrcyc" id="tmrCycle">${esc(T.cycle(Math.floor(ms / 120000) + 1))}</div>`;
  return `<section class="tmr" aria-label="${esc(sp.timer === 'cpr' ? T.tmrCpr : T.tmrEhs)}" style="margin-top:14px">
    <div class="tmrhd">${svg('timer', '#FFE3CC', 18)}<span>${esc((sp.timer === 'cpr' ? T.tmrCpr : T.tmrEhs).toUpperCase())}</span></div>
    <div class="tmrval" id="tmrVal" data-k="${sp.k}" aria-live="off">${mmss(ms)}</div>
    <div class="tmrbtns"><button type="button" class="tmrbtn" data-tmr="go">${esc(main)}</button><button type="button" class="tmrbtn ghost" data-tmr="reset">${esc(T.reset)}</button></div>
    ${log}</section>`;
}
UI.hcat = UI.hcat || 'ehs';
const sosW = () => { const w = parse(S.base.weight); return S.base.weight !== '' && !m1State().allErr.weight && Number.isFinite(w) ? w : NaN; };
function sosDose(sp) {
  const T = TS(), w = sosW(), needW = sp.dose.some(d => d.calc);
  const rows = sp.dose.map(d => { const v = d.t ? d.t[lang] : Number.isFinite(w) ? d.calc(w)[lang] : T.needW; return d.t ? `<div class="dsrow"><span class="dsl">${esc(d.l[lang])}</span><span class="dst">${esc(v)}</span></div>` : kvRow(d.l[lang], v); }).join('');
  return `<section class="card sossec dose" style="margin-top:14px"><h2 class="sosk">${esc(T.doseHead.toUpperCase())}</h2>
    ${needW ? `<div id="fields">${field('weight', t().weight, 'kg', S.base.weight, { req: false, err: UI.touched.has('weight') ? m1State().allErr.weight : '', dec: true })}</div>` : ''}
    <div id="dosebox">${rows}</div><div class="pqbox warn" style="margin-top:10px"><span>${esc(T.doseWarn)}</span></div></section>`;
}
function sosSev(sp) {
  const T = TS();
  return `<section class="card" style="margin-top:14px"><h2 class="sosk">${esc(T.sevHead.toUpperCase())}</h2>${sp.sev.map(g => `<div class="pqbox ${g.k === 'ok' ? 'ok' : g.k === 'warn' ? 'warn' : 'danger'}" style="margin-top:8px"><strong>${esc(g.t[lang])}</strong><ul class="sosul" style="margin-top:6px">${g.items.map(x => `<li>${esc(x[lang])}</li>`).join('')}</ul></div>`).join('')}
    ${sp.sevNote ? `<span class="hint" style="margin-top:8px">${esc(sp.sevNote[lang])}</span>` : ''}</section>`;
}
function renderSosCard(k) {
  const sp = SOS.find(x => x.k === k); if (!sp) { renderSos(); return; }
  if (sp.special) { renderConc(); return; }
  const T = TS();
  let body = '';
  if (sp.cats) {
    if (!sp.cats.some(c => c.k === UI.hcat)) UI.hcat = sp.cats[sp.cats.length - 1].k;
    const c = sp.cats.find(x => x.k === UI.hcat);
    body = `<section class="card sossec" style="margin-top:14px"><h2 class="sosk">${esc(T.pembedaHead.toUpperCase())}</h2><ul class="sosul">${sp.pembeda.map(x => `<li>${esc(x[lang])}</li>`).join('')}</ul></section>
      <section class="card" style="margin-top:14px"><h2 class="sosk" id="hcatLbl">${esc(T.catLbl.toUpperCase())}</h2><div class="catgrid" role="group" aria-labelledby="hcatLbl">${sp.cats.map(x => `<button type="button" class="catbtn" data-hcat="${x.k}" aria-pressed="${x.k === c.k}">${esc(x.name[lang])}</button>`).join('')}</div></section>
      ${sosSec('red', `${T.kenali} · ${c.name[lang]}`, c.kenali)}${sosSec('red', T.lakukan, c.lakukan, true)}${c.timer ? sosTimer({ k: sp.k, timer: c.timer }) : ''}${sosSec('', T.jangan, sp.jangan)}${sosSec('', T.lanjut, c.lanjut)}`;
  } else {
    body = `${sosSec('red', T.kenali, sp.kenali)}${sp.sev ? sosSev(sp) : ''}${sosSec('red', T.lakukan, sp.lakukan, true)}${sp.timer ? sosTimer(sp) : ''}${sp.dose ? sosDose(sp) : ''}${sosSec('', T.jangan, sp.jangan)}${sosSec('', T.lanjut, sp.lanjut)}`;
  }
  if (sp.cats && sp.dose) body += sosDose(sp);
  app.innerHTML = `${pageHeader(T.cardKicker, sp.name[lang], sp.sub[lang], true, '#/darurat')}<main class="main">
    ${body}
    ${sp.note ? `<div class="pqbox warn" style="margin-top:14px"><span>${esc(sp.note[lang])}</span></div>` : ''}
    <section class="card" style="margin-top:14px">${fxBtn(`sos-${sp.k}`, true)}${UI.mfx.has(`sos-${sp.k}`) ? srcBox(`sos-${sp.k}`, SOS_REF, sp.refs) : ''}</section>
    <div class="foot"><span>${esc(T.sosWarn)}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('sos')}`;
}
// Konkusi (tab: di lapangan / tahapan kembali / SCAT6)
UI.ctab = UI.ctab || 0;
const concList = (attr, list, store, showEn) => list.map((x, i) => `<label class="ckrow"><input type="checkbox" data-${attr}="${i}" ${store[i] ? 'checked' : ''}><span><span>${esc(x[lang])}</span>${showEn && lang === 'id' ? `<span class="cken">${esc(x.en)}</span>` : ''}</span></label>`).join('');
function concCopy() {
  const T = TS(), c = S.sos, rf = CONC.redFlags.filter((_, i) => c.rf[i]), rm = CONC.remove.filter((_, i) => c.rm[i]);
  const lines = [];
  if (rf.length) lines.push(`${T.copyRf}: ${rf.map(x => x[lang]).join('; ')}`);
  if (rm.length) lines.push(`${T.copyRm}: ${rm.map(x => x[lang]).join('; ')}`);
  if (c.rts !== '') lines.push(`${T.copyStep}: ${Number(c.rts) + 1} – ${CONC.rts[c.rts][0][lang]}`);
  lines.push(...sc6CopyLines());
  if (!lines.length) return null;
  const body = [...lines, t().srcLine(T.copySrc)], bs = baseSummary();
  return { text: [`${T.concCopyHead} · ${todayStr()}`, ...(bs ? [`${t().baseLabel}: ${bs}`] : []), ...body].join('\n'), body };
}
function concOut() {
  const T = TS(), c = S.sos, nrf = Object.values(c.rf).filter(Boolean).length, nrm = Object.values(c.rm).filter(Boolean).length;
  if (UI.ctab === 0) return `<section class="card sossec red" style="margin-top:14px"><h2 class="sosk">${esc(T.rfHead.toUpperCase())}</h2><span class="hint">${esc(T.rfHint)}</span>${concList('rf', CONC.redFlags, c.rf, true)}</section>
    ${nrf ? `<div class="pqbox danger" style="margin-top:14px"><span>${esc(T.rfOn(nrf))}</span></div>` : ''}
    <section class="card" style="margin-top:14px"><h2 class="sosk">${esc(T.rmHead.toUpperCase())}</h2>${concList('rm', CONC.remove, c.rm, false)}</section>
    ${nrm ? `<div class="pqbox warn" style="margin-top:14px"><span>${esc(T.rmOn)}</span></div>` : ''}${!nrf && !nrm ? `<p class="empty" style="margin:14px 0 0">${esc(T.noneFound)}</p>` : ''}`;
  if (UI.ctab === 1) {
    const step = c.rts === '' ? -1 : Number(c.rts);
    const opts = `<option value="" ${step < 0 ? 'selected' : ''}>${esc(T.stepNone)}</option>` + CONC.rts.map((r, i) => `<option value="${i}" ${i === step ? 'selected' : ''}>${i + 1}. ${esc(r[0][lang])}</option>`).join('');
    const rows = (list, cur) => `<ol class="steps">${list.map((r, i) => `<li class="${i < cur ? 'done' : i === cur ? 'now' : ''}"><span class="stn">${i + 1}</span><span class="stx"><span class="stt">${esc(r[0][lang])}</span><span class="sts">${esc(r[1][lang])}</span></span></li>`).join('')}</ol>`;
    return `<section class="card" style="margin-top:14px"><h2 class="sosk">${esc(T.rtsHead.toUpperCase())}</h2>
      <label class="field"><span class="lbl" id="rtsLbl">${esc(T.curStep)}</span><select class="sel" id="rtsSel" aria-labelledby="rtsLbl">${opts}</select></label>${rows(CONC.rts, step)}</section>
      <section class="card" style="margin-top:14px"><ul class="sosul">${T.rtsNotes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
      <section class="card" style="margin-top:14px"><h2 class="sosk">${esc(T.rtlHead.toUpperCase())}</h2>${rows(CONC.rtl, -1)}</section>`;
  }
  return sc6Out();
}

// ----- SCAT6 & Child SCAT6 digital (teks instrumen kata per kata, bahasa Inggris asli) -----
const SC6P = { 0: ['info', 'imm', 'sym', 'cog', 'bal', 'dr', 'dec'], 1: ['info', 'imm', 'sym', 'par', 'cog', 'bal', 'dr', 'dec'] };
const SC6_T = {
  id: { parts: { info: 'Tentang', imm: 'Penilaian Segera', sym: 'Latar & Gejala', par: 'Laporan Orang Tua', cog: 'Kognitif', bal: 'Keseimbangan & Gait', dr: 'Ingatan Tertunda', dec: 'Keputusan & Skor' }, form: 'Formulir', forms: ['SCAT6 (≥13 tahun)', 'Child SCAT6 (8–12 tahun)'], verb: 'Teks instrumen ditampilkan kata per kata dalam bahasa Inggris asli; belum ada versi resmi berbahasa Indonesia.', noId: 'Isian identitas (nama, tanggal lahir, nomor ID, pemeriksa, tanda tangan, atestasi) dan isian teks bebas tidak disertakan karena SakuSKO tidak menyimpan identitas.', childSrc: 'Child SCAT6 resmi berupa PDF gambar; teksnya diambil dengan OCR lalu dicocokkan manual dengan gambar halaman.', part: 'Bagian', open: 'Buka PDF SCAT6 resmi (BJSM)', openC: 'Buka PDF Child SCAT6 resmi (BJSM)', perm: 'Reformat digital SCAT6/Child SCAT6 memerlukan izin tertulis BMJ; permohonan sedang diproses dr. Marcus.', of: 'dari', none: '—', redRef: 'Centang red flag di tab Di Lapangan.', trial: 'Trial', sec: 'detik', reset: 'Hapus isian formulir ini', fast: 'tercepat' },
  en: { parts: { info: 'About', imm: 'Immediate Assessment', sym: 'Background & Symptoms', par: 'Parent Report', cog: 'Cognitive', bal: 'Balance & Gait', dr: 'Delayed Recall', dec: 'Decision & Scores' }, form: 'Form', forms: ['SCAT6 (≥13 years)', 'Child SCAT6 (8–12 years)'], verb: 'Instrument text is shown word for word in the original English; there is no official Indonesian version.', noId: 'Identity fields (name, date of birth, ID number, examiner, signature, attestation) and free-text fields are omitted because SakuSKO stores no identity.', childSrc: 'The official Child SCAT6 is an image-only PDF; its text was extracted by OCR and checked by hand against the page images.', part: 'Section', open: 'Open the official SCAT6 PDF (BJSM)', openC: 'Open the official Child SCAT6 PDF (BJSM)', perm: 'Digital reformatting of SCAT6/Child SCAT6 requires written consent from BMJ; Dr Marcus is requesting it.', of: 'of', none: '—', redRef: 'Tick red flags in the On Field tab.', trial: 'Trial', sec: 'sec', reset: 'Clear entries on this form', fast: 'fastest' },
};
const S6 = () => SC6_T[lang];
const isC6 = () => S.sc6.form === 1;
const A6 = () => (isC6() ? SCAT6C : SCAT6);
const sc6v = () => (isC6() ? S.sc6.vc : S.sc6.v);
const sc6Sc = () => (isC6() ? childScat6Scores(sc6v()) : scat6Scores(sc6v(), S.sc6.list));
const scQ = t => `<p class="scq">${esc(t)}</p>`;
const scSay = t => `<p class="scsay">${esc(t)}</p>`;
const scH = t => `<h3 class="sch">${esc(t)}</h3>`;
const scBtns = (key, opts, cls = '') => `<div class="scbtns${cls}">${opts.map(([val, lab]) => `<button type="button" class="scb" data-sc="${key}" data-val="${val}" aria-pressed="${String(key === 'list' || key === 'dlist' ? S.sc6[key] : sc6v()[key]) === String(val)}">${esc(lab)}</button>`).join('')}</div>`;
const scYN = (key, label) => `<div class="scrow"><span class="sct">${esc(label)}</span>${scBtns(key, [['Y', 'Y'], ['N', 'N']])}</div>`;
const sc01 = (key, label) => `<div class="scrow"><span class="sct">${esc(label)}</span>${scBtns(key, [[0, '0'], [1, '1']])}</div>`;
const scNum = (key, label, unit = '') => `<label class="scrow"><span class="sct">${esc(label)}</span><span class="inbox scin"><input type="text" inputmode="decimal" autocomplete="off" data-scn="${key}" value="${esc(sc6v()[key] ?? '')}" aria-label="${esc(label)}">${unit ? `<span class="unit">${esc(unit)}</span>` : ''}</span></label>`;
const scChk = (key, label) => `<label class="ckrow"><input type="checkbox" data-scc="${key}" ${Number(sc6v()[key]) === 1 ? 'checked' : ''}><span>${esc(label)}</span></label>`;
const fmt2 = x => Number(x).toLocaleString(lang === 'id' ? 'id-ID' : 'en-GB', { maximumFractionDigits: 2 });
const scScore = (label, val, max) => `<div class="scscore"><span>${esc(label)}</span><strong>${val === null || val === undefined ? S6().none : `${typeof val === 'number' && !Number.isInteger(val) ? fmt2(val) : val}${max ? ` ${S6().of} ${max}` : ''}`}</strong></div>`;
const scSymRow = (key, label, max) => `<div class="scsym"><span class="sct">${esc(label)}</span>${scBtns(key, [...Array(max + 1).keys()].map(n => [n, String(n)]))}</div>`;
const card6 = inner => `<section class="card sc6" style="margin-top:14px">${inner}</section>`;
function sc6Part(p) {
  const A = A6(), I = A.immediate, O = A.off, v = sc6v(), sc = sc6Sc(), L6 = S6(), C = isC6();
  if (p === 'info') return card6(`${scH(A.title)}<p class="scsub">${esc(A.sub)} · ${esc(A.hcp)}</p>${A.what.map(scQ).join('')}
    ${scH('Key Points')}<ul class="sosul">${A.keyPoints.map(x => `<li>${esc(x)}</li>`).join('')}</ul>${scH('Remember')}<ul class="sosul">${A.remember.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    ${scH('Recognise and Remove')}${scQ(A.recognise)}<div class="pqbox warn" style="margin-top:10px"><span>${esc(A.copyright)}</span></div>
    ${scH(A.history.head)}${A.history.items.map(([k, l, , u]) => scNum(k, l, u || '')).join('')}`);
  if (p === 'imm') return card6(`${scH(I.head)}${I.intro.map(scQ).join('')}
    ${scH(I.signsHead)}${I.signsSrc.map((x, i) => scChk(`src${i}`, x)).join('')}${I.signs.map((x, i) => scYN(`sg${i}`, x)).join('')}
    ${scH(I.redHead)}<ul class="sosul">${I.red.map(x => `<li>${esc(x)}</li>`).join('')}</ul><span class="hint">${esc(L6.redRef)}</span>
    ${scH(I.gcsHead)}${scQ(I.gcsNote)}${I.gcs.map(([k, h, opts]) => `<p class="scq" style="font-weight:800">${esc(h)}</p>${opts.map((o, i) => `<div class="scrow"><span class="sct">${esc(o)}</span>${scBtns(`g${k}`, [[i + 1, String(i + 1)]])}</div>`).join('')}`).join('')}
    ${scScore(I.gcsTotal, sc.gcs, 15)}
    ${scH(I.cspineHead)}${scQ(I.cspineNote)}${I.cspine.map((x, i) => scYN(`cs${i}`, x)).join('')}
    ${scH(I.coordHead)}${I.coord.map((x, i) => scYN(`co${i}`, x)).join('')}
    ${C ? '' : `${scH(I.madHead)}${scSay(I.madSay)}${scQ(I.madIntro)}${I.mad.map((x, i) => sc01(`md${i}`, x)).join('')}${scScore(I.madScore, sc.mad, 5)}${scQ(I.madNote)}`}`);
  if (p === 'sym') return card6(`${scH(O.head)}${scQ(O.intro)}
    ${scH(O.bgHead)}${scQ(O.bgQ)}${O.bg.map((x, i) => scYN(`bg${i}`, x)).join('')}
    ${scH(O.symHead)}${scBtns('mode', O.symMode.map((m, i) => [i, m]))}${scQ(O.symIntro)}${O.symSay.map(scSay).join('')}<p class="sccap">${esc(O.symHand)}</p>
    ${C ? `<p class="sclegend">${O.scale.map((x, i) => `${i} = ${esc(x)}`).join(' · ')}</p>` : ''}
    ${O.sym.map((x, i) => scSymRow(`sy${i}`, x, C ? 3 : 6)).join('')}
    ${C ? `${O.symX.map((x, i) => scYN(`sx${i}`, x)).join('')}${scQ(O.rateHead)}<div class="scsym"><span class="sct">${esc(O.rateQ)}</span><p class="sclegend">0 = ${esc(O.rateLo)} · 10 = ${esc(O.rateHi)}</p>${scBtns('rate', [...Array(11).keys()].map(n => [n, String(n)]), ' wrap')}</div><p class="sccap">${esc(O.symBack)}</p>${scScore(`${O.symN} (of 21)`, sc.symN)}${scScore(`${O.symS} (of 63)`, sc.symS)}`
      : `<p class="sccap">${esc(O.symBack)}</p>${O.symX.map((x, i) => scYN(`sx${i}`, x)).join('')}${scNum('pct', O.symPct, '%')}${scQ(O.symAfter)}${scScore(O.symN, sc.symN, 22)}${scScore(O.symS, sc.symS, 132)}`}`);
  if (p === 'par') return card6(`${scH(O.parHead)}<p class="sccap">${esc(O.parHand)}</p><p class="sclegend">${O.scale.map((x, i) => `${i} = ${esc(x)}`).join(' · ')}</p><p class="scq" style="font-weight:800">${esc(O.parCol)}</p>
    ${O.par.map((x, i) => scSymRow(`pa${i}`, x, 3)).join('')}${O.symX.map((x, i) => scYN(`px${i}`, x)).join('')}
    ${scQ(O.parRateHead)}${scNum('ppct', O.parRateQ, '%')}<p class="sccap">${esc(O.symBack)}</p>${scScore(`${O.parN} (of 21)`, sc.parN)}${scScore(`${O.symS} (of 63)`, sc.parS)}`);
  if (p === 'cog') {
    const lst = O.lists[S.sc6.list], dl = O.digits[S.sc6.dlist];
    return card6(`${scH(O.cogHead)}
    ${C ? '' : `${scH(O.oriHead)}${O.ori.map((x, i) => sc01(`or${i}`, x)).join('')}${scScore(O.oriScore, sc.ori, 5)}`}
    ${scH(O.imHead)}${scQ(O.imIntro)}${O.imSay.map(scSay).join('')}<div class="scrow"><span class="sct">${esc(O.listUsed)}</span>${scBtns('list', ['A', 'B', 'C'].map(x => [x, x]))}</div>
    <div class="scgrid"><span></span>${[1, 2, 3].map(t => `<span class="scgh">${esc(L6.trial)} ${t}</span>`).join('')}${lst.map((w, i) => `<span class="scw">${esc(w)}</span>${[1, 2, 3].map(t => `<label class="scgc"><input type="checkbox" data-scc="im${t}_${i}" ${Number(v[`im${t}_${i}`]) === 1 ? 'checked' : ''} aria-label="${esc(`${w} ${L6.trial} ${t}`)}"></label>`).join('')}`).join('')}
      <span class="scw">Trial Total</span>${sc.imTrial.map(x => `<span class="scgh">${x ?? L6.none}</span>`).join('')}</div>
    ${scScore(O.imScore, sc.im, 30)}
    ${scH(O.conHead)}${scQ(O.dbHead)}${scQ(O.dbIntro)}${scSay(O.dbSay)}<div class="scrow"><span class="sct">${esc(O.digitListUsed)}</span>${scBtns('dlist', ['A', 'B', 'C'].map(x => [x, x]))}</div>
    ${dl.map((pair, l) => pair.map((str, j) => scYN(`dg${l}_${j}`, str)).join('')).join('')}${scScore(O.dbScore, sc.dig, C ? 5 : 4)}
    ${scQ(O.moHead)}${scSay(O.moSay)}${scQ(O.moStart)}<p class="scq">${esc(O.months.join(' · '))}</p>${scNum('moT', O.moTime, L6.sec)}${scNum('moE', O.moErr)}${scQ(O.moRule)}
    ${scScore(O.moScore, sc.mo, 1)}${scScore(O.conScore, sc.con, C ? 6 : 5)}`);
  }
  if (p === 'bal') return card6(`${scH(O.balHead)}${scQ(`${O.mbHead} ${O.mbSee}`)}
    <div class="scrow"><span class="sct">${esc(`${O.mbFoot} ${O.mbFootNote}`)}</span>${scBtns('foot', O.mbFootOpt.map(x => [x, x]))}</div>${scQ(O.mbOpt)}
    ${scQ(O.mbSub)}${O.stances.map((x, i) => scNum(`mb${i}`, `${x} (of 10)`)).join('')}${scScore(O.mbTotal, sc.mb, 30)}
    ${scQ(O.mbFoam)}${O.stances.map((x, i) => scNum(`mf${i}`, `${x} (of 10)`)).join('')}${scScore(O.mbTotal, sc.mf, 30)}${O.mbNote.map(scQ).join('')}
    ${scH(O.tgHead)}${scQ(O.tgIntro)}${scSay(O.tgSay)}${scQ(`${O.tgSingle} ${O.tgTime}`)}${[0, 1, 2].map(i => scNum(`tg${i}`, `Trial ${i + 1}`, L6.sec)).join('')}
    ${scScore(O.tgAvg, sc.tgAvg)}${scScore(O.tgFast, sc.tgFast)}
    ${C ? `${scH(O.ctHead)}<p class="scq" style="font-weight:800">${esc(O.ctFwd[0])}</p>${scSay(O.ctFwd[1])}${scQ(O.ctFwd[2])}${O.ctItems.slice(0, 2).map(([k, l]) => scNum(k, `${l} ${O.ctPts}`)).join('')}${scScore(O.ctFT, sc.ctF)}
      <p class="scq" style="font-weight:800">${esc(O.ctBwd[0])}</p>${scSay(O.ctBwd[1])}${scQ(O.ctBwd[2])}${O.ctItems.slice(2).map(([k, l]) => scNum(k, `${l} ${O.ctPts}`)).join('')}${scScore(O.ctBT, sc.ctB)}${scScore(O.ctTot, sc.ct)}` : ''}
    ${scH(O.dtHead)}${C ? scQ(O.dtOnly) : ''}${scQ(O.dtIntro)}${scSay(O.dtSay1)}${scQ(O.dtPractice)}<p class="scq">${O.dtPracticeSeq.join(' · ')}</p>${scSay(O.dtSay2)}${scQ(O.dtPerf)}
    ${O.dtTrials.map((seq, i) => `<p class="scq" style="font-weight:800">Trial ${i + 1}: ${seq.join(' · ')}</p>${scNum(`dtE${i}`, 'Errors')}${scNum(`dtT${i}`, 'Time', L6.sec)}`).join('')}
    ${scScore(`Dual Task ${L6.fast}`, sc.dtFast)}${scQ(O.dtAlt)}${scYN('dtNot', O.dtNotDone)}`);
  if (p === 'dr') { const lst = O.lists[S.sc6.list];
    return card6(`${scH(O.drHead)}${scQ(O.drIntro)}${scSay(O.drSay)}<p class="scq">${esc(O.listUsed)} ${S.sc6.list}</p>
    ${lst.map((w, i) => scChk(`dr${i}`, w)).join('')}${scScore(O.drScore, sc.dr, 10)}`); }
  if (C) return card6(`${scQ(O.usual)}${scBtns('usual', O.usualOpt.map(x => [x, x]))}
    ${scH(O.decHead)}<div class="scrow"><span class="sct">${esc(O.neuro)}</span>${scBtns('neuro', O.neuroOpt.map(x => [x, x]))}</div>
    ${scScore('Symptom number (of 21) — Child Report', sc.symN)}${scScore('Symptom number (of 21) — Parent Report', sc.parN)}${scScore('Symptom Severity (of 63) — Child Report', sc.symS)}${scScore('Symptom Severity (of 63) — Parent Report', sc.parS)}
    ${scScore('Immediate Memory (of 30)', sc.im)}${scScore('Concentration (of 6)', sc.con)}${scScore('Delayed Recall (of 10)', sc.dr)}${scScore('Cognitive Total Score (of 46)', sc.cog)}
    ${scScore('mBESS Total Errors (of 30)', sc.mb)}${scScore('Tandem Gait fastest time', sc.tgFast)}${scScore('Complex Tandem Gait Total Points', sc.ct)}${scScore('Dual Task fastest time', sc.dtFast)}
    ${scH(O.dispHead)}${scQ(O.dx)}${scBtns('dx', O.dxOpt.map(x => [x, x]))}${scQ(O.improved)}${scBtns('impr', O.improvedOpt.map(x => [x, x]))}
    <div class="pqbox warn" style="margin-top:10px"><span>${esc(O.final)}</span></div><button type="button" class="btn-sec" data-screset="1" style="margin-top:10px">${esc(L6.reset)}</button>`);
  return card6(`${scH(O.totHead)}${scScore('Orientation:', sc.ori, 5)}${scScore('Immediate Memory:', sc.im, 30)}${scScore('Concentration:', sc.con, 5)}${scScore('Delayed Recall:', sc.dr, 10)}${scScore('Total:', sc.cog, 50)}
    ${scQ(O.usual)}${scBtns('usual', O.usualOpt.map(x => [x, x]))}
    ${scH(O.decHead)}<div class="scrow"><span class="sct">${esc(O.neuro)}</span>${scBtns('neuro', O.neuroOpt.map(x => [x, x]))}</div>
    ${scScore('Symptom number (of 22)', sc.symN)}${scScore('Symptom Severity (of 132)', sc.symS)}${scScore('Cognitive Total Score (of 50)', sc.cog)}${scScore('mBESS Total Errors (of 30)', sc.mb)}${scScore('Tandem Gait fastest time', sc.tgFast)}${scScore('Dual Task fastest time', sc.dtFast)}
    ${scQ(O.dx)}${scBtns('dx', O.dxOpt.map(x => [x, x]))}<div class="pqbox warn" style="margin-top:10px"><span>${esc(O.final)}</span></div>
    <button type="button" class="btn-sec" data-screset="1" style="margin-top:10px">${esc(L6.reset)}</button>`);
}
function sc6Out() {
  const L6 = S6(), form = S.sc6.form, P = SC6P[form];
  if (!P.includes(S.sc6.part)) S.sc6.part = 'imm';
  const forms = `<section class="card" style="margin-top:14px"><h2 class="sosk" id="scfLbl">${esc(L6.form.toUpperCase())}</h2><div class="catgrid" role="group" aria-labelledby="scfLbl">${L6.forms.map((f, i) => `<button type="button" class="catbtn" data-scform="${i}" aria-pressed="${form === i}">${esc(f)}</button>`).join('')}</div>
    <span class="hint" style="margin-top:8px">${esc(L6.verb)}</span><span class="hint">${esc(L6.noId)}</span>${form === 1 ? `<span class="hint">${esc(L6.childSrc)}</span>` : ''}</section>`;
  const parts = `<section class="card" style="margin-top:14px"><h2 class="sosk" id="scpLbl">${esc(L6.part.toUpperCase())}</h2><div class="catgrid" role="group" aria-labelledby="scpLbl">${P.map(p => `<button type="button" class="catbtn" data-scpart="${p}" aria-pressed="${S.sc6.part === p}">${esc(L6.parts[p])}</button>`).join('')}</div></section>`;
  return `${forms}${parts}<div id="sc6part">${sc6Part(S.sc6.part)}</div>
    <div class="pqbox warn" style="margin-top:14px"><span>${esc(L6.perm)}</span></div>
    <a class="btn-sec" style="margin-top:10px" href="https://doi.org/${form === 1 ? '10.1136/bjsports-2023-106982' : '10.1136/bjsports-2023-107036'}" target="_blank" rel="noopener">${svg('link', '#9A3412', 18)}<span>${esc(form === 1 ? L6.openC : L6.open)}</span></a>`;
}
function sc6CopyLines() {
  const out = [];
  const add = (l, x, m) => { if (x !== null && x !== undefined) out.push(`${l}: ${typeof x === 'number' && !Number.isInteger(x) ? fmt2(x) : x}${m ? `/${m}` : ''}`); };
  const block = (name, v, sc, C) => {
    out.length = 0;
    add('GCS', sc.gcs, 15);
    if (C) { add('Symptoms (child)', sc.symN, 21); add('Severity (child)', sc.symS, 63); add('Symptoms (parent)', sc.parN, 21); add('Severity (parent)', sc.parS, 63); }
    else { add('Maddocks', sc.mad, 5); add('Symptoms', sc.symN, 22); add('Symptom severity', sc.symS, 132); add('Orientation', sc.ori, 5); }
    add('Immediate memory', sc.im, 30); add('Concentration', sc.con, C ? 6 : 5); add('Delayed recall', sc.dr, 10); add('Cognitive total', sc.cog, C ? 46 : 50);
    add('mBESS errors', sc.mb, 30); add('mBESS foam errors', sc.mf, 30); add('Tandem gait fastest (s)', sc.tgFast); if (C) add('Complex tandem gait points', sc.ct); add('Dual task fastest (s)', sc.dtFast);
    if (v.neuro) out.push(`${C ? 'Immediate assessment/neuro screen' : 'Neurological exam'}: ${v.neuro}`); if (v.dx) out.push(`Concussion diagnosed: ${v.dx}`);
    return out.length ? [`${name} (${SCAT6.off.symMode[Number(v.mode ?? 1)] || ''})`, ...out.map(x => `  ${x}`)] : [];
  };
  return [...block('SCAT6', S.sc6.v, scat6Scores(S.sc6.v, S.sc6.list), false), ...block('Child SCAT6', S.sc6.vc, childScat6Scores(S.sc6.vc), true)];
}
function renderConc() {
  const T = TS(), sp = SOS[0];
  app.innerHTML = `${pageHeader(T.cardKicker, sp.name[lang], sp.sub[lang], true, '#/darurat')}<main class="main">
    <div class="seg" role="group" aria-label="${esc(sp.name[lang])}" style="background:#fff;border:1px solid var(--line)">${T.cTabs.map((l, i) => `<button type="button" data-ctab="${i}" aria-pressed="${UI.ctab === i}">${esc(l)}</button>`).join('')}</div>
    <div id="concout">${concOut()}</div>
    ${copyCard(concCopy())}
    <section class="card" style="margin-top:14px">${fxBtn('sos-konkusi', true)}${UI.mfx.has('sos-konkusi') ? srcBox('sos-konkusi', SOS_REF, sp.refs) : ''}</section>
    <div class="foot"><span>${esc(T.sosWarn)}</span><span>${esc(t().meta2)}</span></div>
  </main>${nav('sos')}`;
}

// ---------- Interaksi (delegasi) ----------
app.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'q') {
    query = el.value;
    renderHomeTiles(); return;
  }
  if (el.dataset.scn) { const clean = el.value.replace(/[^\d.,]/g, '').slice(0, 6); if (clean !== el.value) el.value = clean; const k = el.dataset.scn; if (clean === '') delete sc6v()[k]; else sc6v()[k] = clean.replace(',', '.'); save(); UI.clearArmed = false; const c = concCopy(); UI.copy = c ? c.text : null; const box = document.getElementById('copyText'); if (box && c) box.textContent = c.text; if (!box && c) { const y = window.scrollY; renderConc(); window.scrollTo(0, y); const f = document.querySelector(`[data-scn="${k}"]`); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); } return; } const sp = document.getElementById('sc6part'); if (sp) { const scores = sp.querySelectorAll('.scscore strong'); const tmp = document.createElement('div'); tmp.innerHTML = sc6Part(S.sc6.part); const fresh = tmp.querySelectorAll('.scscore strong'); scores.forEach((n, i) => { if (fresh[i]) n.textContent = fresh[i].textContent; }); } return; }
  if (el.dataset.pqtxt) {
    S.skr.pq.txt[el.dataset.pqtxt] = el.value.slice(0, 200); save(); UI.clearArmed = false;
    const c = skrCopy(); UI.copy = c ? c.text : null; const box = document.getElementById('copyText'); if (box && c) box.textContent = c.text; return;
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
  if (e.target.dataset.scc) { const k = e.target.dataset.scc; if (e.target.checked) sc6v()[k] = 1; else delete sc6v()[k]; save(); const y = window.scrollY; renderConc(); window.scrollTo(0, y); document.querySelector(`[data-scc="${k}"]`)?.focus(); return; }
  if (e.target.dataset.rf !== undefined || e.target.dataset.rm !== undefined) { const isRf = e.target.dataset.rf !== undefined, i = isRf ? e.target.dataset.rf : e.target.dataset.rm, st = isRf ? S.sos.rf : S.sos.rm; if (e.target.checked) st[i] = true; else delete st[i]; save(); const y = window.scrollY; renderConc(); window.scrollTo(0, y); document.querySelector(`[data-${isRf ? 'rf' : 'rm'}="${i}"]`)?.focus(); return; }
  if (e.target.id === 'rtsSel') { S.sos.rts = e.target.value; save(); const y = window.scrollY; renderConc(); window.scrollTo(0, y); document.getElementById('rtsSel')?.focus(); return; }
  if (e.target.id === 'm7Sel') { S.m7.sel = e.target.value; save(); refreshM79('m7', true); document.getElementById('m7Sel')?.focus(); return; }
  if (e.target.id === 'm9Sel') { S.m9.test = e.target.value; save(); refreshM79('m9'); document.getElementById('m9Sel')?.focus(); return; }
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
  if (b.dataset.pq) { const k = b.dataset.pq, grp = k[0] === 'g' ? 'g' : 'f', key = k.slice(1), cur = S.skr.pq[grp][key];
    S.skr.pq[grp][key] = cur === b.dataset.v ? '' : b.dataset.v; save(); refreshSkr(`[data-pq="${k}"][data-v="${b.dataset.v}"]`); return; }
  if (b.dataset.pqq1 !== undefined) { const i = b.dataset.pqq1; S.skr.pq.q1[i] = !S.skr.pq.q1[i]; save(); refreshSkr(`[data-pqq1="${i}"]`); return; }
  if (b.dataset.pqlang) { S.skr.pqLang = b.dataset.pqlang; save(); refreshSkr(`[data-pqlang="${b.dataset.pqlang}"]`); return; }
  if (b.dataset.pqreset !== undefined) { S.skr.pq = { g: {}, q1: {}, txt: {}, f: {} }; save(); refreshSkr('#h-pq'); return; }
  if (b.dataset.ny) { const k = b.dataset.ny, v = Number(b.dataset.v); if (S.m6.s[k] === v) delete S.m6.s[k]; else S.m6.s[k] = v; save(); UI.clearArmed = false; refreshM6(); document.querySelector(`[data-ny="${k}"][data-v="${v}"]`)?.focus(); return; }
  if (b.dataset.nyview) { S.m6.view = b.dataset.nyview; save(); renderM6(); document.querySelector(`[data-nyview="${b.dataset.nyview}"]`)?.focus(); return; }
  if (b.dataset.mfx && location.hash === '#/m/m6') { const k = b.dataset.mfx; UI.mfx.has(k) ? UI.mfx.delete(k) : UI.mfx.add(k); refreshM6(false); document.querySelector(`[data-mfx="${k}"]`)?.focus(); return; }
  if (b.dataset.sc) { const k = b.dataset.sc, val = b.dataset.val; if (['list', 'dlist'].includes(k)) S.sc6[k] = val; else if (String(sc6v()[k]) === String(val)) delete sc6v()[k]; else sc6v()[k] = val; save(); const y = window.scrollY; renderConc(); window.scrollTo(0, y); document.querySelector(`[data-sc="${k}"][data-val="${val}"]`)?.focus(); return; }
  if (b.dataset.scpart) { S.sc6.part = b.dataset.scpart; save(); renderConc(); document.querySelector(`[data-scpart="${S.sc6.part}"]`)?.focus(); return; }
  if (b.dataset.scform !== undefined) { S.sc6.form = Number(b.dataset.scform); save(); const y = window.scrollY; renderConc(); window.scrollTo(0, y); return; }
  if (b.dataset.screset) { if (isC6()) S.sc6.vc = {}; else S.sc6.v = {}; save(); const y = window.scrollY; renderConc(); window.scrollTo(0, y); return; }
  if (b.dataset.hcat) { UI.hcat = b.dataset.hcat; const y = window.scrollY; renderSosCard('panas'); window.scrollTo(0, y); document.querySelector(`[data-hcat="${UI.hcat}"]`)?.focus(); return; }
  if (b.dataset.ctab !== undefined) { UI.ctab = Number(b.dataset.ctab); renderConc(); document.querySelector(`[data-ctab="${UI.ctab}"]`)?.focus(); return; }
  if (b.dataset.tmr) {
    const k = document.getElementById('tmrVal')?.dataset.k; if (!k) return; const R = tmrGet(k);
    if (b.dataset.tmr === 'go') { if (R.run) { R.acc += Date.now() - R.t0; R.run = false; } else { R.t0 = Date.now(); R.run = true; } }
    else if (b.dataset.tmr === 'reset') { UI.tmrs[k] = { t0: 0, acc: 0, run: false, log: [] }; }
    else if (b.dataset.tmr === 'log') { const v = (document.getElementById('tmrTemp')?.value || '').trim().replace(',', '.'); const n = parseFloat(v); if (!Number.isFinite(n) || n < 30 || n > 45) { document.getElementById('tmrTemp')?.focus(); return; } R.log.push({ v: num(n, 1), ms: tmrMs(R) }); }
    const y = window.scrollY; renderSosCard(k); window.scrollTo(0, y); document.querySelector(`[data-tmr="${b.dataset.tmr}"]`)?.focus(); return;
  }
  if (b.dataset.mfx && /^#\/darurat\//.test(location.hash)) { const k = b.dataset.mfx; UI.mfx.has(k) ? UI.mfx.delete(k) : UI.mfx.add(k); const y = window.scrollY; renderSosCard(location.hash.split('/')[2]); window.scrollTo(0, y); document.querySelector(`[data-mfx="${k}"]`)?.focus(); return; }
  if (b.dataset.m7pick) { const k = b.dataset.m7pick, i = S.m7.picked.indexOf(k); i >= 0 ? S.m7.picked.splice(i, 1) : S.m7.picked.push(k); save(); refreshM79('m7', true); document.querySelector(`[data-m7pick="${k}"]`)?.focus(); return; }
  if (b.dataset.mfx && /^#\/m\/(m7|m9)$/.test(location.hash)) { const k = b.dataset.mfx, mod = location.hash.slice(4); UI.mfx.has(k) ? UI.mfx.delete(k) : UI.mfx.add(k); refreshM79(mod); document.querySelector(`[data-mfx="${k}"]`)?.focus(); return; }
  if (b.dataset.guide) { const k = b.dataset.guide; UI.guide.has(k) ? UI.guide.delete(k) : UI.guide.add(k); refreshM510('m5'); document.querySelector(`[data-guide="${k}"]`)?.focus(); return; }
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
