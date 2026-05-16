import { FileText, Clock, Archive, Share2, BarChart2, Plus, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNoteStore } from '../store/noteStore';
import { useUiStore } from '../store/uiStore';
import { motion } from 'framer-motion';
import SmartSearch from './SmartSearch';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { notes, activeNoteId, setActiveNote, createNote } = useNoteStore();
  const { currentView, setView } = useUiStore();

  const handleCreate = async () => {
    setView('editor');
    await createNote();
  };

  const handleNoteClick = (id) => {
    setView('editor');
    setActiveNote(id);
  };

  return (
    <div className="w-64 border-r border-gray-800 bg-[#0a0c10] flex flex-col h-screen">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00ffcc] to-blue-500 flex items-center justify-center">
          <span className="text-black font-bold text-sm">P</span>
        </div>
        <span className="font-bold text-lg neon-text">Peblo AI Notes</span>
      </div>

      <div className="px-4 py-2">
        <button 
          onClick={handleCreate}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1d24] hover:bg-[#252a33] text-[#00ffcc] py-2 rounded-lg transition border border-gray-800"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>
      
      <div className="mt-2">
        <SmartSearch />
      </div>

      <div className="flex-1 overflow-y-auto mt-4 px-3 space-y-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Menu</div>
        <button 
          onClick={() => setView('editor')}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition ${currentView === 'editor' ? 'bg-[#1a1d24] text-[#00ffcc]' : 'text-gray-300 hover:bg-[#1a1d24]'}`}
        >
          <FileText className="w-4 h-4" /> All Notes
        </button>
        <button 
          onClick={() => setView('dashboard')}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition ${currentView === 'dashboard' ? 'bg-[#1a1d24] text-[#00ffcc]' : 'text-gray-300 hover:bg-[#1a1d24]'}`}
        >
          <BarChart2 className="w-4 h-4" /> Insights
        </button>

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 px-2">Notes</div>
        {notes.map(note => (
          <button 
            key={note._id}
            onClick={() => handleNoteClick(note._id)}
            className={`w-full text-left px-2 py-2 rounded-lg transition truncate ${activeNoteId === note._id && currentView === 'editor' ? 'bg-[#1a1d24] text-[#00ffcc]' : 'text-gray-400 hover:bg-[#1a1d24]'}`}
          >
            {note.title || 'Untitled Note'}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition w-full px-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
