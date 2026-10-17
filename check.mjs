import assert from 'node:assert/strict';
import worker from './app.mjs';
const call=(path,options)=>worker.fetch(new Request('https://test.invalid'+path,options));
assert.equal((await call('/')).status,200);
assert.equal((await(await call('/api/health')).json()).status,'ok');
assert.ok(Date.parse((await(await call('/api/time')).json()).timestamp));
assert.deepEqual((await(await call('/api/echo',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({hello:'friends'})})).json()).received,{hello:'friends'});
assert.equal((await call('/api/echo',{method:'POST',headers:{'content-type':'application/json'},body:'{'})).status,400);
assert.equal((await call('/api/echo',{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(16385)})).status,413);
assert.equal((await call('/api/health',{method:'DELETE'})).status,405);
assert.equal((await call('/missing')).status,404);
assert.equal(await(await call('/',{method:'HEAD'})).text(),'');
console.log('HTTP routes, JSON, request limits, methods, and health checks passed');

