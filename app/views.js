// Statistik Indonesia: every section is rendered from data.js. Charts are
// hand-built SVG — no library, no network. All figures carry source + year.

import {
  YEARS,
  META,
  indicators,
  strukturUmur,
  sektorPdb,
  sektorKerja,
  provinsi,
  pendidikan,
  kesehatan,
  SOURCES,
} from './data.js';

const GREEN = '#0b5d3b';
const GREEN_LIGHT = '#1d8a56';
const GOLD = '#c98a1b';
const INK = '#1c2420';
const MUTED = '#5d6b62';

export function fmt(value, decimals = 1) {
  return value.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtInt(value) {
  return value.toLocaleString('id-ID');
}

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// A line chart as inline SVG. `series` is [{year, value}], `unit` the axis label.
export function lineChart(series, unit) {
  const w = 640;
  const h = 260;
  const padL = 52;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const values = series.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const span = max - min || 1;
  min -= span * 0.12;
  max += span * 0.12;
  const x = (i) => padL + ((w - padL - padR) * i) / (series.length - 1);
  const y = (v) => padT + ((h - padT - padB) * (max - v)) / (max - min);
  const points = series.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const grid = [0.25, 0.5, 0.75].map((f) => {
    const v = min + (max - min) * f;
    const gy = y(v);
    return `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="#e3e7e2" stroke-width="1"/><text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(v, Math.abs(v) < 10 ? 1 : 0)}</text>`;
  }).join('');
  const dots = series.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.value)}" r="4.5" fill="${GREEN}"/><text x="${x(i)}" y="${y(p.value) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${fmt(p.value, Math.abs(p.value) < 10 ? 1 : 0)}</text>`).join('');
  const labels = series.map((p, i) => `<text x="${x(i)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${p.year}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik garis ${esc(unit)}" class="chart">${grid}<polyline points="${points}" fill="none" stroke="${GREEN}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${labels}</svg>`;
}

// A vertical bar chart as inline SVG. `bars` is [{label, value}].
export function barChart(bars, unit, highlightLast = false) {
  const w = 640;
  const h = 260;
  const padL = 52;
  const padR = 16;
  const padT = 26;
  const padB = 34;
  const values = bars.map((b) => b.value);
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const slot = (w - padL - padR) / bars.length;
  const barW = Math.min(64, slot * 0.62);
  const y = (v) => padT + ((h - padT - padB) * (max - v)) / span;
  const zeroY = y(0);
  const rects = bars.map((b, i) => {
    const bx = padL + slot * i + (slot - barW) / 2;
    const top = Math.min(y(b.value), zeroY);
    const height = Math.abs(y(b.value) - zeroY);
    const fill = highlightLast && i === bars.length - 1 ? GOLD : GREEN;
    return `<rect x="${bx.toFixed(1)}" y="${top.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(height, 2).toFixed(1)}" rx="3" fill="${fill}"/><text x="${(bx + barW / 2).toFixed(1)}" y="${(top - 7).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${fmt(b.value, 1)}</text><text x="${(bx + barW / 2).toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(b.label)}</text>`;
  }).join('');
  const grid = `<line x1="${padL}" y1="${zeroY}" x2="${w - padR}" y2="${zeroY}" stroke="#c9d2cb" stroke-width="1"/>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik batang ${esc(unit)}" class="chart">${grid}${rects}</svg>`;
}

// A horizontal bar list (shares), as inline SVG-free HTML bars.
export function shareBars(rows, unit) {
  const max = Math.max(...rows.map((r) => r.share));
  return `<ul class="shares">${rows.map((r) => `<li><span class="share-label">${esc(r.sektor)}</span><span class="share-track"><span class="share-fill" style="width:${((r.share / max) * 100).toFixed(1)}%"></span></span><span class="share-value">${fmt(r.share)}${unit}</span></li>`).join('')}</ul>`;
}

function indicatorCard(key, year) {
  const ind = indicators[key];
  const value = ind.values[year];
  return `<article class="card"><p class="card-name">${esc(ind.name)}</p><p class="card-value">${fmt(value, Math.abs(value) < 100 ? 2 : 0)} <span class="card-unit">${esc(ind.unit)}</span></p><p class="card-source">Sumber: ${esc(ind.source)}</p></article>`;
}

function sourceLine(text) {
  return `<p class="source-note">Sumber: ${esc(text)}</p>`;
}

