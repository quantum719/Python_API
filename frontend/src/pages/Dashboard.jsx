import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

Highcharts.setOptions({
  chart: {
    backgroundColor: "#ffffff",
    style: { fontFamily: "'Segoe UI', sans-serif" }
  }
})

const API = "https://patients-db-api.onrender.com"

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/patients/stats`)
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  if (loading) return <div style={s.wrap}><p>Loading stats...</p></div>
  if (!stats) return <div style={s.wrap}><p>Failed to load stats.</p></div>

  const admitted = stats.status_counts["Admitted"] || 0
  const underTreatment = stats.status_counts["Under Treatment"] || 0
  const cured = stats.status_counts["Cured"] || 0

  const monthLabels = stats.admissions_by_month.map(m => {
    const [y, mo] = m.month.split("-")
    return new Date(Number(y), Number(mo) - 1).toLocaleString("default", { month: "short", year: "numeric" })
  })
  const monthData = stats.admissions_by_month.map(m => m.count)

  const admissionsChart = {
    chart: { type: "column", height: 300 },
    title: { text: "Admissions by Month" },
    xAxis: { categories: monthLabels },
    yAxis: { title: { text: "Patients Admitted" }, allowDecimals: false },
    series: [{ name: "Admissions", data: monthData, color: "#1a1a2e" }],
    legend: { enabled: false },
    credits: { enabled: false }
  }

  const statusChart = {
    chart: { type: "pie", height: 300 },
    title: { text: "Patient Status" },
    plotOptions: { pie: { innerSize: "60%", dataLabels: { enabled: true, format: "{point.name}: {point.y}" } } },
    series: [{
      name: "Patients",
      data: [
        { name: "Admitted", y: admitted, color: "#0d6efd" },
        { name: "Under Treatment", y: underTreatment, color: "#ffc107" },
        { name: "Cured", y: cured, color: "#198754" },
      ]
    }],
    credits: { enabled: false }
  }

  const bloodGroupChart = {
    chart: { type: "column", height: 300 },
    title: { text: "Blood Group Distribution" },
    xAxis: { categories: Object.keys(stats.blood_group_counts) },
    yAxis: { title: { text: "Patients" }, allowDecimals: false },
    series: [{ name: "Patients", data: Object.values(stats.blood_group_counts), color: "#dc3545" }],
    legend: { enabled: false },
    credits: { enabled: false }
  }

  const genderChart = {
    chart: { type: "pie", height: 300 },
    title: { text: "Gender Distribution" },
    plotOptions: { pie: { dataLabels: { enabled: true, format: "{point.name}: {point.y}" } } },
    series: [{
      name: "Patients",
      data: Object.entries(stats.gender_counts).map(([name, y]) => ({ name, y }))
    }],
    credits: { enabled: false }
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Dashboard</h1>
          <p style={s.sub}>Welcome back, {user?.name}</p>
        </div>
        <button style={s.btnLogout} onClick={handleLogout}>Logout</button>
      </div>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statNumber}>{stats.total}</div>
          <div style={s.statLabel}>Total Patients</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNumber, color: "#0d6efd" }}>{admitted}</div>
          <div style={s.statLabel}>Admitted</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNumber, color: "#997404" }}>{underTreatment}</div>
          <div style={s.statLabel}>Under Treatment</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNumber, color: "#198754" }}>{cured}</div>
          <div style={s.statLabel}>Cured</div>
        </div>
      </div>

      <div style={s.chartsGrid}>
        <div style={s.chartCard}>
          <HighchartsReact highcharts={Highcharts} options={admissionsChart} />
        </div>
        <div style={s.chartCard}>
          <HighchartsReact highcharts={Highcharts} options={statusChart} />
        </div>
        <div style={s.chartCard}>
          <HighchartsReact highcharts={Highcharts} options={bloodGroupChart} />
        </div>
        <div style={s.chartCard}>
          <HighchartsReact highcharts={Highcharts} options={genderChart} />
        </div>
      </div>

      <div style={s.grid}>
        <Link to="/patients" style={s.card}>
          <div style={s.icon}>🧾</div>
          <div style={s.cardTitle}>All Patients</div>
          <div style={s.cardSub}>View and manage patient records</div>
        </Link>

        <Link to="/add-patient" style={s.card}>
          <div style={s.icon}>➕</div>
          <div style={s.cardTitle}>Add Patient</div>
          <div style={s.cardSub}>Register a new patient</div>
        </Link>
      </div>
    </div>
  )
}

const s = {
  wrap: { fontFamily: "'Segoe UI', sans-serif", maxWidth: "1300px", margin: "0 auto", padding: "2rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" },
  h1: { fontSize: "1.8rem", fontWeight: "700", margin: 0 },
  sub: { color: "#6c757d", fontSize: "14px", marginTop: "4px" },
  btnLogout: { padding: "8px 18px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" },
  statCard: { background: "white", border: "1px solid #e9ecef", borderRadius: "12px", padding: "1.2rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statNumber: { fontSize: "2rem", fontWeight: "700", color: "#1a1a2e" },
  statLabel: { fontSize: "12px", color: "#6c757d", marginTop: "4px", textTransform: "uppercase", fontWeight: "600" },
  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" },
  chartCard: { background: "white", border: "1px solid #e9ecef", borderRadius: "12px", padding: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" },
  card: { background: "white", border: "1px solid #e9ecef", borderRadius: "12px", padding: "2rem", textDecoration: "none", color: "inherit", display: "block", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  icon: { fontSize: "2rem", marginBottom: "1rem" },
  cardTitle: { fontWeight: "700", fontSize: "1.1rem", marginBottom: "0.4rem" },
  cardSub: { color: "#6c757d", fontSize: "13px" },
}