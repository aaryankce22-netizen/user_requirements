const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RequirementsHub API',
      version: '1.0.0',
      description: 'API documentation for Client Requirements Management System',
      contact: {
        name: 'RequirementsHub Team',
        email: 'support@requirementshub.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'manager', 'client', 'team_member'] },
            avatar: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['planning', 'in_progress', 'review', 'completed', 'on_hold'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            startDate: { type: 'string', format: 'date-time' },
            deadline: { type: 'string', format: 'date-time' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        },
        Requirement: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string', enum: ['functional', 'non_functional', 'technical', 'business', 'ui_ux'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            status: { type: 'string', enum: ['draft', 'pending', 'approved', 'in_progress', 'completed', 'rejected'] },
            project: { type: 'string' },
            acceptanceCriteria: { type: 'array', items: { type: 'string' } }
          }
        },
        Asset: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['image', 'document', 'video', 'audio', 'design', '3d_model', 'other'] },
            fileUrl: { type: 'string' },
            fileName: { type: 'string' },
            fileSize: { type: 'number' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

// Add API documentation manually since we're not using JSDoc comments in routes
specs.paths = {
  '/api/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', format: 'email', example: 'john@example.com' },
                password: { type: 'string', minLength: 6, example: 'password123' },
                role: { type: 'string', enum: ['admin', 'manager', 'client', 'team_member'] }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'User registered successfully' },
        400: { description: 'Validation error or user already exists' }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login user',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Login successful, returns JWT token' },
        401: { description: 'Invalid credentials' }
      }
    }
  },
  '/api/auth/me': {
    get: {
      tags: ['Authentication'],
      summary: 'Get current user profile',
      responses: {
        200: { description: 'User profile data' },
        401: { description: 'Not authorized' }
      }
    }
  },
  '/api/auth/forgot-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Request password reset email',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', format: 'email' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Password reset email sent (if account exists)' }
      }
    }
  },
  '/api/auth/reset-password/{token}': {
    post: {
      tags: ['Authentication'],
      summary: 'Reset password with token',
      security: [],
      parameters: [
        { name: 'token', in: 'path', required: true, schema: { type: 'string' } }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['password'],
              properties: {
                password: { type: 'string', minLength: 6 }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Password reset successfully' },
        400: { description: 'Invalid or expired token' }
      }
    }
  },
  '/api/projects': {
    get: {
      tags: ['Projects'],
      summary: 'Get all projects',
      responses: {
        200: { description: 'List of projects' }
      }
    },
    post: {
      tags: ['Projects'],
      summary: 'Create a new project',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Project' }
          }
        }
      },
      responses: {
        201: { description: 'Project created' },
        400: { description: 'Validation error' }
      }
    }
  },
  '/api/projects/{id}': {
    get: {
      tags: ['Projects'],
      summary: 'Get project by ID',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Project data' },
        404: { description: 'Project not found' }
      }
    },
    put: {
      tags: ['Projects'],
      summary: 'Update project',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Project updated' },
        404: { description: 'Project not found' }
      }
    },
    delete: {
      tags: ['Projects'],
      summary: 'Delete project',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Project deleted' },
        404: { description: 'Project not found' }
      }
    }
  },
  '/api/requirements': {
    get: {
      tags: ['Requirements'],
      summary: 'Get all requirements',
      parameters: [
        { name: 'project', in: 'query', schema: { type: 'string' } },
        { name: 'status', in: 'query', schema: { type: 'string' } },
        { name: 'priority', in: 'query', schema: { type: 'string' } },
        { name: 'category', in: 'query', schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'List of requirements' }
      }
    },
    post: {
      tags: ['Requirements'],
      summary: 'Create a new requirement',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Requirement' }
          }
        }
      },
      responses: {
        201: { description: 'Requirement created' }
      }
    }
  },
  '/api/assets': {
    get: {
      tags: ['Assets'],
      summary: 'Get all assets',
      responses: {
        200: { description: 'List of assets' }
      }
    },
    post: {
      tags: ['Assets'],
      summary: 'Upload a new asset',
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: { type: 'string', format: 'binary' },
                name: { type: 'string' },
                description: { type: 'string' },
                project: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Asset uploaded' }
      }
    }
  },
  '/api/search': {
    get: {
      tags: ['Search'],
      summary: 'Search across all entities',
      parameters: [
        { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search query' },
        { name: 'type', in: 'query', schema: { type: 'string', enum: ['all', 'projects', 'requirements', 'assets', 'users'] } }
      ],
      responses: {
        200: { description: 'Search results' }
      }
    }
  },
  '/api/dashboard/stats': {
    get: {
      tags: ['Dashboard'],
      summary: 'Get dashboard statistics',
      responses: {
        200: { description: 'Dashboard statistics' }
      }
    }
  },
  '/api/export/project/{id}': {
    get: {
      tags: ['Export'],
      summary: 'Export project as PDF',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'PDF file', content: { 'application/pdf': {} } }
      }
    }
  },
  '/api/notifications': {
    get: {
      tags: ['Notifications'],
      summary: 'Get user notifications',
      responses: {
        200: { description: 'List of notifications' }
      }
    }
  },
  '/api/client/requirements': {
    post: {
      tags: ['Client'],
      summary: 'Submit a new requirement with documents',
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['title', 'description', 'project'],
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                project: { type: 'string' },
                category: { type: 'string' },
                priority: { type: 'string' },
                documents: { type: 'array', items: { type: 'string', format: 'binary' } }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Requirement submitted with documents' }
      }
    }
  }
};

module.exports = specs;
