# SakuSKO

Kalkulator kedokteran olahraga di HP yang bisa dipakai **tanpa sinyal**.

- Alamat aplikasi: <https://marcus-spko.github.io/sakusko/>
- Versi: 0.1 (dalam pengembangan) — Modul 1 (HRmax & zona) sudah aktif; modul lain menyusul.
- Bahasa: Indonesia / English.

## Prinsip
- **Tanpa identitas pasien/atlet.** Tidak ada kolom nama, nomor rekam medis, atau tanggal lahir. Angka yang diisi hanya dipakai saat menghitung dan hilang ketika halaman ditutup.
- **Setiap rumus bersumber** (format Vancouver + DOI), mencantumkan populasi asal, dan diuji terhadap contoh hitung.
- Alat bantu hitung, **bukan pengganti penilaian klinis**. Bukan produk resmi institusi mana pun.

## Struktur
| Berkas | Isi |
|---|---|
| `index.html` | Halaman utama |
| `css/app.css` | Tampilan (tema Oranye Mangga) |
| `js/formulas.js` | Semua rumus (fungsi murni) |
| `js/i18n.js` | Teks dua bahasa, glosarium, sumber |
| `js/app.js` | Logika layar |
| `sw.js` | Penyimpanan offline |
| `tests/formulas.test.mjs` | Uji rumus terhadap contoh hitung (`node tests/formulas.test.mjs`) |

## Lisensi pihak ketiga
Huruf *Plus Jakarta Sans* — SIL Open Font License 1.1 (`fonts/OFL.txt`).
