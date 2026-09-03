export class SecureMeshError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'SecureMeshError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const authRequired = (msg = 'Authentication required', details?: any) =>
  new SecureMeshError(msg, 'UNAUTHORIZED', 401, details);

export const permissionDenied = (msg = 'Permission denied', details?: any) =>
  new SecureMeshError(msg, 'FORBIDDEN', 403, details);

export const resourceNotFound = (msg = 'Resource not found', details?: any) =>
  new SecureMeshError(msg, 'NOT_FOUND', 404, details);

export const blockchainUnavailable = (msg = 'Blockchain node unavailable', details?: any) =>
  new SecureMeshError(msg, 'SERVICE_UNAVAILABLE', 503, details);

export const kmsUnavailable = (msg = 'KMS unavailable or missing keys', details?: any) =>
  new SecureMeshError(msg, 'KMS_UNAVAILABLE', 503, details);

export const accessExpired = (msg = 'Access expired or invalid', details?: any) =>
  new SecureMeshError(msg, 'ACCESS_EXPIRED', 401, details);

export const rateLimited = (msg = 'Too many requests', details?: any) =>
  new SecureMeshError(msg, 'RATE_LIMITED', 429, details);

export const validationError = (msg = 'Validation failed', details?: any) =>
  new SecureMeshError(msg, 'VALIDATION_ERROR', 400, details);

export const internalError = (msg = 'Internal server error', details?: any) =>
  new SecureMeshError(msg, 'INTERNAL_ERROR', 500, details);
