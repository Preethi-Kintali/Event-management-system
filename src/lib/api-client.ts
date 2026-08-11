const API_BASE_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(status: number, message: string, code?: string, details?: any) {
    super(message);
    this.status = status;
    if (code !== undefined) this.code = code;
    if (details !== undefined) this.details = details;
    this.name = 'ApiError';
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem('ascent_token') : null;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const activeOrgId = typeof window !== "undefined" ? localStorage.getItem('ascent_active_org') : null;
  if (activeOrgId) {
    headers.set('x-organization-id', activeOrgId);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    let errorCode;
    let errorDetails;

    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorCode = errorData.error.code;
        errorDetails = errorData.error.details;
      }
    } catch (e) {
      // If we can't parse JSON, fallback to status text
      errorMessage = response.statusText;
    }

    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/logout')) {
      // Trigger a custom event that our AuthContext can listen to for auto-logout
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    throw new ApiError(response.status, errorMessage, errorCode, errorDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
