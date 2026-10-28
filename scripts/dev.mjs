// Runs the API server (server.mjs, port 8787) and the Vite dev server
// together, and tears both down on exit.

import { spawn } from 'node:child_process';

const children = [];

function run(args, label) {
  const child = spawn(process.execPath, args, { stdio: 'inherit', shell: false });
  child._label = label;
  children.push(child);
  return child;
}

run(['server.mjs'], 'api');
run(['node_modules/vite/bin/vite.js', '--clearScreen', 'false'], 'web');

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    try {
      child.kill();
    } catch {
      /* already gone */
    }
  }
  process.exit(code ?? 0);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('exit', () => shutdown(0));
for (const child of children) {
  child.on('exit', (code) => shutdown(code));
}
