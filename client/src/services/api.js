import request from "./fetch";

const api = {
    healthCheck: () => request("/health"),

    // Create or update an entry by ss58Address
    submitEntry: (data) => request("/entry", {
        method: "POST",
        body: data,
    }),

    // Fetch entry by ss58Address
    getEntryByAddress: (ss58Address) => request(`/entry/${ss58Address}`),
};

export default api;