const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Task = require('../../models/Task');

//@route    POST api/tasks
//@desc     Create a task
//@access   Private
router.post(
  '/',
  [
    auth,
    [
      check('description', 'Description is required').not().isEmpty(),
      check('due_at', 'Due date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty(),
      check('priority', 'Invalid priority').isIn(['High', 'Medium', 'Low']),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = new Task({
        ...req.body,
        owner: req.user_id
      });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

//@route    PATCH api/tasks/:id
//@desc     Update a task
//@access   Private
router.patch(
  '/:id',
  [
    auth,
    [
      check('description', 'Description is required').optional().not().isEmpty(),
      check('due_at', 'Due date is required').optional().not().isEmpty(),
      check('time', 'Time is required').optional().not().isEmpty(),
      check('priority', 'Invalid priority').optional().isIn(['High', 'Medium', 'Low']),
      check('category', 'Category is required').optional().not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'due_at', 'time', 'toBeReminded', 'completed', 'priority', 'category'];
    const isValidOp = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOp) {
      return res.status(400).json({ msg: 'Invalid updates' });
    }

    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      if (task.owner.toString() !== req.user_id) {
        return res.status(401).json({ msg: 'Not Authorized' });
      }

      updates.forEach(update => (task[update] = req.body[update]));
      await task.save();

      res.json(task);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

//@route    GET /api/tasks
//@desc     Get all tasks for a single user
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user_id });
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

//@route    GET /api/tasks/:id
//@desc     Get a single task
//@access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

//@route    DELETE /api/tasks/:id
//@desc     Delete a single task
//@access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.owner.toString() !== req.user_id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }

    await task.delete();
    res.json({ msg: 'Task removed' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
