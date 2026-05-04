const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

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
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
}

export async function updateUserProfile(
  userId: number,
  data: UpdateUserProfileRequest
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update user profile");
  return response.json();
}

export async function getUserQuizHistory(userId: number): Promise<QuizHistory[]> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/quiz-history`);
  if (!response.ok) throw new Error("Failed to fetch quiz history");
  return response.json();
}

export async function getUserScores(userId: number): Promise<QuizHistory[]> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/scores`);
  if (!response.ok) throw new Error("Failed to fetch scores");
  return response.json();
}

export async function getUserAchievements(userId: number): Promise<Achievement[]> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/achievements`);
  if (!response.ok) throw new Error("Failed to fetch achievements");
  return response.json();
}
