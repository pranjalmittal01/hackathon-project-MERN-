import { Schema, model } from 'mongoose';
const participantSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
export default model('Participant', participantSchema);