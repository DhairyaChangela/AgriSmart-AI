/**
 * Tiny external context bus so the journey can hand AgriBot a contextual
 * message without rebuilding AgriBot or prop-drilling through every page.
 *
 * AgriBot subscribes once (in AppShell). Pages like /check-crop push a
 * short, journey-aware tip and clear it on unmount. While a contextual
 * message is set, AgriBot shows it instead of its generic welcome bubble.
 */

export interface AgriBotContextMessage {
  /** Surfaces each contextual bubble (so re-pushing the same stage re-shows it). */
  id: string;
  title: string;
  message: string;
  /** Optional labelled action shown as the bubble's primary button (dismiss). */
  actionLabel?: string;
}

type Listener = (message: AgriBotContextMessage | null) => void;

let current: AgriBotContextMessage | null = null;
const listeners = new Set<Listener>();

export function setAgriBotContext(message: AgriBotContextMessage | null): void {
  current = message;
  listeners.forEach((listener) => listener(message));
}

export function getAgriBotContext(): AgriBotContextMessage | null {
  return current;
}

export function subscribeAgriBotContext(listener: Listener): () => void {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
}