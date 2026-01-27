import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <ToastContainer />
        </div>
    );
};

export const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default Layout;
