const BASE = "https://patients-db-api.onrender.com"
const headers = () => ({ "Content-Type": "application/json" })

export const api = {
  get:    (path)       => fetch(`${BASE}${path}`, { method: "GET",    headers: headers() }),
  post:   (path, body) => fetch(`${BASE}${path}`, { method: "POST",   headers: headers(), body: JSON.stringify(body) }),
  put:    (path, body) => fetch(`${BASE}${path}`, { method: "PUT",    headers: headers(), body: JSON.stringify(body) }),
  delete: (path)       => fetch(`${BASE}${path}`, { method: "DELETE", headers: headers() }),
}

export const loginRequest = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })