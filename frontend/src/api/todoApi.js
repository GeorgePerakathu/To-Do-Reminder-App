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
    console.log(`Sending ${config.method.toUpperCase()} request to ${config.url}`, config.data);
    return config;
}, (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
});

// Add response interceptor for logging
axiosInstance.interceptors.response.use((response) => {
    console.log(`Received response from ${response.config.url}`, response.data);
    return response;
}, (error) => {
    if (error.response) {
        console.error(`Error response from ${error.response.config.url}:`, error.response.data);
    } else {
        console.error('Error in response interceptor:', error.message);
    }
    return Promise.reject(error);
});

export const authApi = {
    login: async (workspaceName, password) => { // Changed parameters
        const response = await axiosInstance.post('/workspaces/login', { name: workspaceName, password });
        // Remove token handling if not applicable
        return response.data;
    },
    // Remove or adjust the register method if not present in backend
    // register: async (workspaceName, password) => {
    //     const response = await axiosInstance.post('/workspaces/', { name: workspaceName, password });
    //     return response.data;
    // },
};

export const todoApi = {
    getAllTodos: async (workspace) => {
        const response = await axiosInstance.get(`/todos/${workspace}`);
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
