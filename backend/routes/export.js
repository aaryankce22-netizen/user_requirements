const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Requirement = require('../models/Requirement');
const { protect } = require('../middleware/auth');
const { generateProjectPDF, generateRequirementsPDF, generateSingleRequirementPDF } = require('../utils/pdfGenerator');

// @route   GET /api/export/project/:id
// @desc    Export project as PDF
// @access  Private
router.get('/project/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('teamMembers', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const requirements = await Requirement.find({ project: req.params.id })
      .populate('createdBy', 'name')
      .sort('createdAt');

    const pdfBuffer = await generateProjectPDF(project, requirements);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/[^a-z0-9]/gi, '_')}_report.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating PDF' });
  }
});

// @route   GET /api/export/requirements
// @desc    Export all requirements as PDF
// @access  Private
router.get('/requirements', protect, async (req, res) => {
  try {
    const { project, status, priority, category } = req.query;

    let query = {};
    let projectName = 'All Projects';

    if (project) {
      query.project = project;
      const proj = await Project.findById(project).select('name');
      if (proj) projectName = proj.name;
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const requirements = await Requirement.find(query)
      .populate('project', 'name')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    const pdfBuffer = await generateRequirementsPDF(requirements, projectName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="requirements_report.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating PDF' });
  }
});

// @route   GET /api/export/requirement/:id
// @desc    Export single requirement as PDF
// @access  Private
router.get('/requirement/:id', protect, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id)
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name');

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    const pdfBuffer = await generateSingleRequirementPDF(requirement);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${requirement.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating PDF' });
  }
});

// @route   GET /api/export/project/:id/csv
// @desc    Export project requirements as CSV
// @access  Private
router.get('/project/:id/csv', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select('name');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const requirements = await Requirement.find({ project: req.params.id })
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name')
      .sort('createdAt');

    // Generate CSV
    const headers = ['ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Created By', 'Assigned To', 'Created At'];
    const rows = requirements.map(req => [
      req._id,
      `"${req.title.replace(/"/g, '""')}"`,
      `"${req.description.replace(/"/g, '""').substring(0, 200)}"`,
      req.category,
      req.priority,
      req.status,
      req.createdBy?.name || 'N/A',
      req.assignedTo?.name || 'N/A',
      new Date(req.createdAt).toISOString()
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/[^a-z0-9]/gi, '_')}_requirements.csv"`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating CSV' });
  }
});

module.exports = router;
