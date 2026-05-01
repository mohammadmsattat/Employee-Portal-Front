# Employee Portal Frontend

React/Vite frontend for the employee self-service portal. The app covers staff authentication, attendance, leave requests and approvals, overtime requests, advance requests, profile details, notifications, and an in-progress tasks module.

## Tech Stack

- React 18
- TypeScript
- Vite
- Redux Toolkit Query
- React Router
- Tailwind CSS
- shadcn/Radix UI primitives
- i18next with English and Arabic locale files
- Vitest and Testing Library

## Requirements

- Node.js 18 or newer
- npm
- Running backend API, usually from `SY_ERP_backend`

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview a production build:

```sh
npm run preview
```

Run tests:

```sh
npm test
```

Run lint:

```sh
npm run lint
```

Note: lint currently reports existing issues across the project. Build and TypeScript checks can still pass while lint remains noisy.

## API Configuration

The backend base URL and endpoint constants live in:

```txt
src/Api/GlobalData.ts
```

Update `baseURL` there when switching between local, LAN, staging, or production backends.

The frontend expects auth data in `localStorage` after login:

- `token`
- `user`
- `company`
- `group`
- `location`

Most RTK Query APIs append `companyId` from `localStorage.company` and attach `Authorization: Bearer <token>`.

## Main Features

### Authentication

Files:

- `src/pages/Auth`
- `src/hooks/Auth`
- `src/rtk/Auth/AuthApi.ts`

Includes login, forgot password, code verification, and password reset.

### Layout And Navigation

Files:

- `src/components/layout/Layout.tsx`
- `src/components/layout/Bottombar.tsx`
- `src/components/layout/header`
- `src/providers/PrivateRoute.tsx`

Protected routes are declared in `src/App.tsx`. Mobile navigation uses the bottom bar and mobile header; desktop uses the desktop header.

### Attendance

Files:

- `src/pages/Attendance/Attendance.tsx`
- `src/hooks/Attendance/useAttendance.ts`
- `src/components/attendance/AttendanceActionModal.tsx`
- `src/rtk/Fingerprint/fingerprintApi.ts`

Attendance uses geolocation and fingerprint logs. The action modal has a single action button that decides the next action from the current day's latest log:

- Last action today is `Check-in` -> next action is `Check-out`
- No action today, or last action today is `Check-out` -> next action is `Check-in`

The attendance history page uses the daily fingerprint endpoint and displays expandable day groups.

Relevant backend endpoints:

- `GET /api/finger-print/days?companyId=...&page=...`
- `POST /api/finger-print/loged?companyId=...`

### Leaves

Files:

- `src/pages/Leaves`
- `src/hooks/Leaves`
- `src/rtk/leaves`

Includes leave request creation, personal leave history, manager approvals, review modal, balances, and mobile expandable cards.

### Overtime

Files:

- `src/pages/Overtime`
- `src/hooks/Overtime`
- `src/rtk/Overtime`

Includes personal overtime requests, manager approvals, overtime policies, overtime types, and request modals.

### Advances

Files:

- `src/pages/Advance`
- `src/hooks/Advance`
- `src/rtk/Advance`

Includes personal advance requests, manager approvals, advance policies, advance types, and request modals.

### Tasks

Files:

- `src/pages/Tasks`
- `src/components/Tasks`
- `src/hooks/Tasks`
- `src/rtk/Tasks`

The tasks area includes workspace/folder/list APIs, task and subtask APIs, comments, attachments, members, status, and date modals. This module is still active work and has known review findings.

## Project Structure

```txt
src/
  Api/             API endpoint constants and base URL
  components/      Reusable UI and domain components
  hooks/           Feature hooks and page logic
  interfaces/      Shared TypeScript interfaces
  lib/             Utility functions
  pages/           Route-level pages and modals
  providers/       Routing and layout providers
  rtk/             Redux Toolkit Query API slices and store
  test/            Vitest setup and tests
```

## Internationalization

i18n is configured in:

```txt
src/i18n.ts
```

Locale files:

```txt
public/locales/en.json
public/locales/ar.json
```

Language is detected from the `appLang` cookie.

## Scripts

| Command              | Purpose                   |
| -------------------- | ------------------------- |
| `npm run dev`        | Start Vite dev server     |
| `npm run build`      | Create production build   |
| `npm run build:dev`  | Build in development mode |
| `npm run preview`    | Preview production build  |
| `npm run lint`       | Run ESLint                |
| `npm test`           | Run Vitest once           |
| `npm run test:watch` | Run Vitest in watch mode  |

## Development Notes

- Prefer existing feature hooks under `src/hooks` when adding page logic.
- Keep RTK Query API definitions under `src/rtk/<domain>`.
- Keep endpoint constants in `src/Api/GlobalData.ts`.
- UI should follow existing Tailwind/shadcn patterns.
- Be careful with files that have spaces in their names under task modal/action folders.
- The repository may contain existing work-in-progress changes; check `git status` before large edits.

## Known Caveats

- `npm run lint` currently fails due to existing TypeScript lint and hook warnings.
- The tasks module has known open issues and should be coordinated before broad edits.
- Some APIs still mix `localStorage` and cookie-based auth conventions; confirm the expected backend auth source before changing shared API slices.
