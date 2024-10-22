import axios from 'axios';
import { User, Todo, Routine } from '../types';

// Uncomment the following line when ready to use the real API
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://via.placeholder.com/150',
  isAdmin: true,
  googleCalendarConnected: false
};

const mockTodos: Todo[] = [
  { id: '1', content: 'Buy groceries', completed: false, priority: 'medium', assignedTo: '1', tags: ['shopping'] },
  { id: '2', content: 'Finish project', completed: false, priority: 'high', assignedTo: '1', tags: ['work'] },
];

const mockRoutines: Routine[] = [
  { id: '1', name: 'Morning Workout', frequency: 'daily', time: '07:00', assignedTo: ['1'] },
  { id: '2', name: 'Family Dinner', frequency: 'daily', time: '19:00', assignedTo: ['1'] },
];

// Mock API functions
export const getCurrentUser = () => Promise.resolve({ data: mockUser });
export const getTodos = () => Promise.resolve({ data: mockTodos });
export const getRoutines = () => Promise.resolve({ data: mockRoutines });

export const connectGoogleCalendar = () => Promise.resolve({ data: { authUrl: 'https://example.com/auth' } });
export const disconnectGoogleCalendar = () => Promise.resolve({ data: { success: true } });
export const getConnectedCalendars = () => Promise.resolve({ data: ['Personal', 'Work'] });
export const addCalendar = (calendarId: string) => Promise.resolve({ data: { success: true } });
export const removeCalendar = (calendarId: string) => Promise.resolve({ data: { success: true } });

// Uncomment the following lines when ready to use the real API
/*
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ... (keep the rest of the original file content, but commented out)
*/

export default {}; // Export an empty object for now