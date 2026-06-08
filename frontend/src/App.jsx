import { useState, useEffect } from "react"

const API = "https://patients-db-api.onrender.com"

export default function App() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API}/patients/`)
      .then(res => res.json())
      .then(data => {
        setPatients(data)
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to fetch patients")
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ padding: "2rem" }}>Loading patients...</p>
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Patient Management</h1>
      <p>{patients.length} patients found</p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Age</th>
            <th style={th}>Gender</th>
            <th style={th}>Blood Group</th>
            <th style={th}>Diagnosis</th>
            <th style={th}>Phone</th>
            <th style={th}>Address</th>
            <th style={th}>Admission Date</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={td}>{patient.id}</td>
              <td style={td}>{patient.name}</td>
              <td style={td}>{patient.age}</td>
              <td style={td}>{patient.gender}</td>
              <td style={td}>{patient.blood_group}</td>
              <td style={td}>{patient.diagnosis}</td>
              <td style={td}>{patient.phone_number || "—"}</td>
              <td style={td}>{patient.address}</td>
              <td style={td}>{patient.admission_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th = {
  padding: "10px 16px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
  fontWeight: "bold"
}

const td = {
  padding: "10px 16px",
  textAlign: "left"
}