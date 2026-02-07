"use client";

import { useCallback, useRef, useState } from "react";
import { getUnemploymentColor } from "@/data/plfs-data";
import type { StateEmploymentData } from "@/types/employment";

interface IndiaMapProps {
	data: StateEmploymentData[];
	onStateClick?: (stateCode: string) => void;
	selectedStates?: string[];
	metric?: "unemploymentRate" | "lfpr" | "wpr";
}

// State paths for India map SVG
const STATE_PATHS: Record<string, { path: string; name: string; labelX: number; labelY: number }> =
	{
		JK: {
			name: "Jammu & Kashmir",
			labelX: 140,
			labelY: 60,
			path: "M110,20 L170,25 L180,50 L175,80 L150,95 L120,85 L100,60 L105,35 Z",
		},
		LA: {
			name: "Ladakh",
			labelX: 200,
			labelY: 40,
			path: "M180,10 L240,15 L250,45 L230,65 L180,50 L170,25 Z",
		},
		HP: {
			name: "Himachal Pradesh",
			labelX: 160,
			labelY: 105,
			path: "M150,95 L190,90 L200,110 L180,130 L150,125 L140,105 Z",
		},
		PB: {
			name: "Punjab",
			labelX: 125,
			labelY: 130,
			path: "M100,110 L150,110 L155,140 L130,155 L100,145 Z",
		},
		UT: {
			name: "Uttarakhand",
			labelX: 200,
			labelY: 140,
			path: "M180,120 L220,115 L235,140 L220,165 L190,160 L175,140 Z",
		},
		HR: {
			name: "Haryana",
			labelX: 140,
			labelY: 165,
			path: "M115,145 L160,145 L175,175 L155,195 L120,185 L110,160 Z",
		},
		DL: {
			name: "Delhi",
			labelX: 155,
			labelY: 185,
			path: "M150,180 L165,180 L168,195 L153,198 Z",
		},
		RJ: {
			name: "Rajasthan",
			labelX: 95,
			labelY: 230,
			path: "M40,170 L115,165 L140,200 L135,265 L100,300 L40,280 L25,220 Z",
		},
		UP: {
			name: "Uttar Pradesh",
			labelX: 215,
			labelY: 220,
			path: "M155,185 L235,160 L290,200 L280,255 L220,280 L165,260 L150,220 Z",
		},
		BR: {
			name: "Bihar",
			labelX: 305,
			labelY: 240,
			path: "M280,220 L330,215 L345,245 L330,275 L285,270 L280,240 Z",
		},
		SK: {
			name: "Sikkim",
			labelX: 340,
			labelY: 200,
			path: "M335,190 L355,188 L360,210 L345,215 L335,205 Z",
		},
		AR: {
			name: "Arunachal Pradesh",
			labelX: 410,
			labelY: 185,
			path: "M370,160 L450,155 L465,190 L430,210 L375,200 Z",
		},
		NL: {
			name: "Nagaland",
			labelX: 445,
			labelY: 225,
			path: "M430,210 L460,205 L465,235 L445,245 L425,235 Z",
		},
		MN: {
			name: "Manipur",
			labelX: 445,
			labelY: 260,
			path: "M425,245 L455,245 L460,275 L440,290 L420,275 Z",
		},
		MZ: {
			name: "Mizoram",
			labelX: 430,
			labelY: 305,
			path: "M415,285 L445,285 L450,330 L425,345 L410,320 Z",
		},
		TR: {
			name: "Tripura",
			labelX: 400,
			labelY: 295,
			path: "M390,280 L415,280 L420,310 L400,325 L385,305 Z",
		},
		ML: {
			name: "Meghalaya",
			labelX: 385,
			labelY: 250,
			path: "M360,240 L410,235 L420,255 L400,270 L355,265 Z",
		},
		AS: {
			name: "Assam",
			labelX: 385,
			labelY: 220,
			path: "M345,200 L430,190 L450,205 L440,230 L410,235 L355,240 L340,220 Z",
		},
		WB: {
			name: "West Bengal",
			labelX: 345,
			labelY: 285,
			path: "M330,245 L365,240 L380,280 L370,340 L340,350 L320,310 L325,270 Z",
		},
		JH: {
			name: "Jharkhand",
			labelX: 305,
			labelY: 285,
			path: "M280,260 L330,255 L340,290 L315,320 L275,305 Z",
		},
		OR: {
			name: "Odisha",
			labelX: 300,
			labelY: 340,
			path: "M270,305 L340,290 L365,340 L345,395 L280,400 L255,355 Z",
		},
		CT: {
			name: "Chhattisgarh",
			labelX: 245,
			labelY: 320,
			path: "M215,280 L280,285 L290,340 L265,385 L210,370 L200,320 Z",
		},
		MP: {
			name: "Madhya Pradesh",
			labelX: 185,
			labelY: 290,
			path: "M130,260 L225,255 L235,320 L210,365 L130,355 L100,300 Z",
		},
		GJ: {
			name: "Gujarat",
			labelX: 70,
			labelY: 320,
			path: "M20,280 L100,290 L110,350 L75,400 L20,395 L5,340 Z",
		},
		MH: {
			name: "Maharashtra",
			labelX: 140,
			labelY: 390,
			path: "M75,355 L210,350 L240,385 L230,450 L130,470 L60,420 Z",
		},
		TG: {
			name: "Telangana",
			labelX: 220,
			labelY: 415,
			path: "M200,380 L270,375 L285,420 L255,455 L195,445 Z",
		},
		AP: {
			name: "Andhra Pradesh",
			labelX: 235,
			labelY: 475,
			path: "M190,445 L285,420 L320,480 L290,540 L220,545 L175,490 Z",
		},
		KA: {
			name: "Karnataka",
			labelX: 155,
			labelY: 490,
			path: "M100,445 L200,440 L215,510 L180,570 L100,560 L80,490 Z",
		},
		GA: {
			name: "Goa",
			labelX: 95,
			labelY: 515,
			path: "M85,505 L105,500 L110,525 L90,535 Z",
		},
		KL: {
			name: "Kerala",
			labelX: 130,
			labelY: 580,
			path: "M100,545 L145,540 L160,615 L130,650 L105,620 L95,570 Z",
		},
		TN: {
			name: "Tamil Nadu",
			labelX: 185,
			labelY: 570,
			path: "M145,535 L225,530 L250,590 L220,650 L160,640 L140,580 Z",
		},
		AN: {
			name: "Andaman & Nicobar",
			labelX: 420,
			labelY: 480,
			path: "M410,430 L430,425 L435,490 L420,550 L405,545 L400,480 Z",
		},
		LD: {
			name: "Lakshadweep",
			labelX: 50,
			labelY: 560,
			path: "M35,545 L55,540 L60,570 L45,580 L30,565 Z",
		},
		PY: {
			name: "Puducherry",
			labelX: 215,
			labelY: 550,
			path: "M205,545 L220,542 L225,560 L210,565 Z",
		},
		CH: {
			name: "Chandigarh",
			labelX: 150,
			labelY: 140,
			path: "M145,135 L155,133 L158,145 L148,148 Z",
		},
		DN: {
			name: "Dadra & Nagar Haveli",
			labelX: 75,
			labelY: 420,
			path: "M65,410 L85,405 L90,430 L70,435 Z",
		},
		DD: {
			name: "Daman & Diu",
			labelX: 55,
			labelY: 400,
			path: "M45,390 L65,385 L70,405 L50,410 Z",
		},
	};

