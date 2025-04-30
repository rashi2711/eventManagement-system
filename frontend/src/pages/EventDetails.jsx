import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getEvent, createReview, deleteReview, deleteEvent } from '../api';
import Sidebar from '../components/Sidebar';
import ReviewCard from '../components/ReviewCard';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getEvent(id)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load event 🚨');
        console.error(err);
      });
  }, [id, user, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== 'Student') {
      setError('Only students can submit reviews 🚫');
      return;
    }
    try {
      await createReview(id, review);
      alert('Review submitted successfully 🌟');
      setReview({ rating: 5, comment: '' });
      const res = await getEvent(id);
      setEvent(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review 🚨');
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? ❓')) {
      try {
        await deleteReview(reviewId);
        alert('Review deleted successfully 🗑️');
        const res = await getEvent(id);
        setEvent(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete review 🚨');
        console.error(err);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event? ❓')) {
      try {
        await deleteEvent(id);
        alert('Event deleted successfully 🗑️');
        navigate('/events');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete event 🚨');
        console.error(err);
      }
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 xs:p-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base">Loading... ⏳</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col xs:flex-row bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 xs:p-6 sm:p-8">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center xs:text-left">
          {event.title} 🎉
        </h2>
        {error && <p className="text-red-600 mb-4 text-center text-sm xs:text-base">{error}</p>}
        <div className="card mb-4 xs:mb-6">
          <img
            src={event.image || 'https://via.placeholder.com/600'}
            alt={event.title}
            className="w-full h-48 xs:h-56 sm:h-64 object-cover rounded-md mb-4"
          />
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm xs:text-base">
            <strong>Date:</strong> {new Date(event.date).toLocaleString()} 📅
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm xs:text-base">
            <strong>Location:</strong> {event.location} 📍
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm xs:text-base">
            <strong>Price:</strong> ₹{event.price || 'Free'} 💸
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm xs:text-base">
            <strong>Description:</strong> {event.description} 📝
          </p>
          {user?.role === 'Faculty' && (
            <div className="mt-4 flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
              <button
                onClick={() => navigate(`/edit-event/${event._id}`)}
                className="bg-yellow-600 text-white px-3 py-2 xs:px-4 xs:py-2 rounded-lg hover:bg-yellow-700 text-sm xs:text-base"
              >
                Edit Event ✏️
              </button>
              <button
                onClick={handleDeleteEvent}
                className="bg-red-600 text-white px-3 py-2 xs:px-4 xs:py-2 rounded-lg hover:bg-red-700 text-sm xs:text-base"
              >
                Delete Event 🗑️
              </button>
            </div>
          )}
          {user?.role === 'Student' && (
            <button
              onClick={() => navigate(`/rsvp/${event._id}`)}
              className="mt-4 btn-primary"
            >
              RSVP Now 🚀
            </button>
          )}
        </div>

        {user?.role === 'Student' && (
          <div className="card mb-4 xs:mb-6">
            <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-3 xs:mb-4">Leave a Review 🌟</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Rating</label>
                <select
                  value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r} ⭐</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                  rows="4"
                  placeholder="Share your experience! 📝"
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
              >
                Submit Review 🚀
              </button>
            </form>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-3 xs:mb-4">Reviews 🌟</h3>
          {event.reviews?.length > 0 ? (
            <div className="space-y-4">
              {event.reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onDelete={user?.role === 'Faculty' ? () => handleDeleteReview(review._id) : null}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-sm xs:text-base">No reviews yet 😔</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;