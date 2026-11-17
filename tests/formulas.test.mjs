// Jalankan: node tests/formulas.test.mjs
// Membandingkan hasil rumus aplikasi dengan contoh hitung di Kartu Spesifikasi SakuSKO v0.1.1.
import assert from 'node:assert/strict';
import { hrmax, hrmaxApplies, acsmZones } from '../js/formulas.js';

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

console.log(`\n${n} pemeriksaan lulus.`);
