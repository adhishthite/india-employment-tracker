# India Employment Tracker

State-wise employment analytics dashboard powered by live PLFS data from the Government of India.

![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![MoSPI](https://img.shields.io/badge/Data-MoSPI_PLFS-orange)
![MCP](https://img.shields.io/badge/Protocol-MCP-purple)

![Dashboard Preview](screenshot.png)

## What is this?

An interactive dashboard that pulls **live employment data** from the Government of India's Ministry of Statistics and Programme Implementation (MoSPI) via their [Model Context Protocol (MCP) server](https://mcp.mospi.gov.in/). No API keys required - the data is publicly available.

The dashboard visualizes data from the **Periodic Labour Force Survey (PLFS)** - India's flagship household employment survey conducted by the National Statistical Office (NSO). PLFS covers unemployment rates, labour force participation, worker population ratios, wages, and sector-wise employment distribution across all states and union territories.

Data spans **2017-18 through 2023-24** (annual), covering 36 states and UTs.

## Features

- **National employment summary** - Unemployment Rate (UR), Labour Force Participation Rate (LFPR), Worker Population Ratio (WPR), youth unemployment
- **Choropleth map** - State-wise unemployment visualization using real India geographic boundaries (react-simple-maps + TopoJSON)
- **State comparison** - Compare up to 5 states side-by-side across key indicators
- **Trend analysis** - Multi-year charts (2017-2024) showing national employment trends
- **Age group breakdown** - Unemployment and LFPR across 15-29, 15-59, and 15+ demographics
- **Sector distribution** - Worker distribution across agriculture, manufacturing, construction, services, and more
- **Rural vs Urban** - Sector-wise urban/rural employment split
- **Gender demographics** - Male vs female LFPR and unemployment comparisons
- **Dark mode** - Full dark/light theme support
- **Live data** - No hardcoded or mock data; everything comes from MoSPI in real time

## Data Source

The [Periodic Labour Force Survey (PLFS)](https://mospi.gov.in/periodic-labour-force-survey-plfs) is conducted by NSO under MoSPI. It is the primary source for labour market statistics in India, providing estimates of:

| Indicator | Code | Description |
|-----------|------|-------------|
| LFPR | 1 | Labour Force Participation Rate |
| WPR | 2 | Worker Population Ratio |
| UR | 3 | Unemployment Rate |
| Worker Distribution | 4 | Percentage distribution of workers by industry |
| Wages | 6-8 | Average wage/salary earnings |

Data is accessed via MoSPI's MCP server: [github.com/nso-india/esankhyiki-mcp](https://github.com/nso-india/esankhyiki-mcp)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| Charts | [Recharts](https://recharts.org/) |
| Map | [react-simple-maps](https://www.react-simple-maps.io/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Theme | next-themes |
| Linting | [Biome](https://biomejs.dev/) |
| Runtime | [Bun](https://bun.sh/) |

## How It Works

The app acts as an **MCP client** that talks to MoSPI's MCP server using JSON-RPC 2.0 over Server-Sent Events (Streamable HTTP).

```
Browser  -->  Next.js API Route (/api/plfs)  -->  MoSPI MCP Server
                    |                                    |
              Cache (30min TTL)              JSON-RPC 2.0 over SSE
```

### MCP Workflow

MoSPI enforces a **mandatory 4-step sequential workflow** per session:

1. **Initialize** - POST to `mcp.mospi.gov.in`, receive `mcp-session-id`
2. **`1_know_about_mospi_api`** - Mandatory API overview call
3. **`2_get_indicators` / `3_get_metadata`** - Fetch available indicators and metadata for PLFS
4. **`4_get_data`** - Fetch actual PLFS data with filters (indicator, year, state, gender, sector, age group)

Skipping any step results in an error from the server.

### Rate Limiting Strategy

MoSPI's API has strict rate limits. The app handles this with:

- **Shared session** - Steps 1-3 are executed once and the session is reused for all subsequent `4_get_data` calls
- **1.5s delay** between data calls to stay within rate limits
- **Sequential fetching** - Dashboard data categories (national summary, state data, age groups, sectors, trends) are fetched sequentially, not in parallel
- **In-memory cache** with 30-minute TTL to minimize repeat calls
- **Automatic session recovery** - On failure, the session is reset and retried once

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- No API keys or environment variables needed

### Run locally

```bash
git clone https://github.com/adhishthite/india-employment-tracker.git
cd india-employment-tracker
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

The first load fetches live data from MoSPI (may take a moment due to rate limiting). Subsequent loads use the 30-minute cache.

### Using Make

```bash
make install    # Install dependencies
make dev        # Start dev server (Turbopack)
make build      # Production build
make check      # Biome format + lint (auto-fix)
make typecheck  # TypeScript type checking
make clean      # Remove .next, node_modules, bun.lock
```

## Project Structure

```
src/
├── app/
│   ├── api/plfs/route.ts      # API route - MCP client entrypoint
│   ├── layout.tsx             # Root layout with theme provider
│   └── page.tsx               # Dashboard page (client component)
├── components/
│   ├── charts/                # IndiaMap choropleth, Recharts visualizations
│   ├── dashboard/             # Dashboard-specific UI components
│   └── ui/                    # shadcn/ui primitives
├── lib/
│   ├── mcp-client.ts          # MoSPI MCP protocol client (SSE, JSON-RPC)
│   ├── mcp-cache.ts           # In-memory cache with TTL
│   ├── data-fetchers.ts       # PLFS data transformation (MoSPI -> UI types)
│   ├── use-plfs-data.ts       # React hook for client-side data fetching
│   └── utils.ts               # Tailwind cn() utility
├── data/
│   └── plfs-data.ts           # Color scale helpers
└── types/
    └── employment.ts          # TypeScript interfaces
```

Key files:

- `src/lib/mcp-client.ts` - Core MCP protocol implementation (session init, SSE parsing, tool calls, shared session with rate limiting)
- `src/lib/data-fetchers.ts` - Transforms raw MoSPI PLFS records into dashboard-ready types (state data, national summary, age groups, sectors, trends)
- `src/app/api/plfs/route.ts` - Next.js API route that orchestrates all data fetching with cache headers

## Author

**Adhish Thite**

- GitHub: [github.com/adhishthite](https://github.com/adhishthite)
- LinkedIn: [linkedin.com/in/adhishthite](https://linkedin.com/in/adhishthite)
- Twitter: [x.com/AdhishThite](https://x.com/AdhishThite)

## License

MIT
