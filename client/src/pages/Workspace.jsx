import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import AiAssistant from '../components/AiAssistant';
import Dashboard from '../components/Dashboard';
import { useNoteStore } from '../store/noteStore';
import { useUiStore } from '../store/uiStore';
import { Menu, Sparkles, X } from 'lucide-react';

const Workspace = () => {
  const { fetchNotes, isLoading } = useNoteStore();
  const { currentView } = useUiStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Close overlays when switching views
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsAiOpen(false);
  }, [currentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] text-white">
        <div className="w-full h-full flex overflow-hidden opacity-50 pointer-events-none">
           <div className="w-64 border-r border-gray-800 bg-[#0a0c10] hidden md:block" />
           <div className="flex-1 bg-[#0f1115]" />
           <div className="w-80 border-l border-gray-800 hidden lg:block" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c10]/50">
           <div className="w-12 h-12 rounded bg-gradient-to-br from-[#00ffcc] to-blue-500 mb-4 flex items-center justify-center font-bold text-xl text-black animate-bounce">P</div>
           <p className="animate-pulse">Launching your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0c10] text-white overflow-hidden relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-6 left-4 z-20 p-2 bg-gray-800 rounded-full shadow-lg border border-gray-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile AI Toggle */}
      {currentView === 'editor' && (
        <button 
          onClick={() => setIsAiOpen(true)}
          className="lg:hidden fixed top-6 right-4 z-20 p-2 bg-[#00ffcc]/10 text-[#00ffcc] rounded-full shadow-lg border border-[#00ffcc]/20"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar Overlay (Mobile) */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0f1115]">
        {currentView === 'dashboard' ? <Dashboard /> : <Editor />}
      </main>

      {/* AI Assistant (Overlay on small screens, sidebar on large) */}
      {currentView === 'editor' && (
        <>
          <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity lg:hidden ${isAiOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsAiOpen(false)} />
          <div className={`fixed inset-y-0 right-0 z-40 transition-transform transform lg:relative lg:translate-x-0 ${isAiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
             <AiAssistant onClose={() => setIsAiOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default Workspace;
