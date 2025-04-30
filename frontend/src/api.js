import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = (data) => axios.post('/auth/signup', data);
export const verifyOTP = (data) => axios.post('/auth/verify-otp', data);
export const login = (data) => axios.post('/auth/login', data);
export const getProfile = () => axios.get('/auth/profile');
export const updateProfile = (data) => axios.put('/auth/profile', data);
export const changePassword = (data) => axios.post('/auth/change-password', data);
export const resetPassword = (data) => axios.post('/auth/reset-password', data);
export const verifyResetOTP = (data) => axios.post('/auth/verify-reset-otp', data);
export const getEvents = () => axios.get('/events');
export const getEvent = (id) => axios.get(`/events/${id}`);
export const createEvent = (data) =>
  axios.post('/events', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateEvent = (id, data) => axios.put(`/events/${id}`, data);
export const deleteEvent = (id) => axios.delete(`/events/${id}`);
export const getSections = () => axios.get('/events/sections');
export const getSubsections = (sectionId) => axios.get(`/events/subsections/${sectionId}`);
export const createRSVP = (eventId, data) => axios.post(`/rsvps/${eventId}`, data);
export const getUserRSVPs = () => axios.get('/rsvps');
export const getEventRSVPs = (eventId) => axios.get(`/rsvps/event/${eventId}`);
export const createOrder = (eventId, rsvpId) =>
  axios.post(`/payments/create-order/${eventId}`, { rsvpId });
export const verifyPayment = (data) => axios.post('/payments/verify-payment', data);
export const getPayments = (eventId) => axios.get(`/payments/${eventId}`);
export const getUserPayments = () => axios.get('/payments/user');
export const createReview = (eventId, data) => axios.post(`/reviews/${eventId}`, data);
export const getReviews = (eventId) => axios.get(`/reviews/${eventId}`);
export const deleteReview = (reviewId) => axios.delete(`/reviews/${reviewId}`);
export const getEventsByStatus = (status) => axios.get(`/events/status/${status}`);