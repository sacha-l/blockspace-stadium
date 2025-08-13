const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2000/api";

const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Ensure we never drop the default Content-Type when custom headers are provided
  const config: RequestInit = { ...options };
  const defaultHeaders: Record<string, string> = { "Content-Type": "application/json" };
  const optionHeaders = (options.headers || {}) as Record<string, string>;
  config.headers = { ...defaultHeaders, ...optionHeaders };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

type GetProjectsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; // legacy client param; mapped to projectState
  projectState?: string;
  hackathonId?: string;
  winnersOnly?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const api = {
  submitEntry: (data: unknown) =>
    request("/entry", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProjects: (params?: GetProjectsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.projectState) searchParams.set("projectState", params.projectState);
    if (params?.status) searchParams.set("projectState", params.status);
    if (params?.hackathonId) searchParams.set("hackathonId", params.hackathonId);
    if (params?.winnersOnly !== undefined) searchParams.set("winnersOnly", String(params.winnersOnly));
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    return request(`/projects${queryString ? `?${queryString}` : ""}`);
  },

  getProject: (id: string) => request(`/projects/${id}`),

  updateProjectTeam: (projectId: string, teamMembers: Array<{ name: string; walletAddress?: string; customUrl?: string }>, authHeader: string) =>
    request(`/projects/${projectId}/team`, {
      method: "POST",
      headers: { "x-siws-auth": authHeader },
      body: JSON.stringify({ teamMembers }),
    }),
};
