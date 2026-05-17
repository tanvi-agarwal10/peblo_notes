import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { debounce } from 'lodash';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const { searchNotes, fetchNotes } = useNoteStore();

  const debouncedSearch = useMemo(
    () => debounce((q) => {
      searchNotes(q);
    }, 300),
    [searchNotes]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  const clearSearch = () => {
    setQuery('');
    fetchNotes();
  };

  return (
    <div className="relative mb-4 px-3">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
      <input 
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search notes..."
        className="w-full bg-[#1a1d24] border border-gray-800 rounded-xl py-2 pl-9 pr-8 text-sm text-white focus:outline-none focus:border-[#00ffcc] transition-all"
      />
      {query && (
        <button 
          onClick={clearSearch}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SmartSearch;
