
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const getTasks = () => request('/tasks');

export const createTask = (task) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });

export const updateTask = (id, changes) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE',
  });
