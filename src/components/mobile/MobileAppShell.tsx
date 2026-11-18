import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bookmark,
  Briefcase,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  FileCheck2,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  Megaphone,
  MessageCircle,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Upload,
  User,
  Wifi,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { DISCOVERED_CV_EXPERIENCE, DISCOVERED_CV_SKILLS, HK_DISTRICTS } from '../../data/seedData';
import type { ApplicationStage, EmploymentType, JobListing, MobileTab, ThemePalette } from '../../types/platform';

interface MobileAppShellProps {
  showStatusBar?: boolean;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({ showStatusBar = true }) => {
  const {
    mobileTab,
    setMobileTab,
    jobs,
    agencies,
    threads,
    savedJobIds,
    toggleSavedJob,
    profile,
    pendingParsedCv,
    isParsingCv,
    simulateCvUpload,
    applyParsedCv,
    dismissParsedCv,
    openOrCreateChat,
    activeThreadId,
    setActiveThreadId,
    markThreadRead,
    sendCandidateMessage,
    sendResumeToChat,
    bookInterviewInChat,
    publishJobAd,
    totalUnreadCandidate,
    theme,
    setTheme,
    language,
    setLanguage,
    t,
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [chipFilter, setChipFilter] = useState<'all' | EmploymentType | 'highpay' | 'central'>('all');
  const [detailJob, setDetailJob] = useState<JobListing | null>(null);
  const [inChatScreen, setInChatScreen] = useState(false);
  const [chatStageFilter, setChatStageFilter] = useState<'all' | ApplicationStage>('all');
  const [chatDraft, setChatDraft] = useState('');
  const [showQuickPostModal, setShowQuickPostModal] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickSalary, setQuickSalary] = useState('HK$50K–70K/月');
  const [quickCompany, setQuickCompany] = useState('Apex 客戶企業');
  const [quickDistrict, setQuickDistrict] = useState('central');
  const mobileFileRef = useRef<HTMLInputElement | null>(null);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      if (chipFilter === 'headhunter' && job.employmentType !== 'headhunter') return false;
      if (chipFilter === 'full-time' && job.employmentType !== 'full-time') return false;
      if (chipFilter === 'part-time' && job.employmentType !== 'part-time') return false;
      if (chipFilter === 'highpay' && job.salaryMinK < 50) return false;
      if (chipFilter === 'central' && job.districtKey !== 'central') return false;
      if (!q) return true;
      return [job.titleZh, job.titleEn, job.companyZh, job.companyEn, job.districtZh, job.agencyNameZh ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [jobs, searchQuery, chipFilter]);

  const activeThread = useMemo(
    () => threads.find((th) => th.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  );

  const activeThreadJob = useMemo(
    () => jobs.find((j) => j.id === activeThread?.jobId) ?? jobs[0],
    [jobs, activeThread]
  );

  const filteredThreads = useMemo(() => {
    if (chatStageFilter === 'all') return threads;
    return threads.filter((th) => th.stage === chatStageFilter);
  }, [threads, chatStageFilter]);

  const handleOpenJobChat = (jobId: string) => {
    openOrCreateChat(jobId);
    setDetailJob(null);
    setMobileTab('messages');
    setInChatScreen(true);
  };

  const handleSendMobileChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !chatDraft.trim()) return;
    sendCandidateMessage(activeThread.id, chatDraft);
    setChatDraft('');
  };

  const handleQuickMobilePost = (e: React.FormEvent) => {
    e.preventDefault();
    const title = quickTitle.trim() || 'Senior Sales & Account Manager 客戶總監';
    publishJobAd({
      titleZh: title,
      titleEn: title,
      companyZh: quickCompany.trim() || '香港合作企業',
      companyEn: quickCompany.trim() || 'HK Partner Enterprise',
      agencyNameZh: '手機極速直發 · 置頂推薦',
      agencyNameEn: 'Mobile Instant Boost',
      districtKey: quickDistrict,
      salaryLabelZh: quickSalary.trim() || 'HK$50K–70K/月',
      salaryLabelEn: quickSalary.trim() || 'HK$50K–70K/mo',
      salaryMinK: 50,
      employmentType: 'headhunter',
      adTier: 'diamond',
      tagsZh: ['手機直發 AD', '老闆在線'],
      tagsEn: ['Mobile Ad', 'Boss Online'],
      descriptionZh: '透過 HirePulse HK 手機 App 端即時發佈的急聘職位，支援網頁版同步曝光。',
      descriptionEn: 'Instant job ad posted from HirePulse HK Mobile App, synced live with Desktop Web.',
      recruiterName: 'App Recruiter',
    });
    setQuickTitle('');
    setShowQuickPostModal(false);
    setMobileTab('jobs');
  };

