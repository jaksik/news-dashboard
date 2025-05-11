import mongoose from 'mongoose';

export interface IPost {
  _id: mongoose.Types.ObjectId;
  title: string;
  link: string;
  image?: string;
  source: string;
  datetime: Date;
  time: string;
  articleType: string;
  searchTerm: string;
  createdAt: Date;
}

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