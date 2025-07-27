import mongoose from 'mongoose';
const HackathonSchema = new mongoose.Schema({
  title: String,
  theme: String,
  description: String,
  startDate: Date,
  endDate: Date,
  organiser: String, // organizer email or userId
  company: String,
  prize: String,
  location: String,
  participants: [String],
});
export default mongoose.model('Hackathon', HackathonSchema);