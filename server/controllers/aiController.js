import Groq from 'groq-sdk';
import Note from '../models/Note.js';

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : '';
  console.log('Groq Key Loaded:', apiKey ? `Starts with ${apiKey.substring(0, 5)}...` : 'MISSING');
  return new Groq({ apiKey });
};

export const generateAiInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.createdBy.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    if (!note.content || note.content.trim() === '') return res.status(400).json({ message: 'Note is empty.' });

    const groq = getGroqClient();
    
    const prompt = `Analyze this note and return ONLY a valid JSON object with the following structure:
    {
      "summary": "concise summary",
      "action_items": ["task 1", "task 2"],
      "suggested_title": "catchy title"
    }
    
    Content:
    ${note.content}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const parsedJson = JSON.parse(completion.choices[0].message.content);

    note.aiSummary = parsedJson.summary || '';
    note.actionItems = parsedJson.action_items || [];
    note.suggestedTitle = parsedJson.suggested_title || '';
    
    await note.save();
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Groq AI insights failed' });
  }
};

export const processAiAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.createdBy.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const groq = getGroqClient();
    let prompt = '';
    let jsonMode = false;

    switch (type) {
      case 'improve':
        prompt = `Rewrite the following note to be professional and clear. Return ONLY the improved text.\n\nContent:\n${note.content}`;
        break;
      case 'flashcards':
        prompt = `Create 5-8 flashcards based on this note. Return ONLY a JSON array: [{"q": "question", "a": "answer"}].\n\nContent:\n${note.content}`;
        jsonMode = true;
        break;
      case 'quiz':
        prompt = `Create a 5-question multiple choice quiz. Return ONLY a JSON array: [{"question": "string", "options": ["a", "b", "c", "d"], "answer": "string (option text)"}].\n\nContent:\n${note.content}`;
        jsonMode = true;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: jsonMode ? { type: 'json_object' } : undefined
    });

    let result = completion.choices[0].message.content;
    
    if (jsonMode) {
      // Groq sometimes wraps in a root object if you ask for an array in json_object mode
      const parsed = JSON.parse(result);
      return res.json(Array.isArray(parsed) ? parsed : (Object.values(parsed)[0] || parsed));
    }

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Groq AI action failed' });
  }
};
