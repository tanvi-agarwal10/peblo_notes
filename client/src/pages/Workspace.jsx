import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import AiAssistant from '../components/AiAssistant';
import Dashboard from '../components/Dashboard';
import { useNoteStore } from '../store/noteStore';
import { useUiStore } from '../store/uiStore';

const Workspace = () => {
  const { fetchNotes, isLoading } = useNoteStore();
  const { currentView } = useUiStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-[#00ffcc] to-blue-500 mb-4 flex items-center justify-center font-bold text-xl text-black">P</div>
          Loading workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0c10] text-white overflow-hidden">
      <Sidebar />
      {currentView === 'dashboard' ? <Dashboard /> : <Editor />}
      {currentView === 'editor' && <AiAssistant />}
    </div>
  );
};

export default Workspace;
