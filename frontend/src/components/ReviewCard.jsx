const ReviewCard = ({ review, onDelete }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm xs:text-base text-gray-800 dark:text-white">
          <strong>{review.user.firstName} {review.user.lastName}</strong> - {review.rating} ⭐
        </p>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-600 dark:text-red-400 hover:text-red-700 text-sm xs:text-base"
          >
            Delete 🗑️
          </button>
        )}
      </div>
      <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">{review.comment}</p>
      <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-2">
        {new Date(review.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default ReviewCard;