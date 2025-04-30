import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { createEvent } from '../api';

function CreateEvent() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    section: '',
    subsection: '',
    price: '',
    capacity: '',
    status: 'pending',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if user is not authorized
  if (!user || !['Faculty', 'StudentAdmin'].includes(user.role)) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (!formData.section.trim()) newErrors.section = 'Section is required';
    if (!formData.subsection.trim()) newErrors.subsection = 'Subsection is required';
    const capacityNum = parseInt(formData.capacity);
    if (!formData.capacity || isNaN(capacityNum) || capacityNum < 1) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    const priceNum = parseFloat(formData.price);
    if (formData.price && (isNaN(priceNum) || priceNum < 0)) {
      newErrors.price = 'Price must be a non-negative number';
    }
    if (formData.image && !formData.image.type.startsWith('image/')) {
      newErrors.image = 'Only image files are allowed';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('time', formData.time);
    data.append('location', formData.location);
    data.append('section', formData.section);
    data.append('subsection', formData.subsection);
    data.append('price', formData.price || '0');
    data.append('capacity', formData.capacity);
    data.append('status', formData.status);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await createEvent(data);
      alert('Event created successfully!');
      navigate('/events');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to create event' });
      console.error('Create event error:', err.response?.data);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="bg-white dark:bg-gray-800 p-8 shadow-lg w-full ">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Create Event
        </h2>
        {errors.submit && <p className="text-red-600 mb-4 text-center">{errors.submit}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Event Name"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Event description"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Event location"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Section</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., Main Hall"
            />
            {errors.section && <p className="text-red-600 text-sm">{errors.section}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Subsection</label>
            <input
              type="text"
              name="subsection"
              value={formData.subsection}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., Room A"
            />
            {errors.subsection && <p className="text-red-600 text-sm">{errors.subsection}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="0"
              min="0"
              step="0.01"
            />
            {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="100"
              min="1"
            />
            {errors.capacity && <p className="text-red-600 text-sm">{errors.capacity}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-white">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              accept="image/*"
            />
            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;