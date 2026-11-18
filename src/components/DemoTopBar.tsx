import React from 'react';
import { Globe, Layers, Palette, RotateCcw, Smartphone, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import type { DemoViewMode, ThemePalette } from '../types/platform';

const THEMES: { id: ThemePalette; labelZh: string; labelEn: string; swatch: string; ring: string }[] = [
  {
    id: 'indigo',
    labelZh: '皇家靛紫',
    labelEn: 'Indigo',
    swatch: 'bg-[#4F46E5]',
    ring: 'ring-indigo-400',
  },
  {
    id: 'sapphire',
    labelZh: '海灣寶藍',
    labelEn: 'Sapphire',
    swatch: 'bg-[#0284C7]',
    ring: 'ring-sky-400',
  },
  {
    id: 'rose',
    labelZh: '緋紅尊榮',
    labelEn: 'Crimson',
    swatch: 'bg-[#E11D48]',
    ring: 'ring-rose-400',
  },
];

export const DemoTopBar: React.FC = () => {
  const { viewMode, setViewMode, theme, setTheme, language, setLanguage, resetDemo, t } = usePlatform();

  const viewOptions: { id: DemoViewMode; icon: React.ReactNode; zh: string; en: string }[] = [
    { id: 'website', icon: <Globe className="h-3.5 w-3.5" />, zh: '網站版 Website', en: 'Website' },
    { id: 'app', icon: <Smartphone className="h-3.5 w-3.5" />, zh: '手機 App 版', en: 'Mobile App' },
    { id: 'split', icon: <Layers className="h-3.5 w-3.5" />, zh: '雙屏同步演示', en: 'Web + App Sync' },
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 px-3 py-2 text-slate-100 backdrop-blur-md sm:px-5">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 lg:flex-nowrap">
        {/* Left badge */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-white">
              <span>HirePulse HK</span>
              <span className="rounded bg-accent-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent-300">
                DEMO
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 xl:block">
              {t('求職 × 獵頭廣告平台（網頁版 & App 實時同步）', 'HK Job & Headhunter Platform (Live Web + App Sync)')}
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex shrink-0 items-center rounded-xl border border-slate-800 bg-slate-900 p-1">
          {viewOptions.map((opt) => {
            const active = viewMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setViewMode(opt.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${opt.id === 'split' ? 'hidden lg:flex' : 'flex'}`}
              >
                {opt.icon}
                <span>{t(opt.zh, opt.en)}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Theme + Lang + Reset */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Theme Picker */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2 py-1">
            <Palette className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            <span className="hidden text-[11px] text-slate-400 2xl:inline">{t('主題色', 'Theme')}:</span>
            {THEMES.map((item) => {
              const active = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={t(item.labelZh, item.labelEn)}
                  onClick={() => setTheme(item.id)}
                  className={`flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[11px] font-medium transition-all ${
                    active ? 'bg-slate-800 text-white ring-1 ' + item.ring : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full ${item.swatch} border border-white/30`} />
                  <span className="hidden md:inline">{t(item.labelZh, item.labelEn)}</span>
                </button>
              );
            })}
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            {language === 'zh' ? '繁中 / EN' : 'EN / 繁中'}
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={resetDemo}
            title={t('重置演示資料', 'Reset Demo')}
            className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('重置', 'Reset')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
