import React, { useState, useEffect } from 'react';
import { todoApi } from './api/todoApi';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await todoApi.createTodo(newTodo);
      setNewTodo({ title: '', description: '' });
      loadTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await todoApi.updateTodo(todo.id, { completed: !todo.completed });
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
        />
        <button type="submit">Add Todo</button>
      </form>

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
            />
            <div className="todo-content">
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
