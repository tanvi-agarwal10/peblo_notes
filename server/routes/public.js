import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

router.get('/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    const note = await Note.findOne({ shareId, isPublic: true }).populate('createdBy', 'name');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found or is not public' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
