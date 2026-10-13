import fs from 'node:fs';import {build} from 'esbuild';
await build({entryPoints:['src/app.js'],bundle:true,minify:true,write:true,outfile:'.app-bundle.js',platform:'browser'});
const html=fs.readFileSync('src/index.html','utf8'),js=fs.readFileSync('.app-bundle.js','utf8'),server=fs.readFileSync('src/server.js','utf8');
fs.mkdirSync('worker',{recursive:true});
fs.writeFileSync('worker/index.js',server+`\nconst HTML=${JSON.stringify(html)};\nconst JS=${JSON.stringify(js)};\n`+fs.readFileSync('src/routes.txt','utf8'));
