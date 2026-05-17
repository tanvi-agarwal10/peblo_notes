import { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Wand2, Layers, HelpCircle, X, ChevronRight } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { useAiStore } from '../store/aiStore';
import { motion, AnimatePresence } from 'framer-motion';

const AiAssistant = ({ onClose }) => {
  const { notes, activeNoteId, updateNote } = useNoteStore();
  const { generateInsights, performAiAction, isGenerating, error, actionResult, clearResult } = useAiStore();
  const [activeTab, setActiveTab] = useState('insights'); // insights, result

  const activeNote = notes.find(n => n._id === activeNoteId);

  if (!activeNote) return null;

  const handleGenerate = () => {
    generateInsights(activeNoteId);
  };

  const handleAction = async (type) => {
    await performAiAction(activeNoteId, type);
    setActiveTab('result');
  };

  const applySuggestedTitle = () => {
    if (activeNote.suggestedTitle) {
      updateNote(activeNoteId, { title: activeNote.suggestedTitle });
    }
  };

  const applyImprovedWriting = () => {
    if (actionResult?.result) {
      updateNote(activeNoteId, { content: actionResult.result });
      clearResult();
      setActiveTab('insights');
    }
  };

  return (
    <div className="w-80 border-l border-gray-800 bg-[#0a0c10] flex flex-col h-screen overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#0a0c10]/80 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00ffcc]" />
          <span className="font-bold text-lg">AI Assistant</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-800 rounded transition">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'insights' ? (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-6"
            >
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

              {/* Insights Display */}
              <div className="space-y-6">
                {activeNote.suggestedTitle && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Title</h3>
                    <div className="p-3 bg-[#1a1d24] rounded-lg border border-gray-800">
                      <p className="text-sm mb-2">{activeNote.suggestedTitle}</p>
                      <button onClick={applySuggestedTitle} className="text-xs text-[#00ffcc] hover:underline">Apply Title</button>
                    </div>
                  </div>
                )}

                {activeNote.aiSummary && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Summary</h3>
                    <div className="p-3 bg-[#1a1d24] rounded-lg border border-gray-800 text-sm leading-relaxed text-gray-300">
                      {activeNote.aiSummary}
                    </div>
                  </div>
                )}

                {activeNote.actionItems?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Action Items</h3>
                    <div className="p-3 bg-[#1a1d24] rounded-lg border border-gray-800 space-y-2">
                      {activeNote.actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bonus Tools */}
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Bonus Tools</h3>
                <div className="grid gap-2">
                  <ToolButton 
                    icon={<Wand2 className="w-4 h-4" />} 
                    label="Improve Writing" 
                    onClick={() => handleAction('improve')}
                    disabled={isGenerating}
                  />
                  <ToolButton 
                    icon={<Layers className="w-4 h-4" />} 
                    label="Create Flashcards" 
                    onClick={() => handleAction('flashcards')}
                    disabled={isGenerating}
                  />
                  <ToolButton 
                    icon={<HelpCircle className="w-4 h-4" />} 
                    label="Generate Quiz" 
                    onClick={() => handleAction('quiz')}
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#00ffcc]">AI Result</h3>
                <button onClick={() => setActiveTab('insights')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
                  Back to Insights <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 bg-[#1a1d24] rounded-xl border border-gray-800 shadow-xl overflow-y-auto max-h-[70vh]">
                {actionResult?.result && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{actionResult.result}</p>
                    <button 
                      onClick={applyImprovedWriting}
                      className="w-full bg-[#00ffcc] text-black py-2 rounded-lg text-sm font-bold hover:bg-[#00e6b8] transition"
                    >
                      Apply Changes
                    </button>
                  </div>
                )}

                {Array.isArray(actionResult) && actionResult[0]?.q && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">Flashcards</h4>
                    {actionResult.map((card, i) => (
                      <div key={i} className="p-3 bg-[#0f1115] rounded-lg border border-gray-800">
                        <p className="text-xs font-bold text-[#00ffcc] mb-1">Q: {card.q}</p>
                        <p className="text-sm text-gray-300">A: {card.a}</p>
                      </div>
                    ))}
                  </div>
                )}

                {Array.isArray(actionResult) && actionResult[0]?.question && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">Quiz</h4>
                    {actionResult.map((q, i) => (
                      <div key={i} className="p-3 bg-[#0f1115] rounded-lg border border-gray-800 space-y-2">
                        <p className="text-sm font-bold text-gray-200">{i+1}. {q.question}</p>
                        <div className="grid gap-1">
                          {q.options.map((opt, j) => (
                            <div key={j} className={`text-xs p-2 rounded ${opt === q.answer ? 'bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20' : 'bg-gray-800/50 text-gray-400'}`}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ToolButton = ({ icon, label, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1d24] hover:bg-[#252a33] border border-gray-800 rounded-xl transition text-sm text-gray-300 group disabled:opacity-50"
  >
    <div className="flex items-center gap-3">
      <div className="text-gray-500 group-hover:text-[#00ffcc] transition-colors">{icon}</div>
      <span>{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#00ffcc] transition-colors" />
  </button>
);

export default AiAssistant;
