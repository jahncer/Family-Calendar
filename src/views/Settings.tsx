import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import { User, Mail, Upload, Calendar, Trash2, Edit2, UserPlus } from 'lucide-react';
import { User as UserType } from '../types';
import { connectGoogleCalendar, disconnectGoogleCalendar, getConnectedCalendars, addCalendar, removeCalendar } from '../api';

const Settings: React.FC = () => {
  const { currentUser, setCurrentUser, familyMembers, setFamilyMembers } = useContext(UserContext);
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<UserType>({ id: '', name: '', email: '', avatar: '', isAdmin: false, googleCalendarConnected: false });
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (currentUser?.googleCalendarConnected) {
      fetchConnectedCalendars();
    }
  }, [currentUser]);

  const fetchConnectedCalendars = async () => {
    try {
      const response = await getConnectedCalendars();
      setConnectedCalendars(response.data);
    } catch (error) {
      console.error('Error fetching connected calendars:', error);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    try {
      const response = await connectGoogleCalendar();
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    try {
      await disconnectGoogleCalendar();
      if (currentUser) {
        setCurrentUser({ ...currentUser, googleCalendarConnected: false });
      }
      setConnectedCalendars([]);
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
    }
  };

  const addOrUpdateFamilyMember = () => {
    if (newMember.name && newMember.email) {
      let updatedMembers;
      if (editingMember) {
        updatedMembers = familyMembers.map(member => 
          member.id === editingMember ? { ...newMember, avatar: avatar ? URL.createObjectURL(avatar) : member.avatar } : member
        );
      } else {
        const newUser = {
          ...newMember,
          id: Date.now().toString(),
          avatar: avatar ? URL.createObjectURL(avatar) : 'https://via.placeholder.com/150',
        };
        updatedMembers = [...familyMembers, newUser];
      }
      setFamilyMembers(updatedMembers);
      localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
      resetForm();
    }
  };

  const removeFamilyMember = (id: string) => {
    const updatedMembers = familyMembers.filter(member => member.id !== id);
    setFamilyMembers(updatedMembers);
    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
  };

  const editMember = (member: UserType) => {
    setNewMember(member);
    setEditingMember(member.id);
    setAvatar(null);
  };

  const resetForm = () => {
    setNewMember({ id: '', name: '', email: '', avatar: '', isAdmin: false, googleCalendarConnected: false });
    setEditingMember(null);
    setAvatar(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  if (!currentUser) {
    return (
      <div className="settings bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Settings</h2>
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="settings bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Settings</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">User Information</h3>
        <p><strong>Name:</strong> {currentUser.name}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Google Calendar Integration</h3>
        {currentUser.googleCalendarConnected ? (
          <div>
            <button
              onClick={handleDisconnectGoogleCalendar}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors flex items-center mb-4"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Disconnect Google Calendar
            </button>
            <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Connected Calendars</h4>
            <ul>
              {connectedCalendars.map((calendar, index) => (
                <li key={index} className="flex items-center justify-between mb-2">
                  <span>{calendar}</span>
                  <button
                    onClick={() => removeCalendar(calendar)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            onClick={handleConnectGoogleCalendar}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors flex items-center"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Connect Google Calendar
          </button>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Family Members</h3>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {editingMember ? 'Edit Family Member' : 'Add Family Member'}
          </h4>
          <input
            type="text"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            placeholder="Name"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="file"
            onChange={handleAvatarChange}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={addOrUpdateFamilyMember}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {editingMember ? 'Update' : 'Add'} Family Member
          </button>
        </div>
        <ul>
          {familyMembers.map((member) => (
            <li key={member.id} className="flex items-center justify-between mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="flex items-center">
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-2" />
                <span>{member.name}</span>
              </div>
              <div>
                <button
                  onClick={() => editMember(member)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => removeFamilyMember(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Settings;