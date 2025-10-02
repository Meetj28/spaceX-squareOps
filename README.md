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

1) Standardize Tailwind CSS usage by defining a semantic color palette (primary, secondary, success, warning, error, neutral), adopting a consistent spacing scale (4px grid), setting up a clear typography hierarchy (body, headings, labels), and unifying design tokens for border radius, shadows, and breakpoints.
2) Add dark mode toggle with Tailwind’s theme support.
3) Improve mobile responsiveness for small screens.
4) Refactor API calls into a dedicated service layer (instead of fetching directly inside components).
5) Increase test coverage for edge cases (API error states, empty data, etc.).
6) Instead of directly removing the launches from the favourites, can add one Modal showing "Are you sure, you want to remove from the favourites", along with the Yes and No button.

## Limitations

1) Limited Offline Support – The app does not currently work offline or with cached data.
2) Performance Optimization – Basic optimizations are in place, but large datasets (many launches) may cause slower rendering.
3) No Authentication – Currently a public-facing app with no user login or role-based access control.
