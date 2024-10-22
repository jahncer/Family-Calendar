import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, CheckSquare, RepeatIcon, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const linkClass = "flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-primary text-white";
  const inactiveLinkClass = "text-gray-800 dark:text-text-light hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white";

  return (
    <nav className={`bg-white dark:bg-gray-800 w-64 min-h-screen p-4 shadow-lg transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static z-10`}>
      <ul className="space-y-2">
        <li>
          <NavLink to="/" end className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
            <Calendar className="h-6 w-6" />
            <span className="font-medium">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendar" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
            <Calendar className="h-6 w-6" />
            <span className="font-medium">Calendar</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/todo" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
            <CheckSquare className="h-6 w-6" />
            <span className="font-medium">To-Do</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/routines" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
            <RepeatIcon className="h-6 w-6" />
            <span className="font-medium">Routines</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
            <Settings className="h-6 w-6" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;