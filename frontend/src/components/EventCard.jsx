import { Link } from 'react-router-dom';

function EventCard({ event }) {
  const statusBadge = {
    Ongoing: 'bg-green-600',
    Expired: 'bg-red-600',
    Future: 'bg-blue-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative">
      <span
        className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded-full ${statusBadge[event.status]}`}
      >
        {event.status}
      </span>
      <img
        src={event.image || 'https://via.placeholder.com/300'}
        alt={event.title}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="text-xl font-bold mt-2">{event.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">
        {event.description?.substring(0, 100)}...
      </p>
      <p className="mt-2">Date: {new Date(event.startDate).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>Price: ₹{event.price || 'Free'}</p>
      <p>Rating: {(event.averageRating || 0).toFixed(1)} ({event.reviewCount || 0} reviews)</p>
      <Link
        to={`/events/${event._id}`}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Details
      </Link>
    </div>
  );
}

export default EventCard;