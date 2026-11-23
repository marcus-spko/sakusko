// Jalankan: node tests/formulas.test.mjs
// Membandingkan hasil rumus aplikasi dengan contoh hitung (Kartu Spesifikasi v0.1.1 dan hitung tangan gelombang B).
import assert from 'node:assert/strict';
import {
  hrmax, hrmaxApplies, acsmZones, vo2Cooper, vo2Rockport, vo2Leger, legerSpeed, vo2Queens,
  vo2YoYo1, sixMwtPred, lsiDist, lsiTime, hqRatio, siri, jp3Men, jpw3Women, dwDensity, dwRow, hastutiAbd, ffmFrom, targetWeight, endomorphy, mesomorphy, hwr, ectomorphy, somatoXY, somatoCategory, sweatLoss, sweatRate, bmChangePct, rmrTenHaaf, rmrMifflin, rmrCunningham, energyAvail, bmi, bmiCat, centralObese, whtr, whr, whrHigh, rmEpley, rmBrzycki, NUZZO, round05, gripCut, stsCut,
  bmiForAgeZ, imtuCat, bfaLms, lmsValue, LIMITS,
} from '../js/formulas.js';
import { tkpnCat, tkpnRow, pacerLevel, TKPN_CAT, tkpnComposite } from '../js/tests3.js';
import { TKPN_NORM, TKPN_ED } from '../js/tkpn-norm.js';
import { TOMK_SPEED, TOMK_LAPS, tomkCentile } from '../js/tomkinson.js';
import { acsmResult } from '../js/screening.js';
import { NYPR } from '../js/nypr.js';
import { SUPPS } from '../js/m79.js';

const near = (a, b, tol = 0.05) => Math.abs(a - b) <= tol;
let n = 0;
const check = (label, cond) => { assert.ok(cond, label); n++; console.log('ok -', label); };

// Modul 1 — pria 30 th, HR istirahat 60 (Kartu Spesifikasi, Modul 1)
check('Fox 30 th = 190', near(hrmax('fox', 30), 190));
check('Tanaka 30 th = 187', near(hrmax('tanaka', 30), 187));
check('Nes 30 th = 191,8', near(hrmax('nes', 30), 191.8));
const z = acsmZones(187, 60);
check('Zona ringan 98–110', z[0].bpmLo === 98 && z[0].bpmHi === 110);
check('Zona sedang 111–135', z[1].bpmLo === 111 && z[1].bpmHi === 135);
check('Zona berat 136–173', z[2].bpmLo === 136 && z[2].bpmHi === 173);

// Modul 2 — contoh Kartu Spesifikasi v0.1.1
check('Cooper 2.600 m = 46,8', near(vo2Cooper(2600), 46.8));
check('Rockport pria 30 th 75 kg 13,5 mnt HR 140 = 48,8', near(vo2Rockport(75, 30, true, 13.5, 140), 48.8));
check('Léger tahap 10: kecepatan 13,0', legerSpeed(10) === 13);
check('Léger tahap 10 dewasa = 50,6', near(vo2Leger(10, 30), 50.6));
check('Léger dewasa tidak bergantung usia (≥18)', vo2Leger(10, 25) === vo2Leger(10, 60));
// Modul 2 — hitung tangan gelombang B
check('Queens pria HR 152 = 47,49', near(vo2Queens(true, 152), 47.49, 0.005));
check('Queens wanita HR 160 = 36,26', near(vo2Queens(false, 160), 36.258, 0.005));
check('Yo-Yo IR1 1.200 m = 46,48', near(vo2YoYo1(1200), 46.48, 0.001));
check('6MWT prediksi pria 60 th 170 cm 70 kg = 553,5', near(sixMwtPred(true, 60, 170, 70), 553.5, 0.01));
check('6MWT prediksi wanita 60 th 160 cm 60 kg = 520,4', near(sixMwtPred(false, 60, 160, 60), 520.4, 0.01));

// Modul 3
check('Epley 80 kg × 6 = 96,0', near(rmEpley(80, 6), 96));
check('Brzycki 80 kg × 6 = 92,9', near(rmBrzycki(80, 6), 92.9));
check('Epley = Brzycki pada 10 repetisi (133,3)', near(rmEpley(100, 10), rmBrzycki(100, 10), 0.001) && near(rmEpley(100, 10), 133.3));
check('Nuzzo umum 80% = 9,75 ± 2,51', NUZZO.general.find(r => r[0] === 80).join() === '80,9.75,2.51');
check('Nuzzo bench 80% = 8,82; 70% = 14,08 (sesuai teks naskah 8,8 & 14,1)', NUZZO.bench.find(r => r[0] === 80)[1] === 8.82 && NUZZO.bench.find(r => r[0] === 70)[1] === 14.08);
check('Nuzzo leg press 80% = 13,05; 70% = 18,96 (sesuai teks naskah 13,1 & 19,0)', NUZZO.leg.find(r => r[0] === 80)[1] === 13.05 && NUZZO.leg.find(r => r[0] === 70)[1] === 18.96);
check('Tabel Nuzzo: rerata turun & SD turun saat %1RM naik', Object.values(NUZZO).every(t => t.every((r, i) => i === 0 || (r[1] > t[i - 1][1] && r[2] > t[i - 1][2]))));
check('Pembulatan 0,5 kg: 74,3 → 74,5', round05(74.3) === 74.5);
check('Handgrip ≥65 th: pria 28, wanita 18', gripCut(70, true) === 28 && gripCut(70, false) === 18);
check('Handgrip 50–64 th: pria 34, wanita 20', gripCut(55, true) === 34 && gripCut(55, false) === 20);
check('Handgrip <50 th: tanpa ambang', gripCut(49, true) === null);
check('5×STS: ambang 12 dtk hanya ≥65 th', stsCut(65) === 12 && stsCut(64) === null);

