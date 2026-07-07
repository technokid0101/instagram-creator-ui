# Creator Reel Studio UI

Frontend for the Spring Boot Instagram creator APIs.

## Run locally

```bash
npm install
npm run dev
```

For testing from another phone or laptop on the same Wi-Fi:

```bash
npm run dev:network
```

Create `.env` from `.env.example` and set:

```bash
VITE_API_BASE_URL=http://192.168.1.7:8080
```

Use your computer's current LAN IP in place of `192.168.1.7` if it changes.

## Deploy

Recommended free hosting: Vercel or Netlify.

Set the same `VITE_API_BASE_URL` environment variable in the hosting dashboard and point it to the deployed Spring Boot backend.
