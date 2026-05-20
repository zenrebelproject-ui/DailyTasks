import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Trash2, Check } from 'lucide-react';

const AppIcon = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="12" width="76" height="76" rx="22" stroke="black" strokeWidth="4" fill="white"/>
    
    <circle cx="30" cy="32" r="7" fill="black"/>
    <path d="M 26 33 L 29 36 L 34 29" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="46" y1="32" x2="72" y2="32" stroke="black" strokeWidth="4" strokeLinecap="round"/>
    
    <circle cx="30" cy="50" r="7" fill="black"/>
    <path d="M 26 51 L 29 54 L 34 47" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="46" y1="50" x2="72" y2="50" stroke="black" strokeWidth="4" strokeLinecap="round"/>
    
    <circle cx="30" cy="68" r="7" fill="black"/>
    <path d="M 26 69 L 29 72 L 34 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="46" y1="68" x2="72" y2="68" stroke="black" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const DEFAULT_LISTS = [
  { id: '1', name: 'Daily Errands', tasks: [] },
  { id: '2', name: 'Grocery List', tasks: [] },
  { id: '3', name: 'Things To Do Today', tasks: [] }
];

// --- Reusable UI Components ---

const AddItemForm = ({ placeholder, onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-stretch border-2 border-black bg-white my-6">
      {/* appearance-none and rounded-none fix the ugly Android WebView default styling */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        className="flex-1 w-full appearance-none rounded-none bg-transparent border-0 p-5 text-xl font-bold text-black placeholder-black focus:outline-none focus:ring-0"
      />
      <button 
        type="submit"
        disabled={!value.trim()}
        aria-label={`Submit ${placeholder}`}
        className="px-6 border-l-2 border-black flex items-center justify-center bg-white text-black active:bg-black active:text-white transition-none disabled:opacity-50"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>
    </form>
  );
};

const ListCard = ({ list, onClick, onDelete }) => (
  <div className="w-full flex items-center justify-between py-6 border-b-2 border-black bg-white">
    <button 
      type="button"
      onClick={onClick}
      className="flex-1 text-left active:bg-black active:text-white transition-none px-2 py-2"
    >
      <h3 className="text-2xl font-bold text-black mb-1">{list.name}</h3>
      <p className="text-sm font-bold tracking-widest uppercase text-black">
        {list.tasks.filter(t => t.completed).length} / {list.tasks.length} Tasks
      </p>
    </button>
    <button 
      type="button"
      aria-label={`Delete list: ${list.name}`}
      onClick={onDelete}
      className="p-4 ml-4 text-black active:bg-black active:text-white border-2 border-transparent active:border-black rounded-none transition-none"
    >
      <Trash2 size={28} strokeWidth={2} />
    </button>
  </div>
);

const TaskItem = ({ task, onToggle, onDelete }) => (
  <div className="w-full flex items-center justify-between py-5 border-b-2 border-black bg-white">
    <button 
      type="button"
      onClick={onToggle}
      className="flex-1 flex items-center text-left active:bg-black active:text-white transition-none px-2 py-2"
    >
      {/* High contrast, fool-proof checkbox */}
      <div className={`w-8 h-8 flex-shrink-0 border-2 border-black flex items-center justify-center mr-5 transition-none ${
        task.completed ? 'bg-black text-white' : 'bg-white'
      }`}>
        {task.completed && <Check size={20} strokeWidth={4} />}
      </div>
      
      <span className={`text-xl font-bold ${task.completed ? 'line-through' : 'text-black'}`}>
        {task.text}
      </span>
    </button>
    
    <button 
      type="button"
      aria-label={`Delete task: ${task.text}`}
      onClick={onDelete}
      className="p-4 ml-4 text-black active:bg-black active:text-white border-2 border-transparent active:border-black rounded-none transition-none flex-shrink-0"
    >
      <Trash2 size={28} strokeWidth={2} />
    </button>
  </div>
);

// --- Screen Components ---

const HomeScreen = ({ lists, onListClick, onDeleteList, onAddList }) => (
  <div className="w-full min-h-screen flex flex-col bg-white">
    <header className="w-full pt-12 pb-8 flex flex-col items-center border-b-4 border-black px-6">
      <AppIcon />
      <h1 className="text-2xl font-bold tracking-widest mt-4 text-center text-black">DailyTasks</h1>
    </header>

    <main className="flex-1 w-full px-6 flex flex-col">
      {lists.length === 0 ? (
        <div className="py-16 w-full text-center">
          <p className="text-lg font-bold tracking-widest uppercase text-black">No Lists Found</p>
        </div>
      ) : (
        <div className="w-full flex flex-col">
          {lists.map(list => (
            <ListCard 
              key={list.id} 
              list={list} 
              onClick={() => onListClick(list.id)} 
              onDelete={() => onDeleteList(list.id)} 
            />
          ))}
        </div>
      )}
      
      {/* Added at the bottom of the list for easy access without sticky positioning bugs */}
      <AddItemForm placeholder="New list name..." onSubmit={onAddList} />
    </main>
  </div>
);

const TaskScreen = ({ list, onBack, onAddTask, onToggleTask, onDeleteTask }) => (
  <div className="w-full min-h-screen flex flex-col bg-white">
    <header className="w-full pt-8 pb-6 px-6 flex items-center gap-4 border-b-4 border-black bg-white">
      <button 
        type="button"
        aria-label="Back to lists"
        onClick={onBack}
        className="p-3 text-black border-2 border-black active:bg-black active:text-white transition-none"
      >
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>
      <h1 className="text-2xl font-bold tracking-wider truncate flex-1 text-black">{list.name}</h1>
    </header>

    <main className="flex-1 w-full px-6 flex flex-col">
      {list.tasks.length === 0 ? (
        <div className="py-16 w-full text-center">
          <p className="text-lg font-bold tracking-widest uppercase text-black">List is empty</p>
        </div>
      ) : (
        <div className="w-full flex flex-col">
          {list.tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={() => onToggleTask(task.id)} 
              onDelete={() => onDeleteTask(task.id)} 
            />
          ))}
        </div>
      )}
      
      <AddItemForm placeholder="Add a task..." onSubmit={onAddTask} />
    </main>
  </div>
);

