import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchLeads,
  deleteLead,
  clearError
} from '../store/slices/leadSlice'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import LeadModal from '../components/LeadModal'
import './Leads.css'

const Leads = () => {
  const dispatch = useDispatch()
  const { leads, loading, error, total, page, pages } = useSelector(
    (state) => state.leads
  )
  const { user } = useSelector((state) => state.auth)

  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchLeads({ page: currentPage, search: searchTerm, status: statusFilter }))
  }, [dispatch, currentPage, searchTerm, statusFilter])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const result = await dispatch(deleteLead(id))
      if (result.type === 'leads/deleteLead/fulfilled') {
        toast.success('Lead deleted successfully')
        dispatch(fetchLeads({ page: currentPage, search: searchTerm, status: statusFilter }))
      }
    }
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLead(null)
    dispatch(fetchLeads({ page: currentPage, search: searchTerm, status: statusFilter }))
  }

  const getStatusColor = (status) => {
    const colors = {
      New: '#3498db',
      Contacted: '#9b59b6',
      Qualified: '#f39c12',
      Proposal: '#e67e22',
      Negotiation: '#1abc9c',
      Won: '#27ae60',
      Lost: '#e74c3c'
    }
    return colors[status] || '#95a5a6'
  }

  return (
    <Layout>
      <div className="leads-page">
        <div className="leads-header">
          <h1>Leads</h1>
          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Lead
          </button>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="empty-state">No leads found</div>
        ) : (
          <>
            <div className="leads-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Value</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <Link to={`/leads/${lead.id}`} className="lead-link">
                          {lead.firstName} {lead.lastName}
                        </Link>
                      </td>
                      <td>{lead.email}</td>
                      <td>{lead.company || '-'}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(lead.status) }}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td>${lead.estimatedValue || 0}</td>
                      <td>{lead.owner?.name}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(lead)}
                          >
                            Edit
                          </button>
                          {(user?.role === 'Admin' ||
                            user?.role === 'Manager' ||
                            lead.ownerId === user?.id) && (
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(lead.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {pages} (Total: {total})
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                disabled={currentPage === pages}
              >
                Next
              </button>
            </div>
          </>
        )}

        {showModal && (
          <LeadModal
            lead={editingLead}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </Layout>
  )
}

export default Leads

