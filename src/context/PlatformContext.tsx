import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  DISCOVERED_CV_EXPERIENCE,
  DISCOVERED_CV_SKILLS,
  HK_DISTRICTS,
  SEED_AGENCIES,
  SEED_JOBS,
  SEED_PROFILE,
  SEED_THREADS,
} from '../data/seedData';
import type {
  AdTier,
  CandidateProfile,
  ChatMessage,
  ChatThread,
  DemoViewMode,
  HeadhunterAgency,
  JobListing,
  Language,
  MobileTab,
  NewJobAdInput,
  ThemePalette,
  WebTab,
} from '../types/platform';

const STORAGE_KEY = 'hirepulse_hk_demo_v1';

interface PersistedState {
  language: Language;
  theme: ThemePalette;
  viewMode: DemoViewMode;
  jobs: JobListing[];
  threads: ChatThread[];
  savedJobIds: string[];
  profile: CandidateProfile;
  pendingParsedCv: boolean;
  cvApplied: boolean;
}

interface PlatformContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (zh: string, en: string) => string;
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  viewMode: DemoViewMode;
  setViewMode: (mode: DemoViewMode) => void;
  webTab: WebTab;
  setWebTab: (tab: WebTab) => void;
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  jobs: JobListing[];
  agencies: HeadhunterAgency[];
  threads: ChatThread[];
  savedJobIds: string[];
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  pendingParsedCv: boolean;
  cvApplied: boolean;
  isParsingCv: boolean;
  totalUnreadCandidate: number;
  toastMessage: string | null;
  showToast: (msgZh: string, msgEn: string) => void;
  toggleSavedJob: (jobId: string) => void;
  openOrCreateChat: (jobId: string) => string;
  markThreadRead: (threadId: string) => void;
  sendCandidateMessage: (threadId: string, text: string) => void;
  sendEmployerReply: (threadId: string, text: string) => void;
  sendResumeToChat: (threadId: string) => void;
  bookInterviewInChat: (threadId: string, slotLabel?: string) => void;
  publishJobAd: (input: NewJobAdInput) => JobListing;
  upgradeJobAdTier: (jobId: string, tier: AdTier) => void;
  simulateCvUpload: (fileName?: string) => void;
  applyParsedCv: () => void;
  dismissParsedCv: () => void;
  resetDemo: () => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

