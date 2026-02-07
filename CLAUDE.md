# India Employment Tracker

State-wise employment analytics dashboard using live PLFS data from MoSPI.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Recharts for visualizations
- next-themes for dark mode
- Biome for linting/formatting

## Commands
```bash
make install    # Install dependencies
make dev        # Start dev server
make build      # Production build
make check      # Biome format + lint
make typecheck  # TypeScript check
```

## Project Structure
```
src/
├── app/
│   ├── api/plfs/        # API route - fetches live PLFS data from MoSPI
│   └── page.tsx         # Dashboard page (client component)
├── components/
│   ├── charts/          # Recharts visualizations (IndiaMap, charts)
│   ├── dashboard/       # Dashboard-specific components
│   └── ui/              # shadcn/ui components
├── data/
│   └── plfs-data.ts     # Utility functions only (color helpers)
├── lib/
│   ├── mcp-client.ts    # Generic MoSPI MCP protocol client (SSE, JSON-RPC)
│   ├── mcp-cache.ts     # In-memory cache with TTL
│   ├── data-fetchers.ts # PLFS-specific data transformation (MoSPI -> UI types)
│   ├── use-plfs-data.ts # Client-side React hook for fetching dashboard data
│   └── utils.ts         # cn() utility
└── types/
    └── employment.ts    # TypeScript types
```

## Data Architecture
- Live data from MoSPI MCP server (https://mcp.mospi.gov.in/)
- Server-side fetching via API route `/api/plfs`
- MCP protocol: JSON-RPC 2.0 over SSE (Streamable HTTP)
- In-memory cache with 30-minute TTL
- Graceful fallback on error: loading spinner + retry button
- No mock/hardcoded data

## MoSPI MCP Workflow
1. Initialize session (POST to MoSPI, get `mcp-session-id`)
2. Call `1_know_about_mospi_api` (mandatory overview)
3. Call `4_get_data` with PLFS filters (indicator, year, state, gender, sector)
- frequency_code=1 (Annual) for all 8 indicators
- Indicator codes: 1=LFPR, 2=WPR, 3=UR, 4=Worker distribution, 6-8=Wages
- Data years available: 2017-18 through 2023-24

## Features
- Interactive India map with state selection
- State comparison (up to 5 states)
- Trend analysis charts (annual, 2017-2024)
- Age group, gender, sector breakdowns
- Urban vs Rural analysis
- Dark mode support
- Responsive design
