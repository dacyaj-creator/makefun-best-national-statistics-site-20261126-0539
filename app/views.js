// HTML for every section of Statistik Indonesia, built from data.js.
// Every figure is shown with its value for the chosen year, its change
// against the previous year, and its source label. Charts are hand-built
// SVG: no library, no network, nothing loaded from outside the site.

import { YEARS, INDICATORS, PROVINCES, SOURCES, SITE, indicator, indicatorsFor } from './data.js';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

// Indonesian number format: thousands with a dot, decimals with a comma.
export function fmt(value, decimals = 2) {
  const fixed = Number(value).toFixed(decimals);
  const [whole, frac] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return frac === undefined ? grouped : `${grouped},${frac}`;
}

function changeLine(ind, year) {
  const idx = YEARS.indexOf(year);
  if (idx <= 0) return '<span class="delta flat">Tahun pertama data</span>';
  const now = ind.values[year];
  const before = ind.values[YEARS[idx - 1]];
  const diff = now - before;
  const sign = diff > 0 ? '+' : diff < 0 ? '−' : '';
  const cls = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
  return `<span class="delta ${cls}">${sign}${fmt(Math.abs(diff), ind.decimals ?? 2)} dari ${YEARS[idx - 1]}</span>`;
}

function sourceLine(ind, year) {
  return `<p class="source">Sumber: ${esc(ind.source)}, ${year} · ${esc(ind.detail)}</p>`;
}

function card(ind, year) {
  return `<article class="card">
  <h3>${esc(ind.name)}</h3>
  <p class="big">${fmt(ind.values[year], ind.decimals ?? 2)} <span>${esc(ind.unit)}</span></p>
  ${changeLine(ind, year)}
  <p class="blurb">${esc(ind.blurb)}</p>
  <p class="source">Sumber: ${esc(ind.source)}, ${year}</p>
</article>`;
}

function yearTable(ind) {
  const rows = YEARS.map(
    (y) => `<tr><th scope="row">${y}</th><td>${fmt(ind.values[y], ind.decimals ?? 2)}</td><td>${esc(ind.unit)}</td></tr>`,
  ).join('');
  return `<table class="figures">
  <thead><tr><th>Tahun</th><th>Nilai</th><th>Satuan</th></tr></thead>
  <tbody>${rows}</tbody>
</table>`;
}

function chartFrame(title, svg, ind, year) {
  return `<figure class="chart">
  <figcaption>${esc(title)}</figcaption>
  ${svg}
  ${sourceLine(ind, year)}
</figure>`;
}

// --- SVG charts -----------------------------------------------------------

function scale(values, height, top, bottom) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo === 0 ? 1 : hi - lo;
  const floor = lo - span * 0.15;
  const ceil = hi + span * 0.15;
  const y = (v) => top + (height - top - bottom) * (1 - (v - floor) / (ceil - floor));
  return { y, floor, ceil };
}

