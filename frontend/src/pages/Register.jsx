import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const BASE = "https://patients-db-api.onrender.com"
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError(null)
    if (!form.name) { setError("Name is required"); return }
    if (!form.email) { setError("Email is required"); return }
    if (!validateEmail(form.email)) { setError("Enter a valid email address"); return }
    if (!form.password) { setError("Password is required"); return }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return }

    setLoading(true)
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
    })
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
        <h1 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.25rem" }}>Create Account</h1>
        <p style={{ color: "#6c757d", fontSize: "13px", marginBottom: "1.5rem" }}>Register to get started</p>

        <label style={s.label}>Name</label>
        <input type="text" style={s.input} placeholder="John Doe" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handleRegister()} />

        <label style={{ ...s.label, marginTop: "12px" }}>Email</label>
        <input type="email" style={s.input} placeholder="you@example.com" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handleRegister()} />

        <label style={{ ...s.label, marginTop: "12px" }}>Password</label>
        <input type="password" style={s.input} placeholder="••••••••" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handleRegister()} />

        <label style={{ ...s.label, marginTop: "12px" }}>Confirm Password</label>
        <input type="password" style={s.input} placeholder="••••••••" value={form.confirm}
          onChange={e => setForm({ ...form, confirm: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handleRegister()} />

        {error && <p style={{ color: "#dc3545", fontSize: "13px", marginTop: "10px" }}>{error}</p>}

        <button style={s.btn} onClick={handleRegister} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", marginTop: "1rem", color: "#6c757d" }}>
          Already have an account? <Link to="/login" style={{ color: "#1a1a2e", fontWeight: "600" }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#495057", marginBottom: "4px" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #dee2e6", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" },
  btn: { width: "100%", padding: "11px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginTop: "1.5rem" }
}