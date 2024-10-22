import React, { useContext } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Clock from './Clock';
import UserContext from '../contexts/UserContext';

interface HeaderProps {
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, toggleSidebar }) => {
  const { appTitle } = useContext(UserContext);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-xl font-bold text-primary dark:text-primary-light">{appTitle}</h1>
        <Clock />
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300 hidden dark:block" />
          <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300 block dark:hidden" />
        </button>
        <Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-primary">
          Settings
        </Link>
      </div>
    </header>
  );
};

export default Header;