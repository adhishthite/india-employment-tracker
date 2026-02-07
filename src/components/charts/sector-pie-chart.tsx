"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { SectorData } from "@/types/employment";

interface SectorPieChartProps {
	data: SectorData[];
	areaType?: "all" | "urban" | "rural";
}

const COLORS = [
	"#22c55e", // Agriculture - green
	"#3b82f6", // Manufacturing - blue
	"#f97316", // Construction - orange
	"#8b5cf6", // Trade - purple
	"#06b6d4", // Transport - cyan
	"#ec4899", // Education/Health - pink
	"#eab308", // Public Admin - yellow
	"#6b7280", // Other - gray
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
					cy="50%"
					labelLine={false}
					outerRadius={120}
					innerRadius={60}
					paddingAngle={2}
					dataKey="value"
					label={({ name, percent }) =>
						percent && percent > 0.05
							? `${String(name).split(" ")[0]} ${(percent * 100).toFixed(0)}%`
							: ""
					}
				>
					{chartData.map((_, index) => (
						<Cell key={`cell-${index.toString()}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip
					contentStyle={{
						backgroundColor: "hsl(var(--background))",
						border: "1px solid hsl(var(--border))",
						borderRadius: "8px",
					}}
					formatter={(value) => [`${value}%`, "Employment"]}
				/>
				<Legend
					layout="horizontal"
					verticalAlign="bottom"
					align="center"
					wrapperStyle={{ paddingTop: "20px" }}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}
