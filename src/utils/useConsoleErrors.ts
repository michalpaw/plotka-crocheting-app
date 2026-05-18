import { ref, readonly } from 'vue';

export interface ConsoleEntry {
  level: 'error' | 'warn' | 'unhandled';
  message: string;
  timestamp: string;
}

const entries = ref<ConsoleEntry[]>([]);
const isVisible = ref(false);
let patched = false;

function formatArgs(args: unknown[]): string {
  return args.map(a => {
    if (a instanceof Error) return `${a.message}${a.stack ? '\n' + a.stack : ''}`;
    if (typeof a === 'object' && a !== null) {
      try { return JSON.stringify(a, null, 2); } catch { return String(a); }
    }
    return String(a);
  }).join(' ');
}

function push(level: ConsoleEntry['level'], message: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('pl-PL', { hour12: false })
    + '.' + String(now.getMilliseconds()).padStart(3, '0');
  entries.value.push({ level, message, timestamp });
  isVisible.value = true;
}

export function installConsoleInterceptor() {
  if (patched) return;
  patched = true;

  const origError = console.error.bind(console);
  const origWarn = console.warn.bind(console);

  console.error = (...args: unknown[]) => {
    origError(...args);
    push('error', formatArgs(args));
  };

  console.warn = (...args: unknown[]) => {
    origWarn(...args);
    push('warn', formatArgs(args));
  };

  window.addEventListener('error', (e) => {
    const stack = e.error?.stack ?? '';
    push('unhandled', `${e.message}\n  at ${e.filename}:${e.lineno}:${e.colno}${stack ? '\n' + stack : ''}`);
  });

  window.addEventListener('unhandledrejection', (e) => {
    const msg = e.reason instanceof Error
      ? `${e.reason.message}\n${e.reason.stack ?? ''}`
      : String(e.reason);
    push('unhandled', `Unhandled Promise Rejection: ${msg}`);
  });

  // Forward errors from the Electron main process (terminal) via IPC bridge.
  const bridge = (window as unknown as { electronBridge?: { onMainError: (cb: (msg: string) => void) => void } }).electronBridge;
  if (bridge?.onMainError) {
    bridge.onMainError((message) => push('error', message));
  }
}

export function useConsoleErrors() {
  return {
    entries: readonly(entries),
    isVisible,
    clear: () => { entries.value = []; },
    show: () => { isVisible.value = true; },
    hide: () => { isVisible.value = false; },
  };
}
