// Centralized API Service using relative /api paths
const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Assignments API
  getAssignments: () => request('/assignments'),
  createAssignment: (payload) =>
    request('/assignments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAssignment: (id, payload) =>
    request(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAssignment: (id) =>
    request(`/assignments/${id}`, {
      method: 'DELETE',
    }),

  // Study Tasks API
  getStudyTasks: () => request('/study-tasks'),
  createStudyTask: (payload) =>
    request('/study-tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateStudyTask: (id, payload) =>
    request(`/study-tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteStudyTask: (id) =>
    request(`/study-tasks/${id}`, {
      method: 'DELETE',
    }),

  // Events API
  getEvents: () => request('/events'),
  registerForEvent: (id) =>
    request(`/events/${id}/register`, {
      method: 'POST',
    }),
};
