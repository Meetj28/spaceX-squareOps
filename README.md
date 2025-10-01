# 🚀 SpaceX Mission Explorer

A Next.js 15 app that lets you explore **SpaceX launches**, view mission details, and save your favorite missions.  
Built with **React 19**, **React Query**, **Zustand**, and **TailwindCSS**.


## Deployment Link 

https://space-x-square-ops-agon.vercel.app/

---

## 📦 Tech Stack

- **Next.js 15 (App Router)** – framework for SSR/SSG and routing
- **React 19** – UI library
- **TypeScript** – type safety
- **TailwindCSS 4** – styling
- **React Query (TanStack)** – server state management & caching
- **Zustand** – local state management (favorites)
- **Jest + React Testing Library** – testing framework

---


## ⚡ Setup instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/spacex-mission-explorer.git
cd spacex-mission-explorer
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 to view it in your browser.


### 4. Running Tests

```bash
npm test
```

## 📂 Project Structure

```bash
src/
  app/                # Next.js app router pages
    page.tsx          # Homepage (launch list, filters)
    launches/[id]/    # Mission details
  components/         # UI components
  context/            # Favorites context
  __tests__/          # Unit & integration tests
```

## ToDOs

## Limitations
