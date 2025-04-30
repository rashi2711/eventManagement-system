import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`bg-gray-200 dark:bg-gray-800 py-6 xs:py-8 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="container mx-auto px-4 xs:px-6 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 mb-6 xs:mb-8">
          <div>
            <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">EventSphere</h3>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
              Connecting communities through unforgettable events. Join us to discover, manage, and celebrate!
            </p>
          </div>
          <div>
            <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                >
                  Home 🏠
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                >
                  About Us ℹ️
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                >
                  Contact Us 📬
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                >
                  Privacy Policy 🔒
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg xs:text-xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">Contact</h3>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
              Email: <a href="mailto:support@eventsphere.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@eventsphere.com</a>
            </p>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">Phone: +1-800-EVENTS</p>
          </div>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-600 pt-4 xs:pt-6">
          <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} EventSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;