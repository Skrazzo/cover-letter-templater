# Cover letter templater

Generates cover letters based on a template, and job listening using OpenAI.

## Stack

- Frontend:
  - `Reactjs`
  - `Tailwindcss`
  - `Shadcn` component library
  - TanStack `Router` + `Query` + `Forms`
- Backend: `Golang`
- Database: `PostgreSQL`
- Deployment: `Docker`

## Backend

### Structure example (TODO: Replace with actual one)

```sh
backend/
├── main.go                 # Entry point
├── api/                    # Route handlers grouped by domain
│   ├── auth.go
│   └── coverletters.go
├── routes/                 # HTTP route registration
│   └── routes.go
├── middleware/             # Custom middleware (logging, auth)
│   └── auth.go
├── models/                 # Data models, structs, db access
│   ├── user.go
│   └── coverletter.go
├── db/                     # Database connections  / migrations
│   ├── db.go
│   └── migrations.sql
├── services/               # Business logic (e.g. OpenAI integration)
│   ├── auth_service.go
│   └── coverletter_service.go
├── utils/                  # Shared helpers/utilities
│   └── jwt.go
└── config/                 # Env loading, settings
    └── config.go

```

## Frontend

### Structure example

```sh
.
├── bun.lock
├── components.json
├── index.html
├── package.json
├── public
│   └── robots.txt
├── README.md
├── src
│   ├── components                 # Components
│   │   ├── CoverLetterLink.tsx
│   │   ├── forms                  # Form components
│   │   ├── Header.tsx
│   │   ├── RenderQueryState.tsx
│   │   ├── Template.tsx
│   │   ├── TemplateLink.tsx
│   │   └── ui                     # UI components (shadcn)
│   ├── consts.ts                  # Some constants
│   ├── editor.css                 # Global rich text editor styles
│   ├── hooks                      # Custom hooks
│   │   └── formHook.tsx
│   ├── integrations
│   │   └── tanstack-query
│   ├── layouts                    # Layouts for guests, and auth users
│   │   ├── Authorised.tsx
│   │   └── Guest.tsx
│   ├── lib                        # Custom utils
│   │   ├── requests.ts
│   │   ├── tryCatch.ts
│   │   └── utils.ts
│   ├── logo.svg
│   ├── main.tsx
│   ├── reportWebVitals.ts
│   ├── routes                     # Routes
│   │   ├── __root.tsx
│   │   ├── cover                  # Cover letter routes
│   │   ├── index.tsx              # Also cover letter (view dashboard)
│   │   ├── login.tsx              # Login route
│   │   ├── register.tsx           # Register route
│   │   └── templates              # Template routes (CRUD)
│   ├── routeTree.gen.ts
│   ├── styles.css                 # Global css styles
│   └── types                      # TS types
│       ├── api.ts
│       └── global.d.ts
├── tsconfig.json
└── vite.config.ts
```

## Deployement

You can easily deploy this app with docker compose (`production.yml`).

```sh
docker compose -f production.yml up --build
```

## Development

If you want to run development version, you will need docker. Docker handles frontend, backend and proxies everything to single port.

```sh
# Run development environment
docker compose -f development.yml up --build
```

## Backup

By default database backup is stored inside of `/data` subfolder. To backup postgreSQL database, run:

```sh
sudo docker exec -t cover-letter-db pg_dumpall -c -U postgres > cover.bak.sql && gzip cover.bak.sql
```
