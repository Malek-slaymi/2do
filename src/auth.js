// src/auth.js

const USER_STORAGE_KEY = 'currentUser';
const ALL_USERS_KEY = 'allUsers';

const getAllUsers = () => {
  const users = localStorage.getItem(ALL_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveAllUsers = (users) => {
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
};

/**
 * Enregistre un nouvel utilisateur.
 */
export const registerUser = ({ email, password }) => {
  const users = getAllUsers();
  
  if (users.find(user => user.email === email)) {
    return null; // Utilisateur déjà existant
  }

  const newUser = { email, password, todos: [] };
  users.push(newUser);
  saveAllUsers(users);
  return newUser;
};

/**
 * Connecte un utilisateur existant.
 */
export const loginUser = (email, password) => { 
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ email: user.email }));
    return { email: user.email }; 
  }
  return null;
};

/**
 * Déconnecte l'utilisateur actuel.
 */
export const logoutUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

/**
 * Récupère l'utilisateur actuellement connecté.
 */
export const getCurrentUser = () => {
  const userString = localStorage.getItem(USER_STORAGE_KEY);
  return userString ? JSON.parse(userString) : null;
};

// --- Fonctions de gestion des tâches ---

export const getAllTodos = () => {
    const users = getAllUsers();
    const allTodos = users.flatMap(user => 
        user.todos.map(todo => ({
            ...todo,
            creatorEmail: user.email
        }))
    );
    return allTodos;
};

export const addTodoToUser = (email, todo) => {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex !== -1) {
        users[userIndex].todos.push(todo);
        saveAllUsers(users);
    }
};

export const updateTodoForUser = (creatorEmail, todoId, update = null) => {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === creatorEmail);

    if (userIndex !== -1) {
        const user = users[userIndex];
        
        if (update === null) {
            // Suppression
            user.todos = user.todos.filter(t => t.id !== todoId);
        } else {
            // Mise à jour (ex: terminer)
            user.todos = user.todos.map(t => 
                t.id === todoId ? { ...t, ...update } : t
            );
        }

        saveAllUsers(users);
    }
};