"use client";

// Shared chart theming constants for consistent look across all charts
export const chartGridStyle = "oklch(0.5 0 0 / 8%)";
export const chartAxisStyle = "oklch(0.5 0 0 / 15%)";
export const chartTickStyle = { fill: "oklch(0.55 0 0)", fontSize: 11 };
export const chartTickSmall = { fill: "oklch(0.55 0 0)", fontSize: 10 };

export function ChartTooltip({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-card/95 glass-effect border border-border/50 rounded-xl shadow-xl px-3 py-2.5 text-xs">
			{children}
		</div>
	);
}

// Premium chart color palette
export const CHART_COLORS = {
	red: "#f87171",
	blue: "#60a5fa",
	green: "#34d399",
	orange: "#fb923c",
	pink: "#f472b6",
	violet: "#a78bfa",
	cyan: "#22d3ee",
	amber: "#fbbf24",
	gray: "#9ca3af",
};
