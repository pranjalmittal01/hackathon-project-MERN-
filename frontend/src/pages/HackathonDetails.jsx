import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const HackathonDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
   const [hackathons, setHackathons] = useState([]);

  // const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
      const fetchHackathons = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/');
          setHackathons(response.data);
        } catch (error) {
          console.error('Error fetching hackathons:', error);
        }
      };
  
      fetchHackathons();
    }, []);


    useEffect(() => {
      if (!_id) return;
      axios.get(`http://localhost:5000/api/hackathons/${_id}`)
        .then(res => setHackathons(res.data))
        .catch(err => console.error("Failed to fetch hackathon", err));
    }, [_id]);
  
  if (!hackathons) return <div className="p-6 text-red-600">Hackathon not found.</div>;

  const now = new Date();
  const start = new Date(hackathons.startDate);
  const end = new Date(hackathons.endDate);
  const isOngoing = start <= now && end >= now;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-800"><strong>Title: </strong>{hackathons.title}</h1>
      <h3 className="text-2xl font-semibold text-gray-700 mb-2"><strong>Theme: </strong> {hackathons.theme}</h3>
      <p className="text-gray-600 mb-4"><strong>Description: </strong>{hackathons.description}</p>
      <p className="text-gray-600 mb-4"><strong>Organiser: </strong>{hackathons.organiser}</p>
      <p className="text-gray-600 mb-4"><strong>Company: </strong>{hackathons.company}</p>
      <p className="text-gray-600 mb-4"><strong>Prize: </strong>{hackathons.prize}</p>
      <p className="text-gray-600 mb-4"><strong>Location: </strong>{hackathons.location}</p>
      <p className="text-gray-600 mb-4"><strong>Start Registration:</strong> {hackathons.startDate}</p>
      <p className="text-gray-600 mb-4"><strong>End Regstration:</strong> {hackathons.endDate}</p>
      {/* {hackathons.status === 'upcoming' && ( */}
      {isOngoing && (
        <button
          onClick={() => navigate(`/register/${hackathons._id}`)}
          className="bg-green-600 text-white mr-4 px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Register
        </button>
      )}
      {/* )} */}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default HackathonDetails;
