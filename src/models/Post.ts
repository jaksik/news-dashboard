import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  articleType: {
    type: String,
    required: true,
  },
  searchTerm: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.articles || mongoose.model('articles', PostSchema);