import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const TaskList = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');

    const fetchTasks = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                params: {
                    status: filterStatus,
                    priority: filterPriority
                }
            };
            const { data } = await axios.get('http://localhost:5000/api/tasks', config);
            setTasks(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load tasks");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user.token, filterStatus, filterPriority]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
            fetchTasks();
            toast.success("Task deleted");
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const getPriorityColor = (p) => {
        if (p === 'High') return 'bg-red-100 text-red-800';
        if (p === 'Medium') return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
                <div className="flex gap-4">
                    <select
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <select
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <div key={task._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{task.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

                            <div className="mb-4 text-sm text-gray-500">
                                <p><strong>Status:</strong> {task.status}</p>
                                <p><strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Link to={`/edit-task/${task._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit size={20} />
                            </Link>
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No tasks found. Create one to get started!
                </div>
            )}
        </div>
    );
};

export default TaskList;