  const stageText = (stage: ApplicationStage) => {
    switch (stage) {
      case 'new':
        return t('新招呼', 'New');
      case 'chatting':
        return t('溝通中', 'Chatting');
      case 'cv_sent':
        return t('已發履歷', 'CV Sent');
      case 'interview':
        return t('已約面試', 'Interview');
      default:
        return t('已取錄', 'Offer');
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-50 text-slate-900 select-none">
      {/* Simulated iOS Status Bar */}
      {showStatusBar && (
        <div className="flex shrink-0 items-center justify-between bg-brand-700 px-6 pb-1.5 pt-3 text-[11px] font-bold text-white">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <Wifi className="h-3 w-3" />
            <span className="rounded-[4px] bg-white/25 px-1 text-[10px]">100%</span>
          </div>
        </div>
      )}

      {/* Main Mobile Screen Body */}
      <div className="relative flex-1 overflow-y-auto no-scrollbar">
        {/* TAB 1: JOBS FEED */}
        {mobileTab === 'jobs' && (
          <div className="pb-4">
            {/* Mobile App Brand Header */}
            <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-4 pb-4 pt-2 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold tracking-tight">HirePulse HK</span>
                    <span className="rounded-md bg-accent-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                      App
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-100">{t('搵工，直接同老闆及獵頭傾', 'Direct Boss & Headhunter Chat')}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm"
                >
                  {language === 'zh' ? '繁 / EN' : 'EN / 繁'}
                </button>
              </div>

              {/* Search Input */}
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('搜尋職位、獵頭、中環高薪...', 'Search roles, headhunters, Central...')}
                  className="w-full rounded-xl bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Quick Chips */}
              <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { key: 'all' as const, zh: '推薦職位', en: 'For You' },
                  { key: 'headhunter' as const, zh: '獵頭高薪', en: 'Headhunter' },
                  { key: 'full-time' as const, zh: '全職', en: 'Full-Time' },
                  { key: 'part-time' as const, zh: '兼職', en: 'Part-Time' },
                  { key: 'highpay' as const, zh: '$50K+', en: '$50K+' },
                  { key: 'central' as const, zh: '中環', en: 'Central' },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setChipFilter(c.key)}
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition ${
                      chipFilter === c.key
                        ? 'bg-accent-500 text-white shadow-sm'
                        : 'bg-white/15 text-white/90 hover:bg-white/25'
                    }`}
                  >
                    {t(c.zh, c.en)}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart CV Banner on Mobile Home */}
            {pendingParsedCv && (
              <div className="mx-3 mt-3 flex items-center justify-between gap-2 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-accent-50 p-3 shadow-sm">
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-[11px] font-extrabold text-brand-700">
                    <Sparkles className="h-3 w-3 text-accent-500" />
                    {t('發現可補充工作經歷', 'New CV Experience Found')}
                  </p>
                  <p className="truncate text-[10px] text-slate-600">
                    {t('加入檔案即可提升好工自動推薦精準度', 'Add to boost your smart job match score')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('resume')}
                  className="shrink-0 rounded-lg bg-brand-600 px-2.5 py-1.5 text-[10px] font-bold text-white"
                >
                  {t('去查看', 'Review')}
                </button>
              </div>
            )}

            {/* Mobile Job Cards List */}
            <div className="space-y-2.5 px-3 pt-3">
              {filteredJobs.map((job) => {
                const saved = savedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    onClick={() => setDetailJob(job)}
                    className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {job.isSponsored && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-accent-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                              <Crown className="h-2.5 w-2.5" />
                              {job.adTier === 'diamond' ? t('置頂', 'AD') : t('推薦', 'HOT')}
                            </span>
                          )}
                          <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[9px] font-extrabold text-brand-700">
                            {job.matchScore}% {t('匹配', 'Match')}
                          </span>
                        </div>
                        <h3 className="mt-1 text-[13px] font-extrabold leading-snug text-slate-900">
                          {t(job.titleZh, job.titleEn)}
                        </h3>
                      </div>

                      <span className="shrink-0 text-[13px] font-extrabold text-brand-600">
                        {t(job.salaryLabelZh, job.salaryLabelEn)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {(language === 'zh' ? job.tagsZh : job.tagsEn).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${job.avatarGradient} text-[10px] font-bold text-white`}
                        >
                          {job.recruiterName.slice(0, 1)}
                        </div>
                        <span className="truncate text-[11px] font-medium text-slate-600">
                          {job.recruiterName} · {t(job.districtZh, job.districtEn)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSavedJob(job.id);
                          }}
                          className={`p-1 ${saved ? 'text-accent-500' : 'text-slate-400'}`}
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenJobChat(job.id);
                          }}
                          className="rounded-lg bg-brand-600 px-2.5 py-1 text-[10px] font-bold text-white"
                        >
                          {t('立即傾', 'Chat')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HEADHUNTERS */}
        {mobileTab === 'headhunters' && (
          <div className="space-y-3 p-3.5 pb-6">
            <div className="rounded-2xl bg-gradient-to-r from-brand-700 to-slate-900 p-4 text-white">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-accent-300">
                <Award className="h-3.5 w-3.5" />
                <span>{t('認證獵頭專區', 'Verified Headhunters')}</span>
              </div>
              <h2 className="mt-1 text-base font-extrabold">
                {t('直連香港星級獵頭顧問', 'Chat With Top HK Headhunters')}
              </h2>
              <p className="mt-1 text-[11px] text-brand-100">
                {t('年薪 70 萬以上保密高管職位搶先睇', 'Confidential HK$700K+ mandates & fast-track interviews')}
              </p>
            </div>

            {agencies.map((ag) => {
              const relatedJob = jobs.find((j) => j.recruiterName === ag.consultantName) ?? jobs[0];
              return (
                <div key={ag.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${ag.avatarGradient} text-sm font-extrabold text-white`}
                      >
                        {ag.consultantName.slice(0, 1)}
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-900">{t(ag.nameZh, ag.nameEn)}</h3>
                        <p className="text-[11px] font-semibold text-brand-600">
                          {ag.consultantName} · {ag.avgSalaryLabel}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold text-accent-700">
                      <Star className="h-3 w-3 fill-accent-500 text-accent-500" />
                      {ag.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600">{t(ag.specialtyZh, ag.specialtyEn)}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {ag.activeRolesCount} {t('個在招職位', 'live roles')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenJobChat(relatedJob.id)}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-[11px] font-bold text-white"
                    >
                      {t('直接聯絡顧問', 'Message')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: MESSAGES LIST */}
        {mobileTab === 'messages' && !inChatScreen && (
          <div className="pb-4">
            <div className="border-b border-slate-200 bg-white px-4 py-3">
              <h2 className="text-base font-extrabold text-slate-900">{t('訊息與申請進度', 'Messages & Progress')}</h2>
              <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar">
                {(
                  [
                    { key: 'all', zh: '全部', en: 'All' },
                    { key: 'new', zh: '新招呼', en: 'New' },
                    { key: 'chatting', zh: '溝通中', en: 'Chat' },
                    { key: 'cv_sent', zh: '已發履歷', en: 'CV Sent' },
                    { key: 'interview', zh: '面試', en: 'Interview' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setChatStageFilter(s.key)}
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                      chatStageFilter === s.key
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {t(s.zh, s.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              {filteredThreads.map((th) => {
                const job = jobs.find((j) => j.id === th.jobId);
                if (!job) return null;
                const lastMsg = th.messages[th.messages.length - 1];
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setActiveThreadId(th.id);
                      markThreadRead(th.id);
                      setInChatScreen(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-slate-50"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${job.avatarGradient} text-sm font-bold text-white`}
                    >
                      {job.recruiterName.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{job.recruiterName}</span>
                        <span className="text-[10px] text-slate-400">{th.updatedAt}</span>
                      </div>
                      <p className="truncate text-[11px] font-semibold text-brand-600">
                        {t(job.titleZh, job.titleEn)}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {lastMsg ? t(lastMsg.textZh, lastMsg.textEn) : ''}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                        {stageText(th.stage)}
                      </span>
                      {th.unreadCandidate > 0 && (
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                          {th.unreadCandidate}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SMART CV */}
        {mobileTab === 'resume' && (
          <div className="space-y-3 p-3.5 pb-6">
            <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-extrabold">
                  {profile.nameZh.slice(0, 1)}
                </div>
                <div>
                  <h2 className="text-base font-extrabold">{t(profile.nameZh, profile.nameEn)}</h2>
                  <p className="text-[11px] text-brand-100">{t(profile.titleZh, profile.titleEn)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-[11px]">
                <span>{t('目前在線履歷', 'Active CV File')}</span>
                <span className="max-w-[160px] truncate font-bold text-accent-300">
                  {profile.resumeFileName}
                </span>
              </div>
            </div>

            <input
              ref={mobileFileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) simulateCvUpload(f.name);
              }}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isParsingCv}
                onClick={() => mobileFileRef.current?.click()}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-[11px] font-bold text-white"
              >
                {isParsingCv ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {t('上載履歷', 'Upload CV')}
              </button>
              <button
                type="button"
                disabled={isParsingCv}
                onClick={() => simulateCvUpload('JasonLee_2026_SmartCV.pdf')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 py-2.5 text-[11px] font-bold text-brand-700"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent-500" />
                {t('AI 範例解析', 'AI Demo Parse')}
              </button>
            </div>

            {pendingParsedCv && (
              <div className="rounded-2xl border-2 border-brand-500 bg-white p-3.5 shadow-sm">
                <p className="text-xs font-extrabold text-brand-700">
                  {t('✨ 我們在上載的履歷中發現工作經歷', '✨ New Work Experience Detected')}
                </p>
                <p className="mt-1 text-[11px] font-bold text-slate-900">
                  {t(DISCOVERED_CV_EXPERIENCE.roleZh, DISCOVERED_CV_EXPERIENCE.roleEn)}
                </p>
                <p className="text-[10px] text-slate-500">
                  {t(DISCOVERED_CV_EXPERIENCE.companyZh, DISCOVERED_CV_EXPERIENCE.companyEn)} · {DISCOVERED_CV_EXPERIENCE.period}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {DISCOVERED_CV_SKILLS.map((s) => (
                    <span key={s} className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">
                      + {s}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={dismissParsedCv}
                    className="flex-1 rounded-xl border border-slate-200 py-1.5 text-[11px] font-bold text-slate-600"
                  >
                    {t('不加入', 'Skip')}
                  </button>
                  <button
                    type="button"
                    onClick={applyParsedCv}
                    className="flex-1 rounded-xl bg-brand-600 py-1.5 text-[11px] font-bold text-white"
                  >
                    {t('加入檔案', 'Add to Profile')}
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
              <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <Briefcase className="h-3.5 w-3.5 text-brand-600" />
                {t('工作經歷', 'Work Experience')}
              </h3>
              <div className="mt-2.5 space-y-2.5">
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="rounded-xl bg-slate-50 p-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900">{t(exp.roleZh, exp.roleEn)}</span>
                      {exp.isNewFromCv && (
                        <span className="rounded bg-accent-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-semibold text-brand-600">
                      {t(exp.companyZh, exp.companyEn)} · {exp.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
              <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <GraduationCap className="h-3.5 w-3.5 text-brand-600" />
                {t('學歷', 'Education')}
              </h3>
              {profile.educations.map((edu) => (
                <div key={edu.id} className="mt-2">
                  <p className="text-xs font-bold text-slate-900">{t(edu.schoolZh, edu.schoolEn)}</p>
                  <p className="text-[10px] text-slate-500">
                    {t(edu.degreeZh, edu.degreeEn)} · {edu.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ME / PROFILE / QUICK AD POST */}
        {mobileTab === 'me' && (
          <div className="space-y-3 p-3.5 pb-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-extrabold text-white">
                  {profile.nameZh.slice(0, 1)}
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">{t(profile.nameZh, profile.nameEn)}</h2>
                  <p className="text-[11px] text-slate-500">{profile.expectedSalary}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
                {[
                  { val: threads.length, zh: '溝通中', en: 'Chats' },
                  { val: threads.filter((x) => x.stage === 'cv_sent').length, zh: '已發CV', en: 'CV Sent' },
                  { val: threads.filter((x) => x.stage === 'interview').length, zh: '待面試', en: 'Interview' },
                  { val: savedJobIds.length, zh: '已收藏', en: 'Saved' },
                ].map((stat) => (
                  <div key={stat.zh} className="rounded-xl bg-slate-50 py-2">
                    <p className="text-sm font-extrabold text-brand-600">{stat.val}</p>
                    <p className="text-[10px] text-slate-500">{t(stat.zh, stat.en)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Headhunter Quick Ad Post Trigger */}
            <button
              type="button"
              onClick={() => setShowQuickPostModal(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 p-4 text-left text-white shadow-md"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold">
                  <Megaphone className="h-4 w-4" />
                  <span>{t('獵頭 / 僱主手機極速發廣告', 'Recruiter Quick Post Ad')}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-white/90">
                  {t('點擊即時發佈職位，同步出現於網站與 App', 'Publish a live job synced to Web & App')}
                </p>
              </div>
              <Plus className="h-5 w-5" />
            </button>

            {/* Quick Theme Switch inside Mobile App */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
              <p className="text-xs font-extrabold text-slate-900">{t('App 主題配色切換', 'App Theme Color')}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'indigo', zh: '皇家靛紫', en: 'Indigo', dot: 'bg-[#4F46E5]' },
                    { id: 'sapphire', zh: '海灣寶藍', en: 'Sapphire', dot: 'bg-[#0284C7]' },
                    { id: 'rose', zh: '緋紅尊榮', en: 'Crimson', dot: 'bg-[#E11D48]' },
                  ] as { id: ThemePalette; zh: string; en: string; dot: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTheme(item.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-bold ${
                      theme === item.id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                    <span>{t(item.zh, item.en)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setMobileTab('resume')}
                className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-brand-600" />
                  {t('管理我的智能履歷', 'Manage Smart CV')}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-slate-700"
              >
                <span>{t('介面語言：繁體中文 (香港)', 'Language: English')}</span>
                <span className="text-[11px] text-brand-600">{t('切換 EN', 'Switch 繁中')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE JOB DETAIL SLIDE-UP OVERLAY */}
      {detailJob && (
        <div className="absolute inset-0 z-30 flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <button
              type="button"
              onClick={() => setDetailJob(null)}
              className="flex items-center gap-1 text-xs font-bold text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('返回', 'Back')}</span>
            </button>
            <span className="text-xs font-extrabold text-brand-600">
              {detailJob.matchScore}% {t('智能匹配', 'Match')}
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 no-scrollbar">
            <div>
              {detailJob.isSponsored && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Crown className="h-3 w-3" />
                  {t('獵頭置頂廣告', 'Sponsored Mandate')}
                </span>
              )}
              <h2 className="mt-2 text-lg font-extrabold leading-snug text-slate-900">
                {t(detailJob.titleZh, detailJob.titleEn)}
              </h2>
              <p className="mt-1 text-base font-extrabold text-brand-600">
                {t(detailJob.salaryLabelZh, detailJob.salaryLabelEn)}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-brand-500" />
                  {t(detailJob.districtZh, detailJob.districtEn)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-brand-500" />
                  {t(detailJob.experienceZh, detailJob.experienceEn)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${detailJob.avatarGradient} text-sm font-bold text-white`}
              >
                {detailJob.recruiterName.slice(0, 1)}
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">{detailJob.recruiterName}</p>
                <p className="text-[11px] text-slate-500">
                  {t(detailJob.recruiterRoleZh, detailJob.recruiterRoleEn)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-extrabold text-slate-900">{t('職位介紹', 'Description')}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {t(detailJob.descriptionZh, detailJob.descriptionEn)}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-extrabold text-slate-900">{t('職位要求', 'Requirements')}</h3>
              <ul className="mt-1.5 space-y-1.5">
                {(language === 'zh' ? detailJob.requirementsZh : detailJob.requirementsEn).map((req) => (
                  <li key={req} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={() => toggleSavedJob(detailJob.id)}
              className={`rounded-xl border p-2.5 ${
                savedJobIds.includes(detailJob.id)
                  ? 'border-accent-200 bg-accent-50 text-accent-600'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${savedJobIds.includes(detailJob.id) ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => handleOpenJobChat(detailJob.id)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-xs font-extrabold text-white shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t('立即與老闆 / 獵頭傾', 'Chat Now')}</span>
            </button>
          </div>
        </div>
      )}

      {/* FULL-SCREEN MOBILE CHAT ROOM */}
      {mobileTab === 'messages' && inChatScreen && activeThread && activeThreadJob && (
        <div className="absolute inset-0 z-30 flex flex-col bg-slate-50">
          {showStatusBar && <div className="h-7 shrink-0 bg-brand-700" />}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5">
            <button
              type="button"
              onClick={() => setInChatScreen(false)}
              className="flex items-center gap-1 text-xs font-bold text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1 px-2 text-center">
              <p className="truncate text-xs font-extrabold text-slate-900">{activeThreadJob.recruiterName}</p>
              <p className="truncate text-[10px] text-brand-600">
                {t(activeThreadJob.titleZh, activeThreadJob.titleEn)} · {t(activeThreadJob.salaryLabelZh, activeThreadJob.salaryLabelEn)}
              </p>
            </div>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              {stageText(activeThread.stage)}
            </span>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto p-3 no-scrollbar">
            {activeThread.messages.map((msg) => {
              const isCandidate = msg.sender === 'candidate';
              return (
                <div key={msg.id} className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isCandidate
                        ? 'rounded-br-sm bg-brand-600 text-white'
                        : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    <p>{t(msg.textZh, msg.textEn)}</p>
                    {msg.attachmentType === 'cv_pdf' && (
                      <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-white/15 p-1.5 text-[10px] font-bold">
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{msg.attachmentMeta?.fileName}</span>
                      </div>
                    )}
                    {msg.attachmentType === 'interview_card' && (
                      <div className="mt-1.5 rounded-lg bg-brand-50 p-2 text-[10px] text-slate-800">
                        <p className="font-extrabold text-brand-700">{t('面試預約已確認', 'Interview Confirmed')}</p>
                        <p className="font-bold">{msg.attachmentMeta?.interviewTime}</p>
                      </div>
                    )}
                  </div>
                  <span className="mt-0.5 text-[9px] text-slate-400">{msg.timestamp}</span>
                </div>
              );
            })}
            {activeThread.isTyping && (
              <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-500" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-500" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-500" />
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-2.5">
            <div className="mb-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => sendResumeToChat(activeThread.id)}
                className="flex-1 rounded-lg bg-brand-50 py-1.5 text-[10px] font-bold text-brand-700"
              >
                {t('📄 發送履歷 PDF', '📄 Send CV')}
              </button>
              <button
                type="button"
                onClick={() => bookInterviewInChat(activeThread.id)}
                className="flex-1 rounded-lg bg-accent-50 py-1.5 text-[10px] font-bold text-accent-700"
              >
                <CalendarCheck className="mr-1 inline h-3 w-3" />
                {t('預約面試', 'Book Interview')}
              </button>
            </div>
            <form onSubmit={handleSendMobileChat} className="flex gap-1.5">
              <input
                type="text"
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                placeholder={t('輸入訊息...', 'Type message...')}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
              />
              <button type="submit" className="rounded-xl bg-brand-600 px-3 py-2 text-white">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE QUICK POST AD MODAL */}
      {showQuickPostModal && (
        <div className="absolute inset-0 z-40 flex items-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full rounded-t-3xl bg-white p-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                {t('手機極速刊登獵頭廣告', 'Quick Mobile Job Post')}
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickPostModal(false)}
                className="text-xs font-bold text-slate-500"
              >
                {t('關閉', 'Close')}
              </button>
            </div>
            <form onSubmit={handleQuickMobilePost} className="mt-3 space-y-2.5">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder={t('職位名稱 (例：Senior FinTech Sales)', 'Job title...')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
              />
              <input
                type="text"
                value={quickCompany}
                onChange={(e) => setQuickCompany(e.target.value)}
                placeholder={t('公司 / 獵頭客戶名稱', 'Company / Client')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={quickSalary}
                  onChange={(e) => setQuickSalary(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                />
                <select
                  value={quickDistrict}
                  onChange={(e) => setQuickDistrict(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs"
                >
                  {HK_DISTRICTS.filter((d) => d.key !== 'all').map((d) => (
                    <option key={d.key} value={d.key}>
                      {t(d.zh, d.en)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-brand-600 py-2.5 text-xs font-extrabold text-white"
              >
                {t('立即上架 (置頂同步至網站)', 'Publish Live (Synced to Web)')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom 5-Tab Navigation Bar */}
      <nav className="grid shrink-0 grid-cols-5 border-t border-slate-200 bg-white pb-2 pt-1.5">
        {(
          [
            { id: 'jobs', icon: <Briefcase className="h-4 w-4" />, zh: '職位', en: 'Jobs' },
            { id: 'headhunters', icon: <Building2 className="h-4 w-4" />, zh: '獵頭', en: 'Search' },
            {
              id: 'messages',
              icon: <MessageCircle className="h-4 w-4" />,
              zh: '訊息',
              en: 'Chat',
              badge: totalUnreadCandidate,
            },
            { id: 'resume', icon: <FileText className="h-4 w-4" />, zh: '履歷', en: 'CV' },
            { id: 'me', icon: <User className="h-4 w-4" />, zh: '我的', en: 'Me' },
          ] as { id: MobileTab; icon: React.ReactNode; zh: string; en: string; badge?: number }[]
        ).map((tab) => {
          const active = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMobileTab(tab.id);
                setInChatScreen(false);
                setDetailJob(null);
              }}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold transition ${
                active ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-extrabold text-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span>{t(tab.zh, tab.en)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
