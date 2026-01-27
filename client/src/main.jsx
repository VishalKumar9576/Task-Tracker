import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TaskList from './pages/TaskList'
import { PrivateRoute } from './components/Layout'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

// TaskForm will be created next
import TaskForm from './pages/TaskForm';

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthProvider><Layout /></AuthProvider>,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />
                    },
                    {
                        path: "/tasks",
                        element: <TaskList />
                    },
                    {
                        path: "/create-task",
                        element: <TaskForm />
                    },
                    {
                        path: "/edit-task/:id",
                        element: <TaskForm />
                    }
                ]
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