function searchBox() {
  return `<form class="search" role="search" action="#/cari" method="get"><label for="q">Cari indikator</label><input id="q" name="q" type="search" placeholder="Misal: inflasi, kemiskinan, IPM…" autocomplete="off"><button type="submit">Cari</button></form>`;
}

export function home(year) {
  const pop = YEARS.map((y) => ({ year: y, value: indicators.penduduk.values[y] }));
  const growth = YEARS.map((y) => ({ label: String(y), value: indicators.pertumbuhan.values[y] }));
  return `
  <section class="hero">
    <p class="eyebrow">Portal Statistik Nasional · Indonesia</p>
    <h1>Statistik Indonesia, dalam satu tempat</h1>
    <p class="lede">Angka-angka resmi tentang penduduk, ekonomi, pekerjaan, pendidikan, dan kesehatan — lengkap dengan sumber dan tahunnya, bisa dijelajahi dari desktop maupun ponsel.</p>
    ${searchBox()}
  </section>
  <section class="controls" aria-label="Pilih tahun">
    <label for="year">Tahun data</label>
    <select id="year" data-control="year">${YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('')}</select>
    <span class="hint">Ubah tahun untuk melihat angka pada tahun itu.</span>
  </section>
  <section class="cards" aria-label="Indikator utama">
    ${indicatorCard('penduduk', year)}
    ${indicatorCard('pertumbuhan', year)}
    ${indicatorCard('inflasi', year)}
    ${indicatorCard('tpt', year)}
    ${indicatorCard('kemiskinan', year)}
    ${indicatorCard('ipm', year)}
  </section>
  <section class="grid2">
    <article class="panel"><h2>Pertumbuhan penduduk 2020–2024</h2>${lineChart(pop, 'juta jiwa')}${sourceLine('BPS, 2024 — hasil proyeksi penduduk, pertengahan tahun.')}</article>
    <article class="panel"><h2>Pertumbuhan ekonomi 2020–2024</h2>${barChart(growth, '% per tahun', true)}${sourceLine('BPS, 2024 — pertumbuhan PDB harga konstan.')}</article>
  </section>
  <section class="panel"><h2>Sorotan</h2>
    <ul class="highlights">
      <li><strong>281,6 juta jiwa</strong> — penduduk Indonesia pada 2024 (BPS).</li>
      <li><strong>5,03%</strong> — ekonomi tumbuh pada 2024, ditopang konsumsi rumah tangga dan investasi (BPS).</li>
      <li><strong>8,57%</strong> — penduduk miskin pada September 2024, terendah dalam lima tahun terakhir (BPS).</li>
      <li><strong>75,02</strong> — Indeks Pembangunan Manusia 2024, naik dari 74,39 pada 2023 (BPS).</li>
    </ul>
  </section>`;
}

export function penduduk(year) {
  const pop = YEARS.map((y) => ({ year: y, value: indicators.penduduk.values[y] }));
  return `
  <h1>Penduduk</h1>
  <p class="lede">Jumlah, pertumbuhan, dan struktur umur penduduk Indonesia.</p>
  <section class="cards">
    ${indicatorCard('penduduk', year)}
    <article class="card"><p class="card-name">Kepadatan penduduk</p><p class="card-value">148 <span class="card-unit">jiwa/km²</span></p><p class="card-source">Sumber: BPS, 2024 (dibulatkan)</p></article>
    <article class="card"><p class="card-name">Penduduk perkotaan</p><p class="card-value">58,6 <span class="card-unit">%</span></p><p class="card-source">Sumber: BPS, 2024 (dibulatkan)</p></article>
  </section>
  <section class="grid2">
    <article class="panel"><h2>Jumlah penduduk 2020–2024</h2>${lineChart(pop, 'juta jiwa')}${sourceLine('BPS, 2024 — hasil proyeksi penduduk.')}</article>
    <article class="panel"><h2>Struktur umur, 2024</h2>${shareBars(strukturUmur.map((s) => ({ sektor: s.kelompok, share: s.share })), '%')}${sourceLine('BPS, 2024 — pangsa tiap kelompok umur (dibulatkan).')}</article>
  </section>
  <section class="panel"><h2>Provinsi terpadat</h2>
    <table class="table"><thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Ibu kota</th></tr></thead><tbody>
    ${provinsi.slice(0, 4).map((p) => `<tr><td>${esc(p.nama)}</td><td>${fmt(p.penduduk)}</td><td>${esc(p.ibuKota)}</td></tr>`).join('')}
    </tbody></table>${sourceLine('BPS, 2024. Lihat semua provinsi di halaman Provinsi.')}
    <p><a class="link" href="#/provinsi">Bandingkan semua provinsi →</a></p>
  </section>`;
}

