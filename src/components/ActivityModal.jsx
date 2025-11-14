import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createActivity } from '../store/slices/activitySlice'
import { toast } from 'react-toastify'
import './Modal.css'

const ActivityModal = ({ leadId, onClose }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    type: 'Note',
    title: '',
    description: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(
        createActivity({
          ...formData,
          leadId
        })
      )
      toast.success('Activity created successfully')
      onClose()
    } catch (error) {
      toast.error(error.message || 'Failed to create activity')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Activity</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Activity Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Note">Note</option>
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Email">Email</option>
              <option value="Status Change">Status Change</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActivityModal

