# Project

FastAPI backend (SQLAlchemy + Alembic) + Next.js frontend, orchestrated with
Docker Compose. Includes Postgres, Redis, and Nginx as a reverse proxy.

## Structure

```
project/
├── backend/
│   ├── main.py            # FastAPI app + example endpoints
│   ├── database.py        # SQLAlchemy engine/session
│   ├── models.py          # SQLAlchemy models
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/      # migration scripts
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Next.js (App Router) + TypeScript
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── .env
```

## Run everything in Docker

```bash
docker compose up -d --build
```

Open http://localhost — Nginx routes:
- `/api/...` → FastAPI backend
- everything else → Next.js frontend

On startup, the backend container automatically runs `alembic upgrade head`
before starting Uvicorn, so the `users` table is created from the included
migration.

## Working with Alembic (creating new migrations)

Run these from inside the backend container so it can reach Postgres:

```bash
docker compose exec backend alembic revision --autogenerate -m "describe change"
docker compose exec backend alembic upgrade head
```

Edit `backend/models.py` first, then run `revision --autogenerate` to have
Alembic diff your models against the current database schema.

## Разработка с hot-reload (frontend в докере)

По умолчанию `docker-compose.yml` собирает frontend в прод-режиме
(`npm run build` + `npm start`) — быстрый, лёгкий образ, но не подхватывает
изменения кода без пересборки.

Для разработки есть `docker-compose.dev.yml` — он переопределяет сервис
`frontend`, монтирует твою папку `./frontend` внутрь контейнера как volume
и запускает `next dev` вместо прод-сборки. Правки в файлах сразу видны в
браузере, без пересборки образа.

Запуск (два файла компоуза объединяются флагом `-f`):

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

Когда закончишь разработку и хочешь вернуться к обычному прод-режиму:

```bash
docker compose down
docker compose up -d --build
```

## Local development (hot reload на хосте, без докера для frontend/backend)

Keep Postgres/Redis/Nginx in Docker, run backend and frontend on the host:

```bash
docker compose up -d postgres redis
```

Backend:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://app:app@localhost:5432/app_db
alembic upgrade head
uvicorn main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Adjust `nginx/nginx.conf` proxy_pass targets to `host.docker.internal` if you
want Nginx to reach services running on the host instead of in containers.

## Stopping

```bash
docker compose down
```

Add `-v` to also remove the Postgres data volume.