export function ekonomi(year) {
  const growth = YEARS.map((y) => ({ label: String(y), value: indicators.pertumbuhan.values[y] }));
  const inflation = YEARS.map((y) => ({ year: y, value: indicators.inflasi.values[y] }));
  return `
  <h1>Ekonomi</h1>
  <p class="lede">PDB, pertumbuhan, inflasi, dan struktur ekonomi Indonesia.</p>
  <section class="cards">
    ${indicatorCard('pdb', year)}
    ${indicatorCard('pertumbuhan', year)}
    ${indicatorCard('inflasi', year)}
  </section>
  <section class="grid2">
    <article class="panel"><h2>Pertumbuhan ekonomi 2020–2024</h2>${barChart(growth, '% per tahun', true)}${sourceLine('BPS, 2024 — pertumbuhan PDB harga konstan.')}</article>
    <article class="panel"><h2>Inflasi tahunan 2020–2024</h2>${lineChart(inflation, '% (y-on-y, Desember)')}${sourceLine('BPS, 2024 — Indeks Harga Konsumen.')}</article>
  </section>
  <section class="panel"><h2>PDB menurut lapangan usaha, 2024</h2>${shareBars(sektorPdb, '%')}${sourceLine('BPS, 2024 — pangsa PDB harga berlaku (dibulatkan).')}</section>`;
}

export function tenagaKerja(year) {
  const tpt = YEARS.map((y) => ({ year: y, value: indicators.tpt.values[y] }));
  return `
  <h1>Ketenagakerjaan</h1>
  <p class="lede">Angkatan kerja, pengangguran, dan di mana orang Indonesia bekerja.</p>
  <section class="cards">
    ${indicatorCard('angkatanKerja', year)}
    ${indicatorCard('tpt', year)}
    <article class="card"><p class="card-name">Pekerja informal</p><p class="card-value">59,0 <span class="card-unit">%</span></p><p class="card-source">Sumber: BPS, Agustus 2024 (dibulatkan)</p></article>
  </section>
  <section class="grid2">
    <article class="panel"><h2>Pengangguran terbuka 2020–2024</h2>${lineChart(tpt, '% (Agustus)')}${sourceLine('BPS, Agustus tiap tahun — Sakernas.')}</article>
    <article class="panel"><h2>Pekerja menurut lapangan usaha, 2024</h2>${shareBars(sektorKerja, '%')}${sourceLine('BPS, Agustus 2024 — pangsa pekerja (dibulatkan).')}</article>
  </section>`;
}

export function pendidikanView() {
  const p = pendidikan;
  return `
  <h1>Pendidikan</h1>
  <p class="lede">Melek huruf, lama sekolah, dan partisipasi sekolah di Indonesia.</p>
  <section class="cards">
    <article class="card"><p class="card-name">Melek huruf (15+)</p><p class="card-value">${fmt(p.melekHuruf.value)} <span class="card-unit">%</span></p><p class="card-source">Sumber: ${esc(p.melekHuruf.source)}</p><p class="card-note">${esc(p.melekHuruf.note)}</p></article>
    <article class="card"><p class="card-name">Rata-rata lama sekolah</p><p class="card-value">${fmt(p.rataLamaSekolah.value)} <span class="card-unit">tahun</span></p><p class="card-source">Sumber: ${esc(p.rataLamaSekolah.source)}</p><p class="card-note">${esc(p.rataLamaSekolah.note)}</p></article>
    <article class="card"><p class="card-name">Harapan lama sekolah</p><p class="card-value">${fmt(p.harapanLamaSekolah.value)} <span class="card-unit">tahun</span></p><p class="card-source">Sumber: ${esc(p.harapanLamaSekolah.source)}</p><p class="card-note">${esc(p.harapanLamaSekolah.note)}</p></article>
    <article class="card"><p class="card-name">Partisipasi sekolah SMP</p><p class="card-value">${fmt(p.apsSmp.value)} <span class="card-unit">%</span></p><p class="card-source">Sumber: ${esc(p.apsSmp.source)}</p><p class="card-note">${esc(p.apsSmp.note)}</p></article>
  </section>
  <section class="panel"><h2>Kenapa angka ini penting</h2>
    <p>Harapan lama sekolah 13,2 tahun berarti anak usia 7 tahun kini diperkirakan menempuh pendidikan hingga jenjang menengah atas. Rata-rata lama sekolah 9,0 tahun menunjukkan penduduk dewasa rata-rata menamatkan SMP — pekerjaan rumah besar bagi pemerataan pendidikan di luar Jawa.</p>
    ${sourceLine('BPS, 2024.')}
  </section>`;
}

