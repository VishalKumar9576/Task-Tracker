import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ status: [], priority: [] });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/tasks/stats', config);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
    }, [user.token]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Tasks by Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.status}>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3B82F6" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Tasks by Priority</h3>
                    <div className="h-64 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.priority}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="_id"
                                    label
                                >
                                    {stats.priority.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                    <h4 className="text-lg font-semibold opacity-90">Total Tasks</h4>
                    <p className="text-3xl font-bold mt-2">
                        {stats.status.reduce((acc, curr) => acc + curr.count, 0)}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                    <h4 className="text-lg font-semibold opacity-90">Completed</h4>
                    <p className="text-3xl font-bold mt-2">
                        {stats.status.find(s => s._id === 'Done')?.count || 0}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
                    <h4 className="text-lg font-semibold opacity-90">Pending</h4>
                    <p className="text-3xl font-bold mt-2">
                        {(stats.status.find(s => s._id === 'To Do')?.count || 0) + (stats.status.find(s => s._id === 'In Progress')?.count || 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
