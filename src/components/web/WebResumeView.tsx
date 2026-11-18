import React, { useMemo, useRef, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Sparkles,
  Upload,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { DISCOVERED_CV_EXPERIENCE, DISCOVERED_CV_SKILLS } from '../../data/seedData';

export const WebResumeView: React.FC = () => {
  const {
    profile,
    setProfile,
    pendingParsedCv,
    cvApplied,
    isParsingCv,
    simulateCvUpload,
    applyParsedCv,
    dismissParsedCv,
    jobs,
    openOrCreateChat,
    setWebTab,
    setSelectedJobId,
    t,
  } = usePlatform();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newSkill, setNewSkill] = useState('');

  const topRecommendedJobs = useMemo(
    () => [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4),
    [jobs]
  );

  const readinessScore = cvApplied ? 99 : pendingParsedCv ? 88 : 94;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateCvUpload(file.name);
      e.target.value = '';
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const s = newSkill.trim();
    if (!s) return;
    setProfile((prev) => ({
      ...prev,
      skills: Array.from(new Set([...prev.skills, s])),
    }));
    setNewSkill('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Profile Card + Upload Box */}
        <div className="space-y-5 lg:col-span-4">
          {/* Candidate Summary Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-2xl font-extrabold text-white shadow-md">
                {profile.nameZh.slice(0, 1)}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  {t(profile.nameZh, profile.nameEn)}
                </h1>
                <p className="text-xs font-semibold text-brand-600">
                  {t(profile.titleZh, profile.titleEn)}
                </p>
                <span className="mt-1.5 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
                  {t(profile.statusZh, profile.statusEn)}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-500" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-500" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand-500" />
                <span>
                  {t(profile.locationZh, profile.locationEn)} · {t('期望薪酬', 'Expected')}:{' '}
                  <strong className="text-slate-900">{profile.expectedSalary}</strong>
                </span>
              </div>
            </div>

            {/* Readiness Meter */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{t('履歷吸引力評分', 'CV Readiness Score')}</span>
                <span className="text-brand-600">{readinessScore}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                {cvApplied
                  ? t('已完成 AI 智能補充，獲得最高獵頭推薦權重！', 'AI profile boosted! Receiving maximum headhunter visibility.')
                  : t('上載或解析最新履歷即可提升高薪獵頭曝光率。', 'Upload or parse your latest CV to unlock higher headhunter visibility.')}
              </p>
            </div>
          </div>

          {/* Upload / AI Parse Card */}
          <div className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-card">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                {t('輕鬆上載履歷 · 好工自動推薦', 'Smart CV Upload & Auto-Match')}
              </h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              {t(
                '支援 PDF / Word 履歷自動解析工作經歷與關鍵技能，並同步更新至手機 App 及網站版。',
                'Upload PDF/DOCX to auto-extract experience and skills, synced live to Web & Mobile App.'
              )}
            </p>

            {profile.resumeFileName && (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
                <FileCheck2 className="h-5 w-5 shrink-0 text-brand-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900">{profile.resumeFileName}</p>
                  <p className="text-[10px] text-slate-400">
                    {t('更新日期', 'Updated')}: {profile.resumeUpdatedAt}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                disabled={isParsingCv}
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
              >
                {isParsingCv ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>
                  {isParsingCv
                    ? t('AI 正在解析履歷中...', 'Parsing CV...')
                    : t('上載本地履歷文件 (PDF/DOCX)', 'Upload Resume File (PDF/DOCX)')}
                </span>
              </button>

              <button
                type="button"
                disabled={isParsingCv}
                onClick={() => simulateCvUpload('JasonLee_Executive_2026_v2.pdf')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-xs font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4 text-accent-500" />
                <span>{t('✨ 一鍵試用 AI 履歷解析示範', '✨ Try 1-Click Sample CV Parse')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Resume Content + Smart Discovery Prompt + Recommended Jobs */}
        <div className="space-y-6 lg:col-span-8">
          {/* Smart CV Discovery Prompt (OfferToday-inspired, brand new Indigo/Coral aesthetic) */}
          {pendingParsedCv && (
            <div className="rounded-3xl border-2 border-brand-500 bg-gradient-to-r from-brand-50 via-white to-accent-50 p-5 shadow-soft">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-0.5 text-[11px] font-bold text-white">
                    <Sparkles className="h-3 w-3" />
                    <span>{t('AI 履歷智能識別提示', 'AI Smart CV Discovery')}</span>
                  </div>
                  <h3 className="mt-2 text-base font-extrabold text-slate-900">
                    {t(
                      '我們在上載的履歷中發現部分工作經歷與技能，是否需要補充至在線檔案並開啟好工自動推薦？',
                      'We detected additional work experience & skills in your uploaded CV. Add them to your profile for better job matching?'
                    )}
                  </h3>

                  <div className="mt-3 rounded-2xl border border-brand-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {t(DISCOVERED_CV_EXPERIENCE.roleZh, DISCOVERED_CV_EXPERIENCE.roleEn)}
                      </span>
                      <span className="rounded-md bg-accent-50 px-2 py-0.5 text-[11px] font-bold text-accent-700">
                        {DISCOVERED_CV_EXPERIENCE.period}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-brand-600">
                      {t(DISCOVERED_CV_EXPERIENCE.companyZh, DISCOVERED_CV_EXPERIENCE.companyEn)}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-600">
                      {t(DISCOVERED_CV_EXPERIENCE.summaryZh, DISCOVERED_CV_EXPERIENCE.summaryEn)}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">{t('新增技能：', 'New skills:')}</span>
                      {DISCOVERED_CV_SKILLS.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={dismissParsedCv}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {t('暫不加入', 'Skip')}
                </button>
                <button
                  type="button"
                  onClick={applyParsedCv}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t('加入檔案並提升匹配度', 'Add to Profile & Boost Matches')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Online Profile Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-base font-extrabold text-slate-900">
              {t('個人優勢及專業技能', 'Professional Summary & Skills')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t(profile.summaryZh, profile.summaryEn)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="mt-4 flex max-w-sm gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder={t('新增專業技能標籤...', 'Add skill tag...')}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:border-brand-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                {t('新增', 'Add')}
              </button>
            </form>

            {/* Work Experience */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-brand-600" />
                <h3 className="text-base font-extrabold text-slate-900">{t('工作經歷', 'Work Experience')}</h3>
              </div>

              <div className="mt-4 space-y-4">
                {profile.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className={`rounded-2xl border p-4 ${
                      exp.isNewFromCv ? 'border-brand-300 bg-brand-50/40' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{t(exp.roleZh, exp.roleEn)}</h4>
                        {exp.isNewFromCv && (
                          <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            {t('AI 新加入', 'AI Added')}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{exp.period}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-brand-600">{t(exp.companyZh, exp.companyEn)}</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{t(exp.summaryZh, exp.summaryEn)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brand-600" />
                <h3 className="text-base font-extrabold text-slate-900">{t('學歷背景', 'Education')}</h3>
              </div>
              <div className="mt-3 space-y-3">
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{t(edu.schoolZh, edu.schoolEn)}</h4>
                      <p className="text-xs text-slate-600">{t(edu.degreeZh, edu.degreeEn)}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{edu.period}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-Recommended Jobs */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                {t('根據你履歷自動推薦的高薪好工', 'Auto-Matched High-Fit Roles')}
              </h2>
              <button
                type="button"
                onClick={() => setWebTab('jobs')}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                {t('瀏覽全部職位 →', 'Browse all jobs →')}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {topRecommendedJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-extrabold text-brand-700">
                        {job.matchScore}% {t('匹配', 'Match')}
                      </span>
                      <span className="text-xs font-extrabold text-accent-600">
                        {t(job.salaryLabelZh, job.salaryLabelEn)}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-slate-900">{t(job.titleZh, job.titleEn)}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {t(job.agencyNameZh || job.companyZh, job.agencyNameEn || job.companyEn)} ·{' '}
                      {t(job.districtZh, job.districtEn)}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setWebTab('jobs');
                      }}
                      className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {t('查看', 'View')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openOrCreateChat(job.id);
                        setWebTab('messages');
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-brand-600 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      {t('直接傾', 'Chat')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
