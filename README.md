EventSphere - Event Management System
Final Project Submission - Batch 2026, April 2025

EventSphere is a full-stack web application designed to streamline event management for students, faculty, and admins. It enables users to create, RSVP, pay for, and review events with role-based access control, a responsive UI, and secure integrations. This project showcases skills in React, Node.js, MongoDB, and payment gateway integration, developed as part of the academic curriculum.

Features:-
1.User Authentication: Signup with OTP verification, login, profile management, password reset, and role-based access (Student, Faculty, StudentAdmin).
2.Event Management: Faculty and StudentAdmins can create events with image uploads; all users can view event details.
3.RSVP System: Students can RSVP for events with comments, restricted by event deadlines and seat availability.
4.Payment Integration: Secure payments via Razorpay, with PDF receipts and payment history.
5.Faculty Dashboard: Faculty can view RSVPs and payment details for their events.
6.Student-Only Reviews: Students can submit reviews for events they’ve attended.
7.Responsive UI: Supports light/dark themes using Tailwind CSS, with Font Awesome icons for enhanced visuals.
8.Error Handling: Robust error boundaries and loading states for a seamless user experience.

ech Stack

Frontend:-
React: Component-based UI with Context API for state management.
React Router: Client-side routing for navigation.
Vite: Fast build tool and development server.
Tailwind CSS: Utility-first styling framework.
Axios: HTTP client for API requests.
Font Awesome: Icons for UI enhancement.
jsPDF: Generates PDF payment receipts.

Backend:-
Node.js: Server-side runtime.
Express: RESTful API framework.
MongoDB: NoSQL database for data storage.
Mongoose: MongoDB ORM for schema modeling.
JWT: JSON Web Tokens for authentication.
Nodemailer: Sends OTP emails via Gmail SMTP.
Multer: Handles event image uploads.
Razorpay: Payment gateway integration.
CORS: Enables cross-origin requests.

External Services:-
MongoDB Atlas: Cloud-hosted database (or local MongoDB).
Razorpay: Payment processing.
Gmail: Email service for OTPs.

Setup Instructions

Clone the Repository
git clone https://github.com/rashi2711/eventManagement-system.git
cd eventManagement-system

Backend Setup:-
step1:cd backend
step2:npm install
step3:Create a .env file in backend/:
MONGO_URI=mongodb://localhost:27017/eventSphere
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=5000
step4:Start MongoDB (local or Atlas).
step5:Run the backend server:npm start or nodemon index.js
The server runs on http://localhost:5000.

Frontend Setup
step1:Navigate to the frontend directory:cd frontend
step2:Install dependencies:npm install
step3:Create a .env file in frontend/:VITE_API_URL=http://localhost:5000/api
step4:Start the development server:npm run dev
Open http://localhost:5173 in your browser.

Configurations:-

Vite Proxy (frontend/vite.config.js):
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

Tailwind CSS (frontend/tailwind.config.js):
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};

Font Awesome: Included via CDN in frontend/public/index.html:
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />





