import Note from '../models/Note.js';
import { v4 as uuidv4 } from 'uuid';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      createdBy: req.user._id,
      title: 'Untitled Note',
      content: ''
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    // Escape special regex characters
    const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const notes = await Note.find({
      createdBy: req.user._id,
      $or: [
        { title: { $regex: safeQuery, $options: 'i' } },
        { content: { $regex: safeQuery, $options: 'i' } },
        { tags: { $regex: safeQuery, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotesByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const notes = await Note.find({
      createdBy: req.user._id,
      tags: tag
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const shareNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    note.isPublic = true;
    if (!note.shareId) {
      note.shareId = uuidv4();
    }
    
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
