import React, { useContext } from 'react';
import { Calendar, CheckSquare, RepeatIcon } from 'lucide-react';
import UserContext from '../contexts/UserContext';
import { Event } from '../types';

const Dashboard: React.FC = () => {
  const { familyMembers, todos, routines } = useContext(UserContext);

  // Mock events data - replace with actual data fetching logic
  const events: Event[] = [];

  return (
    <div className="dashboard">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Family Dashboard</h1>
      
      <div className="flex flex-wrap justify-center mb-6">
        {familyMembers && familyMembers.map(member => (
          <div key={member.id} className="m-4 text-center">
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-primary mx-auto"
            />
            <p className="mt-2 text-lg font-medium text-gray-800 dark:text-white">{member.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Upcoming Events" icon={<Calendar className="h-6 w-6" />}>
          <ul>
            {events.slice(0, 5).map(event => (
              <li key={event.id} className="mb-2 text-gray-700 dark:text-gray-300">
                {event.title} - {new Date(event.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard title="To-Do List" icon={<CheckSquare className="h-6 w-6" />}>
          <ul>
            {todos && todos.slice(0, 5).map(todo => (
              <li key={todo.id} className="mb-2 text-gray-700 dark:text-gray-300">
                {todo.content} - Assigned to: {todo.assignedTo ? familyMembers?.find(m => m.id === todo.assignedTo)?.name : 'Unassigned'}
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard title="Today's Routines" icon={<RepeatIcon className="h-6 w-6" />}>
          <ul>
            {routines && routines.slice(0, 5).map(routine => (
              <li key={routine.id} className="mb-2 text-gray-700 dark:text-gray-300">
                {routine.name} - {new Date(`2000-01-01T${routine.time}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold ml-2 text-gray-800 dark:text-white">{title}</h2>
    </div>
    {children}
  </div>
);

export default Dashboard;