import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../api';

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskAPI.list(filters);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  const createTask = async (body) => {
    const data = await taskAPI.create(body);
    await fetch();
    return data.task;
  };

  const updateTask = async (id, body) => {
    const data = await taskAPI.update(id, body);
    await fetch();
    return data.task;
  };

  const toggleTask = async (id) => {
    await taskAPI.toggle(id);
    await fetch();
  };

  const deleteTask = async (id) => {
    await taskAPI.delete(id);
    await fetch();
  };

  return { tasks, pagination, loading, error, refetch: fetch, createTask, updateTask, toggleTask, deleteTask };
}
