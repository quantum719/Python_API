import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const API = "https://patients-db-api.onrender.com"
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const STATUSES = ["Admitted", "Under Treatment", "Cured"]
const PAGE_SIZE = 10

export default function Patients() {
  const [data, setData] = useState({ items: [], total: 0, total_pages: 1, page: 1 })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [msg, setMsg] = useState(null)

  // Wait 400ms after user stops typing before fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => { fetchPatients(page, debouncedSearch) }, [page, debouncedSearch])

  const fetchPatients = async (pageNum, searchTerm) => {
    setLoading(true)
    const params = new URLSearchParams({ page: pageNum, limit: PAGE_SIZE })
    if (searchTerm) params.append("search", searchTerm)
    const res = await fetch(`${API}/patients/?${params}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  const flash = (text, type = "success") => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleDelete = async (id) => {
    if (!confirm(`Delete patient #${id}?`)) return
    const res = await fetch(`${API}/patients/${id}`, { method: "DELETE" })
    if (res.ok) { flash("Patient deleted"); fetchPatients(page, debouncedSearch) }
    else flash("Error deleting", "error")
  }

  const startEdit = (p) => {
    setEditId(p.id)
    setEditForm({
      name: p.name, age: p.age, gender: p.gender,
      phone_number: p.phone_number || "", address: p.address,
      blood_group: p.blood_group, diagnosis: p.diagnosis,
      admission_date: p.admission_date, status: p.status || "Admitted"
    })
  }

  const handleUpdate = async () => {
    const res = await fetch(`${API}/patients/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, age: parseInt(editForm.age) })
    })
    if (res.ok) { flash("Patient updated"); setEditId(null); fetchPatients(page, debouncedSearch) }
    else { const d = await res.json(); flash(d.detail || "Error", "error") }
  }

  const goToPage = (p) => {
    if (p < 1 || p > data.total_pages) return
    setPage(p)
    setEditId(null)
  }

  const statusStyle = (status) => {
    const map = {
      "Admitted": { background: "#cfe2ff", color: "#084298" },
      "Under Treatment": { background: "#fff3cd", color: "#664d03" },
      "Cured": { background: "#d1e7dd", color: "#0f5132" },
    }
    return { ...s.badge, ...(map[status] || { background: "#e9ecef", color: "#495057" }) }
  }

  const ef = (field, type = "text") => (
    <input type={type} style={s.editInput} value={editForm[field] || ""}
      onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} />
  )

  const pageNumbers = () => {
    const total = data.total_pages
    const current = page
    const pages = []
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      if (current > 3) pages.push("...")
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
      if (current < total - 2) pages.push("...")
      pages.push(total)
    }
    return pages
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>All Patients</h1>
          <p style={s.sub}>
            {data.total} {debouncedSearch ? `results for "${debouncedSearch}"` : "total"} · Page {page} of {data.total_pages}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/add-patient" style={s.btnSecondary}>Add Patient</Link>
          <Link to="/dashboard" style={s.btnSecondary}>Dashboard</Link>
        </div>
      </div>

      <div style={s.searchRow}>
        <input
          type="text"
          placeholder="Search by name, diagnosis, address, blood group, status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={s.searchInput}
        />
        {search && (
          <button style={s.clearBtn} onClick={() => setSearch("")}>✕ Clear</button>
        )}
      </div>

      {msg && <div style={msg.type === "error" ? s.error : s.success}>{msg.text}</div>}

      <div style={{ overflowX: "auto" }}>
        {loading ? <p>Loading...</p> : data.items.length === 0 ? (
          <p style={{ color: "#6c757d", padding: "2rem 0" }}>
            No patients found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}.
          </p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["ID","Name","Age","Gender","Blood Group","Status","Diagnosis","Phone","Address","Admission Date","Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map(p => editId === p.id ? (
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

      {data.total_pages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn(page === 1)} onClick={() => goToPage(page - 1)} disabled={page === 1}>
            ← Prev
          </button>
          {pageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} style={s.dots}>...</span>
            ) : (
              <button key={p} style={s.pageNumBtn(p === page)} onClick={() => goToPage(p)}>
                {p}
              </button>
            )
          )}
          <button style={s.pageBtn(page === data.total_pages)} onClick={() => goToPage(page + 1)} disabled={page === data.total_pages}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

const s = {
  wrap: { fontFamily: "'Segoe UI', sans-serif", maxWidth: "1300px", margin: "0 auto", padding: "2rem" },
  h1: { fontSize: "1.8rem", fontWeight: "700", margin: 0 },
  sub: { color: "#6c757d", fontSize: "14px", marginTop: "4px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  searchRow: { display: "flex", gap: "10px", alignItems: "center", marginBottom: "1.5rem" },
  searchInput: { flex: 1, padding: "10px 14px", border: "1px solid #dee2e6", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  clearBtn: { padding: "10px 14px", background: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#495057", whiteSpace: "nowrap" },
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
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "1.5rem", flexWrap: "wrap" },
  pageBtn: (disabled) => ({ padding: "7px 14px", background: disabled ? "#e9ecef" : "#1a1a2e", color: disabled ? "#adb5bd" : "white", border: "none", borderRadius: "6px", cursor: disabled ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "500" }),
  pageNumBtn: (active) => ({ padding: "7px 12px", background: active ? "#1a1a2e" : "white", color: active ? "white" : "#1a1a2e", border: "1px solid #dee2e6", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: active ? "700" : "400" }),
  dots: { padding: "7px 4px", color: "#6c757d", fontSize: "13px" },
}