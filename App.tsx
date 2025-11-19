
import React, { useState } from 'react';
import { ViewState } from './types';
import Dashboard from './views/Dashboard';
import DataAdaptorView from './views/DataAdaptorView';
import DoctorStationView from './views/DoctorStationView';
import FederatedLearningView from './views/FederatedLearningView';
import KnowledgeBaseView from './views/KnowledgeBaseView';
import ArchitectureView from './views/ArchitectureView';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Global State for Federated Learning Loop
  const [feedbackStats, setFeedbackStats] = useState({
    adopted: 842,
    modified: 124,
    rejected: 56,
    totalTriplets: 1022
  });

  const handleFeedbackSubmit = (type: 'ADOPT' | 'MODIFY' | 'REJECT') => {
    setFeedbackStats(prev => ({
      ...prev,
      [type.toLowerCase() === 'adopt' ? 'adopted' : type.toLowerCase() === 'modify' ? 'modified' : 'rejected']: 
        prev[type.toLowerCase() === 'adopt' ? 'adopted' : type.toLowerCase() === 'modify' ? 'modified' : 'rejected'] + 1,
      totalTriplets: prev.totalTriplets + 1
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onViewChange={setCurrentView} />;
      case ViewState.ARCHITECTURE:
        return <ArchitectureView />;
      case ViewState.DATA_ADAPTOR:
        return <DataAdaptorView />;
      case ViewState.KNOWLEDGE_BASE:
        return <KnowledgeBaseView />;
      case ViewState.DOCTOR_STATION:
        return <DoctorStationView onFeedbackSubmit={handleFeedbackSubmit} />;
      case ViewState.FEDERATED_LEARNING:
        return <FederatedLearningView stats={feedbackStats} />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
