// Statistik Indonesia: hash routing, the year selector, the province filter
// and search. Every section is reached by a link; nothing here fetches data
// from the network — all figures come from data.js via views.js.
//
//   #/                 Beranda (headline indicators, year selector, search)
//   #/penduduk         Penduduk
//   #/ekonomi          Ekonomi
//   #/tenaga-kerja     Ketenagakerjaan
//   #/pendidikan       Pendidikan
//   #/kesehatan        Kesehatan
//   #/provinsi         Perbandingan provinsi (province filter)
//   #/tentang          Tentang Data (sources)
//   #/cari?q=...       Search results
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import {
  home,
  penduduk,
  ekonomi,
  tenagaKerja,
  pendidikanView,
  kesehatanView,
  provinsiView,
  tentang,
  cari,
  missing,
} from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('main-nav');

const TITLES = {
  home: 'Statistik Indonesia — Portal Statistik Nasional',
  penduduk: 'Penduduk | Statistik Indonesia',
  ekonomi: 'Ekonomi | Statistik Indonesia',
  'tenaga-kerja': 'Ketenagakerjaan | Statistik Indonesia',
  pendidikan: 'Pendidikan | Statistik Indonesia',
  kesehatan: 'Kesehatan | Statistik Indonesia',
  provinsi: 'Provinsi | Statistik Indonesia',
  tentang: 'Tentang Data | Statistik Indonesia',
  cari: 'Cari | Statistik Indonesia',
};

let year = 2024;
let province = '';

function sectionFromHash() {
  const hash = location.hash || '#/';
  const path = hash.replace(/^#\/?/, '').split('?')[0];
  return path === '' ? 'home' : path;
}

function queryParam(name) {
  const hash = location.hash || '';
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return '';
  return new URLSearchParams(hash.slice(qIndex + 1)).get(name) ?? '';
}

function render() {
  window.__shotReady = false;
  const section = sectionFromHash();
  let html = '';
  switch (section) {
    case 'home': html = home(year); break;
    case 'penduduk': html = penduduk(year); break;
    case 'ekonomi': html = ekonomi(year); break;
    case 'tenaga-kerja': html = tenagaKerja(year); break;
    case 'pendidikan': html = pendidikanView(); break;
    case 'kesehatan': html = kesehatanView(); break;
    case 'provinsi': html = provinsiView(province); break;
    case 'tentang': html = tentang(); break;
    case 'cari': html = cari(queryParam('q')); break;
    default: html = missing(); break;
  }
  document.title = TITLES[section] ?? TITLES.home;
  app.innerHTML = html;
  for (const link of nav.querySelectorAll('a')) {
    const target = link.getAttribute('href').replace(/^#\/?/, '') || 'home';
    link.classList.toggle('active', target === section);
    if (target === section) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  bindControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function bindControls() {
  const yearSelect = document.querySelector('[data-control="year"]');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      year = Number(yearSelect.value);
      render();
    });
  }
  const provSelect = document.querySelector('[data-control="prov"]');
  if (provSelect) {
    provSelect.addEventListener('change', () => {
      province = provSelect.value;
      render();
    });
  }
  const form = document.querySelector('form.search');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="search"]');
      location.hash = `#/cari?q=${encodeURIComponent(input.value.trim())}`;
    });
  }
}

window.addEventListener('hashchange', render);
render();
