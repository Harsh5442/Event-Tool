// src/models/event.ts

export interface EventResponseDto {
  event_id: number;
  name: string;
  description: string;
  start_date: string; // ISO 8601 format: "2025-01-10T00:00:00"
  end_date: string;   // ISO 8601 format: "2025-01-12T00:00:00"
  venue: string;
  capacity: number;
  status: string;     // e.g., "Published", "Draft", "Approved", "Rejected"
  created_by: number; // User ID of event creator
}

// Frontend interface for displaying events
export interface EventForDisplay extends EventResponseDto {
  id: string; // Convert event_id to string
  formattedStartDate?: string;
  formattedEndDate?: string;
  organizerName?: string;
  organizerEmail?: string;
  remainingSeats?: number;
  totalSeats?: number;
  image?: string;
  schedule?: { day: number; sessions: any[] }[];
}