// Modul 4 — contoh Kartu Spesifikasi v0.1.1 (pria 30 th, 75 kg, 172 cm, FFM 62,5 kg)
check('Ten Haaf (BB) = 1.883', Math.round(rmrTenHaaf(75, 1.72, 30, true)) === 1883);
check('Ten Haaf versi kJ ÷ 4,184 = versi kkal (uji silang)', near((49.940 * 75 + 2459.053 * 1.72 - 34.014 * 30 + 799.257 * 1 + 122.502) / 4.184, rmrTenHaaf(75, 1.72, 30, true), 1));
check('Mifflin-St Jeor pria = 1.680', rmrMifflin(75, 172, 30, true) === 1680);
check('Mifflin-St Jeor wanita = pria − 166', rmrMifflin(75, 172, 30, false) === 1514);
check('Cunningham (FFM 62,5) = 1.875', rmrCunningham(62.5) === 1875);
check('TDEE Ten Haaf × PAL 1,75 = 3.294', Math.round(rmrTenHaaf(75, 1.72, 30, true) * 1.75) === 3294);
check('EA (2.400 − 600) / 62,5 = 28,8', near(energyAvail(2400, 600, 62.5), 28.8, 0.001));
// Modul 8 — contoh Kartu Spesifikasi v0.1.1 (75 kg, 172 cm, pinggang 88, panggul 98)
check('IMT 75 kg / 172 cm = 25,35 → obesitas I (PNPK 2025)', near(bmi(75, 172), 25.35, 0.01) && bmiCat(bmi(75, 172)) === 'ob1');
check('Batas IMT: 22,9 normal; 23,0 BB lebih; 24,9 BB lebih; 25,0 obesitas I; 30,0 obesitas II', bmiCat(22.9) === 'normal' && bmiCat(23) === 'over' && bmiCat(24.9) === 'over' && bmiCat(25) === 'ob1' && bmiCat(30) === 'ob2' && bmiCat(18.4) === 'under');
check('Lingkar pinggang 88 cm pria: bukan obesitas sentral; 91 cm: ya; wanita 81 cm: ya', !centralObese(88, true) && centralObese(91, true) && centralObese(81, false) && !centralObese(80, false));
check('WHtR 88/172 = 0,512 (≥0,5)', near(whtr(88, 172), 0.512, 0.001));
check('WHR 88/98 = 0,898 → di bawah 0,90 (pria); wanita ≥0,85 → risiko', near(whr(88, 98), 0.898, 0.001) && !whrHigh(whr(88, 98), true) && whrHigh(whr(88, 98), false));

// Modul 5 — contoh Kartu Spesifikasi v0.1.1 (data fiktif)
check('Jackson-Pollock pria 30 th, S 47 → D 1,06634 → 14,2%', near(jp3Men(47, 30), 1.06634, 0.00001) && near(siri(jp3Men(47, 30)), 14.2, 0.05));
check('FFM 75 kg pada 14,2% = 64,3; BB target 12% = 73,1', near(ffmFrom(75, siri(jp3Men(47, 30))), 64.3, 0.05) && near(targetWeight(ffmFrom(75, siri(jp3Men(47, 30))), 12), 73.1, 0.05));
check('Durnin-Womersley pria 30 th Σ4 46 → D 1,05175 → 20,6%', near(dwDensity(46, 30, 'M'), 1.05175, 0.00001) && near(siri(dwDensity(46, 30, 'M')), 20.6, 0.05));
check('Durnin-Womersley: baris usia 20–29 pria C 1,1631 M 0,0632; >72 th memakai baris 50–72', dwRow(25, 'M')[2] === 1.1631 && dwRow(80, 'M')[0] === 50);
check('Hastuti abdomen 20 + triseps 10, 30 th = 22,5%', near(hastutiAbd(20, 10, 30), 8 + 8.04 + 4.86 + 1.77, 0.001));
check('Jackson-Pollock-Ward wanita 28 th S 63 = 25,0%', near(siri(jpw3Women(63, 28)), 25.0, 0.05));
// Heath-Carter — subjek 573 manual Carter 2002 (1,6-5,4-3,2)
check('Endomorfi Σ3 18,1 mm, TB 178 = 1,6', near(endomorphy(18.1, 0, 0, 178), 1.6, 0.05));
check('Mesomorfi HB 7,20, FB 9,75, CAG 33,3, CCG 37,1, TB 178 = 5,4', near(mesomorphy(7.20, 9.75, 33.3, 0, 37.1, 0, 178), 5.45, 0.05));
check('Ektomorfi HWR 43,4 = 3,2', near(ectomorphy(43.4), 3.19, 0.01));
check('Ektomorfi cabang tengah HWR 39,5 = 0,66; HWR ≤38,25 = 0,1', near(ectomorphy(39.5), 0.6585, 0.001) && ectomorphy(38) === 0.1);
check('Komponen ≤0 diberi 0,1', endomorphy(0, 0, 0, 178) === 0.1);
check('Lingkar terkoreksi: lingkar lengan − triseps/10', near(mesomorphy(7.2, 9.75, 34.3, 10, 38.1, 10, 178), mesomorphy(7.2, 9.75, 33.3, 0, 37.1, 0, 178), 1e-9));
check('HWR 178 cm / ∛70 kg = 43,2', near(hwr(178, 70), 43.19, 0.01));
check('Koordinat somatochart 1,6-5,4-3,2 → X 1,6; Y 6,0', near(somatoXY(1.6, 5.4, 3.2).x, 1.6, 1e-9) && near(somatoXY(1.6, 5.4, 3.2).y, 6.0, 1e-9));
// Kategori somatotipe Carter 2002
check('Subjek 573 (1,6-5,4-3,2) = ectomorphic mesomorph', somatoCategory(1.6, 5.4, 3.2) === 'ectoic-meso');
check('5-4-1,5 = mesomorphic endomorph', somatoCategory(5, 4, 1.5) === 'mesoic-endo');
check('3-3,5-3 = central', somatoCategory(3, 3.5, 3) === 'central');
check('2-5-2,5 = balanced mesomorph', somatoCategory(2, 5, 2.5) === 'balanced-meso');
check('4-4,5-1 = mesomorph-endomorph', somatoCategory(4, 4.5, 1) === 'endo-meso');
check('1-2-5 = mesomorphic ectomorph', somatoCategory(1, 2, 5) === 'mesoic-ecto');
check('1,5-2-5 = balanced ectomorph (selisih 0,5 = setara)', somatoCategory(1.5, 2, 5) === 'balanced-ecto');
check('4-1,5-4 = endomorph-ectomorph', somatoCategory(4, 1.5, 4) === 'ecto-endo');
// Modul 10 — contoh Kartu Spesifikasi v0.1.1
check('Sweat: 70,0 → 68,9 kg, minum 0,8 L, urine 0,2 L → 1,70 L', near(sweatLoss(70, 68.9, 0.8, 0.2), 1.70, 0.001));
check('Sweat rate 1,70 L / 1,5 jam = 1,13 L/jam', near(sweatRate(1.7, 1.5), 1.133, 0.001));
check('Kehilangan BB 1,57%', near(bmChangePct(70, 68.9), 1.571, 0.001));
check('BB naik → perubahan negatif (tanda minum berlebihan)', bmChangePct(70, 70.4) < 0);

