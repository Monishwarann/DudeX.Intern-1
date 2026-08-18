# ⚡ NexusTask Enterprise

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.13.2-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> A modern, enterprise-grade Task & Project Management platform featuring real-time collaboration, interactive Kanban boards, department workloads, advanced data analytics, and role-based access control built with React 18, TypeScript, Tailwind CSS, Framer Motion, and Firebase.

---

## 🌟 Overview

**NexusTask Enterprise** is designed for modern corporate organizations and agile teams to streamline workflow management, monitor department metrics, and drive team productivity. Featuring a sleek glassmorphic dark interface, micro-animations, real-time presence indicators, and interactive analytics, NexusTask provides a centralized command center for enterprise task tracking.

---

## ✨ Features

### 📊 1. Dynamic Executive Dashboard
* **Real-time Metrics**: Visual overview of total tasks, completion rates, active projects, and urgent deadlines.
* **Activity Stream**: Live update feed capturing user actions, status transitions, and comments.
* **Department Performance**: High-level workload distribution and progress across all corporate departments.

### 📋 2. Advanced Task Management & Kanban Board
* **Interactive Drag-and-Drop**: Fluid drag-and-drop workflow (`@hello-pangea/dnd`) across task states: *Pending*, *In Progress*, *Review*, *Completed*, and *Cancelled*.
* **Dual View Options**: Seamlessly toggle between visual Kanban board and structured Data Table views.
* **Priority & Progress Tracking**: Categorize tasks by priority (*Low*, *Medium*, *High*, *Critical*) with progress sliders (0–100%) and estimated vs. actual hours logged.
* **Checklists & Subtasks**: Track granular sub-items with interactive checklist progress bars.
* **Rich Filtering & Search**: Instant filter by status, priority, department, tags, assignees, or keyword search.

### 📈 3. Deep Analytics & Insights
* **Visual Data Charts**: Powered by `Recharts` for interactive trend analysis.
* **Productivity Metrics**: Task completion speed, overdue rate breakdown, and hourly output graphs.
* **Workload Balancing**: Department-wise and employee-wise capacity and workload distribution charts.

### 🏢 4. Department & Team Management
* **Department Structure**: Create, assign, and manage enterprise departments with custom color coding and designated leads.
* **Member Directory**: Detailed user profile cards displaying roles, departments, contact info, and live online/offline presence indicators.
* **Role-Based Access Control (RBAC)**: Fine-grained permissions across **Admin**, **Manager**, and **Employee** roles.

### 💬 5. Collaboration & Attachments
* **Interactive Comments**: Discussion threads on tasks supporting emoji reactions, `@mentions`, and reply hierarchies.
* **File Attachments**: Upload and preview project collateral, specifications, and documents attached directly to tasks.

### 🔔 6. Real-Time Notification System
* **Drawer & Badges**: Real-time notification drawer with unread counter badges.
* **Event Triggers**: Automated alerts for task assignments, status shifts, `@mentions`, file uploads, and upcoming deadlines.

### 🎨 7. Premium Glassmorphism UI & Motion
* **Ultra-Modern Styling**: Dark mode UI crafted with Tailwind CSS custom gradients, glassmorphic backdrops (`backdrop-blur`), and glowing accent rings.
* **Micro-Animations**: Smooth UI transitions powered by `framer-motion` and celebration effects via `canvas-confetti`.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Core** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, Lucide React, Custom Glassmorphism System |
| **Animations** | Framer Motion, Canvas Confetti |
| **State & Data Fetching** | TanStack React Query (v5), React Context API |
| **Forms & Validation** | React Hook Form, Zod Schema Validation |
| **Backend & Realtime** | Firebase (Auth, Firestore, Presence) |
| **Drag & Drop** | `@hello-pangea/dnd` |
| **Data Visualization** | Recharts |
| **Date Formatting** | Date-fns |

---

## 📁 Repository Structure

```
DudeX.Intern-1/
├── public/                     # Static assets
├── src/
│   ├── app/                    # Main App entry & React Router setup
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── components/             # Reusable UI & layout components
│   │   ├── glass/              # Glassmorphic UI containers & cards
│   │   ├── layout/             # Header, Sidebar, MainLayout wrapper
│   │   └── ui/                 # Buttons, Badges, Modals, Inputs
│   ├── context/                # Global React Contexts (Auth, Theme, Notifications)
│   ├── features/               # Domain feature modules
│   │   ├── analytics/          # Recharts visualizations & reports
│   │   ├── attachments/        # File attachment manager & previewer
│   │   ├── auth/               # Login & Registration pages
│   │   ├── calendar/           # Task calendar view
│   │   ├── comments/           # Task discussion threads & reactions
│   │   ├── dashboard/          # Executive dashboard & metrics
│   │   ├── departments/        # Department creation & member grouping
│   │   ├── notifications/      # Realtime notification drawer
│   │   ├── settings/           # User & application settings
│   │   ├── tasks/              # Kanban board, list view, task modals
│   │   └── team/               # Team member directory & presence
│   ├── firebase/               # Firebase initialization & helper services
│   ├── types/                  # TypeScript interfaces & data models
│   ├── utils/                  # Helper utilities & class merging (clsx/tailwind-merge)
│   ├── index.css               # Global Tailwind CSS directives & custom utility classes
│   └── main.tsx                # React DOM render entry point
├── .env.example                # Template for environment variables
├── index.html                  # HTML5 entry template
├── package.json                # Project dependencies & scripts
├── postcss.config.js           # PostCSS configuration for Tailwind
├── tailwind.config.js          # Tailwind design tokens & custom theme extensions
├── tsconfig.json               # TypeScript compiler config
└── vite.config.ts              # Vite bundle configuration
```

---

## 🚀 Getting Started

Follow these instructions to set up NexusTask Enterprise locally on your machine.

### Prerequisites

* **Node.js**: `v18.x` or higher installed
* **npm**: `v9.x` or higher (or `yarn` / `pnpm`)
* **Firebase Account**: A Firebase project with Authentication & Firestore database enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/Monishwarann/DudeX.Intern-1.git
cd DudeX.Intern-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Role-Based Access Control (RBAC)

NexusTask Enterprise provides three user roles with tailored privilege levels:

| Feature / Action | Admin 👑 | Manager 💼 | Employee 👤 |
|---|:---:|:---:|:---:|
| View Dashboard & Analytics | ✅ | ✅ | ✅ |
| Create & Assign Tasks | ✅ | ✅ | ✅ (Self/Assigned) |
| Move Kanban Columns | ✅ | ✅ | ✅ |
| Edit / Delete Any Task | ✅ | ✅ | ❌ (Own only) |
| Manage Departments | ✅ | ❌ | ❌ |
| Change User Roles | ✅ | ❌ | ❌ |
| View Team Directory | ✅ | ✅ | ✅ |
| Access Global Settings | ✅ | ✅ | ✅ (Profile only) |

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Runs TypeScript type-checking (`tsc -b`) and builds the production bundle with Vite. |
| `npm run preview` | Serves the locally built production bundle for testing. |
| `npm run lint` | Runs ESLint across all TypeScript and React code. |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Monishwarann/DudeX.Intern-1/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p center="align">
  Crafted with ❤️ for <strong>NexusTask Enterprise</strong> | <a href="https://github.com/Monishwarann/DudeX.Intern-1">GitHub Repository</a>
</p>
