const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

// ==========================================
// 1. DATA ENTITY INTERFACES
// ==========================================

// 1. Common fields shared by everyone
export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  role: "STUDENT" | "TEACHER";
  bio?: string;
  // New Instructor Fields
  subjects?: string[];    // e.g., ["Systems Integration", "Web Development"]
  yearLevels?: string[];  // e.g., ["BSIT - Year 1", "BSIT - Year 3"]
  // Existing fields
  totalQuizzesTaken?: number;
  averageScore?: number;
  achievementsCount?: number;
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

// ==========================================
// 2. REQUEST PAYLOAD INTERFACES
// ==========================================

export interface UpdateUserProfileRequest {
  username?: string;
  email?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface QuestionRequest {
  content: string;
  options: string[];       // Multiple choice options (e.g., ["A", "B", "C", "D"])
  correctAnswer: string;   // The text of the correct answer
  points: number;          // Weight/Score points for this question
}

export interface CreateQuizRequest {
  title: string;
  category: string;
  timeLimit: number;       // In minutes
  teacherId: number;
  revealAnswersToStudents: boolean; // Control if students can see answers post-submission
  weightInFinalGrade: number;       // Percentage weight of this quiz in the total grade
  questions: QuestionRequest[];
}

export interface StudentGradeRecord {
  studentId: number;
  studentName: string;
  quizTitle: string;
  rawScore: number;
  maxScore: number;
  weightedScore: number;  // Calculated using the weightInFinalGrade percentage
  finalOverrideGrade?: number; // Manual override control for the teacher
}

// ==========================================
// 3. API WORKER METHODS
// ==========================================

// --- User Profile Endpoints ---
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

// --- Student Analytics & History Endpoints ---
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

// --- Teacher Access Control & Grading Endpoints ---
export async function createNewQuiz(data: CreateQuizRequest): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create new quiz configuration");
  return response.json();
}

export async function getStudentGrades(teacherId: number): Promise<StudentGradeRecord[]> {
  const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}/grades`);
  if (!response.ok) throw new Error("Failed to pull student grade ledger matrix");
  return response.json();
}

export async function updateStudentOverrideGrade(
  studentId: number, 
  quizId: number, 
  overrideGrade: number
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/grades/override`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, quizId, overrideGrade }),
  });
  if (!response.ok) throw new Error("Failed to submit manual grade override adjustments");
  return response.json();
}