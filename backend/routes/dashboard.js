const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Requirement = require('../models/Requirement');
const Asset = require('../models/Asset');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get counts
    const [
      totalProjects,
      totalRequirements,
      totalAssets,
      projectsByStatus,
      requirementsByStatus,
      requirementsByPriority,
      recentProjects,
      recentRequirements,
      recentActivity
    ] = await Promise.all([
      Project.countDocuments({ $or: [{ createdBy: userId }, { teamMembers: userId }, { client: userId }] }),
      Requirement.countDocuments({ createdBy: userId }),
      Asset.countDocuments({ uploadedBy: userId }),
      Project.aggregate([
        { $match: { $or: [{ createdBy: userId }, { teamMembers: userId }] } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Requirement.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Requirement.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Project.find({ $or: [{ createdBy: userId }, { teamMembers: userId }] })
        .sort('-createdAt')
        .limit(5)
        .select('name status priority deadline'),
      Requirement.find()
        .sort('-createdAt')
        .limit(5)
        .select('title status priority project')
        .populate('project', 'name'),
      ActivityLog.find({ user: userId })
        .sort('-createdAt')
        .limit(10)
        .select('action description createdAt')
    ]);

    // Calculate completion rate
    const completedReqs = requirementsByStatus.find(s => s._id === 'completed')?.count || 0;
    const totalReqs = requirementsByStatus.reduce((sum, s) => sum + s.count, 0);
    const completionRate = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

    // Get upcoming deadlines
    const upcomingDeadlines = await Project.find({
      deadline: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      status: { $ne: 'completed' }
    })
      .sort('deadline')
      .limit(5)
      .select('name deadline status');

    res.json({
      success: true,
      data: {
        overview: {
          totalProjects,
          totalRequirements,
          totalAssets,
          completionRate
        },
        projectsByStatus: projectsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        requirementsByStatus: requirementsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        requirementsByPriority: requirementsByPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentProjects,
        recentRequirements,
        recentActivity,
        upcomingDeadlines
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/dashboard/activity
// @desc    Get activity feed
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const activities = await ActivityLog.find()
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await ActivityLog.countDocuments();

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

module.exports = router;
