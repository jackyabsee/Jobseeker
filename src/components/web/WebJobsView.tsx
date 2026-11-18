import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  GraduationCap,
  MapPin,
  MessageCircle,
  Search,
  Send,
  Smartphone,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { HK_DISTRICTS } from '../../data/seedData';
import type { EmploymentType, JobListing } from '../../types/platform';

export const WebJobsView: React.FC<{ isSplitPane?: boolean }> = ({ isSplitPane = false }) => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    savedJobIds,
    toggleSavedJob,
    openOrCreateChat,
    sendResumeToChat,
    setWebTab,
    setViewMode,
    t,
  } = usePlatform();

  const [query, setQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | EmploymentType>('all');
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);

  const sponsoredJobs = useMemo(
    () => jobs.filter((j) => j.isSponsored).slice(0, 4),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (typeFilter !== 'all' && job.employmentType !== typeFilter) return false;
      if (districtFilter !== 'all' && job.districtKey !== districtFilter) return false;
      if (minSalaryFilter > 0 && job.salaryMinK < minSalaryFilter) return false;
      if (!q) return true;
      const hay = [
        job.titleZh,
        job.titleEn,
        job.companyZh,
        job.companyEn,
        job.agencyNameZh ?? '',
        job.agencyNameEn ?? '',
        job.districtZh,
        job.districtEn,
        ...job.tagsZh,
        ...job.tagsEn,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [jobs, query, districtFilter, typeFilter, minSalaryFilter]);

  const activeJob: JobListing | undefined = useMemo(() => {
    return filteredJobs.find((j) => j.id === selectedJobId) ?? filteredJobs[0] ?? jobs[0];
  }, [filteredJobs, selectedJobId, jobs]);

  const handleChatNow = (jobId: string) => {
    openOrCreateChat(jobId);
    setWebTab('messages');
  };

  const handleQuickSendCv = (jobId: string) => {
    const threadId = openOrCreateChat(jobId);
    sendResumeToChat(threadId);
    setWebTab('messages');
  };

  return (
    <div>
      {/* Hero Banner — Royal Indigo / Brand Gradient (Non-Green) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 backdrop-blur-sm">
                <Flame className="h-3.5 w-3.5 text-accent-400" />
                <span>{t('香港新一代求職與獵頭直聘平台', 'Hong Kong Direct Boss & Headhunter Hiring')}</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                {t('搵好工，直接同老闆及金牌獵頭傾', 'Land Top HK Roles. Chat Directly With Bosses & Headhunters.')}
              </h1>
              <p className="mt-2 text-sm text-brand-100/90 sm:text-base">
                {t(
                  '全職、兼職、年薪百萬獵頭獨家職位一網打盡；一鍵發送履歷、實時面試預約，手機 App 與網頁版雙端同步。',
                  'Full-time, flexible part-time, and confidential headhunter mandates in one place—instant chat, 1-click CV parsing, and live Web + Mobile sync.'
                )}
              </p>
            </div>

            {!isSplitPane && (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setViewMode('app')}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
                >
                  <Smartphone className="h-4 w-4 text-accent-300" />
                  <span>{t('體驗手機 App 版', 'Try Mobile App')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWebTab('employer')}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-accent-600/30 transition hover:bg-accent-600"
                >
                  <Crown className="h-4 w-4" />
                  <span>{t('獵頭 / 企業刊登廣告', 'Post Headhunter Ad')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Search & Quick Filters Card */}
          <div className="mt-6 rounded-2xl border border-white/15 bg-white p-3 text-slate-900 shadow-xl sm:p-4">
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12">
              <div className="relative md:col-span-5">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('搜尋職位、公司、獵頭行或關鍵字 (例: FinTech, Sales, AI)', 'Search role, company, headhunter, skill...')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  {HK_DISTRICTS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {t(d.zh, d.en)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={minSalaryFilter}
                  onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  <option value={0}>{t('不限薪酬', 'Any Salary')}</option>
                  <option value={30}>HK$30K+ / {t('月', 'mo')}</option>
                  <option value={50}>HK$50K+ / {t('月', 'mo')}</option>
                  <option value={70}>HK$70K+ / {t('月', 'mo')}</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setDistrictFilter('all');
                    setTypeFilter('all');
                    setMinSalaryFilter(0);
                  }}
                  className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
                >
                  {query || districtFilter !== 'all' || typeFilter !== 'all' || minSalaryFilter > 0
                    ? t('重設篩選', 'Clear Filters')
                    : t(`搵到 ${filteredJobs.length} 份好工`, `${filteredJobs.length} Jobs Live`)}
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {[
                { key: 'all' as const, zh: '全部職位', en: 'All Roles' },
                { key: 'headhunter' as const, zh: '獵頭高薪精選', en: 'Headhunter Executive' },
                { key: 'full-time' as const, zh: '企業全職直聘', en: 'Full-Time Direct' },
                { key: 'part-time' as const, zh: '兼職 / 彈性工作', en: 'Part-Time / Flex' },
              ].map((pill) => {
                const active = typeFilter === pill.key;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => setTypeFilter(pill.key)}
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                      active
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t(pill.zh, pill.en)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Sponsored Headhunter Showcase */}
        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-500 text-white">
                <Crown className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                {t('金牌獵頭置頂廣告專區', 'Sponsored Headhunter Spotlight')}
              </h2>
              <span className="hidden rounded-full bg-accent-50 px-2.5 py-0.5 text-[11px] font-bold text-accent-700 sm:inline">
                {t('置頂高薪獨家委託', 'Promoted Executive Mandates')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setWebTab('employer')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              {t('我有職位想置頂推廣 →', 'Boost your job ad →')}
            </button>
          </div>

          <div className={`grid grid-cols-1 gap-3.5 sm:grid-cols-2 ${isSplitPane ? 'xl:grid-cols-2' : 'lg:grid-cols-4'}`}>
            {sponsoredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`group cursor-pointer rounded-2xl border bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft ${
                  activeJob?.id === job.id ? 'border-brand-500 ring-2 ring-brand-500/15' : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      job.adTier === 'diamond'
                        ? 'bg-gradient-to-r from-accent-500 to-rose-500 text-white'
                        : 'bg-accent-100 text-accent-700'
                    }`}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {job.adTier === 'diamond' ? t('鑽石置頂 AD', 'DIAMOND AD') : t('黃金推薦 AD', 'GOLD AD')}
                  </span>
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                    {job.matchScore}% {t('匹配', 'Match')}
                  </span>
                </div>

                <h3 className="mt-2.5 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-brand-700">
                  {t(job.titleZh, job.titleEn)}
                </h3>
                <p className="mt-1 text-base font-extrabold text-accent-600">
                  {t(job.salaryLabelZh, job.salaryLabelEn)}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                  <span className="truncate font-medium text-slate-700">
                    {t(job.agencyNameZh || job.companyZh, job.agencyNameEn || job.companyEn)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {t(job.districtZh, job.districtEn)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChatNow(job.id);
                    }}
                    className="rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-brand-700"
                  >
                    {t('立即傾', 'Chat')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Master-Detail Split Job Board */}
        <section className={`grid grid-cols-1 gap-6 ${isSplitPane ? 'lg:grid-cols-12' : 'lg:grid-cols-12'}`}>
          {/* Left Job List */}
          <div className="space-y-3 lg:col-span-5">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-bold text-slate-700">
                {t(`精選職位列表 (${filteredJobs.length})`, `Job Feed (${filteredJobs.length})`)}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-brand-600">
                <TrendingUp className="h-3.5 w-3.5" />
                {t('按匹配度及置頂排序', 'Sorted by Match & Boost')}
              </span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  {t('暫無符合條件的職位', 'No jobs match your filters')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setDistrictFilter('all');
                    setTypeFilter('all');
                    setMinSalaryFilter(0);
                  }}
                  className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white"
                >
                  {t('顯示全部職位', 'Show All Jobs')}
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const selected = activeJob?.id === job.id;
                const saved = savedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`cursor-pointer rounded-2xl border bg-white p-4 transition-all ${
                      selected
                        ? 'border-brand-600 shadow-soft ring-2 ring-brand-500/15'
                        : 'border-slate-200/80 shadow-card hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {job.isSponsored && (
                            <span className="rounded-md bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {job.adTier === 'diamond' ? t('置頂廣告', 'AD') : t('推薦', 'BOOST')}
                            </span>
                          )}
                          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                            {job.matchScore}% {t('匹配', 'Match')}
                          </span>
                          <span className="text-[11px] text-slate-400">{t(job.postedAtZh, job.postedAtEn)}</span>
                        </div>
                        <h3 className="mt-1.5 text-base font-bold leading-snug text-slate-900">
                          {t(job.titleZh, job.titleEn)}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedJob(job.id);
                        }}
                        aria-label="Save job"
                        className={`rounded-lg p-1.5 transition ${
                          saved ? 'bg-accent-50 text-accent-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between gap-2">
                      <span className="text-sm font-extrabold text-brand-600">
                        {t(job.salaryLabelZh, job.salaryLabelEn)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {t(job.districtZh, job.districtEn)}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {(t('zh', 'en') === 'zh' ? job.tagsZh : job.tagsEn).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${job.avatarGradient} text-[11px] font-bold text-white`}
                        >
                          {job.recruiterName.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {job.recruiterName} · {t(job.agencyNameZh || job.companyZh, job.agencyNameEn || job.companyEn)}
                          </p>
                          <p className="text-[10px] font-medium text-brand-600">
                            {t(job.recruiterOnlineTextZh, job.recruiterOnlineTextEn)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatNow(job.id);
                        }}
                        className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white"
                      >
                        {t('直接傾', 'Chat')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Sticky Job Detail */}
          <div className="lg:col-span-7">
            {activeJob && (
              <div className="sticky top-[120px] rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeJob.isSponsored && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-bold text-white">
                          <Crown className="h-3 w-3" />
                          {t('獵頭置頂精選', 'Sponsored Mandate')}
                        </span>
                      )}
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                        {t(`AI 匹配度 ${activeJob.matchScore}%`, `${activeJob.matchScore}% Smart Match`)}
                      </span>
                    </div>

                    <h2 className="mt-2.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                      {t(activeJob.titleZh, activeJob.titleEn)}
                    </h2>
                    <p className="mt-1 text-lg font-extrabold text-brand-600">
                      {t(activeJob.salaryLabelZh, activeJob.salaryLabelEn)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-brand-500" />
                        {t(activeJob.districtZh, activeJob.districtEn)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-brand-500" />
                        {t(activeJob.experienceZh, activeJob.experienceEn)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-brand-500" />
                        {t(activeJob.educationZh, activeJob.educationEn)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-brand-500" />
                        {activeJob.employmentType === 'headhunter'
                          ? t('獵頭代理', 'Headhunter')
                          : activeJob.employmentType === 'part-time'
                            ? t('兼職 / 彈性', 'Part-Time')
                            : t('全職', 'Full-Time')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleChatNow(activeJob.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t('立即與老闆 / 獵頭對話', 'Chat With Boss / Headhunter')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickSendCv(activeJob.id)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-100"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t('一鍵發送履歷', '1-Click Send CV')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSavedJob(activeJob.id)}
                    className={`rounded-xl border px-3.5 py-3 text-sm font-semibold transition ${
                      savedJobIds.includes(activeJob.id)
                        ? 'border-accent-200 bg-accent-50 text-accent-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${savedJobIds.includes(activeJob.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Recruiter / Boss Card */}
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${activeJob.avatarGradient} text-sm font-bold text-white shadow-sm`}
                    >
                      {activeJob.recruiterName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900">{activeJob.recruiterName}</span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('實名認證', 'Verified')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {t(activeJob.recruiterRoleZh, activeJob.recruiterRoleEn)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                      <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                      {t(activeJob.recruiterOnlineTextZh, activeJob.recruiterOnlineTextEn)}
                    </span>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {activeJob.chatsCount} {t('人正在對話', 'active chats')}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {(t('zh', 'en') === 'zh' ? activeJob.tagsZh : activeJob.tagsEn).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description & Requirements */}
                <div className="mt-6 space-y-5 border-t border-slate-100 pt-5">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {t('職位簡介', 'Role Overview')}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {t(activeJob.descriptionZh, activeJob.descriptionEn)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {t('入職要求', 'Key Requirements')}
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {(t('zh', 'en') === 'zh' ? activeJob.requirementsZh : activeJob.requirementsEn).map(
                        (req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                            <span>{req}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">{t('招聘公司：', 'Company: ')}</span>
                    {t(activeJob.companyZh, activeJob.companyEn)}
                    {activeJob.agencyNameZh ? (
                      <>
                        {' · '}
                        <span className="font-bold text-brand-700">
                          {t(`代理獵頭：${activeJob.agencyNameZh}`, `Search Partner: ${activeJob.agencyNameEn}`)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
