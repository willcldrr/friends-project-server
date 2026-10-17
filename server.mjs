import { createServer } from 'node:http';
import app from './app.mjs';
const port = Number(process.env.PORT || 3000);
const server = createServer(async (req, res) => {
  const started = Date.now();
  try {
    const chunks = []; let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16384) {
        res.writeHead(413, { 'content-type': 'application/json' });
        res.end(JSON.stringify({error:'Request too large'}));
        req.resume(); return;
      }
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);
    const request = new Request('http://localhost' + req.url, {
      method: req.method, headers: req.headers,
      ...(body.length ? { body } : {}),
    });
    const response = await app.fetch(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
    console.log(req.method, req.url.split('?')[0], response.status, Date.now()-started+'ms');
  } catch (error) {
    console.error('Request failed:', error.message);
    if (!res.headersSent) res.writeHead(500, {'content-type':'application/json'});
    res.end(JSON.stringify({error:'Internal server error'}));
  }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(port, '0.0.0.0', () => console.log('Friend Server listening on port '+port));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
