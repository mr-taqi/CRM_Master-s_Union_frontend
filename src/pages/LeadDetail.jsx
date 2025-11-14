import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  fetchLead,
  updateLead,
  clearCurrentLead,
  clearError
} from '../store/slices/leadSlice'
import {
  fetchLeadActivities,
  createActivity
} from '../store/slices/activitySlice'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import ActivityTimeline from '../components/ActivityTimeline'
import ActivityModal from '../components/ActivityModal'
import './LeadDetail.css'

const LeadDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentLead, loading, error } = useSelector((state) => state.leads)
  const { activities } = useSelector((state) => state.activities)
  const { user } = useSelector((state) => state.auth)

  const [showActivityModal, setShowActivityModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    dispatch(fetchLead(id))
    dispatch(fetchLeadActivities(id))

    return () => {
      dispatch(clearCurrentLead())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentLead) {
      setFormData({
        firstName: currentLead.firstName,
        lastName: currentLead.lastName,
        email: currentLead.email,
        phone: currentLead.phone || '',
        company: currentLead.company || '',
        status: currentLead.status,
        source: currentLead.source || '',
        estimatedValue: currentLead.estimatedValue || 0,
        notes: currentLead.notes || ''
      })
    }
  }, [currentLead])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(updateLead({ id, data: formData }))
    if (result.type === 'leads/updateLead/fulfilled') {
      toast.success('Lead updated successfully')
      setIsEditing(false)
      dispatch(fetchLead(id))
    }
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

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading lead...</div>
      </Layout>
    )
  }

  if (!currentLead) {
    return (
      <Layout>
        <div className="error">Lead not found</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="lead-detail">
        <div className="lead-header">
          <h1>
            {currentLead.firstName} {currentLead.lastName}
          </h1>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowActivityModal(true)}
            >
              + Add Activity
            </button>
            <button
              className="btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        <div className="lead-content">
          <div className="lead-info">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      backgroundColor: isEditing
                        ? 'white'
                        : getStatusColor(formData.status),
                      color: isEditing ? 'black' : 'white'
                    }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Value</label>
                  <input
                    type="number"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Owner</label>
                <input
                  type="text"
                  value={currentLead.owner?.name || ''}
                  disabled
                />
              </div>

              {isEditing && (
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              )}
            </form>
          </div>

          <div className="lead-timeline">
            <h2>Activity Timeline</h2>
            <ActivityTimeline activities={activities} />
          </div>
        </div>

        {showActivityModal && (
          <ActivityModal
            leadId={id}
            onClose={() => {
              setShowActivityModal(false)
              dispatch(fetchLeadActivities(id))
            }}
          />
        )}
      </div>
    </Layout>
  )
}

export default LeadDetail

