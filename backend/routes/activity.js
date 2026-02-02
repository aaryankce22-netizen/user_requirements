const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/activity
// @desc    Get activity logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by user (admins can see all, others see their own)
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    } else if (req.query.user) {
      query.user = req.query.user;
    }

    // Filter by action type
    if (req.query.action) {
      query.action = req.query.action;
    }

    // Filter by target type
    if (req.query.targetType) {
      query.targetType = req.query.targetType;
    }

    // Filter by date range
    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) {
        query.createdAt.$gte = new Date(req.query.from);
      }
      if (req.query.to) {
        query.createdAt.$lte = new Date(req.query.to);
      }
    }

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/activity/my
// @desc    Get current user's activity
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const activities = await ActivityLog.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(limit);

    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/activity/stats
// @desc    Get activity statistics
// @access  Private (Admin)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [actionCounts, dailyCounts, topUsers] = await Promise.all([
      // Count by action type
      ActivityLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      // Count by day
      ActivityLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // Most active users
      ActivityLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $project: { name: '$user.name', email: '$user.email', count: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        actionCounts,
        dailyCounts,
        topUsers
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
