#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

// ANSI color helpers
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(msg) { console.log(msg); }
function ok(msg) { console.log(`${c.green}${c.bold}  ✓${c.reset} ${msg}`); }
function info(msg) { console.log(`${c.cyan}  i${c.reset} ${msg}`); }
function warn(msg) { console.log(`${c.yellow}  !${c.reset} ${msg}`); }
function fail(msg) { console.log(`${c.red}  ✗${c.reset} ${msg}`); }

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  log(`
${c.bold}themedist${c.reset} — ThemeDist CLI

${c.bold}Usage:${c.reset}
  themedist init      Detect project type and generate integration files
  themedist doctor    Check if ThemeDist is properly set up
  themedist --help    Show this help
`);
  process.exit(0);
}

// --- Framework detection ---

function detectFramework() {
  const cwd = process.cwd();
  const files = readdirSync(cwd);

  if (files.some(f => /^next\.config\.(js|ts|mjs|cjs)$/.test(f))) return 'next';
  if (files.some(f => /^nuxt\.config\.(ts|js|mjs|cjs)$/.test(f))) return 'nuxt';
  if (files.some(f => /^astro\.config\.(mjs|ts|js|cjs)$/.test(f))) return 'astro';
  if (files.some(f => /^vite\.config\.(js|ts|mjs|cjs)$/.test(f))) return 'vite';

  // Check package.json for framework deps
  const pkgPath = join(cwd, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (allDeps.next) return 'next';
    if (allDeps.nuxt) return 'nuxt';
    if (allDeps.astro) return 'astro';
    if (allDeps.vite) return 'vite';
    if (allDeps.react) return 'react';
    if (allDeps.vue) return 'vue';
  }

  return 'vanilla';
}

function hasTailwind() {
  const cwd = process.cwd();
  const files = readdirSync(cwd);
  if (files.some(f => f.startsWith('tailwind.config'))) return true;
  const pkgPath = join(cwd, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (allDeps.tailwindcss) return true;
  }
  return false;
}

// --- Fallback theme ---

const FALLBACK_THEME = {
  name: 'ThemeDist Default',
  presetId: 'default',
  description: 'Default offline fallback theme for ThemeDist',
  variables: {
    '--color-primary-rgb': '99 102 241',
    '--color-secondary-rgb': '139 92 246',
    '--color-accent-rgb': '236 72 153',
    '--color-bg': '#ffffff',
    '--color-surface': '#f9fafb',
    '--color-text': '#111827',
    '--color-text-muted': '#6b7280',
    '--font-sans': 'system-ui, -apple-system, sans-serif',
    '--font-mono': 'ui-monospace, monospace',
  },
};

// --- Tailwind config ---

const TAILWIND_CONFIG = `// Add to tailwind.config.js → theme.extend.colors
export const themedistColors = {
  primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
  secondary: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',
  accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  text: 'var(--color-text)',
  'text-muted': 'var(--color-text-muted)',
};
`;

// --- Framework-specific suggestions ---

const SDK_URL = 'https://themedist.netlify.app/sdk.js';
const API_URL = 'https://themedist.netlify.app/api/v1/today.json';

