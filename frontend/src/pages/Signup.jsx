// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Signup() {
//   const [form, setForm] = useState({});
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSignup = async () => {
//     const res = await axios.post('http://localhost:5000/api/signup', form);
//     if (res.data) navigate('/');
//   };

//   return (
//     <form>
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//         <div className="bg-gray-700 p-10 rounded-2xl shadow-xl w-full max-w-md">
//           <h2 className="text-2xl font-bold text-center text-white mb-6">Login / Signup</h2>
//           <input name="name" className="input mt-2 p-2 border rounded w-full" placeholder="Name" onChange={handleChange} required />
//           <input name="email" className="input mt-2 p-2 border rounded w-full" placeholder="Email" autoComplete="username" onChange={handleChange} required />
//           <input name="password" className="input mt-2 p-2 border rounded w-full" type="password" placeholder="Password" onChange={handleChange} autoComplete="new-password" required />
//           <select name="role" className="input mt-2 p-2 border rounded w-full" onChange={handleChange}>
//             <option value="participant">Participant</option>
//             <option value="organizer">Organizer</option>
//           </select>
//           <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={handleSignup}>Signup</button>

//         </div>
//       </div>
//     </form>
//   );
// }

// export default Signup;




import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', { name, email, password, role });
      if (response.status === 201) {
        localStorage.setItem('user', JSON.stringify({ name, email, role }));
        navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input className="w-full px-4 py-2 border rounded-md" type="text" placeholder="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded-md" type="email" placeholder="Email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded-md" type="password" placeholder="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <select className="w-full px-4 py-2 border rounded-md" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="participant">Participant</option>
            <option value="organiser">Organiser</option>
          </select>
          <button className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">Signup</button>
        </form>
        <p className="text-sm text-center mt-4">Already a user? <Link to="/" className="text-purple-500">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;