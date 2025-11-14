import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../store/slices/dashboardSlice'
import Layout from '../components/Layout'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './Dashboard.css'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

const Dashboard = () => {
  const dispatch = useDispatch()
  const { data, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading dashboard...</div>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <div>No data available</div>
      </Layout>
    )
  }

  const statusData = data.leadsByStatus.map((item) => ({
    name: item.status,
    value: item.count
  }))

  const activityData = data.activityTypes.map((item) => ({
    name: item.type,
    value: item.count
  }))

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Leads</h3>
            <p className="stat-value">{data.totalLeads}</p>
          </div>
          <div className="stat-card">
            <h3>Total Value</h3>
            <p className="stat-value">${data.totalValue.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Leads This Month</h3>
            <p className="stat-value">{data.leadsThisMonth}</p>
          </div>
          <div className="stat-card">
            <h3>Conversion Rate</h3>
            <p className="stat-value">{data.conversionRate}%</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Leads by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.leadsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {data.leadsByOwner.length > 0 && (
          <div className="chart-card">
            <h3>Leads by Owner</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.leadsByOwner}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="owner" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="chart-card">
          <h3>Activity Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-header">
                  <span className="activity-type">{activity.type}</span>
                  <span className="activity-date">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="activity-title">{activity.title}</div>
                <div className="activity-meta">
                  Lead: {activity.lead?.firstName} {activity.lead?.lastName} | By:{' '}
                  {activity.user?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

