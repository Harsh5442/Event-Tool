// src/models/session.ts

export interface SessionResponseDto {
  session_id: number;
  event_id: number;
  title: string;
  description: string;
  start_time: string; // ISO 8601 format: "2025-01-10T10:00:00"
  end_time: string;   // ISO 8601 format: "2025-01-10T11:00:00"
  speaker_id: number;
  created_by: number; // User ID of session creator
}

// Frontend interface for displaying sessions
export interface SessionForDisplay extends SessionResponseDto {
  id: string; // Convert session_id to string
  day?: number; // Calculated from start_time
  formattedStartTime?: string; // e.g., "10:00 AM"
  formattedEndTime?: string;   // e.g., "11:00 AM"
  speakerName?: string; // Fetch from Users API or mock
  room?: string;        // Not in backend response yet
  attendees?: number;   // Not in backend response yet
  type?: string;        // Not in backend response yet
}