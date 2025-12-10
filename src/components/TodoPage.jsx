// src/components/TodoPage.jsx

import React, { useState, useEffect } from "react";
import { 
    getAllTodos, 
    addTodoToUser, 
    updateTodoForUser,
    logoutUser 
} from "../auth";
import { useNavigate } from "react-router-dom";


function TodoPage({ user, setUser }) { 
  const [task, setTask] = useState("");
  const [list, setList] = useState([]); 
  const currentUserEmail = user?.email; 
  const navigate = useNavigate();

  const refreshTodos = () => {
    setList(getAllTodos());
  };

  useEffect(() => {
    refreshTodos(); 
  }, []); 

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: task,
      done: false,
    };
    
    addTodoToUser(currentUserEmail, newTask); 
    
    setTask("");
    refreshTodos(); 
  };

  const finishTask = (todoId, creatorEmail) => {
    if (creatorEmail !== currentUserEmail) {
        alert("You can only mark your own tasks as finished.");
        return;
    }

    updateTodoForUser(creatorEmail, todoId, { done: true });
    refreshTodos();
  };

  const deleteTask = (todoId, creatorEmail) => {
    if (creatorEmail !== currentUserEmail) {
        alert("You can only delete your own tasks.");
        return;
    }

    updateTodoForUser(creatorEmail, todoId, null);
    refreshTodos();
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null); 
    navigate("/"); 
  };

  return (
    <div className="todo-container">
        <div className="header-bar">
            <h2>Hello {currentUserEmail} 👋</h2> 
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Add a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {list.map((t) => (
          <li
            key={t.id}
            className={t.done ? "task done" : "task pending"}
          >
            <span>
              <strong>{t.creatorEmail}</strong> — {t.text} 
            </span>

            {(t.creatorEmail === currentUserEmail) && (
                <div className="task-actions">
                    {!t.done && (
                        <button 
                            className="finish-btn" 
                            onClick={() => finishTask(t.id, t.creatorEmail)}
                        >
                            Terminer
                        </button>
                    )}
                    <button 
                        className="delete-btn" 
                        onClick={() => deleteTask(t.id, t.creatorEmail)}
                    >
                        Supprimer
                    </button>
                </div>
            )}
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoPage;