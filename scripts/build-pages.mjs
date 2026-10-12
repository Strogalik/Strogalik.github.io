import { mkdir, rename, rmdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';

// GitHub Pages serves static files. Keep the original server routes in source,
// but exclude them from this export, restoring them even if the build fails.
const routes = ['app/api/lead', 'app/demo', 'app/review'];
const moved = [];
await mkdir('.pages-server-routes');
try {
  for (const [index, route] of routes.entries()) {
    const temporary = `.pages-server-routes/${index}`;
    await rename(route, temporary);
    moved.push([route, temporary]);
  }
  const code = await new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      env: {...process.env, TMS_GITHUB_PAGES: 'true', NEXT_PUBLIC_STATIC_HOSTING: 'true', NEXT_PUBLIC_SITE_URL: 'https://strogalik.github.io', NEXT_PUBLIC_NOINDEX: 'true', TMS_ANALYTICS_ENABLED: 'false', NEXT_TELEMETRY_DISABLED: '1'},
    });
    child.on('error', reject);
    child.on('close', resolve);
  });
  if (code !== 0) process.exitCode = code ?? 1;
} finally {
  for (const [route, temporary] of moved.reverse()) await rename(temporary, route);
  await rmdir('.pages-server-routes');
}
