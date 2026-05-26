export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const overdue = task.dueDate && task.status === 'pending' && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-check" onClick={onToggle}>
        <div className={`checkbox ${task.status === 'completed' ? 'checked' : ''}`}>
          {task.status === 'completed' && <span>✓</span>}
        </div>
      </div>
      <div className="task-body">
        <p className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className={`badge badge-${task.status}`}>{task.status}</span>
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          {task.dueDate && (
            <span className={`due-date ${overdue ? 'overdue' : ''}`}>
              {overdue ? '⚠ Overdue: ' : 'Due: '}
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button onClick={onEdit} className="btn-edit">Edit</button>
        <button onClick={onDelete} className="btn-delete">Delete</button>
      </div>
    </div>
  );
}
