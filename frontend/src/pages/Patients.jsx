import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const API = "https://patients-db-api.onrender.com"
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const STATUSES = ["Admitted", "Under Treatment", "Cured"]

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [msg, setMsg] = useState(null)

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

  const handleDelete = async (id) => {
    if (!confirm(`Delete patient #${id}?`)) return
    const res = await fetch(`${API}/patients/${id}`, { method: "DELETE" })
    if (res.ok) { flash("Patient deleted"); fetchPatients() }
    else flash("Error deleting", "error")
  }

  const startEdit = (p) => {
    setEditId(p.id)
    setEditForm({ name: p.name, age: p.age, gender: p.gender, phone_number: p.phone_number || "", address: p.address, blood_group: p.blood_group, diagnosis: p.diagnosis, admission_date: p.admission_date, status: p.status || "Admitted" })
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

  const statusStyle = (status) => {
    const map = {
      "Admitted": { background: "#cfe2ff", color: "#084298" },
      "Under Treatment": { background: "#fff3cd", color: "#664d03" },
      "Cured": { background: "#d1e7dd", color: "#0f5132" },
    }
    return { ...s.badge, ...(map[status] || { background: "#e9ecef", color: "#495057" }) }
  }

  const s = {
    wrap: { fontFamily: "'Segoe UI', sans-serif", maxWidth: "1300px", margin: "0 auto", padding: "2rem" },
    h1: { fontSize: "1.8rem", fontWeight: "700", margin: 0 },
    sub: { color: "#6c757d", fontSize: "14px", marginTop: "4px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th: { padding: "12px 14px", textAlign: "left", background: "#1a1a2e", color: "white", fontWeight: "500", whiteSpace: "nowrap" },
    td: { padding: "10px 12px", borderBottom: "1px solid #f0f0f0", verticalAlign: "middle" },
    tdEdit: { padding: "6px 8px", borderBottom: "1px solid #f0f0f0", background: "#f0f7ff" },
    editInput: { width: "100%", padding: "5px 7px", border: "1px solid #b6d4fe", borderRadius: "4px", fontSize: "12px", boxSizing: "border-box" },
    btnEdit: { padding: "5px 10px", background: "#0d6efd", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", marginRight: "4px" },
    btnDel: { padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
    btnSave: { padding: "5px 10px", background: "#198754", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", marginRight: "4px" },
    btnCancel: { padding: "5px 10px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
    btnSecondary: { padding: "8px 16px", background: "#1a1a2e", color: "white", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500", textDecoration: "none" },
    success: { marginBottom: "1rem", padding: "10px", background: "#d1e7dd", color: "#0f5132", borderRadius: "6px", fontSize: "13px" },
    error: { marginBottom: "1rem", padding: "10px", background: "#f8d7da", color: "#842029", borderRadius: "6px", fontSize: "13px" },
    badge: { padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", display: "inline-block", whiteSpace: "nowrap" },
  }

  const ef = (field, type = "text") => (
    <input type={type} style={s.editInput} value={editForm[field] || ""}
      onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} />
  )

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>All Patients</h1>
          <p style={s.sub}>View and manage patient records</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/add-patient" style={s.btnSecondary}>Add Patient</Link>
          <Link to="/dashboard" style={s.btnSecondary}>Dashboard</Link>
        </div>
      </div>

      {msg && <div style={msg.type === "error" ? s.error : s.success}>{msg.text}</div>}

      <div style={{ overflowX: "auto" }}>
        {loading ? <p>Loading...</p> : (
          <table style={s.table}>
            <thead>
              <tr>
                {["ID","Name","Age","Gender","Blood Group","Status","Diagnosis","Phone","Address","Admission Date","Actions"].map(h => (
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
                  <td style={s.tdEdit}>
                    <select style={s.editInput} value={editForm.status || "Admitted"}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                      {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
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
                  <td style={s.td}><span style={statusStyle(p.status || "Admitted")}>{p.status || "Admitted"}</span></td>
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