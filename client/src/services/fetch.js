const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function request(endpoint, { method = "GET", body, headers = {}, ...customConfig } = {}) {
    const config = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...customConfig,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "API request failed");
    }

    return response.json();
}

export default request;