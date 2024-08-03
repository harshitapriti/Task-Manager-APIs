const Task = require('../models/Task');

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      userId: req.user._id,
    });
    await task.save();
    res.status(201).json({ message: 'Task added successfully', task });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add task', error });
  }
};

// Remove a task
exports.removeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove task', error });
  }
};

// Mark task as completed
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { completed: true },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task marked as completed', task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete task', error });
  }
};

// Edit a task
exports.editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, description, dueDate, completed },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

// View tasks day-wise
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ message: 'Failed to retrieve tasks', error });
  }
};