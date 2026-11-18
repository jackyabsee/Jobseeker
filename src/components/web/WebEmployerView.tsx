import React, { useState } from 'react';
import {
  CheckCircle2,
  Crown,
  Eye,
  FileText,
  Megaphone,
  MessageSquare,
  PlusCircle,
  Rocket,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { AD_PACKAGES, HK_DISTRICTS } from '../../data/seedData';
import type { AdTier, EmploymentType } from '../../types/platform';

export const WebEmployerView: React.FC = () => {
  const {
    jobs,
    threads,
    publishJobAd,
    upgradeJobAdTier,
    setSelectedJobId,
    setWebTab,
    setViewMode,
    setActiveThreadId,
    t,
  } = usePlatform();

  const [selectedTier, setSelectedTier] = useState<AdTier>('diamond');
  const [titleZh, setTitleZh] = useState('');
  const [companyZh, setCompanyZh] = useState('');
  const [agencyNameZh, setAgencyNameZh] = useState('');
  const [districtKey, setDistrictKey] = useState('central');
  const [salaryLabelZh, setSalaryLabelZh] = useState('HK$55K–78K/月');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('headhunter');
  const [recruiterName, setRecruiterName] = useState('Jessica Wong');
  const [descriptionZh, setDescriptionZh] = useState('');
  const [lastPublishedId, setLastPublishedId] = useState<string | null>(null);

  const totalViews = jobs.reduce((sum, j) => sum + j.viewsCount, 0);
  const totalChats = jobs.reduce((sum, j) => sum + j.chatsCount, 0);
  const cvSentCount = threads.filter((th) => th.stage === 'cv_sent' || th.stage === 'interview').length;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = titleZh.trim() || 'Senior Wealth & Corporate Sales Director 企業大客戶銷售總監';
    const cleanCompany = companyZh.trim() || '香港主板上市金融集團';
    const cleanAgency = agencyNameZh.trim() || (employmentType === 'headhunter' ? 'EliteHeadhunt HK 精英獵頭' : '');
    const cleanDesc =
      descriptionZh.trim() ||
      '專責拓展香港及大灣區企業客戶，管理銷售團隊並直接向管理層匯報，提供極具競爭力底薪加花紅機制。';

    const numMatch = salaryLabelZh.match(/\d+/);
    const salaryMinK = numMatch ? Number(numMatch[0]) : 50;

    const created = publishJobAd({
      titleZh: cleanTitle,
      titleEn: cleanTitle,
      companyZh: cleanCompany,
      companyEn: cleanCompany,
      agencyNameZh: cleanAgency || undefined,
      agencyNameEn: cleanAgency || undefined,
      districtKey,
      salaryLabelZh: salaryLabelZh.trim() || 'HK$50K–70K/月',
      salaryLabelEn: salaryLabelZh.trim() || 'HK$50K–70K/mo',
      salaryMinK,
      employmentType,
      adTier: selectedTier,
      tagsZh: selectedTier === 'diamond' ? ['鑽石置頂 AD', '獵頭急聘', '雙糧花紅'] : ['最新上架', '直對決策人'],
      tagsEn: selectedTier === 'diamond' ? ['Diamond AD', 'Urgent Mandate', 'Bonus'] : ['New Role', 'Direct Boss'],
      descriptionZh: cleanDesc,
      descriptionEn: cleanDesc,
      recruiterName: recruiterName.trim() || 'Jessica Wong',
    });

    setLastPublishedId(created.id);
    setTitleZh('');
    setDescriptionZh('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-brand-900 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/20 px-3 py-1 text-xs font-bold text-accent-300">
              <Megaphone className="h-3.5 w-3.5" />
              <span>{t('獵頭公司 & 企業廣告落盤後台', 'Headhunter & Employer Ad Console')}</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold sm:text-3xl">
              {t('刊登高曝光招聘廣告 · 網頁版 + 手機 App 同步上架', 'Publish High-ROI Job Ads Live to Web & Mobile App')}
            </h1>
            <p className="mt-1.5 text-sm text-brand-100">
              {t(
                '專為香港獵頭公司、Sales 團隊及直聘企業設計：支援置頂廣告套票、精準高薪人群觸達及即時雙向對話。',
                'Built for HK headhunting agencies and direct employers—launch sponsored ads, track ROI, and chat instantly with top talent.'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className="hidden shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20 lg:inline-flex"
          >
            <Smartphone className="h-4 w-4 text-accent-300" />
            <span>{t('開啟雙屏同步演示 (邊發邊睇App)', 'Open Web + App Split Demo')}</span>
          </button>
        </div>

        {/* 4 KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              icon: <Zap className="h-4 w-4 text-accent-400" />,
              label: t('在線職位廣告', 'Active Job Ads'),
              val: jobs.length,
            },
            {
              icon: <Eye className="h-4 w-4 text-brand-300" />,
              label: t('平台總曝光瀏覽', 'Total Impressions'),
              val: totalViews.toLocaleString(),
            },
            {
              icon: <MessageSquare className="h-4 w-4 text-sky-300" />,
              label: t('老闆/獵頭對話數', 'Direct Chats'),
              val: totalChats,
            },
            {
              icon: <FileText className="h-4 w-4 text-rose-300" />,
              label: t('已收履歷及面試', 'CVs & Interviews'),
              val: cvSentCount,
            },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-brand-100">
                {kpi.icon}
                <span>{kpi.label}</span>
              </div>
              <p className="mt-1.5 text-2xl font-extrabold text-white">{kpi.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tier Selection + Publish Form */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Ad Package Selector */}
        <div className="space-y-4 lg:col-span-5">
          <h2 className="text-base font-extrabold text-slate-900">
            {t('1. 選擇招聘廣告方案 (專為獵頭 / 企業設計)', '1. Choose Recruitment Ad Package')}
          </h2>

          <div className="space-y-3">
            {AD_PACKAGES.map((pkg) => {
              const selected = selectedTier === pkg.tier;
              return (
                <div
                  key={pkg.tier}
                  onClick={() => setSelectedTier(pkg.tier)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    selected
                      ? 'border-brand-600 bg-brand-50/60 shadow-soft ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          {t(pkg.nameZh, pkg.nameEn)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            pkg.tier === 'diamond'
                              ? 'bg-accent-500 text-white'
                              : pkg.tier === 'gold'
                                ? 'bg-accent-100 text-accent-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t(pkg.badgeZh, pkg.badgeEn)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{t(pkg.durationZh, pkg.durationEn)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-brand-700">{pkg.priceLabel}</span>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {(t('zh', 'en') === 'zh' ? pkg.featuresZh : pkg.featuresEn).map((feat) => (
                      <li key={feat} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Ad Creation Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                <PlusCircle className="h-5 w-5 text-brand-600" />
                <span>{t('2. 填寫職位及廣告內容（即時雙端發佈）', '2. Publish Job Ad (Instant Web & App Sync)')}</span>
              </h2>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
                {selectedTier === 'diamond'
                  ? t('已選：鑽石置頂', 'Tier: Diamond')
                  : selectedTier === 'gold'
                    ? t('已選：黃金推薦', 'Tier: Gold')
                    : t('已選：標準刊登', 'Tier: Standard')}
              </span>
            </div>

            {lastPublishedId && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-300 bg-brand-50 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-800">
                  <Sparkles className="h-4 w-4 text-accent-500" />
                  <span>{t('職位廣告已成功上架！網頁版與手機 App 已同步更新。', 'Job Ad Published! Live on both Website & Mobile App.')}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobId(lastPublishedId);
                      setWebTab('jobs');
                    }}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
                  >
                    {t('去網站首頁睇效果', 'View on Website')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('app')}
                    className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600"
                  >
                    {t('去手機 App 睇效果', 'View in Mobile App')}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handlePublish} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('職位名稱 (留空可用示範職位)', 'Job Title')}
                </label>
                <input
                  type="text"
                  value={titleZh}
                  onChange={(e) => setTitleZh(e.target.value)}
                  placeholder={t('例：Regional Business Development Director 區域業務總監', 'e.g. Regional Business Development Director')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('聘請企業 / 保密客戶', 'Hiring Company')}
                </label>
                <input
                  type="text"
                  value={companyZh}
                  onChange={(e) => setCompanyZh(e.target.value)}
                  placeholder={t('例：香港主板上市金融集團', 'e.g. HK Listed FinTech Group')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('獵頭公司名稱 (如適用)', 'Headhunting Agency (Optional)')}
                </label>
                <input
                  type="text"
                  value={agencyNameZh}
                  onChange={(e) => setAgencyNameZh(e.target.value)}
                  placeholder={t('例：EliteHeadhunt HK 精英獵頭', 'e.g. EliteHeadhunt HK')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('月薪 / 時薪待遇', 'Salary Range')}
                </label>
                <input
                  type="text"
                  value={salaryLabelZh}
                  onChange={(e) => setSalaryLabelZh(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('香港工作地區', 'District')}
                </label>
                <select
                  value={districtKey}
                  onChange={(e) => setDistrictKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  {HK_DISTRICTS.filter((d) => d.key !== 'all').map((d) => (
                    <option key={d.key} value={d.key}>
                      {t(d.zh, d.en)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('聘用類型', 'Job Type')}
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  <option value="headhunter">{t('獵頭委託高薪職位', 'Headhunter Mandate')}</option>
                  <option value="full-time">{t('企業全職直聘', 'Full-Time Direct')}</option>
                  <option value="part-time">{t('兼職 / 彈性', 'Part-Time / Flex')}</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('對話聯絡人（顧問/老闆姓名）', 'Contact Recruiter / Boss')}
                </label>
                <input
                  type="text"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t('職位亮點及要求', 'Role Highlights & Requirements')}
                </label>
                <textarea
                  rows={3}
                  value={descriptionZh}
                  onChange={(e) => setDescriptionZh(e.target.value)}
                  placeholder={t('輸入職位賣點，例如：直對老闆、極高佣金制度、彈性上班...', 'Describe role impact, bonus, and team...')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:opacity-95"
                >
                  <Rocket className="h-4 w-4" />
                  <span>{t('立即刊登並同步至手機 App & 網站', 'Publish Ad Now (Sync Web & App)')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Manage Active Ads + Quick Candidate Inbox */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-7">
          <h2 className="text-base font-extrabold text-slate-900">
            {t('管理現有職位廣告 (一鍵升級置頂)', 'Manage Active Ads (1-Click Boost)')}
          </h2>
          <div className="mt-4 divide-y divide-slate-100">
            {jobs.slice(0, 6).map((job) => (
              <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {job.isSponsored ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Crown className="h-2.5 w-2.5" />
                        {job.adTier === 'diamond' ? t('鑽石置頂', 'Diamond') : t('黃金推薦', 'Gold')}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {t('標準刊登', 'Standard')}
                      </span>
                    )}
                    <h3 className="truncate text-sm font-bold text-slate-900">{t(job.titleZh, job.titleEn)}</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t(job.salaryLabelZh, job.salaryLabelEn)} · {job.viewsCount} {t('瀏覽', 'views')} · {job.chatsCount}{' '}
                    {t('對話', 'chats')}
                  </p>
                </div>

                {job.adTier !== 'diamond' && (
                  <button
                    type="button"
                    onClick={() => upgradeJobAdTier(job.id, 'diamond')}
                    className="rounded-xl border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700 transition hover:bg-accent-500 hover:text-white"
                  >
                    {t('升級鑽石置頂', 'Boost to Diamond')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-5">
          <h2 className="text-base font-extrabold text-slate-900">
            {t('候選人對話收件箱', 'Candidate Inbox')}
          </h2>
          <div className="mt-4 space-y-3">
            {threads.slice(0, 4).map((th) => {
              const job = jobs.find((j) => j.id === th.jobId);
              const lastMsg = th.messages[th.messages.length - 1];
              return (
                <div
                  key={th.id}
                  onClick={() => {
                    setActiveThreadId(th.id);
                    setWebTab('messages');
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-brand-300 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      李嘉俊 Jason Lee → {job ? t(job.titleZh, job.titleEn) : ''}
                    </span>
                    <span className="text-[10px] text-slate-400">{th.updatedAt}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                    {lastMsg ? t(lastMsg.textZh, lastMsg.textEn) : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
