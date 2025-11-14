import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createLead, updateLead, clearError } from '../store/slices/leadSlice'
import { fetchLeads } from '../store/slices/leadSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import './Modal.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const LeadModal = ({ lead, onClose }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    source: '',
    estimatedValue: 0,
    notes: '',
    ownerId: user?.id || ''
  })

  useEffect(() => {
    if (lead) {
      setFormData({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status,
        source: lead.source || '',
        estimatedValue: lead.estimatedValue || 0,
        notes: lead.notes || '',
        ownerId: lead.ownerId
      })
    }

    // Fetch users for owner selection (Admin/Manager only)
    if (user?.role === 'Admin' || user?.role === 'Manager') {
      const token = localStorage.getItem('token')
      axios
        .get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Failed to fetch users:', err))
    }
  }, [lead, user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (lead) {
        await dispatch(updateLead({ id: lead.id, data: formData }))
        toast.success('Lead updated successfully')
      } else {
        await dispatch(createLead(formData))
        toast.success('Lead created successfully')
      }
      onClose()
    } catch (error) {
      toast.error(error.message || 'Failed to save lead')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{lead ? 'Edit Lead' : 'Create New Lead'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
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
              />
            </div>
            <div className="form-group">
              <label>Estimated Value</label>
              <input
                type="number"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {(user?.role === 'Admin' || user?.role === 'Manager') && (
            <div className="form-group">
              <label>Owner</label>
              <select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {lead ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadModal

