import { GoogleGenerativeAI } from '@google/generative-ai';
import Note from '../models/Note.js';

export const generateAiInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!note.content || note.content.trim() === '') {
      return res.status(400).json({ message: 'Note is empty, cannot generate insights.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Analyze this note and return ONLY JSON with the following structure:
    {
      "summary": "string",
      "action_items": ["string"],
      "suggested_title": "string"
    }
    
    Note Content:
    ${note.content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean markdown formatting if present
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '');
    }

    const parsedJson = JSON.parse(text);

    note.aiSummary = parsedJson.summary || '';
    note.actionItems = parsedJson.action_items || [];
    note.suggestedTitle = parsedJson.suggested_title || '';
    
    await note.save();

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate AI insights' });
  }
};
