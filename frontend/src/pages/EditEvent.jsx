import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEvent, updateEvent } from '../api';
import Sidebar from '../components/Sidebar';

const EditEvent = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    price: '',
    image: null,
  });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'Faculty' && user.role !== 'Admin')) {
      navigate('/events');
      return;
    }
    getEvent(id)
      .then((res) => {
        const { title, description, startDate, endDate, location, price } = res.data;
        setForm({
          title,
          description,
          startDate: new Date(startDate).toISOString().slice(0, 16),
          endDate: new Date(endDate).toISOString().slice(0, 16),
          location,
          price: price || '',
          image: null,
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load event');
        console.error(err);
      });
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === 'image' && form[key]) {
          formData.append(key, form[key]);
        } else if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      await updateEvent(id, formData);
      alert('Event updated successfully');
      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Edit Event</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-800 dark:text-white">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows="4"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white">Start Date</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white">End Date</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-800 dark:text-white">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
              Update Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;