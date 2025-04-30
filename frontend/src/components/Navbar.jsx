import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg xs:text-xl font-bold text-gray-800 dark:text-white">
          EventSphere 
        </Link>
        <div className="xs:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none"
          >
            <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'} text-lg`}></i>
          </button>
        </div>
        <div className={`xs:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} xs:block`}>
          <ul className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-4">
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
            {!user ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                  >
                    Login 🔑
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                  >
                    Signup 📝
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                  >
                    Dashboard 📊
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm xs:text-base"
                  >
                    Events 🎫
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 hover:underline text-sm xs:text-base"
                  >
                    Logout 🚪
                  </button>
                </li>
              </>
            )}
          </ul>
          <button
            onClick={toggleTheme}
            className="mt-2 xs:mt-0 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 text-sm xs:text-base"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} text-lg`}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;