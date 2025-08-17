# reonic-ev-sim

EV charging simulator for a 20-stall site (11 kW each).
Simulates arrivals every 15 minutes (T1/T2 probabilities), serves live stats and a per-day power series, and visualizes everything in a React dashboard.

## ✅ What you get

* **Backend (TypeScript + Express)**

  * `POST /reserve` — start a charging session on a free charger
  * `GET /chargers` — live charger states (progress, ETA)
  * `GET /stats` — energy totals, concurrency, current power
  * `GET /series/day` — 96× 15-min slices (power in kW)
* **Frontend (Vite + React + TypeScript)**

  * **Home**: charger grid + KPIs
  * **Daily Power**: line chart of site power (kW) across the day
* **In-memory store** for easy local runs (no DB)

---

## 🔧 Requirements

* **Node.js 18+** (LTS recommended)
  Check: `node -v`
* **npm 9+**
  Check: `npm -v`
* **Git**
  Check: `git --version`

> Ports used: **3000** (API) and **5173** (web). Close anything occupying those ports.

---

## 🚀 Quick start (one command)

```bash
git clone https://github.com/ashrafuthman/reonic-ev-sim.git
cd reonic-ev-sim

# install root + workspaces
npm i

# run API and Web in parallel
npm run dev
```

* Web: [http://localhost:5173](http://localhost:5173)
* API: [http://localhost:3000](http://localhost:3000)

### Environment (already defaults to sane values)

Create these files if you want to override defaults:

**backend/.env**

```
PORT=3000
```

**frontend/.env**

```
VITE_API_BASE=http://localhost:3000
```

---

## 🧭 Repository layout

```
reonic-ev-sim/
├─ backend/                 # Express + TypeScript (in-memory)
│  ├─ src/
│  │  ├─ routes/            # chargers, stats, reserve, series
│  │  ├─ services/          # computeStats, etc.
│  │  ├─ utils/             # time helpers, overlaps
│  │  ├─ state.ts           # in-memory chargers & sessions
│  │  └─ config.ts          # POWER_PER_CHARGER_KW, INTERVAL_MINUTES, TIMEZONE
│  ├─ package.json
│  └─ tsconfig.json
└─ frontend/               # Vite + React + TS dashboard
   ├─ src/
   │  ├─ api/               # typed fetchers (stats, chargers, series, reserve)
   │  ├─ components/        # Charger card, charts, navbar
   │  ├─ hooks/             # React Query wrappers, auto-reserve (optional)
   │  └─ pages/             # Home, Daily Power
   ├─ package.json
   └─ tsconfig.json
```

---

## 🧪 Try it in 30 seconds

Start both apps (`npm run dev`), then:

### 1) Start a charging session

```bash
curl -X POST http://localhost:3000/reserve \
  -H "Content-Type: application/json" \
  -d '{"carName":"Car-1","kWhNeeded":9}'
```

Response:

```json
{ "message":"Charger reserved","chargerId":1,"sessionId":1,"endTime":"14:52" }
```

### 2) See chargers

```bash
curl http://localhost:3000/chargers
```

### 3) See site stats

```bash
curl http://localhost:3000/stats
```

### 4) Daily power series (15-min slices)

```bash
curl "http://localhost:3000/series/day?day=$(date +%F)"
```