// Modul 9 — contoh Kartu Spesifikasi v0.1.1
check('LSI single hop 150 vs 170 cm = 88,2%', near(lsiDist(150, 170), 88.24, 0.01));
check('LSI 6-m timed hop 2,4 vs 2,2 dtk = 91,7%', near(lsiTime(2.4, 2.2), 91.67, 0.01));
check('H:Q konvensional 110/200 = 0,55', near(hqRatio(110, 200), 0.55, 1e-9));
check('H:Q fungsional 190/200 = 0,95', near(hqRatio(190, 200), 0.95, 1e-9));
// Modul 7 — contoh Kartu Spesifikasi v0.1.1 (75 kg)
const sup = k => SUPPS.find(x => x.k === k).rows(75).map(r => r.v);
check('Urutan suplemen berdasarkan bukti', SUPPS.map(x => x.k).join() === 'cre,caf,cho,pro,nit,bic,ba,o3');
check('Setiap suplemen lengkap (fungsi, manfaat, waktu, efek samping, perhatian, sumber, id/en)', SUPPS.every(x => ['fn', 'use', 'timing', 'side', 'caution'].every(f => x[f].id && x[f].en) && x.refs.length && x.note(75).id && ['A', 'B'].includes(x.ais)));
check('Kafein 75 kg = 225–450 mg', sup('caf')[0][0] === 225 && sup('caf')[0][1] === 450);
check('Kreatin tanpa loading = 3–5 g/hari', sup('cre')[0][0] === 3 && sup('cre')[0][1] === 5);
check('Kreatin 0,1 g/kg × 75 = 7,5 g/hari', near(sup('cre')[1][0], 7.5, 1e-9));
check('Kreatin loading 0,3 g/kg × 75 = 22,5 g/hari', near(sup('cre')[2][0], 22.5, 1e-9));
check('Karbohidrat pra-latihan 1–4 g/kg × 75 = 75–300 g; saat latihan 30–60 dan ≤90 g/jam', sup('cho')[0].join() === '75,300' && sup('cho')[3].join() === '30,60' && sup('cho')[4].join() === '90');
check('Protein per makan 0,3–0,5 g/kg × 75 = 22,5–37,5 g; harian 1,6 g/kg = 120 g', near(sup('pro')[0][0], 22.5, 1e-9) && near(sup('pro')[0][1], 37.5, 1e-9) && near(sup('pro')[1][0], 120, 1e-9));
check('Bikarbonat 15–30 g; optimal 22,5 g; natrium ±6,2 g', near(sup('bic')[0][0], 15, 1e-9) && near(sup('bic')[0][1], 30, 1e-9) && near(sup('bic')[1][0], 22.5, 1e-9) && near(sup('bic')[2][0], 22.5 * 23 / 84.007, 0.01));
check('Beta-alanin 65 mg/kg × 75 = 4,9 g/hari', near(sup('ba')[0][0], 4.875, 1e-9));
check('Nitrat tidak per kg (310–560 mg)', SUPPS.find(x => x.k === 'nit').rows(40)[0].v.join() === '310,560');
check('Omega-3 tidak per kg (1000–6000 mg/hari)', SUPPS.find(x => x.k === 'o3').rows(NaN)[0].v.join() === '1000,6000');
// Modul 6 — struktur NYPR
check('NYPR: 13 segmen (6 belakang, 7 samping), tiap segmen skor 5/3/1', NYPR.length === 13 && NYPR.filter(x => x.view === 'back').length === 6 && NYPR.every(x => x.opts.map(o => o[0]).join() === '5,3,1'));
check('NYPR: setiap pilihan punya ilustrasi SVG', NYPR.every(x => x.opts.every(o => o[2]().includes('<'))));

