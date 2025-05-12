import mongoose from 'mongoose';

export interface IRating {
  _id: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  userId: string;
  rating: number;
  createdAt: Date;
}

const RatingSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'articles'
  },
  userId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one rating per user per post
RatingSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.ratings || mongoose.model('ratings', RatingSchema);