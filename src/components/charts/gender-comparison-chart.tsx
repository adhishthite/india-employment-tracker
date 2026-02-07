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
import {
	ChartTooltip,
	chartAxisStyle,
	chartGridStyle,
	chartTickSmall,
	chartTickStyle,
} from "./chart-theme";

interface GenderComparisonChartProps {
	data: StateEmploymentData[];
	maxItems?: number;
}

export function GenderComparisonChart({ data, maxItems = 10 }: GenderComparisonChartProps) {
	const sortedData = [...data]
		.sort((a, b) => b.lfpr - a.lfpr)
		.slice(0, maxItems)
		.map((state) => ({
			name: state.stateName.length > 14 ? `${state.stateName.slice(0, 12)}...` : state.stateName,
			fullName: state.stateName,
			stateCode: state.stateCode,
			male: state.maleLfpr,
			female: state.femaleLfpr,
			gap: state.maleLfpr - state.femaleLfpr,
		}));

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={sortedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" stroke={chartGridStyle} />
				<XAxis
					dataKey="name"
					tick={chartTickSmall}
					axisLine={{ stroke: chartAxisStyle }}
					tickLine={false}
					angle={-45}
					textAnchor="end"
					height={70}
				/>
				<YAxis
					tick={chartTickStyle}
					axisLine={false}
					tickLine={false}
					tickFormatter={(v) => `${v}%`}
					domain={[0, 100]}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const item = payload[0].payload;
							return (
								<ChartTooltip>
									<p className="font-semibold text-sm text-foreground mb-1">{item.fullName}</p>
									<div className="space-y-0.5">
										<div className="flex justify-between gap-3">
											<span className="text-blue-400">Male LFPR</span>
											<span className="font-semibold tabular-nums text-foreground">
												{item.male}%
											</span>
										</div>
										<div className="flex justify-between gap-3">
											<span className="text-pink-400">Female LFPR</span>
											<span className="font-semibold tabular-nums text-foreground">
												{item.female}%
											</span>
										</div>
										<div className="flex justify-between gap-3 pt-0.5 border-t border-border/30">
											<span className="text-muted-foreground">Gender Gap</span>
											<span className="font-semibold tabular-nums text-foreground">
												{item.gap.toFixed(1)}%
											</span>
										</div>
									</div>
								</ChartTooltip>
							);
						}
						return null;
					}}
				/>
				<Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
				<Bar
					dataKey="male"
					name="Male LFPR"
					fill="#60a5fa"
					radius={[4, 4, 0, 0]}
					animationDuration={800}
				/>
				<Bar
					dataKey="female"
					name="Female LFPR"
					fill="#f472b6"
					radius={[4, 4, 0, 0]}
					animationDuration={800}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}
