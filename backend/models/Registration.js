import mongoose from 'mongoose';
const RegistrationSchema = new mongoose.Schema({
  hackathon: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hackathon' 
  },
  name: String,
  email: String,
  phone: String,
  experience: String,
  skills: String,
});

RegistrationSchema.index({ email: 1, hackathon: 1 }, { unique: true });
export default mongoose.model('Registration', RegistrationSchema);