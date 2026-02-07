const MCP_URL = "https://mcp.mospi.gov.in/";

interface McpToolResult {
	content: { type: string; text: string }[];
	structuredContent?: Record<string, unknown>;
	isError?: boolean;
}

interface McpSession {
	sessionId: string;
	nextId: number;
}

/**
 * Parse SSE response body and extract the JSON-RPC result.
 * MoSPI returns `event: message\ndata: {json}\n\n` format.
 */
function parseSSE(raw: string): unknown {
	const lines = raw.split("\n");
	for (const line of lines) {
		if (line.startsWith("data: ")) {
			const json = line.slice(6);
			const parsed = JSON.parse(json);
			if (parsed.error) {
				throw new Error(`MCP error ${parsed.error.code}: ${parsed.error.message}`);
			}
			return parsed.result;
		}
	}
	throw new Error("No data line found in SSE response");
}

/**
 * Initialize an MCP session with the MoSPI server.
 */
async function initSession(): Promise<McpSession> {
	const res = await fetch(MCP_URL, {
		method: "POST",
		headers: {
			Accept: "text/event-stream, application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: "2024-11-05",
				capabilities: {},
				clientInfo: { name: "india-employment-tracker", version: "1.0.0" },
			},
		}),
	});

	if (!res.ok) {
		throw new Error(`MCP init failed: HTTP ${res.status}`);
	}

	const sessionId = res.headers.get("mcp-session-id");
	if (!sessionId) {
		throw new Error("No mcp-session-id header in init response");
	}

	// Consume the body to confirm success
	const body = await res.text();
	parseSSE(body);

	return { sessionId, nextId: 2 };
}

/**
 * Call an MCP tool on an existing session.
 */
async function callTool(
	session: McpSession,
	toolName: string,
	args: Record<string, unknown>,
): Promise<McpToolResult> {
	const id = session.nextId++;
	const res = await fetch(MCP_URL, {
		method: "POST",
		headers: {
			Accept: "text/event-stream, application/json",
			"Content-Type": "application/json",
			"mcp-session-id": session.sessionId,
		},
		body: JSON.stringify({
			jsonrpc: "2.0",
			id,
			method: "tools/call",
			params: { name: toolName, arguments: args },
		}),
	});

	if (!res.ok) {
		throw new Error(`MCP tool call failed: HTTP ${res.status}`);
	}

	const body = await res.text();
	const result = parseSSE(body) as McpToolResult;

	if (result.isError) {
		const errorText = result.content?.[0]?.text ?? "Unknown MCP tool error";
		throw new Error(`MCP tool error: ${errorText}`);
	}

	return result;
}

/**
 * Extract structured data from an MCP tool result.
 * The server returns data either in structuredContent or as JSON text in content[0].text.
 */
function extractData(result: McpToolResult): Record<string, unknown> {
	if (result.structuredContent) {
		return result.structuredContent;
	}
	if (result.content?.[0]?.text) {
		return JSON.parse(result.content[0].text);
	}
	throw new Error("No data in MCP tool result");
}

export interface PLFSRecord {
	year: string;
	frequency: string;
	indicator: string;
	state: string;
	gender: string;
	sector: string;
	AgeGroup: string;
	weekly_status: string;
	religion: string;
	socialGroup: string;
	General_Education: string;
	quarter: string;
	month: string | null;
	value: string;
	unit: string;
	// indicator 4 specific fields
	broad_industry_work?: string;
	broad_status_employment?: string;
	industry_section?: string;
	nic_group?: string;
	nco_division?: string;
	enterprise_type?: string;
	enterprise_size?: string;
}

export interface PLFSDataResponse {
	data: PLFSRecord[];
	meta_data: {
		page: number;
		totalRecords: number;
		totalPages: number;
		recordPerPage: number;
	};
	msg: string;
	statusCode: boolean;
}

export interface PLFSFilters {
	indicator_code: string;
	frequency_code: string;
	year?: string;
	state_code?: string;
	gender_code?: string;
	sector_code?: string;
	age_code?: string;
	weekly_status_code?: string;
	education_code?: string;
	religion_code?: string;
	social_category_code?: string;
	broad_industry_work_code?: string;
	broad_status_employment_code?: string;
	industry_section_code?: string;
	nic_group_code?: string;
	nco_division_code?: string;
	enterprise_type_code?: string;
	enterprise_size_code?: string;
	quarter_code?: string;
	limit?: string;
	page?: string;
	Format?: string;
}

/**
 * Full PLFS data fetch: init session, call tool 1 (overview), tool 4 (data).
 * Tools 2 and 3 are for interactive discovery - we already know the codes
 * from our exploration, so we skip them in production calls.
 *
 * The server requires the session to be initialized and tool 1 called
 * before tool 4. We comply with the mandatory workflow.
 */
export async function fetchPLFSData(filters: PLFSFilters): Promise<PLFSDataResponse> {
	const session = await initSession();

	// Step 1: mandatory overview call
	await callTool(session, "1_know_about_mospi_api", {});

	// Step 4: fetch actual data (tools 2/3 are for discovery, codes are known)
	const result = await callTool(session, "4_get_data", {
		dataset: "PLFS",
		filters: {
			...filters,
			Format: filters.Format ?? "JSON",
		},
	});

	const data = extractData(result) as unknown as PLFSDataResponse;

	if (!data.statusCode) {
		throw new Error(`PLFS data fetch failed: ${data.msg}`);
	}

	return data;
}

/**
 * Fetch all pages of PLFS data for a given filter set.
 * The API defaults to 10 records per page; we request larger pages
 * and iterate if needed.
 */
export async function fetchAllPLFSData(filters: PLFSFilters): Promise<PLFSRecord[]> {
	const pageSize = "500";
	const firstPage = await fetchPLFSData({
		...filters,
		limit: pageSize,
		page: "1",
	});

	const allRecords = [...firstPage.data];
	const totalPages = firstPage.meta_data.totalPages;

	if (totalPages > 1) {
		// Fetch remaining pages sequentially to avoid overwhelming the server
		for (let page = 2; page <= totalPages; page++) {
			const pageData = await fetchPLFSData({
				...filters,
				limit: pageSize,
				page: String(page),
			});
			allRecords.push(...pageData.data);
		}
	}

	return allRecords;
}
