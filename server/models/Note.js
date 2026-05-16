import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Note' },
  content: { type: String, default: '' },
  tags: [{ type: String }],
  category: { type: String, default: 'Personal' },
  archived: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  shareId: { type: String },
  aiSummary: { type: String, default: '' },
  actionItems: [{ type: String }],
  suggestedTitle: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;
