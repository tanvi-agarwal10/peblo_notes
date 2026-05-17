import { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNoteStore } from '../store/noteStore';
import { useUiStore } from '../store/uiStore';
import { debounce } from 'lodash';
import { Save, CheckCircle, Trash2, Share2, FileText, Tag, Archive, ArchiveRestore } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Personal', 'Work', 'Study', 'Ideas', 'Others'];

const Editor = () => {
  const { notes, activeNoteId, updateNote, deleteNote } = useNoteStore();
  const [localNote, setLocalNote] = useState(null);
  const [savingStatus, setSavingStatus] = useState('idle'); // idle, saving, saved
  const [tagInput, setTagInput] = useState('');

  const activeNote = notes.find(n => n._id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      setLocalNote(activeNote);
    } else {
      setLocalNote(null);
    }
  }, [activeNoteId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((id, data) => {
      setSavingStatus('saving');
      updateNote(id, data).then(() => {
        setSavingStatus('saved');
        setTimeout(() => setSavingStatus('idle'), 2000);
      });
    }, 1000),
    [updateNote]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (localNote) {
          debouncedSave(activeNoteId, localNote);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        useUiStore.getState().setView('editor');
        useNoteStore.getState().createNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localNote, activeNoteId, debouncedSave]);


  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalNote(prev => ({ ...prev, title: newTitle }));
    debouncedSave(activeNoteId, { title: newTitle });
  };

  const handleContentChange = (content) => {
    setLocalNote(prev => ({ ...prev, content }));
    debouncedSave(activeNoteId, { content });
  };

  const handleCategoryChange = (category) => {
    setLocalNote(prev => ({ ...prev, category }));
    updateNote(activeNoteId, { category });
    toast.success(`Category updated to ${category}`);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...(localNote.tags || []), tagInput.trim()];
      setLocalNote(prev => ({ ...prev, tags: newTags }));
      updateNote(activeNoteId, { tags: newTags });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = localNote.tags.filter(t => t !== tagToRemove);
    setLocalNote(prev => ({ ...prev, tags: newTags }));
    updateNote(activeNoteId, { tags: newTags });
  };

  const toggleArchive = () => {
    const archived = !localNote.archived;
    setLocalNote(prev => ({ ...prev, archived }));
    updateNote(activeNoteId, { archived });
    toast.success(archived ? 'Note archived' : 'Note restored');
  };

  if (!localNote) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#0f1115]">
        <FileText className="w-16 h-16 mb-4 opacity-20" />
        <p>Select a note or create a new one to start writing</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0f1115] relative overflow-hidden">
      {/* Top Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-800 bg-[#0f1115] z-10">
        <input
          type="text"
          value={localNote.title}
          onChange={handleTitleChange}
          className="text-3xl font-bold bg-transparent border-none outline-none text-white w-1/2 focus:ring-0 placeholder-gray-600"
          placeholder="Note Title"
        />
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-400 mr-4">
            {savingStatus === 'saving' && <><Save className="w-3 h-3 animate-pulse" /> Saving...</>}
            {savingStatus === 'saved' && <><CheckCircle className="w-3 h-3 text-[#00ffcc]" /> Saved</>}
          </div>

          <button 
            onClick={toggleArchive}
            className={`p-2 rounded-lg transition ${localNote.archived ? 'text-[#00ffcc] bg-[#00ffcc]/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
            title={localNote.archived ? "Restore Note" : "Archive Note"}
          >
            {localNote.archived ? <ArchiveRestore className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
          </button>

          <button 
            onClick={async () => {
              const shareId = await useNoteStore.getState().shareNote(activeNoteId);
              if (shareId) {
                const url = `${window.location.origin}/shared/${shareId}`;
                navigator.clipboard.writeText(url);
                toast.success('Public link copied!');
              }
            }}
            className="p-2 text-gray-500 hover:text-[#00ffcc] hover:bg-[#00ffcc]/10 rounded-lg transition"
            title="Share Publicly"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button 
            onClick={() => {
              if (confirm('Are you sure you want to delete this note?')) {
                deleteNote(activeNoteId);
                toast.error('Note deleted');
              }
            }}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
            title="Delete Note"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metadata Bar (Categories & Tags) */}
      <div className="px-8 py-3 bg-[#16191f] border-b border-gray-800 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category:</span>
          <select 
            value={localNote.category || 'Others'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-[#0f1115] border border-gray-700 text-xs rounded px-2 py-1 outline-none focus:border-[#00ffcc] transition"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Tag className="w-3 h-3 text-gray-500" />
          <div className="flex items-center gap-2 flex-wrap">
            {localNote.tags?.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 text-[#00ffcc] rounded-full text-[10px] font-bold">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-2 h-2" /></button>
              </span>
            ))}
            <input 
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="bg-transparent border-none outline-none text-xs text-gray-400 w-20 focus:w-32 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 editor-container">
        <ReactQuill 
          theme="snow" 
          value={localNote.content} 
          onChange={handleContentChange}
          className="h-[calc(100vh-280px)] text-gray-300"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['link', 'image', 'code-block'],
              ['clean']
            ],
          }}
        />
      </div>
    </div>
  );
};

const X = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default Editor;
