import React from 'react';
import { ComplaintProvider, useComplaints } from './context/ComplaintContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CivicHome } from './components/CivicHome';
import { CitizenForm } from './components/CitizenForm';
import { TicketTracker } from './components/TicketTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { OfficerPortal } from './components/OfficerPortal';
import { ExecutiveAnalytics } from './components/ExecutiveAnalytics';
import { InteractiveMap } from './components/InteractiveMap';
import { ToastContainer } from './components/Toast';

const MainContent = () => {
  const { activeTab } = useComplaints();

  return (
    <main className="flex-1">
      {activeTab === 'home' && <CivicHome />}
      {activeTab === 'report' && <CitizenForm />}
      {activeTab === 'track' && <TicketTracker />}
      {activeTab === 'map' && <InteractiveMap />}
      {activeTab === 'admin-list' && <AdminDashboard />}
      {activeTab === 'officer-tasks' && <OfficerPortal />}
      {activeTab === 'executive-overview' && <ExecutiveAnalytics />}
    </main>
  );
};

export const App = () => {
  return (
    <ComplaintProvider>
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Header />
        <MainContent />
        <Footer />
        <ToastContainer />
      </div>
    </ComplaintProvider>
  );
};

export default App;
