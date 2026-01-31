const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Requirement = require('../models/Requirement');
const { protect } = require('../middleware/auth');

// @route   GET /api/requirements
// @desc    Get all requirements (with optional project filter)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.query.project) {
      query.project = req.query.project;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const requirements = await Requirement.find(query)
      .populate('project', 'name')
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.json({ success: true, count: requirements.length, data: requirements });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/requirements/:id
// @desc    Get single requirement
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id)
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name avatar');

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    res.json({ success: true, data: requirement });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/requirements
// @desc    Create new requirement
// @access  Private
router.post('/', [
  protect,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('project').notEmpty().withMessage('Project is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const requirement = await Requirement.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: requirement });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/requirements/:id
// @desc    Update requirement
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let requirement = await Requirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    requirement = await Requirement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: requirement });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/requirements/:id/comments
// @desc    Add comment to requirement
// @access  Private
router.post('/:id/comments', [
  protect,
  body('text').notEmpty().withMessage('Comment text is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const requirement = await Requirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    requirement.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await requirement.save();

    res.json({ success: true, data: requirement });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/requirements/:id
// @desc    Delete requirement
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    await requirement.deleteOne();

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
