// Statistik Indonesia: every figure in this file is a real published figure,
// labelled with its source and year where it is shown. Values are rounded for
// display; the source label next to each figure says where it came from.
// Sources: BPS (Badan Pusat Statistik), Bank Indonesia, Kemenkes/SSGI.

export const YEARS = [2020, 2021, 2022, 2023, 2024];

// Coverage of the figures on this site: one country, five years, one update.
export const META = {
  negara: 'Indonesia',
  tahunTerbaru: 2024,
  diperbarui: 'November 2026',
};

// Headline indicators, one value per year (2020-2024). Units are in the label.
export const indicators = {
  penduduk: {
    name: 'Penduduk',
    unit: 'juta jiwa',
    source: 'BPS, 2024',
    values: { 2020: 270.2, 2021: 272.7, 2022: 275.8, 2023: 278.7, 2024: 281.6 },
    note: 'Hasil proyeksi penduduk, pertengahan tahun.',
  },
  pertumbuhan: {
    name: 'Pertumbuhan ekonomi',
    unit: '% (y-on-y)',
    source: 'BPS, 2024',
    values: { 2020: -2.07, 2021: 3.7, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
    note: 'Pertumbuhan PDB harga konstan terhadap tahun sebelumnya.',
  },
  pdb: {
    name: 'PDB harga berlaku',
    unit: 'Rp triliun',
    source: 'BPS, 2024',
    values: { 2020: 15434, 2021: 16976, 2022: 19588, 2023: 20976, 2024: 22138 },
    note: 'Produk Domestik Bruto atas dasar harga berlaku.',
  },
  inflasi: {
    name: 'Inflasi',
    unit: '% (y-on-y, Desember)',
    source: 'BPS, 2024',
    values: { 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
    note: 'Inflasi tahun kalender, Indeks Harga Konsumen.',
  },
  tpt: {
    name: 'Pengangguran terbuka (TPT)',
    unit: '% (Agustus)',
    source: 'BPS, Agustus 2024',
    values: { 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 },
    note: 'Tingkat Pengangguran Terbuka, Sakernas Agustus.',
  },
  kemiskinan: {
    name: 'Kemiskinan',
    unit: '% penduduk',
    source: 'BPS, September 2024',
    values: { 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
    note: 'Persentase penduduk miskin, September tiap tahun.',
  },
  ipm: {
    name: 'Indeks Pembangunan Manusia',
    unit: 'skor 0–100',
    source: 'BPS, 2024',
    values: { 2020: 71.94, 2021: 72.29, 2022: 72.91, 2023: 74.39, 2024: 75.02 },
    note: 'IPM: kesehatan, pendidikan, dan standar hidup layak.',
  },
  angkatanKerja: {
    name: 'Angkatan kerja',
    unit: 'juta orang',
    source: 'BPS, Agustus 2024',
    values: { 2020: 138.2, 2021: 140.2, 2022: 143.7, 2023: 147.7, 2024: 152.1 },
    note: 'Penduduk usia kerja yang bekerja atau mencari kerja.',
  },
};

// Age structure, 2024 (BPS, rounded shares of the total population).
export const strukturUmur = [
  { kelompok: '0–14 tahun', share: 24.9, note: 'Anak-anak' },
  { kelompok: '15–64 tahun', share: 68.0, note: 'Usia produktif' },
  { kelompok: '65 tahun ke atas', share: 7.1, note: 'Lansia' },
];

// GDP by sector, 2024 shares of PDB (BPS, rounded to one decimal).
export const sektorPdb = [
  { sektor: 'Industri pengolahan', share: 18.7 },
  { sektor: 'Perdagangan', share: 13.0 },
  { sektor: 'Pertanian, kehutanan, perikanan', share: 12.5 },
  { sektor: 'Konstruksi', share: 9.8 },
  { sektor: 'Pertambangan dan penggalian', share: 9.0 },
  { sektor: 'Transportasi dan pergudangan', share: 6.2 },
  { sektor: 'Informasi dan komunikasi', share: 4.4 },
  { sektor: 'Lainnya', share: 26.4 },
];

// Employment by sector, August 2024 (BPS, rounded shares of workers).
export const sektorKerja = [
  { sektor: 'Pertanian', share: 28.2 },
  { sektor: 'Perdagangan', share: 19.1 },
  { sektor: 'Industri pengolahan', share: 13.8 },
  { sektor: 'Jasa kemasyarakatan', share: 17.3 },
  { sektor: 'Konstruksi', share: 8.0 },
  { sektor: 'Lainnya', share: 13.6 },
];

// Provinces: population (millions, 2024, BPS), poverty (September 2024, BPS),
// IPM (2024, BPS). All values rounded to one decimal and labelled as such.
export const provinsi = [
  { nama: 'Jawa Barat', penduduk: 49.9, kemiskinan: 7.5, ipm: 74.4, ibuKota: 'Bandung' },
  { nama: 'Jawa Timur', penduduk: 41.8, kemiskinan: 10.4, ipm: 75.0, ibuKota: 'Surabaya' },
  { nama: 'Jawa Tengah', penduduk: 37.9, kemiskinan: 10.5, ipm: 73.9, ibuKota: 'Semarang' },
  { nama: 'Sumatera Utara', penduduk: 16.0, kemiskinan: 8.2, ipm: 75.1, ibuKota: 'Medan' },
  { nama: 'Banten', penduduk: 12.4, kemiskinan: 5.8, ipm: 76.3, ibuKota: 'Serang' },
  { nama: 'DKI Jakarta', penduduk: 10.7, kemiskinan: 4.1, ipm: 82.4, ibuKota: 'Jakarta' },
];

// Education and health, 2024 (BPS / Kemenkes SSGI).
export const pendidikan = {
  melekHuruf: { value: 98.5, unit: '%', source: 'BPS, 2024', note: 'Penduduk 15 tahun ke atas yang dapat membaca dan menulis.' },
  rataLamaSekolah: { value: 9.0, unit: 'tahun', source: 'BPS, 2024', note: 'Rata-rata lama sekolah penduduk 25 tahun ke atas.' },
  harapanLamaSekolah: { value: 13.2, unit: 'tahun', source: 'BPS, 2024', note: 'Harapan lama sekolah anak usia 7 tahun.' },
  apsSmp: { value: 95.6, unit: '%', source: 'BPS, 2024', note: 'Angka partisipasi sekolah usia 13–15 tahun (dibulatkan).' },
};

export const kesehatan = {
  harapanHidup: { value: 74.0, unit: 'tahun', source: 'BPS, 2024', note: 'Angka harapan hidup saat lahir (dibulatkan).' },
  stunting: { value: 19.8, unit: '%', source: 'Kemenkes (SSGI), 2024', note: 'Prevalensi stunting balita.' },
  kematianBayi: { value: 16, unit: 'per 1.000 kelahiran', source: 'BPS, 2024', note: 'Angka kematian bayi (perkiraan, dibulatkan).' },
  aksesAirBersih: { value: 92.1, unit: '%', source: 'BPS, 2024', note: 'Rumah tangga dengan akses air minum layak (dibulatkan).' },
};

export const SOURCES = [
  { nama: 'Badan Pusat Statistik (BPS)', tentang: 'Penduduk, PDB, inflasi, pengangguran, kemiskinan, IPM, pendidikan, dan data provinsi.', tautan: 'bps.go.id' },
  { nama: 'Bank Indonesia', tentang: 'Data moneter dan nilai tukar sebagai pembanding inflasi.', tautan: 'bi.go.id' },
  { nama: 'Kementerian Kesehatan — SSGI', tentang: 'Survei Status Gizi Indonesia: prevalensi stunting balita.', tautan: 'kemkes.go.id' },
];
