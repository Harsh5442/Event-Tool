// src/utils/statusMapping.ts

export const mapEventStatus = (backendStatus: string): string => {
  const statusMap: Record<string, string> = {
    'Published': 'Upcoming',
    'Draft': 'Draft',
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'Pending': 'Pending Approval',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled',
  };

  return statusMap[backendStatus] || backendStatus;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'Upcoming': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'Draft': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
    'Approved': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'Pending Approval': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    'Rejected': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    'Completed': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    'Cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return colorMap[status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
};