# Railway deployment

This archive is prepared for GitHub + Railway.

## Recommended Railway setup

Railway does not run `docker-compose.yml` as one unit. Create separate Railway services:

1. **PostgreSQL** plugin/service.
2. **Redis** plugin/service.
3. **LiteLLM service**
   - Root directory: `services/litellm`
   - Dockerfile: `services/litellm/Dockerfile`
   - Add env vars:
     - `LITELLM_MASTER_KEY`
     - `LITELLM_SALT_KEY`
     - `DATABASE_URL`
     - `REDIS_HOST`
     - `REDIS_PORT`
     - provider keys such as `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `MISTRAL_API_KEY`
4. **Backend service**
   - Root directory: `backend`
   - Dockerfile: `backend/Dockerfile`
   - Add env vars from `backend/.env.example`
   - Set:
     - `DATABASE_URL` and `DIRECT_URL` to Railway PostgreSQL URL
     - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` from Railway Redis
     - `LITELLM_BASE_URL` to the internal/private URL of the LiteLLM service
     - `CORS_ORIGINS` to the frontend public URL
     - `APP_URL` to the backend public URL
5. **Frontend service**
   - Root directory: repository root
   - Dockerfile: `Dockerfile`
   - Add env var:
     - `NEXT_PUBLIC_API_URL` = backend public URL

## Local Docker test

```bash
cp .env.example .env
docker compose up -d --build
```

Open:
- Frontend: http://localhost:3000
- Backend API docs: http://localhost:3001/api/docs
- LiteLLM: http://localhost:4000
```