export function kesehatanView() {
  const k = kesehatan;
  return `
  <h1>Kesehatan</h1>
  <p class="lede">Harapan hidup, gizi balita, dan akses layanan dasar di Indonesia.</p>
  <section class="cards">
    <article class="card"><p class="card-name">Angka harapan hidup</p><p class="card-value">${fmt(k.harapanHidup.value)} <span class="card-unit">tahun</span></p><p class="card-source">Sumber: ${esc(k.harapanHidup.source)}</p><p class="card-note">${esc(k.harapanHidup.note)}</p></article>
    <article class="card"><p class="card-name">Stunting balita</p><p class="card-value">${fmt(k.stunting.value)} <span class="card-unit">%</span></p><p class="card-source">Sumber: ${esc(k.stunting.value)}</p><p class="card-note">${esc(k.stunting.note)}</p></article>
    <article class="card"><p class="card-name">Kematian bayi</p><p class="card-value">${fmt(k.kematianBayi.value, 0)} <span class="card-unit">per 1.000 kelahiran</span></p><p class="card-source">Sumber: ${esc(k.kematianBayi.source)}</p><p class="card-note">${esc(k.kematianBayi.note)}</p></article>
    <article class="card"><p class="card-name">Akses air minum layak</p><p class="card-value">${fmt(k.aksesAirBersih.value)} <span class="card-unit">%</span></p><p class="card-source">Sumber: ${esc(k.aksesAirBersih.source)}</p><p class="card-note">${esc(k.aksesAirBersih.note)}</p></article>
  </section>
  <section class="panel"><h2>Stunting: pekerjaan rumah terbesar</h2>
    <p>Prevalensi stunting 19,8% pada 2024 berarti hampir satu dari lima balita tumbuh di bawah standar. Pemerintah menargetkan 14,2% pada 2029 — penurunan yang membutuhkan perbaikan gizi, sanitasi, dan layanan ibu hamil secara bersamaan.</p>
    ${sourceLine('Kemenkes (SSGI), 2024.')}
  </section>`;
}

export function provinsiView(selected) {
  const rows = selected ? provinsi.filter((p) => p.nama === selected) : provinsi;
  const bars = provinsi.map((p) => ({ label: p.nama.replace('Jawa ', 'J. ').replace('Sumatera Utara', 'Sumut').replace('DKI Jakarta', 'DKI'), value: p.kemiskinan }));
  return `
  <h1>Provinsi</h1>
  <p class="lede">Bandingkan penduduk, kemiskinan, dan IPM enam provinsi terbesar.</p>
  <section class="controls" aria-label="Pilih provinsi">
    <label for="prov">Provinsi</label>
    <select id="prov" data-control="prov">
      <option value="">Semua provinsi</option>
      ${provinsi.map((p) => `<option value="${esc(p.nama)}"${p.nama === selected ? ' selected' : ''}>${esc(p.nama)}</option>`).join('')}
    </select>
    <span class="hint">Pilih satu provinsi untuk menyorot barisnya.</span>
  </section>
  <section class="panel"><h2>Perbandingan provinsi, 2024</h2>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Kemiskinan (%)</th><th>IPM</th><th>Ibu kota</th></tr></thead>
      <tbody>${rows.map((p) => `<tr${p.nama === selected ? ' class="row-active"' : ''}><td>${esc(p.nama)}</td><td>${fmt(p.penduduk)}</td><td>${fmt(p.kemiskinan)}</td><td>${fmt(p.ipm)}</td><td>${esc(p.ibuKota)}</td></tr>`).join('')}</tbody>
    </table></div>
    ${sourceLine('BPS, 2024 — penduduk dan IPM; kemiskinan September 2024. Nilai dibulatkan ke satu desimal.')}
  </section>
  <section class="panel"><h2>Kemiskinan menurut provinsi, September 2024</h2>${barChart(bars, '% penduduk')}${sourceLine('BPS, September 2024.')}</section>`;
}

