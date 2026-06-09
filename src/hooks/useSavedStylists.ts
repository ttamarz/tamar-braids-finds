import { useCallback, useEffect, useSyncExternalStore } from "react";

const KEY = "tf:saved";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function write(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  emit();
}

export function useSavedStylists() {
  const saved = useSyncExternalStore(
    subscribe,
    () => {
      // Return a stable string key to avoid infinite re-renders
      return JSON.stringify(read());
    },
    () => "[]"
  );

  const ids = (() => {
    try {
      return JSON.parse(saved) as string[];
    } catch {
      return [];
    }
  })();

  const isSaved = useCallback((id: string) => ids.includes(id), [saved]);

  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(next);
  }, []);

  // No-op effect to keep hook stable
  useEffect(() => {}, []);

  return { saved: ids, isSaved, toggle };
}
