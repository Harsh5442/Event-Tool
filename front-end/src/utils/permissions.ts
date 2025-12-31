// src/utils/permissions.ts

import { UserRole } from '../contexts/AuthContext';

export interface UserPermissions {
  // Event permissions
  canCreateEvent: boolean;
  canEditEvent: boolean;
  canDeleteEvent: boolean;
  canApproveEvent: boolean;
  canViewAllEvents: boolean;

  // Session permissions
  canCreateSession: boolean;
  canEditSession: boolean;
  canDeleteSession: boolean;

  // Speaker permissions
  canManageSpeakers: boolean;

  // User permissions
  canManageUsers: boolean;
  canAccessAdminConsole: boolean;

  // Analytics
  canViewAnalytics: boolean;

  // Registration
  canManageRegistration: boolean;
  canCheckInAttendees: boolean;
}

export const getRolePermissions = (role: UserRole): UserPermissions => {
  const permissions: Record<UserRole, UserPermissions> = {
    Admin: {
      canCreateEvent: true,
      canEditEvent: true,
      canDeleteEvent: true,
      canApproveEvent: true,
      canViewAllEvents: true,
      canCreateSession: true,
      canEditSession: true,
      canDeleteSession: true,
      canManageSpeakers: true,
      canManageUsers: true,
      canAccessAdminConsole: true,
      canViewAnalytics: true,
      canManageRegistration: true,
      canCheckInAttendees: true,
    },
    Organizer: {
      canCreateEvent: true,
      canEditEvent: true,
      canDeleteEvent: true,
      canApproveEvent: false,
      canViewAllEvents: false,
      canCreateSession: true,
      canEditSession: true,
      canDeleteSession: true,
      canManageSpeakers: true,
      canManageUsers: false,
      canAccessAdminConsole: false,
      canViewAnalytics: true,
      canManageRegistration: true,
      canCheckInAttendees: true,
    },
    Speaker: {
      canCreateEvent: false,
      canEditEvent: false,
      canDeleteEvent: false,
      canApproveEvent: false,
      canViewAllEvents: false,
      canCreateSession: false,
      canEditSession: false,
      canDeleteSession: false,
      canManageSpeakers: false,
      canManageUsers: false,
      canAccessAdminConsole: false,
      canViewAnalytics: false,
      canManageRegistration: false,
      canCheckInAttendees: false,
    },
    Participant: {
      canCreateEvent: false,
      canEditEvent: false,
      canDeleteEvent: false,
      canApproveEvent: false,
      canViewAllEvents: false,
      canCreateSession: false,
      canEditSession: false,
      canDeleteSession: false,
      canManageSpeakers: false,
      canManageUsers: false,
      canAccessAdminConsole: false,
      canViewAnalytics: false,
      canManageRegistration: false,
      canCheckInAttendees: false,
    },
  };

  return permissions[role];
};

export const canAccessRoute = (userRole: UserRole | undefined, requiredRole: UserRole | UserRole[]): boolean => {
  if (!userRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }

  const roleHierarchy: Record<UserRole, number> = {
    Admin: 4,
    Organizer: 3,
    Speaker: 2,
    Participant: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};