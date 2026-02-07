"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { getUnemploymentColor } from "@/data/plfs-data";
import type { StateEmploymentData } from "@/types/employment";

interface IndiaMapProps {
	data: StateEmploymentData[];
	onStateClick?: (stateCode: string) => void;
	selectedStates?: string[];
	metric?: "unemploymentRate" | "lfpr" | "wpr";
}

// GeoJSON ST_NM -> app state code mapping
const GEO_NAME_TO_CODE: Record<string, string> = {
	"Jammu & Kashmir": "JK",
	Ladakh: "LA",
	"Himachal Pradesh": "HP",
	Punjab: "PB",
	Uttarakhand: "UT",
	Haryana: "HR",
	Delhi: "DL",
	Rajasthan: "RJ",
	"Uttar Pradesh": "UP",
	Bihar: "BR",
	Sikkim: "SK",
	"Arunachal Pradesh": "AR",
	Nagaland: "NL",
	Manipur: "MN",
	Mizoram: "MZ",
	Tripura: "TR",
	Meghalaya: "ML",
	Assam: "AS",
	"West Bengal": "WB",
	Jharkhand: "JH",
	Odisha: "OR",
	Chhattisgarh: "CT",
	"Madhya Pradesh": "MP",
	Gujarat: "GJ",
	Maharashtra: "MH",
	Telangana: "TG",
	"Andhra Pradesh": "AP",
	Karnataka: "KA",
	Goa: "GA",
	Kerala: "KL",
	"Tamil Nadu": "TN",
	"Andaman & Nicobar": "AN",
	Lakshadweep: "LD",
	Puducherry: "PY",
	Chandigarh: "CH",
	// Merged UT: maps to DN (Dadra & Nagar Haveli was merged with Daman & Diu in 2020)
	"Dadra and Nagar Haveli and Daman and Diu": "DN",
};

const TOPO_URL = "/india-states-topo.json";

function getLfprWprColor(value: number): string {
	if (value >= 60) return "#22c55e";
	if (value >= 55) return "#84cc16";
	if (value >= 50) return "#eab308";
	if (value >= 45) return "#f97316";
	return "#ef4444";
}

