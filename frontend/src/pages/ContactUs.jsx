import { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ContactUs = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required 🚨');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address 📧');
      return;
    }
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setSuccess('Your message has been sent successfully! 🎉');
      setFormData({ name: '', email: '', message: '' });
      setError('');
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 sm:p-8 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="container mx-auto text-center">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 animate-fade-in">
          Contact Us 📬
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 xs:mb-8 max-w-md xs:max-w-lg sm:max-w-2xl mx-auto animate-fade-in-up">
          Have questions or feedback? Reach out to us, and we'll get back to you as soon as possible!
        </p>

        {/* Contact Image */}
        <div className="mb-12 xs:mb-16">
          <img
            src="https://www.gotion.com/wp-content/uploads/2022/05/contact.jpg"
            alt="Communication Hub"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg object-cover h-48 xs:h-56 sm:h-72 md:h-96 lg:h-[32rem] animate-fade-in"
            loading="lazy"
          />
          <p className="mt-4 text-sm xs:text-base text-gray-600 dark:text-gray-300">
            We're here to help you plan your next event! 📞
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-lg xs:max-w-xl sm:max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg animate-fade-in-up">
            {error && <p className="text-red-600 mb-4 text-sm xs:text-base text-center">{error}</p>}
            {success && <p className="text-green-600 mb-4 text-sm xs:text-base text-center">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-800 dark:text-white text-sm xs:text-base">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-sm xs:text-base"
                  rows="5"
                  placeholder="Your Message"
                />
              </div>
              <button
                type="submit"
                className="btn-primary transform hover:scale-105 transition-transform duration-300"
              >
                Send Message 🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;