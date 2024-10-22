export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  googleCalendarConnected: boolean;
}

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  userId: string;
}

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo: string;
  tags: string[];
}

export interface Routine {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  assignedTo: string[];
  description?: string;
  daysOfWeek?: string[];
  reminders?: string[];
}