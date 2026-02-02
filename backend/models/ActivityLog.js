const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_register',
      'user_login',
      'user_logout',
      'user_password_reset',
      'project_create',
      'project_update',
      'project_delete',
      'requirement_create',
      'requirement_update',
      'requirement_delete',
      'requirement_status_change',
      'requirement_comment',
      'asset_upload',
      'asset_delete',
      'asset_download'
    ]
  },
  description: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['User', 'Project', 'Requirement', 'Asset']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
