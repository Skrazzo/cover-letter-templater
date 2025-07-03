# Cover letter templater

Generates cover letters based on a template, and job listening using OpenAI.

## Stack

- Frontend:
  - `Reactjs`
  - `Tailwindcss`
  - `Mantine` component library
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

TODO: ADD STRUCTURE EXAMPLE

## Deployement

TODO: ADD DEPLOYMENT INSTRUCTIONS

## Development

If you want to run development version, you will need docker. Docker handles frontend, backend and proxies everything to single port.

```sh
# Run development environment
docker compose -f development.yml up --build
```
