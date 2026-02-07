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
		name: state.stateName.length > 12 ? `${state.stateName.slice(0, 10)}...` : state.stateName,
		fullName: state.stateName,
		stateCode: state.stateCode,
		value: state.unemploymentRate,
		color: getUnemploymentColor(state.unemploymentRate),
	}));

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
				<CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
				<XAxis
					type="number"
					domain={[0, "dataMax + 1"]}
					tickFormatter={(v) => `${v}%`}
					tick={{ fill: "#9ca3af", fontSize: 12 }}
					axisLine={{ stroke: "#4b5563" }}
				/>
				<YAxis
					type="category"
					dataKey="name"
					width={100}
					tick={{ fill: "#9ca3af", fontSize: 11 }}
					axisLine={{ stroke: "#4b5563" }}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							const item = payload[0].payload;
							return (
								<div className="bg-background border border-border rounded-lg shadow-lg p-3">
									<p className="font-semibold text-sm">{item.fullName}</p>
									<p className="text-sm text-muted-foreground">
										Unemployment: <span className="font-medium text-foreground">{item.value}%</span>
									</p>
								</div>
							);
						}
						return null;
					}}
				/>
				<Bar
					dataKey="value"
					radius={[0, 4, 4, 0]}
					cursor="pointer"
					onClick={(data) => {
						const item = data as unknown as { stateCode: string };
						onStateClick?.(item.stateCode);
					}}
				>
					{chartData.map((entry) => (
						<Cell key={entry.stateCode} fill={entry.color} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
}
