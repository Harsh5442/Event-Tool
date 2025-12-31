// src/services/api.service.ts
import axios from 'axios';
import { parseISO, format, isValid } from 'date-fns';
import { EventResponseDto } from '../models/event';
import { SessionResponseDto } from '../models/session';
import { AttendeeResponseDto } from '../models/attendee';
import { UserResponseDto } from '../models/user';

// Backend base URL - Update this if backend URL changes
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5231/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor for JWT Token (when authentication is added) ---
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Interceptor for error handling ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login if needed
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// --- Utility to format dates ---
const formatDate = (dateString: string | undefined, formatString = 'PP') => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatString) : dateString;
  } catch (e) {
    console.error("Could not parse date:", dateString, e);
    return dateString;
  }
};

// --- EVENT API FUNCTIONS ---
export const fetchEvents = async (): Promise<EventResponseDto[]> => {
  try {
    const response = await apiClient.get('/Events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventById = async (eventId: number | string): Promise<EventResponseDto> => {
  try {
    const response = await apiClient.get(`/Events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData: Partial<EventResponseDto>): Promise<EventResponseDto> => {
  try {
    const response = await apiClient.post('/Events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId: number | string, eventData: Partial<EventResponseDto>): Promise<EventResponseDto> => {
  try {
    const response = await apiClient.put(`/Events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error);
    throw error;
  }
};

export const deleteEvent = async (eventId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/Events/${eventId}`);
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw error;
  }
};

// Placeholder for approve/reject - requires backend endpoints
export const approveEvent = async (eventId: string): Promise<void> => {
  console.warn(`approveEvent API endpoint for ${eventId} is not yet implemented.`);
  throw new Error("Not implemented");
};

export const rejectEvent = async (eventId: string): Promise<void> => {
  console.warn(`rejectEvent API endpoint for ${eventId} is not yet implemented.`);
  throw new Error("Not implemented");
};

// --- SESSION API FUNCTIONS ---
export const fetchAllSessions = async (): Promise<SessionResponseDto[]> => {
  try {
    const response = await apiClient.get('/Sessions');
    return response.data;
  } catch (error) {
    console.error('Error fetching all sessions:', error);
    throw error;
  }
};

export const fetchSessionById = async (sessionId: number | string): Promise<SessionResponseDto> => {
  try {
    const response = await apiClient.get(`/Sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching session ${sessionId}:`, error);
    throw error;
  }
};

export const fetchSessionsForEvent = async (eventId: number | string): Promise<SessionResponseDto[]> => {
  try {
    const response = await apiClient.get(`/Sessions/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sessions for event ${eventId}:`, error);
    throw error;
  }
};

export const createSession = async (sessionData: Partial<SessionResponseDto>): Promise<SessionResponseDto> => {
  try {
    const response = await apiClient.post('/Sessions', sessionData);
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const updateSession = async (sessionId: number | string, sessionData: Partial<SessionResponseDto>): Promise<SessionResponseDto> => {
  try {
    const response = await apiClient.put(`/Sessions/${sessionId}`, sessionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating session ${sessionId}:`, error);
    throw error;
  }
};

export const deleteSession = async (sessionId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/Sessions/${sessionId}`);
  } catch (error) {
    console.error(`Error deleting session ${sessionId}:`, error);
    throw error;
  }
};

// --- ATTENDEE API FUNCTIONS ---
export const fetchAllAttendees = async (): Promise<AttendeeResponseDto[]> => {
  try {
    const response = await apiClient.get('/Attendees');
    return response.data;
  } catch (error) {
    console.error('Error fetching all attendees:', error);
    throw error;
  }
};

export const fetchAttendeeById = async (attendeeId: number | string): Promise<AttendeeResponseDto> => {
  try {
    const response = await apiClient.get(`/Attendees/${attendeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendee ${attendeeId}:`, error);
    throw error;
  }
};

export const fetchAttendeesForEvent = async (eventId: number | string): Promise<AttendeeResponseDto[]> => {
  try {
    const response = await apiClient.get(`/Attendees/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendees for event ${eventId}:`, error);
    throw error;
  }
};

export const createAttendee = async (attendeeData: Partial<AttendeeResponseDto>): Promise<AttendeeResponseDto> => {
  try {
    const response = await apiClient.post('/Attendees', attendeeData);
    return response.data;
  } catch (error) {
    console.error('Error creating attendee:', error);
    throw error;
  }
};

export const deleteAttendee = async (attendeeId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/Attendees/${attendeeId}`);
  } catch (error) {
    console.error(`Error deleting attendee ${attendeeId}:`, error);
    throw error;
  }
};

export const checkInAttendee = async (attendeeId: number | string): Promise<void> => {
  try {
    await apiClient.post(`/Attendees/${attendeeId}/check-in`);
  } catch (error) {
    console.error(`Error checking in attendee ${attendeeId}:`, error);
    throw error;
  }
};

// --- USER API FUNCTIONS ---
export const fetchAllUsers = async (): Promise<UserResponseDto[]> => {
  try {
    const response = await apiClient.get('/Users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const fetchUserById = async (userId: number | string): Promise<UserResponseDto> => {
  try {
    const response = await apiClient.get(`/Users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

export const createUser = async (userData: Partial<UserResponseDto>): Promise<UserResponseDto> => {
  try {
    const response = await apiClient.post('/Users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: number | string, userData: Partial<UserResponseDto>): Promise<UserResponseDto> => {
  try {
    const response = await apiClient.put(`/Users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/Users/${userId}`);
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// --- FETCH CURRENT USER PROFILE (when auth is added) ---
export const fetchUserProfile = async (): Promise<UserResponseDto> => {
  try {
    // This endpoint will be available once authentication is implemented
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData: Partial<UserResponseDto>): Promise<UserResponseDto> => {
  try {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};