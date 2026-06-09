import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../api"

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError(null)
    if (!form.email) { setError("Email is required"); return }
    if (!validateEmail(form.email)) { setError("Enter a valid email address"); return }
    if (!form.password) { setError("Password is required"); return }

    setLoading(true)
    const res = await loginRequest(form.email, form.password)
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem("user", JSON.stringify(data))
      navigate("/patients")
    } else {
      const err = await res.json()
      setError(err.detail)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "2.5rem", width: "360px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.25rem" }}>Patient Management</h1>
        <p style={{ color: "#6c757d", fontSize: "13px", marginBottom: "1.5rem" }}>Sign in to continue</p>

        <label style={s.label}>Email</label>
        <input type="email" style={s.input} placeholder="admin@hospital.com" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handleLogin()} />

        <label style={{ ...s.label, marginTop: "12px" }}>Password</label>
        <input type="password" style={s.input} placeholder="••••••••" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handleLogin()} />

        {error && <p style={{ color: "#dc3545", fontSize: "13px", marginTop: "10px" }}>{error}</p>}

        <button style={s.btn} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  )
}

const s = {
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#495057", marginBottom: "4px" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #dee2e6", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" },
  btn: { width: "100%", padding: "11px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginTop: "1.5rem" }
}