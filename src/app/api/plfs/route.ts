import { NextResponse } from "next/server";
import { fetchAllDashboardData } from "@/lib/data-fetchers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	try {
		const data = await fetchAllDashboardData();
		return NextResponse.json(data, {
			headers: {
				"Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
			},
		});
	} catch (error) {
		console.error("Failed to fetch PLFS data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch data from MoSPI. Data temporarily unavailable." },
			{ status: 503 },
		);
	}
}
