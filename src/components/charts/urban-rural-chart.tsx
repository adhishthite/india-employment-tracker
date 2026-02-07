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

interface UrbanRuralChartProps {
	data: StateEmploymentData[];
	maxItems?: number;
}

export function UrbanRuralChart({ data, maxItems = 10 }: UrbanRuralChartProps) {
	const sortedData = [...data]
		.filter((s) => s.urbanUnemploymentRate > 0 && s.ruralUnemploymentRate > 0)
		.sort(
			(a, b) =>
				Math.abs(b.urbanUnemploymentRate - b.ruralUnemploymentRate) -
				Math.abs(a.urbanUnemploymentRate - a.ruralUnemploymentRate),
		)
		.slice(0, maxItems)
		.map((state) => ({
			name: state.stateName.length > 14 ? `${state.stateName.slice(0, 12)}...` : state.stateName,
			fullName: state.stateName,
			stateCode: state.stateCode,
			urban: state.urbanUnemploymentRate,
			rural: state.ruralUnemploymentRate,
			gap: state.urbanUnemploymentRate - state.ruralUnemploymentRate,
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
					domain={[0, "dataMax + 2"]}
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
											<span className="text-orange-400">Urban UR</span>
											<span className="font-semibold tabular-nums text-foreground">
												{item.urban}%
											</span>
										</div>
										<div className="flex justify-between gap-3">
											<span className="text-emerald-400">Rural UR</span>
											<span className="font-semibold tabular-nums text-foreground">
												{item.rural}%
											</span>
										</div>
										<div className="flex justify-between gap-3 pt-0.5 border-t border-border/30">
											<span className="text-muted-foreground">Difference</span>
											<span className="font-semibold tabular-nums text-foreground">
												{item.gap > 0 ? "+" : ""}
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
					dataKey="urban"
					name="Urban UR"
					fill="#fb923c"
					radius={[4, 4, 0, 0]}
					animationDuration={800}
				/>
				<Bar
					dataKey="rural"
					name="Rural UR"
					fill="#34d399"
					radius={[4, 4, 0, 0]}
					animationDuration={800}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}
