import { rm } from 'node:fs/promises';

const generatedPaths = ['dist', 'coverage', '.vite', '.nyc_output'];

for (const path of generatedPaths) {
  await rm(path, { recursive: true, force: true });
}

console.log(`Removed generated paths: ${generatedPaths.join(', ')}`);
