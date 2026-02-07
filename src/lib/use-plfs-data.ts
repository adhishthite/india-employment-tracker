"use client";

import { useCallback, useEffect, useState } from "react";
import type {
	AgeGroupData,
	NationalSummary,
	SectorData,
	StateEmploymentData,
	TrendData,
} from "@/types/employment";

interface DashboardData {
	nationalSummary: NationalSummary;
	stateData: StateEmploymentData[];
	ageGroupData: AgeGroupData[];
	sectorData: SectorData[];
	trendData: TrendData[];
}

interface UsePLFSDataResult {
	data: DashboardData | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function usePLFSData(): UsePLFSDataResult {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/plfs");
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? `HTTP ${res.status}: Failed to fetch data`);
			}
			const json: DashboardData = await res.json();
			setData(json);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to fetch data";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
