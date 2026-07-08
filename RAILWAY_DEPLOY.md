# Deploying Nexus AI Gateway on Railway

This guide explains how to deploy the **Nexus AI Gateway** to Railway using the provided repository. It covers building the project, provisioning a database and configuring environment variables.

## 1. Provision a PostgreSQL database

The Gateway uses Prisma for its persistence layer and expects a PostgreSQL database. In Railway:

1. Click **New** > **Database** > **PostgreSQL**.
2. Once created, open the database's **Connect** tab and copy the `DATABASE_URL`. Railway exposes this as `${{ Postgres.DATABASE_URL }}` for convenience.
3. In your **nexus-ai-gateway** service, add an environment variable named `DATABASE_URL` with the value `${{ Postgres.DATABASE_URL }}`.

## 2. Configure environment variables

Set these variables on your service:

| Variable | Description |
|---------|-------------|
| `NEXT_PUBLIC_API_URL` | URL of the backend server. Railway automatically injects `$PORT`; you typically set this to `https://<your-app>.up.railway.app` for the frontend. |
| `DATABASE_URL` | Connection string for PostgreSQL from the database service (see above). |
| `JWT_SECRET` | A random secret used to sign JSON Web Tokens. |

## 3. Install dependencies and build

Railway will run the commands defined in the **Build** and **Start** fields. Use the following for a Node-based build:

```bash
npm install
npm run build
```

The build script compiles the Next.js frontend into a standalone server (`.next/standalone`) and compiles the NestJS backend. It also prepares Prisma client.

## 4. Start the application

For Railway to detect the health of your app, you need to start both the Next.js frontend and the NestJS backend. In this simplified setup the frontend listens on the port provided by Railway. Add the following **Start Command**:

```bash
HOSTNAME=0.0.0.0 PORT=$PORT node .next/standalone/server.js
```

This instructs Next.js to bind on all network interfaces and respect the `PORT` variable provided by Railway. The NestJS backend is proxied through the same port using Next.js rewrites defined in `next.config.ts`.

## 5. Run migrations on deploy

Prisma migrations must be deployed before the app starts. Railway does not run them automatically. One approach is to add a postinstall script in `package.json`:

```json
{
  "scripts": {
    "prisma:deploy": "prisma generate && prisma migrate deploy",
    "build": "npm run prisma:deploy && next build"
  }
}
```

This ensures the database schema is created before Next.js builds. Alternatively, run `npx prisma migrate deploy` manually from the Railway shell.

## 6. Deploy

Push this repository to GitHub and connect it to your Railway project. Trigger a deployment and observe the build logs. Once deployed, visit the URL provided by Railway. You should see the dashboard with provider management, model selection and API key configuration. Use the **Providers** page to add your own API providers.
