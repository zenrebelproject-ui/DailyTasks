import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Trash2, Check } from 'lucide-react';

// Recreated SVG Logo based on the user's uploaded image
const AppIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="80" height="80" rx="15" stroke="black" strokeWidth="6" fill="white"/>
    <circle cx="30" cy="30" r="9" fill="black"/>
    <path d="M25 30 l4 4 l7 -7" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="48" y1="30" x2="80" y2="30" stroke="black" strokeWidth="6" strokeLinecap="round"/>
    
    <circle cx="30" cy="50" r="9" fill="black"/>
    <path d="M25 50 l4 4 l7 -7" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="48" y1="50" x2="80" y2="50" stroke="black" strokeWidth="6" strokeLinecap="round"/>
    
    <circle cx="30" cy="70" r="9" fill="black"/>
    <path d="M25 70 l4 4 l7 -7" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="48" y1="70" x2="80" y2="70" stroke="black" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

export default function App() {
  // State Management
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem('dailytasks_lists');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Daily Errands', tasks: [] },
      { id: '2', name: 'Grocery List', tasks: [] },
      { id: '3', name: 'Things To Do Today', tasks: [] }
    ];
  });
  
  const [currentListId, setCurrentListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newTaskText, setNewTaskText] = useState('');

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('dailytasks_lists', JSON.stringify(lists));
  }, [lists]);

  // Handlers
  const addList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const newList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      tasks: []
    };
    setLists([...lists, newList]);
    setNewListName('');
  };

  const deleteList = (id, e) => {
    e.stopPropagation();
    setLists(lists.filter(l => l.id !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !currentListId) return;
    
    setLists(lists.map(list => {
      if (list.id === currentListId) {
        return {
          ...list,
          tasks: [...list.tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]
        };
      }
      return list;
    }));
    setNewTaskText('');
  };

  const toggleTask = (taskId) => {
    setLists(lists.map(list => {
      if (list.id === currentListId) {
        return {
          ...list,
          tasks: list.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return list;
    }));
  };

  const deleteTask = (taskId) => {
    setLists(lists.map(list => {
      if (list.id === currentListId) {
        return { ...list, tasks: list.tasks.filter(t => t.id !== taskId) };
      }
      return list;
    }));
  };

  const currentList = lists.find(l => l.id === currentListId);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-20">
      {/* Mobile Constraint Container */}
      <div className="max-w-md mx-auto border-x-4 border-black min-h-screen bg-white shadow-2xl flex flex-col">
        
        {/* === HOME SCREEN === */}
        {!currentListId && (
          <>
            <header className="border-b-4 border-black p-6 flex items-center gap-4 bg-white">
              <AppIcon />
              <h1 className="text-3xl font-black tracking-tight">DailyTasks</h1>
            </header>

            <main className="flex-1 p-6 space-y-6">
              <h2 className="text-xl font-bold uppercase border-b-4 border-black pb-2 inline-block">My Lists</h2>
              
              <div className="space-y-4">
                {lists.map(list => (
                  <div 
                    key={list.id} 
                    onClick={() => setCurrentListId(list.id)}
                    className="group border-4 border-black p-5 flex justify-between items-center cursor-pointer active:bg-black active:text-white transition-none"
                  >
                    <div>
                      <h3 className="text-2xl font-bold">{list.name}</h3>
                      <p className="text-sm font-bold mt-1 uppercase">
                        {list.tasks.filter(t => t.completed).length} / {list.tasks.length} Done
                      </p>
                    </div>
                    <button 
                      onClick={(e) => deleteList(list.id, e)}
                      className="p-2 border-4 border-transparent group-active:border-white hover:border-black active:bg-white active:text-black"
                    >
                      <Trash2 size={28} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>

              {lists.length === 0 && (
                <div className="border-4 border-black border-dashed p-8 text-center">
                  <p className="font-bold text-lg uppercase">No lists created yet.</p>
                </div>
              )}
            </main>

            <footer className="p-6 border-t-4 border-black bg-white mt-auto">
              <form onSubmit={addList} className="flex gap-3">
                <input
                  type="text"
                  placeholder="NEW LIST NAME..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1 border-4 border-black p-4 text-xl font-bold placeholder-black/50 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2"
                />
                <button 
                  type="submit"
                  className="bg-black text-white px-6 py-4 border-4 border-black font-black flex items-center justify-center active:bg-white active:text-black active:border-black transition-none"
                >
                  <Plus size={32} strokeWidth={4} />
                </button>
              </form>
            </footer>
          </>
        )}

        {/* === LIST TASKS SCREEN === */}
        {currentListId && currentList && (
          <>
            <header className="border-b-4 border-black p-4 flex items-center gap-4 bg-white sticky top-0 z-10">
              <button 
                onClick={() => setCurrentListId(null)}
                className="p-2 border-4 border-black active:bg-black active:text-white"
              >
                <ChevronLeft size={32} strokeWidth={4} />
              </button>
              <h1 className="text-2xl font-black tracking-tight truncate flex-1">{currentList.name}</h1>
            </header>

            <main className="flex-1 p-4 space-y-4">
              {currentList.tasks.length === 0 ? (
                <div className="border-4 border-black border-dashed p-8 text-center mt-4">
                  <p className="font-bold text-lg uppercase">List is empty.</p>
                  <p className="font-bold text-sm uppercase mt-2">Add a task below.</p>
                </div>
              ) : (
                currentList.tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`border-4 border-black p-4 flex items-center gap-4 cursor-pointer active:bg-black active:text-white transition-none ${task.completed ? 'bg-black/5' : 'bg-white'}`}
                  >
                    {/* E-ink optimized Checkbox */}
                    <div className={`w-10 h-10 flex-shrink-0 border-4 border-black flex items-center justify-center transition-none ${task.completed ? 'bg-black' : 'bg-white'}`}>
                      {task.completed && <Check size={28} strokeWidth={5} color="white" />}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <span className={`text-xl font-bold break-words leading-tight ${task.completed ? 'line-through decoration-4' : ''}`}>
                        {task.text}
                      </span>
                    </div>

                    {task.completed && (
                       <span className="bg-black text-white text-xs font-black px-2 py-1 uppercase tracking-widest border-2 border-black">
                         Done
                       </span>
                    )}

                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                      className="p-3 ml-2 border-4 border-transparent hover:border-black active:bg-white active:text-black transition-none"
                    >
                      <Trash2 size={24} strokeWidth={3} />
                    </button>
                  </div>
                ))
              )}
            </main>

            <footer className="p-4 border-t-4 border-black bg-white sticky bottom-0 z-10">
              <form onSubmit={addTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="ADD NEW TASK..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 border-4 border-black p-4 text-xl font-bold placeholder-black/50 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2"
                />
                <button 
                  type="submit"
                  className="bg-black text-white px-5 py-4 border-4 border-black font-black flex items-center justify-center active:bg-white active:text-black active:border-black transition-none"
                >
                  <Plus size={32} strokeWidth={4} />
                </button>
              </form>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}