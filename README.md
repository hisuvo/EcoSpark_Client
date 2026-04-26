# 🌱 EcoSpark - Frontend

![EcoSpark Hub](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.x-black)
![React](https://img.shields.io/badge/React-19.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC)

**EcoSpark Hub** is a community-driven sustainability platform where eco-conscious innovators can share ideas, vote on solutions, and help build a greener future. This repository contains the frontend client application built with Next.js, featuring a premium design and seamless user experience.

---

## 🌐 Live URLs

- **Frontend Application**: [https://ecospark-client-seven.vercel.app](https://ecospark-client-seven.vercel.app)
- **Backend API**: [https://ecospark-hub-backend.vercel.app](https://ecospark-hub-backend.vercel.app)

---

## ✨ Features

- **🔐 Advanced Authentication**: Secure login, registration, and session management powered by Better-Auth.
- **💡 Idea Ecosystem**: Browse, create, and manage eco-friendly ideas with a sleek interface.
- **🗳️ Community Voting**: Interactive voting system (Upvotes/Downvotes) to highlight and rank high-impact projects.
- **💬 Social Engagement**: Integrated commenting system for collaborative feedback and discussion.
- **💳 Secure Payments**: Seamless **Stripe** integration for project support and community contributions.
- **🛠️ Admin Command Center**: Comprehensive dashboard for managing users, ideas, and categories.
- **👤 User Dashboard**: Personalized space for members to track their submitted ideas and engagement activity.
- **🌗 Dark Mode Support**: Native dark mode for an enhanced viewing experience.
- **📱 Fully Responsive**: Optimized for all devices, from mobile phones to high-resolution desktops.

---

## 🚀 Technologies Used

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Shadcn UI](https://ui.shadcn.com/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Authentication**: [Better-Auth](https://better-auth.com/)
- **Form Handling**: [TanStack Form](https://tanstack.com/form/latest), [Zod](https://zod.dev/)
- **API Interaction**: [Axios](https://axios-http.com/)
- **Animations**: `tw-animate-css`
- **Notifications**: [Sonner](https://sonner.stevenly.me/)

---

## ⚙️ Setup Instructions

Follow these steps to get your local development environment up and running:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecospark-client.git
cd ecospark-client
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory based on `.env.example`:
```bash
cp .env.example .env.local
```
Fill in the required credentials:
```env
NEXT_PUBLIC_API_URL=https://ecospark-hub-backend.vercel.app/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_IMGBB_API_KEY=your_key
```

### 4. Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📜 Scripts

- `pnpm dev`: Start development server.
- `pnpm build`: Build the project for production.
- `pnpm start`: Start the production server.
- `pnpm lint`: Run ESLint to check for code quality issues.

---

Developed with ❤️ for a Greener Future.

