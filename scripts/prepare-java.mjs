import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const base = 'https://teavm.org/playground/3/';
const directory = path.resolve('public/java-runtime');
const files = [
  'compiler.wasm',
  'compiler.wasm-runtime.js',
  'compile-classlib-teavm.bin',
  'runtime-classlib-teavm.bin',
];
await mkdir(directory, { recursive: true });
let manifest;
try {
  manifest = JSON.parse(await readFile('scripts/java-runtime-lock.json', 'utf8'));
} catch {
  /* first preparation only */
}
const hashes = {};
for (const file of files) {
  const destination = path.join(directory, file);
  let data;
  try {
    data = await readFile(destination);
  } catch {
    const response = await fetch(base + file, { signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`TeaVM ${file}: HTTP ${response.status}`);
    data = Buffer.from(await response.arrayBuffer());
  }
  const hash = createHash('sha256').update(data).digest('hex');
  if (manifest && manifest.files[file] !== hash)
    throw new Error(
      `Integrity mismatch: ${file}. Review upstream changes before updating the lock.`,
    );
  await writeFile(destination, data);
  hashes[file] = hash;
  console.log(`${file}: ${data.length} bytes (${hash})`);
}
if (!manifest)
  console.log('Runtime lock candidate:', JSON.stringify({ source: base, files: hashes }));
for (const [name, url] of [
  ['LICENSE-APACHE-2.0.txt', 'https://www.apache.org/licenses/LICENSE-2.0.txt'],
  ['LICENSE-OPENJDK-GPL2-CLASSPATH.html', 'https://openjdk.org/legal/gplv2+ce.html'],
]) {
  const destination = path.join(directory, name);
  try {
    await readFile(destination);
  } catch {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw Error(`License download failed: ${name}`);
    await writeFile(destination, await response.text());
  }
}
await writeFile(
  path.join(directory, 'THIRD_PARTY_NOTICES.md'),
  await readFile('THIRD_PARTY_NOTICES.md'),
);
