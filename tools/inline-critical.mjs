// Copia css/critical.css para dentro do <style> do index.html.
// Rode depois de editar css/critical.css:  node tools/inline-critical.mjs
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/critical.css', import.meta.url), 'utf8').trim();
const file = new URL('../index.html', import.meta.url);
const html = fs.readFileSync(file, 'utf8');
const re = /\/\* critical:start \*\/[\s\S]*?\/\* critical:end \*\//;
if (!re.test(html)) throw new Error('Marcadores critical:start/end não encontrados no index.html');
fs.writeFileSync(file, html.replace(re, () => `/* critical:start */\n${css}\n/* critical:end */`));
console.log('CSS crítico atualizado no index.html');
