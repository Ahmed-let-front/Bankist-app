# Bankist App

**Project by: Ahmed Yasser (UIO) — Inspired by Jonas Schmedtmann's Course**

A high-performance, modern banking multi-page application (MPA) and interactive landing platform reimagined with a cutting-edge design system. It allows users to create accounts dynamically, manage financial movements, request loans, and handle operations securely.
## [🚀 Live Demo](https://ahmed-let-front.github.io/Bankist-app/)
## 📊 Application Flowchart

![Application Architecture Flowchart](./public/Bankist-flowchart.png)

## ⚡ Google Lighthouse Scores

Both pages are rigorously optimized to achieve a perfect score, proving a flawless Critical Rendering Path (CRP) and minimal bundle sizing:

- **Landing Page (`index.html`)**: 💯 100/100 across Performance, Accessibility, Best Practices, and SEO.
- **Dashboard Page (`account.html`)**: 💯 100/100 across Performance, Accessibility, Best Practices, and SEO.
- **Total Bundle Score**: **400 / 400** 🚀

---

## 🚀 Key Feature Enhancements & Refactoring

While the core logic is inspired by Jonas's curriculum, this version represents a complete architectural and visual overhaul to meet premium production standards:

### 🌟 1. Visual Identity & Premium Dark Theme

- **Unified Branding**: The entire platform has been overhauled with a modern, high-contrast **Dark Theme** ensuring consistent visual harmony between the marketing presentation and the user dashboard.
- **Modern Landing Page**: Replaced the legacy layout with a highly immersive, beautiful landing page that bridges sleek UI components with top-tier user experiences.
- **Semantic CSS**: Styled dynamically with **Tailwind CSS v4** utilizing clean relative units, flexible layouts, and complete screen responsiveness (down to 320px).

### 💾 2. Dynamic Account Creation via LocalStorage

- **Persistent Multi-Account System**: Implemented a dynamic user registration feature. Users can now sign up on the fly, creating account objects that are serialized and securely stored inside an array within the **Browser's LocalStorage**.
- **State Management**: Session handling through a dynamic key engine that ensures new users can immediately log in and interact with their personalized dashboards without wiping previous accounts.

### ⚡ 3. High-Performance UI Components & Micro-Interactions

- **Smooth Slider Component**: A custom-built, modular slider with intuitive keyboard arrows and interactive navigation dots, optimized for buttery-smooth layout transitions.
- **Dynamic Tabbed Container**: An encapsulated operations hub that swaps content areas gracefully on user click, built with robust event delegation.
- **Intersection Observer API Animations**: Integrated advanced lazy loading for images and elegant scroll-reveals on full sections. By utilizing the browser's native API, elements animate into position exactly as they cross the viewport threshold, conserving CPU and GPU overhead.

### 📐 4. Architectural Philosophy

- **Single Responsibility Principle (SRP)**: Every utility function, element collector, and navigation event has been fully decoupled to perform exactly one job.
- **The KISS Balance**: Avoided boilerplate traps by keeping execution flows direct, ensuring the bundle size remains lightweight for lightning-fast parsing.

---

## 🛠 Tech Stack & Build Optimization

### Advanced Multi-Page Vite Configuration

The project is built as a highly optimized Multi-Page Application (MPA). The deployment configuration completely disables sourcemaps for lightweight production bundles, resolves specific page inputs (`ui` and `account`), and splits vendor modules to guarantee aggressive browser caching.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        ui: resolve(__dirname, 'index.html'),
        account: resolve(__dirname, 'account.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
```

## 📦 Setup & Installation

Follow these steps to set up the project locally:

Initialize project:

```bash
npm create vite@latest .
```

Install dependencies (including Tailwind, Fonts, and GH-Pages):

```bash
npm install tailwindcss @tailwindcss/vite
npm install gh-pages --save-dev
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## **(Note: The predeploy script is configured to trigger npm run build automatically.)**

---

**Inspired by Jonas Schmedtmann's course, reimagined and restructured with modern best practices by UIO.**

---

### 👨‍💻 Created by Ahmed Yasser

- **LinkedIn:** [Ahmed Yasser](https://www.linkedin.com/in/ahmed-yasser-954897370)
- **Phone:** `+20 10 50 11 9571`
