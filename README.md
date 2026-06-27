# Chaplin Frontend

**Your knowledge, always ready**

Turn your team's knowledge into AI agents that answer questions, handle support, and automate workflows — 24/7. Chaplin is a production-grade AI agent platform with a modern, responsive web interface built with Next.js.


## What i do

- Designed scalable frontend architecture using **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**, enabling consistent and maintainable user interface development.
- Implemented responsive design with **mobile marquee sliders** and **floating animations**, delivering seamless experiences across all devices and reducing time-to-interaction.
- Automated state management using **TanStack Query** and **Zustand**, reducing boilerplate and enabling efficient server/client state synchronization.
- Engineered real-time chat interfaces with **SSE streaming** and **WebSocket support**, delivering instant feedback and improved user engagement.
- Built secure authentication flows with **NextAuth.js** and **JWT**, simplifying user onboarding and backend integration.
- Established frontend standards through **TypeScript strictness**, **ESLint**, and responsive design testing, improving code quality and deployment consistency.
- Maintained UI consistency across features through **Shadcn/UI component library** and design system documentation, accelerating feature development and reducing bugs.

---

## Tech Stack

| Concern | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 | React framework with SSR & static generation |
| **Language** | TypeScript | Type-safe frontend development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | Shadcn/UI | High-quality React components |
| **State Management** | Zustand | Lightweight client state |
| **Server State** | TanStack Query (React Query) | Server state synchronization |
| **Forms** | React Hook Form | Efficient form handling & validation |
| **Animations** | Tailwind CSS + Custom Keyframes | Smooth transitions & marquee effects |
| **HTTP Client** | Fetch API | Built-in async request handling |
| **Icons** | Lucide React | Consistent icon system |
| **i18n** | next-i18next | Multi-language support |
| **Auth** | NextAuth.js | JWT & OAuth authentication |
| **Image Optimization** | Next.js Image | Automatic image optimization |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) v18+ (verify with `node --version`)
- [npm](https://npmjs.com) v9+ or [pnpm](https://pnpm.io) v8+
- **Chaplin Backend running** at `http://localhost:3001` (see chaplin-backend/README.md)

### 1. Clone & Install

```bash
git clone <repo-url>
cd chaplin
npm install
```

If installation fails, try:
```bash
npm ci
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and ensure these are set:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-min-32-chars
```

Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

### 3. Verify Backend is Running

Before starting frontend, ensure backend is running at http://localhost:3001

```bash
curl http://localhost:3001/api/v1/health
```

If failing, start backend from chaplin-backend/:
```bash
npm run start:dev
```

### 4. Start Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Backend not accessible (http://localhost:3001)
Ensure backend is running:
```bash
cd ../chaplin-backend
npm run start:dev
```

### NEXTAUTH_SECRET error
Generate new secret:
```bash
openssl rand -base64 32
```
Add to `.env.local`

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styling not applied
Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

---

## Scripts

```bash
npm run dev           # Development with hot-reload
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # ESLint check & fix
```

---

## Documentation

- **Backend API** — http://localhost:3001/api/docs (Swagger)
- **Next.js Docs** — https://nextjs.org/docs
- **Tailwind CSS** — https://tailwindcss.com/docs
- **Shadcn/UI** — https://ui.shadcn.com

---

## License

MIT
