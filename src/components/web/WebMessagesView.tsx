import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  FileText,
  Send,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import type { ApplicationStage } from '../../types/platform';

const STAGES: { key: 'all' | ApplicationStage; zh: string; en: string }[] = [
  { key: 'all', zh: '全部對話', en: 'All' },
  { key: 'new', zh: '新招呼', en: 'New' },
  { key: 'chatting', zh: '溝通中', en: 'Chatting' },
  { key: 'cv_sent', zh: '已發送履歷', en: 'CV Sent' },
  { key: 'interview', zh: '面試邀約', en: 'Interview' },
];

export const WebMessagesView: React.FC = () => {
  const {
    threads,
    jobs,
    activeThreadId,
    setActiveThreadId,
    markThreadRead,
    sendCandidateMessage,
    sendEmployerReply,
    sendResumeToChat,
    bookInterviewInChat,
    setWebTab,
    setSelectedJobId,
    t,
  } = usePlatform();

  const [stageFilter, setStageFilter] = useState<'all' | ApplicationStage>('all');
  const [draft, setDraft] = useState('');
  const [senderIdentity, setSenderIdentity] = useState<'candidate' | 'employer'>('candidate');
  const feedRef = useRef<HTMLDivElement | null>(null);

  const filteredThreads = useMemo(() => {
    if (stageFilter === 'all') return threads;
    return threads.filter((th) => th.stage === stageFilter);
  }, [threads, stageFilter]);

  const activeThread = useMemo(
    () => threads.find((th) => th.id === activeThreadId) ?? filteredThreads[0] ?? threads[0],
    [threads, filteredThreads, activeThreadId]
  );

  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeThread?.jobId) ?? jobs[0],
    [jobs, activeThread]
  );

  useEffect(() => {
    if (activeThread && activeThread.unreadCandidate > 0) {
      markThreadRead(activeThread.id);
    }
  }, [activeThread, markThreadRead]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activeThread?.id, activeThread?.messages.length, activeThread?.isTyping]);

  const stageLabel = (stage: ApplicationStage) => {
    switch (stage) {
      case 'new':
        return t('新招呼', 'New');
      case 'chatting':
        return t('溝通中', 'Chatting');
      case 'cv_sent':
        return t('已發送履歷', 'CV Sent');
      case 'interview':
        return t('已約面試', 'Interview');
      default:
        return t('已取錄', 'Offer');
    }
  };

  const stageStepIndex = (stage: ApplicationStage) => {
    switch (stage) {
      case 'new':
        return 0;
      case 'chatting':
        return 1;
      case 'cv_sent':
        return 2;
      case 'interview':
      case 'offer':
        return 3;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !draft.trim()) return;
    if (senderIdentity === 'candidate') {
      sendCandidateMessage(activeThread.id, draft);
    } else {
      sendEmployerReply(activeThread.id, draft);
    }
    setDraft('');
  };

  const quickChips =
    senderIdentity === 'candidate'
      ? [
          t('請問呢個職位下星期方便約個面試嗎？', 'Are you available next week for an interview?'),
          t('想了解下人工 package 同雙糧花紅安排', 'Could you share more about the salary & bonus package?'),
          t('我好快可以返工，隨時可以交流！', 'Available soon and happy to hop on a quick call!'),
        ]
      : [
          t('你好！我哋老闆睇過你資料好有興趣，方便約星期四下晝 Zoom 嗎？', 'Hi! The hiring lead liked your profile—free Thursday afternoon for Zoom?'),
          t('請問你期望月薪大概係幾多？', 'May I check your expected monthly compensation?'),
        ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Stage Filter Strip */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {STAGES.map((st) => {
            const count =
              st.key === 'all' ? threads.length : threads.filter((x) => x.stage === st.key).length;
            const active = stageFilter === st.key;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => setStageFilter(st.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t(st.zh, st.en)} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs font-medium text-slate-500">
          {t('申請進度即時掌握 · 雙端同步對話記錄', 'Live Application Progress · Synced with Mobile App')}
        </span>
      </div>

      {/* Chat Layout */}
      <div className="grid min-h-[620px] grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft lg:grid-cols-12">
        {/* Left Thread List */}
        <aside className="border-b border-slate-200 bg-slate-50/70 lg:col-span-4 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 px-4 py-3.5">
            <h2 className="text-sm font-extrabold text-slate-900">
              {t('對話聯絡人', 'Active Conversations')}
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredThreads.map((th) => {
              const job = jobs.find((j) => j.id === th.jobId);
              if (!job) return null;
              const lastMsg = th.messages[th.messages.length - 1];
              const isActive = activeThread?.id === th.id;

              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    setActiveThreadId(th.id);
                    markThreadRead(th.id);
                  }}
                  className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${
                    isActive ? 'bg-brand-50/90' : 'hover:bg-white'
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${job.avatarGradient} text-sm font-bold text-white`}
                  >
                    {job.recruiterName.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-slate-900">{job.recruiterName}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{th.updatedAt}</span>
                    </div>
                    <p className="truncate text-xs font-semibold text-brand-700">
                      {t(job.titleZh, job.titleEn)}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {lastMsg ? t(lastMsg.textZh, lastMsg.textEn) : ''}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                        {stageLabel(th.stage)}
                      </span>
                      {th.unreadCandidate > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-white">
                          {th.unreadCandidate}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Active Chat Area */}
        {activeThread && activeJob ? (
          <section className="flex flex-col lg:col-span-8">
            {/* Chat Header & Pinned Job Bar */}
            <div className="border-b border-slate-200 bg-white px-5 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${activeJob.avatarGradient} text-sm font-bold text-white`}
                  >
                    {activeJob.recruiterName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">{activeJob.recruiterName}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                        {t(activeJob.recruiterOnlineTextZh, activeJob.recruiterOnlineTextEn)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {t(activeJob.recruiterRoleZh, activeJob.recruiterRoleEn)}
                    </p>
                  </div>
                </div>

                {/* Demo Role Toggle */}
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setSenderIdentity('candidate')}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      senderIdentity === 'candidate'
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('以求職者發訊', 'Send as Candidate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSenderIdentity('employer')}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      senderIdentity === 'employer'
                        ? 'bg-accent-500 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('以獵頭/老闆回覆', 'Reply as Recruiter')}
                  </button>
                </div>
              </div>

              {/* Pinned Job Summary + Progress Stepper */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJobId(activeJob.id);
                    setWebTab('jobs');
                  }}
                  className="text-left hover:underline"
                >
                  <p className="text-xs font-extrabold text-slate-900">
                    {t(activeJob.titleZh, activeJob.titleEn)}
                  </p>
                  <p className="text-xs font-bold text-brand-600">
                    {t(activeJob.salaryLabelZh, activeJob.salaryLabelEn)} · {t(activeJob.districtZh, activeJob.districtEn)}
                  </p>
                </button>

                {/* 4-step Progress */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  {[
                    t('打招呼', 'Intro'),
                    t('溝通中', 'Chat'),
                    t('已傳履歷', 'CV Sent'),
                    t('面試安排', 'Interview'),
                  ].map((label, idx) => {
                    const done = stageStepIndex(activeThread.stage) >= idx;
                    return (
                      <div key={label} className="flex items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
                            done ? 'bg-brand-600 text-white' : 'bg-white text-slate-400 ring-1 ring-slate-200'
                          }`}
                        >
                          {done && <CheckCircle2 className="h-3 w-3" />}
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div ref={feedRef} className="flex-1 space-y-3.5 overflow-y-auto bg-slate-50/60 p-5 thin-scrollbar" style={{ maxHeight: '390px' }}>
              {activeThread.messages.map((msg) => {
                const isCandidate = msg.sender === 'candidate';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isCandidate
                          ? 'rounded-br-sm bg-brand-600 text-white'
                          : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      <p>{t(msg.textZh, msg.textEn)}</p>

                      {msg.attachmentType === 'cv_pdf' && (
                        <div
                          className={`mt-2 flex items-center gap-2.5 rounded-xl p-2.5 ${
                            isCandidate ? 'bg-white/15 text-white' : 'bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold">{msg.attachmentMeta?.fileName}</p>
                            <p className="text-[10px] opacity-80">PDF · 248 KB</p>
                          </div>
                        </div>
                      )}

                      {msg.attachmentType === 'interview_card' && (
                        <div className="mt-2.5 rounded-xl border border-brand-200 bg-brand-50 p-3 text-slate-900">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-brand-700">
                            <CalendarCheck className="h-4 w-4" />
                            <span>{t('面試預約確認卡', 'Interview Confirmation')}</span>
                          </div>
                          <p className="mt-1 text-xs font-bold text-slate-900">
                            {msg.attachmentMeta?.interviewTime}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-600">
                            {t(
                              msg.attachmentMeta?.locationZh || 'Zoom 視像面試',
                              msg.attachmentMeta?.locationEn || 'Zoom Video Call'
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="mt-1 px-1 text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                );
              })}

              {activeThread.isTyping && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                    <span className="typing-dot h-2 w-2 rounded-full bg-brand-500" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-brand-500" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-brand-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {t(`${activeJob.recruiterName} 正在回覆...`, `${activeJob.recruiterName} is typing...`)}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Toolbar + Input */}
            <div className="border-t border-slate-200 bg-white p-4">
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => sendResumeToChat(activeThread.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>{t('一鍵傳送履歷 PDF', '1-Click Send CV')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => bookInterviewInChat(activeThread.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700 transition hover:bg-accent-100"
                >
                  <CalendarCheck className="h-3.5 w-3.5" />
                  <span>{t('預約面試時間', 'Book Interview')}</span>
                </button>

                {quickChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      senderIdentity === 'candidate'
                        ? sendCandidateMessage(activeThread.id, chip)
                        : sendEmployerReply(activeThread.id, chip)
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    <Sparkles className="h-3 w-3 text-brand-500" />
                    <span className="max-w-[200px] truncate">{chip}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={
                      senderIdentity === 'candidate'
                        ? t(`直接同 ${activeJob.recruiterName} 傾...`, `Message ${activeJob.recruiterName}...`)
                        : t('以獵頭 / 老闆身份回覆候選人...', 'Reply as Headhunter / Boss...')
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15"
                  />
                </div>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition ${
                    senderIdentity === 'candidate'
                      ? 'bg-brand-600 hover:bg-brand-700'
                      : 'bg-accent-500 hover:bg-accent-600'
                  }`}
                >
                  {senderIdentity === 'employer' && <UserCheck className="h-4 w-4" />}
                  <Send className="h-4 w-4" />
                  <span>{t('發送', 'Send')}</span>
                </button>
              </form>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};
