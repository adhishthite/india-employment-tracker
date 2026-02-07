"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { getUnemploymentColor } from "@/data/plfs-data";
import type { StateEmploymentData } from "@/types/employment";
import { ChartTooltip, chartAxisStyle, chartGridStyle, chartTickStyle } from "./chart-theme";

interface UnemploymentBarChartProps {
	data: StateEmploymentData[];
	maxItems?: number;
	sortOrder?: "asc" | "desc";
	onStateClick?: (stateCode: string) => void;
}

export function UnemploymentBarChart({
	data,
	maxItems = 10,
	sortOrder = "desc",
	onStateClick,
}: UnemploymentBarChartProps) {
	const sortedData = [...data]
		.sort((a, b) =>
			sortOrder === "desc"
				? b.unemploymentRate - a.unemploymentRate
				: a.unemploymentRate - b.unemploymentRate,
		)
		.slice(0, maxItems);

	const chartData = sortedData.map((state) => ({
		name: state.stateName.length > 14 ? `${state.stateName.slice(0, 12)}...` : state.stateName,
		fullName: state.stateName,
		stateCode: state.stateCode,
		value: state.unemploymentRate,
		color: getUnemploymentColor(state.unemploymentRate),
	}));

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
				<CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke={chartGridStyle} />
				<XAxis
					type="number"
					domain={[0, "dataMax + 1"]}
					tickFormatter={(v) => `${v}%`}
					tick={chartTickStyle}
					axisLine={{ stroke: chartAxisStyle }}
					tickLine={false}
				/>
				<YAxis
					type="category"
					dataKey="name"
					width={105}
					tick={chartTickStyle}
					axisLine={false}
					tickLine={false}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const item = payload[0].payload;
							return (
								<ChartTooltip>
									<p className="font-semibold text-sm text-foreground">{item.fullName}</p>
									<p className="text-muted-foreground mt-0.5">
										Unemployment:{" "}
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
				<Bar
					dataKey="value"
					radius={[0, 6, 6, 0]}
					cursor="pointer"
					animationDuration={800}
					animationEasing="ease-out"
					onClick={(data) => {
						const item = data as unknown as { stateCode: string };
						onStateClick?.(item.stateCode);
					}}
				>
					{chartData.map((entry) => (
						<Cell key={entry.stateCode} fill={entry.color} fillOpacity={0.85} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
}
