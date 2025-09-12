import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let loaderEl;

function showLoader() {
    if (!loaderEl) {
        loaderEl = document.createElement("div");
        loaderEl.style.position = "fixed";
        loaderEl.style.top = 0;
        loaderEl.style.left = 0;
        loaderEl.style.width = "100vw";
        loaderEl.style.height = "100vh";
        loaderEl.style.background = "rgba(0,0,0,0.3)";
        loaderEl.style.display = "flex";
        loaderEl.style.alignItems = "center";
        loaderEl.style.justifyContent = "center";
        loaderEl.style.zIndex = 9999;
        loaderEl.innerHTML = `
            <div style="
                border: 8px solid #f3f3f3; 
                border-top: 8px solid #3498db; 
                border-radius: 50%; 
                width: 60px; 
                height: 60px; 
                animation: spin 1s linear infinite;
            "></div>
        `;
        document.body.appendChild(loaderEl);

        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    loaderEl.style.display = "flex";
}

function hideLoader() {
    if (loaderEl) loaderEl.style.display = "none";
}

async function handleResponse(response) {
    let data;
    try {
        data = await response.json();
    } catch {
        data = {};
    }
    if (!response.ok || data.type === "error") {
        toast.error(data.message || "Something went wrong");
        throw new Error(data.message || "Error");
    }
    if (data.message) toast.success(data.message);
    return data;
}

export async function apiRequest(url, method = "GET", data = null, isFormData = false) {
    showLoader();
    try {
        const headers = {};
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (!isFormData) headers["Content-Type"] = "application/json";

        const response = await fetch(`${API_BASE_URL}${url}`, {
            method,
            headers,
            body: data ? (isFormData ? data : JSON.stringify(data)) : null
        });

        return await handleResponse(response);
    } catch (err) {
        // toast.error(err.message || "Network error");
        throw err;
    } finally {
        hideLoader();
    }
}

export const get = (url) => apiRequest(url, "GET");
export const post = (url, data, isFormData = false) => apiRequest(url, "POST", data, isFormData);
export const put = (url, data, isFormData = false) => apiRequest(url, "PUT", data, isFormData);
export const del = (url, data = null) => apiRequest(url, "DELETE", data);
