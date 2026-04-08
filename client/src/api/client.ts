const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (res.status === 401) {
    // 토큰 만료 시 refresh 시도
    const refreshRes = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshRes.ok) {
      // 원래 요청 재시도
      const retryRes = await fetch(`${BASE}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        ...options,
      });
      if (!retryRes.ok) throw new Error(`${retryRes.status}`);
      return retryRes.json();
    }
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request<{ user: any }>('/auth/me', { method: 'POST' }),
    changePassword: (currentPassword: string, newPassword: string) =>
      request('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },
  projects: {
    list: () => request<any[]>('/projects'),
    get: (id: string) => request<any>(`/projects/${id}`),
    commits: (id: string, cursor?: string) =>
      request<any[]>(`/projects/${id}/commits${cursor ? `?cursor=${cursor}` : ''}`),
    messages: (id: string, cursor?: string) =>
      request<any[]>(`/projects/${id}/messages${cursor ? `?cursor=${cursor}` : ''}`),
  },
};
