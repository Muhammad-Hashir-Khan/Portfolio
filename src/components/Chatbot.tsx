import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { LuRefreshCw, LuSend, LuTrash2, LuX } from 'react-icons/lu';
import { SiGooglegemini } from 'react-icons/si';
import { chatbot } from '../data/portfolio';
import { ChatError, sendChat, type ChatTurn } from '../lib/chat';

interface Msg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  error?: boolean;
}

let msgSeq = 1;
const nextId = () => msgSeq++;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState('');

  const failedRef = useRef<{ text: string; history: ChatTurn[] } | null>(null);
  const lastSentRef = useRef(0);
  const logRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  /* ── open / close lifecycle ─────────────────────────────────────────── */

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    if (msgs.length === 0) {
      setMsgs([{ id: nextId(), role: 'assistant', text: chatbot.welcome }]);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    const t = window.setTimeout(() => inputRef.current?.focus(), 90);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open, close]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, open, pending]);

  /* ── sending ────────────────────────────────────────────────────────── */

  const buildHistory = (source: Msg[]): ChatTurn[] =>
    source.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text }));

  const dispatch = useCallback(async (text: string, history: ChatTurn[]) => {
    // soft client-side pace limit — the server enforces the real one
    const now = Date.now();
    const wait = Math.max(0, 1200 - (now - lastSentRef.current));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastSentRef.current = Date.now();

    setPending(true);
    try {
      const reply = await sendChat(text, history);
      failedRef.current = null;
      setMsgs((prev) => [...prev, { id: nextId(), role: 'assistant', text: reply }]);
    } catch (err) {
      const message = err instanceof ChatError ? err.message : 'The assistant is temporarily unavailable.';
      failedRef.current = { text, history };
      setMsgs((prev) => [...prev, { id: nextId(), role: 'assistant', text: message, error: true }]);
    } finally {
      setPending(false);
    }
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, chatbot.maxChars);
      if (!text || pending) return;

      const history = buildHistory(msgs);
      setMsgs((prev) => [...prev, { id: nextId(), role: 'user', text }]);
      setDraft('');
      void dispatch(text, history);
    },
    [msgs, pending, dispatch],
  );

  const retry = useCallback(() => {
    const failed = failedRef.current;
    if (!failed || pending) return;
    setMsgs((prev) => prev.filter((m) => !m.error));
    void dispatch(failed.text, failed.history);
  }, [pending, dispatch]);

  const clearChat = useCallback(() => {
    if (pending) return;
    failedRef.current = null;
    setMsgs([{ id: nextId(), role: 'assistant', text: chatbot.welcome }]);
  }, [pending]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(draft);
  };

  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
  };

  /* ── render ─────────────────────────────────────────────────────────── */

  const showSuggestions = msgs.filter((m) => !m.error).length <= 1 && !pending;

  return (
    <>
      <button
        ref={launcherRef}
        className="chat-launcher"
        onClick={() => setOpen(true)}
        aria-label="Open the portfolio AI assistant"
        aria-expanded={open}
        aria-controls="chat-panel"
        style={open ? { display: 'none' } : undefined}
      >
        <SiGooglegemini aria-hidden="true" />
      </button>

      {open && (
        <div className="chat-panel" id="chat-panel" role="dialog" aria-label={chatbot.name}>
          <div className="chat-panel__head">
            <span className="chat-panel__head-icon" aria-hidden="true">
              <SiGooglegemini />
            </span>
            <div className="chat-panel__title">
              <b>{chatbot.name}</b>
              <span>
                <span className="pulse-dot" aria-hidden="true" />
                {chatbot.subtitle}
              </span>
            </div>
            <div className="chat-panel__head-actions">
              <button className="chat-icon-btn" onClick={clearChat} aria-label="Clear conversation" disabled={pending}>
                <LuTrash2 aria-hidden="true" />
              </button>
              <button className="chat-icon-btn" onClick={close} aria-label="Close assistant">
                <LuX aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="chat-panel__log" ref={logRef} role="log" aria-live="polite" aria-label="Conversation">
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={
                  'chat-msg ' +
                  (msg.role === 'user' ? 'chat-msg--user' : 'chat-msg--assistant') +
                  (msg.error ? ' chat-msg--error' : '')
                }
              >
                {msg.text}
                {msg.error && (
                  <button className="chat-msg__retry" onClick={retry} disabled={pending}>
                    <LuRefreshCw aria-hidden="true" />
                    Retry
                  </button>
                )}
              </div>
            ))}
            {pending && (
              <div className="chat-typing" aria-label="Assistant is typing">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>

          {showSuggestions && (
            <div className="chat-suggestions" aria-label="Suggested questions">
              {chatbot.suggestions.map((suggestion) => (
                <button key={suggestion} className="chat-suggestion" onClick={() => send(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form className="chat-panel__form" onSubmit={onSubmit}>
            <div className="chat-input-wrap">
              <textarea
                ref={inputRef}
                className="chat-input"
                rows={1}
                value={draft}
                maxLength={chatbot.maxChars}
                placeholder="Ask about services, prices, projects…"
                aria-label="Your question"
                onChange={(e) => {
                  setDraft(e.target.value);
                  autoResize();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(draft);
                  }
                }}
              />
              {draft.length > chatbot.maxChars - 260 && (
                <div className="chat-char-count">
                  {draft.length}/{chatbot.maxChars}
                </div>
              )}
            </div>
            <button type="submit" className="chat-send" disabled={pending || !draft.trim()} aria-label="Send message">
              <LuSend aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
