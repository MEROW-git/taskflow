# FlowTask

A local-first task manager built with React, Vite, and browser storage. No backend, no database, and no account required.

## What It Does

- Create, edit, complete, archive, and pin tasks
- Organize work with priorities, categories, due dates, and checklists
- Store everything in the user's browser with `localStorage`
- Support English and Khmer language switching
- Work on desktop and mobile

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

This app is static, so it can be deployed to GitHub Pages, Netlify, Vercel, or any static host.

For GitHub Pages in this repo, use the workflow in `.github/workflows/deploy.yml` and set Pages source to `GitHub Actions`.

## Storage

- Tasks are saved in browser `localStorage`
- Settings are saved in browser `localStorage`
- Data stays on the user's device unless they export it

## Repo Topics

```text
task-manager react vite typescript tailwindcss zustand localstorage khmer i18n productivity
```
