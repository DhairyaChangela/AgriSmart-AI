export type AgriBotState =
  | "welcome"
  | "thinking"
  | "explaining"
  | "loading"
  | "success"
  | "warning"
  | "confused";

export interface AgriBotTopic {
  id: string;
  question: string;
  answer: string;
  note?: string;
}

export type AgriBotStatusTone = "default" | "primary" | "secondary" | "success" | "warning";

export interface AgriBotStatusConfig {
  label: string;
  tone: AgriBotStatusTone;
}

const toneClasses: Record<AgriBotStatusTone, string> = {
  default: "bg-neutral-100 text-neutral-600",
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success-50 text-success-700 border border-success-100",
  warning: "bg-warning-50 text-warning-700 border border-warning-100",
};

function status(status: AgriBotStatusConfig): AgriBotStatusConfig & { className: string } {
  return { ...status, className: toneClasses[status.tone] };
}

export const AGRIBOT_STATUS: Record<AgriBotState, AgriBotStatusConfig & { className: string }> = {
  welcome: status({ label: "Ready", tone: "default" }),
  thinking: status({ label: "Thinking", tone: "primary" }),
  explaining: status({ label: "Explaining", tone: "secondary" }),
  loading: status({ label: "Loading", tone: "primary" }),
  success: status({ label: "Done", tone: "success" }),
  warning: status({ label: "Heads-up", tone: "warning" }),
  confused: status({ label: "Not sure", tone: "default" }),
};

export const AGRIBOT_TOPICS: AgriBotTopic[] = [
  {
    id: "check-crop",
    question: "How do I check my crop?",
    answer:
      "Open Check Crop from the menu. Take or upload one leaf photo, review it on your phone, then continue to the analysis screen. In this prototype, analysis shows sample results until the live model is connected.",
  },
  {
    id: "good-photo",
    question: "How do I take a good photo?",
    answer:
      "Hold the phone steady about a hand width from the leaf. Use even, natural light and avoid harsh shadows. Keep the affected area centered and in focus so symptoms stay crisp.",
  },
  {
    id: "confidence",
    question: "What does confidence mean?",
    answer:
      "Every result carries a confidence score. High confidence means the AI is quite sure of what it sees. Low confidence means the symptoms were less clear, and the app will tell you when a second opinion is worth it.",
  },
  {
    id: "uncertain",
    question: "What if my result is uncertain?",
    answer:
      "Take another photo, closer and better lit, then retry. If the result is still uncertain it will say so clearly and point you to expert guidance instead of guessing.",
  },
  {
    id: "diagnosis-source",
    question: "Where does the diagnosis come from?",
    answer:
      "The diagnosis engine that reads real crop photos is a separate feature still in development. Right now AgriBot answers from built-in help content, so treat this as a tour rather than a live AI.",
    note: "This is sample guide content. The live crop analysis model is not connected yet.",
  },
];

export const AGRIBOT_WELCOME_TITLE = "Hi, I am AgriBot";
export const AGRIBOT_WELCOME_MESSAGE =
  "I am your guide for AgriSmart AI. I can walk you through checking a crop photo, understanding the result, and knowing what to do next.";

export const AGRIBOT_HELP_HEADING = "How can I help?";
export const AGRIBOT_HELP_MESSAGE =
  "Ask me about anything in the app: checking a crop, taking a good photo, or understanding a result.";