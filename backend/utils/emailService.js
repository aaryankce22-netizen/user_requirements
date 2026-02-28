const nodemailer = require('nodemailer');

// Dev mode fallback transporter
const devTransporter = {
  sendMail: async (options) => {
    console.log('\n📧 ═══════════════════════════════════════════════════════════');
    console.log('📧 EMAIL (Development Mode)');
    console.log('📧 ═══════════════════════════════════════════════════════════');
    console.log('📧 To:', options.to);
    console.log('📧 Subject:', options.subject);
    console.log('📧 ───────────────────────────────────────────────────────────');
    console.log('📧 Content:', options.text);
    console.log('📧 ═══════════════════════════════════════════════════════════\n');
    return { messageId: 'dev-' + Date.now() };
  }
};

// Check if SMTP credentials are real (not placeholder values)
const isValidSmtpConfig = () => {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const placeholders = ['your-gmail', 'your-email', 'your-16-char', 'changeme', 'placeholder'];
  return (
    process.env.SMTP_HOST &&
    user &&
    pass &&
    !placeholders.some(p => user.includes(p) || pass.includes(p))
  );
};

// Create transporter
const createTransporter = () => {
  if (isValidSmtpConfig()) {
    console.log('📧 Email configured with SMTP');
    const smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Wrap to fall back to dev mode on failure
    return {
      sendMail: async (options) => {
        try {
          return await smtpTransporter.sendMail(options);
        } catch (err) {
          console.error('📧 SMTP failed, falling back to console logging:', err.message);
          return devTransporter.sendMail(options);
        }
      }
    };
  }

  console.log('📧 Email running in development mode (logging to console)');
  return devTransporter;
};

const transporter = createTransporter();

// Email templates
const templates = {
  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request - RequirementsHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">RequirementsHub - Client Requirements Management System</p>
      </div>
    `,
    text: `Hi ${name},\n\nYou requested to reset your password. Visit this link to reset it: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`
  }),

  welcomeEmail: (name) => ({
    subject: 'Welcome to RequirementsHub!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to RequirementsHub! 🎉</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining RequirementsHub. You can now:</p>
        <ul>
          <li>Create and manage projects</li>
          <li>Track client requirements</li>
          <li>Upload and version control assets</li>
          <li>Collaborate with your team</li>
        </ul>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0;">
          Go to Dashboard
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">RequirementsHub - Client Requirements Management System</p>
      </div>
    `,
    text: `Hi ${name},\n\nWelcome to RequirementsHub! You can now create projects, track requirements, upload assets, and collaborate with your team.\n\nVisit your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
  }),

  requirementAssigned: (name, requirementTitle, projectName, link) => ({
    subject: `New Requirement Assigned - ${requirementTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Requirement Assigned</h2>
        <p>Hi ${name},</p>
        <p>You have been assigned a new requirement:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${requirementTitle}</h3>
          <p style="margin: 0; color: #666;">Project: ${projectName}</p>
        </div>
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 25px;">
          View Requirement
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">RequirementsHub - Client Requirements Management System</p>
      </div>
    `,
    text: `Hi ${name},\n\nYou have been assigned a new requirement: ${requirementTitle}\nProject: ${projectName}\n\nView it here: ${link}`
  }),

  requirementStatusChanged: (name, requirementTitle, oldStatus, newStatus, link) => ({
    subject: `Requirement Status Updated - ${requirementTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Requirement Status Updated</h2>
        <p>Hi ${name},</p>
        <p>The status of a requirement has been updated:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${requirementTitle}</h3>
          <p style="margin: 0;"><span style="color: #666;">Status:</span> <s>${oldStatus}</s> → <strong>${newStatus}</strong></p>
        </div>
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 25px;">
          View Requirement
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">RequirementsHub - Client Requirements Management System</p>
      </div>
    `,
    text: `Hi ${name},\n\nThe status of "${requirementTitle}" has been changed from ${oldStatus} to ${newStatus}.\n\nView it here: ${link}`
  }),

  newComment: (name, commenterName, requirementTitle, commentText, link) => ({
    subject: `New Comment on ${requirementTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Comment</h2>
        <p>Hi ${name},</p>
        <p><strong>${commenterName}</strong> commented on <strong>${requirementTitle}</strong>:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
          <p style="margin: 0;">"${commentText}"</p>
        </div>
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 25px;">
          View Requirement
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">RequirementsHub - Client Requirements Management System</p>
      </div>
    `,
    text: `Hi ${name},\n\n${commenterName} commented on "${requirementTitle}":\n\n"${commentText}"\n\nView it here: ${link}`
  })
};

// Send email function
const sendEmail = async (to, templateName, templateData) => {
  try {
    const template = templates[templateName](...templateData);
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@requirementshub.com',
      to,
      subject: template.subject,
      text: template.text,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, templates };
