# ग्रीनLedger — Evidence-Backed Sustainability Intelligence Platform

> **Editorial, evidence-backed energy audits and institutional Green Scorecards for Delhi NCR campuses and educational institutions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-09453d.svg)](https://opensource.org/licenses/MIT)
[![Framework: React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite: 8](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![TypeScript: 7](https://img.shields.io/badge/TypeScript-7-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS: 4](https://img.shields.io/badge/TailwindCSS-4-38B2AC.svg)](https://tailwindcss.com/)

---

## 🏛️ Overview

**ग्रीनLedger** replaces opaque green claims and unaudited ESG assertions with **verifiable, primary-evidence sustainability intelligence**. Designed specifically for major universities and technical institutes across the National Capital Territory (NCT) of Delhi (including IGDTUW Kashmere Gate, IIT Delhi Hauz Khas, DTU Rohini, JNU New Mehrauli, Jamia Millia Islamia, NSUT Dwarka, and more).

Every kilowatt-hour, carbon equivalent, and renewable offset is tied to verifiable DISCOM utility invoices (BRPL, BYPL, TPDDL), smart meter telemetry, and official CEA (Central Electricity Authority) baseline emission factors.

---

## ✨ Key Features

1. **🗺️ Interactive Delhi Campus Geographic Intelligence**
   - High-fidelity interactive mapping powered by Google Maps Platform (with Leaflet fallback).
   - Visualizes campus micro-grids, DISCOM service territories, and live solar capacity across Delhi's premier higher-education institutes.

2. **📊 Verified Energy Audit Engine**
   - 12-month billing trajectory and peak demand tracking.
   - Computes Scope 2 emissions based on CEA Grid Emission Factors (0.82 kg CO₂e/kWh).
   - Rooftop solar generation offsets and net grid import calculations.

3. **🔬 3D Architectural Exploded Specimen**
   - Real-time Three.js exploded architectural model illustrating campus sustainability subsystems:
     - Rooftop Solar PV Array
     - HVAC & Thermal Optimization Core
     - IoT Energy Sub-meters & Telemetry Node
     - Passive Shading & Building Envelope

4. **🚩 Automated Audit Review Flags & Fraud Prevention**
   - Automated detection of missing evidence records, tariff anomalies, and sudden consumption surges.
   - Formal resolution workflows with timestamped audit logs.

5. **📜 Institutional Green Scorecard & Export**
   - Letter-grade rating (A+, A, B+, B) grounded in empirical energy performance indices (EPI in kWh/m²/year).
   - Tamper-evident verification hash and printable presentation document.

6. **⚡ Full-Stack REST API**
   - Express server with integrated Vite middleware.
   - Endpoints for campuses, utility bills, review flags, and live scorecard recalculations.

---

## 🚀 Quick Start

### ⚡ Instant Offline Launch (If you downloaded the ZIP)

You can run the entire application **immediately without installing Node.js**:
- **Any Browser:** Double-click `launch-app.html` in the root folder.
- **Windows:** Double-click `start-app.bat`.
- **macOS / Linux:** Double-click or run `./start-app.sh`.
- If you open `index.html`, it will automatically redirect you to `launch-app.html` or display the 1-click launcher.

---

### 💻 Developer Mode (With Full-Stack Express Server)

### 1. Clone or Extract Project
```bash
cd greenledger
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
- `VITE_GOOGLE_MAPS_API_KEY`: *(Optional)* Your Google Maps Platform API key. If omitted, the application automatically uses Leaflet OpenStreetMap tiles.
- `GEMINI_API_KEY`: *(Optional)* Gemini AI API key for conversational energy audit insights.

### 4. Run Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📦 Pushing to Your GitHub Repository

If you're setting up this repository on GitHub for the first time:

1. **Create a new repository** on GitHub (e.g. `greenledger` or `delhi-green-ledger`). Do not initialize with README or license if you want to push this exact codebase.
2. In your terminal, run:
   ```bash
   # Add your GitHub repository as remote origin
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

   # Set default branch to main
   git branch -M main

   # Push all commits to GitHub
   git push -u origin main
   ```

*(Tip: In Google AI Studio Build, you can also use the **Export** menu in the top right to link your GitHub account and export with 1-click).*

---

## 📁 Project Architecture

```
├── server.ts                  # Express full-stack API server + Vite middleware
├── index.html                 # HTML5 entry with editorial typography
├── metadata.json              # AI Studio applet specifications
├── package.json               # Node.js dependencies & scripts
├── public/                    # Static assets & media specimens
├── src/
│   ├── App.tsx                # Main view router & persistent state sync
│   ├── index.css              # Tailwind CSS v4 design tokens & typography
│   ├── main.tsx               # React 19 application mount point
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces (Campus, Bill, Flag, Scorecard)
│   ├── data/
│   │   ├── delhiCampuses.ts   # NCT Delhi campus registry & CEA emission factors
│   │   └── mockData.ts        # Baseline utility telemetry and specimen data
│   ├── lib/
│   │   ├── api.ts             # Client API service
│   │   ├── calculations.ts    # Deterministic DERC audit & scorecard formulas
│   │   └── formatters.ts      # Indian numbering system (Lakh/Crore) & units
│   └── components/
│       ├── app/               # Authenticated Institutional Workspace
│       │   ├── AppHeader.tsx
│       │   ├── DelhiCampusMap.tsx
│       │   ├── EnergyAuditView.tsx
│       │   ├── EvidenceLibraryView.tsx
│       │   ├── GreenScorecardView.tsx
│       │   ├── OverviewView.tsx
│       │   ├── ReportsSettingsView.tsx
│       │   └── ReviewFlagsView.tsx
│       ├── common/
│       │   └── BotanicalLeaf.tsx
│       └── public/            # Editorial Landing Page & Specimen Display
│           ├── CapabilitiesSection.tsx
│           ├── ClosingCtaFooter.tsx
│           ├── FaqSection.tsx
│           ├── HeroExplodedSpecimen.tsx
│           ├── HeroSection.tsx
│           ├── InteractiveQuestionsSection.tsx
│           ├── MovingCrowdSection.tsx
│           ├── ProblemSection.tsx
│           ├── ProductPreviewsSection.tsx
│           ├── PublicNavbar.tsx
│           ├── SampleScorecardSection.tsx
│           ├── ThreeCampusSpecimen.tsx
│           ├── ThreeExplodedCanvas.tsx
│           ├── TrustMethodologySection.tsx
│           └── WorkflowSection.tsx
```

---

## 📜 Regulatory Standards & Emission Factors

- **Central Electricity Authority (CEA)**: Baseline Delhi Northern Regional Grid Emission Factor: **0.82 kg CO₂e / kWh**.
- **Delhi Electricity Regulatory Commission (DERC)**: Tariff Schedules and Time-of-Day (ToD) billing compliance.
- **BEE (Bureau of Energy Efficiency)**: Energy Performance Index (EPI = Annual kWh / Air-Conditioned Built-up Area in m²).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
