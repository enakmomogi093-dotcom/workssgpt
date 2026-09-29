# WorksGPT — Your AI Workspace, Reimagined.

WorksGPT is a modern, high-performance AI workspace built with React, TypeScript, Tailwind CSS, and the Google GenAI SDK. Designed with a clean SaaS aesthetic, glassmorphism UI, real-time streaming responses, and server-side API key protection.

---

## ✨ Features

- **Gemini 3 Powered**: Supports Google's latest models including Gemini 3.8 Flash, Gemini Flash Latest, Gemini 3.1 Pro, and Gemini Flash Lite.
- **Server-Side API Security**: API keys are handled strictly server-side through `/api/chat`. No secrets are ever leaked or bundled into the browser client.
- **Real-Time Streaming**: Live Server-Sent Events (SSE) streaming with animated typing indicators and stop generation controls.
- **Full Markdown Support**: Formatted headings, tables, numbered and bulleted lists, blockquotes, inline code, and dedicated code blocks with one-click **Copy Code** functionality.
- **Multimodal & File Uploads**: Attach images (PNG, JPEG, WEBP) for multimodal vision analysis, along with text and code documents (`.txt`, `.md`, `.json`, `.py`, `.js`, `.ts`).
- **Chat Management**: Client-side persistent history with search, inline title renaming, deletion, export as Markdown, and clear chat.
- **Responsive & Mobile Ready**: Full-height drawer for mobile devices, collapsible sidebar for desktop, and high accessibility compliance.
- **Dual Deployment Ready**: Seamless execution locally via Express + Vite middleware, or serverless deployment to Vercel via `/api/chat.ts` and `vercel.json`.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

Clone this repository and install all required packages:

```bash
npm install
```

### 2. Obtain a Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **Get API Key** and generate a new key.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory (based on `.env.example`):

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

> **Note**: In Google AI Studio, `GEMINI_API_KEY` is automatically injected at runtime.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to launch WorksGPT.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deploy to Vercel

WorksGPT is configured for one-click deployment on [Vercel](https://vercel.com).

### Step-by-Step Vercel Deployment:

1. Push your project to GitHub, GitLab, or Bitbucket.
2. In the **Vercel Dashboard**, click **Add New...** > **Project**.
3. Import your WorksGPT repository.
4. Keep the Framework Preset as **Vite** or default.
5. In the **Environment Variables** section:
   - Click **Add New**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `YOUR_GEMINI_API_KEY`
   - Check all environments:
     - [x] Production
     - [x] Preview
     - [x] Development
6. Click **Deploy**.
7. If you update the API key later:
   - Navigate to **Project Settings** → **Environment Variables**
   - Update `GEMINI_API_KEY`
   - Go to **Deployments** and trigger a **Redeploy**.

---

## 🔒 Security & Architecture

- **No Public API Keys**: Never use `NEXT_PUBLIC_GEMINI_API_KEY` or `VITE_GEMINI_API_KEY`.
- **System Instruction Shield**: System instructions forbid leaking system prompts, environment variables, or credentials.
- **Vercel Serverless Function**: The `/api/chat.ts` endpoint proxies model requests securely on Vercel Edge/Serverless functions.
- **Express Bridge**: The `server.ts` handles API routes and Vite middlewares for local and containerized production environments.

---

## 📄 License

Licensed under the Apache-2.0 License.

## Struktur Folder

```
├── api/chat.ts          # endpoint chat (Vercel)
├── server.ts            # server lokal
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/      # SEMUA komponen taruh di sini (tanpa subfolder)
│   └── lib/             # semua logic, config & type taruh di sini
└── (file config: package.json, vite.config.ts, dll)
```

Mau nambah komponen baru? Cukup buat file `.tsx` di `src/components/`.
Mau nambah logic/type baru? Cukup buat file `.ts` di `src/lib/`.
