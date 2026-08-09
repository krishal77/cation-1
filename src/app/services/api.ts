const API_BASE = '/api';

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('cg_token', token);
  } else {
    localStorage.removeItem('cg_token');
  }
}

export function getToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('cg_token');
  }
  return authToken;
}

export function clearToken() {
  authToken = null;
  localStorage.removeItem('cg_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  return data;
}

export function logoutUser() {
  clearToken();
}

export interface HeritageSite {
  _id?: string;
  name: string;
  location: string;
  description: string;
  historicalSignificance?: string;
  tags?: string[];
  imageUrl?: string;
}

export async function getHeritageSites(): Promise<HeritageSite[]> {
  return request<HeritageSite[]>('/heritage');
}

export async function getHeritageSiteByName(name: string): Promise<HeritageSite> {
  return request<HeritageSite>(`/heritage/${encodeURIComponent(name)}`);
}

export interface RecognitionResult {
  success: boolean;
  siteName: string;
  confidence: number;
  isConfident: boolean;
  threshold: number;
  allScores: [string, number][];
  metadata: {
    name: string;
    location: string;
    description: string;
  } | null;
}

export async function recognizeSite(imageFile: File): Promise<RecognitionResult> {
  const formData = new FormData();
  formData.append('image', imageFile);
  return request<RecognitionResult>('/recognize', {
    method: 'POST',
    body: formData,
  });
}

export interface StoryData {
  siteName: string;
  title: string;
  narrative: string;
  highlights: string[];
  location: string;
  source: string;
  model?: string;
  generatedAt: string;
}

export async function generateStory(
  siteName: string,
  customPrompt?: string
): Promise<StoryData> {
  return request<StoryData>('/story', {
    method: 'POST',
    body: JSON.stringify({ siteName, customPrompt }),
  });
}

export interface ChatGuideMessage {
  sender: 'user' | 'ara';
  text: string;
}

export interface ChatGuideResponse {
  reply: string;
  source: string;
  model?: string;
}

export async function chatWithGuide(
  siteName: string,
  userMessage: string,
  history?: ChatGuideMessage[]
): Promise<ChatGuideResponse> {
  return request<ChatGuideResponse>('/story/chat', {
    method: 'POST',
    body: JSON.stringify({ siteName, userMessage, history }),
  });
}

export async function checkHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch('/health');
  return response.json();
}

