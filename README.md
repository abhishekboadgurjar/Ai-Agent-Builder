# Ai Agent Builder

> A production-ready visual platform for designing, testing, and deploying custom AI agents with zero-code workflow automation

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge\&logo=next.js\&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-FF4785?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge\&logo=openai\&logoColor=white)

[Live Demo](#) · [Report Bug](https://github.com/abhishekboadgurjar/BuildMyAiAgent/issues) · [Request Feature](https://github.com/abhishekboadgurjar/BuildMyAiAgent/issues)

</div>

---

## 🎯 Project Overview

Ai Agent Builder empowers users to create sophisticated AI-powered automation workflows through an intuitive visual interface. Built with modern full-stack architecture, it demonstrates enterprise-level patterns for realtime collaboration, serverless computing, and intelligent agent orchestration.

**Author:** Abhishek Gurjar — [GitHub Profile](https://github.com/abhishekboadgurjar)

---

## ✨ Core Features

### Visual Workflow Engine

* **Drag-and-drop node editor** powered by @xyflow/react for intuitive agent design
* **Custom node library** including API calls, conditional logic, loops, and approval gates
* **Real-time canvas** with auto-save and collaborative editing capabilities
* **Visual debugging** with execution path highlighting and error tracking

### Intelligent Agent System

* **LLM Integration** with OpenAI for natural language processing
* **Multi-step workflows** supporting complex business logic
* **API orchestration** with built-in HTTP client and response handling
* **State management** across workflow execution with context preservation

### Production Infrastructure

* **Secure authentication** via Clerk with SSO and MFA support
* **Serverless backend** using Convex for automatic scaling
* **Real-time sync** enabling instant updates across users
* **Type-safe API layer** with end-to-end TypeScript coverage

### Developer Experience

* **Interactive testing** environment with live agent preview
* **Comprehensive logging** for debugging workflow execution
* **Export/import** workflows as JSON for version control
* **Responsive UI** built with Tailwind CSS utility classes

---

## 🛠️ Technical Architecture

### Frontend Stack

```
Next.js 15 (App Router)     → SSR/SSG hybrid rendering
React 19                    → Modern concurrent features
TypeScript                  → Type safety across codebase
Tailwind CSS                → Utility-first styling
@xyflow/react               → Flow-based visual editor
Lucide React                → Consistent icon system
Recharts                    → Data visualization
```

### Backend & Services

```
Convex                      → Realtime serverless functions
Clerk                       → Authentication & user management
OpenAI API                  → LLM-powered intelligence
Arcjet                      → Security & rate limiting
```

### Key Architectural Decisions

**Why Next.js App Router?**
Leverages React Server Components for optimal performance, streaming SSR for faster TTFB, and simplified data fetching patterns that reduce client-side JavaScript.

**Why Convex?**
Provides automatic real-time subscriptions, optimistic updates out-of-the-box, and eliminates the need for separate REST/GraphQL API layer with fully typed client-server communication.

**Why Clerk?**
Production-ready auth with zero backend code, built-in UI components, and seamless JWT integration with our serverless architecture.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Agent Builder│  │ Dashboard UI │  │  Auth Pages  │      │
│  │  (@xyflow)   │  │   (Recharts) │  │   (Clerk)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js API Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Agent Chat   │  │ Config Gen   │  │ Webhook API  │      │
│  │   Routes     │  │   Routes     │  │   Routes     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Convex Backend     │    │   External APIs      │
│  ┌────────────────┐  │    │  ┌────────────────┐  │
│  │ Agents Schema  │  │    │  │  OpenAI API    │  │
│  │ Users Schema   │  │    │  │  Custom APIs   │  │
│  │ Workflows DB   │  │    │  └────────────────┘  │
│  └────────────────┘  │    └──────────────────────┘
└──────────────────────┘
```

---

## 🚀 Full-Stack Skills Demonstrated

### Frontend Engineering

* Modern React Patterns, canvas interactions, performance optimizations
* Advanced UI/UX with drag-drop, keyboard shortcuts, realtime sync

### Backend Development

* Serverless architecture with Convex
* Realtime data, WebSockets, API integrations

### DevOps & Infrastructure

* Environment management, security, deployment to Vercel + Convex

### Software Engineering Practices

* Clean code, modular structure, documentation, version control

---

## 📂 Project Structure

```
ai-agent-builder/
├── app/
│   ├── (auth)/
│   ├── agent-builder/
│   ├── api/
│   ├── dashboard/
│   ├── provider.tsx
│   └── layout.tsx
├── convex/
├── components/
├── lib/
├── public/
└── types/
```

---

## 🔧 Local Development Setup

1. Clone repository
2. Install dependencies
3. Setup environment variables
4. Run Convex
5. Start Next.js

---

## 🌐 Deployment Guide

Deploy via **Vercel** + **Convex Production Deploy**.

---

## 🤝 Contributing

Accepting pull requests. Follow guidelines and code style.

---

## 📝 License

MIT License

---

## 📬 Contact

**Abhishek Gurjar**
GitHub: @abhishekboadgurjar
Portfolio: [https://abhishekboadgurjar.vercel.app/](https://abhishekboadgurjar.vercel.app/)