function nowTimeStr(): string {
  const d = new Date();
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function getInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.jobs && parsed.threads && parsed.profile) {
        return {
          language: parsed.language ?? 'zh',
          theme: parsed.theme ?? 'indigo',
          viewMode: parsed.viewMode ?? 'website',
          jobs: parsed.jobs,
          threads: parsed.threads,
          savedJobIds: parsed.savedJobIds ?? ['job-hh-1', 'job-ft-1'],
          profile: parsed.profile,
          pendingParsedCv: parsed.pendingParsedCv ?? true,
          cvApplied: parsed.cvApplied ?? false,
        };
      }
    }
  } catch {
    // Fallback to clean seed
  }
  return {
    language: 'zh',
    theme: 'indigo',
    viewMode: 'website',
    jobs: SEED_JOBS,
    threads: SEED_THREADS,
    savedJobIds: ['job-hh-1', 'job-ft-1'],
    profile: SEED_PROFILE,
    pendingParsedCv: true,
    cvApplied: false,
  };
}

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(() => getInitialState(), []);

  const [language, setLanguage] = useState<Language>(initial.language);
  const [theme, setTheme] = useState<ThemePalette>(initial.theme);
  const [viewMode, setViewMode] = useState<DemoViewMode>(initial.viewMode);
  const [webTab, setWebTab] = useState<WebTab>('jobs');
  const [mobileTab, setMobileTab] = useState<MobileTab>('jobs');
  const [jobs, setJobs] = useState<JobListing[]>(initial.jobs);
  const [threads, setThreads] = useState<ChatThread[]>(initial.threads);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(initial.savedJobIds);
  const [profile, setProfile] = useState<CandidateProfile>(initial.profile);
  const [pendingParsedCv, setPendingParsedCv] = useState<boolean>(initial.pendingParsedCv);
  const [cvApplied, setCvApplied] = useState<boolean>(initial.cvApplied);
  const [isParsingCv, setIsParsingCv] = useState<boolean>(false);
  const [activeThreadId, setActiveThreadId] = useState<string>(initial.threads[0]?.id ?? 'thread-1');
  const [selectedJobId, setSelectedJobId] = useState<string>(initial.jobs[0]?.id ?? 'job-hh-1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<number | null>(null);

  const t = useCallback((zh: string, en: string) => (language === 'zh' ? zh : en), [language]);

  const showToast = useCallback(
    (msgZh: string, msgEn: string) => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      setToastMessage(language === 'zh' ? msgZh : msgEn);
      toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 3200);
    },
    [language]
  );

  // Sync theme attribute on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'indigo') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Persist to localStorage
  useEffect(() => {
    try {
      const stateToSave: PersistedState = {
        language,
        theme,
        viewMode,
        jobs,
        threads,
        savedJobIds,
        profile,
        pendingParsedCv,
        cvApplied,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Ignore quota errors
    }
  }, [language, theme, viewMode, jobs, threads, savedJobIds, profile, pendingParsedCv, cvApplied]);

  const totalUnreadCandidate = useMemo(
    () => threads.reduce((sum, th) => sum + th.unreadCandidate, 0),
    [threads]
  );

  const toggleSavedJob = useCallback(
    (jobId: string) => {
      setSavedJobIds((prev) => {
        const exists = prev.includes(jobId);
        if (exists) {
          showToast('已從收藏移除', 'Removed from saved jobs');
          return prev.filter((id) => id !== jobId);
        }
        showToast('已收藏職位！', 'Job saved!');
        return [jobId, ...prev];
      });
    },
    [showToast]
  );

  const markThreadRead = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((th) => (th.id === threadId ? { ...th, unreadCandidate: 0 } : th))
    );
  }, []);

  const openOrCreateChat = useCallback(
    (jobId: string): string => {
      const existing = threads.find((th) => th.jobId === jobId);
      if (existing) {
        setActiveThreadId(existing.id);
        markThreadRead(existing.id);
        return existing.id;
      }

      const job = jobs.find((j) => j.id === jobId) ?? jobs[0];
      const newThreadId = `thread-${Date.now()}`;
      const time = nowTimeStr();

      const greetingMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'recruiter',
        textZh: `你好 ${profile.nameZh}！多謝關注「${job.titleZh}」(${job.salaryLabelZh})。我係 ${job.recruiterName}，請問你對呢個職位有邊方面想先了解？歡迎直接傾或 Send CV 過嚟！`,
        textEn: `Hi ${profile.nameEn}! Thanks for reaching out on "${job.titleEn}" (${job.salaryLabelEn}). I'm ${job.recruiterName}—feel free to ask anything or share your CV here!`,
        timestamp: time,
      };

      const newThread: ChatThread = {
        id: newThreadId,
        jobId: job.id,
        stage: 'new',
        unreadCandidate: 0,
        unreadEmployer: 1,
        updatedAt: time,
        messages: [greetingMsg],
      };

      setThreads((prev) => [newThread, ...prev]);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, chatsCount: j.chatsCount + 1 } : j))
      );
      setActiveThreadId(newThreadId);
      return newThreadId;
    },
    [threads, jobs, profile.nameZh, profile.nameEn, markThreadRead]
  );

  const triggerSimulatedRecruiterReply = useCallback(
    (threadId: string, candidateText: string, mode: 'text' | 'cv' | 'interview') => {
      window.setTimeout(() => {
        setThreads((prev) =>
          prev.map((th) => (th.id === threadId ? { ...th, isTyping: true } : th))
        );
      }, 350);

      window.setTimeout(() => {
        const lower = candidateText.toLowerCase();
        let replyZh =
          '收到你嘅訊息！你嘅背景好符合我哋對呢個職位嘅要求，方便直接一鍵傳送履歷過嚟，或者睇下星期四/五邊個時間方便傾 15 分鐘？';
        let replyEn =
          'Thanks for the message! Your background aligns strongly with what we are looking for. Feel free to tap "Send CV" above, or let me know if Thursday/Friday works for a 15-min call!';

        if (mode === 'cv') {
          replyZh =
            '已經收到你份 PDF 履歷！我會立即重點審閱並向用人部門/客戶推薦，通常 24 小時內會有面試安排通知。你亦可以撳上方「預約面試時間」鎖定優先時段。';
          replyEn =
            'Received your PDF CV! I am fast-tracking your profile directly to the hiring decision-maker right now. You can also tap "Book Interview" above to lock in a priority slot!';
        } else if (mode === 'interview') {
          replyZh =
            '太好啦！已經幫你確認呢個面試時段，詳細會議連結同公司資料亦已同步到你嘅行程，到時見！';
          replyEn =
            'Awesome! Your interview slot is confirmed and the meeting link + brief have been synced. Speak soon!';
        } else if (lower.includes('人工') || lower.includes('salary') || lower.includes('薪') || lower.includes('budget')) {
          replyZh =
            '呢個職位薪酬彈性好大，除咗月薪之外亦有年終雙糧、績效花紅同醫療保障；如果履歷表現出色，我哋可以幫你爭取上限甚至更高 package！';
          replyEn =
            'Compensation is very competitive—on top of the base range, there is a 13th-month bonus, performance incentive, and comprehensive medical. Happy to push for the top band!';
        } else if (lower.includes('幾時') || lower.includes('面試') || lower.includes('interview') || lower.includes('zoom')) {
          replyZh =
            '我哋老闆/部門主管本週四下晝 3:00 或星期五上午 11:00 都可以先做個 20 分鐘視像初面，邊個時間啱你？';
          replyEn =
            'The hiring manager is free this Thursday at 3:00 PM or Friday at 11:00 AM for a 20-min video intro—which works better for you?';
        }

        const time = nowTimeStr();
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sender: 'recruiter',
          textZh: replyZh,
          textEn: replyEn,
          timestamp: time,
        };

        setThreads((prev) =>
          prev.map((th) => {
            if (th.id !== threadId) return th;
            return {
              ...th,
              isTyping: false,
              updatedAt: time,
              messages: [...th.messages, replyMsg],
            };
          })
        );
      }, 1250);
    },
    []
  );

  const sendCandidateMessage = useCallback(
    (threadId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const time = nowTimeStr();
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'candidate',
        textZh: trimmed,
        textEn: trimmed,
        timestamp: time,
      };

      setThreads((prev) =>
        prev.map((th) => {
          if (th.id !== threadId) return th;
          return {
            ...th,
            stage: th.stage === 'new' ? 'chatting' : th.stage,
            unreadCandidate: 0,
            unreadEmployer: th.unreadEmployer + 1,
            updatedAt: time,
            messages: [...th.messages, newMsg],
          };
        })
      );

      triggerSimulatedRecruiterReply(threadId, trimmed, 'text');
    },
    [triggerSimulatedRecruiterReply]
  );

  const sendEmployerReply = useCallback((threadId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const time = nowTimeStr();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'recruiter',
      textZh: trimmed,
      textEn: trimmed,
      timestamp: time,
    };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id !== threadId) return th;
        return {
          ...th,
          stage: th.stage === 'new' ? 'chatting' : th.stage,
          unreadCandidate: th.unreadCandidate + 1,
          unreadEmployer: 0,
          isTyping: false,
          updatedAt: time,
          messages: [...th.messages, newMsg],
        };
      })
    );
  }, []);

  const sendResumeToChat = useCallback(
    (threadId: string) => {
      const time = nowTimeStr();
      const fileName = profile.resumeFileName || '李嘉俊_JasonLee_CV_2026.pdf';
      const cvMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'candidate',
        textZh: '已傳送個人履歷附件',
        textEn: 'Sent CV attachment',
        timestamp: time,
        attachmentType: 'cv_pdf',
        attachmentMeta: { fileName },
      };

      setThreads((prev) =>
        prev.map((th) => {
          if (th.id !== threadId) return th;
          const nextStage = th.stage === 'interview' || th.stage === 'offer' ? th.stage : 'cv_sent';
          return {
            ...th,
            stage: nextStage,
            unreadEmployer: th.unreadEmployer + 1,
            updatedAt: time,
            messages: [...th.messages, cvMsg],
          };
        })
      );

      showToast('已發送履歷 PDF 給對方！', 'CV PDF sent!');
      triggerSimulatedRecruiterReply(threadId, 'cv', 'cv');
    },
    [profile.resumeFileName, showToast, triggerSimulatedRecruiterReply]
  );

  const bookInterviewInChat = useCallback(
    (threadId: string, slotLabel = '週五 (Fri) 11:00 – 11:30') => {
      const time = nowTimeStr();
      const interviewMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'candidate',
        textZh: `我已選擇優先面試時段：${slotLabel}`,
        textEn: `I've selected a preferred interview slot: ${slotLabel}`,
        timestamp: time,
        attachmentType: 'interview_card',
        attachmentMeta: {
          interviewTime: slotLabel,
          locationZh: 'Zoom 視像面試 / 面對面洽談',
          locationEn: 'Zoom Video Call / In-person Office',
        },
      };

      setThreads((prev) =>
        prev.map((th) => {
          if (th.id !== threadId) return th;
          return {
            ...th,
            stage: 'interview',
            unreadEmployer: th.unreadEmployer + 1,
            updatedAt: time,
            messages: [...th.messages, interviewMsg],
          };
        })
      );

      showToast('已發送面試時間確認！', 'Interview slot confirmed!');
      triggerSimulatedRecruiterReply(threadId, 'interview', 'interview');
    },
    [showToast, triggerSimulatedRecruiterReply]
  );

  const publishJobAd = useCallback(
    (input: NewJobAdInput): JobListing => {
      const districtObj = HK_DISTRICTS.find((d) => d.key === input.districtKey) ?? HK_DISTRICTS[1];
      const isSponsored = input.adTier !== 'standard';
      const newJob: JobListing = {
        id: `job-custom-${Date.now()}`,
        titleZh: input.titleZh,
        titleEn: input.titleEn || input.titleZh,
        companyZh: input.companyZh,
        companyEn: input.companyEn || input.companyZh,
        agencyNameZh: input.agencyNameZh || undefined,
        agencyNameEn: input.agencyNameEn || input.agencyNameZh || undefined,
        districtZh: districtObj.zh,
        districtEn: districtObj.en,
        districtKey: districtObj.key === 'all' ? 'central' : districtObj.key,
        salaryLabelZh: input.salaryLabelZh,
        salaryLabelEn: input.salaryLabelEn || input.salaryLabelZh,
        salaryMinK: input.salaryMinK,
        employmentType: input.employmentType,
        isSponsored,
        adTier: input.adTier,
        matchScore: isSponsored ? 97 : 92,
        tagsZh: input.tagsZh.length > 0 ? input.tagsZh : ['新發佈', '直對決策人', '5天工作'],
        tagsEn: input.tagsEn.length > 0 ? input.tagsEn : ['Just Posted', 'Direct Boss', '5-Day Week'],
        experienceZh: '3年或以上',
        experienceEn: '3+ Years',
        educationZh: '大學學位或以上',
        educationEn: "Bachelor's Degree+",
        descriptionZh: input.descriptionZh,
        descriptionEn: input.descriptionEn || input.descriptionZh,
        requirementsZh: [
          '具備相關香港市場或行業實戰經驗',
          '良好中英文溝通能力，主動積極',
          '歡迎直接點擊對話並發送履歷洽談',
        ],
        requirementsEn: [
          'Proven Hong Kong or regional industry track record',
          'Strong bilingual communication and ownership mindset',
          'Tap Chat Now to speak directly with the hiring lead',
        ],
        recruiterName: input.recruiterName || 'Recruitment Lead',
        recruiterRoleZh: input.agencyNameZh ? `獵頭顧問 · ${input.agencyNameZh}` : `招聘負責人 · ${input.companyZh}`,
        recruiterRoleEn: input.agencyNameEn
          ? `Headhunter · ${input.agencyNameEn}`
          : `Hiring Lead · ${input.companyEn || input.companyZh}`,
        recruiterOnlineTextZh: '剛剛發佈 · 在線中',
        recruiterOnlineTextEn: 'Just posted · Online',
        avatarGradient:
          input.adTier === 'diamond'
            ? 'from-orange-500 to-rose-600'
            : input.adTier === 'gold'
              ? 'from-amber-500 to-orange-600'
              : 'from-indigo-600 to-violet-600',
        postedAtZh: '剛剛發佈',
        postedAtEn: 'Just now',
        viewsCount: 1,
        chatsCount: 0,
      };

      setJobs((prev) => [newJob, ...prev]);
      setSelectedJobId(newJob.id);
      showToast('職位廣告已即時上架至網站及手機 App！', 'Job ad is now live across Web & Mobile App!');
      return newJob;
    },
    [showToast]
  );

  const upgradeJobAdTier = useCallback(
    (jobId: string, tier: AdTier) => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                adTier: tier,
                isSponsored: tier !== 'standard',
                postedAtZh: tier === 'diamond' ? '鑽石置頂 · 剛剛升級' : '黃金推薦 · 剛剛升級',
                postedAtEn: tier === 'diamond' ? 'Diamond Ad · Boosted' : 'Gold Ad · Boosted',
              }
            : j
        )
      );
      showToast('已升級為置頂推廣廣告！', 'Upgraded to Sponsored Ad placement!');
    },
    [showToast]
  );

  const simulateCvUpload = useCallback(
    (fileName?: string) => {
      setIsParsingCv(true);
      const finalName = fileName || 'JasonLee_AI_FinTech_Resume_2026.pdf';
      window.setTimeout(() => {
        setIsParsingCv(false);
        setProfile((prev) => ({
          ...prev,
          resumeFileName: finalName,
          resumeUpdatedAt: '2026-11-18',
        }));
        setPendingParsedCv(true);
        setCvApplied(false);
        showToast('AI 已完成履歷解析，發現新工作經歷！', 'AI parsed your CV and found new experience!');
      }, 1150);
    },
    [showToast]
  );

  const applyParsedCv = useCallback(() => {
    setProfile((prev) => {
      const alreadyHas = prev.experiences.some((e) => e.id === DISCOVERED_CV_EXPERIENCE.id);
      const mergedSkills = Array.from(new Set([...prev.skills, ...DISCOVERED_CV_SKILLS]));
      return {
        ...prev,
        skills: mergedSkills,
        experiences: alreadyHas ? prev.experiences : [DISCOVERED_CV_EXPERIENCE, ...prev.experiences],
      };
    });
    setJobs((prev) =>
      prev.map((j) => ({
        ...j,
        matchScore: Math.min(99, j.matchScore + 4),
      }))
    );
    setPendingParsedCv(false);
    setCvApplied(true);
    showToast('已加入檔案！全站職位匹配度及推薦已升級', 'Added to profile! Job match scores boosted');
  }, [showToast]);

  const dismissParsedCv = useCallback(() => {
    setPendingParsedCv(false);
  }, []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLanguage('zh');
    setTheme('indigo');
    setJobs(SEED_JOBS);
    setThreads(SEED_THREADS);
    setSavedJobIds(['job-hh-1', 'job-ft-1']);
    setProfile(SEED_PROFILE);
    setPendingParsedCv(true);
    setCvApplied(false);
    setActiveThreadId(SEED_THREADS[0].id);
    setSelectedJobId(SEED_JOBS[0].id);
    setWebTab('jobs');
    setMobileTab('jobs');
    showToast('已重置演示數據', 'Demo data reset');
  }, [showToast]);

  const value: PlatformContextValue = {
    language,
    setLanguage,
    t,
    theme,
    setTheme,
    viewMode,
    setViewMode,
    webTab,
    setWebTab,
    mobileTab,
    setMobileTab,
    activeThreadId,
    setActiveThreadId,
    selectedJobId,
    setSelectedJobId,
    jobs,
    agencies: SEED_AGENCIES,
    threads,
    savedJobIds,
    profile,
    setProfile,
    pendingParsedCv,
    cvApplied,
    isParsingCv,
    totalUnreadCandidate,
    toastMessage,
    showToast,
    toggleSavedJob,
    openOrCreateChat,
    markThreadRead,
    sendCandidateMessage,
    sendEmployerReply,
    sendResumeToChat,
    bookInterviewInChat,
    publishJobAd,
    upgradeJobAdTier,
    simulateCvUpload,
    applyParsedCv,
    dismissParsedCv,
    resetDemo,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
