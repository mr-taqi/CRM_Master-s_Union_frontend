import { format } from 'date-fns'
import './ActivityTimeline.css'

const ActivityTimeline = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      Note: '📝',
      Call: '📞',
      Meeting: '🤝',
      Email: '✉️',
      'Status Change': '🔄'
    }
    return icons[type] || '📌'
  }

  const getActivityColor = (type) => {
    const colors = {
      Note: '#3498db',
      Call: '#9b59b6',
      Meeting: '#f39c12',
      Email: '#e67e22',
      'Status Change': '#1abc9c'
    }
    return colors[type] || '#95a5a6'
  }

  if (!activities || activities.length === 0) {
    return <div className="empty-timeline">No activities yet</div>
  }

  return (
    <div className="activity-timeline">
      {activities.map((activity) => (
        <div key={activity.id} className="timeline-item">
          <div
            className="timeline-marker"
            style={{ backgroundColor: getActivityColor(activity.type) }}
          >
            {getActivityIcon(activity.type)}
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="activity-type">{activity.type}</span>
              <span className="activity-date">
                {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
            <div className="activity-title">{activity.title}</div>
            {activity.description && (
              <div className="activity-description">{activity.description}</div>
            )}
            <div className="activity-user">
              By: {activity.user?.name || 'Unknown'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityTimeline

