// Jalankan: node tests/formulas.test.mjs
// Membandingkan hasil rumus aplikasi dengan contoh hitung (Kartu Spesifikasi v0.1.1 dan hitung tangan gelombang B).
import assert from 'node:assert/strict';
import {
  hrmax, hrmaxApplies, acsmZones, vo2Cooper, vo2Rockport, vo2Leger, legerSpeed, vo2Run24, vo2Queens, harvardLong, harvardShort,
  vo2YoYo1, vo2Ift, sixMwtPred, siri, jp3Men, jpw3Women, dwDensity, dwRow, hastutiS4, hastutiAbd, ffmFrom, targetWeight, endomorphy, mesomorphy, hwr, ectomorphy, somatoXY, sweatLoss, sweatRate, bmChangePct, rmrTenHaaf, rmrTenHaafFfm, rmrMifflin, rmrHarrisRev, rmrCunningham, energyAvail, bmi, bmiCat, centralObese, whtr, whr, whrHigh, rmEpley, rmBrzycki, NUZZO, round05, gripCut, stsCut,
} from '../js/formulas.js';
import { acsmResult } from '../js/screening.js';

const near = (a, b, tol = 0.05) => Math.abs(a - b) <= tol;
let n = 0;
const check = (label, cond) => { assert.ok(cond, label); n++; console.log('ok -', label); };

// Modul 1 — pria 30 th, HR istirahat 60 (Kartu Spesifikasi, Modul 1)
check('Fox 30 th = 190', near(hrmax('fox', 30), 190));
check('Tanaka 30 th = 187', near(hrmax('tanaka', 30), 187));
check('Gellish 30 th = 186', near(hrmax('gellish', 30), 186));
check('Nes 30 th = 191,8', near(hrmax('nes', 30), 191.8));
check('Gulati 30 th = 179,6', near(hrmax('gulati', 30), 179.6));
check('Gulati tidak berlaku untuk pria', !hrmaxApplies('gulati', 'M'));
check('Gulati berlaku untuk wanita', hrmaxApplies('gulati', 'F'));
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
check('Lari 2,4 km 12 mnt = 43,75', near(vo2Run24(12), 43.75, 0.001));
check('Queens pria HR 152 = 47,49', near(vo2Queens(true, 152), 47.49, 0.005));
check('Queens wanita HR 160 = 36,26', near(vo2Queens(false, 160), 36.258, 0.005));
check('Harvard panjang 300 dtk, 80/70/60 = 71,4', near(harvardLong(300, 80, 70, 60), 71.43, 0.01));
check('Harvard pendek 300 dtk, 80 = 68,2', near(harvardShort(300, 80), 68.18, 0.01));
check('Yo-Yo IR1 1.200 m = 46,48', near(vo2YoYo1(1200), 46.48, 0.001));
check('30-15 IFT pria 20 th 70 kg VIFT 19 = 50,67', near(vo2Ift(true, 20, 70, 19), 50.669, 0.005));
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
check('Ten Haaf (FFM 62,5) = 1.907', Math.round(rmrTenHaafFfm(62.5)) === 1907);
check('Mifflin-St Jeor pria = 1.680', rmrMifflin(75, 172, 30, true) === 1680);
check('Mifflin-St Jeor wanita = pria − 166', rmrMifflin(75, 172, 30, false) === 1514);
check('Harris-Benedict revisi pria = 1.748', Math.round(rmrHarrisRev(75, 172, 30, true)) === 1748);
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
check('Hastuti Σ4 46 mm, 30 th = 20,7%', near(hastutiS4(46, 30), 20.67, 0.01));
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
// Modul 10 — contoh Kartu Spesifikasi v0.1.1
check('Sweat: 70,0 → 68,9 kg, minum 0,8 L, urine 0,2 L → 1,70 L', near(sweatLoss(70, 68.9, 0.8, 0.2), 1.70, 0.001));
check('Sweat rate 1,70 L / 1,5 jam = 1,13 L/jam', near(sweatRate(1.7, 1.5), 1.133, 0.001));
check('Kehilangan BB 1,57%', near(bmChangePct(70, 68.9), 1.571, 0.001));
check('BB naik → perubahan negatif (tanda minum berlebihan)', bmChangePct(70, 70.4) < 0);

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

console.log(`\n${n} pemeriksaan lulus.`);
