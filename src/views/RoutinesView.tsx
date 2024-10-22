import React, { useState, useContext } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, Users } from 'lucide-react';
import UserContext from '../contexts/UserContext';

interface Routine {
  id: string;
  name: string;
  frequency: string;
  time: string;
  assignedTo: string[];
  description?: string;
  daysOfWeek?: string[];
  reminders?: string[];
}

const RoutinesView: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<Routine>({
    id: '',
    name: '',
    frequency: 'daily',
    time: '',
    assignedTo: currentUser ? [currentUser.name] : [],
  });
  const [isAddingRoutine, setIsAddingRoutine] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);

  const addOrUpdateRoutine = () => {
    if (newRoutine.name && newRoutine.time) {
      if (editingRoutineId) {
        setRoutines(routines.map(r => r.id === editingRoutineId ? { ...newRoutine, id: editingRoutineId } : r));
        setEditingRoutineId(null);
      } else {
        setRoutines([...routines, { ...newRoutine, id: Date.now().toString() }]);
      }
      setNewRoutine({
        id: '',
        name: '',
        frequency: 'daily',
        time: '',
        assignedTo: currentUser ? [currentUser.name] : [],
      });
      setIsAddingRoutine(false);
    }
  };

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(routine => routine.id !== id));
  };

  const editRoutine = (routine: Routine) => {
    setNewRoutine(routine);
    setEditingRoutineId(routine.id);
    setIsAddingRoutine(true);
  };

  return (
    <div className="routines-container bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Routines</h2>
      {!isAddingRoutine ? (
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors duration-200 mb-4"
        >
          <Plus className="h-6 w-6 inline mr-2" /> Add New Routine
        </button>
      ) : (
        <div className="bg-purple-100 p-4 rounded-lg mb-4">
          <input
            type="text"
            value={newRoutine.name}
            onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Routine name"
          />
          <div className="flex space-x-2 mb-2">
            <select
              value={newRoutine.frequency}
              onChange={(e) => setNewRoutine({ ...newRoutine, frequency: e.target.value })}
              className="p-2 border rounded-lg"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
            <input
              type="time"
              value={newRoutine.time}
              onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
              className="p-2 border rounded-lg"
            />
          </div>
          {newRoutine.frequency === 'weekly' && (
            <div className="mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <label key={day} className="inline-flex items-center mr-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-600"
                    checked={newRoutine.daysOfWeek?.includes(day)}
                    onChange={(e) => {
                      const updatedDays = e.target.checked
                        ? [...(newRoutine.daysOfWeek || []), day]
                        : newRoutine.daysOfWeek?.filter(d => d !== day);
                      setNewRoutine({ ...newRoutine, daysOfWeek: updatedDays });
                    }}
                  />
                  <span className="ml-2 text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          )}
          <textarea
            placeholder="Routine description"
            value={newRoutine.description || ''}
            onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
            rows={3}
          />
          <div className="mb-2">
            <h4 className="font-semibold mb-1">Reminders:</h4>
            <input
              type="text"
              placeholder="e.g. 10 minutes before, 1 hour before"
              value={newRoutine.reminders?.join(', ') || ''}
              onChange={(e) => setNewRoutine({ ...newRoutine, reminders: e.target.value.split(',').map(r => r.trim()) })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsAddingRoutine(false);
                setEditingRoutineId(null);
                setNewRoutine({
                  id: '',
                  name: '',
                  frequency: 'daily',
                  time: '',
                  assignedTo: currentUser ? [currentUser.name] : [],
                });
              }}
              className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={addOrUpdateRoutine}
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              {editingRoutineId ? 'Update' : 'Add'} Routine
            </button>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {routines.map(routine => (
          <li key={routine.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg shadow">
            <div>
              <span className="font-semibold text-purple-800">{routine.name}</span>
              <div className="text-sm text-purple-600">
                <Calendar className="h-4 w-4 inline mr-1" />
                {routine.frequency}, <Clock className="h-4 w-4 inline mr-1 ml-2" /> {routine.time}
              </div>
              {routine.description && (
                <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-purple-600">
                <Users className="h-4 w-4 inline mr-1" />
                {routine.assignedTo.join(', ')}
              </span>
              <button onClick={() => editRoutine(routine)} className="text-blue-500 hover:text-blue-700">
                <Edit2 className="h-5 w-5" />
              </button>
              <button onClick={() => deleteRoutine(routine.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutinesView;