// src/models/attendee.ts

export interface AttendeeResponseDto {
  attendee_id: number;
  event_id: number;
  user_id: number;
  ticket_type: string; // e.g., "Standard", "VIP", "Free"
  check_in_status: boolean;
}

// Frontend interface for displaying attendees
export interface AttendeeForDisplay extends AttendeeResponseDto {
  id: string; // Convert attendee_id to string
  name?: string;              // Fetch from Users API
  email?: string;             // Fetch from Users API
  eventName?: string;         // Fetch from Events API
  registrationDate?: string;
}