import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle, List } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <LayoutDashboard size={24} /> TaskManager
                    </Link>
                    {user && (
                        <div className="flex items-center space-x-6">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 flex items-center gap-1">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <Link to="/tasks" className="text-gray-600 hover:text-blue-600 flex items-center gap-1">
                                <List size={18} /> Tasks
                            </Link>
                            <Link to="/create-task" className="text-gray-600 hover:text-blue-600 flex items-center gap-1">
                                <PlusCircle size={18} /> New Task
                            </Link>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-gray-800">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                    {!user && (
                        <div className="space-x-4">
                            <Link to="/login" className="text-blue-600 font-medium">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
