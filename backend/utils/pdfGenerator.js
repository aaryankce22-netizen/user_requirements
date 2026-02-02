const PDFDocument = require('pdfkit');

// Generate Project PDF Report
const generateProjectPDF = (project, requirements) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(24).fillColor('#4F46E5').text('RequirementsHub', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(18).fillColor('#333').text('Project Report', { align: 'center' });
      doc.moveDown(2);

      // Project Details
      doc.fontSize(20).fillColor('#4F46E5').text(project.name);
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor('#666').text(project.description);
      doc.moveDown(1);

      // Project Info Table
      doc.fontSize(12).fillColor('#333');
      doc.text(`Status: ${project.status?.replace('_', ' ').toUpperCase()}`);
      doc.text(`Priority: ${project.priority?.toUpperCase()}`);
      doc.text(`Start Date: ${new Date(project.startDate).toLocaleDateString()}`);
      if (project.deadline) {
        doc.text(`Deadline: ${new Date(project.deadline).toLocaleDateString()}`);
      }
      doc.text(`Created: ${new Date(project.createdAt).toLocaleDateString()}`);
      doc.moveDown(2);

      // Requirements Section
      doc.fontSize(16).fillColor('#4F46E5').text('Requirements');
      doc.moveDown(1);

      if (requirements && requirements.length > 0) {
        requirements.forEach((req, index) => {
          // Check if we need a new page
          if (doc.y > 700) {
            doc.addPage();
          }

          doc.fontSize(14).fillColor('#333').text(`${index + 1}. ${req.title}`);
          doc.fontSize(10).fillColor('#666').text(req.description, { indent: 20 });
          doc.fontSize(10).fillColor('#888')
            .text(`Category: ${req.category} | Priority: ${req.priority} | Status: ${req.status}`, { indent: 20 });
          doc.moveDown(1);
        });
      } else {
        doc.fontSize(12).fillColor('#666').text('No requirements found for this project.');
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#999').text(
        `Generated on ${new Date().toLocaleString()} by RequirementsHub`,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generate Requirements PDF Report
const generateRequirementsPDF = (requirements, projectName = 'All Projects') => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(24).fillColor('#4F46E5').text('RequirementsHub', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(18).fillColor('#333').text('Requirements Report', { align: 'center' });
      doc.fontSize(12).fillColor('#666').text(projectName, { align: 'center' });
      doc.moveDown(2);

      // Summary
      const statusCounts = requirements.reduce((acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {});

      doc.fontSize(14).fillColor('#4F46E5').text('Summary');
      doc.fontSize(12).fillColor('#333');
      doc.text(`Total Requirements: ${requirements.length}`);
      Object.entries(statusCounts).forEach(([status, count]) => {
        doc.text(`  ${status.replace('_', ' ')}: ${count}`);
      });
      doc.moveDown(2);

      // Requirements List
      doc.fontSize(14).fillColor('#4F46E5').text('Requirements Details');
      doc.moveDown(1);

      requirements.forEach((req, index) => {
        if (doc.y > 680) {
          doc.addPage();
        }

        // Requirement box
        doc.rect(doc.x - 5, doc.y - 5, 500, 80).fill('#f8f9fa');
        doc.fillColor('#333');

        doc.fontSize(12).text(`${index + 1}. ${req.title}`, doc.x, doc.y);
        doc.fontSize(10).fillColor('#666').text(
          req.description?.substring(0, 150) + (req.description?.length > 150 ? '...' : ''),
          { width: 480 }
        );
        doc.moveDown(0.5);

        // Status badges
        const statusColor = {
          draft: '#6B7280',
          pending: '#F59E0B',
          approved: '#10B981',
          in_progress: '#3B82F6',
          completed: '#059669',
          rejected: '#EF4444'
        };

        doc.fontSize(9).fillColor(statusColor[req.status] || '#666')
          .text(`Status: ${req.status} | Category: ${req.category} | Priority: ${req.priority}`);
        
        doc.moveDown(1.5);
      });

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#999').text(
        `Generated on ${new Date().toLocaleString()} by RequirementsHub`,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generate Single Requirement PDF
const generateSingleRequirementPDF = (requirement) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(24).fillColor('#4F46E5').text('RequirementsHub', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#666').text('Requirement Document', { align: 'center' });
      doc.moveDown(2);

      // Requirement Title
      doc.fontSize(20).fillColor('#333').text(requirement.title);
      doc.moveDown(1);

      // Meta info
      doc.fontSize(11).fillColor('#666');
      doc.text(`Project: ${requirement.project?.name || 'N/A'}`);
      doc.text(`Category: ${requirement.category}`);
      doc.text(`Priority: ${requirement.priority}`);
      doc.text(`Status: ${requirement.status}`);
      doc.text(`Created: ${new Date(requirement.createdAt).toLocaleDateString()}`);
      doc.text(`Last Updated: ${new Date(requirement.updatedAt).toLocaleDateString()}`);
      doc.moveDown(2);

      // Description
      doc.fontSize(14).fillColor('#4F46E5').text('Description');
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor('#333').text(requirement.description);
      doc.moveDown(2);

      // Acceptance Criteria
      if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) {
        doc.fontSize(14).fillColor('#4F46E5').text('Acceptance Criteria');
        doc.moveDown(0.5);
        requirement.acceptanceCriteria.forEach((criteria, index) => {
          doc.fontSize(12).fillColor('#333').text(`${index + 1}. ${criteria}`);
        });
        doc.moveDown(2);
      }

      // Comments
      if (requirement.comments && requirement.comments.length > 0) {
        doc.fontSize(14).fillColor('#4F46E5').text('Comments');
        doc.moveDown(0.5);
        requirement.comments.forEach((comment) => {
          doc.fontSize(10).fillColor('#666')
            .text(`${comment.user?.name || 'Unknown'} - ${new Date(comment.createdAt).toLocaleString()}`);
          doc.fontSize(11).fillColor('#333').text(comment.text);
          doc.moveDown(1);
        });
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#999').text(
        `Generated on ${new Date().toLocaleString()} by RequirementsHub`,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateProjectPDF,
  generateRequirementsPDF,
  generateSingleRequirementPDF
};