export function IndiaMap({
	data,
	onStateClick,
	selectedStates = [],
	metric = "unemploymentRate",
}: IndiaMapProps) {
	const [hoveredState, setHoveredState] = useState<string | null>(null);
	const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	const getMetricValue = useCallback(
		(stateCode: string): number => {
			const state = data.find((s) => s.stateCode === stateCode);
			if (!state) return 0;
			return state[metric];
		},
		[data, metric],
	);

	const getStateColor = useCallback(
		(stateCode: string): string => {
			const value = getMetricValue(stateCode);
			if (metric === "unemploymentRate") {
				return getUnemploymentColor(value);
			}
			if (value >= 60) return "#22c55e";
			if (value >= 55) return "#84cc16";
			if (value >= 50) return "#eab308";
			if (value >= 45) return "#f97316";
			return "#ef4444";
		},
		[getMetricValue, metric],
	);

	const getStateName = (stateCode: string): string => {
		return STATE_PATHS[stateCode]?.name || stateCode;
	};

	const handleMouseMove = (e: React.MouseEvent, stateCode: string) => {
		setHoveredState(stateCode);
		const container = containerRef.current;
		if (container) {
			const rect = container.getBoundingClientRect();
			setTooltipPos({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	};

	const handleMouseLeave = () => {
		setHoveredState(null);
	};

	const hoveredStateData = hoveredState ? data.find((s) => s.stateCode === hoveredState) : null;

	const metricLabel =
		metric === "unemploymentRate" ? "Unemployment Rate" : metric === "lfpr" ? "LFPR" : "WPR";

	return (
		<div ref={containerRef} className="relative w-full h-full min-h-[500px]">
			<svg viewBox="0 0 480 680" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
				<title>India Employment Map</title>
				<defs>
					<filter id="state-glow">
						<feGaussianBlur stdDeviation="3" result="coloredBlur" />
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<filter id="state-shadow">
						<feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
					</filter>
				</defs>
				{Object.entries(STATE_PATHS).map(([code, { path }]) => {
					const isSelected = selectedStates.includes(code);
					const isHovered = hoveredState === code;
					const stateExists = data.some((s) => s.stateCode === code);
					const fillColor = stateExists ? getStateColor(code) : "oklch(0.3 0 0)";

					return (
						<path
							key={code}
							d={path}
							fill={fillColor}
							stroke={
								isSelected ? "#818cf8" : isHovered ? "oklch(0.9 0 0)" : "oklch(0.4 0.01 260 / 30%)"
							}
							strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.5}
							className="cursor-pointer"
							style={{
								transition: "all 0.2s ease-out",
								filter: isSelected || isHovered ? "url(#state-shadow)" : undefined,
								opacity: selectedStates.length > 0 && !isSelected && !isHovered ? 0.45 : 1,
								transform: isHovered ? "scale(1.01)" : undefined,
								transformOrigin: "center",
							}}
							onMouseMove={(e) => handleMouseMove(e, code)}
							onMouseLeave={handleMouseLeave}
							onClick={() => onStateClick?.(code)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									onStateClick?.(code);
								}
							}}
							role="button"
							tabIndex={0}
							aria-label={`${STATE_PATHS[code]?.name || code} state`}
						/>
					);
				})}
			</svg>

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
						<p className="font-semibold text-sm">{getStateName(hoveredState)}</p>
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
					<span>{metric === "unemploymentRate" ? "Low" : "Low"}</span>
					<span>{metric === "unemploymentRate" ? "High" : "High"}</span>
				</div>
			</div>
		</div>
	);
}