export function tentang() {
  return `
  <h1>Tentang Data</h1>
  <p class="lede">Dari mana angka-angka di situs ini berasal, dan bagaimana membacanya.</p>
  <section class="panel"><h2>Cakupan data</h2>
    <p>Seluruh angka di situs ini mencakup ${esc(META.negara)} untuk tahun 2020–${META.tahunTerbaru}, terakhir diperbarui ${esc(META.diperbarui)}.</p>
  </section>
  <section class="panel"><h2>Sumber data</h2>
    <ul class="sources">
      ${SOURCES.map((s) => `<li><strong>${esc(s.nama)}</strong> — ${esc(s.tentang)} <span class="source-site">${esc(s.tautan)}</span></li>`).join('')}
    </ul>
  </section>
  <section class="panel"><h2>Cara membaca angka</h2>
    <ul class="highlights">
      <li>Setiap angka menampilkan sumber dan tahunnya di bawah angka itu.</li>
      <li>Nilai yang dibulatkan ditandai “(dibulatkan)” pada label sumbernya.</li>
      <li>Persentase kemiskinan memakai data September; pengangguran memakai Sakernas Agustus.</li>
      <li>Situs ini statis: semua angka tersimpan di berkas situs sendiri, tidak mengambil data dari internet saat dibuka.</li>
    </ul>
  </section>
  <section class="panel"><h2>Tentang situs ini</h2>
    <p>Statistik Indonesia adalah portal percontohan yang disusun untuk lomba situs statistik nasional di make.fun. Angka-angka di sini angka resmi yang dipublikasikan; situs ini bukan situs resmi BPS dan tidak berafiliasi dengan BPS.</p>
  </section>`;
}

export function cari(query) {
  const q = query.trim().toLowerCase();
  const hits = [];
  if (q) {
    for (const [key, ind] of Object.entries(indicators)) {
      if (ind.name.toLowerCase().includes(q) || key.toLowerCase().includes(q)) {
        hits.push({ name: ind.name, value: `${fmt(ind.values[2024], 2)} ${ind.unit}`, source: ind.source, note: ind.note });
      }
    }
    for (const p of provinsi) {
      if (p.nama.toLowerCase().includes(q)) {
        hits.push({ name: `Provinsi ${p.nama}`, value: `${fmt(p.penduduk)} juta jiwa · kemiskinan ${fmt(p.kemiskinan)}%`, source: 'BPS, 2024', note: `Ibu kota: ${p.ibuKota}.` });
      }
    }
    if ('pendidikan'.includes(q)) hits.push({ name: 'Melek huruf (15+)', value: `${fmt(pendidikan.melekHuruf.value)}%`, source: pendidikan.melekHuruf.source, note: pendidikan.melekHuruf.note });
    if ('kesehatan'.includes(q) || 'stunting'.includes(q)) hits.push({ name: 'Stunting balita', value: `${fmt(kesehatan.stunting.value)}%`, source: kesehatan.stunting.source, note: kesehatan.stunting.note });
  }
  return `
  <h1>Hasil pencarian</h1>
  <p class="lede">Kata kunci: “${esc(query)}”</p>
  ${searchBox()}
  ${q === '' ? '<p>Masukkan kata kunci, misalnya “inflasi”, “kemiskinan”, atau nama provinsi.</p>' : hits.length === 0 ? `<p>Tidak ada indikator yang cocok dengan “${esc(query)}”. Coba “inflasi”, “kemiskinan”, “IPM”, atau “Jawa Barat”.</p>` : `<section class="cards">${hits.map((h) => `<article class="card"><p class="card-name">${esc(h.name)}</p><p class="card-value">${esc(h.value)}</p><p class="card-source">Sumber: ${esc(h.source)}</p><p class="card-note">${esc(h.note)}</p></article>`).join('')}</section>`}`;
}

export function missing() {
  return `<h1>Halaman tidak ditemukan</h1><p class="lede">Tautan yang Anda buka tidak ada di situs ini.</p><p><a class="link" href="#/">Kembali ke Beranda →</a></p>`;
}
