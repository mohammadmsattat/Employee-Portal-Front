# Smart ERP — Employee Portal (Frontend)

## 1) Project Overview

The **Employee Portal** is the self-service, employee-facing side of the Smart ERP **HR** module. Employees use it from a desktop browser or a phone to clock in and out, request leave, overtime and salary advances, follow their approvals and notifications, and manage tasks. Managers use the same app to review and approve their team's requests.

It is a frontend only: it connects to the **Smart ERP backend API** (the HR endpoints), so it needs a running backend to work.

### Key Features

- **Authentication**: login, multi-company selection and company switching, forgot-password flow with email verification code.
- **Attendance**: fingerprint-style check in/out with a daily attendance view.
- **Leaves**: request leave, track balances and request history, and (for managers) approve or reject team requests.
- **Overtime**: submit overtime requests and follow their status, with manager approval screens.
- **Advances**: submit salary-advance requests and follow their status, with manager approval screens.
- **Notifications**: in-app notification centre and a dropdown in the top bar.
- **Tasks**: workspaces, folders and lists, tasks and sub-tasks, checklists, comments with mentions, attachments, time tracking, and workspace and global dashboards.
- **Profile**: the employee's own details.
- **Permissions**: screens and actions are shown based on the user's role and permissions.
- **Responsive and bilingual**: separate mobile and desktop layouts, English and Arabic with full RTL support.

---

## 2) Run & Build

### Requirements

- **Node.js 18 or later** and **npm**.
- A running **Smart ERP backend** reachable from the browser.

### Install

```bash
cd Employee-Portal-Front
npm install
```

### Configure the API address

The API base URL and endpoint paths are defined in `src/Api/GlobalData.ts`. This file is **git-ignored** (`/src/Api` and `GlobalData.*` are in `.gitignore`), so it is not in the repository and must be created on each machine. It exports:

- the API base URL, and
- the endpoint constants used by the app (login, switch company, password reset, fingerprint, leaves, overtime, advances, notifications, tasks, and so on).

Point the base URL at your local or hosted backend before running.

### Run

```bash
npm run dev          # development server at http://localhost:8080
npm run build        # production build into dist/
npm run build:dev    # build in development mode
npm run preview      # preview the production build locally
npm run lint         # ESLint
npm run test         # unit tests (Vitest), single run
npm run test:watch   # unit tests in watch mode
```

The development server uses port `8080` and fails if it is taken (`strictPort`).

### Deployment

`dist/` contains static files that can be served by Nginx or any static host. The app uses client-side routing, so every route must fall back to `index.html`:

```nginx
location / {
  try_files $uri /index.html;
}
```

---

## 3) Project Structure

```
Employee-Portal-Front/
├── index.html
├── vite.config.ts            # Vite config (alias "@" => src, port 8080)
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig*.json
├── public/
│   └── locales/              # en.json / ar.json translations
└── src/
    ├── main.tsx / App.tsx    # Entry point and routes
    ├── Api/                  # API base URL and endpoints (GlobalData.ts, git-ignored)
    ├── rtk/                  # Redux Toolkit store + RTK Query APIs (auth, leaves, overtime,
    │                         #   advance, fingerprint, notifications, staff, tasks)
    ├── pages/                # Screens: Auth, Home, Attendance, Leaves, Overtime, Advance,
    │                         #   Notifications, Profile, Tasks
    ├── components/           # layout (top/bottom bars), home cards, tasks UI, shadcn/ui
    ├── hooks/                # Screen logic per feature
    ├── providers/            # Private routes, RTL wrapper
    ├── interfaces/           # TypeScript types
    ├── lib/                  # Permissions, leave balance, formatting helpers
    ├── utils/                # Helpers (e.g. attachments)
    └── test/                 # Vitest setup and tests
```

Data flow: `pages` → `hooks` → `rtk` (RTK Query) → backend API.

---

## 4) Technical Details

### Technologies and Languages

| Category             | Technology                                          |
| -------------------- | --------------------------------------------------- |
| Languages            | TypeScript (TSX), a few JavaScript (JSX) files, CSS |
| Framework            | React 18, React Router 6                            |
| Build and test       | Vite 5, Vitest, Testing Library, ESLint             |
| State and data       | Redux Toolkit + RTK Query, TanStack Query           |
| Forms and validation | React Hook Form, Zod                                |
| UI                   | Tailwind CSS 3, shadcn/ui (Radix UI), Recharts      |
| Internationalization | i18next, react-i18next (English and Arabic, RTL)    |

### Code Size (measured with `cloc`)

About **34,600 lines of code** (≈ **41,100 total lines** including comments and blanks) in **218 source files**.

| Language         |   Files |       Code |  Comments |     Blank |      Total |
| ---------------- | ------: | ---------: | --------: | --------: | ---------: |
| TypeScript (TSX) |     134 |     25,161 |       976 |     3,021 |     29,158 |
| TypeScript       |      76 |      7,702 |       564 |     1,563 |      9,829 |
| JavaScript (JSX) |       3 |      1,621 |        86 |       205 |      1,912 |
| CSS (PostCSS)    |       2 |        115 |        13 |        25 |        153 |
| JavaScript       |       3 |         45 |         1 |         6 |         52 |
| **Source total** | **218** | **34,644** | **1,640** | **4,820** | **41,104** |

The same run also counted JSON (7 files, 9,383 lines, mostly translations and lock files), Markdown, XML, HTML and one JSON-with-comments file. These are excluded from the total above.

To reproduce:

```bash
npx cloc . --exclude-dir=node_modules,dist
```