// Skrining — algoritma ACSM (Riebe 2015): 6 kotak + pengecualian clearance ≤12 bulan
const A = (active, known, symp, intent = '', cleared = '') => acsmResult({ active, known, symp, intent, cleared });
check('ACSM 1: tidak rutin, tanpa penyakit, tanpa gejala → tanpa clearance', A('n', 'n', 'n').cell === 1 && A('n', 'n', 'n').level === 'ok');
check('ACSM 2: tidak rutin, penyakit diketahui, tanpa gejala → clearance', A('n', 'y', 'n').cell === 2 && A('n', 'y', 'n').level === 'warn');
check('ACSM 3: tidak rutin, ada gejala → clearance (status penyakit tak berpengaruh)', A('n', '', 'y').cell === 3 && A('n', 'n', 'y').cell === 3);
check('ACSM 4: rutin, tanpa penyakit, tanpa gejala → tanpa clearance', A('y', 'n', 'n').cell === 4 && A('y', 'n', 'n').level === 'ok');
check('ACSM 5: rutin, penyakit, tanpa gejala, intensitas sedang → tanpa clearance', A('y', 'y', 'n', 'mod').level === 'ok');
check('ACSM 5: intensitas berat tanpa clearance ≤12 bln → clearance', A('y', 'y', 'n', 'vig', 'n').level === 'warn');
check('ACSM 5: intensitas berat dengan clearance ≤12 bln → boleh', A('y', 'y', 'n', 'vig', 'y').level === 'ok');
check('ACSM 6: rutin, ada gejala → hentikan latihan (merah)', A('y', '', 'y').cell === 6 && A('y', '', 'y').level === 'stop');
check('ACSM: jawaban belum lengkap → belum ada hasil', A('', 'n', 'n') === null && A('y', 'y', 'n') === null && A('y', 'y', 'n', 'vig') === null);

// v0.2 Darurat — kelengkapan kartu
const { SOS, SOS_REF, CONC, SOS_T } = await import('../js/darurat.js');
check('Darurat: 13 kartu, konkusi di urutan pertama', SOS.length === 13 && SOS[0].k === 'konkusi');
const full = x => ['kenali', 'lakukan'].every(f => x[f] && x[f].length && x[f].every(y => y.id && y.en));
check('Darurat: setiap kartu punya kenali + lakukan (atau per kategori), jangan, sumber id/en', SOS.filter(x => !x.special).every(x => (x.cats ? x.cats.every(full) : full(x)) && (x.cats ? x.cats.every(c => (c.jangan || x.jangan).length) : x.jangan.length) && x.refs.every(r => SOS_REF[r])));
check('Penyakit panas: 4 kategori (kolaps, EHE, EHI, EHS)', SOS.find(x => x.k === 'panas').cats.map(c => c.k).join() === 'eac,ehe,ehi,ehs');
const ana = SOS.find(x => x.k === 'ana').dose;
check('Adrenalin IM 0,01 mg/kg maks 0,5 mg: 70 kg → 0,50 mg; 20 kg → 0,20 mg', ana[0].calc(70).en === '0.50 mg = 0.50 mL' && ana[0].calc(20).en === '0.20 mg = 0.20 mL');
check('Kristaloid 20 mL/kg: 70 kg → 1.400 mL', ana[3].calc(70).id === '1.400 mL');
check('Prednisolon anak 1–2 mg/kg maks 40: 15 kg → 15–30; 30 kg → 30–40', SOS.find(x => x.k === 'asma').dose[4].calc(15).en === '15–30 mg/day' && SOS.find(x => x.k === 'asma').dose[4].calc(30).en === '30–40 mg/day');
check('Dosis hanya pada kartu dengan pedoman yang mencantumkan dosis', SOS.filter(x => x.dose).map(x => x.k).join() === 'rjp,kejang,eah,trauma,ana,asma,hipo');
check('Konkusi: 11 red flag SCAT6, 8 tanda keluar lapangan, 6 tahap RTS, 4 tahap RTL', CONC.redFlags.length === 11 && CONC.remove.length === 8 && CONC.rts.length === 6 && CONC.rtl.length === 4);

