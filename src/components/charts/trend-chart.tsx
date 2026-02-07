"use client";

import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { TrendData } from "@/types/employment";

interface TrendChartProps {
	data: TrendData[];
	showUrbanRural?: boolean;
}

export function TrendChart({ data, showUrbanRural = false }: TrendChartProps) {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
				<XAxis
					dataKey="period"
					tick={{ fill: "#9ca3af", fontSize: 11 }}
					axisLine={{ stroke: "#4b5563" }}
					angle={-45}
					textAnchor="end"
					height={60}
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
					labelStyle={{ color: "hsl(var(--foreground))" }}
					formatter={(value) => [`${value}%`, ""]}
				/>
				<Legend wrapperStyle={{ color: "#9ca3af" }} />
				{showUrbanRural ? (
					<>
						<Line
							type="monotone"
							dataKey="urbanUR"
							name="Urban"
							stroke="#f97316"
							strokeWidth={2}
							dot={{ fill: "#f97316", r: 3 }}
							activeDot={{ r: 5 }}
						/>
						<Line
							type="monotone"
							dataKey="ruralUR"
							name="Rural"
							stroke="#22c55e"
							strokeWidth={2}
							dot={{ fill: "#22c55e", r: 3 }}
							activeDot={{ r: 5 }}
						/>
					</>
				) : (
					<>
						<Line
							type="monotone"
							dataKey="unemploymentRate"
							name="Unemployment Rate"
							stroke="#ef4444"
							strokeWidth={2}
							dot={{ fill: "#ef4444", r: 3 }}
							activeDot={{ r: 5 }}
						/>
						<Line
							type="monotone"
							dataKey="lfpr"
							name="LFPR"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ fill: "#3b82f6", r: 3 }}
							activeDot={{ r: 5 }}
						/>
						<Line
							type="monotone"
							dataKey="wpr"
							name="WPR"
							stroke="#22c55e"
							strokeWidth={2}
							dot={{ fill: "#22c55e", r: 3 }}
							activeDot={{ r: 5 }}
						/>
					</>
				)}
			</LineChart>
		</ResponsiveContainer>
	);
}
