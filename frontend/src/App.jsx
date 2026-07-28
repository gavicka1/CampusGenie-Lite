import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import StudyPlanner from './pages/StudyPlanner';
import CampusEvents from './pages/CampusEvents';

function MainContent() {
  const { activeTab } = useApp();

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'assignments':
        return <Assignments />;
      case 'study-planner':
        return <StudyPlanner />;
      case 'campus-events':
        return <CampusEvents />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-viewport">
        <Navbar />
        <main className="content-area">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
