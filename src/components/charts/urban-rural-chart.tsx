"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { StateEmploymentData } from "@/types/employment";

interface UrbanRuralChartProps {
	data: StateEmploymentData[];
	maxItems?: number;
}

export function UrbanRuralChart({ data, maxItems = 10 }: UrbanRuralChartProps) {
	// Sort by the difference between urban and rural unemployment
	const sortedData = [...data]
		.filter((s) => s.urbanUnemploymentRate > 0 && s.ruralUnemploymentRate > 0)
		.sort(
			(a, b) =>
				Math.abs(b.urbanUnemploymentRate - b.ruralUnemploymentRate) -
				Math.abs(a.urbanUnemploymentRate - a.ruralUnemploymentRate),
		)
		.slice(0, maxItems)
		.map((state) => ({
			name: state.stateName.length > 12 ? `${state.stateName.slice(0, 10)}...` : state.stateName,
			fullName: state.stateName,
			stateCode: state.stateCode,
			urban: state.urbanUnemploymentRate,
			rural: state.ruralUnemploymentRate,
			gap: state.urbanUnemploymentRate - state.ruralUnemploymentRate,
		}));

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={sortedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
				<XAxis
					dataKey="name"
					tick={{ fill: "#9ca3af", fontSize: 10 }}
					axisLine={{ stroke: "#4b5563" }}
					angle={-45}
					textAnchor="end"
					height={70}
				/>
				<YAxis
					tick={{ fill: "#9ca3af", fontSize: 12 }}
					axisLine={{ stroke: "#4b5563" }}
					tickFormatter={(v) => `${v}%`}
					domain={[0, "dataMax + 2"]}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "hsl(var(--background))",
						border: "1px solid hsl(var(--border))",
						borderRadius: "8px",
					}}
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const item = payload[0].payload;
							return (
								<div className="bg-background border border-border rounded-lg shadow-lg p-3">
									<p className="font-semibold text-sm">{item.fullName}</p>
									<div className="text-xs mt-1 space-y-0.5">
										<p className="text-orange-400">Urban UR: {item.urban}%</p>
										<p className="text-green-400">Rural UR: {item.rural}%</p>
										<p className="text-muted-foreground">
											Difference: {item.gap > 0 ? "+" : ""}
											{item.gap.toFixed(1)}%
										</p>
									</div>
								</div>
							);
						}
						return null;
					}}
				/>
				<Legend wrapperStyle={{ color: "#9ca3af" }} />
				<Bar dataKey="urban" name="Urban UR" fill="#f97316" radius={[4, 4, 0, 0]} />
				<Bar dataKey="rural" name="Rural UR" fill="#22c55e" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
