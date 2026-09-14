import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const children = ['@checkout/api', '@checkout/web'].map((name) =>
  spawn('npm', ['run', 'dev', '-w', name], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  }),
);

function stop() {
  for (const child of children) child.kill('SIGTERM');
}

for (const child of children) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stop();
      process.exit(code);
    }
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stop();
    process.exit(0);
  });
}
