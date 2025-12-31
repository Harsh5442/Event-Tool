// src/types/roles.ts

export type UserRole = 'Admin' | 'Organizer' | 'Speaker' | 'Participant';

export const VALID_ROLES: UserRole[] = ['Admin', 'Organizer', 'Speaker', 'Participant'];

export const isValidRole = (role: string): role is UserRole => {
  return VALID_ROLES.includes(role as UserRole);
};