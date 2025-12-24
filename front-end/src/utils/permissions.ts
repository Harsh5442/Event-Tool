import { UserRole } from '../contexts/AuthContext';

export interface Permission {
  canCreateEvent: boolean;
  canEditEvent: boolean;
  canDeleteEvent: boolean;
  canManageSpeakers: boolean;
  canManageParticipants: boolean;
  canSendCommunications: boolean;
  canViewAnalytics: boolean;
  canAccessAdminConsole: boolean;
  canDragDropSessions: boolean;
  canApproveRegistrations: boolean;
  canApproveEvents: boolean;
  canEditSpeakerDetails: boolean;
  canSaveEvents: boolean;
  canRegisterForEvents: boolean;
  canCheckIn: boolean;
  canAcceptRejectAllocations: boolean;
}

export const getRolePermissions = (role: UserRole): Permission => {
  switch (role) {
    case 'Admin':
      return {
        canCreateEvent: true,
        canEditEvent: true,
        canDeleteEvent: true,
        canManageSpeakers: true,
        canManageParticipants: true,
        canSendCommunications: true,
        canViewAnalytics: true,
        canAccessAdminConsole: true,
        canDragDropSessions: true,
        canApproveRegistrations: true,
        canApproveEvents: true,
        canEditSpeakerDetails: true,
        canSaveEvents: false,
        canRegisterForEvents: false,
        canCheckIn: true,
        canAcceptRejectAllocations: false,
      };
    case 'Organizer':
      return {
        canCreateEvent: true,
        canEditEvent: true,
        canDeleteEvent: true,
        canManageSpeakers: false, // Can only view and allocate
        canManageParticipants: true,
        canSendCommunications: true,
        canViewAnalytics: true,
        canAccessAdminConsole: false,
        canDragDropSessions: true,
        canApproveRegistrations: false,
        canApproveEvents: false,
        canEditSpeakerDetails: false, // Cannot edit speaker details
        canSaveEvents: false,
        canRegisterForEvents: false,
        canCheckIn: true,
        canAcceptRejectAllocations: false,
      };
    case 'Speaker':
      return {
        canCreateEvent: false,
        canEditEvent: false,
        canDeleteEvent: false,
        canManageSpeakers: false,
        canManageParticipants: false,
        canSendCommunications: false,
        canViewAnalytics: false,
        canAccessAdminConsole: false,
        canDragDropSessions: false,
        canApproveRegistrations: false,
        canApproveEvents: false,
        canEditSpeakerDetails: false,
        canSaveEvents: false,
        canRegisterForEvents: false,
        canCheckIn: false,
        canAcceptRejectAllocations: true, // Can accept/reject allocations
      };
    case 'Participant':
      return {
        canCreateEvent: false,
        canEditEvent: false,
        canDeleteEvent: false,
        canManageSpeakers: false,
        canManageParticipants: false,
        canSendCommunications: false,
        canViewAnalytics: false,
        canAccessAdminConsole: false,
        canDragDropSessions: false,
        canApproveRegistrations: false,
        canApproveEvents: false,
        canEditSpeakerDetails: false,
        canSaveEvents: true, // Can bookmark events
        canRegisterForEvents: true,
        canCheckIn: true, // Self check-in via QR
        canAcceptRejectAllocations: false,
      };
  }
};

export const canAccessRoute = (role: UserRole, route: string): boolean => {
  const permissions = getRolePermissions(role);

  const routePermissions: { [key: string]: boolean } = {
    '/home': role === 'Participant', // Only participants
    '/dashboard': role !== 'Participant', // All except participants
    '/events': true,
    '/profile': true,
    '/speakers': permissions.canManageSpeakers || role === 'Speaker' || role === 'Admin' || role === 'Organizer',
    '/participants': permissions.canManageParticipants,
    '/communications': permissions.canSendCommunications,
    '/analytics': permissions.canViewAnalytics,
    '/settings': permissions.canAccessAdminConsole,
    '/schedule': true,
    '/registration': permissions.canManageParticipants || role === 'Admin',
  };

  return routePermissions[route] ?? false;
};