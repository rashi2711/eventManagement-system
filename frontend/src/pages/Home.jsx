import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 sm:p-8 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="container mx-auto text-center">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 animate-fade-in">
          Welcome to EventSphere 
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 xs:mb-8 max-w-md xs:max-w-lg sm:max-w-2xl mx-auto animate-fade-in-up">
          Discover and join exciting events, manage your RSVPs, and create unforgettable memories with EventSphere!
        </p>
        <div className="flex flex-col xs:flex-row justify-center space-y-4 xs:space-y-0 xs:space-x-4 mb-8 xs:mb-12">
          <Link
            to="/events"
            className="btn-primary transform hover:scale-105 transition-transform duration-300"
          >
            Explore Events 🎫
          </Link>
          <Link
            to="/signup"
            className="bg-secondary text-white px-3 py-2 xs:px-4 xs:py-2 rounded-lg hover:bg-teal-600 w-full xs:w-auto transition duration-300 text-sm xs:text-base transform hover:scale-105"
          >
            Get Started 🚀
          </Link>
        </div>

        {/* Event Image */}
        <div className="mb-12 xs:mb-16">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop"
            alt="Vibrant Music Festival"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg object-cover h-48 xs:h-56 sm:h-72 md:h-96 lg:h-[32rem] animate-fade-in"
            loading="lazy"
          />
          <p className="mt-4 text-sm xs:text-base text-gray-600 dark:text-gray-300">
            Experience the thrill of live events with EventSphere! 🎤🎶
          </p>
        </div>

        {/* Calendar Section */}
        <div className="mb-12 xs:mb-16">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4 xs:mb-6 animate-fade-in">
            Upcoming Events 📅
          </h2>
          <img
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070&auto=format&fit=crop"
            alt="Event Planning Calendar"
            className="w-full max-w-3xl mx-auto rounded-lg shadow-lg object-cover h-40 xs:h-48 sm:h-56 md:h-72 animate-fade-in-up"
            loading="lazy"
          />
          <p className="mt-4 text-sm xs:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Plan your next adventure with our event calendar! 🗓️
          </p>
          <Link
            to="/events"
            className="mt-4 inline-block bg-primary text-white px-3 py-2 xs:px-4 xs:py-2 rounded-lg hover:bg-blue-700 text-sm xs:text-base transition duration-300"
          >
            View All Events 🚀
          </Link>
        </div>

        {/* Previous Events Success Section */}
        <div className="mb-12 xs:mb-16">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4 xs:mb-6 animate-fade-in">
            Past Event Highlights 🌟
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
            {[
              {
                src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
                alt: 'Live Concert',
                caption: 'Rocking Concert Night 🎸',
              },
              {
                src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
                alt: 'Tech Conference',
                caption: 'Tech Summit 2024 🖥️',
              },
              {
                src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D',
                alt: 'Cultural Festival',
                caption: 'Vibrant Cultural Fest 🎭',
              },
            ].map((event, index) => (
              <div key={index} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <img
                  src={event.src}
                  alt={event.alt}
                  className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <p className="text-white text-sm xs:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {event.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;