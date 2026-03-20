# SalesPilot Client

Frontend client for **SalesPilot**, a responsive sales-automation authentication and profile experience built with React, TypeScript, Tailwind CSS, and Vite.

## Brand Direction

- **App name:** SalesPilot
- **Why this name:** It aligns with the product goal of helping users automate repetitive sales work and move faster with clearer guidance.
- **UI style:** Split-screen hero + clean form panel, optimized for desktop and mobile.

## Client Plan

### 1. Authentication UX

- Build polished `Login` and `Register` pages with clear hierarchy and fast form completion.
- Keep validation and API error/success feedback visible and readable.
- Support password visibility toggle and accessible form labeling.

### 2. Responsive Layout

- Use full-width split layout on large screens (hero left, form right).
- Collapse to a single-column flow on tablet/mobile.
- Avoid fixed phone-frame containers so the app feels native to web.

### 3. UI Consistency

- Reuse a shared auth shell component to keep both pages visually consistent.
- Apply consistent spacing, typography, and button behavior.
- Keep interaction states clear (`hover`, `focus`, and error/success blocks).

### 4. Routing and App Structure

- Routes:
  - `/login`
  - `/register`
  - `/profile`
- Keep auth routes visually focused without unnecessary header clutter.

### 5. Next Client Milestones

- Add dedicated `Forgot Password` screen and API integration.
- Add social auth wiring (Google button currently UI-only).
- Improve profile page to match SalesPilot visual system.
- Add end-to-end UI tests for auth flows.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
