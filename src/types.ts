/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'lecturer' | 'admin' | 'leadership';

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  status: UserStatus;
  joinedDate: string;
  submissionsCount?: number;
}

export type SubmissionStatus = 'processing' | 'completed' | 'failed';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FlaggedSegment {
  id: string;
  text: string;
  matchType: 'similarity' | 'ai' | 'citation_issue';
  sourceTitle?: string;
  sourceUrl?: string;
  similarityPercent?: number;
  explanation: string;
}

export interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  assignmentTitle: string;
  status: SubmissionStatus;
  integrityScore: number; // overall security or safety score
  similarityScore: number; // plagiarism %
  citationScore: number; // correctly cited score
  aiProbability: number; // AI generation probability
  riskClassification: RiskLevel;
  dateSubmitted: string;
  fileDetails: {
    name: string;
    size: string;
    type: string;
  };
  notes?: string;
  flaggedSegments: FlaggedSegment[];
}

export interface CourseMetric {
  id: string;
  name: string;
  lecturer: string;
  totalSubmissions: number;
  avgIntegrity: number;
  highRiskCount: number;
  studentsCount: number;
}

export interface DepartmentMetric {
  id: string;
  name: string;
  head: string;
  integrityScore: number;
  studentCount: number;
  lecturerCount: number;
  alertsCount: number;
  riskTrend: number[]; // Sparkline data values
}

export interface InstitutionReport {
  id: string;
  title: string;
  type: 'Integrity Audit' | 'Accreditation Readiness' | 'Plagiarism Prevalence' | 'Policy Impact';
  dateGenerated: string;
  createdBy: string;
  status: 'ready' | 'generating';
  downloadUrl?: string;
  summary: string;
}

export interface SystemAlert {
  id: string;
  type: 'critical_risk' | 'system' | 'upload_success' | 'flagged';
  title: string;
  message: string;
  date: string;
  read: boolean;
  meta?: {
    submissionId?: string;
    courseName?: string;
  };
}
