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
import type { AgeGroupData } from "@/types/employment";
import { ChartTooltip, chartAxisStyle, chartGridStyle, chartTickStyle } from "./chart-theme";

interface AgeGroupChartProps {
	data: AgeGroupData[];
	showGender?: boolean;
}

export function AgeGroupChart({ data, showGender = false }: AgeGroupChartProps) {
	const chartData = data.map((item) => ({
		...item,
		name: item.ageGroup,
	}));

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" stroke={chartGridStyle} />
				<XAxis
					dataKey="name"
					tick={chartTickStyle}
					axisLine={{ stroke: chartAxisStyle }}
					tickLine={false}
				/>
				<YAxis
					tick={chartTickStyle}
					axisLine={false}
					tickLine={false}
					tickFormatter={(v) => `${v}%`}
				/>
				<Tooltip
					content={({ active, payload, label }) => {
						if (active && payload && payload.length) {
							return (
								<ChartTooltip>
									<p className="font-semibold text-foreground mb-1">{label}</p>
									{payload.map((entry) => (
										<div key={entry.dataKey as string} className="flex justify-between gap-3">
											<span className="text-muted-foreground">{entry.name}</span>
											<span className="font-semibold tabular-nums" style={{ color: entry.color }}>
												{entry.value}%
											</span>
										</div>
									))}
								</ChartTooltip>
							);
						}
						return null;
					}}
				/>
				<Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
				{showGender ? (
					<>
						<Bar
							dataKey="maleUnemploymentRate"
							name="Male UR"
							fill="#60a5fa"
							radius={[4, 4, 0, 0]}
							animationDuration={800}
						/>
						<Bar
							dataKey="femaleUnemploymentRate"
							name="Female UR"
							fill="#f472b6"
							radius={[4, 4, 0, 0]}
							animationDuration={800}
						/>
					</>
				) : (
					<>
						<Bar
							dataKey="unemploymentRate"
							name="Unemployment Rate"
							fill="#f87171"
							radius={[4, 4, 0, 0]}
							animationDuration={800}
						/>
						<Bar
							dataKey="lfpr"
							name="LFPR"
							fill="#60a5fa"
							radius={[4, 4, 0, 0]}
							animationDuration={800}
						/>
					</>
				)}
			</BarChart>
		</ResponsiveContainer>
	);
}
