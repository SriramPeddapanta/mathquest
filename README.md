# MathQuest - Educational Math Games Platform

A modern, highly-polished educational math games platform built with Next.js App Router, Tailwind CSS, Framer Motion, and Zustand.

## Features

- 🎮 **Mini-games**: Quick Addition Challenge and Equation Matching.
- 🏆 **Gamification**: Earn XP, coins, and badges for completing games.
- 🔥 **Streaks**: Daily login streaks to build habits.
- 📊 **Dashboard**: Visual progress tracking and unlocked achievements.
- ⚡ **Performance**: Server-side rendered where possible, static export ready.
- 📱 **Responsive**: Fully playable on desktop, tablet, and mobile.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **State Management:** Zustand (with localStorage persistence)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Package Manager:** Yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Run the development server:
   ```bash
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages when code is pushed to the `main` branch.

**Important Note on `basePath`:**
If you are deploying this repository to a subpath (e.g., `https://yourusername.github.io/math-app`), you MUST update `next.config.ts` to include the `basePath`:

```typescript
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/math-app", // Uncomment and change this to your repo name!
};
```

1. Go to your GitHub repository **Settings** > **Pages**.
2. Under "Source", select **GitHub Actions**.
3. Push to `main` and watch the Actions tab!
