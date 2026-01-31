const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Requirement title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Requirement description is required']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  category: {
    type: String,
    enum: ['functional', 'non_functional', 'technical', 'business', 'ui_ux'],
    default: 'functional'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'in_progress', 'completed', 'rejected'],
    default: 'draft'
  },
  acceptanceCriteria: [{
    type: String
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

requirementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Requirement', requirementSchema);
