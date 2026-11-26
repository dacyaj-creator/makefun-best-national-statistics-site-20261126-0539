// Statistik Indonesia — hand-in program (Node 22, standard library only).
//
// The site itself is plain static files under app/: a browser opens
// app/index.html (ES modules, CSS, no build step) and nothing it runs,
// styles or shows loads over the network. This program hands the site in:
// it copies app/ and screenshots/ from beside this file into /output and
// writes /output/dossier.json, the summary the judge reads (the screenshots,
// the first load's files and bytes, and the source), using the vendored
// make.fun library. vendor/makefun-frontend.ts stays exactly as the kit
// shipped it: the scorer rebuilds the dossier with its own copy and
// requires the two to match byte for byte.
//
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handIn() {
  mkdirSync(outDir, { recursive: true });
  cpSync(join(root, 'app'), join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  const shots = join(root, 'screenshots');
  if (existsSync(shots)) cpSync(shots, join(outDir, 'screenshots'), { recursive: true });
  // The scorer's own caps (see the kit's reference/gate.json): only
  // text_max_bytes shapes the bytes; the rest refuse an entry the scorer
  // would refuse anyway (more than 4 screenshots, one over 256 KiB, more
  // than 993 files and directories in app/, or app/ over 16 MiB).
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

handIn();