export function IndiaMap({
	data,
	onStateClick,
	selectedStates = [],
	metric = "unemploymentRate",
}: IndiaMapProps) {
	const [hoveredState, setHoveredState] = useState<string | null>(null);
	const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	const dataByCode = useMemo(() => {
		const map = new Map<string, StateEmploymentData>();
		for (const s of data) {
			map.set(s.stateCode, s);
		}
		return map;
	}, [data]);

	const getStateColor = useCallback(
		(stateCode: string): string => {
			const state = dataByCode.get(stateCode);
			if (!state) return "oklch(0.3 0 0)";
			const value = state[metric];
			if (metric === "unemploymentRate") {
				return getUnemploymentColor(value);
			}
			return getLfprWprColor(value);
		},
		[dataByCode, metric],
	);

	const handleMouseMove = useCallback((e: React.MouseEvent, stateCode: string) => {
		setHoveredState(stateCode);
		const container = containerRef.current;
		if (container) {
			const rect = container.getBoundingClientRect();
			setTooltipPos({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	}, []);

	const handleMouseLeave = useCallback(() => {
		setHoveredState(null);
	}, []);

	const hoveredStateData = hoveredState ? dataByCode.get(hoveredState) : null;

	const metricLabel =
		metric === "unemploymentRate" ? "Unemployment Rate" : metric === "lfpr" ? "LFPR" : "WPR";

	return (
		<div ref={containerRef} className="relative w-full h-full min-h-[500px]">
			<ComposableMap
				projection="geoMercator"
				projectionConfig={{
					center: [82, 22],
					scale: 1000,
				}}
				width={480}
				height={560}
				style={{ width: "100%", height: "100%" }}
			>
				<ZoomableGroup>
					<Geographies geography={TOPO_URL}>
						{({ geographies }) =>
							geographies.map((geo) => {
								const geoName: string = geo.properties.ST_NM ?? "";
								const code = GEO_NAME_TO_CODE[geoName];
								if (!code) return null;

								const isSelected = selectedStates.includes(code);
								const isHovered = hoveredState === code;
								const fillColor = getStateColor(code);

								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={fillColor}
										stroke={
											isSelected
												? "#818cf8"
												: isHovered
													? "oklch(0.9 0 0)"
													: "oklch(0.4 0.01 260 / 50%)"
										}
										strokeWidth={isSelected ? 1.5 : isHovered ? 1 : 0.4}
										className="cursor-pointer outline-none"
										style={{
											default: {
												opacity: selectedStates.length > 0 && !isSelected && !isHovered ? 0.45 : 1,
												transition: "all 0.2s ease-out",
											},
											hover: {
												opacity: 1,
												filter: "brightness(1.15)",
												transition: "all 0.15s ease-out",
											},
											pressed: {
												opacity: 1,
											},
										}}
										onMouseMove={(e: React.MouseEvent) => handleMouseMove(e, code)}
										onMouseLeave={handleMouseLeave}
										onClick={() => onStateClick?.(code)}
										onKeyDown={(e: React.KeyboardEvent) => {
											if (e.key === "Enter" || e.key === " ") {
												onStateClick?.(code);
											}
										}}
										tabIndex={0}
										role="button"
										aria-label={`${geoName} state`}
									/>
								);
							})
						}
					</Geographies>
				</ZoomableGroup>
			</ComposableMap>

			{/* Tooltip */}
			{hoveredState && hoveredStateData && (
				<div
					className="absolute z-50 bg-card/95 glass-effect border border-border/50 rounded-xl shadow-xl p-3 pointer-events-none"
					style={{
						left: Math.min(tooltipPos.x + 12, (containerRef.current?.clientWidth ?? 400) - 200),
						top: tooltipPos.y + 12,
					}}
				>
					<div className="flex items-center gap-2 mb-1.5">
						<div
							className="w-2.5 h-2.5 rounded-full"
							style={{ backgroundColor: getStateColor(hoveredState) }}
						/>
						<p className="font-semibold text-sm">{hoveredStateData.stateName}</p>
					</div>
					<div className="text-xs space-y-1 text-muted-foreground">
						<div className="flex justify-between gap-4">
							<span>Unemployment Rate</span>
							<span className="font-semibold text-foreground tabular-nums">
								{hoveredStateData.unemploymentRate}%
							</span>
						</div>
						<div className="flex justify-between gap-4">
							<span>LFPR</span>
							<span className="font-semibold text-foreground tabular-nums">
								{hoveredStateData.lfpr}%
							</span>
						</div>
						<div className="flex justify-between gap-4">
							<span>WPR</span>
							<span className="font-semibold text-foreground tabular-nums">
								{hoveredStateData.wpr}%
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Legend */}
			<div className="absolute bottom-3 left-3 bg-card/90 glass-effect border border-border/40 rounded-lg px-3 py-2.5">
				<p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
					{metricLabel}
				</p>
				<div className="flex items-center gap-0.5">
					{metric === "unemploymentRate"
						? ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"].map((color, i) => (
								<div
									key={color}
									className="h-2 flex-1 min-w-[24px]"
									style={{
										backgroundColor: color,
										borderRadius: i === 0 ? "2px 0 0 2px" : i === 4 ? "0 2px 2px 0" : "0",
									}}
								/>
							))
						: ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"].map((color, i) => (
								<div
									key={color}
									className="h-2 flex-1 min-w-[24px]"
									style={{
										backgroundColor: color,
										borderRadius: i === 0 ? "2px 0 0 2px" : i === 4 ? "0 2px 2px 0" : "0",
									}}
								/>
							))}
				</div>
				<div className="flex justify-between text-[9px] text-muted-foreground/70 mt-0.5">
					<span>Low</span>
					<span>High</span>
				</div>
			</div>
		</div>
	);
}
