import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrganizerDashboard = () => {
    // const [events, setEvents] = useState(dummyEvents);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        const email = JSON.parse(localStorage.getItem('user'));
        const fetchHackathons = async () => {
            try {

                const res = await axios.get(`http://localhost:5000/api/organiser/${email.email}`);
                setHackathons(res.data);
            } catch (error) {
                console.error('Failed to fetch organiser hackathons:', error);
            }
        }
        fetchHackathons()
    }, []);

    const deleteHackathon = async (id) => {
        await axios.delete(`http://localhost:5000/api/hackathons/${id}`);
        setHackathons(hackathons.filter(h => h._id !== id));
    };

    const viewParticipants = async (id) => {
        const res = await axios.get(`http://localhost:5000/api/hackathons/${id}/participants`);
        alert(JSON.stringify(res.data, null, 2)); // Replace with a modal in real UI
    };

    const filterHackathons = () => {
        const now = new Date();
        if (filter === 'all') return hackathons;

        return hackathons.filter((h) => {
            const start = new Date(h.startDate);
            const end = new Date(h.endDate);

            if (filter === 'upcoming') return start > now;
            if (filter === 'ongoing') return start <= now && end >= now;
            if (filter === 'past') return end < now;
            return true;
        });
    };

    const filteredHackathons = filterHackathons();


    return (
        <>
            <div className="flex justify-between p-4 bg-[#277c81] items-center mb-6">
                <h2 className="text-3xl text-white font-bold">Organiser Dashboard</h2>
                <div className="space-x-6">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => navigate('/create-hackathon')}
                    >
                        Create New Hackathon
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex gap-4 mb-6">
                    {['all', 'upcoming', 'ongoing', 'past'].map(status => (
                        <button
                            key={status}
                            className={`px-4 py-2 rounded-lg border ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-300'
                                }`}
                            onClick={() => setFilter(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHackathons.map(h => (
                        <div key={h._id} className="bg-blue-100 shadow-md rounded-2xl border">
                            <div className="p-4">
                                <h2 className="text-2xl rounded p-2 text-white text-center font-semibold mb-2 bg-teal-800 capitalize">{h.title}</h2>

                                <div className="justify-between bg-[#3c9999] p-1 rounded text-center mb-4">
                                    <p className="text-lg text-gray-900 mb-1 capitalize"><b className='mr-2'>Theme: </b> {h.theme}</p>
                                    <p className="text-gray-900 text-sm capitalize">{h.description}</p>
                                </div>

                                <p className="text-lg text-gray-600 mb-1"><b className='mr-2'>Company: </b>{h.company}</p>
                                <p className="text-lg text-gray-600"><b className='mr-2'>Organiser: </b>{h.organiser}</p>

                                <div className="justify-between flex mt-4">
                                    <p className="text-lg text-gray-600"><b className='mr-2'>Prize: </b> {h.prize} Rs.</p>
                                    <p className="text-lg text-gray-600 capitalize"><b className='mr-2'>Location: </b> {h.location}</p>
                                </div>
                                <p className="text-lg font-semibold border p-1 border-gray-600 text-gray-700 text-center mt-4">{new Date(h.startDate).toLocaleDateString()} to {new Date(h.endDate).toLocaleDateString()}</p>
                            </div>

                            <div className="bottom-0 flex gap-2 mt-4  justify-evenly bg-[#9ac4b0] rounded-b-2xl p-4">
                                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded" onClick={() => navigate(`/create-hackathon/${h._id}`)}>Edit</button>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => deleteHackathon(h._id)}>Delete</button>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onClick={() => viewParticipants(h._id)}>View Participants</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        </>
    );
};

export default OrganizerDashboard;
