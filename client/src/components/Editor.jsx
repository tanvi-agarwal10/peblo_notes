import { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNoteStore } from '../store/noteStore';
import { debounce } from 'lodash';
import { Save, CheckCircle, Trash2, Share2, FileText } from 'lucide-react';

const Editor = () => {
  const { notes, activeNoteId, updateNote, deleteNote } = useNoteStore();
  const [localNote, setLocalNote] = useState(null);
  const [savingStatus, setSavingStatus] = useState('idle'); // idle, saving, saved

  const activeNote = notes.find(n => n._id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      setLocalNote(activeNote);
    } else {
      setLocalNote(null);
    }
  }, [activeNoteId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (localNote) {
          debouncedSave(activeNoteId, localNote);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        useNoteStore.getState().createNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localNote, activeNoteId, debouncedSave]);

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

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalNote(prev => ({ ...prev, title: newTitle }));
    debouncedSave(activeNoteId, { title: newTitle });
  };

  const handleContentChange = (content) => {
    setLocalNote(prev => ({ ...prev, content }));
    debouncedSave(activeNoteId, { content });
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
    <div className="flex-1 flex flex-col h-screen bg-[#0f1115] relative">
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-800">
        <input
          type="text"
          value={localNote.title}
          onChange={handleTitleChange}
          className="text-3xl font-bold bg-transparent border-none outline-none text-white w-2/3 focus:ring-0 placeholder-gray-600"
          placeholder="Note Title"
        />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {savingStatus === 'saving' && <><Save className="w-4 h-4 animate-pulse" /> Saving...</>}
            {savingStatus === 'saved' && <><CheckCircle className="w-4 h-4 text-[#00ffcc]" /> Saved</>}
          </div>
          <button 
            onClick={async () => {
              const shareId = await useNoteStore.getState().shareNote(activeNoteId);
              if (shareId) {
                const url = `${window.location.origin}/shared/${shareId}`;
                navigator.clipboard.writeText(url);
                alert('Public link copied to clipboard!');
              }
            }}
            className="p-2 text-gray-500 hover:text-[#00ffcc] hover:bg-[#00ffcc]/10 rounded-lg transition"
            title="Share Publicly"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => deleteNote(activeNoteId)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
            title="Delete Note"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 editor-container">
        <ReactQuill 
          theme="snow" 
          value={localNote.content} 
          onChange={handleContentChange}
          className="h-[calc(100vh-250px)] text-gray-300"
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

// Add missing FileText import in Editor.jsx
import { FileText } from 'lucide-react';

export default Editor;
