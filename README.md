# 📺 GoLedger TV Shows — IMDB-like Blockchain Interface

A web application built with **Next.js** that provides a full CRUD interface for managing TV Shows, Seasons, Episodes, and Watchlists on a blockchain backend via REST API.

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- npm or yarn

### Installation

```bash
# 1. Clone your forked repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 2. Install dependencies
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file at the root of the project:

```env
NEXT_PUBLIC_API_URL=http://<api-host>
NEXT_PUBLIC_API_USER=<your-basic-auth-username>
NEXT_PUBLIC_API_PASSWORD=<your-basic-auth-password>
```

> ⚠️ The API credentials were sent to you by email. Do **not** commit `.env.local` to version control.

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
src/
├── components/
│   └── ui/               # Reusable UI components (Button, Dialog, Input, etc.)
├── pages/
│   ├── index.tsx          # TV Shows listing page
│   ├── watchlist.tsx      # Watchlists page
│   └── [showKey].tsx      # TV Show details (seasons + episodes)
├── services/
│   ├── tvShows.ts         # API calls for TV Shows
│   ├── seasons.ts         # API calls for Seasons
│   ├── episodes.ts        # API calls for Episodes
│   └── watchlists.ts      # API calls for Watchlists
└── types/
    ├── tvShow.ts
    ├── seasons.ts
    ├── episodes.ts
    └── watchlist.ts
```

---

## 📖 Features & Usage

### TV Shows (`/`)

The home page lists all registered TV Shows.

| Action | How |
|--------|-----|
| **Browse** | All shows are displayed as cards on the main page |
| **Add** | Click **"Add New TV Show"** button (bottom of page) |
| **Edit** | Click **"Edit"** on any show card (updates description and recommended age) |
| **Delete** | Click **"Delete"** on any show card |
| **View Details** | Click anywhere on the card to open the show's detail page |

> ℹ️ The **title** of a TV Show cannot be changed after creation, as it acts as the asset key on the blockchain.

---

### TV Show Details (`/shows/[showKey]`)

Opened by clicking a TV Show card. Displays the show's title, description, recommended age, and its seasons/episodes.

#### Seasons

| Action | How |
|--------|-----|
| **Browse** | Season tabs are shown in the top navigation bar of the detail page |
| **Add** | Click **"Add Season"** (top right of seasons bar) — requires a season number and year |
| **Edit** | Click **"Edit Season"** — allows updating the year |
| **Delete** | Click **"Delete Season"** — removes the season and all its episodes |

> ℹ️ Season **number** is immutable after creation.

#### Episodes

Displayed below the selected season tab, sorted by episode number.

| Action | How |
|--------|-----|
| **Browse** | Listed under the active season |
| **Add** | Click **"Add Episode"** — fill in episode number, title, release date, description, and optional rating |
| **Edit** | Click **"Edit"** on an episode row — all fields except episode number can be changed |
| **Delete** | Click **"Delete"** on an episode row |

---

### Watchlists (`/watchlists`)

Manage curated lists of TV Shows.

| Action | How |
|--------|-----|
| **Browse** | All watchlists are shown as cards |
| **Create** | Click **"Add Watchlist"** — provide a title and optional description. Shows cannot be added during creation |
| **Edit** | Click **"Edit"** on a watchlist card — update description and toggle which TV Shows are included |
| **Delete** | Click **"Delete"** on a watchlist card |

> ⚠️ TV Shows can only be added to a Watchlist through the **Edit** dialog, not during creation.

---

## 🛠️ Tech Stack

- **Next.js** (React framework)
- **TypeScript**
- **Tailwind CSS** (utility-first styling)
- **Lucide React** (icons)
- **Sonner** (toast notifications)