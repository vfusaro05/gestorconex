// Gera site/index.html a partir do protótipo (prototipo/balcao.html, formato artifact sem <html>/<head>).
// Uso: node site/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'prototipo', 'balcao.html'), 'utf8');

const favicon = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0e1726"/>' +
  '<text x="32" y="44" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="34" fill="#c39a3e">G</text></svg>');

const head = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Gestor Conex: gestão simples para pequenos negócios. Lance vendas e despesas e veja quanto entrou, quanto saiu e quanto sobrou.">
<meta name="theme-color" content="#0e1726">
<link rel="icon" href="${favicon}">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
`;

// o arquivo começa com <title>, <meta> e <style>: tudo até o fim do primeiro </style> vai para o <head>
const cut = src.indexOf('</style>') + '</style>'.length;
const html = `${head}${src.slice(0, cut)}\n</head>\n<body>\n${src.slice(cut)}\n</body>\n</html>\n`;
writeFileSync(join(here, 'index.html'), html);
console.log(`site/index.html gerado (${Math.round(html.length / 1024)} KB)`);
