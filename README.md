# Friends Project Server

A Node.js web server deployed to **Render Free**, managed in your own Render dashboard.

## Manage the server

Sign in at https://dashboard.render.com using GitHub. Select **friends-project-server** to view logs, deployment history, environment variables, settings, and manual deployment controls.

This server runs on Render's infrastructure and stays available when your PC is off. It sleeps after 15 minutes without traffic; the next request wakes it, which can take about a minute.

The Render Free plan has no instance charge. Keep the service on **Free** and do not add a payment method or paid resources. This workspace currently has no card on file. Monthly free hours, bandwidth, and build minutes are shared with other services in your workspace; if exhausted without a card, services or builds can be suspended until the allowance resets. Limits and availability are subject to Render's terms.

No database is provisioned. Files written at runtime are temporary and disappear on restarts/deploys/sleep. Free Render Postgres expires after 30 days, so do not use it for long-lived project data. Free web services do not include SSH/shell access.

## Develop

- `npm start` starts the server on port 3000, or the port in PORT.
- `npm test` checks the HTTP endpoints and request validation.
- Edit the `page` string in **app.mjs** to change the webpage.
- Add API routes in **app.mjs**. **server.mjs** is the Node HTTP adapter.
- Push changes to this GitHub repository, then use the dashboard's Manual Deploy if needed. If connected as a GitHub service, automatic deployments can be enabled.
- Store secrets in Render environment variables, never in public source.

Endpoints: GET /, GET /api/health, GET /api/time, POST /api/echo. Echo accepts JSON up to 16 KiB and does not persist it. The website is public; add authentication before introducing private data.

Provider documentation: https://render.com/docs/free . Your GitHub student benefits are not required or consumed by this deployment.
