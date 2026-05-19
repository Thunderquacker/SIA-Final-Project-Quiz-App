const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api";

// Auth Types
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
}

export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  totalQuizzesTaken: number;
  averageScore: number;
  achievementsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizHistory {
  historyId: number;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
  completedAt: string;
}

export interface Achievement {
  achievementId: number;
  title: string;
  description: string;
  badgeUrl?: string;
  type: string;
  unlockedAt: string;
}

export interface UpdateUserProfileRequest {
  username?: string;
  email?: string;
  bio?: string;
  profileImageUrl?: string;
}

export async function getUserProfile(userId: number): Promise<UserProfile> {
  const response = await apiFetch(`/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
}

export async function updateUserProfile(
  userId: number,
  data: UpdateUserProfileRequest
): Promise<UserProfile> {
  const response = await apiFetch(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update user profile");
  return response.json();
}

export async function getUserQuizHistory(userId: number): Promise<QuizHistory[]> {
  const response = await apiFetch(`/users/${userId}/quiz-history`);
  if (!response.ok) throw new Error("Failed to fetch quiz history");
  return response.json();
}

export async function getUserScores(userId: number): Promise<QuizHistory[]> {
  const response = await apiFetch(`/users/${userId}/scores`);
  if (!response.ok) throw new Error("Failed to fetch scores");
  return response.json();
}

export async function getUserAchievements(userId: number): Promise<Achievement[]> {
  const response = await apiFetch(`/users/${userId}/achievements`);
  if (!response.ok) throw new Error("Failed to fetch achievements");
  return response.json();
}

// ============ JWT TOKEN MANAGEMENT ============

const TOKEN_KEY = "minu_auth_token";
const USER_ID_KEY = "minu_user_id";
const USERNAME_KEY = "minu_username";

export function saveToken(token: string, userId: number, username: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId.toString());
  localStorage.setItem(USERNAME_KEY, username);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserId(): number | null {
  const id = localStorage.getItem(USER_ID_KEY);
  return id ? parseInt(id) : null;
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// ============ API HELPER WITH AUTH ============

async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

// ============ AUTH ENDPOINTS ============

export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Signup failed");
  }
  const authResponse: AuthResponse = await response.json();
  saveToken(authResponse.token, authResponse.userId, authResponse.username);
  return authResponse;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  const authResponse: AuthResponse = await response.json();
  saveToken(authResponse.token, authResponse.userId, authResponse.username);
  return authResponse;
}

export function logout(): void {
  clearAuth();
}

// ============ QUIZ TYPES AND ENDPOINTS ============

export interface OptionDTO {
  optionId?: number;
  optionText: string;
  isCorrect: boolean;
  displayOrder?: number;
}

export interface QuestionDTO {
  questionId?: number;
  questionText: string;
  displayOrder?: number;
  options: OptionDTO[];
}

export interface QuizDTO {
  quizId?: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  userId?: number;
  username?: string;
  questions: QuestionDTO[];
  questionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  questions: {
    questionText: string;
    displayOrder?: number;
    options: {
      optionText: string;
      isCorrect: boolean;
      displayOrder?: number;
    }[];
  }[];
}

export async function createQuiz(data: CreateQuizRequest): Promise<QuizDTO> {
  const response = await apiFetch("/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create quiz");
  }
  const result = await response.json();
  return result.quiz;
}

export async function getQuiz(quizId: number): Promise<QuizDTO> {
  const response = await apiFetch(`/quizzes/${quizId}`);
  if (!response.ok) throw new Error("Failed to fetch quiz");
  return response.json();
}

export async function getUserQuizzes(userId: number): Promise<QuizDTO[]> {
  const response = await apiFetch(`/quizzes/user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user quizzes");
  return response.json();
}

export async function getAllQuizzes(): Promise<QuizDTO[]> {
  const response = await apiFetch("/quizzes");
  if (!response.ok) throw new Error("Failed to fetch quizzes");
  return response.json();
}

export async function deleteQuiz(quizId: number): Promise<void> {
  const response = await apiFetch(`/quizzes/${quizId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete quiz");
}
