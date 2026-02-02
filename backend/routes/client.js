const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Requirement = require('../models/Requirement');
const Asset = require('../models/Asset');
const { protect, authorize } = require('../middleware/auth');
const { createActivityLog } = require('../middleware/activityLogger');

// Configure multer for client uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/client-documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'client-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Allowed: images, documents, spreadsheets, presentations, text files, archives'));
  }
});

// Helper to determine document type
const getDocumentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return 'image';
  if (['.pdf'].includes(ext)) return 'document';
  if (['.doc', '.docx', '.txt', '.rtf'].includes(ext)) return 'document';
  if (['.xls', '.xlsx', '.csv'].includes(ext)) return 'document';
  if (['.ppt', '.pptx'].includes(ext)) return 'document';
  if (['.zip', '.rar', '.7z'].includes(ext)) return 'other';
  return 'other';
};

// @route   POST /api/client/requirements
// @desc    Client submits a new requirement with optional documents
// @access  Private (Client role)
router.post('/requirements', protect, upload.array('documents', 5), async (req, res) => {
  try {
    const { title, description, project, category, priority, acceptanceCriteria } = req.body;

    // Validate required fields
    if (!title || !description || !project) {
      return res.status(400).json({ 
        error: 'Title, description, and project are required' 
      });
    }

    // Create requirement
    const requirement = await Requirement.create({
      title,
      description,
      project,
      category: category || 'functional',
      priority: priority || 'medium',
      status: 'pending', // Client submissions start as pending
      acceptanceCriteria: acceptanceCriteria ? JSON.parse(acceptanceCriteria) : [],
      createdBy: req.user._id
    });

    // Handle uploaded documents
    const uploadedAssets = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const asset = await Asset.create({
          name: file.originalname,
          description: `Uploaded with requirement: ${title}`,
          project,
          type: getDocumentType(file.originalname),
          fileUrl: `/uploads/client-documents/${file.filename}`,
          fileName: file.filename,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: req.user._id,
          tags: ['client-upload', 'requirement-attachment']
        });

        uploadedAssets.push(asset);

        // Add to requirement attachments
        requirement.attachments.push({
          filename: file.originalname,
          url: asset.fileUrl,
          uploadedAt: new Date()
        });
      }
      await requirement.save();
    }

    // Log activity
    await createActivityLog(
      req.user._id,
      'requirement_create',
      `Created requirement: ${title}`,
      { type: 'Requirement', id: requirement._id },
      req
    );

    res.status(201).json({
      success: true,
      message: 'Requirement submitted successfully',
      data: {
        requirement,
        attachments: uploadedAssets
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error submitting requirement' });
  }
});

// @route   POST /api/client/documents
// @desc    Client uploads documents for existing requirement
// @access  Private
router.post('/documents/:requirementId', protect, upload.array('documents', 10), async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.requirementId);

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    if (req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedAssets = [];

    for (const file of req.files) {
      const asset = await Asset.create({
        name: file.originalname,
        description: req.body.description || `Document for: ${requirement.title}`,
        project: requirement.project,
        type: getDocumentType(file.originalname),
        fileUrl: `/uploads/client-documents/${file.filename}`,
        fileName: file.filename,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: req.user._id,
        tags: ['client-upload', 'requirement-attachment']
      });

      uploadedAssets.push(asset);

      // Add to requirement attachments
      requirement.attachments.push({
        filename: file.originalname,
        url: asset.fileUrl,
        uploadedAt: new Date()
      });
    }

    await requirement.save();

    // Log activity
    await createActivityLog(
      req.user._id,
      'asset_upload',
      `Uploaded ${req.files.length} document(s) to requirement: ${requirement.title}`,
      { type: 'Requirement', id: requirement._id },
      req
    );

    res.json({
      success: true,
      message: `${req.files.length} document(s) uploaded successfully`,
      data: {
        requirement,
        attachments: uploadedAssets
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading documents' });
  }
});

// @route   GET /api/client/my-requirements
// @desc    Get all requirements submitted by current client
// @access  Private
router.get('/my-requirements', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { createdBy: req.user._id };

    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.project) {
      query.project = req.query.project;
    }

    const [requirements, total] = await Promise.all([
      Requirement.find(query)
        .populate('project', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Requirement.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: requirements,
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

// @route   PUT /api/client/requirements/:id
// @desc    Client updates their own requirement
// @access  Private
router.put('/requirements/:id', protect, upload.array('documents', 5), async (req, res) => {
  try {
    let requirement = await Requirement.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found or unauthorized' });
    }

    // Only allow updates if requirement is still in draft or pending
    if (!['draft', 'pending'].includes(requirement.status)) {
      return res.status(400).json({ 
        error: 'Cannot update requirement after it has been reviewed' 
      });
    }

    const { title, description, category, priority, acceptanceCriteria } = req.body;

    // Update fields
    if (title) requirement.title = title;
    if (description) requirement.description = description;
    if (category) requirement.category = category;
    if (priority) requirement.priority = priority;
    if (acceptanceCriteria) {
      requirement.acceptanceCriteria = JSON.parse(acceptanceCriteria);
    }

    // Handle new documents
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const asset = await Asset.create({
          name: file.originalname,
          description: `Updated document for: ${requirement.title}`,
          project: requirement.project,
          type: getDocumentType(file.originalname),
          fileUrl: `/uploads/client-documents/${file.filename}`,
          fileName: file.filename,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: req.user._id,
          tags: ['client-upload', 'requirement-attachment']
        });

        requirement.attachments.push({
          filename: file.originalname,
          url: asset.fileUrl,
          uploadedAt: new Date()
        });
      }
    }

    await requirement.save();

    res.json({
      success: true,
      message: 'Requirement updated successfully',
      data: requirement
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating requirement' });
  }
});

// @route   POST /api/client/requirements/:id/comment
// @desc    Client adds comment to their requirement
// @access  Private
router.post('/requirements/:id/comment', protect, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    requirement.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    });

    await requirement.save();

    // Populate the new comment
    await requirement.populate('comments.user', 'name avatar');

    // Log activity
    await createActivityLog(
      req.user._id,
      'requirement_comment',
      `Commented on requirement: ${requirement.title}`,
      { type: 'Requirement', id: requirement._id },
      req
    );

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: requirement.comments[requirement.comments.length - 1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

module.exports = router;
