# ⚡ CodeCatalysts 2.0

> A high-fidelity, boutique editorial platform designed for seamless community engagement and content management.

![Header](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

## 🏗️ Architecture

CodeCatalysts 2.0 follows a modern **Feature-Based Architecture**, designed for scalability, maintainability, and enterprise-grade performance.

```text
src/
├── core/       # Foundational primitives (lib, hooks, services, utils)
├── shared/     # Global UI components & shared design tokens
├── features/   # Domain-specific logic & components
│   ├── landing/
│   ├── admin/
│   └── cms/
├── pages/      # Next.js file-system routing
└── styles/     # Comprehensive design system tokens & global CSS
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App & Pages Directory)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Styling**: Vanilla CSS with [Tailwind CSS](https://tailwindcss.com/) utilities
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for premium interactions
- **Monitoring**: [Vercel Analytics](https://vercel.com/analytics) & Speed Insights

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+
- Supabase Project

### 2. Installation
```bash
git clone https://github.com/sarthaksaini041/CodeCatalysts2.0.git
cd CodeCatalysts2.0
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Development
```bash
npm run dev
```

## 🔐 Security & Operations

- **Infrastructure**: All project-agnostic configurations are located in `infra/`.
- **Paths**: Absolute path aliases are supported via `@/*` mapping.
- **Security**: Environment variables are strictly enforced and excluded via `.gitignore`.

---

Built with ❤️ by the **Code Catalysts** Core Team.
