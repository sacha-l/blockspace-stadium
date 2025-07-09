const API_BASE_URL = 'http://localhost:2000/api'; // Adjust port as needed

const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  submitEntry: (data: any) => request("/entry", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  getProjects: (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    return request(`/projects?${searchParams.toString()}`);
  },

  getProject: (id: string) => request(`/entry/${id}`),

  updateProjectStatus: (ss58Address: string, status: string) => request(`/update-project/${ss58Address}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }),
};