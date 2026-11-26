// ─── Core Domain Types ─────────────────────────────────────────────────────

export type UserRole = "freelancer" | "client" | "admin" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  location: string;
  skills: string[];
  rating: number;
  totalEarnings: number;
  completedProjects: number;
  hourlyRate: number;
  availability: "available" | "busy" | "unavailable";
  verified: boolean;
  memberSince: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  organizationName: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  totalSpent: number;
  projectsPosted: number;
  memberSince: string;
  verified: boolean;
}

export interface AISkill {
  id: string;
  name: string;
  category: string;
  description: string;
  demandLevel: "high" | "medium" | "low";
  avgRate: number;
}

export interface AIService {
  id: string;
  title: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  category: string;
  description: string;
  price: number;
  deliveryDays: number;
  rating: number;
  reviews: number;
  tags: string[];
  status: "active" | "inactive";
}

export type ProjectStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientLogo: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  budgetType: "fixed" | "hourly";
  deadline: string;
  status: ProjectStatus;
  proposals: number;
  postedAt: string;
  category: string;
}

export type ProposalStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Proposal {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
  status: ProposalStatus;
  submittedAt: string;
}

export type AssignmentStatus =
  | "active"
  | "completed"
  | "paused"
  | "cancelled";

export interface Assignment {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerId: string;
  freelancerName: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: AssignmentStatus;
  progress: number;
}

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: string;
  projectId: string;
  projectTitle: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  date: string;
}

export interface Review {
  id: string;
  projectId: string;
  projectTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Complaint {
  id: string;
  projectId: string;
  projectTitle: string;
  raisedBy: string;
  raisedByRole: "freelancer" | "client";
  against: string;
  reason: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  raisedAt: string;
}

export interface Notification {
  id: string;
  type: "proposal" | "payment" | "review" | "assignment" | "system";
  message: string;
  read: boolean;
  time: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

export interface ChartDataPoint {
  month: string;
  value: number;
  secondary?: number;
}
