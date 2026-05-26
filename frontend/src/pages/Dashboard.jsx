import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({ page: 1, limit: 6 });
  const [modal, setModal] = useState(null); // null | true | task object
  const [toast, setToast] = useState(null);

  const { tasks, pagination, loading, createTask, updateTask, toggleTask, deleteTask } = useTasks(filters);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data) => {
    try {
      const taskId = modal?._id || modal?.id;
      if (taskId) { await updateTask(taskId, data); notify('Task updated!'); }
      else { await createTask(data); notify('Task created!'); }
      setModal(null);
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    notify('Task deleted!');
  };

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  return (
    <div className="app-layout">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
      {modal !== null && (
        <TaskModal task={modal === true ? null : modal}
          onSave={handleSave} onClose={() => setModal(null)} />
      )}

      <aside className="sidebar">
        <div className="logo">✓ TaskFlow</div>
        <nav>
          {[['all','All Tasks'],['pending','Pending'],['completed','Completed']].map(([v,l]) => (
            <button key={v} className={`nav-item ${filters.status === (v === 'all' ? '' : v) ? 'active' : ''}`}
              onClick={() => setFilter('status', v === 'all' ? '' : v)}>{l}</button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{user?.name?.slice(0,2).toUpperCase()}</div>
          <div>
            <p className="user-name">{user?.name}</p>
            <button onClick={logout} className="sign-out">Sign out</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>My Tasks</h2>
          <button className="btn-primary" onClick={() => setModal(true)}>+ New Task</button>
        </header>

        <div className="content-area">
        {/* Stats */}
        <div className="stats-grid">
          {[['Total', pagination?.total || tasks.length],
            ['Pending', tasks.filter(t=>t.status==='pending').length],
            ['Done', tasks.filter(t=>t.status==='completed').length]
          ].map(([l,v]) => (
            <div key={l} className="stat-card">
              <span className="stat-num">{v}</span>
              <span className="stat-label">{l}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="filters-row">
          <input placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={e => setFilter('search', e.target.value)}
            className="search-input" />
          <select value={filters.priority || ''} onChange={e => setFilter('priority', e.target.value)}>
            <option value="">All Priority</option>
            {['high','medium','low'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
          </select>
        </div>

        {/* Tasks */}
        {loading ? <p className="loading">Loading tasks...</p>
          : tasks.length === 0 ? <div className="empty-state"><p>No tasks found.</p></div>
          : <div className="task-list">
              {tasks.map(t => (
                <TaskCard key={t._id} task={t}
                  onToggle={() => toggleTask(t._id)}
                  onEdit={() => setModal(t)}
                  onDelete={() => handleDelete(t._id)} />
              ))}
            </div>
        }

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i+1} className={`page-btn ${filters.page === i+1 ? 'active' : ''}`}
                onClick={() => setFilters(f => ({ ...f, page: i+1 }))}>{i+1}</button>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}