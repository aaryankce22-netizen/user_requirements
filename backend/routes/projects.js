const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query;
    
    // If user is client, show only their projects
    if (req.user.role === 'client') {
      query = Project.find({ client: req.user.id });
    } else if (req.user.role === 'team_member') {
      query = Project.find({ teamMembers: req.user.id });
    } else {
      query = Project.find();
    }

    const projects = await query
      .populate('client', 'name email')
      .populate('teamMembers', 'name email')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email')
      .populate('teamMembers', 'name email avatar')
      .populate('createdBy', 'name');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin, Manager)
router.post('/', [
  protect,
  authorize('admin', 'manager'),
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('client').notEmpty().withMessage('Client is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin, Manager)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.deleteOne();

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
