import React, { useState } from 'react';
import {
  CheckCircle2,
  Globe,
  Maximize2,
  Minimize2,
  Palette,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { MobileAppShell } from './MobileAppShell';

export const PhoneFrameWrapper: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { setMobileTab, setViewMode, setWebTab, theme, setTheme, simulateCvUpload, t } = usePlatform();
  const [deviceStyle, setDeviceStyle] = useState<'iphone' | 'android' | 'fullscreen'>('iphone');

  if (deviceStyle === 'fullscreen') {
    return (
      <div className="relative mx-auto h-[calc(100vh-52px)] w-full max-w-md border-x border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setDeviceStyle('iphone')}
          className="fixed bottom-20 right-4 z-50 flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          <span>{t('退出全屏', 'Exit Fullscreen')}</span>
        </button>
        <MobileAppShell showStatusBar={false} />
      </div>
    );
  }

  const phoneElement = (
    <div
      className={`relative mx-auto flex flex-col bg-slate-950 p-[11px] shadow-phone ring-1 ring-white/15 ${
        deviceStyle === 'iphone' ? 'rounded-[50px]' : 'rounded-[34px]'
      } ${compact ? 'h-[700px] w-[340px]' : 'h-[780px] w-[375px]'}`}
    >
      {/* Hardware Side Buttons */}
      <div className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-slate-700" />
      <div className="absolute -left-[3px] top-40 h-12 w-[3px] rounded-l bg-slate-700" />
      <div className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-slate-700" />

      {/* Dynamic Island / Punch Hole */}
      {deviceStyle === 'iphone' ? (
        <div className="pointer-events-none absolute left-1/2 top-[19px] z-50 flex h-[22px] w-[96px] -translate-x-1/2 items-center justify-end rounded-full bg-slate-950 px-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700" />
        </div>
      ) : (
        <div className="pointer-events-none absolute left-1/2 top-[19px] z-50 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-950 ring-1 ring-slate-700" />
      )}

      {/* Inner Screen */}
      <div
        className={`relative flex-1 overflow-hidden bg-white ${
          deviceStyle === 'iphone' ? 'rounded-[40px]' : 'rounded-[24px]'
        }`}
      >
        <MobileAppShell showStatusBar />
      </div>

      {/* Bottom Home Indicator */}
      <div className="pointer-events-none absolute bottom-[17px] left-1/2 z-50 h-1 w-28 -translate-x-1/2 rounded-full bg-slate-900/30" />
    </div>
  );

  if (compact) {
    return phoneElement;
  }

  return (
    <div className="min-h-[calc(100vh-52px)] bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 px-4 py-8 text-white sm:px-6">
      {/* Actual mobile screens render edge-to-edge */}
      <div className="mx-auto max-w-6xl">
        <div className="md:hidden h-[calc(100vh-90px)] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <MobileAppShell showStatusBar={false} />
        </div>

        {/* Desktop App Studio Presentation */}
        <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-10">
          {/* Left Pitch & Controls */}
          <div className="space-y-6 md:col-span-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-accent-300">
              <Smartphone className="h-3.5 w-3.5" />
              <span>{t('iOS / Android 手機 App 實機互動版', 'Interactive iOS / Android Mobile App')}</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
              {t('HirePulse HK 手機 App 版：隨時隨地直接同老闆及獵頭傾', 'HirePulse HK App: Direct Chat & Headhunter Hiring in Your Pocket')}
            </h1>

            <p className="text-sm leading-relaxed text-slate-300">
              {t(
                '右側為可完全點擊操作嘅手機 App 介面，所有職位發佈、即時對話、履歷上載解析及主題顏色均與網頁版 100% 實時同步。',
                'Interact directly with the live mobile app simulator on the right. Every job ad, chat reply, CV parse, and theme palette syncs live with the Website.'
              )}
            </p>

            {/* Key App Highlights */}
            <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
              {[
                t('全職 / 兼職 / 獵頭高薪職位一網打盡', 'Full-time, part-time & headhunter executive roles'),
                t('OfferToday 式即時對話 + 一鍵發送 PDF 履歷', 'Instant Boss/Headhunter chat + 1-tap PDF CV send'),
                t('AI 輕鬆上傳履歷，自動識別新經歷並推薦好工', 'Smart CV parsing & auto-matched high-pay roles'),
                t('全新皇家靛紫 / 寶藍 / 緋紅主題配色（非綠色）', 'Fresh Royal Indigo / Sapphire / Crimson palettes'),
              ].map((pt) => (
                <div key={pt} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-400" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Simulator Frame Controls */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('外框及快捷演示控制', 'Device Frame & Demo Shortcuts')}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDeviceStyle('iphone')}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    deviceStyle === 'iphone' ? 'bg-brand-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  iPhone 16 Pro
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceStyle('android')}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    deviceStyle === 'android' ? 'bg-brand-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  Android Flagship
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceStyle('fullscreen')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/20"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>{t('全屏手機預覽', 'Fullscreen App')}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileTab('resume');
                    simulateCvUpload('JasonLee_Executive_CV.pdf');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent-500 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-accent-600"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t('演示 App 上載履歷', 'Demo App CV Parse')}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTheme(theme === 'indigo' ? 'sapphire' : theme === 'sapphire' ? 'rose' : 'indigo')
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20"
                >
                  <Palette className="h-3.5 w-3.5 text-accent-300" />
                  <span>{t('一鍵換主題色', 'Cycle Theme Color')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWebTab('employer');
                    setViewMode('website');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20"
                >
                  <Globe className="h-3.5 w-3.5 text-brand-300" />
                  <span>{t('去網站版獵頭落廣告', 'Open Web Ad Console')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Phone Hardware Simulator */}
          <div className="flex justify-center md:col-span-7">{phoneElement}</div>
        </div>
      </div>
    </div>
  );
};
