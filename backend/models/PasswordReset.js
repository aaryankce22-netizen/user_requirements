const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate reset token
passwordResetSchema.statics.createToken = async function(userId) {
  // Invalidate existing tokens
  await this.updateMany({ user: userId, used: false }, { used: true });
  
  // Create new token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  await this.create({
    user: userId,
    token: hashedToken
  });
  
  return resetToken;
};

// Verify token
passwordResetSchema.statics.verifyToken = async function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const resetRecord = await this.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() }
  }).populate('user');
  
  return resetRecord;
};

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
