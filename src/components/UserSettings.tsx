import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Lock, Calendar, Trash2 } from 'lucide-react';
import UserContext from '../contexts/UserContext';
import { connectGoogleCalendar, disconnectGoogleCalendar } from '../api';

const UserSettings: React.FC = () => {
  const { currentUser, setCurrentUser, familyMembers, setFamilyMembers } = useContext(UserContext);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [linkedCalendars, setLinkedCalendars] = useState<string[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);

  useEffect(() => {
    // Mock linked calendars - replace with actual data fetching
    setLinkedCalendars(['Personal', 'Work', 'Family']);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name,
        email,
        avatar: avatar ? URL.createObjectURL(avatar) : currentUser.avatar,
      };
      setCurrentUser(updatedUser);
      const updatedMembers = familyMembers.map(member => 
        member.id === currentUser.id ? updatedUser : member
      );
      setFamilyMembers(updatedMembers);
      localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    try {
      await connectGoogleCalendar();
      // Update the user's Google Calendar connection status
      if (currentUser) {
        setCurrentUser({ ...currentUser, googleCalendarConnected: true });
      }
      // Refresh the list of linked calendars
      // This is a mock implementation, replace with actual API call
      setLinkedCalendars([...linkedCalendars, 'New Google Calendar']);
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    try {
      await disconnectGoogleCalendar();
      // Update the user's Google Calendar connection status
      if (currentUser) {
        setCurrentUser({ ...currentUser, googleCalendarConnected: false });
      }
      // Remove all Google Calendars from the list
      setLinkedCalendars(linkedCalendars.filter(cal => !cal.includes('Google')));
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
    }
  };

  const unlinkCalendar = (calendarName: string) => {
    setLinkedCalendars(linkedCalendars.filter(cal => cal !== calendarName));
    setSelectedCalendars(selectedCalendars.filter(cal => cal !== calendarName));
  };

  const handleCalendarSelection = (calendarName: string) => {
    setSelectedCalendars(prevSelected =>
      prevSelected.includes(calendarName)
        ? prevSelected.filter(cal => cal !== calendarName)
        : [...prevSelected, calendarName]
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">User Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-text-dark">Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-text-light dark:text-text-dark bg-white dark:bg-gray-700"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark">Email</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-text-light dark:text-text-dark bg-white dark:bg-gray-700"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-text-dark">Password</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-text-light dark:text-text-dark bg-white dark:bg-gray-700"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-text-light dark:text-text-dark">Avatar</label>
          <input
            type="file"
            id="avatar"
            onChange={handleAvatarChange}
            className="mt-1 block w-full text-sm text-text-light dark:text-text-dark
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary-dark"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2 text-text-light dark:text-text-dark">Google Calendar Integration</h3>
          {currentUser?.googleCalendarConnected ? (
            <button
              type="button"
              onClick={handleDisconnectGoogleCalendar}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Disconnect Google Calendar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnectGoogleCalendar}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Connect Google Calendar
            </button>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2 text-text-light dark:text-text-dark">Linked Calendars</h3>
          <ul className="space-y-2">
            {linkedCalendars.map((calendar, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`calendar-${index}`}
                    checked={selectedCalendars.includes(calendar)}
                    onChange={() => handleCalendarSelection(calendar)}
                    className="mr-2"
                  />
                  <label htmlFor={`calendar-${index}`} className="text-text-light dark:text-text-dark">{calendar}</label>
                </div>
                <button
                  onClick={() => unlinkCalendar(calendar)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettings;