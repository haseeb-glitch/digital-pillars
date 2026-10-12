import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(), dist=path.join(root,'dist');
let html=await readFile(path.join(dist,'index.html'),'utf8');
const jsName=html.match(/<script[^>]+src="([^"]+)"/)[1];
const cssName=html.match(/<link[^>]+href="([^"]+\.css)"/)[1];
let js=await readFile(path.join(dist,jsName.replace(/^\//,'')),'utf8');
let css=await readFile(path.join(dist,cssName.replace(/^\//,'')),'utf8');
js=js.replace(/([`"'])\/images\/\1\+/g,'');
for(const name of await readdir(path.join(root,'public/images'))){
 const ext = name.endsWith('.png') ? 'image/png' : (name.endsWith('.jpg') || name.endsWith('.jpeg')) ? 'image/jpeg' : name.endsWith('.svg') ? 'image/svg+xml' : 'image/webp';
 const uri='data:'+ext+';base64,'+(await readFile(path.join(root,'public/images',name))).toString('base64');
 js=js.replaceAll('/images/'+name,uri);
 for(const quote of ['`','"',"'"])js=js.replaceAll(quote+name+quote,quote+uri+quote);
 css=css.replaceAll('/images/'+name,uri);
}
if(js.includes('/images/'))throw new Error('A non-embedded image reference remains.');
const favicon='data:image/svg+xml;base64,'+(await readFile(path.join(root,'public/favicon.svg'))).toString('base64');
html=html.replace(/(?:\.\/|\/)favicon\.svg/g,()=>favicon)
 .replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/,()=>'<script type="module">'+js.replaceAll('</script','<\\/script')+'</script>')
 .replace(/<link[^>]+href="[^"]+\.css"[^>]*>/,()=>'<style>'+css.replaceAll('</style','<\\/style')+'</style>');
await writeFile(path.join(root,'OPEN-WEBSITE.html'),html);
console.log('Standalone preview rebuilt with all artwork embedded.');
