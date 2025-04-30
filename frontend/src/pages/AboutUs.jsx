import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const AboutUs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 sm:p-8 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="container mx-auto text-center">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 animate-fade-in">
          About EventSphere 
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 xs:mb-8 max-w-md xs:max-w-lg sm:max-w-2xl mx-auto animate-fade-in-up">
          EventSphere is your go-to platform for discovering, managing, and celebrating unforgettable events. We connect communities through seamless event planning and memorable experiences.
        </p>

        {/* About Image */}
        <div className="mb-12 xs:mb-16">
          <img
            src="https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070&auto=format&fit=crop"
            alt="Community Gathering"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg object-cover h-48 xs:h-56 sm:h-72 md:h-96 lg:h-[32rem] animate-fade-in"
            loading="lazy"
          />
          <p className="mt-4 text-sm xs:text-base text-gray-600 dark:text-gray-300">
            Building vibrant communities through shared experiences 🌟
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-12 xs:mb-16">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4 xs:mb-6 animate-fade-in">
            Our Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8">
            <div className="bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg animate-fade-in-up">
              <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-2">Mission</h3>
              <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
                To empower individuals and organizations to create and attend events that inspire, connect, and celebrate life's moments.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-2">Vision</h3>
              <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
                To be the global leader in event management, fostering communities through innovative technology and unforgettable experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;