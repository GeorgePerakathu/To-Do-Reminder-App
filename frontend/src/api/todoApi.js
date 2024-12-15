import axios from 'axios';
//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = "https://backend-todo-taskmanager.onrender.com"; 
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);  
        formData.append('password', password);

        const response = await axios.post(`${API_URL}/login`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        localStorage.setItem('token', response.data.access_token);
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export const todoApi = {
    getAllTodos: async (workspace) => {
        const response = await axios.get(`${API_URL}/todos/${workspace}`);
        return response.data;
    },

    createTodo: async (todo) => {
        const response = await axiosInstance.post('/todos/', todo);
        return response.data;
    },

    updateTodo: async (id, todo) => {
        const response = await axiosInstance.put(`/todos/${id}`, todo);
        return response.data;
    },

    deleteTodo: async (id) => {
        const response = await axiosInstance.delete(`/todos/${id}`);
        return response.data;
    }
};

export const workspaceApi = {
    createWorkspace: async (workspaceName, password) => {
        const response = await axiosInstance.post('/workspaces/', { name: workspaceName, password });
        return response.data;
    },
    loginWorkspace: async (workspaceName, password) => {
        const response = await axiosInstance.post('/workspaces/login', { name: workspaceName, password });
        return response.data;
    }
};
