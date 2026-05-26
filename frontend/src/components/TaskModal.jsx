import { useState } from 'react';

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : ''
  });
  const [errors, setErrors] = useState({});

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const isEditing = !!(task?._id || task?.id);

  const handleSubmit = () => {
    if (!form.title.trim()) { setErrors({ title: 'Title is required' }); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="Task title..." />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea value={form.description} onChange={set('description')}
            placeholder="Optional description..." rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select value={form.priority} onChange={set('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input type="date" value={form.dueDate} onChange={set('dueDate')} />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}