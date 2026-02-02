const ActivityLog = require('../models/ActivityLog');

// Activity logger middleware
const logActivity = (action, getDescription, getTarget) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    res.json = async (data) => {
      // Only log on successful responses
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          const description = typeof getDescription === 'function' 
            ? getDescription(req, data) 
            : getDescription;
          
          const target = typeof getTarget === 'function' 
            ? getTarget(req, data) 
            : getTarget;

          await ActivityLog.create({
            user: req.user._id || req.user.id,
            action,
            description,
            targetType: target?.type,
            targetId: target?.id,
            metadata: {
              method: req.method,
              path: req.originalUrl,
              body: req.body
            },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
          });
        } catch (err) {
          console.error('Activity logging error:', err);
        }
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

// Simple activity logger for manual use
const createActivityLog = async (userId, action, description, target = {}, req = {}) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      description,
      targetType: target.type,
      targetId: target.id,
      metadata: target.metadata,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.get?.('User-Agent')
    });
  } catch (err) {
    console.error('Activity logging error:', err);
  }
};

module.exports = { logActivity, createActivityLog };
