import { useState } from "react"
import { Link } from "react-router-dom"

const API = "https://patients-db-api.onrender.com"
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const STATUSES = ["Admitted", "Under Treatment", "Cured"]
const emptyForm = { id: "", name: "", age: "", gender: "", phone_number: "", address: "", blood_group: "", diagnosis: "", admission_date: "", status: "Admitted" }

export default function AddPatient() {
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState(null)

  const flash = (text, type = "success") => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleAdd = async () => {
    const res = await fetch(`${API}/patients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: parseInt(form.id), age: parseInt(form.age) })
    })
    if (res.ok) {
      flash("Patient added successfully")
      setForm(emptyForm)
    } else {
      const d = await res.json()
      flash(d.detail || "Error", "error")
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Add Patient</h1>
          <p style={s.sub}>Register a new patient record</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/patients" style={s.btnSecondary}>View All Patients</Link>
          <Link to="/dashboard" style={s.btnSecondary}>Dashboard</Link>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.grid}>
          {[["ID","id","number"],["Name","name","text"],["Age","age","number"],["Gender","gender","text"],["Phone","phone_number","text"],["Address","address","text"],["Diagnosis","diagnosis","text"],["Admission Date","admission_date","date"]].map(([label, name, type]) => (
            <div key={name}>
              <label style={s.label}>{label}</label>
              <input type={type} style={s.input} value={form[name]}
                onChange={e => setForm({ ...form, [name]: e.target.value })} />
            </div>
          ))}
          <div>
            <label style={s.label}>Blood Group</label>
            <select style={s.input} value={form.blood_group}
              onChange={e => setForm({ ...form, blood_group: e.target.value })}>
              <option value="">Select</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Status</label>
            <select style={s.input} value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>
        <button style={s.btn} onClick={handleAdd}>Add Patient</button>
        {msg && <div style={msg.type === "error" ? s.error : s.success}>{msg.text}</div>}
      </div>
    </div>
  )
}

const s = {
  wrap: { fontFamily: "'Segoe UI', sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "2rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" },
  h1: { fontSize: "1.8rem", fontWeight: "700", margin: 0 },
  sub: { color: "#6c757d", fontSize: "14px", marginTop: "4px" },
  card: { background: "#f8f9fa", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e9ecef" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" },
  label: { display: "block", fontSize: "11px", fontWeight: "600", color: "#6c757d", marginBottom: "4px", textTransform: "uppercase" },
  input: { width: "100%", padding: "8px 10px", border: "1px solid #dee2e6", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" },
  btn: { padding: "9px 20px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500", marginTop: "1rem" },
  btnSecondary: { padding: "8px 16px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500", textDecoration: "none" },
  success: { marginTop: "10px", padding: "10px", background: "#d1e7dd", color: "#0f5132", borderRadius: "6px", fontSize: "13px" },
  error: { marginTop: "10px", padding: "10px", background: "#f8d7da", color: "#842029", borderRadius: "6px", fontSize: "13px" },
}