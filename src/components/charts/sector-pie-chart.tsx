"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { SectorData } from "@/types/employment";
import { ChartTooltip } from "./chart-theme";

interface SectorPieChartProps {
	data: SectorData[];
	areaType?: "all" | "urban" | "rural";
}

const COLORS = [
	"#34d399", // Agriculture - emerald
	"#60a5fa", // Manufacturing - blue
	"#fb923c", // Construction - orange
	"#a78bfa", // Trade - violet
	"#22d3ee", // Transport - cyan
	"#f472b6", // Education/Health - pink
	"#fbbf24", // Public Admin - amber
	"#94a3b8", // Other - slate
];

export function SectorPieChart({ data, areaType = "all" }: SectorPieChartProps) {
	const chartData = data.map((item) => ({
		name: item.sector,
		value:
			areaType === "urban"
				? item.urbanPercentage
				: areaType === "rural"
					? item.ruralPercentage
					: item.percentage,
	}));

	return (
		<ResponsiveContainer width="100%" height={350}>
			<PieChart>
				<Pie
					data={chartData}
					cx="50%"
					cy="45%"
					labelLine={false}
					outerRadius={110}
					innerRadius={55}
					paddingAngle={2}
					dataKey="value"
					strokeWidth={0}
					animationDuration={800}
					animationEasing="ease-out"
					label={({ name, percent }) =>
						percent && percent > 0.05
							? `${String(name).split(" ")[0]} ${(percent * 100).toFixed(0)}%`
							: ""
					}
				>
					{chartData.map((_, index) => (
						<Cell
							key={`cell-${index.toString()}`}
							fill={COLORS[index % COLORS.length]}
							fillOpacity={0.85}
						/>
					))}
				</Pie>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const item = payload[0];
							return (
								<ChartTooltip>
									<p className="font-semibold text-foreground">{item.name}</p>
									<p className="text-muted-foreground mt-0.5">
										Employment:{" "}
										<span className="font-semibold text-foreground tabular-nums">
											{item.value}%
										</span>
									</p>
								</ChartTooltip>
							);
						}
						return null;
					}}
				/>
				<Legend
					layout="horizontal"
					verticalAlign="bottom"
					align="center"
					wrapperStyle={{ paddingTop: "16px", fontSize: "11px" }}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}
