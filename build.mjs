// Gera o site de produção a partir do protótipo (prototipo/balcao.html, formato artifact sem <html>/<head>).
// Saída: site/dist (Cloudflare Pages) e mobile/www (app Capacitor). Uso: node site/build.mjs [URL_DA_API]
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// endereço da API de produção (o meta gc-api liga o "modo produção" do app: contas, dados e pagamento reais)
const API = process.argv[2] || process.env.GC_API || 'https://api.gestorconex.com.br';
const src = readFileSync(join(here, '..', 'prototipo', 'balcao.html'), 'utf8');

const head = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Gestor Conex: gestão simples para pequenos negócios. Lance vendas e despesas e veja quanto entrou, quanto saiu e quanto sobrou.">
<meta name="theme-color" content="#0e1726">
<meta name="gc-api" content="${API}">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Gestor Conex">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
`;
// o arquivo começa com <title>, <meta> e <style>: tudo até o fim do primeiro </style> vai para o <head>
const cut = src.indexOf('</style>') + '</style>'.length;
const html = `${head}${src.slice(0, cut)}\n</head>\n<body>\n${src.slice(cut)}\n</body>\n</html>\n`;

const manifest = {
  name: 'Gestor Conex',
  short_name: 'Gestor Conex',
  description: 'Gestão simples para pequenos negócios: vendas, despesas e quanto sobrou.',
  lang: 'pt-BR',
  start_url: '/app/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#f2f4f7',
  theme_color: '#0e1726',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/manifest.webmanifest
  Content-Type: application/manifest+json
`;
const notFound = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/"><title>Gestor Conex</title></head><body><a href="/">Ir para o Gestor Conex</a></body></html>\n';

// site: página inicial (landing) em / e o sistema em /app/ · app (Capacitor): só o sistema
function write(dir, { pagesFiles }) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  if (pagesFiles) {
    writeFileSync(join(dir, 'index.html'), readFileSync(join(here, 'landing.html'), 'utf8'));
    mkdirSync(join(dir, 'app'), { recursive: true });
    writeFileSync(join(dir, 'app', 'index.html'), html);
    if (existsSync(join(here, 'public', 'og.png'))) cpSync(join(here, 'public', 'og.png'), join(dir, 'og.png'));
  } else writeFileSync(join(dir, 'index.html'), html);
  writeFileSync(join(dir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
  cpSync(join(here, 'public', 'icons'), join(dir, 'icons'), { recursive: true });
  if (pagesFiles) { writeFileSync(join(dir, '_headers'), headers); writeFileSync(join(dir, '404.html'), notFound); }
}
writeFileSync(join(here, 'index.html'), html); // cópia versionada no repositório
write(join(here, 'dist'), { pagesFiles: true });
if (existsSync(join(here, '..', 'mobile'))) write(join(here, '..', 'mobile', 'www'), { pagesFiles: false });
console.log(`build pronto (${Math.round(html.length / 1024)} KB) · API: ${API}`);
