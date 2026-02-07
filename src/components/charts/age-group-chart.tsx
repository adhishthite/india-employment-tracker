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
			<BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
				<XAxis
					dataKey="name"
					tick={{ fill: "#9ca3af", fontSize: 12 }}
					axisLine={{ stroke: "#4b5563" }}
				/>
				<YAxis
					tick={{ fill: "#9ca3af", fontSize: 12 }}
					axisLine={{ stroke: "#4b5563" }}
					tickFormatter={(v) => `${v}%`}
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
				{showGender ? (
					<>
						<Bar
							dataKey="maleUnemploymentRate"
							name="Male UR"
							fill="#3b82f6"
							radius={[4, 4, 0, 0]}
						/>
						<Bar
							dataKey="femaleUnemploymentRate"
							name="Female UR"
							fill="#ec4899"
							radius={[4, 4, 0, 0]}
						/>
					</>
				) : (
					<>
						<Bar
							dataKey="unemploymentRate"
							name="Unemployment Rate"
							fill="#ef4444"
							radius={[4, 4, 0, 0]}
						/>
						<Bar dataKey="lfpr" name="LFPR" fill="#3b82f6" radius={[4, 4, 0, 0]} />
					</>
				)}
			</BarChart>
		</ResponsiveContainer>
	);
}
