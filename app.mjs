const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="A small project space for friends, with a working live backend."><title>Friend Server</title>
<style>
:root{color-scheme:light;font-family:system-ui,sans-serif;color:#20352d;background:#f4f5ef;font-size:17px}*{box-sizing:border-box}body{margin:0}main{width:min(100% - 40px,760px);margin:64px auto}header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:24px;border-bottom:1px solid #c4cec4}.brand{font-weight:650;font-size:19px}.state{display:flex;align-items:center;gap:9px;font-size:14px}.dot{width:9px;height:9px;border-radius:50%;background:#758175}.dot.online{background:#23734d}h1{font-size:clamp(2.5rem,7vw,4.2rem);line-height:1.06;letter-spacing:-.035em;font-weight:650;margin:54px 0 22px;max-width:650px}p{line-height:1.65;max-width:60ch;color:#46584d}button{font:inherit;font-weight:550;cursor:pointer;border:1px solid #315742;border-radius:8px;padding:12px 18px;background:#315742;color:#fff}button:hover{background:#234332}button:disabled{cursor:wait;opacity:.6}button:focus-visible,a:focus-visible{outline:3px solid #987923;outline-offset:4px}::selection{background:#d5e4b7;color:#20352d}.actions{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0 34px}button.secondary{background:transparent;color:#315742}button.secondary:hover{background:#e2e8db}.result{min-height:92px;padding:20px 0;border-top:1px solid #c4cec4;border-bottom:1px solid #c4cec4;overflow-wrap:anywhere;line-height:1.65}.result strong{display:block}dl{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;margin:34px 0}dl>div{padding:18px 0;border-bottom:1px solid #c4cec4}dt{font-size:14px;color:#46584d;margin-bottom:6px}dd{margin:0;font-weight:550}footer{font-size:14px;line-height:1.65;color:#46584d;margin-top:38px}a{color:#315742;text-underline-offset:4px}code{font-size:.9em}@media(max-width:480px){main{margin:28px auto}h1{margin-top:38px}dl{grid-template-columns:1fr}.actions button{width:100%}header{align-items:flex-start;flex-direction:column;gap:8px}}
</style></head><body><main>
<header><span class="brand">Friend Server</span><span class="state" role="status"><span id="dot" class="dot" aria-hidden="true"></span><span id="status">Checking connection</span></span></header>
<h1>A little space for your next project.</h1>
<p>Your website has a home. Share this link with your friends and use this working backend as the starting point for what you build together.</p>
<div class="actions"><button id="check">Check the server</button><button id="share" class="secondary">Copy site link</button></div>
<div class="result" aria-live="polite" aria-atomic="true"><strong id="result-title">Connecting to the server...</strong><span id="result-body">This checks the live backend, not just this page.</span></div>
<dl><div><dt>Connection</dt><dd>Secure HTTPS</dd></div><div><dt>Hosting</dt><dd>Render Free</dd></div><div><dt>Health endpoint</dt><dd><a href="/api/health"><code>/api/health</code></a></dd></div><div><dt>Server clock</dt><dd><a href="/api/time"><code>/api/time</code></a></dd></div></dl>
<footer>This is a starter site. Your project can replace this page and add its own API routes. The public page contains no personal data.</footer>
</main><script>
const check=document.getElementById('check'),share=document.getElementById('share');
async function checkServer(){check.disabled=true;check.textContent='Checking...';try{const started=performance.now();const response=await fetch('/api/health',{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('Server returned '+response.status);const result=await response.json();if(result.status!=='ok')throw new Error('Unexpected response');document.getElementById('status').textContent='Server online';document.getElementById('dot').className='dot online';document.getElementById('result-title').textContent='Your server is responding.';document.getElementById('result-body').textContent='Live response in '+Math.round(performance.now()-started)+' ms. Server time: '+new Date(result.timestamp).toLocaleString()+'.';}catch(error){document.getElementById('status').textContent='Connection unavailable';document.getElementById('dot').className='dot';document.getElementById('result-title').textContent='We could not reach the server.';document.getElementById('result-body').textContent='Check your connection and try again.';}finally{check.disabled=false;check.textContent='Check the server';}}
check.addEventListener('click',checkServer);share.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.origin);share.textContent='Link copied';setTimeout(()=>share.textContent='Copy site link',2000);}catch{document.getElementById('result-title').textContent='Copy this link from your address bar.';document.getElementById('result-body').textContent=location.origin;}});checkServer();
</script></body></html>`;
const headers={'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin'};
const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,'content-type':'application/json; charset=utf-8',...extra}});
export default {
 async fetch(request){
  const path=new URL(request.url).pathname;
  if(request.method==='GET'||request.method==='HEAD'){
   let response;
   if(path==='/')response=new Response(page,{headers:{...headers,'content-type':'text/html; charset=utf-8','content-security-policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"}});
   else if(path==='/api/health')response=json({status:'ok',service:'friend-server',timestamp:new Date().toISOString(),runtime:'nodejs-render'});
   else if(path==='/api/time')response=json({timestamp:new Date().toISOString(),unix:Date.now()});
   else if(path==='/robots.txt')response=new Response('User-agent: *\nDisallow: /\n',{headers:{...headers,'content-type':'text/plain'}});
   else response=json({error:'Not found'},404);
   return request.method==='HEAD'?new Response(null,{status:response.status,headers:response.headers}):response;
  }
  if(path==='/api/echo'&&request.method==='POST'){
   if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return json({error:'Use application/json'},415);
   if(Number(request.headers.get('content-length'))>16384)return json({error:'Request too large'},413);
   const reader=request.body?.getReader();if(!reader)return json({error:'JSON body required'},400);
   const chunks=[];let size=0;
   while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>16384){await reader.cancel();return json({error:'Request too large'},413);}chunks.push(part.value);}
   const body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength;}
   try{return json({received:JSON.parse(new TextDecoder().decode(body)),timestamp:new Date().toISOString()});}catch{return json({error:'Invalid JSON'},400);}
  }
  return json({error:'Method not allowed'},405,{allow:path==='/api/echo'?'POST':'GET, HEAD'});
 }
};