// Darurat v0.2 revisi 21 Nov: kartu sel sabit dihapus, 3 kartu baru, konkusi tanpa SCAT6 digital
check('Darurat: urutan kartu', SOS.map(x => x.k).join(',') === 'konkusi,rjp,kejang,tenggelam,panas,eah,spine,trauma,ana,asma,hipo,kram,petir');
check('Darurat: kartu sel sabit dan rujukan Casa 2012 tidak ada lagi', !SOS.some(x => x.k === 'sct') && !SOS_REF.casa12);
const tr = SOS.find(x => x.k === 'trauma');
check('Cefazolin fraktur terbuka: 70 kg → 2 g; 30 kg → 1 g', tr.dose[0].calc(70).id === '2 g' && tr.dose[0].calc(30).id.startsWith('1 g'));
check('Trauma: 3 kategori perdarahan, fraktur, dislokasi', tr.cats.map(c => c.k).join(',') === 'bld,fx,dsl');
check('Konkusi: 8 tanda terlihat SCAT6, 2 tab', CONC.signs.length === 8 && SOS_T.id.cTabs.length === 2 && SOS_T.en.cTabs.length === 2);
const kj = SOS.find(x => x.k === 'kejang'), rj = SOS.find(x => x.k === 'rjp');
check('Kejang: 3 kategori (benturan, kolaps, epilepsi)', kj.cats.map(c => c.k).join(',') === 'imp,col,epi');
check('AES 2016: midazolam IM 10 mg (>40 kg), 5 mg (13–40 kg); <13 kg tidak tercantum', kj.dose[0].calc(41).id === '10 mg' && kj.dose[0].calc(40).id === '5 mg' && kj.dose[0].calc(13).id === '5 mg' && kj.dose[0].calc(12).id.startsWith('BB'));
check('AES 2016: lorazepam 0,1 mg/kg maks 4 mg; diazepam IV 0,15–0,2 mg/kg maks 10 mg', kj.dose[1].calc(30).id === '3,0 mg' && kj.dose[1].calc(70).id === '4,0 mg' && kj.dose[2].calc(30).id === '4,5–6,0 mg' && kj.dose[2].calc(70).id === '10,0 mg');
check('AHA 2025 PALS: epinefrin 0,01 mg/kg maks 1 mg; amiodaron 5 mg/kg maks 300 mg', rj.dose[3].calc(20).id.startsWith('0,20 mg') && rj.dose[3].calc(120).id.startsWith('1,00 mg') && rj.dose[4].calc(20).id === '100 mg' && rj.dose[4].calc(80).id === '300 mg');
check('Tenggelam: tabel derajat WMS 2024 3 kelompok', SOS.find(x => x.k === 'tenggelam').sev.length === 3);
check('Semua rujukan kartu ada di SOS_REF', SOS.every(x => (x.refs || []).every(r => SOS_REF[r])));

// ===== v0.2 Tahap 2 (Modul 11–13) — hitung tangan dari sumber primer =====
const { gaitSpeed, ybtComposite, jumpHeightCm, stairPower, cs30Cut, fourStage, codDeficit } = await import('../js/formulas.js');
const { TESTS, REF } = await import('../js/tests.js');
check('Gait speed 6 m / 7,5 dtk = 0,80 m/s', near(gaitSpeed(6, 7.5), 0.8, 1e-9));
check('Y-Balance komposit (Plisky 2009): (70+110+105)/(3×90)×100 = 105,6%', near(ybtComposite(70, 110, 105, 90), 105.56, 0.01));
check('CMJ waktu melayang 500 ms → 30,7 cm (g·t²/8)', near(jumpHeightCm(500), 30.66, 0.01));
check('Stair climb power (Ni 2017): 70 kg, 0,762 m, 2 dtk = 261,4 W', near(stairPower(70, 0.762, 2), 261.4, 0.1));
check('Chair stand STEADI: pria 60–64 <14; wanita 90–94 <4; pria 72 th <12', cs30Cut(62, true) === 14 && cs30Cut(92, false) === 4 && cs30Cut(72, true) === 12);
check('Chair stand STEADI: di luar 60–94 tanpa ambang', cs30Cut(59, true) === null && cs30Cut(95, false) === null);
check('Chair stand STEADI: tabel lengkap pria 14,12,12,11,10,8,7 / wanita 12,11,10,10,9,8,4', [60,65,70,75,80,85,90].map(a => cs30Cut(a, true)).join() === '14,12,12,11,10,8,7' && [60,65,70,75,80,85,90].map(a => cs30Cut(a, false)).join() === '12,11,10,10,9,8,4');
check('Four Stage: tandem 6 dtk → tahap 2, tandem gagal', (r => r.reached === 2 && r.tandem === false)(fourStage([10, 10, 6])));
check('Four Stage: gagal di tahap 2 → tandem dianggap gagal', fourStage([10, 4]).tandem === false);
check('Four Stage: tahap 1–2 lulus, tahap 3 belum diisi → belum dinilai', fourStage([10, 10]).tandem === null);
check('COD deficit 2,40 − 1,80 = 0,60', near(codDeficit(2.4, 1.8), 0.6, 1e-9));
check('Modul 11–13: jumlah tes 8/7/7', TESTS.m11.length === 8 && TESTS.m12.length === 7 && TESTS.m13.length === 7);
check('Modul 11–13: semua rujukan ada di REF', ['m11', 'm12', 'm13'].every(m => TESTS[m].every(x => x.refs.every(r => REF[r]))));
const cx = { L: 'id', f0: x => x.toFixed(0), f1: x => x.toFixed(1), f2: x => x.toFixed(2), k: x => x };
const T11 = id => TESTS.m11.find(x => x.id === id), T12 = id => TESTS.m12.find(x => x.id === id), T13 = id => TESTS.m13.find(x => x.id === id);
const g70 = T11('gait').calc({ d: 6, t: 6.9 }, { age: 70 }, cx);
check('Gait 0,87 m/s usia 70: WFG Tidak, EWGSOP2 Tidak, AWGS Ya', g70.rows.map(r => r[1]).join() === 'Tidak,Tidak,Ya');
check('Gait usia 40: tanpa kategori', !T11('gait').calc({ d: 6, t: 6.9 }, { age: 40 }, cx).rows);
const tg = T11('tug').calc({ t: 13 }, { age: 70 }, cx);
check('TUG 13 dtk usia 70: STEADI Ya, WFG Tidak, EWGSOP2 Tidak', tg.rows.map(r => r[1]).join() === 'Ya,Tidak,Tidak');
const tg2 = T11('tug').calc({ t: 20 }, { age: 70 }, cx);
check('TUG 20 dtk: ketiga ambang Ya', tg2.rows.map(r => r[1]).join() === 'Ya,Ya,Ya');
check('Four Stage usia 70 tandem 6 dtk → peringatan', T11('fourstage').calc({ s1: 10, s2: 10, s3: 6, s4: NaN }, { age: 70 }, cx).flag.level === 'warn');
check('Functional Reach rerata 3 percobaan', near(T11('freach').calc({ r1: 25, r2: 27, r3: 29 }, {}, cx).val, 27, 1e-9));
const yb = T11('ybt').calc({ ll: 90, llL: NaN, aR: 70, pmR: 110, plR: 105, aL: 66, pmL: 108, plL: 104 }, {}, cx);
check('YBT: selisih anterior 4,0 cm > SEM; posteromedial 2,0 ≤ SEM 2,83', yb.rows[2][1] === '4.0 cm' && yb.rows[3][1].includes('≤ SEM'));
check('505: COD deficit kanan 2,50−1,85=0,65; rerata (0,65+0,75)/2', near(T11('cod505').calc({ r: 2.5, l: 2.6, s10: 1.85 }, {}, cx).val, 0.70, 1e-9));
check('Chair stand 10× pria 72 th: di bawah rentang normal (<12)', T12('cs30').calc({ n: 10 }, { age: 72, sex: 'M' }, cx).flag.level === 'warn');
check('Chair stand 12× pria 72 th: tidak di bawah', T12('cs30').calc({ n: 12 }, { age: 72, sex: 'M' }, cx).flag.level === 'info');
check('Stair climb rerata 2 percobaan (1,9 & 2,1 dtk)', near(T12('scpt').calc({ h: 76.2, t1: 1.9, t2: 2.1 }, { weight: 70 }, cx).val, 261.4, 0.1));
check('Sit-and-reach −5 cm (belum mencapai)', T13('sitreach').calc({ d: 5, o: 2 }, {}, cx).val === -5);
check('Back scratch: kanan +2, kiri −6 → terbaik +2, selisih 8', (r => r.val === 2 && r.rows[2][1] === '8.0 cm')(T13('scratch').calc({ r: 2, ro: 1, l: 6, lo: 2 }, {}, cx)));
check('Knee-to-wall selisih 2,5 cm > MDC 1,9', T13('ktw').calc({ r: 12, l: 9.5 }, {}, cx).flag.text.includes('melebihi'));
check('MMST: 21,5 cm → pertambahan 6,5 cm', near(T13('mmst').calc({ x: 21.5 }, {}, cx).val, 6.5, 1e-9));
check('ROM selisih |140−128| = 12°', T13('rom').calc({ r: 140, l: 128 }, {}, cx).val === 12);

