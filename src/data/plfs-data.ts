// PLFS utility functions - color coding for employment metrics
// Data is now fetched live from MoSPI MCP server

export function getUnemploymentColor(rate: number): string {
	if (rate <= 2.5) return "#22c55e"; // Green - very low
	if (rate <= 4.0) return "#84cc16"; // Lime - low
	if (rate <= 5.5) return "#eab308"; // Yellow - moderate
	if (rate <= 7.0) return "#f97316"; // Orange - high
	return "#ef4444"; // Red - very high
}

export function getLfprColor(rate: number): string {
	if (rate >= 60) return "#22c55e"; // Green - very high participation
	if (rate >= 55) return "#84cc16"; // Lime - high
	if (rate >= 50) return "#eab308"; // Yellow - moderate
	if (rate >= 45) return "#f97316"; // Orange - low
	return "#ef4444"; // Red - very low
}
