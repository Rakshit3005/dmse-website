// src/api.ts
'use client';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data: { username: string; password: string; privilege_level: string }) =>
  api.post('/auth/register', data);
export const login = (data: { username: string; password: string }) => api.post('/auth/login', data);
export const getLabs = () => api.get('/equipment/labs');
export const getInstruments = (labId: number) => api.get(`/equipment/instruments/${labId}`);
export const bookSlot = (data: {
  lab_name: string;
  instrument_id: number;
  slot: string;
  requested_by: number;
  requested_to: number;
}) => api.post('/equipment/book', data);
export const getBookings = () => api.get('/equipment/bookings');
export const approveBooking = (bookingId: number) => api.post(`/equipment/approve/${bookingId}`);
export const rejectBooking = (bookingId: number) => api.post(`/equipment/reject/${bookingId}`);

export default api;