import React, { useState, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Trash2, Calendar, Clock, Tag, Flag, Users } from 'lucide-react';
import UserContext from '../contexts/UserContext';
import { format } from 'date-fns';

interface Todo {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  dueDate?: Date;
  tags: string[];
  notes?: string;
}

const TodoView: React.FC = () => {
  const { familyMembers } = useContext(UserContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({
    id: '',
    content: '',
    priority: 'medium',
    assignedTo: [],
    tags: [],
  });
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const addTodo = () => {
    if (newTodo.content.trim() !== '') {
      setTodos([...todos, { ...newTodo, id: Date.now().toString() }]);
      setNewTodo({
        id: '',
        content: '',
        priority: 'medium',
        assignedTo: [],
        tags: [],
      });
      setIsAddingTodo(false);
    }
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="todo-container bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">To-Do List</h2>
      {!isAddingTodo ? (
        <button
          onClick={() => setIsAddingTodo(true)}
          className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors duration-200 mb-4"
        >
          <Plus className="h-6 w-6" /> Add New Task
        </button>
      ) : (
        <div className="bg-purple-100 p-4 rounded-lg mb-4">
          <input
            type="text"
            value={newTodo.content}
            onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Task description"
          />
          <div className="flex space-x-2 mb-2">
            <select
              value={newTodo.priority}
              onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="p-2 border rounded-lg"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              onChange={(e) => setNewTodo({ ...newTodo, dueDate: new Date(e.target.value) })}
              className="p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              onChange={(e) => setNewTodo({ ...newTodo, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              className="p-2 border rounded-lg flex-grow"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To:</label>
            <div className="flex flex-wrap gap-2">
              {familyMembers.map(member => (
                <label key={member.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={newTodo.assignedTo.includes(member.id)}
                    onChange={(e) => {
                      const updatedAssignees = e.target.checked
                        ? [...newTodo.assignedTo, member.id]
                        : newTodo.assignedTo.filter(id => id !== member.id);
                      setNewTodo({ ...newTodo, assignedTo: updatedAssignees });
                    }}
                    className="form-checkbox h-5 w-5 text-purple-600"
                  />
                  <span className="ml-2 text-sm">{member.name}</span>
                </label>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Additional notes"
            onChange={(e) => setNewTodo({ ...newTodo, notes: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingTodo(false)}
              className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={addTodo}
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              Add Task
            </button>
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority)}`}></div>
                        <span className="text-purple-800">{todo.content}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {todo.dueDate && (
                          <span className="text-sm text-purple-600">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {format(todo.dueDate, 'MMM d, h:mm a')}
                          </span>
                        )}
                        {todo.tags.length > 0 && (
                          <span className="text-sm text-purple-600">
                            <Tag className="h-4 w-4 inline mr-1" />
                            {todo.tags.join(', ')}
                          </span>
                        )}
                        <span className="text-sm text-purple-600">
                          <Users className="h-4 w-4 inline mr-1" />
                          {todo.assignedTo.length > 0
                            ? todo.assignedTo.map(id => familyMembers.find(m => m.id === id)?.name).join(', ')
                            : 'Unassigned'}
                        </span>
                        <button onClick={() => removeTodo(todo.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoView;