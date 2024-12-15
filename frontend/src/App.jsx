import React, { useState, useEffect } from 'react';
import { todoApi, workspaceApi } from './api/todoApi';
import './App.css';

function App() {
  const [workspace, setWorkspace] = useState(localStorage.getItem('workspace') || '');
  const [password, setPassword] = useState('');
  const [showWorkspacePrompt, setShowWorkspacePrompt] = useState(!localStorage.getItem('workspace'));

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ 
    title: '', 
    description: '', 
    due_date: '',
    priority: 'medium' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');

  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length,
    highPriority: todos.filter(todo => todo.priority === 'high' && !todo.completed).length
  };

  useEffect(() => {
    if (workspace) {
      loadTodos();
    }
  }, [workspace]);

  const handleWorkspaceSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await workspaceApi.createWorkspace(workspace, password);
      localStorage.setItem('workspace', workspace);
      setShowWorkspacePrompt(false);
      loadTodos();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Workspace already exists. Please choose a different name.');
      } else {
        setError('Failed to create workspace. Please try again.');
      }
      console.error('Error creating workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceLogin = async (e) => {
    e.preventDefault();
    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await workspaceApi.loginWorkspace(workspace, password);
      localStorage.setItem('workspace', workspace);
      setShowWorkspacePrompt(false);
      loadTodos();
    } catch (error) {
      setError('Invalid workspace name or password. Please try again.');
      console.error('Error logging into workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeWorkspace = () => {
    localStorage.removeItem('workspace');
    setShowWorkspacePrompt(true);
    setTodos([]);
  };

  const loadTodos = async () => {
    if (!workspace) return;
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAllTodos(workspace);
      setTodos(data);
    } catch (error) {
      setError('Failed to load todos. Please try again.');
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortTodos = (todoList) => {
    switch(sortBy) {
      case 'priority':
        return [...todoList].sort((a, b) => {
          const priority = { high: 3, medium: 2, low: 1 };
          return priority[b.priority] - priority[a.priority];
        });
      case 'date':
        return [...todoList].sort((a, b) => 
          new Date(a.due_date) - new Date(b.due_date)
        );
      default:
        return todoList;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await todoApi.createTodo({ ...newTodo, workspace });
      setNewTodo({ title: '', description: '', due_date: '', priority: 'medium' });
      await loadTodos();
    } catch (error) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      setLoading(true);
      setError(null);
      await todoApi.updateTodo(todo.id, { completed: !todo.completed });
      await loadTodos();
    } catch (error) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (todo) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setLoading(true);
      setError(null);
      await todoApi.deleteTodo(todo.id);
      await loadTodos();
    } catch (error) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {showWorkspacePrompt ? (
        <div className="workspace-prompt">
          <h2>Welcome to Task Manager</h2>
          <p>
            Enter a workspace name and password to organize your tasks.
          </p>

          {error && <div className="error-message">{error}</div>}

          <form>
            <input
              type="text"
              className="workspace-input"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder="Workspace Name"
              required
              autoFocus
            />
            <input
              type="password"
              className="workspace-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
            <div className="workspace-buttons">
              <button
                type="button"
                className="workspace-submit"
                onClick={handleWorkspaceSubmit}
              >
                Create Workspace
              </button>
              <button
                type="button"
                className="workspace-submit"
                onClick={handleWorkspaceLogin}
              >
                Login to Workspace
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <header className="app-header">
            <div className="header-content">
              <h1>
                <lord-icon
                  src="https://cdn.lordicon.com/wloilxuq.json"
                  trigger="hover"
                  colors="primary:#121331,secondary:#3498db"
                  style={{ width: '50px', height: '50px' }}>
                </lord-icon>
                {workspace}'s Tasks
              </h1>
              <button className="workspace-btn" onClick={handleChangeWorkspace}>
                Change Workspace
              </button>
            </div>
            <div className="stats-container">
              <div className="stat-item">
                <h4>Total</h4>
                <span>{stats.total}</span>
              </div>
              <div className="stat-item">
                <h4>Completed</h4>
                <span>{stats.completed}</span>
              </div>
              <div className="stat-item">
                <h4>Pending</h4>
                <span>{stats.pending}</span>
              </div>
              <div className="stat-item high-priority">
                <h4>High Priority</h4>
                <span>{stats.highPriority}</span>
              </div>
            </div>
          </header>
          
          {error && <div className="error-message">
            <lord-icon
              src="https://cdn.lordicon.com/tdrtiskw.json"
              trigger="loop"
              colors="primary:#ffffff"
              state="hover-error"
              style={{ width: '25px', height: '25px' }}>
            </lord-icon>
            {error}
          </div>}
          
          <form onSubmit={handleSubmit} className="todo-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Add some details"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date & Time</label>
                <input
                  type="datetime-local"
                  value={newTodo.due_date}
                  onChange={(e) => setNewTodo({...newTodo, due_date: e.target.value})}
                  placeholder="Select due date and time"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="add-task-btn">
              <span className="button-icon">
                <lord-icon
                  src="https://cdn.lordicon.com/mecwbjnp.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: '24px', height: '24px', display: 'block' }}>
                </lord-icon>
              </span>
              <span>{loading ? 'Adding...' : 'Add Task'}</span>
            </button>
          </form>

          <div className="todo-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>

          <div className="todo-list">
            {sortTodos(todos).map((todo) => (
              <div 
                key={todo.id} 
                className={`todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-actions">
                  <button 
                    className="icon-button complete"
                    onClick={() => handleToggleComplete(todo)}
                    aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    <lord-icon
                      src={todo.completed ? 
                        "https://cdn.lordicon.com/yqzmiobz.json" : 
                        "https://cdn.lordicon.com/egiwmiit.json"}
                      trigger="hover"
                      colors="primary:#2ed573"
                      style={{ width: '25px', height: '25px' }}>
                    </lord-icon>
                  </button>
                </div>
                <div className="todo-content">
                  <h3>{todo.title}</h3>
                  {todo.description && <p>{todo.description}</p>}
                  <div className="todo-meta">
                    {todo.due_date && (
                      <span className="due-date">
                        <lord-icon
                          src="https://cdn.lordicon.com/dkowjmhq.json"
                          trigger="hover"
                          colors="primary:#121331"
                          style={{ width: '20px', height: '20px' }}
                        />
                        {new Date(todo.due_date).toLocaleString()}
                      </span>
                    )}
                    <span className={`priority-badge ${todo.priority}`}>
                      {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(todo)}
                  className="icon-button delete"
                  aria-label="Delete task"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/jmkrnisz.json"
                    trigger="hover"
                    colors="primary:#ff4757"
                    style={{ width: '25px', height: '25px' }}>
                  </lord-icon>
                </button>
              </div>
            ))}
            {!loading && todos.length === 0 && (
              <div className="empty-state">
                <lord-icon
                  src="https://cdn.lordicon.com/dasctqle.json"
                  trigger="loop"
                  colors="primary:#121331"
                  state="hover-1"
                  style={{ width: '85px', height: '85px' }}>
                </lord-icon>
                <p>No tasks yet. Add one above!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

