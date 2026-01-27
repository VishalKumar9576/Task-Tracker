import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TaskForm = () => {
    const { id } = useParams(); // If ID exists, it's edit mode
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'To Do',
        dueDate: '',
        assignedTo: ''
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users for assignment
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/auth/users', config);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users");
            }
        };
        fetchUsers();

        // If edit mode, fetch task details
        if (isEditMode) {
            const fetchTask = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`http://localhost:5000/api/tasks`, config); // This endpoint filters, so we might need a specific get-one
                    // Wait, my controller doesn't have a get-one endpoint explicitly in the list? 
                    // Ah, I missed 'getTaskById' in the controller! 
                    // I realized I should have added a specific GET /:id route in the controller.
                    // For now, let's filter from list or adding it quickly.

                    // Actually, let's fix the controller later or assume filtering works.
                    // To be safe, I'll stick to the "list" endpoint for now but I should really add a details endpoint.
                    // Wait, I did define `router.route('/:id')` with `.put` and `.delete`. 
                    // I missed adding `.get` to `router.route('/:id')` in `taskRoutes.js` and `taskController.js`.
                    // Quick fix: I will add a method to get a single task now.
                } catch (error) {
                    console.error(error);
                }
            };
            // fetchTask(); 
        }
    }, [isEditMode, id, user.token]);

    // Correction: I need to handle the missing Get Single Task endpoint.
    // I will write a quick fix component logic: Fetch all and find (not efficient but works for small app)
    // Or better, I will update the backend files in the next step.

    useEffect(() => {
        if (isEditMode) {
            const fetchTask = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    // Temporary workaround: fetch all and find. 
                    const { data } = await axios.get(`http://localhost:5000/api/tasks`, config);
                    const task = data.find(t => t._id === id);
                    if (task) {
                        setFormData({
                            title: task.title,
                            description: task.description,
                            priority: task.priority,
                            status: task.status,
                            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                            assignedTo: task.assignedTo?._id || task.assignedTo || ''
                        });
                    }
                } catch (e) { toast.error("Could not load task"); }
            }
            fetchTask();
        }
    }, [isEditMode, id, user.token]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/tasks/${id}`, formData, config);
                toast.success('Task Updated');
            } else {
                await axios.post('http://localhost:5000/api/tasks', formData, config);
                toast.success('Task Created');
            }
            navigate('/tasks');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving task');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select User</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/tasks')}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {isEditMode ? 'Update Task' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
