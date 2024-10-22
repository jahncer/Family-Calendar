import React from 'react';
import { User, Todo, Routine } from '../types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  familyMembers: User[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<User[]>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
  appTitle: string;
  setAppTitle: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = React.createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  familyMembers: [],
  setFamilyMembers: () => {},
  todos: [],
  setTodos: () => {},
  routines: [],
  setRoutines: () => {},
  appTitle: 'Family Calendar',
  setAppTitle: () => {},
});

export default UserContext;