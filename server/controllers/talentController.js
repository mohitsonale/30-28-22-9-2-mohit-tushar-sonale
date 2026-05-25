const Task = require('../models/Task');

// @desc  Get all available (Open) tasks
// @route GET /api/talent/tasks/available
// @access Talent
const getAvailableTasks = async (req, res) => {
  try {
    // Intentional gap: no pagination — dumps all open tasks at once
    // Intentional gap: returns Open tasks even if assignedTo is already set
    // (loose schema allows this inconsistent state from seed data)
    const tasks = await Task.find({ status: 'Open' })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get tasks assigned to the logged-in talent
// @route GET /api/talent/tasks/mine
// @access Talent
const getMyTasks = async (req, res) => {
  try {
    // Intentional gap: no status filter — Approved, Rejected, and active tasks
    // all come back mixed together with no grouping
    // Intentional gap: no pagination
    const tasks = await Task.find({ assignedTo: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Claim an open task
// @route PUT /api/talent/tasks/:id/claim
// @access Talent
const claimTask = async (req, res) => {
  try {
    // Intentional gap: non-atomic read-then-write — classic race condition
    // Two talents can both pass the status === 'Open' check before either saves,
    // then both write Claimed. Proper fix: findOneAndUpdate({ _id, status: 'Open' })
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'Open') {
      return res.status(400).json({ message: 'Task is no longer available' });
    }

    // Intentional gap: no limit on how many tasks a talent can claim simultaneously
    // Intentional gap: no check if this talent is already assigned to the task
    task.status = 'Claimed';
    task.assignedTo = req.user._id;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableTasks, getMyTasks, claimTask };
