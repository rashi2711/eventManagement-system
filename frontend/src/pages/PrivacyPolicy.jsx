import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const PrivacyPolicy = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 xs:p-6 sm:p-8 ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div className="container mx-auto">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 text-center animate-fade-in">
          Privacy Policy 🔒
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 xs:mb-8 max-w-md xs:max-w-lg sm:max-w-2xl mx-auto text-center animate-fade-in-up">
          At EventSphere, we are committed to protecting your privacy and ensuring the security of your personal information. Learn how we collect, use, and safeguard your data.
        </p>

        {/* Privacy Image */}
        <div className="mb-12 xs:mb-16">
          <img
            src="https://plus.unsplash.com/premium_photo-1677093905869-6ba35fab7b61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJpdmFjeSUyMHBvbGljeXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Data Security"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg object-cover h-48 xs:h-56 sm:h-72 md:h-96 lg:h-[32rem] animate-fade-in"
            loading="lazy"
          />
          <p className="mt-4 text-sm xs:text-base text-gray-600 dark:text-gray-300 text-center">
            Your data is safe with us! 🔐
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 xs:p-6 sm:p-8 rounded-lg shadow-lg animate-fade-in-up">
          <section className="mb-6 xs:mb-8">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">1. Information We Collect</h2>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
              We collect personal information such as your name, email address, and event preferences when you register, RSVP, or interact with our platform. We also gather usage data, including IP addresses and browsing behavior, to improve our services.
            </p>
          </section>
          <section className="mb-6 xs:mb-8">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">2. How We Use Your Information</h2>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
              Your data is used to provide and personalize our services, process RSVPs, send event notifications, and enhance user experience. We may also use anonymized data for analytics and marketing purposes.
            </p>
          </section>
          <section className="mb-6 xs:mb-8">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">3. Data Sharing and Security</h2>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
              We do not sell your personal information. Data is shared only with trusted partners (e.g., payment processors) to facilitate services. We implement industry-standard security measures, including encryption, to protect your information.
            </p>
          </section>
          <section className="mb-6 xs:mb-8">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">4. Your Rights</h2>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
              You have the right to access, update, or delete your personal information. Contact us at privacy@eventsphere.com to exercise these rights or to learn more about our data practices.
            </p>
          </section>
          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2 xs:mb-3">5. Contact Us</h2>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300">
              For questions about this Privacy Policy, please reach out to us at <a href="mailto:privacy@eventsphere.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@eventsphere.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;