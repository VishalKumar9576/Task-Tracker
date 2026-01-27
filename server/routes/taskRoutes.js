const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask, getTaskStats, getTaskById } = require('../controllers/taskController');
const { check } = require('express-validator');

router.route('/')
    .get(protect, getTasks)
    .post(protect, [
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty()
    ], createTask);

router.get('/stats', protect, getTaskStats);

router.route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;
