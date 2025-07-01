import request from "./fetch";

const api = {
    healthCheck : () => request("/health" ),
}

export default api;