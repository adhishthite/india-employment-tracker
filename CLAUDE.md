# India Employment Tracker

State-wise employment analytics dashboard using PLFS data.

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
├── app/              # Next.js app router
├── components/
│   ├── charts/       # Recharts visualizations (IndiaMap, charts)
│   ├── dashboard/    # Dashboard-specific components
│   └── ui/           # shadcn/ui components
├── data/             # PLFS sample data
└── types/            # TypeScript types
```

## Data
Sample PLFS-style data in `src/data/plfs-data.ts`. Includes:
- State unemployment rates, LFPR, WPR
- Gender-wise LFPR
- Urban/Rural breakdown
- Age group analysis
- Sector distribution
- Quarterly trends (2020-2024)

## Features
- Interactive India map with state selection
- State comparison (up to 5 states)
- Trend analysis charts
- Age group, gender, sector breakdowns
- Urban vs Rural analysis
- Dark mode support
- Responsive design
