import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import UserContext from '../contexts/UserContext';
import { Event, Todo, Routine } from '../types';

const CalendarView: React.FC = () => {
  const { familyMembers, todos, routines } = useContext(UserContext);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch events from Google Calendar API
    // This is a mock implementation
    const mockEvents: Event[] = [
      { id: '1', title: 'Meeting', start: new Date(), end: new Date(new Date().getTime() + 3600000), userId: '1', allDay: false },
      { id: '2', title: 'Birthday', start: new Date(new Date().setDate(new Date().getDate() + 5)), end: new Date(new Date().setDate(new Date().getDate() + 5)), userId: '2', allDay: true },
    ];
    setEvents(mockEvents);
  }, []);

  const handleDateClick = (arg: any) => {
    alert('Date click! ' + arg.dateStr);
  };

  const handleEventClick = (arg: any) => {
    alert('Event click! ' + arg.event.title);
  };

  const calendarEvents = [
    ...events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
    })),
    ...todos.map(todo => ({
      id: `todo-${todo.id}`,
      title: `TODO: ${todo.content}`,
      start: todo.dueDate,
      backgroundColor: '#FFA726',
      borderColor: '#FFA726',
      textColor: '#000000',
    })),
    ...routines.map(routine => ({
      id: `routine-${routine.id}`,
      title: `ROUTINE: ${routine.name}`,
      start: `2000-01-01T${routine.time}`,
      backgroundColor: '#7E57C2',
      borderColor: '#7E57C2',
      textColor: '#FFFFFF',
      daysOfWeek: routine.daysOfWeek?.map(day => ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(day.toLowerCase())),
    })),
  ];

  return (
    <div className="calendar-container bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        themeSystem="standard"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
      />
    </div>
  );
};

export default CalendarView;