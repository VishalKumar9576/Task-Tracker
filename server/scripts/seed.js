const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Task.deleteMany();
        await User.deleteMany();

        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'John Smith',
                email: 'john@example.com',
                password: 'password123',
                role: 'user'
            }
        ]);

        const adminUser = users[0]._id;
        const user1 = users[1]._id;
        const user2 = users[2]._id;

        const tasks = [
            {
                title: 'Project Setup',
                description: 'Initial project setup with MERN stack',
                status: 'Done',
                priority: 'High',
                createdBy: adminUser,
                assignedTo: adminUser
            },
            {
                title: 'Database Design',
                description: 'Design MongoDB schemas',
                status: 'Done',
                priority: 'High',
                createdBy: adminUser,
                assignedTo: user1
            },
            {
                title: 'API Development',
                description: 'Build RESTful APIs',
                status: 'In Progress',
                priority: 'High',
                createdBy: adminUser,
                assignedTo: user2
            },
            {
                title: 'Frontend UI',
                description: 'Create React Components',
                status: 'To Do',
                priority: 'Medium',
                createdBy: adminUser,
                assignedTo: user1
            },
            {
                title: 'Authentication',
                description: 'Implement JWT Auth',
                status: 'In Progress',
                priority: 'High',
                createdBy: adminUser,
                assignedTo: user2
            },
            {
                title: 'Testing',
                description: 'Unit and Integration tests',
                status: 'To Do',
                priority: 'Medium',
                createdBy: adminUser,
                assignedTo: user1
            },
            {
                title: 'Documentation',
                description: 'Write README and API docs',
                status: 'To Do',
                priority: 'Low',
                createdBy: adminUser,
                assignedTo: user2
            },
            {
                title: 'Deployment',
                description: 'Deploy to Cloud',
                status: 'To Do',
                priority: 'High',
                createdBy: adminUser,
                assignedTo: adminUser
            },
            {
                title: 'Bug Fixing',
                description: 'Fix reported bugs',
                status: 'To Do',
                priority: 'Medium',
                createdBy: adminUser,
                assignedTo: user1
            },
            {
                title: 'Code Review',
                description: 'Review Pull Requests',
                status: 'To Do',
                priority: 'Low',
                createdBy: adminUser,
                assignedTo: user2
            }
        ];

        await Task.insertMany(tasks);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
