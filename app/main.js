// Statistik Indonesia — routing and state.
//
// Hash routes, one per section, plus a live search and a year selector that
// lives in the header and re-renders every page for the chosen year:
//
//   #/                Beranda
//   #/penduduk        Penduduk
//   #/ekonomi         Ekonomi
//   #/tenaga-kerja    Ketenagakerjaan
//   #/pendidikan      Pendidikan
//   #/kesehatan       Kesehatan
//   #/provinsi        Provinsi
//   #/tentang         Tentang Data
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { YEARS, SECTIONS } from './data.js';
import {
  homeView,
  pendudukView,
  ekonomiView,
  tenagaKerjaView,
  pendidikanView,
  kesehatanView,
  provinsiView,
  tentangView,
  searchView,
  notFoundView,
} from './views.js';

const app = document.getElementById('app');
const yearSelect = document.getElementById('year-select');
const searchInput = document.getElementById('site-search');

const state = {
  year: 2024,
  query: '',
  province: 'semua',
};

const VIEWS = {
  '': homeView,
  penduduk: pendudukView,
  ekonomi: ekonomiView,
  'tenaga-kerja': tenagaKerjaView,
  pendidikan: pendidikanView,
  kesehatan: kesehatanView,
  provinsi: provinsiView,
  tentang: tentangView,
};

function sectionTitle(slug) {
  const found = SECTIONS.find((s) => s.slug === slug);
  return found ? found.label : 'Statistik Indonesia';
}

function render() {
  window.__shotReady = false;
  const slug = location.hash.replace(/^#\/?/, '').split('?')[0];
  let html;
  if (state.query.trim() !== '') {
    html = searchView(state.query, state.year);
    document.title = `Cari “${state.query}” | Statistik Indonesia`;
  } else if (Object.prototype.hasOwnProperty.call(VIEWS, slug)) {
    const view = VIEWS[slug];
    html = slug === 'provinsi' ? view(state.year, state.province) : view(state.year);
    document.title = slug === '' ? 'Statistik Indonesia' : `${sectionTitle(slug)} | Statistik Indonesia`;
  } else {
    html = notFoundView();
    document.title = 'Tidak ditemukan | Statistik Indonesia';
  }
  app.innerHTML = html;
  const filter = document.getElementById('province-filter');
  if (filter) {
    filter.addEventListener('change', (event) => {
      state.province = event.target.value;
      render();
    });
  }
  if (yearSelect) yearSelect.value = String(state.year);
  document.querySelectorAll('nav a').forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    link.classList.toggle('active', href === `#/${slug}` || (slug === '' && href === '#/'));
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

if (yearSelect) {
  YEARS.forEach((y) => {
    const option = document.createElement('option');
    option.value = String(y);
    option.textContent = String(y);
    yearSelect.appendChild(option);
  });
  yearSelect.value = String(state.year);
  yearSelect.addEventListener('change', (event) => {
    state.year = Number(event.target.value);
    render();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    render();
  });
}

window.addEventListener('hashchange', () => {
  state.query = '';
  if (searchInput) searchInput.value = '';
  render();
});

render();
