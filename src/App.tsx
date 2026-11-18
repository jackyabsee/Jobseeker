import React from 'react';
import { CheckCircle2, Layers, Sparkles } from 'lucide-react';
import { DemoTopBar } from './components/DemoTopBar';
import { PhoneFrameWrapper } from './components/mobile/PhoneFrameWrapper';
import { WebsiteShell } from './components/web/WebsiteShell';
import { PlatformProvider, usePlatform } from './context/PlatformContext';

const SplitSyncWorkspace: React.FC = () => {
  const { t, setWebTab } = usePlatform();

  return (
    <div className="flex min-h-[calc(100vh-52px)] flex-col bg-slate-900 lg:flex-row">
      {/* Left: Website Portal */}
      <div className="flex-1 overflow-y-auto border-r border-slate-800 bg-slate-50 thin-scrollbar lg:h-[calc(100vh-52px)]">
        <div className="flex items-center justify-between border-b border-brand-200 bg-brand-50 px-4 py-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-extrabold text-brand-800">
            <Layers className="h-3.5 w-3.5 text-brand-600" />
            {t('左屏：網頁版（推薦打開「獵頭/企業落廣告」測試即時同步）', 'Left: Desktop Website (Try "Post Ad" to watch live sync!)')}
          </span>
          <button
            type="button"
            onClick={() => setWebTab('employer')}
            className="rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-brand-700"
          >
            {t('打開落廣告後台', 'Open Ad Console')}
          </button>
        </div>
        <WebsiteShell isSplitPane />
      </div>

      {/* Right: Mobile App Simulator */}
      <div className="flex shrink-0 flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-brand-950 to-slate-950 px-6 py-5 lg:h-[calc(100vh-52px)] lg:w-[410px]">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold text-accent-300">
          <Sparkles className="h-3 w-3" />
          <span>{t('右屏：手機 App 版 · 實時數據同步中', 'Right: Mobile App · Live Synced')}</span>
        </div>
        <PhoneFrameWrapper compact />
      </div>
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { viewMode, toastMessage } = usePlatform();

  return (
    <div className="min-h-screen bg-slate-50">
      <DemoTopBar />

      {viewMode === 'website' && <WebsiteShell />}
      {viewMode === 'app' && <PhoneFrameWrapper />}
      {viewMode === 'split' && <SplitSyncWorkspace />}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-brand-500/30 bg-slate-950/95 px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-accent-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlatformProvider>
      <MainRouter />
    </PlatformProvider>
  );
};

export default App;
