const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Requirement = require('../models/Requirement');
const Asset = require('../models/Asset');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/search
// @desc    Search across projects, requirements, and assets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { q, type, category, status, priority, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(q, 'i');
    const limitNum = Math.min(parseInt(limit), 50);

    let results = {
      projects: [],
      requirements: [],
      assets: [],
      users: []
    };

    // Build filters
    const projectFilter = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    };

    const requirementFilter = {
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    };

    const assetFilter = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    };

    // Add optional filters
    if (status) {
      projectFilter.status = status;
      requirementFilter.status = status;
    }
    if (priority) {
      projectFilter.priority = priority;
      requirementFilter.priority = priority;
    }
    if (category) {
      requirementFilter.category = category;
    }

    // Search based on type or all
    const searchPromises = [];

    if (!type || type === 'all' || type === 'projects') {
      searchPromises.push(
        Project.find(projectFilter)
          .populate('createdBy', 'name')
          .select('name description status priority deadline createdAt')
          .limit(limitNum)
          .lean()
          .then(projects => {
            results.projects = projects.map(p => ({ ...p, _type: 'project' }));
          })
      );
    }

    if (!type || type === 'all' || type === 'requirements') {
      searchPromises.push(
        Requirement.find(requirementFilter)
          .populate('project', 'name')
          .populate('createdBy', 'name')
          .select('title description status priority category project createdAt')
          .limit(limitNum)
          .lean()
          .then(requirements => {
            results.requirements = requirements.map(r => ({ ...r, _type: 'requirement' }));
          })
      );
    }

    if (!type || type === 'all' || type === 'assets') {
      searchPromises.push(
        Asset.find(assetFilter)
          .populate('project', 'name')
          .populate('uploadedBy', 'name')
          .select('name description type fileName project createdAt')
          .limit(limitNum)
          .lean()
          .then(assets => {
            results.assets = assets.map(a => ({ ...a, _type: 'asset' }));
          })
      );
    }

    if (!type || type === 'all' || type === 'users') {
      searchPromises.push(
        User.find({
          $or: [
            { name: searchRegex },
            { email: searchRegex }
          ]
        })
          .select('name email role avatar')
          .limit(limitNum)
          .lean()
          .then(users => {
            results.users = users.map(u => ({ ...u, _type: 'user' }));
          })
      );
    }

    await Promise.all(searchPromises);

    // Combine and sort by relevance (createdAt as proxy)
    const allResults = [
      ...results.projects,
      ...results.requirements,
      ...results.assets,
      ...results.users
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({
      success: true,
      query: q,
      counts: {
        projects: results.projects.length,
        requirements: results.requirements.length,
        assets: results.assets.length,
        users: results.users.length,
        total: allResults.length
      },
      data: type === 'all' || !type ? allResults : results[type + 's'] || [],
      grouped: type === 'all' || !type ? results : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 1) {
      return res.json({ success: true, suggestions: [] });
    }

    const searchRegex = new RegExp('^' + q, 'i');

    const [projects, requirements] = await Promise.all([
      Project.find({ name: searchRegex })
        .select('name')
        .limit(5)
        .lean(),
      Requirement.find({ title: searchRegex })
        .select('title')
        .limit(5)
        .lean()
    ]);

    const suggestions = [
      ...projects.map(p => ({ text: p.name, type: 'project' })),
      ...requirements.map(r => ({ text: r.title, type: 'requirement' }))
    ].slice(0, 10);

    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
