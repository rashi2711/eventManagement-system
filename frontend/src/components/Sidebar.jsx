import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`fixed sm:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 transition-transform duration-300 ease-in-out z-50 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="flex items-center justify-between p-4 xs:p-6 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg xs:text-xl font-bold text-gray-800 dark:text-white">Dashboard Menu</h2>
        <button onClick={toggleSidebar} className="sm:hidden text-gray-600 dark:text-gray-300">
          <i className={`fas fa-${isOpen ? 'times' : 'bars'} text-lg`}></i>
        </button>
      </div>
      <nav className="p-4 xs:p-6">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
            >
              Dashboard 📊
            </Link>
          </li>
          <li>
            <Link
              to="/events"
              className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
            >
              Events 🎫
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
            >
              Profile 👤
            </Link>
          </li>
          {user?.role === 'Student' && (
            <li>
              <Link
                to="/tickets"
                className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
              >
                Tickets 🎟️
              </Link>
            </li>
          )}
          {(user?.role === 'Faculty' || user?.role === 'StudentAdmin') && (
            <>
              <li>
                <Link
                  to="/create-event"
                  className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
                >
                  Create Event ➕
                </Link>
              </li>
              <li>
                <Link
                  to="/payments"
                  className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
                >
                  Payments 💸
                </Link>
              </li>
            </>
          )}
          {user?.role === 'StudentAdmin' && (
            <li>
              <Link
                to="/admin/users"
                className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
              >
                Manage Users 👥
              </Link>
            </li>
          )}
          <li className="pt-4">
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 dark:text-white mb-2">Payments</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/payments"
                  className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
                >
                  Payment Details 💳
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-receipt"
                  className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
                >
                  Payment Receipt 📄
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-history"
                  className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
                >
                  Payment History 📜
                </Link>
              </li>
            </ul>
          </li>
          {user?.role === 'Student' && (
            <li className="pt-4">
              <h3 className="text-sm xs:text-base font-semibold text-gray-800 dark:text-white mb-2">RSVP</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/rsvp"
                    className="block p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm xs:text-base"
                  >
                    RSVP Form 📝
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;