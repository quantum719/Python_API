import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://patients-db-api.onrender.com"
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const emptyForm = { id: "", name: "", age: "", gender: "", phone_number: "", address: "", blood_group: "", diagnosis: "", admission_date: "" }

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [msg, setMsg] = useState(null)
  const navigate = useNavigate()

  const fetchPatients = async () => {
    const res = await fetch(`${API}/patients/`)
    const data = await res.json()
    setPatients(data)
    setLoading(false)
  }

  useEffect(() => { fetchPatients() }, [])

  const flash = (text, type = "success") => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleAdd = async () => {
    const res = await fetch(`${API}/patients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: parseInt(form.id), age: parseInt(form.age) })
    })
    if (res.ok) { flash("Patient added"); setForm(emptyForm); fetchPatients() }
    else { const d = await res.json(); flash(d.detail || "Error", "error") }
  }

  const handleDelete = async (id) => {
    if (!confirm(`Delete patient #${id}?`)) return
    const res = await fetch(`${API}/patients/${id}`, { method: "DELETE" })
    if (res.ok) { flash("Patient deleted"); fetchPatients() }
    else flash("Error deleting", "error")
  }

  const startEdit = (p) => {
    setEditId(p.id)
    setEditForm({ name: p.name, age: p.age, gender: p.gender, phone_number: p.phone_number || "", address: p.address, blood_group: p.blood_group, diagnosis: p.diagnosis, admission_date: p.admission_date })
  }

  const handleUpdate = async () => {
    const res = await fetch(`${API}/patients/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, age: parseInt(editForm.age) })
    })
    if (res.ok) { flash("Patient updated"); setEditId(null); fetchPatients() }
    else { const d = await res.json(); flash(d.detail || "Error", "error") }
  }

  const s = {
    wrap: { fontFamily: "'Segoe UI', sans-serif", maxWidth: "1300px", margin: "0 auto", padding: "2rem" },
    h1: { fontSize: "1.8rem", fontWeight: "700", margin: 0 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" },
    card: { background: "#f8f9fa", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", border: "1px solid #e9ecef" },
    cardTitle: { fontWeight: "600", marginBottom: "1rem", color: "#495057" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" },
    label: { display: "block", fontSize: "11px", fontWeight: "600", color: "#6c757d", marginBottom: "4px", textTransform: "uppercase" },
    input: { width: "100%", padding: "8px 10px", border: "1px solid #dee2e6", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" },
    btn: { padding: "9px 20px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500", marginTop: "1rem" },
    btnLogout: { padding: "8px 18px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th: { padding: "12px 14px", textAlign: "left", background: "#1a1a2e", color: "white", fontWeight: "500", whiteSpace: "nowrap" },
    td: { padding: "10px 12px", borderBottom: "1px solid #f0f0f0", verticalAlign: "middle" },
    tdEdit: { padding: "6px 8px", borderBottom: "1px solid #f0f0f0", background: "#f0f7ff" },
    editInput: { width: "100%", padding: "5px 7px", border: "1px solid #b6d4fe", borderRadius: "4px", fontSize: "12px", boxSizing: "border-box" },
    btnEdit: { padding: "5px 10px", background: "#0d6efd", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", marginRight: "4px" },
    btnDel: { padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
    btnSave: { padding: "5px 10px", background: "#198754", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", marginRight: "4px" },
    btnCancel: { padding: "5px 10px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
    success: { marginTop: "10px", padding: "10px", background: "#d1e7dd", color: "#0f5132", borderRadius: "6px", fontSize: "13px" },
    error: { marginTop: "10px", padding: "10px", background: "#f8d7da", color: "#842029", borderRadius: "6px", fontSize: "13px" },
  }

  const ef = (field, type = "text") => (
    <input type={type} style={s.editInput} value={editForm[field] || ""}
      onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} />
  )

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.h1}>Patient Management</h1>
        <button style={s.btnLogout} onClick={handleLogout}>Logout</button>
      </div>

      <div style={s.card}>
        <p style={s.cardTitle}>Add a Patient</p>
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
        </div>
        <button style={s.btn} onClick={handleAdd}>Add Patient</button>
        {msg && <div style={msg.type === "error" ? s.error : s.success}>{msg.text}</div>}
      </div>

      <div style={{ overflowX: "auto" }}>
        {loading ? <p>Loading...</p> : (
          <table style={s.table}>
            <thead>
              <tr>
                {["ID","Name","Age","Gender","Blood Group","Diagnosis","Phone","Address","Admission Date","Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map(p => editId === p.id ? (
                <tr key={p.id}>
                  <td style={s.tdEdit}>{p.id}</td>
                  <td style={s.tdEdit}>{ef("name")}</td>
                  <td style={s.tdEdit}>{ef("age", "number")}</td>
                  <td style={s.tdEdit}>{ef("gender")}</td>
                  <td style={s.tdEdit}>
                    <select style={s.editInput} value={editForm.blood_group}
                      onChange={e => setEditForm({ ...editForm, blood_group: e.target.value })}>
                      {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </td>
                  <td style={s.tdEdit}>{ef("diagnosis")}</td>
                  <td style={s.tdEdit}>{ef("phone_number")}</td>
                  <td style={s.tdEdit}>{ef("address")}</td>
                  <td style={s.tdEdit}>{ef("admission_date", "date")}</td>
                  <td style={s.tdEdit}>
                    <button style={s.btnSave} onClick={handleUpdate}>Save</button>
                    <button style={s.btnCancel} onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td style={s.td}>{p.id}</td>
                  <td style={s.td}>{p.name}</td>
                  <td style={s.td}>{p.age}</td>
                  <td style={s.td}>{p.gender}</td>
                  <td style={s.td}>{p.blood_group}</td>
                  <td style={s.td}>{p.diagnosis}</td>
                  <td style={s.td}>{p.phone_number || "—"}</td>
                  <td style={s.td}>{p.address}</td>
                  <td style={s.td}>{p.admission_date}</td>
                  <td style={s.td}>
                    <button style={s.btnEdit} onClick={() => startEdit(p)}>Edit</button>
                    <button style={s.btnDel} onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}