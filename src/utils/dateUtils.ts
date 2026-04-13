import { 
  format, 
  formatDistanceToNow, 
  isToday, 
  isTomorrow, 
  isYesterday,
  isPast,
  parseISO,
  isValid,
  differenceInDays,
  differenceInHours,
  differenceInMinutes
} from 'date-fns';

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No date';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Invalid date';
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  
  return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No date';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Invalid date';
  
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return '';
  
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getDueDateStatus = (dateString: string | null | undefined, status: string): {
  label: string;
  color: string;
  isOverdue: boolean;
  isUrgent: boolean;
} => {
  if (!dateString || status === 'completed') {
    return { label: '', color: '', isOverdue: false, isUrgent: false };
  }
  
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return { label: '', color: '', isOverdue: false, isUrgent: false };
  }
  
  if (isPast(date) && !isToday(date)) {
    const daysOverdue = differenceInDays(new Date(), date);
    return {
      label: `${daysOverdue}d overdue`,
      color: '#EF4444',
      isOverdue: true,
      isUrgent: true,
    };
  }
  
  if (isToday(date)) {
    return {
      label: 'Due today',
      color: '#F59E0B',
      isOverdue: false,
      isUrgent: true,
    };
  }
  
  if (isTomorrow(date)) {
    return {
      label: 'Due tomorrow',
      color: '#3B82F6',
      isOverdue: false,
      isUrgent: false,
    };
  }
  
  const daysUntil = differenceInDays(date, new Date());
  if (daysUntil <= 3) {
    return {
      label: `${daysUntil}d left`,
      color: '#10B981',
      isOverdue: false,
      isUrgent: false,
    };
  }
  
  return {
    label: format(date, 'MMM d'),
    color: '#6B7280',
    isOverdue: false,
    isUrgent: false,
  };
};

export const isOverdue = (dateString: string | null | undefined, status: string): boolean => {
  if (!dateString || status === 'completed') return false;
  
  const date = parseISO(dateString);
  if (!isValid(date)) return false;
  
  return isPast(date) && !isToday(date);
};

export const getTimeUntilDue = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return '';
  
  const now = new Date();
  const minutes = differenceInMinutes(date, now);
  const hours = differenceInHours(date, now);
  const days = differenceInDays(date, now);
  
  if (minutes < 0) {
    const absMinutes = Math.abs(minutes);
    if (absMinutes < 60) return `${absMinutes}m ago`;
    if (Math.abs(hours) < 24) return `${Math.abs(hours)}h ago`;
    return `${Math.abs(days)}d ago`;
  }
  
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

export const formatCreatedDate = (dateString: string): string => {
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Unknown';
  
  const now = new Date();
  const diffInDays = differenceInDays(now, date);
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  
  return format(date, 'MMM d, yyyy');
};
