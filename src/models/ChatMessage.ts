import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isUserMessage: {
    type: Boolean,
    required: true,
  },
  zodiacSign: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  isPaidSession: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Index for faster queries
chatMessageSchema.index({ userId: 1, sessionId: 1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