// ===== v0.2 Tahap 3: mode anak, IMT/U WHO 2007, TKPN =====
check('Batas usia dibuka 5–100; BB ≥10; TB ≥80', LIMITS.age[0] === 5 && LIMITS.weight[0] === 10 && LIMITS.height[0] === 80);
// 14 kasus acuan dari keluaran WHO AnthroPlus (survey_who2007_z.csv): [jenis kelamin, usia bulan, BB, TB, z]
const WHOREF = [[1, 144.13, 27.7, 145.2, -3.24], [1, 174.08, 42.2, 171.7, -3.14], [1, 78.74, 16.6, 115.7, -2.76], [1, 69.32, 42.2, 123.0, 6.51], [1, 64.97, 41.6, 121.6, 6.92], [1, 187.34, 181.3, 170.0, 7.04], [2, 90.41, 27.0, 133.2, -0.19], [1, 180.69, 68.1, 177.2, 0.68], [1, 208.94, 77.6, 167.4, 1.76], [1, 189.79, 59.8, 176.3, -0.47], [1, 214.99, 72.3, 163.6, 1.54], [2, 98.59, 50.3, 126.9, 4.39], [1, 186.85, 114.1, 179.6, 3.13], [1, 80.97, 22.6, 126.2, -0.98]];
check('IMT/U: 14 kasus acuan WHO AnthroPlus cocok (±0,01), termasuk z < −3 dan > +3', WHOREF.every(([sx, mo, w, h, zr]) => Math.abs(Math.round(bmiForAgeZ(w / (h / 100) ** 2, mo, sx === 1) * 100) / 100 - zr) < 0.011));
const sds = (mo, male) => [-3, -2, -1, 0, 1, 2, 3].map(k => Math.round(lmsValue(bfaLms(mo, male), k) * 10) / 10).join(' ');
check('Tabel SD putra 9 th 0 bln = tabel TKPN/Permenkes (12,6 … 24,3)', sds(108, true) === '12.6 13.5 14.6 16 17.9 20.5 24.3');
check('Tabel SD putri 9 th 0 bln = tabel TKPN/Permenkes (12,1 … 26,5)', sds(108, false) === '12.1 13.1 14.4 16.1 18.3 21.5 26.5');
check('Tabel SD putra 18 th 0 bln = tabel TKPN (15,7 … 35,4)', sds(216, true) === '15.7 17.3 19.2 21.7 24.9 29.2 35.4');
check('IMT/U tidak berlaku <60 bln atau ≥229 bln', Number.isNaN(bmiForAgeZ(16, 59, true)) && Number.isNaN(bmiForAgeZ(20, 229, true)));
check('Kategori Permenkes: −3,01 buruk; −3 kurang; −2 baik; +1 baik; +1,01 lebih; +2 lebih; +2,01 obesitas',
  imtuCat(-3.01) === 'sev' && imtuCat(-3) === 'thin' && imtuCat(-2) === 'normal' && imtuCat(1) === 'normal' && imtuCat(1.01) === 'over' && imtuCat(2) === 'over' && imtuCat(2.01) === 'obese');
