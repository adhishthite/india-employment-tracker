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

interface GenderComparisonChartProps {
	data: StateEmploymentData[];
	maxItems?: number;
}

export function GenderComparisonChart({ data, maxItems = 10 }: GenderComparisonChartProps) {
	const sortedData = [...data]
		.sort((a, b) => b.lfpr - a.lfpr)
		.slice(0, maxItems)
		.map((state) => ({
			name: state.stateName.length > 12 ? `${state.stateName.slice(0, 10)}...` : state.stateName,
			fullName: state.stateName,
			stateCode: state.stateCode,
			male: state.maleLfpr,
			female: state.femaleLfpr,
			gap: state.maleLfpr - state.femaleLfpr,
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
					domain={[0, 100]}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "hsl(var(--background))",
						border: "1px solid hsl(var(--border))",
						borderRadius: "8px",
					}}
					labelStyle={{ color: "hsl(var(--foreground))" }}
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const item = payload[0].payload;
							return (
								<div className="bg-background border border-border rounded-lg shadow-lg p-3">
									<p className="font-semibold text-sm">{item.fullName}</p>
									<div className="text-xs mt-1 space-y-0.5">
										<p className="text-blue-400">Male LFPR: {item.male}%</p>
										<p className="text-pink-400">Female LFPR: {item.female}%</p>
										<p className="text-muted-foreground">Gender Gap: {item.gap.toFixed(1)}%</p>
									</div>
								</div>
							);
						}
						return null;
					}}
				/>
				<Legend wrapperStyle={{ color: "#9ca3af" }} />
				<Bar dataKey="male" name="Male LFPR" fill="#3b82f6" radius={[4, 4, 0, 0]} />
				<Bar dataKey="female" name="Female LFPR" fill="#ec4899" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
