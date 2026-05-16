import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { debounce } from 'lodash';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const { searchNotes } = useNoteStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q) => {
      searchNotes(q);
    }, 300),
    [searchNotes]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  return (
    <div className="relative mb-4 px-2">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
      <input 
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search notes..."
        className="w-full bg-[#1a1d24] border border-gray-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#00ffcc] transition-colors"
      />
    </div>
  );
};

export default SmartSearch;
