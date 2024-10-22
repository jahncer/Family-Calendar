import React, { useContext, useState, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import { User, Mail, UserPlus, Trash2, Upload, Edit2 } from 'lucide-react';
import { User as UserType } from '../types';
import UserSettings from '../components/UserSettings';

const AdminPanel: React.FC = () => {
  const { familyMembers, setFamilyMembers, appTitle, setAppTitle } = useContext(UserContext);
  const [newMember, setNewMember] = useState<UserType>({ id: '', name: '', email: '', avatar: '', isAdmin: false, googleCalendarConnected: false });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newAppTitle, setNewAppTitle] = useState(appTitle);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAppTitleChange = (e: React.FormEvent) => {
    e.preventDefault();
    setAppTitle(newAppTitle);
    localStorage.setItem('appTitle', newAppTitle);
  };

  return (
    <div className="admin-panel">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <nav className="mb-6">
        <ul className="flex space-x-4">
          <li><Link to="/admin" className="text-blue-500 hover:text-blue-700">Manage Family</Link></li>
          <li><Link to="/admin/settings" className="text-blue-500 hover:text-blue-700">Settings</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">App Settings</h2>
              <form onSubmit={handleAppTitleChange} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newAppTitle}
                  onChange={(e) => setNewAppTitle(e.target.value)}
                  className="p-2 border rounded"
                  placeholder="App Title"
                />
                <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors">
                  Update Title
                </button>
              </form>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{editingMember ? 'Edit' : 'Add'} Family Member</h2>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Name"
                  className="p-2 border rounded"
                />
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="Email"
                  className="p-2 border rounded"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors flex items-center"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {avatar ? 'Change Avatar' : 'Upload Avatar'}
                  </button>
                  {avatar && <span className="text-sm text-green-500">Avatar selected</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newMember.isAdmin}
                    onChange={(e) => setNewMember({ ...newMember, isAdmin: e.target.checked })}
                    id="isAdmin"
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <label htmlFor="isAdmin" className="text-sm font-medium">Is Admin</label>
                </div>
                <button
                  onClick={addOrUpdateFamilyMember}
                  className="bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors flex items-center justify-center"
                >
                  <UserPlus className="h-6 w-6 mr-2" />
                  {editingMember ? 'Update' : 'Add'} Family Member
                </button>
                {editingMember && (
                  <button
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Family Members</h2>
              <ul className="space-y-4">
                {familyMembers.map(member => (
                  <li key={member.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-4">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {member.isAdmin && <span className="text-sm bg-primary text-white px-2 py-1 rounded">Admin</span>}
                      {member.googleCalendarConnected && <Mail className="h-5 w-5 text-green-500" />}
                      <button
                        onClick={() => editMember(member)}
                        className="text-blue-500 hover:text-blue-700"
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
          </>
        } />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;