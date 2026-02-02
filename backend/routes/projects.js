const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query;
    
    // If user is client, show only their projects (by client ID or clientInfo.email)
    if (req.user.role === 'client') {
      query = Project.find({
        $or: [
          { client: req.user.id },
          { 'clientInfo.email': req.user.email.toLowerCase() }
        ]
      });
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
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const projectData = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || 'planning',
      priority: req.body.priority || 'medium',
      deadline: req.body.deadline,
      tags: req.body.tags || [],
      createdBy: req.user.id
    };

    // Handle client - check if email matches an existing user
    if (req.body.client && typeof req.body.client === 'string' && req.body.client.match(/^[0-9a-fA-F]{24}$/)) {
      // Direct ObjectId reference
      projectData.client = req.body.client;
    } else if (req.body.clientInfo && req.body.clientInfo.email) {
      // Check if a user exists with this email
      const existingClient = await User.findOne({ 
        email: req.body.clientInfo.email.toLowerCase() 
      });
      
      if (existingClient) {
        // Link to existing user
        projectData.client = existingClient._id;
        projectData.clientInfo = {
          name: req.body.clientInfo.name || existingClient.name,
          email: req.body.clientInfo.email.toLowerCase()
        };
      } else {
        // Store client info for future linking
        projectData.clientInfo = {
          name: req.body.clientInfo.name,
          email: req.body.clientInfo.email.toLowerCase()
        };
      }
    } else if (req.body.clientInfo) {
      projectData.clientInfo = req.body.clientInfo;
    }

    const project = await Project.create(projectData);

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error('Error creating project:', err);
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

// @route   GET /api/projects/:id/available-members
// @desc    Get users available to be assigned as team members
// @access  Private (Admin, Manager)
router.get('/:id/available-members', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get all team_member users who are not already in the project
    const availableMembers = await User.find({
      role: 'team_member',
      _id: { $nin: project.teamMembers || [] }
    }).select('name email avatar');

    res.json({ success: true, data: availableMembers });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/projects/:id/team-members
// @desc    Add team member to project
// @access  Private (Admin, Manager)
router.post('/:id/team-members', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user exists and is a team_member
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a team member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ error: 'User is already a team member' });
    }

    // Add to team members
    project.teamMembers.push(userId);
    await project.save();

    // Return updated project with populated team members
    const updatedProject = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email avatar')
      .populate('client', 'name email')
      .populate('createdBy', 'name');

    res.json({ success: true, data: updatedProject });
  } catch (err) {
    console.error('Error adding team member:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id/team-members/:userId
// @desc    Remove team member from project
// @access  Private (Admin, Manager)
router.delete('/:id/team-members/:userId', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove from team members
    project.teamMembers = project.teamMembers.filter(
      member => member.toString() !== req.params.userId
    );
    await project.save();

    // Return updated project with populated team members
    const updatedProject = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email avatar')
      .populate('client', 'name email')
      .populate('createdBy', 'name');

    res.json({ success: true, data: updatedProject });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
