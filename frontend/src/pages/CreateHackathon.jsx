import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateHackathon = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        title: '',
        theme: '',
        description: '',
        company: '',
        startDate: '',
        endDate: '',
        location: '',
        prize: ''
    });
    const organiser = JSON.parse(localStorage.getItem('user'))?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:5000/api/hackathons/${id}`, form);
                alert('Hackathon Updated');
            } else {
                await axios.post('http://localhost:5000/api/hackathons/create', { ...form, organiser });
                alert('Hackathon Created');
            }
            navigate('/organiser-dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to create hackathon');
        }
    };

    // for edit hackathon
    useEffect(() => {
        if (id) {
            const fetchHackathon = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/hackathons/${id}`);
                    const { title, theme, description, company, startDate, endDate, location, prize } = res.data;
                    setForm({
                        title,
                        theme,
                        description,
                        company,
                        startDate: startDate.slice(0, 10), // to fit input type="date"
                        endDate: endDate.slice(0, 10),
                        location,
                        prize
                    });
                } catch (err) {
                    console.error('Failed to load hackathon:', err);
                }
            };
            fetchHackathon();
        }
    }, [id]);

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">{id ? 'Edit Hackathon' : 'Create Hackathon'}</h1>
            <form className="p-6 bg-white shadow rounded-md" onSubmit={handleSubmit}>
                <label htmlFor='title'>Title:</label>
                <input
                    type='text'
                    className="w-full mb-4 px-4 py-2 border rounded"
                    name="title" placeholder="Title"
                    value={form.title || ''}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                />

                <label htmlFor="theme">Theme:</label>
                <input
                    type='text'
                    className="w-full mb-4 px-4 p-2 border rounded"
                    name="theme" placeholder="Theme"
                    onChange={e => setForm({ ...form, theme: e.target.value })}
                    value={form.theme || ''}
                    required
                />

                <label htmlFor="company details">Company Details:</label>
                <input
                    type='text'
                    className="w-full mb-4 px-4 py-2 border rounded"
                    name="company" placeholder="Company Details"
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    value={form.company || ''}
                    required
                />

                <label htmlFor="location">Location:</label>
                <input
                    type='text'
                    className="w-full mb-4 px-4 py-2 border rounded"
                    name="location" placeholder="Location"
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    value={form.location || ''}
                    required
                />

                <label htmlFor="prize">Prize:</label>
                <input
                    type='text'
                    className="w-full mb-4 px-4 py-2 border rounded"
                    name="prize" placeholder="Prize"
                    onChange={e => setForm({ ...form, prize: e.target.value })}
                    value={form.prize || ''}
                    required
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    className="w-full mb-4 px-4 py-2 border rounded"
                    name="description" placeholder="Description"
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    value={form.description || ''}
                    required
                />


                <div className="flex gap-6">

                    <div className="">
                        <label htmlFor="start date">Start Registration:</label>
                        <input
                            name="startDate" type="date"
                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                            className="w-full mb-4 px-4 py-2 border rounded"
                            value={form.startDate || ''}
                            required
                        />
                    </div>

                    <div className="">
                        <label htmlFor="end date">End Registration:</label>
                        <input
                            name="endDate" type="date"
                            onChange={e => setForm({ ...form, endDate: e.target.value })}
                            className="w-full mb-4 px-4 py-2 border rounded"
                            value={form.endDate || ''}
                            required
                        />
                    </div>

                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {id ? 'Edit Hackathon' : 'Create Hackathon'}
                </button>
            </form>
        </div>
    );
};

export default CreateHackathon;
