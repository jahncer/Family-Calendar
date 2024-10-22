import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CalendarView from './views/CalendarView';
import TodoView from './views/TodoView';
import RoutinesView from './views/RoutinesView';
import UserContext from './contexts/UserContext';
import Dashboard from './views/Dashboard';
import Settings from './views/Settings';
import { User, Todo, Routine } from './types';
import { getCurrentUser, getTodos, getRoutines } from './api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [familyMembers, setFamilyMembers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appTitle, setAppTitle] = useState('Family Calendar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, todosResponse, routinesResponse] = await Promise.all([
          getCurrentUser(),
          getTodos(),
          getRoutines()
        ]);

        setCurrentUser(userResponse.data);
        setFamilyMembers(userResponse.data ? [userResponse.data] : []);
        setTodos(todosResponse.data);
        setRoutines(routinesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, familyMembers, setFamilyMembers, todos, setTodos, routines, setRoutines, appTitle, setAppTitle }}>
      <Router>
        <div className={`app ${theme} min-h-screen bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light flex flex-col`}>
          <Header toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />
            <motion.main
              className="flex-grow p-4 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/todo" element={<TodoView />} />
                <Route path="/routines" element={<RoutinesView />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.main>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;