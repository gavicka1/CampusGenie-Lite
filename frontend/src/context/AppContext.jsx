import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignments, setAssignments] = useState([]);
  const [studyTasks, setStudyTasks] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global search query shared across all pages
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch all initial API data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assignmentsRes, tasksRes, eventsRes] = await Promise.all([
        api.getAssignments(),
        api.getStudyTasks(),
        api.getEvents(),
      ]);

      setAssignments(assignmentsRes.data || []);
      setStudyTasks(tasksRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Clear search when switching tabs
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  // Assignment Handlers
  const addAssignment = async (newAssignment) => {
    try {
      const res = await api.createAssignment(newAssignment);
      showToast(res.message || 'Assignment added successfully!');
      await refreshData();
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to add assignment';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const updateAssignmentStatus = async (id, newStatus) => {
    try {
      const res = await api.updateAssignment(id, { status: newStatus });
      showToast(res.message || 'Assignment status updated!');
      setAssignments((prev) =>
        prev.map((a) => (a.id.toString() === id.toString() ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const deleteAssignment = async (id) => {
    try {
      const res = await api.deleteAssignment(id);
      showToast(res.message || 'Assignment deleted!');
      setAssignments((prev) => prev.filter((a) => a.id.toString() !== id.toString()));
    } catch (err) {
      showToast(err.message || 'Failed to delete assignment', 'error');
    }
  };

  // Study Task Handlers
  const addStudyTask = async (newTask) => {
    try {
      const res = await api.createStudyTask(newTask);
      showToast(res.message || 'Study task added successfully!');
      await refreshData();
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to add study task';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const res = await api.updateStudyTask(id, { status: newStatus });
      showToast(res.message || 'Task status updated!');
      setStudyTasks((prev) =>
        prev.map((t) => (t.id.toString() === id.toString() ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await api.deleteStudyTask(id);
      showToast(res.message || 'Study task deleted!');
      setStudyTasks((prev) => prev.filter((t) => t.id.toString() !== id.toString()));
    } catch (err) {
      showToast(err.message || 'Failed to delete study task', 'error');
    }
  };

  // Event Registration Handler
  const toggleEventRegistration = async (eventId) => {
    try {
      const res = await api.registerForEvent(eventId);
      showToast(res.message || 'Registration updated!');
      if (res.data) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id.toString() === eventId.toString() ? { ...ev, registered: res.data.registered } : ev
          )
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update registration', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        assignments,
        addAssignment,
        updateAssignmentStatus,
        deleteAssignment,
        studyTasks,
        addStudyTask,
        updateTaskStatus,
        deleteTask,
        events,
        toggleEventRegistration,
        sidebarOpen,
        setSidebarOpen,
        loading,
        error,
        toast,
        refreshData,
        showToast,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
