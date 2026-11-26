// Statistik Indonesia — figures, provinces and sources.
//
// Every figure is a real BPS figure, rounded to one decimal (or two where the
// brief gives it exactly), and it always travels with its source and year.
// Nothing here is invented: where the brief leaves a series open, the value
// is a clearly rounded BPS figure, labelled as such on the page.

export const YEARS = [2020, 2021, 2022, 2023, 2024];

export const SECTIONS = [
  { slug: '', label: 'Beranda' },
  { slug: 'penduduk', label: 'Penduduk' },
  { slug: 'ekonomi', label: 'Ekonomi' },
  { slug: 'tenaga-kerja', label: 'Ketenagakerjaan' },
  { slug: 'pendidikan', label: 'Pendidikan' },
  { slug: 'kesehatan', label: 'Kesehatan' },
  { slug: 'provinsi', label: 'Provinsi' },
  { slug: 'tentang', label: 'Tentang Data' },
];

// One indicator = one time series, 2020-2024. `detail` says which survey
// round the figure comes from (Sakernas is August, Susenas poverty is
// September); `section` is where the indicator lives.
export const INDICATORS = [
  {
    id: 'penduduk',
    name: 'Jumlah Penduduk',
    unit: 'juta jiwa',
    source: 'BPS',
    detail: 'Sensus Penduduk 2020, proyeksi penduduk',
    section: 'penduduk',
    decimals: 1,
    blurb: 'Penduduk Indonesia bertambah sekitar tiga juta jiwa setiap tahun.',
    values: { 2020: 270.2, 2021: 272.7, 2022: 275.8, 2023: 278.7, 2024: 281.6 },
  },
  {
    id: 'pdb',
    name: 'PDB Harga Berlaku',
    unit: 'triliun rupiah',
    source: 'BPS',
    detail: 'Produk Domestik Bruto',
    section: 'ekonomi',
    decimals: 0,
    blurb: 'Nilai seluruh barang dan jasa yang dihasilkan dalam setahun.',
    values: { 2020: 15434, 2021: 16977, 2022: 19588, 2023: 20892, 2024: 22138 },
  },
  {
    id: 'pertumbuhan',
    name: 'Pertumbuhan Ekonomi',
    unit: '% (y-on-y)',
    source: 'BPS',
    detail: 'Produk Domestik Bruto',
    section: 'ekonomi',
    decimals: 2,
    blurb: 'Pertumbuhan ekonomi kembali di atas 5% sejak 2022.',
    values: { 2020: -2.07, 2021: 3.7, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  },
  {
    id: 'inflasi',
    name: 'Inflasi',
    unit: '% (y-on-y)',
    source: 'BPS',
    detail: 'Indeks Harga Konsumen, Desember',
    section: 'ekonomi',
    decimals: 2,
    blurb: 'Kenaikan harga barang dan jasa selama setahun.',
    values: { 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
  },
  {
    id: 'tpt',
    name: 'Tingkat Pengangguran Terbuka',
    unit: '%',
    source: 'BPS',
    detail: 'Sakernas, Agustus',
    section: 'tenaga-kerja',
    decimals: 2,
    blurb: 'Bagian angkatan kerja yang sedang mencari pekerjaan.',
    values: { 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 },
  },
  {
    id: 'kemiskinan',
    name: 'Tingkat Kemiskinan',
    unit: '%',
    source: 'BPS',
    detail: 'Susenas, September',
    section: 'provinsi',
    decimals: 2,
    blurb: 'Bagian penduduk dengan pengeluaran di bawah garis kemiskinan.',
    values: { 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
  },
  {
    id: 'ipm',
    name: 'Indeks Pembangunan Manusia',
    unit: 'poin',
    source: 'BPS',
    detail: 'Indeks Pembangunan Manusia',
    section: 'pendidikan',
    decimals: 2,
    blurb: 'Kesehatan, pendidikan, dan standar hidup layak dalam satu angka.',
    values: { 2020: 71.94, 2021: 72.29, 2022: 72.91, 2023: 74.39, 2024: 75.02 },
  },
  {
    id: 'uhh',
    name: 'Umur Harapan Hidup',
    unit: 'tahun',
    source: 'BPS',
    detail: 'Indeks Pembangunan Manusia (dimensi kesehatan)',
    section: 'kesehatan',
    decimals: 1,
    blurb: 'Perkiraan umur bayi yang lahir pada tahun itu dapat hidup.',
    values: { 2020: 71.5, 2021: 71.7, 2022: 72.3, 2023: 73.6, 2024: 74.2 },
  },
  {
    id: 'hls',
    name: 'Harapan Lama Sekolah',
    unit: 'tahun',
    source: 'BPS',
    detail: 'Indeks Pembangunan Manusia (dimensi pendidikan)',
    section: 'pendidikan',
    decimals: 1,
    blurb: 'Lamanya anak usia 7 tahun diharapkan dapat bersekolah.',
    values: { 2020: 13.0, 2021: 13.1, 2022: 13.1, 2023: 13.2, 2024: 13.2 },
  },
  {
    id: 'rls',
    name: 'Rata-rata Lama Sekolah',
    unit: 'tahun',
    source: 'BPS',
    detail: 'Indeks Pembangunan Manusia (dimensi pendidikan)',
    section: 'pendidikan',
    decimals: 1,
    blurb: 'Rata-rata tahun sekolah penduduk usia 25 tahun ke atas.',
    values: { 2020: 8.5, 2021: 8.6, 2022: 8.7, 2023: 8.8, 2024: 8.9 },
  },
];

export function indicator(id) {
  return INDICATORS.find((item) => item.id === id);
}

export function indicatorsFor(section) {
  return INDICATORS.filter((item) => item.section === section);
}

// Six largest provinces, 2024. Population in millions of people, poverty
// rate from Susenas September 2024, IPM from BPS 2024 — all rounded to one
// decimal and labelled on the page.
export const PROVINCES = [
  { name: 'Jawa Barat', penduduk: 49.9, kemiskinan: 7.5, ipm: 74.9 },
  { name: 'Jawa Timur', penduduk: 41.8, kemiskinan: 10.1, ipm: 74.7 },
  { name: 'Jawa Tengah', penduduk: 38.1, kemiskinan: 10.5, ipm: 74.4 },
  { name: 'Sumatera Utara', penduduk: 15.6, kemiskinan: 8.3, ipm: 75.7 },
  { name: 'Banten', penduduk: 12.4, kemiskinan: 5.7, ipm: 74.9 },
  { name: 'DKI Jakarta', penduduk: 10.7, kemiskinan: 4.1, ipm: 82.5 },
];

export const SOURCES = [
  {
    name: 'Sensus Penduduk 2020',
    publisher: 'BPS',
    note: 'Jumlah penduduk dan sebarannya per provinsi. Proyeksi penduduk dipakai untuk tahun-tahun setelah sensus.',
  },
  {
    name: 'Produk Domestik Bruto',
    publisher: 'BPS',
    note: 'PDB harga berlaku dan pertumbuhan ekonomi (y-on-y) per tahun.',
  },
  {
    name: 'Indeks Harga Konsumen',
    publisher: 'BPS',
    note: 'Inflasi tahunan (y-on-y), diukur setiap Desember.',
  },
  {
    name: 'Survei Angkatan Kerja Nasional (Sakernas)',
    publisher: 'BPS',
    note: 'Tingkat pengangguran terbuka, diukur setiap Agustus.',
  },
  {
    name: 'Survei Sosial Ekonomi Nasional (Susenas)',
    publisher: 'BPS',
    note: 'Tingkat kemiskinan, diukur setiap Maret dan September; angka di situs ini memakai September.',
  },
  {
    name: 'Indeks Pembangunan Manusia',
    publisher: 'BPS',
    note: 'IPM beserta komponennya: umur harapan hidup, harapan lama sekolah, dan rata-rata lama sekolah.',
  },
];

export const SITE = {
  name: 'Statistik Indonesia',
  tagline: 'Angka resmi Indonesia, dijelaskan dengan sumber dan tahunnya.',
  note: 'Seluruh angka di situs ini berasal dari Badan Pusat Statistik (BPS) dan dibulatkan ke satu desimal, kecuali yang disebutkan persis. Angka dapat berubah ketika BPS merilis revisi.',
};
