// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     const res = await axios.post('http://localhost:5000/api/login', { email, password });
//     if (res.data) {
//       localStorage.setItem('user', JSON.stringify(res.data));
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//       <div className="bg-gray-700 p-10 rounded-2xl shadow-xl w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center text-white mb-6">Login / Signup</h2>
        
//         <input className="input mt-2 p-2 border rounded w-full" autoComplete="username" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//         <input className="input mt-2 p-2 border rounded w-full" autoComplete="current-password" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
//         <button onClick={handleLogin} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
//           Sign Up / Login
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;





import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password, role });
      if (response.status === 200) {
        const { name } = response.data;
        localStorage.setItem('user', JSON.stringify({ name, email, role }));  
        navigate(role === 'organiser' ? '/organiser-dashboard' : '/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login Failed! Please Try Again');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full px-4 py-2 border rounded-md" type="email" placeholder="Email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded-md" type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <select className="w-full px-4 py-2 border rounded-md" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="participant">Participant</option>
            <option value="organiser">Organiser</option>
          </select>
          <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Login</button>
        </form>
        <p className="text-sm text-center mt-4">Don't have an account? <Link to="/signup" className="text-blue-500">Signup</Link></p>
      </div>
    </div>
  );
};

export default Login;