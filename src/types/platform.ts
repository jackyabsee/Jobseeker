export type Language = 'zh' | 'en';

export type ThemePalette = 'indigo' | 'sapphire' | 'rose';

export type DemoViewMode = 'website' | 'app' | 'split';

export type EmploymentType = 'full-time' | 'part-time' | 'headhunter';

export type AdTier = 'standard' | 'gold' | 'diamond';

export type ApplicationStage = 'new' | 'chatting' | 'cv_sent' | 'interview' | 'offer';

export type WebTab = 'jobs' | 'headhunters' | 'messages' | 'resume' | 'employer';

export type MobileTab = 'jobs' | 'headhunters' | 'messages' | 'resume' | 'me';

export interface JobListing {
  id: string;
  titleZh: string;
  titleEn: string;
  companyZh: string;
  companyEn: string;
  agencyNameZh?: string;
  agencyNameEn?: string;
  districtZh: string;
  districtEn: string;
  districtKey: string;
  salaryLabelZh: string;
  salaryLabelEn: string;
  salaryMinK: number;
  employmentType: EmploymentType;
  isSponsored: boolean;
  adTier: AdTier;
  matchScore: number;
  tagsZh: string[];
  tagsEn: string[];
  experienceZh: string;
  experienceEn: string;
  educationZh: string;
  educationEn: string;
  descriptionZh: string;
  descriptionEn: string;
  requirementsZh: string[];
  requirementsEn: string[];
  recruiterName: string;
  recruiterRoleZh: string;
  recruiterRoleEn: string;
  recruiterOnlineTextZh: string;
  recruiterOnlineTextEn: string;
  avatarGradient: string;
  postedAtZh: string;
  postedAtEn: string;
  viewsCount: number;
  chatsCount: number;
}

export interface HeadhunterAgency {
  id: string;
  nameZh: string;
  nameEn: string;
  specialtyZh: string;
  specialtyEn: string;
  consultantName: string;
  consultantTitleZh: string;
  consultantTitleEn: string;
  placementsCount: number;
  avgSalaryLabel: string;
  rating: number;
  verified: boolean;
  activeRolesCount: number;
  bioZh: string;
  bioEn: string;
  avatarGradient: string;
}

export interface ChatMessage {
  id: string;
  sender: 'candidate' | 'recruiter' | 'system';
  textZh: string;
  textEn: string;
  timestamp: string;
  attachmentType?: 'cv_pdf' | 'interview_card';
  attachmentMeta?: {
    fileName?: string;
    interviewTime?: string;
    locationZh?: string;
    locationEn?: string;
  };
}

export interface ChatThread {
  id: string;
  jobId: string;
  stage: ApplicationStage;
  unreadCandidate: number;
  unreadEmployer: number;
  isTyping?: boolean;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface WorkExperienceItem {
  id: string;
  roleZh: string;
  roleEn: string;
  companyZh: string;
  companyEn: string;
  period: string;
  summaryZh: string;
  summaryEn: string;
  isNewFromCv?: boolean;
}

export interface EducationItem {
  id: string;
  schoolZh: string;
  schoolEn: string;
  degreeZh: string;
  degreeEn: string;
  period: string;
}

export interface CandidateProfile {
  nameZh: string;
  nameEn: string;
  titleZh: string;
  titleEn: string;
  email: string;
  phone: string;
  locationZh: string;
  locationEn: string;
  expectedSalary: string;
  statusZh: string;
  statusEn: string;
  summaryZh: string;
  summaryEn: string;
  skills: string[];
  experiences: WorkExperienceItem[];
  educations: EducationItem[];
  resumeFileName?: string;
  resumeUpdatedAt?: string;
}

export interface AdPackage {
  tier: AdTier;
  nameZh: string;
  nameEn: string;
  priceLabel: string;
  durationZh: string;
  durationEn: string;
  badgeZh: string;
  badgeEn: string;
  featuresZh: string[];
  featuresEn: string[];
  popular?: boolean;
}

export interface NewJobAdInput {
  titleZh: string;
  titleEn: string;
  companyZh: string;
  companyEn: string;
  agencyNameZh?: string;
  agencyNameEn?: string;
  districtKey: string;
  salaryLabelZh: string;
  salaryLabelEn: string;
  salaryMinK: number;
  employmentType: EmploymentType;
  adTier: AdTier;
  tagsZh: string[];
  tagsEn: string[];
  descriptionZh: string;
  descriptionEn: string;
  recruiterName: string;
}
