import React from 'react';
import { Award, Building2, CheckCircle2, Crown, Megaphone, MessageCircle, Star } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const WebHeadhuntersView: React.FC = () => {
  const { agencies, jobs, openOrCreateChat, setSelectedJobId, setWebTab, t } = usePlatform();

  const headhunterJobs = jobs.filter((j) => j.employmentType === 'headhunter' || j.isSponsored);

  const handleChatRole = (jobId: string) => {
    openOrCreateChat(jobId);
    setWebTab('messages');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 p-6 text-white shadow-soft sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-accent-500/25 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/20 px-3 py-1 text-xs font-bold text-accent-300">
              <Award className="h-3.5 w-3.5" />
              {t('香港認證獵頭合作網絡', 'Verified Hong Kong Headhunter Network')}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              {t('星級獵頭顧問團隊 · 直擊年薪百萬隱藏職位', 'Executive Search Partners & Confidential Mandates')}
            </h1>
            <p className="mt-2 text-sm text-brand-100">
              {t(
                '好多高薪及保密管理層職位唔會公開登報。直接與專科獵頭合夥人傾，幫你爭取更高薪酬及內推面試！',
                'Many senior roles in Hong Kong are strictly confidential. Chat directly with specialist headhunters to unlock unadvertised packages.'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setWebTab('employer')}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-accent-600/30 transition hover:bg-accent-600"
          >
            <Megaphone className="h-4 w-4" />
            <span>{t('獵頭公司上架招聘廣告', 'Partner & Post Ad')}</span>
          </button>
        </div>
      </div>

      {/* Verified Agencies Grid */}
      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-slate-900">
          {t('認證獵頭行及金牌顧問', 'Featured Headhunting Agencies')}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {agencies.map((ag) => {
            const matchingJob = headhunterJobs.find(
              (j) => j.agencyNameEn === ag.nameEn || j.recruiterName === ag.consultantName
            );
            return (
              <div
                key={ag.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-brand-300 hover:shadow-soft"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${ag.avatarGradient} text-lg font-extrabold text-white shadow-sm`}
                      >
                        {ag.consultantName.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {t(ag.nameZh, ag.nameEn)}
                          </h3>
                          {ag.verified && (
                            <CheckCircle2 className="h-4 w-4 text-brand-600" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-brand-600">
                          {ag.consultantName} · {t(ag.consultantTitleZh, ag.consultantTitleEn)}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700">
                      <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                      {ag.rating}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    {t('專攻領域：', 'Specialty: ')}
                    <span className="text-slate-800">{t(ag.specialtyZh, ag.specialtyEn)}</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(ag.bioZh, ag.bioEn)}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">{t('成功入職', 'Placed')}</span>
                      <p className="font-extrabold text-slate-900">{ag.placementsCount}+</p>
                    </div>
                    <div>
                      <span className="text-slate-400">{t('平均月薪', 'Avg Salary')}</span>
                      <p className="font-extrabold text-brand-600">{ag.avgSalaryLabel}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">{t('在招急聘', 'Live Roles')}</span>
                      <p className="font-extrabold text-slate-900">{ag.activeRolesCount}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (matchingJob) {
                        handleChatRole(matchingJob.id);
                      } else {
                        setWebTab('jobs');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{t('聯絡獵頭傾機會', 'Chat With Consultant')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Headhunter Mandates List */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-accent-500" />
          <h2 className="text-lg font-extrabold text-slate-900">
            {t(`獵頭獨家高薪職位 (${headhunterJobs.length})`, `Exclusive Headhunter Mandates (${headhunterJobs.length})`)}
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {headhunterJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-[11px] font-bold text-accent-700">
                    {job.adTier === 'diamond' ? t('鑽石獨家 AD', 'Diamond Ad') : t('黃金獵頭 AD', 'Gold Ad')}
                  </span>
                  <span className="text-xs font-bold text-brand-600">
                    {job.matchScore}% {t('匹配', 'Match')}
                  </span>
                </div>

                <h3 className="mt-2.5 text-base font-bold text-slate-900">{t(job.titleZh, job.titleEn)}</h3>
                <p className="mt-1 text-base font-extrabold text-accent-600">
                  {t(job.salaryLabelZh, job.salaryLabelEn)}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Building2 className="h-3.5 w-3.5 text-brand-500" />
                  {t(job.agencyNameZh || job.companyZh, job.agencyNameEn || job.companyEn)} · {t(job.districtZh, job.districtEn)}
                </p>
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {t(job.descriptionZh, job.descriptionEn)}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setWebTab('jobs');
                  }}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {t('睇詳情', 'Details')}
                </button>
                <button
                  type="button"
                  onClick={() => handleChatRole(job.id)}
                  className="flex-1 rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white hover:bg-brand-700"
                >
                  {t('立即對話', 'Chat Now')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
