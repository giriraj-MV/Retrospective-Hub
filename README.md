# Retrospective Hub

> **Product & UI Close-out Register** — A centralized, interactive retrospective tracking system with real-time Google Sheets synchronization.

---

## 📌 Overview

**Retrospective Hub** is an agile release and sprint retrospective management portal. It enables product managers, UI/UX designers, and engineering leads to systematically log project close-outs, track effort hours, document requirement gaps, categorize UAT issues, and preserve actionable lessons learned across project lifecycles.

### Key Capabilities
- **Effort & Defect Tracking**: Record Product Owner and UI Owner hours alongside UAT issue severity and remarks.
- **Requirement & Process Gap Analysis**: Document requirement ambiguities, specification gaps, and mitigation strategies.
- **Continuous Improvement Ledger**: Catalog product and UI lessons learned to prevent recurring blockers in future releases.
- **Bi-directional Google Sheets Sync**: Lightweight serverless architecture using Google Apps Script with atomic locks for concurrent submissions.
- **Adaptive Interface**: Dense multi-column data grid on desktop with a tactile bottom sheet drawer view on compact screens.

---

## 🏗️ Repository Architecture

```text
Retrospective-Hub/
├── public/
│   └── favicon.svg                  # Application vector icon
├── src/
│   ├── App.jsx                      # Core dashboard, table, filter, and drawer logic
│   ├── googleSheets.js              # API communication layer with Google Apps Script
│   ├── styles.css                   # Responsive styles, theme tokens, and animations
│   └── main.jsx                     # Application entry point
├── .github/
│   └── workflows/
│       └── deploy.yml               # Automated GitHub Pages CI/CD workflow
├── google-apps-script.js            # Google Apps Script backend to deploy in Google Sheets
├── index.html                       # HTML shell with Plus Jakarta Sans typography
├── vite.config.mjs                  # Vite bundler configuration (relative base paths)
├── package.json                     # Project scripts and dependencies (React 19, Vite 6)
├── package-lock.json                # Dependency lockfile
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules for node_modules, dist, and local envs
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or later recommended)
- **npm** (v9.0.0 or later)

### Installation & Local Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/giriraj-MV/Retrospective-Hub.git
   cd Retrospective-Hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env`:
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env

   # Mac / Linux
   cp .env.example .env
   ```
   Configure the `VITE_GOOGLE_SCRIPT_URL` with your deployed Google Apps Script endpoint:
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## ⚙️ Google Apps Script (Backend) Setup

The application syncs with a Google Sheet via a dedicated Apps Script web app (`google-apps-script.js`).

### Deployment Steps:
1. Open your Google Spreadsheet (e.g., sheet named `Retro`).
2. Navigate to **Extensions** > **Apps Script**.
3. Replace any existing code with the contents of [`google-apps-script.js`](./google-apps-script.js).
4. Click **Deploy** > **New deployment**.
5. Select type: **Web app**.
6. Set the configuration:
   - **Description**: `Retro API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
7. Click **Deploy** and authorize permissions.
8. Copy the generated **Web app URL** (`https://script.google.com/macros/s/.../exec`) and paste it into `.env` as `VITE_GOOGLE_SCRIPT_URL`.

---

## 🌐 Deployment to GitHub Pages

An automated GitHub Actions workflow is included at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

To deploy:
1. In the GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Every push to `main` will automatically build and publish the latest version of the app.

---

## 🔒 License & Confidentiality

This repository is **Private** and maintained for internal project retrospective documentation. All rights reserved.
