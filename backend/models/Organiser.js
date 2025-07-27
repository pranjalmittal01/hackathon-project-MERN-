import { Schema, model } from 'mongoose';
const organiserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
export default model('Organiser', organiserSchema);