// Simple in-memory store for MVP - replace with database in production
import bcrypt from "bcryptjs";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
};

export type SavedReport = {
  id: string;
  userId: string;
  url: string;
  title: string;
  score: number;
  data: any;
  createdAt: Date;
};

// In-memory stores
const users: Map<string, User> = new Map();
const reports: Map<string, SavedReport> = new Map();

// User operations
export async function createUser(email: string, password: string, name: string): Promise<User> {
  const existingUser = Array.from(users.values()).find(u => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    passwordHash,
    createdAt: new Date(),
  };

  users.set(user.id, user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = Array.from(users.values()).find(u => u.email === email);
  return user || null;
}

export async function findUserById(id: string): Promise<User | null> {
  return users.get(id) || null;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

// Report operations
export async function saveReport(userId: string, reportData: any): Promise<SavedReport> {
  const report: SavedReport = {
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    url: reportData.url,
    title: reportData.title || "Untitled",
    score: reportData.score || 0,
    data: reportData,
    createdAt: new Date(),
  };

  reports.set(report.id, report);
  return report;
}

export async function getUserReports(userId: string): Promise<SavedReport[]> {
  return Array.from(reports.values())
    .filter(r => r.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getReportById(reportId: string): Promise<SavedReport | null> {
  return reports.get(reportId) || null;
}

export async function deleteReport(reportId: string, userId: string): Promise<boolean> {
  const report = reports.get(reportId);
  if (report && report.userId === userId) {
    reports.delete(reportId);
    return true;
  }
  return false;
}
