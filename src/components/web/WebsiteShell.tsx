import React, { useEffect } from 'react';
import {
  Briefcase,
  Building2,
  FileText,
  Megaphone,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import type { WebTab } from '../../types/platform';
import { WebEmployerView } from './WebEmployerView';
import { WebHeadhuntersView } from './WebHeadhuntersView';
import { WebJobsView } from './WebJobsView';
import { WebMessagesView } from './WebMessagesView';
import { WebResumeView } from './WebResumeView';

export const BrandLogo: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = usePlatform();
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm">
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M5 17h5l3.2-7.5 4.4 13L21 15h6"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent-500" />
      </div>
      {!compact && (
        <div className="whitespace-nowrap leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              HirePulse <span className="text-brand-600">HK</span>
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">
            {t('職脈直聘 · 搵工直接同老闆/獵頭傾', 'Direct Boss & Headhunter Hiring')}
          </p>
        </div>
      )}
    </div>
  );
};

export const WebsiteShell: React.FC<{ isSplitPane?: boolean }> = ({ isSplitPane = false }) => {
  const { webTab, setWebTab, totalUnreadCandidate, profile, setViewMode, t } = usePlatform();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [webTab]);

  const navItems: { id: WebTab; icon: React.ReactNode; zh: string; en: string; badge?: number; accent?: boolean }[] = [
    { id: 'jobs', icon: <Briefcase className="h-4 w-4 shrink-0" />, zh: '搵工首頁', en: 'Find Jobs' },
    { id: 'headhunters', icon: <Building2 className="h-4 w-4 shrink-0" />, zh: '獵頭專區', en: 'Headhunters' },
    {
      id: 'messages',
      icon: <MessageSquare className="h-4 w-4 shrink-0" />,
      zh: '即時對話',
      en: 'Messages',
      badge: totalUnreadCandidate,
    },
    { id: 'resume', icon: <FileText className="h-4 w-4 shrink-0" />, zh: '智能履歷', en: 'Smart CV' },
    {
      id: 'employer',
      icon: <Megaphone className="h-4 w-4 shrink-0" />,
      zh: '獵頭 / 企業落廣告',
      en: 'Post Ad',
      accent: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Main Website Header */}
      <header
        className={`sticky z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md ${
          isSplitPane ? 'top-0' : 'top-[49px]'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setWebTab('jobs')}
            className="shrink-0 text-left focus:outline-none"
          >
            <BrandLogo compact={isSplitPane} />
          </button>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = webTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setWebTab(item.id)}
                  className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition-all ${
                    isSplitPane ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
                  } ${
                    active
                      ? item.accent
                        ? 'bg-accent-500 text-white shadow-sm'
                        : 'bg-brand-50 text-brand-700'
                      : item.accent
                        ? 'border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{t(item.zh, item.en)}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1.5 text-[11px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right User + App Shortcut */}
          <div className="flex shrink-0 items-center gap-2.5">
            {!isSplitPane && (
              <button
                type="button"
                onClick={() => setViewMode('app')}
                className="hidden items-center gap-1.5 whitespace-nowrap rounded-xl border border-brand-200 bg-brand-50/80 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 sm:flex"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>{t('切換手機 App 版', 'Open Mobile App')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setWebTab('resume')}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm transition hover:border-brand-300"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 text-xs font-bold text-white">
                {profile.nameZh.slice(0, 1)}
              </div>
              {!isSplitPane && (
                <div className="hidden whitespace-nowrap text-left sm:block">
                  <div className="text-xs font-bold text-slate-900">{t(profile.nameZh, profile.nameEn)}</div>
                  <div className="text-[10px] font-medium text-brand-600">{t('求職檔案 · 96% 完整', 'Profile · 96% Ready')}</div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Tablet/Mobile Web Sub-Nav */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-slate-100 px-4 py-2 no-scrollbar lg:hidden">
          {navItems.map((item) => {
            const active = webTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setWebTab(item.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.icon}
                <span>{t(item.zh, item.en)}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {webTab === 'jobs' && <WebJobsView isSplitPane={isSplitPane} />}
        {webTab === 'headhunters' && <WebHeadhuntersView />}
        {webTab === 'messages' && <WebMessagesView />}
        {webTab === 'resume' && <WebResumeView />}
        {webTab === 'employer' && <WebEmployerView />}
      </main>

      {/* Website Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">HirePulse HK 職脈直聘</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('香港認證獵頭及企業直聘平台', 'Verified HK Headhunters & Direct Employers')}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-accent-500" />
              {t('支援網頁版 + iOS / Android 手機 App 雙端實時同步', 'Synced across Desktop Web & Mobile App')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
