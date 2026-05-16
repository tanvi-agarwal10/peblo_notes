import express from 'express';
import { getNotes, createNote, updateNote, deleteNote, searchNotes, getNotesByTag } from '../controllers/noteController.js';
import { generateAiInsights } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All note routes require authentication

router.get('/search', searchNotes);
router.get('/tag/:tag', getNotesByTag);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.post('/:id/generate-ai', generateAiInsights);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

export default router;
