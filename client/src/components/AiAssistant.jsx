import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { useAiStore } from '../store/aiStore';
import { motion, AnimatePresence } from 'framer-motion';

const AiAssistant = () => {
  const { notes, activeNoteId, updateNote } = useNoteStore();
  const { generateInsights, isGenerating, error } = useAiStore();

  const activeNote = notes.find(n => n._id === activeNoteId);

  if (!activeNote) return null;

  const handleGenerate = () => {
    generateInsights(activeNoteId);
  };

  const applySuggestedTitle = () => {
    if (activeNote.suggestedTitle) {
      updateNote(activeNoteId, { title: activeNote.suggestedTitle });
    }
  };

  return (
    <div className="w-80 border-l border-gray-800 bg-[#0a0c10] flex flex-col h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center gap-2 sticky top-0 bg-[#0a0c10]/80 backdrop-blur z-10">
        <Sparkles className="w-5 h-5 text-[#00ffcc]" />
        <span className="font-bold text-lg">AI Assistant</span>
      </div>

      <div className="p-4 flex flex-col gap-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !activeNote.content}
          className="w-full bg-gradient-to-r from-[#00ffcc]/20 to-blue-500/20 hover:from-[#00ffcc]/30 hover:to-blue-500/30 border border-[#00ffcc]/30 text-[#00ffcc] py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Generating...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Insights
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <AnimatePresence>
          {activeNote.suggestedTitle && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Title</h3>
              <div className="p-3 bg-[#1a1d24] rounded-lg border border-gray-800">
                <p className="text-sm mb-2">{activeNote.suggestedTitle}</p>
                <button 
                  onClick={applySuggestedTitle}
                  className="text-xs text-[#00ffcc] hover:underline"
                >
                  Apply Title
                </button>
              </div>
            </motion.div>
          )}

          {activeNote.aiSummary && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Summary</h3>
              <div className="p-3 bg-[#1a1d24] rounded-lg border border-gray-800 text-sm leading-relaxed text-gray-300">
                {activeNote.aiSummary}
              </div>
            </motion.div>
          )}

          {activeNote.actionItems && activeNote.actionItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Action Items</h3>
              <div className="p-3 bg-[#1a1d24] rounded-lg border border-gray-800 space-y-2">
                {activeNote.actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AiAssistant;
