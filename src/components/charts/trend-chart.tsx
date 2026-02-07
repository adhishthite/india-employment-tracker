"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { TrendData } from "@/types/employment";
import {
	ChartTooltip,
	chartAxisStyle,
	chartGridStyle,
	chartTickSmall,
	chartTickStyle,
} from "./chart-theme";

interface TrendChartProps {
	data: TrendData[];
	showUrbanRural?: boolean;
}

export function TrendChart({ data, showUrbanRural = false }: TrendChartProps) {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
				<defs>
					<linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
						<stop offset="95%" stopColor="#f87171" stopOpacity={0} />
					</linearGradient>
					<linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
						<stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
					</linearGradient>
					<linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
						<stop offset="95%" stopColor="#34d399" stopOpacity={0} />
					</linearGradient>
					<linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
						<stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" stroke={chartGridStyle} />
				<XAxis
					dataKey="period"
					tick={chartTickSmall}
					axisLine={{ stroke: chartAxisStyle }}
					tickLine={false}
					angle={-45}
					textAnchor="end"
					height={60}
				/>
				<YAxis
					tick={chartTickStyle}
					axisLine={false}
					tickLine={false}
					tickFormatter={(v) => `${v}%`}
					domain={[0, "dataMax + 2"]}
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
				{showUrbanRural ? (
					<>
						<Area
							type="monotone"
							dataKey="urbanUR"
							name="Urban"
							stroke="#fb923c"
							strokeWidth={2}
							fill="url(#gradOrange)"
							dot={{ fill: "#fb923c", r: 2.5, strokeWidth: 0 }}
							activeDot={{ r: 5, stroke: "#fb923c", strokeWidth: 2, fill: "var(--background)" }}
							animationDuration={1000}
						/>
						<Area
							type="monotone"
							dataKey="ruralUR"
							name="Rural"
							stroke="#34d399"
							strokeWidth={2}
							fill="url(#gradGreen)"
							dot={{ fill: "#34d399", r: 2.5, strokeWidth: 0 }}
							activeDot={{ r: 5, stroke: "#34d399", strokeWidth: 2, fill: "var(--background)" }}
							animationDuration={1000}
						/>
					</>
				) : (
					<>
						<Area
							type="monotone"
							dataKey="unemploymentRate"
							name="Unemployment Rate"
							stroke="#f87171"
							strokeWidth={2}
							fill="url(#gradRed)"
							dot={{ fill: "#f87171", r: 2.5, strokeWidth: 0 }}
							activeDot={{ r: 5, stroke: "#f87171", strokeWidth: 2, fill: "var(--background)" }}
							animationDuration={1000}
						/>
						<Area
							type="monotone"
							dataKey="lfpr"
							name="LFPR"
							stroke="#60a5fa"
							strokeWidth={2}
							fill="url(#gradBlue)"
							dot={{ fill: "#60a5fa", r: 2.5, strokeWidth: 0 }}
							activeDot={{ r: 5, stroke: "#60a5fa", strokeWidth: 2, fill: "var(--background)" }}
							animationDuration={1000}
						/>
						<Area
							type="monotone"
							dataKey="wpr"
							name="WPR"
							stroke="#34d399"
							strokeWidth={2}
							fill="url(#gradGreen)"
							dot={{ fill: "#34d399", r: 2.5, strokeWidth: 0 }}
							activeDot={{ r: 5, stroke: "#34d399", strokeWidth: 2, fill: "var(--background)" }}
							animationDuration={1000}
						/>
					</>
				)}
			</AreaChart>
		</ResponsiveContainer>
	);
}