const suggestions = {
  next: `${c.bold}Add to your layout.tsx:${c.reset}

${c.dim}import Script from 'next/script';${c.reset}

${c.cyan}<Script src="${SDK_URL}" strategy="afterInteractive" />
<themedist-runner api="${API_URL}"></themedist-runner>${c.reset}`,

  nuxt: `${c.bold}Add to nuxt.config.ts:${c.reset}

${c.cyan}app: {
  head: {
    script: [
      { src: '${SDK_URL}', defer: true }
    ]
  }
}${c.reset}

${c.dim}Add the runner in your app.vue template:${c.reset}
${c.cyan}<themedist-runner api="${API_URL}"></themedist-runner>${c.reset}`,

  astro: `${c.bold}Add to your Layout.astro <head>:${c.reset}

${c.cyan}<script src="${SDK_URL}" defer></script>
<themedist-runner api="${API_URL}"></themedist-runner>${c.reset}`,

  vite: `${c.bold}Add to your index.html <head>:${c.reset}

${c.cyan}<script src="${SDK_URL}" defer></script>
<themedist-runner api="${API_URL}"></themedist-runner>${c.reset}`,

  react: `${c.bold}Add to your App component or index.html:${c.reset}

${c.dim}// In index.html <head>:${c.reset}
${c.cyan}<script src="${SDK_URL}" defer></script>${c.reset}

${c.dim}// In your root component:${c.reset}
${c.cyan}<themedist-runner api="${API_URL}"></themedist-runner>${c.reset}`,

  vue: `${c.bold}Add to your index.html <head>:${c.reset}

${c.cyan}<script src="${SDK_URL}" defer></script>
<themedist-runner api="${API_URL}"></themedist-runner>${c.reset}`,

  vanilla: `${c.bold}Add to your HTML <head>:${c.reset}

${c.cyan}<script src="${SDK_URL}" defer></script>
<themedist-runner api="${API_URL}"></themedist-runner>${c.reset}`,
};

// --- init command ---

function runInit() {
  const cwd = process.cwd();
  const framework = detectFramework();

  log(`\n${c.bold}themedist init${c.reset}\n`);
  log(`Detected project type: ${c.cyan}${framework}${c.reset}`);
  if (hasTailwind()) {
    log(`Detected Tailwind CSS: ${c.green}yes${c.reset}`);
  }
  log('');

  // 1. Generate fallback theme
  const fallbackPath = join(cwd, 'themedist-fallback.json');
  writeFileSync(fallbackPath, JSON.stringify(FALLBACK_THEME, null, 2) + '\n');
  ok(`Created ${c.bold}themedist-fallback.json${c.reset}`);

  // 2. Generate Tailwind config if applicable
  if (hasTailwind()) {
    const twPath = join(cwd, 'themedist.tailwind.js');
    writeFileSync(twPath, TAILWIND_CONFIG);
    ok(`Created ${c.bold}themedist.tailwind.js${c.reset}`);
  }

  // 3. Print framework-specific suggestion
  log('');
  info(`${c.bold}Integration for ${framework}:${c.reset}\n`);
  log(suggestions[framework]);
  log('');

  ok('Done!');
  log('');
}

// --- doctor command ---

async function runDoctor() {
  const cwd = process.cwd();

  log(`\n${c.bold}themedist doctor${c.reset}\n`);

  // Check 1: fallback JSON
  if (existsSync(join(cwd, 'themedist-fallback.json'))) {
    ok('themedist-fallback.json exists');
  } else {
    fail('themedist-fallback.json not found — run themedist init');
  }

  // Check 2: SDK runner tag in HTML-like files
  const htmlExtensions = ['.html', '.htm', '.astro', '.jsx', '.tsx', '.vue', '.svelte'];
  let found = false;

  function searchDir(dir) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.astro' || entry.name === '.vercel') continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        searchDir(full);
      } else if (htmlExtensions.some(ext => entry.name.endsWith(ext))) {
        try {
          const content = readFileSync(full, 'utf8');
          if (content.includes('themedist-runner')) {
            found = true;
          }
        } catch { /* skip unreadable files */ }
      }
    }
  }

  searchDir(cwd);

  if (found) {
    ok('themedist-runner element found in source files');
  } else {
    warn('themedist-runner element not found in source files');
  }

  // Check 3: Tailwind config
  if (existsSync(join(cwd, 'themedist.tailwind.js'))) {
    ok('themedist.tailwind.js exists');
  } else if (hasTailwind()) {
    warn('Tailwind detected but themedist.tailwind.js not found — run themedist init');
  }

  log('');
}

// --- Main ---

switch (command) {
  case 'init':
    runInit();
    break;
  case 'doctor':
    await runDoctor();
    break;
  default:
    fail(`Unknown command: ${command}`);
    log('Run themedist --help for usage.');
    process.exit(1);
}
