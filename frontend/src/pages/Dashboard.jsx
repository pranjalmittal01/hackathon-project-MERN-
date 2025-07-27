import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const email = JSON.parse(localStorage.getItem('user'))?.email;

  useEffect(() => {
    const fetchData = async () => {
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const [hackathonRes, registeredRes] = await Promise.all([
          axios.get('http://localhost:5000/api/'),
          axios.get(`http://localhost:5000/api/registered/${email}`)
        ]);

        console.log('All Hackathons:', hackathonRes.data);
        console.log('Registered IDs:', registeredRes.data);

        setHackathons(hackathonRes.data || []);
        setRegisteredHackathons(registeredRes.data || []);
      } catch (err) {
        console.error('Error loading data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const now = new Date();

const filteredHackathons = hackathons.filter(h => {
  const start = new Date(h.startDate);
  const end = new Date(h.endDate);

  if (filter === 'upcoming') return start > now;
  if (filter === 'ongoing') return start <= now && end >= now;
  if (filter === 'past') return end < now;
  if (filter === 'registered') {
    // handle _id shape: plain string vs {$oid}
    const id = h._id?.$oid ? h._id.$oid : String(h._id);
    return registeredHackathons.includes(id);
  }
});


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!email) {
    return <div className="p-6">Please log in to view hackathons.</div>;
  }

  return (
    <>
      <div className="flex justify-between p-4 bg-[#277c81] items-center mb-6">
        <h2 className="text-3xl text-white font-bold">Participant Dashboard</h2>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          {['upcoming', 'ongoing', 'past', 'registered'].map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg border ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredHackathons.length === 0 ? (
          <p className="text-center text-gray-600">
            {filter === 'registered'
              ? "You haven't registered for any hackathons yet."
              : `No ${filter} hackathons to display.`}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map(h => {
              const isRegistered = registeredHackathons.includes(String(h._id));
              const isOngoing = new Date(h.startDate) <= now && new Date(h.endDate) >= now;
              const isUpcoming = new Date(h.startDate) > now;

              return (
                <div key={h._id} className="bg-blue-100 rounded-2xl shadow-md border">
                  <div className="p-4">
                    <h2 className="text-2xl text-center bg-teal-800 rounded text-white p-2 capitalize font-semibold mb-2">
                      {h.title}
                    </h2>
                    <p className="text-gray-900 bg-[#3c9999] p-1 rounded text-center font-semibold text-xl capitalize">
                      <b className='font-semibold mr-2'>Theme:</b> {h.theme}
                    </p>
                    <div className="flex justify-between mt-4">
                      <p className="text-gray-700 font-semibold text-lg">
                        <b>Prize:</b> {h.prize} Rs.
                      </p>
                      <p className="text-gray-700 font-semibold text-lg capitalize">
                        <b>Location:</b> {h.location}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-center text-gray-700 mt-6 border p-1 border-gray-600">
                      {new Date(h.startDate).toLocaleDateString()} - {new Date(h.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-6 justify-evenly bg-[#b6e3ce] rounded-b-2xl p-4">
                    {(isOngoing || isUpcoming) && (
                      <button
                        onClick={() => navigate(`/register/${h._id}`)}
                        className={`px-4 py-2 rounded ${
                          isRegistered
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-green-700 hover:bg-green-800 text-white'
                        }`}
                        disabled={isRegistered}
                      >
                        {isRegistered ? 'Registered' : 'Register'}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/details/${h._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
