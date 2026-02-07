"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { stateData } from "@/data/plfs-data";
import type { AreaType } from "@/types/employment";

interface FiltersProps {
	selectedState: string;
	onStateChange: (state: string) => void;
	areaType: AreaType;
	onAreaTypeChange: (type: AreaType) => void;
	timePeriod: string;
	onTimePeriodChange: (period: string) => void;
}

export function Filters({
	selectedState,
	onStateChange,
	areaType,
	onAreaTypeChange,
	timePeriod,
	onTimePeriodChange,
}: FiltersProps) {
	return (
		<div className="flex flex-wrap gap-4">
			<div className="flex flex-col gap-1.5">
				<label className="text-sm text-muted-foreground" htmlFor="state-select">
					State/UT
				</label>
				<Select value={selectedState} onValueChange={onStateChange}>
					<SelectTrigger id="state-select" className="w-[200px]">
						<SelectValue placeholder="All States" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All States</SelectItem>
						{stateData.map((state) => (
							<SelectItem key={state.stateCode} value={state.stateCode}>
								{state.stateName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="text-sm text-muted-foreground" htmlFor="area-select">
					Area Type
				</label>
				<Select value={areaType} onValueChange={(v) => onAreaTypeChange(v as AreaType)}>
					<SelectTrigger id="area-select" className="w-[150px]">
						<SelectValue placeholder="All Areas" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Areas</SelectItem>
						<SelectItem value="urban">Urban</SelectItem>
						<SelectItem value="rural">Rural</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="text-sm text-muted-foreground" htmlFor="period-select">
					Time Period
				</label>
				<Select value={timePeriod} onValueChange={onTimePeriodChange}>
					<SelectTrigger id="period-select" className="w-[180px]">
						<SelectValue placeholder="Select Period" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Q4-2024">Q4 2024 (Oct-Dec)</SelectItem>
						<SelectItem value="Q3-2024">Q3 2024 (Jul-Sep)</SelectItem>
						<SelectItem value="Q2-2024">Q2 2024 (Apr-Jun)</SelectItem>
						<SelectItem value="Q1-2024">Q1 2024 (Jan-Mar)</SelectItem>
						<SelectItem value="Annual-2023">Annual 2023</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
