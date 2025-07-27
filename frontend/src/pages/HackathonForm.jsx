import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const HackathonForm = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      setForm(prev => ({ ...prev, email: user.email }));
    }
  }, []);
    
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      hackathonId: _id,
      ...form
    };

    console.log(payload.hackathon);
    
    console.log("🧪 Submitted Payload:");
    console.table(payload); // See payload clearly
  
    // for (const [key, value] of Object.entries(payload)) {
    //   if (!value) {
    //     console.error(`❌ MISSING FIELD: ${key}`);
    //   }
    // }

    try {
      await axios.post('http://localhost:5000/api/register', payload);
      alert('Registered successfully');
      navigate('/confirmation');
    } catch (err) {
      console.error('Registration failed', err.response?.data || err);
      alert('Registration failed. Check console for details.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6">Register for Hackathon</h2>
        {['name', 'email', 'phone', 'experience', 'skills'].map((field) => (
          <input
            key={field}
            className="w-full mb-4 px-4 py-2 border rounded-md"
            type="text"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required
            readOnly={field === 'email'}
          />
        ))}
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default HackathonForm;