// --- Main Application ---

export default function App() {
  const [lists, setLists] = useState(() => {
    try {
      const saved = localStorage.getItem('dailytasks_lists');
      return saved ? JSON.parse(saved) : DEFAULT_LISTS;
    } catch {
      return DEFAULT_LISTS;
    }
  });
  
  const [currentListId, setCurrentListId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('dailytasks_lists', JSON.stringify(lists));
    } catch (err) {
      console.error('Failed to save lists', err);
    }
  }, [lists]);

  const addList = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newList = { id: crypto.randomUUID(), name: trimmed, tasks: [], createdAt: Date.now() };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = (id) => {
    setLists(prev => prev.filter(l => l.id !== id));
    if (currentListId === id) setCurrentListId(null);
  };

  const addTask = (text) => {
    const trimmed = text.trim();
    if (!trimmed || !currentListId) return;
    setLists(prev => prev.map(list => 
      list.id === currentListId 
        ? { ...list, tasks: [...list.tasks, { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() }] }
        : list
    ));
  };

  const toggleTask = (taskId) => {
    setLists(prev => prev.map(list => 
      list.id === currentListId 
        ? { ...list, tasks: list.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : list
    ));
  };

  const deleteTask = (taskId) => {
    setLists(prev => prev.map(list => 
      list.id === currentListId 
        ? { ...list, tasks: list.tasks.filter(t => t.id !== taskId) }
        : list
    ));
  };

  const currentList = lists.find(l => l.id === currentListId);

  return (
    // Max width wrapper removed. We want the app to naturally stretch to the physical device screen bounds.
    <div className="w-full min-h-screen bg-white text-black font-sans antialiased">
      {!currentListId || !currentList ? (
        <HomeScreen 
          lists={lists} 
          onListClick={setCurrentListId} 
          onDeleteList={deleteList} 
          onAddList={addList} 
        />
      ) : (
        <TaskScreen 
          list={currentList} 
          onBack={() => setCurrentListId(null)} 
          onAddTask={addTask} 
          onToggleTask={toggleTask} 
          onDeleteTask={deleteTask} 
        />
      )}
    </div>
  );
}