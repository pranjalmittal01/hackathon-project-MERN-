import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HackathonForm from './pages/HackathonForm';
import HackathonDetails from './pages/HackathonDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Confirmation from './pages/Confirmation';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateHackathon from './pages/CreateHackathon';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/register/:_id" element={<ProtectedRoute><HackathonForm /></ProtectedRoute>} />
      <Route path="/details/:_id" element={<ProtectedRoute><HackathonDetails /></ProtectedRoute>} />
      <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
      <Route path="/organiser-dashboard" element={<OrganizerDashboard />} />
      <Route path="/create-hackathon/:id?" element={<ProtectedRoute><CreateHackathon /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;