check('Kategori dinilai dari z 2 desimal (+1,004 → gizi baik)', imtuCat(1.004) === 'normal');
check('Léger anak 12 th tahap 5 = persamaan anak', near(vo2Leger(5, 12), 31.025 + 3.238 * 10.5 - 3.248 * 12 + 0.1536 * 12 * 10.5, 1e-9));
check('Léger: tes kini butuh usia dan berlaku 8–50 th', (x => x.needs.includes('age') && x.ageRange[0] === 8)(TESTS.m2.find(x => x.id === 'leger')));
// TKPN edisi 2024
check('TKPN memakai edisi 2024; 4 tabel × 2 jenis kelamin × 10 baris usia', TKPN_ED === '2024' && ['vsit', 'situp', 'squat', 'pacer'].every(k => ['L', 'P'].every(s => TKPN_NORM[k][s].length === 10 && TKPN_NORM[k][s].every(r => r.length === 8))));
const defects = [];
const AG = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '17+'];
for (const t of ['vsit', 'situp', 'squat', 'pacer']) for (const sx of ['L', 'P']) AG.forEach((a, i) => {
  const age = i === 9 ? 18 : 9 + i, step = t === 'vsit' ? 0.05 : 1; let prev = '';
  for (let x = t === 'vsit' ? -15 : 0; x <= (t === 'vsit' ? 40 : 130) + 1e-9; x = Math.round((x + step) * 100) / 100) {
    const k = tkpnCat(t, sx === 'L', age, x); const tag = k.suspect ? 'S' : k.gap ? 'G' : k.alt !== undefined ? 'O' : '';
    if (tag && tag !== prev) defects.push(`${t}${sx}${a}${tag}`); prev = tag;
  }
});
check('TKPN 2024: daftar cacat tabel persis seperti hasil telaah (V-sit putri 9 celah; V-sit putri 10–17+ tumpang tindih; sit up putra 12 diragukan; PACER putra 13–14 tumpang tindih + 2 celah)',
  defects.join() === 'vsitP9G,vsitP10O,vsitP11O,vsitP12O,vsitP13O,vsitP14O,vsitP15O,vsitP16O,vsitP17O,vsitP17+O,situpL12S,pacerL13O,pacerL13G,pacerL13G,pacerL14O,pacerL14G,pacerL14G');
