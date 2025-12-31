// src/models/user.ts
export type UserRole = 'Admin' | 'Organizer' | 'Speaker' | 'Participant';

export interface UserResponseDto {
  user_id: number;
  email: string;
  name: string;
  role: UserRole; // e.g., "Admin", "Organizer", "Speaker", "Participant"
  azure_ad_id?: string;
  created_at?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}