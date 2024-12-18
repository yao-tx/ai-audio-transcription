# AI Audio Transcription - Frontend

## Introduction

This is the frontend of the AI Audio Transcription web app. It is built with React + Vite + TypeScript. TailwindCSS is used for styling.

It is paired with a FastAPI + Python backend.

## Getting Started (Local Development)

1. Clone the repository.

2. Install dependencies.

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env` file and add your environment variables. You can use the `.env.example` file as a template.

4. Run the development server.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Getting Started (Docker)

The frontend comes with `Dockerfile` and `docker-compose.yml` files. To get started with Docker:

1. Clone the repository.

2. In the root directory of the frontend project, run the following commands:

```bash
docker-compose build

docker-compose up -d
# or
docker-compose up
```

## Testing

Test files are located in the `__tests__` directory.

```bash
npm run test
# or
yarn test
# or
pnpm test
# or
bun test
```