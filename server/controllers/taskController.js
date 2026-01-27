const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const { validationResult } = require('express-validator');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        // Build filter object
        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }

        // Populate specific user tasks if assigned to them or created by them (optional logic depending on requirements, here showing all if admin or participant)
        // For simplicity: Admin sees all (or logic to see own), Users see tasks assigned to them OR created by them?
        // Let's implement: Users see tasks assigned to them OR created by them.

        filter.$or = [
            { createdBy: req.user._id },
            { assignedTo: req.user._id }
        ];

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
    try {
        const matchStage = {
            $or: [
                { createdBy: req.user._id },
                { assignedTo: req.user._id }
            ]
        };

        const stats = await Task.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Task.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ status: stats, priority: priorityStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    try {
        const task = new Task({
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo: assignedTo || null,
            createdBy: req.user._id
        });

        const createdTask = await task.save();

        // Send Email Notification if assigned
        if (assignedTo) {
            const assignee = await User.findById(assignedTo);
            if (assignee) {
                await sendEmail({
                    email: assignee.email,
                    subject: 'New Task Assigned',
                    message: `You have been assigned a new task: ${title}. Priority: ${priority}.`,
                    html: `<h3>New Task Assigned</h3><p>Title: <strong>${title}</strong></p><p>Description: ${description}</p><p>Priority: ${priority}</p>`
                });
            }
        }

        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check permissions (Only Creator or Assignee can update? Or anyone?)
        // Let's allow creator or assignee to update.
        if (task.createdBy.toString() !== req.user._id.toString() &&
            (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString())) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const originalStatus = task.status;
        const originalAssignee = task.assignedTo ? task.assignedTo.toString() : null;

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;

        const updatedTask = await task.save();

        // Status Change Notification
        if (originalStatus !== updatedTask.status && updatedTask.assignedTo) {
            const assignee = await User.findById(updatedTask.assignedTo);
            if (assignee) {
                await sendEmail({
                    email: assignee.email,
                    subject: 'Task Status Updated',
                    message: `Task "${updatedTask.title}" status changed to ${updatedTask.status}.`,
                });
            }
        }

        // Assignment Change Notification
        if (updatedTask.assignedTo && originalAssignee !== updatedTask.assignedTo.toString()) {
            const assignee = await User.findById(updatedTask.assignedTo);
            if (assignee) {
                await sendEmail({
                    email: assignee.email,
                    subject: 'New Task Assignment',
                    message: `You have been assigned task: "${updatedTask.title}".`
                });
            }
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check permissions
        if (task.createdBy.toString() !== req.user._id.toString() &&
            (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString())) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskStats, getTaskById };
