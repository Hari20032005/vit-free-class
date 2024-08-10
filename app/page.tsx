'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    day: '',
    type: 'classroom',
    time: '',
    floor: '',
    building: '',
    room: ''
  });
  const [schedules, setSchedules] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });
    if (response.ok) {
      fetchSchedules(); // Refresh the schedule list
      setForm({
        day: '',
        type: 'classroom',
        time: '',
        floor: '',
        building: '',
        room: ''
      });
    }
  };

  const fetchSchedules = async () => {
    const response = await fetch('/api/schedules');
    const data = await response.json();
    setSchedules(data.schedules);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Schedule</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Day</label>
            <input
              type="text"
              name="day"
              value={form.day}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            >
              <option value="classroom">Classroom</option>
              <option value="lab">Lab</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Time</label>
            <input
              type="text"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Floor</label>
            <input
              type="number"
              name="floor"
              value={form.floor}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Building</label>
            <input
              type="text"
              name="building"
              value={form.building}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Room</label>
            <input
              type="text"
              name="room"
              value={form.room}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Schedule Entries</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr>
            <th className="border px-4 py-2">Day</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Floor</th>
            <th className="border px-4 py-2">Building</th>
            <th className="border px-4 py-2">Room</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="border px-4 py-2">{schedule.day}</td>
              <td className="border px-4 py-2">{schedule.type}</td>
              <td className="border px-4 py-2">{schedule.time}</td>
              <td className="border px-4 py-2">{schedule.floor}</td>
              <td className="border px-4 py-2">{schedule.building}</td>
              <td className="border px-4 py-2">{schedule.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
