import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader } from 'lucide-react';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill from 'react-quill';

const PublicNote = () => {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${url}/shared/${shareId}`);
        setNote(response.data);
      } catch (err) {
        setError('Note not found or is no longer public');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-[#00ffcc]">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-red-400">
        <div className="glass-panel p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Oops!</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto glass-panel overflow-hidden">
        <div className="p-8 border-b border-gray-800 bg-[#1a1d24]">
          <h1 className="text-4xl font-bold text-[#00ffcc] mb-2">{note.title || 'Untitled Note'}</h1>
          <div className="text-sm text-gray-400">
            Shared via Peblo Notes AI by {note.createdBy?.name || 'Unknown User'}
          </div>
        </div>
        <div className="p-8 bg-[#0f1115]">
          <ReactQuill 
            value={note.content} 
            readOnly={true} 
            theme="bubble" 
            className="text-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default PublicNote;
