const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Change {
  id: string;
  sourceName: string;
  sourceId: string;
  changeSummary: string;
  detectedAt: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  affectedSector: string;
  link: string;
  content?: string;
  matchedKeywords?: string[];
}

export interface ChangesResponse {
  changes: Change[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Stats {
  sourcesMonitored: number;
  totalSources: number;
  changesThisMonth: number;
  highRiskAlerts: number;
  criticalAlerts: number;
}

export interface Source {
  id: string;
  name: string;
  category: string;
  url: string;
  status: string;
  monitoring: boolean;
  lastChecked: string | null;
}

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Specific API methods
  getChanges: (page: number = 1, limit: number = 10): Promise<ChangesResponse> =>
    api.get(`/api/changes?page=${page}&limit=${limit}`),

  getChange: (id: string): Promise<Change> =>
    api.get(`/api/changes/${id}`),

  getStats: (): Promise<Stats> =>
    api.get('/api/stats'),

  getSources: (): Promise<{ sources: Source[] }> =>
    api.get('/api/sources'),
};
