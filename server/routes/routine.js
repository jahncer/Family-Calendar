const express = require('express');
const Routine = require('../models/Routine');
const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const routines = await Routine.find({ createdBy: req.user.id }).populate('assignedTo');
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routines', error });
  }
});

router.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const newRoutine = new Routine({
      ...req.body,
      createdBy: req.user.id
    });
    await newRoutine.save();
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(500).json({ message: 'Error creating routine', error });
  }
});

router.put('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const updatedRoutine = await Routine.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedRoutine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json(updatedRoutine);
  } catch (error) {
    res.status(500).json({ message: 'Error updating routine', error });
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const deletedRoutine = await Routine.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!deletedRoutine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json({ message: 'Routine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting routine', error });
  }
});

module.exports = router;