export function lineChart(ind, year) {
  const w = 640;
  const h = 260;
  const padL = 52;
  const padR = 14;
  const padT = 24;
  const padB = 30;
  const values = YEARS.map((y) => ind.values[y]);
  const { y, floor, ceil } = scale(values, h, padT, padB);
  const step = (w - padL - padR) / (YEARS.length - 1);
  const x = (i) => padL + i * step;
  const grid = [0, 1, 2, 3].map((i) => {
    const v = floor + ((ceil - floor) * i) / 3;
    return `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" class="grid"/>
    <text x="${padL - 8}" y="${y(v) + 4}" class="axis" text-anchor="end">${fmt(v, ind.decimals ?? 2)}</text>`;
  }).join('');
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const dots = values
    .map((v, i) => {
      const hot = YEARS[i] === year;
      return `<circle cx="${x(i)}" cy="${y(v)}" r="${hot ? 6 : 4}" class="${hot ? 'dot hot' : 'dot'}"/>
      <text x="${x(i)}" y="${y(v) - 10}" class="value" text-anchor="middle">${fmt(v, ind.decimals ?? 2)}</text>`;
    })
    .join('');
  const labels = YEARS.map((yy, i) => `<text x="${x(i)}" y="${h - 8}" class="axis" text-anchor="middle">${yy}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik ${esc(ind.name)} 2020–2024">
  ${grid}
  <polyline points="${points}" class="line"/>
  ${dots}
  ${labels}
</svg>`;
}

export function barChart(ind, year) {
  const w = 640;
  const h = 260;
  const padL = 52;
  const padR = 14;
  const padT = 28;
  const padB = 30;
  const values = YEARS.map((y) => ind.values[y]);
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values);
  const span = hi - lo === 0 ? 1 : hi - lo;
  const floor = lo - span * 0.1;
  const ceil = hi + span * 0.1;
  const y = (v) => padT + (h - padT - padB) * (1 - (v - floor) / (ceil - floor));
  const slot = (w - padL - padR) / YEARS.length;
  const barW = Math.min(56, slot * 0.55);
  const grid = [0, 1, 2, 3].map((i) => {
    const v = floor + ((ceil - floor) * i) / 3;
    return `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" class="grid"/>
    <text x="${padL - 8}" y="${y(v) + 4}" class="axis" text-anchor="end">${fmt(v, ind.decimals ?? 2)}</text>`;
  }).join('');
  const bars = values
    .map((v, i) => {
      const bx = padL + i * slot + (slot - barW) / 2;
      const by = y(Math.max(v, 0));
      const bh = Math.abs(y(v) - y(0));
      const hot = YEARS[i] === year;
      return `<rect x="${bx}" y="${by}" width="${barW}" height="${bh}" class="${hot ? 'bar hot' : 'bar'}"/>
      <text x="${bx + barW / 2}" y="${by - 6}" class="value" text-anchor="middle">${fmt(v, ind.decimals ?? 2)}</text>
      <text x="${bx + barW / 2}" y="${h - 8}" class="axis" text-anchor="middle">${YEARS[i]}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik batang ${esc(ind.name)} 2020–2024">
  ${grid}
  ${bars}
</svg>`;
}

export function provinceBars(rows, valueKey, unitLabel, decimals = 1) {
  const w = 640;
  const rowH = 44;
  const h = rows.length * rowH + 16;
  const max = Math.max(...rows.map((r) => r[valueKey]));
  const labelW = 130;
  const barMax = w - labelW - 70;
  const bars = rows
    .map((r, i) => {
      const bw = Math.max(2, (r[valueKey] / max) * barMax);
      const cy = 30 + i * rowH;
      return `<text x="0" y="${cy + 4}" class="axis">${esc(r.name)}</text>
      <rect x="${labelW}" y="${cy - 11}" width="${bw}" height="22" rx="3" class="bar"/>
      <text x="${labelW + bw + 8}" y="${cy + 4}" class="value">${fmt(r[valueKey], decimals)} ${esc(unitLabel)}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Perbandingan provinsi">
  ${bars}
</svg>`;
}

// --- Sections -------------------------------------------------------------

function sectionHead(title, intro) {
  return `<h1>${esc(title)}</h1><p class="lede">${esc(intro)}</p>`;
}

export function homeView(year) {
  const headline = ['penduduk', 'pertumbuhan', 'inflasi', 'kemiskinan'].map((id) => card(indicator(id), year)).join('');
  return `${sectionHead('Statistik Indonesia', SITE.tagline)}
<div class="cards">${headline}</div>
${chartFrame('Jumlah Penduduk 2020–2024 (juta jiwa)', lineChart(indicator('penduduk'), year), indicator('penduduk'), year)}
${chartFrame('Pertumbuhan Ekonomi 2020–2024 (%)', barChart(indicator('pertumbuhan'), year), indicator('pertumbuhan'), year)}
<p class="note">${esc(SITE.note)}</p>`;
}

export function pendudukView(year) {
  const ind = indicator('penduduk');
  return `${sectionHead('Penduduk', 'Berapa banyak penduduk Indonesia, dan bagaimana sebarannya.')}
<div class="cards">${card(ind, year)}</div>
${chartFrame('Jumlah Penduduk 2020–2024 (juta jiwa)', lineChart(ind, year), ind, year)}
<h2>Per tahun</h2>
${yearTable(ind)}
<h2>Provinsi terbesar</h2>
<p>Lima provinsi terpadat tahun ${year}, menurut Sensus Penduduk 2020 dan proyeksi BPS:</p>
<table class="figures">
<thead><tr><th>Provinsi</th><th>Penduduk (juta)</th></tr></thead>
<tbody>${PROVINCES.slice(0, 5).map((p) => `<tr><th scope="row">${esc(p.name)}</th><td>${fmt(p.penduduk, 1)}</td></tr>`).join('')}</tbody>
</table>
<p class="source">Sumber: BPS, 2024 (dibulatkan ke satu desimal).</p>`;
}

export function ekonomiView(year) {
  const growth = indicator('pertumbuhan');
  const gdp = indicator('pdb');
  const cpi = indicator('inflasi');
  return `${sectionHead('Ekonomi', 'Seberapa besar ekonomi Indonesia, seberapa cepat tumbuhnya, dan seberapa cepat harga naik.')}
<div class="cards">${card(gdp, year)}${card(growth, year)}${card(cpi, year)}</div>
${chartFrame('Pertumbuhan Ekonomi 2020–2024 (%)', barChart(growth, year), growth, year)}
${chartFrame('Inflasi 2020–2024 (% y-on-y)', lineChart(cpi, year), cpi, year)}
<h2>PDB harga berlaku per tahun</h2>
${yearTable(gdp)}
<p class="source">Sumber: BPS, Produk Domestik Bruto; inflasi dari Indeks Harga Konsumen, Desember.</p>`;
}

export function tenagaKerjaView(year) {
  const ind = indicator('tpt');
  return `${sectionHead('Ketenagakerjaan', 'Siapa yang bekerja, siapa yang mencari kerja, dan bagaimana pengangguran bergerak.')}
<div class="cards">${card(ind, year)}</div>
${chartFrame('Tingkat Pengangguran Terbuka 2020–2024 (%)', lineChart(ind, year), ind, year)}
<h2>Per tahun</h2>
${yearTable(ind)}
<p>Angka ini berasal dari Survei Angkatan Kerja Nasional (Sakernas) yang diukur setiap Agustus. Pengangguran melonjak pada 2020 ketika pandemi memukul pasar kerja, lalu turun setiap tahun sesudahnya dan mencapai 4,91% pada Agustus 2024 — titik terendah dalam lima tahun ini.</p>
<p class="source">Sumber: BPS, Sakernas, Agustus.</p>`;
}

export function pendidikanView(year) {
  const ipm = indicator('ipm');
  const hls = indicator('hls');
  const rls = indicator('rls');
  return `${sectionHead('Pendidikan', 'Seberapa lama anak Indonesia bersekolah, dan bagaimana pendidikan mengangkat pembangunan manusia.')}
<div class="cards">${card(hls, year)}${card(rls, year)}${card(ipm, year)}</div>
${chartFrame('Indeks Pembangunan Manusia 2020–2024', lineChart(ipm, year), ipm, year)}
<p>IPM merangkum tiga hal: kesehatan, pendidikan, dan standar hidup layak. Dua komponen pendidikannya — harapan lama sekolah dan rata-rata lama sekolah — naik pelan tapi terus-menerus: anak usia 7 tahun pada 2024 diharapkan bersekolah 13,2 tahun, dan penduduk usia 25 tahun ke atas rata-rata sudah bersekolah 8,9 tahun.</p>
<h2>Harapan lama sekolah per tahun</h2>
${yearTable(hls)}
<p class="source">Sumber: BPS, Indeks Pembangunan Manusia (dimensi pendidikan).</p>`;
}

export function kesehatanView(year) {
  const ind = indicator('uhh');
  return `${sectionHead('Kesehatan', 'Seberapa panjang umur yang dapat diharapkan bayi Indonesia, dan apa artinya bagi pembangunan.')}
<div class="cards">${card(ind, year)}${card(indicator('ipm'), year)}</div>
${chartFrame('Umur Harapan Hidup 2020–2024 (tahun)', lineChart(ind, year), ind, year)}
<h2>Per tahun</h2>
${yearTable(ind)}
<p>Umur harapan hidup adalah salah satu dari tiga dimensi IPM. Angka ini pulih setelah pandemi: dari 71,5 tahun pada 2020 menjadi 74,2 tahun pada 2024.</p>
<p class="source">Sumber: BPS, Indeks Pembangunan Manusia (dimensi kesehatan), dibulatkan ke satu desimal.</p>`;
}

export function provinsiView(year, filter) {
  const chosen = filter && filter !== 'semua' ? filter : 'semua';
  const rows = chosen === 'semua' ? PROVINCES : PROVINCES.filter((p) => p.name === chosen);
  const options = ['semua', ...PROVINCES.map((p) => p.name)]
    .map((name) => `<option value="${esc(name)}" ${name === chosen ? 'selected' : ''}>${name === 'semua' ? 'Semua provinsi' : esc(name)}</option>`)
    .join('');
  const tableRows = rows
    .map((p) => `<tr><th scope="row">${esc(p.name)}</th><td>${fmt(p.penduduk, 1)}</td><td>${fmt(p.kemiskinan, 1)}</td><td>${fmt(p.ipm, 1)}</td></tr>`)
    .join('');
  const sorted = [...rows].sort((a, b) => b.kemiskinan - a.kemiskinan);
  return `${sectionHead('Provinsi', 'Bandingkan enam provinsi terbesar: penduduk, kemiskinan, dan pembangunan manusia.')}
<label class="filter">Provinsi
<select id="province-filter" data-filter="province">${options}</select>
</label>
<table class="figures">
<thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Kemiskinan (%)</th><th>IPM</th></tr></thead>
<tbody>${tableRows}</tbody>
</table>
<figure class="chart">
<figcaption>Tingkat kemiskinan per provinsi, September 2024 (%)</figcaption>
${provinceBars(sorted, 'kemiskinan', '%')}
<p class="source">Sumber: BPS, Susenas September 2024; penduduk dan IPM BPS 2024, dibulatkan.</p>
</figure>
${chartFrame('Tingkat Kemiskinan Nasional 2020–2024 (%)', lineChart(indicator('kemiskinan'), year), indicator('kemiskinan'), year)}`;
}

export function tentangView() {
  const items = SOURCES.map(
    (s) => `<li><strong>${esc(s.name)}</strong> — ${esc(s.publisher)}. ${esc(s.note)}</li>`,
  ).join('');
  return `${sectionHead('Tentang Data', 'Dari mana angka-angka di situs ini berasal, dan bagaimana membacanya.')}
<p>${esc(SITE.note)}</p>
<h2>Sumber data</h2>
<ul class="sources">${items}</ul>
<h2>Cara membaca</h2>
<ul>
<li>Setiap angka selalu disertai sumber dan tahunnya. Pemilih tahun di atas mengubah semua angka di halaman ke tahun itu.</li>
<li>Angka dibulatkan ke satu desimal agar mudah dibaca; pembulatan tidak mengubah urutan atau arah trennya.</li>
<li>Kemiskinan diukur Susenas setiap September; pengangguran diukur Sakernas setiap Agustus; inflasi diukur setiap Desember.</li>
<li>IPM memakai skala 0–100: di atas 70 tergolong tinggi, di atas 80 sangat tinggi.</li>
</ul>`;
}

export function searchView(query, year) {
  const q = query.trim().toLowerCase();
  const hits = INDICATORS.filter(
    (ind) => ind.name.toLowerCase().includes(q) || ind.blurb.toLowerCase().includes(q) || ind.detail.toLowerCase().includes(q),
  );
  if (hits.length === 0) {
    return `<h1>Hasil pencarian</h1><p>Tidak ada indikator yang cocok dengan “${esc(query)}”. Coba kata lain, misalnya “penduduk”, “inflasi”, atau “kemiskinan”.</p>`;
  }
  const items = hits
    .map((ind) => `<li><a href="#/${esc(ind.section)}">${esc(ind.name)}</a> — ${fmt(ind.values[year])} ${esc(ind.unit)} (${year}, ${esc(ind.source)})</li>`)
    .join('');
  return `<h1>Hasil pencarian: “${esc(query)}”</h1><p>${hits.length} indikator ditemukan.</p><ul class="results">${items}</ul>`;
}

export function notFoundView() {
  return `<h1>Halaman tidak ditemukan</h1><p>Alamat ini tidak ada di Statistik Indonesia. <a href="#/">Kembali ke Beranda</a>.</p>`;
}

export { INDICATORS, indicatorsFor };