check('TKPN baris: 8,9 th tidak ada; 9 → 0; 17,9 → 8; 18,5 → 9 (17+); 19 → tidak ada', tkpnRow(8.9) === -1 && tkpnRow(9) === 0 && tkpnRow(17.9) === 8 && tkpnRow(18.5) === 9 && tkpnRow(19) === -1);
check('Squat thrust putra 11 th (2024): 10 kali → Cukup (tumpang tindih edisi 2022 sudah hilang)', (r => r.k === 2 && r.alt === undefined)(tkpnCat('squat', true, 11.4, 10)));
check('PACER putra 13 th: 45 → tumpang tindih Kurang sekali/Kurang; 55 → celah; 82 → celah; 83 → Baik sekali', (a => a[0].alt === 1 && a[1].gap[0] === 1 && a[2].gap[0] === 3 && a[3].k === 4)([45, 55, 82, 83].map(x => tkpnCat('pacer', true, 13, x))));
check('Sit up putra 12 th: baris diragukan (identik PACER), pembanding 2022 tersedia', (r => r.suspect && r.suspect.ref2022.length === 8)(tkpnCat('situp', true, 12, 45)));
check('Sit up putri 15 th: 20 Kurang sekali; 21 Kurang; 56 Baik sekali', tkpnCat('situp', false, 15, 20).k === 0 && tkpnCat('situp', false, 15, 21).k === 1 && tkpnCat('situp', false, 15, 56).k === 4);
check('V-sit putra 10 th: −7 KS; −6,5 KS; −6 K; 0,95 K; 1 C; 9 Baik sekali', [-7, -6.5, -6, 0.95, 1, 9].map(x => tkpnCat('vsit', true, 10, x).k).join() === '0,0,1,1,2,4');
check('V-sit putra 11 th: 9,5 cm → Baik (celah ≤1 cm masuk kategori bawah)', tkpnCat('vsit', true, 11, 9.5).k === 3);
check('V-sit putri 9 th: 0 cm → celah Kurang–Cukup', (r => r.gap && r.gap[0] === 1)(tkpnCat('vsit', false, 9, 0)));
check('V-sit putri 10 th: 3,5 cm → tumpang tindih', tkpnCat('vsit', false, 10, 3.5).alt === 1);
check('TKPN usia 8: tanpa norma', tkpnCat('situp', true, 8, 30) === null);
check('Lembar PACER: 7 → level 1 balikan 7; 8 → level 2 balikan 1; 157 → level 15; 158 → di luar lembar', (a => a[0].level === 1 && a[0].lap === 7 && a[1].level === 2 && a[1].lap === 1 && a[2].level === 15 && a[2].lap === 13 && a[3] === null)([7, 8, 157, 158].map(pacerLevel)));
check('Skor gabungan 2024: semua Baik (4) → 4,00 Baik; semua Baik sekali → 5 Baik sekali', (a => a[0].total === 4 && a[0].k === 3 && a[1].total === 5 && a[1].k === 4)([3, 4].map(c => tkpnComposite({ pacer: c, squat: c, situp: c, vsit: c }))));
check('Skor gabungan: PACER Kurang, lainnya Kurang sekali → 1,85 jatuh di celah 1,8–1,9', (r => r.total === 1.85 && r.gap[0] === 0)(tkpnComposite({ pacer: 1, squat: 0, situp: 0, vsit: 0 })));
let unreach = 0; for (let a = 0; a < 5; a++) for (let b2 = 0; b2 < 5; b2++) for (let c2 = 0; c2 < 5; c2++) for (let d2 = 0; d2 < 5; d2++) { const r = tkpnComposite({ pacer: a, squat: b2, situp: c2, vsit: d2 }); if (r.gap) unreach++; }
check('Skor gabungan: dari 625 kombinasi, hanya 1 yang jatuh di celah (1,85)', unreach === 1);
// Tomkinson 2017
check('Tomkinson: tabel kecepatan & balikan 2 × 9 usia × 11 persentil, naik monoton', [TOMK_SPEED, TOMK_LAPS].every(T => ['M', 'F'].every(sx => T[sx].length === 9 && T[sx].every(r => r.length === 11 && r.every((v, i) => i === 0 || v >= r[i - 1])))));
let vbad = 0;
const T4M9 = [41.7, 43.1, 44.8, 46.1, 47.1, 48.1, 49.1, 50.2, 51.5, 53.2, 54.6], T4F17 = [24.7, 26.8, 29.3, 31.1, 32.6, 34.1, 35.5, 37.0, 38.8, 41.3, 43.3];
TOMK_SPEED.M[0].forEach((sp, i) => { if (Math.abs((31.025 + 3.238 * sp - 3.248 * 9 + 0.1536 * 9 * sp) - T4M9[i]) > 0.08) vbad++; });
TOMK_SPEED.F[8].forEach((sp, i) => { if (Math.abs((31.025 + 3.238 * sp - 3.248 * 17 + 0.1536 * 17 * sp) - T4F17[i]) > 0.08) vbad++; });
check('Tomkinson Tabel 4 (VO₂peak) = persamaan Léger dari Tabel 1 dengan usia bulat, selisih <0,08 (pembulatan) (putra 9 & putri 17 th, 22 sel)', vbad === 0);
check('Léger memakai usia pada ulang tahun terakhir: 12,9 th = 12 th', vo2Leger(5, 12.9) === vo2Leger(5, 12));
check('Tomkinson balikan putra 13 th: 44 → P50–P60 sedang; 10 → <P5; 84 → ≥P95', (a => a[0].band === 'P50–P60' && a[0].q === 2 && a[1].band === '<P5' && a[2].band === '≥P95' && a[2].q === 4)([44, 10, 84].map(x => tomkCentile(TOMK_LAPS, true, 13.6, x))));
check('Tomkinson kecepatan putri 9 th: 9,13 km/jam = P20 → rendah', (r => r.q === 1 && r.band === 'P20–P30')(tomkCentile(TOMK_SPEED, false, 9, 9.13)));
check('Tomkinson di luar 9–17 th: tidak ada', tomkCentile(TOMK_LAPS, true, 18, 50) === null && tomkCentile(TOMK_LAPS, true, 8.9, 50) === null);
const cx3 = { L: 'id', f0: x => x.toFixed(0), f1: x => x.toFixed(1), f2: x => x.toFixed(2), fa: x => String(x), k: x => x, u: 'mL/kg/mnt' };
const T14 = id => TESTS.m14.find(x => x.id === id);
check('Modul 14: rujukan ada di REF', TESTS.m14.every(x => x.refs.every(r => REF[r])));
check('Modul 14 sit up putra 13 th 47 kali → Baik', T14('tksitup').calc({ n: 47 }, { age: 13, sex: 'M' }, cx3).copy.endsWith('— Baik'));
check('Modul 14 sit up putra 12 th → kategori tidak ditampilkan + peringatan', (r => r.cat === null && r.flag.level === 'warn' && r.copy.includes('tidak ditampilkan'))(T14('tksitup').calc({ n: 45 }, { age: 12, sex: 'M' }, cx3)));
check('Modul 14 V-sit putri 10 th −2 cm → Kurang sekali, nilai negatif', (r => r.val === -2 && r.copy.includes('Kurang sekali') && r.cat === 0)(T14('tkvsit').calc({ d: 2, side: 2 }, { age: 10, sex: 'F' }, cx3)));
check('Modul 14 PACER putra 14 th 82 → peringatan celah + persentil Tomkinson', (r => r.flag.level === 'warn' && r.copy.includes('Tomkinson 2017 P90–P95 (sangat tinggi)'))(T14('tkpacer').calc({ n: 82 }, { age: 14, sex: 'M' }, cx3)));
check('Modul 14 squat putra 20 th → tanpa kategori', T14('tksquat').calc({ n: 15 }, { age: 20, sex: 'M' }, cx3).copy.includes('tanpa kategori'));
const lg = TESTS.m2.find(x => x.id === 'leger');
check('Léger putra 12,4 th tahap 5 → 10,5 km/jam: P50 10,47 ≤ 10,5 < P60 10,75 → P50–P60 sedang', (r => r.copy.includes('Tomkinson 2017 P50–P60 (sedang)'))(lg.calc({ stage: 5 }, { age: 12.4, sex: 'M' }, cx3)));
check('Léger dewasa 30 th: tanpa persentil Tomkinson', !lg.calc({ stage: 10 }, { age: 30, sex: 'M' }, cx3).copy.includes('Tomkinson'));
check('Label kategori TKPN 5 tingkat ID/EN', TKPN_CAT.id.length === 5 && TKPN_CAT.en.length === 5);

console.log(`\n${n} pemeriksaan lulus.`);
