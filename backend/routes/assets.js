const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Asset = require('../models/Asset');
const { protect } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|mp4|mp3|obj|fbx|glb|gltf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// Helper to determine asset type
const getAssetType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet') || mimeType.includes('presentation')) return 'document';
  if (mimeType.includes('model') || mimeType.includes('obj') || mimeType.includes('fbx')) return '3d_model';
  return 'other';
};

// @route   GET /api/assets
// @desc    Get all assets (with optional project filter)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.query.project) {
      query.project = req.query.project;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    const assets = await Asset.find(query)
      .populate('project', 'name')
      .populate('uploadedBy', 'name')
      .sort('-createdAt');

    res.json({ success: true, count: assets.length, data: assets });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assets/:id
// @desc    Get single asset
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('project', 'name')
      .populate('uploadedBy', 'name email');

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ success: true, data: asset });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/assets
// @desc    Upload new asset
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const asset = await Asset.create({
      name: req.body.name || req.file.originalname,
      description: req.body.description,
      project: req.body.project,
      type: getAssetType(req.file.mimetype),
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy: req.user.id
    });

    res.status(201).json({ success: true, data: asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/assets/:id
// @desc    Update asset (new version)
// @access  Private
router.put('/:id', protect, upload.single('file'), async (req, res) => {
  try {
    let asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // If new file uploaded, create new version
    if (req.file) {
      asset.previousVersions.push({
        fileUrl: asset.fileUrl,
        version: asset.version,
        uploadedAt: asset.updatedAt
      });
      asset.version += 1;
      asset.fileUrl = `/uploads/${req.file.filename}`;
      asset.fileName = req.file.originalname;
      asset.fileSize = req.file.size;
      asset.mimeType = req.file.mimetype;
    }

    // Update other fields
    if (req.body.name) asset.name = req.body.name;
    if (req.body.description) asset.description = req.body.description;
    if (req.body.tags) asset.tags = req.body.tags.split(',').map(tag => tag.trim());

    await asset.save();

    res.json({ success: true, data: asset });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/assets/:id
// @desc    Delete asset
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await asset.deleteOne();

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
