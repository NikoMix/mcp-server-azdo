export class AzdoHubError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: unknown
  ) {
    super(message);
    this.name = "AzdoHubError";
  }
}

export class AzdoValidationError extends AzdoHubError {
  constructor(message: string, status: number, response: unknown) {
    super(message, status, response);
    this.name = "AzdoValidationError";
  }
}

export class AzdoResourceNotFoundError extends AzdoHubError {
  constructor(resource: string) {
    super(`Resource not found: ${resource}`, 404, { message: `${resource} not found` });
    this.name = "AzdoResourceNotFoundError";
  }
}

export class AzdoAuthenticationError extends AzdoHubError {
  constructor(message = "Authentication failed") {
    super(message, 401, { message });
    this.name = "AzdoAuthenticationError";
  }
}

export class AzdoPermissionError extends AzdoHubError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, { message });
    this.name = "AzdoPermissionError";
  }
}

export class AzdoRateLimitError extends AzdoHubError {
  constructor(
    message = "Rate limit exceeded",
    public readonly resetAt: Date
  ) {
    super(message, 429, { message, reset_at: resetAt.toISOString() });
    this.name = "AzdoRateLimitError";
  }
}

export class AzdoConflictError extends AzdoHubError {
  constructor(message: string) {
    super(message, 409, { message });
    this.name = "AzdoConflictError";
  }
}

export function isAzdoError(error: unknown): error is AzdoHubError {
  return error instanceof AzdoHubError;
}

export function createAzdoError(status: number, response: any): AzdoHubError {
  // Azure DevOps error responses may have 'message', 'errorCode', 'typeKey', 'customProperties', etc.
  const message = response?.message || response?.errorMessage || response?.error?.message || "Azure DevOps API error";
  switch (status) {
    case 400:
    case 422:
      return new AzdoValidationError(
        message,
        status,
        response
      );
    case 401:
      return new AzdoAuthenticationError(message);
    case 403:
      return new AzdoPermissionError(message);
    case 404:
      return new AzdoResourceNotFoundError(response?.resource || message || "Resource");
    case 409:
      return new AzdoConflictError(message || "Conflict occurred");
    case 429: {
      // Azure DevOps may return 'Retry-After' header or 'x-ratelimit-reset' in response
      let resetAt: Date;
      if (response?.retryAfter) {
        resetAt = new Date(Date.now() + Number(response.retryAfter) * 1000);
      } else if (response?.reset_at) {
        resetAt = new Date(response.reset_at);
      } else {
        resetAt = new Date(Date.now() + 60000);
      }
      return new AzdoRateLimitError(message, resetAt);
    }
    default:
      return new AzdoHubError(
        message,
        status,
        response
      );
  }
}