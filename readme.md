# FocusBoard

## Project Overview & Objective
FocusBoard is a responsive, single-user task management dashboard built with React, Vite, and Tailwind CSS. It allows users to create, edit, delete, search, and filter tasks across statuses and priorities while tracking real-time completion statistics.

## Technology Stack
- **HTML5 & CSS3 (Tailwind CSS):** Semantic markup and responsive layouts tested across `390px` (mobile), `768px` (tablet), and `1440px` (desktop).
- **JavaScript (ES6+) & React.js:** Component-driven UI using functional components and React hooks.
- **Vite:** Fast local development server and production bundler.
- **Lucide React:** Accessible UI icons.
- **Browser `localStorage`:** Client-side data persistence.

## Setup & Local Installation
```bash
npm install
npm run dev
```

## State Management & `localStorage` Explanation
- **Approach:** Uses built-in React Hooks (`useState`, `useMemo`, `useEffect`) with `tasks` as the single source of truth in `App.jsx`.
- **Persistence:** Initializes from `localStorage` (`focusboard_tasks`), falling back to 6 sample tasks only when storage is empty (`null`), and automatically saves updates whenever `tasks` changes.
- **Derived Values:** Overview statistics and filtered task lists use `useMemo` so counts update immediately without manual synchronization.

## Deployment Links
- **Hosted Application URL:** []
- **GitHub Repository URL:** []
-