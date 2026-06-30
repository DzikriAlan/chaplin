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

- [Node.js](https://nodejs.org) v18+
- [npm](https://npmjs.com) v9+ or [pnpm](https://pnpm.io) v8+
- Backend running at `http://localhost:3001`

### Clone & Install

```bash
git clone <repo-url>
cd chaplin
npm install
```

### Setup Environment Variables

```bash
cp .env.example .env.local
```

Configure `.env.local` with your credentials:

```env
# Database
DATABASE_URL="hire-me"
SUPABASE_URL="hire-me"
SUPABASE_ANON_KEY="hire-me"
SUPABASE_KEY="hire-me"

# APIs
DEEPSEEK_API_KEY="hire-me"
JINA_API_KEY="hire-me"

# Google OAuth
GOOGLE_CLIENT_ID="hire-me"
GOOGLE_CLIENT_SECRET="hire-me"
GOOGLE_REDIRECT_URI="hire-me"

# NextAuth
NEXTAUTH_SECRET="hire-me"
NEXTAUTH_URL="hire-me"

# Public URLs
NEXT_PUBLIC_API_BASE_URL="hire-me"
NEXT_PUBLIC_SUPABASE_URL="hire-me"
NEXT_PUBLIC_SUPABASE_ANON_KEY="hire-me"
```

Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

### Start Development

```bash
npm run dev
```

Open http://localhost:3000

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

See [CODE.md](./CODE.md) for detailed architecture, naming conventions, and development guidelines.

---

## License

MIT
