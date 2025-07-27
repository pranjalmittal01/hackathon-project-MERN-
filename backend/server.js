import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Participant from './models/Participant.js';
import Organiser from './models/Organiser.js';
import Hackathon from './models/Hackathon.js';
import Registration from './models/Registration.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch((err) => console.error(err));

// Auth & User
// API for signup for participant and organiser
app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = role === 'organiser'
      ? await Organiser.findOne({ email })
      : await Participant.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = role === 'organiser'
      ? new Organiser({ name, email, password })
      : new Participant({ name, email, password });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// API for Login for participant and organiser
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = role === 'organiser'
      ? await Organiser.findOne({ email, password })
      : await Participant.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});


// Hackathons API
// API for create Hackathons by organiser 
app.post('/api/hackathons/create', async (req, res) => {
  // console.log('Received body:', req.body); 
  const { title, theme, description, company, startDate, endDate, location, prize, organiser } = req.body;
  try {
    const newHackathon = new Hackathon({ title, theme, description, company, startDate, endDate, location, prize, organiser });
    await newHackathon.save();

    res.status(201).json({ message: 'Hackathon created successfully' });
  } catch (err) {
    console.error('Error creating hackathon:', err);
    res.status(500).json({ error: 'Failed to create hackathon' });
  }
});

// API for Update hackathon by organiser
app.put('/api/hackathons/:id', async (req, res) => {
  try {
    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedHackathon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update hackathon' });
  }
});

// Get hackathon by ID
app.get('/api/hackathons/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hackathon' });
  }
});

// API for fetch all hackathons of a particular organiser by logged in email of organiser in dashboard page
app.get('/api/organiser/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const hackathons = await Hackathon.find({ organiser: email });
    res.json(hackathons);
  } catch (err) {
    console.error('Error fetching organiser hackathons:', err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// API for Get Participants for a Hackathon
app.get('/api/hackathons/:id/participants', async (req, res) => {
  try {
    const registrations = await Registration.find({ hackathonId: req.params.id });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching participants', error: err });
  }
});

// API for delete hackathons by organiser 
app.delete('/api/hackathons/:id', async (req, res) => {
  try {
    await Hackathon.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ hackathonId: req.params.id }); // Clean up registrations
    res.status(200).json({ message: 'Hackathon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting hackathon', error: err });
  }
});

// API for fetch all hackathons created by any organiser is displayed on participant dashboard
app.get('/api/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find({});
    res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hackathons', error });
  }
});



// Registrations
// API for registration in a particular hackathon
app.post('/api/register', async (req, res) => {
  const { hackathonId, name, email, phone, experience, skills } = req.body;

  if (!hackathonId || !name || !email || !phone || !experience || !skills) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {

    const existingRegistration = await Registration.findOne({
      hackathon: hackathonId,
      email: email
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this hackathon' });
    }

    const registration = new Registration({
      hackathon: hackathonId,
      name,
      email,
      phone,
      experience,
      skills,
      timestamp: new Date()
    });

    console.log('Saving registration:', {
      hackathon: hackathonId,
      email,
      name,
      phone,
      experience,
      skills
    });

    await registration.save();
    console.log('Saved registration:', registration);
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// API for 
// Get all registered hackathons for a participant
// server.js or routes file
app.get('/api/registered/:email', async (req, res) => {
  const { email } = req.params;

  console.log(`Fetching registered hackathons for email: ${email}`);

  try {
    const registrations = await Registration.find({ email });
    console.log('Found registrations:', registrations);

    // Make sure IDs are unique:
    const registeredHackathonIds = [
      ...new Set(registrations.map(r => r.hackathon?.toString()).filter(Boolean))
    ];

    console.log('Sending back UNIQUE IDs:', registeredHackathonIds);

    res.json(registeredHackathonIds);

  } catch (err) {
    console.error('Error in /api/registered:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



// app.get('/api/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const hackathon = await Hackathon.findById(id);
//     res.json(hackathon);
//   } catch (err) {
//     console.error('Fetch hackathon error:', err);
//     res.status(500).json({ error: 'Could not fetch hackathon' });
//   }
// });

// API for fetch hackathon details by using the id of created hackathon
app.get('/api/hackathons/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).send('Hackathon not found');
    res.json(hackathon);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
