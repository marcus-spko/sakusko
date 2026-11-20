// SakuSKO — Postur NYPR (New York Posture Rating). 13 segmen, skor 5/3/1.
// Kriteria ditulis ulang dari bagan NYPR (New York State Education Department, 1958) sebagaimana dimuat McRoberts dkk. 2013.
// Semua ilustrasi digambar ulang oleh SakuSKO (bukan reproduksi bagan asli).
const INK = '#1C1206', LBL = '#9A3412', DEV = '#E8590C', MUT = '#5C4F45';
const st = (c = INK, w = 2) => `stroke="${c}" stroke-width="${w}"`;
const wrap = (inner, label) => `<svg role="img" aria-label="${label}" width="92" height="101" viewBox="0 0 100 110" fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const PLUMB = x => `<line x1="${x}" y1="3" x2="${x}" y2="108" stroke="${LBL}" stroke-width="1" stroke-dasharray="3 3"/>`;
const arrow = (x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 5; const p1 = [x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)], p2 = [x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)];
  return `<path d="M${x1} ${y1} L${x2} ${y2} M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${x2} ${y2} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" ${st(DEV, 1.8)}/>`; };

// ---------- tampak belakang ----------
function backHead(tilt) {
  const torso = `<path d="M6 108 C8 92 18 84 36 80 L42 78" ${st()}/><path d="M94 108 C92 92 82 84 64 80 L58 78" ${st()}/>`;
  const neck = `<path d="M43 79 L44 62" ${st()}/><path d="M57 79 L56 62" ${st()}/>`;
  const head = `<g transform="rotate(${tilt} 50 62)"><ellipse cx="50" cy="42" rx="15" ry="19" ${st()} fill="#FFFFFF"/><path d="M35 38 q-4 4 0 9" ${st()}/><path d="M65 38 q4 4 0 9" ${st()}/>${tilt ? `<line x1="50" y1="16" x2="50" y2="66" ${st(DEV, 1.8)}/>` : ''}</g>`;
  return PLUMB(50) + torso + neck + head;
}
function backShoulders(d) {
  const L = `<path d="M6 108 C8 90 20 82 43 79" ${st()}/>`, R = `<path d="M94 108 C92 ${90 - d} 80 ${82 - d} 57 79" ${st()}/>`;
  const head = `<path d="M43 79 L44 62" ${st()}/><path d="M57 79 L56 62" ${st()}/><ellipse cx="50" cy="42" rx="15" ry="19" ${st()}/><path d="M35 38 q-4 4 0 9" ${st()}/><path d="M65 38 q4 4 0 9" ${st()}/>`;
  return PLUMB(50) + `<line x1="8" y1="88" x2="92" y2="88" stroke="${MUT}" stroke-width="1"/>` + L + R + head + (d ? `<line x1="14" y1="88" x2="86" y2="${88 - d}" ${st(DEV, 1.8)}/>` : '');
}
function backSpine(o) {
  const torso = `<path d="M12 16 C20 10 36 10 44 10 M56 10 C64 10 80 10 88 16 L84 30 C80 50 78 66 76 86 M12 16 L16 30 C20 50 22 66 24 86" ${st()}/><path d="M24 86 L76 86" ${st()}/>`;
  const scap = `<path d="M30 26 q4 10 2 18 M70 26 q-4 10 -2 18" ${st(INK, 1.6)}/>`;
  const spine = o ? `<path d="M50 12 C${50 + o * 1.6} 36 ${50 - o * 1.2} 62 50 86" ${st(DEV, 2)} stroke-dasharray="4 3"/>` : `<line x1="50" y1="12" x2="50" y2="86" ${st(INK, 1.6)}/>`;
  return PLUMB(50) + torso + scap + spine + `<path d="M26 92 L26 108 M74 92 L74 108" ${st()}/>`;
}
function backHips(d) {
  const body = `<path d="M14 6 L16 40 C16 60 18 70 22 76 C30 84 44 84 50 76 C56 84 70 84 78 76 C82 70 84 60 84 40 L86 6" ${st()}/><path d="M50 50 L50 76" ${st(INK, 1.6)}/><path d="M24 84 L26 108 M76 84 L74 108 M48 84 L46 108 M52 84 L54 108" ${st()}/>`;
  return PLUMB(50) + body + `<line x1="10" y1="44" x2="90" y2="44" stroke="${MUT}" stroke-width="1"/>` + `<path d="M16 ${44 + d / 2} L84 ${44 - d / 2}" ${st(d ? DEV : INK, d ? 2 : 1.6)}/>`;
}
function footprint(cx, mirror, ang, arch) {
  // jejak kaki kanan; sisi medial di kiri bila mirror=false. arch: kedalaman lengkung medial (0 = datar)
  const m = mirror ? -1 : 1, X = x => cx + m * x;
  const p = `M${X(2)} 100 C${X(-6)} 100 ${X(-8)} 92 ${X(-8)} 84 C${X(-8 + arch * 0.6)} 72 ${X(-7 + arch)} 60 ${X(-9)} 46 C${X(-11)} 36 ${X(-8)} 26 ${X(0)} 26 C${X(8)} 26 ${X(10)} 34 ${X(10)} 46 C${X(10)} 62 ${X(9)} 78 ${X(9)} 88 C${X(9)} 96 ${X(6)} 100 ${X(2)} 100 Z`;
  const toes = [[-7, 20, 3.2], [-1, 18, 2.6], [4, 19, 2.3], [8, 21, 2], [11, 24, 1.8]].map(([x, y, r]) => `<circle cx="${X(x)}" cy="${y}" r="${r}" ${st(INK, 1.5)}/>`).join('');
  return `<g transform="rotate(${m * ang} ${cx} 98)"><path d="${p}" ${st()}/>${toes}</g>`;
}
function feetDir(a, sag) {
  const t = Math.tan(a * Math.PI / 180) * 76;
  const lines = `<line x1="36" y1="102" x2="${36 - t}" y2="26" ${st(a ? DEV : MUT, a ? 1.6 : 1)}/><line x1="64" y1="102" x2="${64 + t}" y2="26" ${st(a ? DEV : MUT, a ? 1.6 : 1)}/>`;
  const sagMarks = sag ? `<path d="M44 96 l5 -5 M56 96 l-5 -5" ${st(DEV, 2)}/>` : '';
  return PLUMB(50) + `<g transform="translate(50 62) scale(0.86) translate(-50 -62)">${footprint(36, true, a, 6) + footprint(64, false, a, 6)}</g>` + lines + sagMarks;
}
const arches = depth => PLUMB(50) + footprint(30, true, 0, depth) + footprint(70, false, 0, depth);

// ---------- tampak samping kiri (menghadap kiri), unting-unting x=55 ----------
// kepala profil sederhana: oval, hidung kecil, telinga (tanpa "paruh")
const sideHead = () => `<ellipse cx="53" cy="12.5" rx="8.6" ry="10" ${st()} fill="#FFFFFF"/><path d="M44.6 11.5 q-1.8 1.5 0.1 2.9" ${st(INK, 1.5)}/><path d="M54.5 10 q2.6 0 2.6 2.8 q0 2.6 -2.2 3.2" ${st(INK, 1.4)}/>`;
function sideBody({ chest = 36, sh = 55, ub = 67, abd = 40, abdY = 66, lb = 63, lean = 0, blade = false } = {}) {
  const front = `<path d="M48 23 C44 27 ${chest} 33 ${chest} 44 C${chest} 54 ${abd + 3} 58 ${abd} ${abdY} C${abd - 2} ${abdY + 8} 38 80 40 86" ${st()}/>`;
  const back = `<path d="M60 22 C64 26 ${ub} 32 ${ub} 42 C${ub} 52 ${lb + 3} 58 ${lb} 66 C${lb + 1} 74 72 78 70 86" ${st()}/>`;
  const arm = `<path d="M${sh} 30 C${sh - 1} 42 ${sh - 1} 52 ${sh} 62" ${st(INK, 1.6)}/>`;
  const upper = `<g transform="rotate(${lean} 55 86)">${sideHead()}<path d="M49 22 L48 24 M58 22 L60 23" ${st()}/>${front}${back}${arm}<circle cx="${sh}" cy="30" r="2.6" fill="${INK}"/>${blade ? `<path d="M${ub - 3} 32 q10 5 3 14" ${st(DEV, 2)}/>` : ''}</g>`;
  const r = lean * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);       // pinggul ikut berputar agar tungkai tetap menyambung
  const L = [55 - 15 * c, 86 - 15 * sn].map(v => v.toFixed(1)), R = [55 + 15 * c, 86 + 15 * sn].map(v => v.toFixed(1));
  const legs = `<path d="M${L[0]} ${L[1]} C41 96 42 102 42 108 M${R[0]} ${R[1]} C68 96 66 102 66 108" ${st()}/>`;
  return PLUMB(55) + upper + legs;
}
function sideNeck(dx) {
  const torso = `<path d="M70 108 C72 94 68 82 62 73" ${st()}/><path d="M34 108 C32 94 36 82 46 75" ${st()}/>`;
  const neck = `<path d="M46 75 L${47 + dx} 60" ${st()}/><path d="M62 73 L${60 + dx} 59" ${st()}/>`;
  const hx = 54 + dx;
  const head = `<ellipse cx="${hx}" cy="43" rx="13.5" ry="16" ${st()} fill="#FFFFFF"/><path d="M${hx - 13.4} 41 q-2.6 2.2 0.1 4.4" ${st(INK, 1.6)}/><path d="M${hx + 1} 40 q4 0 4 4.5 q0 4 -3.2 5" ${st(INK, 1.6)}/><circle cx="${hx + 1}" cy="45" r="1.6" fill="${INK}"/>`;
  return PLUMB(55) + torso + neck + head + `<circle cx="55" cy="84" r="2.2" fill="${INK}"/>` + (dx ? `<line x1="${hx + 1}" y1="45" x2="55" y2="45" ${st(DEV, 1.8)}/>` : '');
}

const S = (id, en) => ({ id, en });
export const NYPR = [
  { k: 'head', view: 'back', name: S('Kepala', 'Head'), opts: [
    [5, S('Kepala tegak; garis unting-unting melewati tengah kepala', 'Head erect; plumb line passes through the centre of the head'), () => backHead(0)],
    [3, S('Kepala sedikit miring atau menoleh ke satu sisi', 'Head slightly tilted or turned to one side'), () => backHead(9)],
    [1, S('Kepala jelas miring atau menoleh ke satu sisi', 'Head markedly tilted or turned to one side'), () => backHead(20)]] },
  { k: 'shoulders', view: 'back', name: S('Bahu', 'Shoulders'), opts: [
    [5, S('Kedua bahu sejajar (horizontal)', 'Shoulders level (horizontal)'), () => backShoulders(0)],
    [3, S('Satu bahu sedikit lebih tinggi', 'One shoulder slightly higher'), () => backShoulders(6)],
    [1, S('Satu bahu jelas lebih tinggi', 'One shoulder markedly higher'), () => backShoulders(14)]] },
  { k: 'spine', view: 'back', name: S('Tulang belakang', 'Spine'), opts: [
    [5, S('Tulang belakang lurus', 'Spine straight'), () => backSpine(0)],
    [3, S('Tulang belakang sedikit melengkung ke samping', 'Spine slightly curved laterally'), () => backSpine(5)],
    [1, S('Tulang belakang jelas melengkung ke samping', 'Spine markedly curved laterally'), () => backSpine(11)]] },
  { k: 'hips', view: 'back', name: S('Panggul', 'Hips'), opts: [
    [5, S('Panggul sejajar (horizontal)', 'Hips level (horizontal)'), () => backHips(0)],
    [3, S('Satu sisi panggul sedikit lebih tinggi', 'One hip slightly higher'), () => backHips(8)],
    [1, S('Satu sisi panggul jelas lebih tinggi', 'One hip markedly higher'), () => backHips(18)]] },
  { k: 'feet', view: 'back', name: S('Arah telapak kaki', 'Feet direction'), opts: [
    [5, S('Telapak kaki mengarah lurus ke depan', 'Feet pointing straight ahead'), () => feetDir(0, false)],
    [3, S('Telapak kaki mengarah ke luar', 'Feet pointing out'), () => feetDir(12, false)],
    [1, S('Telapak kaki jelas mengarah ke luar; pergelangan kaki turun ke dalam (pronasi)', 'Feet markedly pointing out; ankles sag in (pronation)'), () => feetDir(22, true)]] },
  { k: 'arches', view: 'back', name: S('Lengkung kaki', 'Arches'), opts: [
    [5, S('Lengkung kaki tinggi', 'Arches high'), () => arches(13)],
    [3, S('Lengkung kaki lebih rendah; kaki sedikit datar', 'Arches lower; feet slightly flat'), () => arches(6)],
    [1, S('Lengkung kaki rendah; kaki jelas datar', 'Arches low; feet markedly flat'), () => arches(0)]] },
  { k: 'neck', view: 'side', name: S('Leher', 'Neck'), opts: [
    [5, S('Leher tegak, dagu masuk, kepala seimbang tepat di atas bahu', 'Neck erect, chin in, head balanced directly above the shoulders'), () => sideNeck(0)],
    [3, S('Leher sedikit maju, dagu sedikit menonjol', 'Neck slightly forward, chin slightly out'), () => sideNeck(-6)],
    [1, S('Leher jelas maju, dagu jelas menonjol', 'Neck markedly forward, chin markedly out'), () => sideNeck(-12)]] },
  { k: 'chest', view: 'side', name: S('Dada', 'Chest'), opts: [
    [5, S('Dada terangkat; tulang dada bagian tubuh paling depan', 'Chest elevated; breastbone the furthest forward part of the body'), () => sideBody({ chest: 36 }) + arrow(20, 44, 33, 44)],
    [3, S('Dada sedikit tertekan', 'Chest slightly depressed'), () => sideBody({ chest: 41 }) + arrow(25, 44, 38, 44)],
    [1, S('Dada jelas tertekan (datar)', 'Chest markedly depressed (flat)'), () => sideBody({ chest: 46 }) + arrow(30, 44, 43, 44)]] },
  { k: 'shoulderSide', view: 'side', name: S('Bahu (samping)', 'Shoulders (side)'), opts: [
    [5, S('Bahu di tengah, segaris unting-unting', 'Shoulders centred on the plumb line'), () => sideBody({ sh: 55 })],
    [3, S('Bahu sedikit maju', 'Shoulders slightly forward'), () => sideBody({ sh: 49 }) + `<line x1="49" y1="30" x2="55" y2="30" ${st(DEV, 1.8)}/>`],
    [1, S('Bahu jelas maju; tulang belikat menonjol ke belakang', 'Shoulders markedly forward; shoulder blades protruding at the back'), () => sideBody({ sh: 43, blade: true }) + `<line x1="43" y1="30" x2="55" y2="30" ${st(DEV, 1.8)}/>`]] },
  { k: 'upperBack', view: 'side', name: S('Punggung atas', 'Upper back'), opts: [
    [5, S('Punggung atas melengkung normal', 'Upper back normally rounded'), () => sideBody({ ub: 67 }) + arrow(84, 42, 71, 42)],
    [3, S('Punggung atas sedikit lebih membulat', 'Upper back slightly more rounded'), () => sideBody({ ub: 72 }) + arrow(89, 42, 76, 42)],
    [1, S('Punggung atas jelas membulat', 'Upper back markedly rounded'), () => sideBody({ ub: 77, sh: 51 }) + arrow(94, 42, 81, 42)]] },
  { k: 'trunk', view: 'side', name: S('Batang tubuh', 'Trunk'), opts: [
    [5, S('Batang tubuh tegak', 'Trunk erect'), () => sideBody({ lean: 0 })],
    [3, S('Batang tubuh sedikit condong ke belakang', 'Trunk inclined slightly to the rear'), () => sideBody({ lean: 8 }) + arrow(76, 66, 82, 52)],
    [1, S('Batang tubuh jelas condong ke belakang', 'Trunk inclined markedly to the rear'), () => sideBody({ lean: 16 }) + arrow(80, 68, 90, 52)]] },
  { k: 'abdomen', view: 'side', name: S('Perut', 'Abdomen'), opts: [
    [5, S('Perut datar', 'Abdomen flat'), () => sideBody({ abd: 40 }) + arrow(24, 66, 37, 66)],
    [3, S('Perut menonjol', 'Abdomen protruding'), () => sideBody({ abd: 34 }) + arrow(18, 66, 31, 66)],
    [1, S('Perut menonjol dan menggantung', 'Abdomen protruding and sagging'), () => sideBody({ abd: 30, abdY: 73 }) + arrow(14, 74, 27, 74)]] },
  { k: 'lowerBack', view: 'side', name: S('Punggung bawah', 'Lower back'), opts: [
    [5, S('Punggung bawah melengkung normal', 'Lower back normally curved'), () => sideBody({ lb: 63 }) + arrow(83, 66, 67, 66)],
    [3, S('Punggung bawah sedikit cekung', 'Lower back slightly hollow'), () => sideBody({ lb: 60 }) + arrow(80, 66, 64, 66)],
    [1, S('Punggung bawah jelas cekung', 'Lower back markedly hollow'), () => sideBody({ lb: 57 }) + arrow(77, 66, 61, 66)]] },
];
export const nyprSvg = (seg, i, L) => wrap(seg.opts[i][2](), `${seg.name[L]} ${seg.opts[i][0]}: ${seg.opts[i][1][L]}`);
export const NYPR_REF = {
  nysed: { ref: 'New York State Education Department. The New York physical fitness test: a manual for teachers of physical education. Albany (NY): University of the State of New York; 1958.', doi: null },
  mcroberts: { ref: 'McRoberts LB, Cloud RM, Black CM. Evaluation of the New York Posture Rating Chart for assessing changes in postural alignment in a garment study. Cloth Text Res J. 2013;31(2):81-96.', doi: '10.1177/0887302X13480558' },
};
