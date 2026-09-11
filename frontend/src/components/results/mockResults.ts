import type { MockResultScenario } from "./types";

/** Sample scenarios for UI review — not live model output. */
export const MOCK_RESULT_SCENARIOS: MockResultScenario[] = [
  {
    id: "high",
    label: "High confidence (sample)",
    payload: {
      kind: "diagnosis",
      finding: "Leaf spot pattern consistent with early blight (sample)",
      cropLabel: "Tomato leaf",
      confidence: "high",
      whatWeSee: [
        "Dark brown spots with light centers on older leaves",
        "Spots are separate, not a solid patch",
        "Edges of some spots look slightly yellow",
      ],
      why: "These visible patterns match common early blight symptoms in reference material used for this prototype display.",
      whatToDoNow: [
        "Remove the most affected leaves and bag them away from the field.",
        "Improve airflow between plants if rows are crowded.",
        "Monitor neighboring plants daily for new spots.",
      ],
      whatToWatch: [
        "Spots spreading to new leaves within a few days",
        "Stem lesions near the soil line",
      ],
      nextStep: "If spots keep spreading, share photos with a local agronomist — this app does not replace field inspection.",
    },
  },
  {
    id: "moderate",
    label: "Moderate confidence (sample)",
    payload: {
      kind: "diagnosis",
      finding: "Possible nutrient stress or mild leaf damage (sample)",
      cropLabel: "Leaf photo",
      confidence: "moderate",
      whatWeSee: [
        "Uneven yellowing between leaf veins",
        "No sharp spot borders",
        "Some blur at the leaf edge in your photo",
      ],
      why: "Symptoms could fit several causes. The photo is usable but not ideal, so treat this as a working hypothesis only.",
      whatToDoNow: [
        "Retake one photo in even daylight, closer to the affected area.",
        "Note whether yellowing is on old leaves, new leaves, or the whole plant.",
        "Avoid heavy feeding until the cause is clearer.",
      ],
      whatToWatch: ["Yellowing climbing to new growth", "Wilting despite moist soil"],
      nextStep: "Retry with a sharper photo, or ask an expert if the pattern spreads.",
    },
  },
  {
    id: "low",
    label: "Low confidence (sample)",
    payload: {
      kind: "diagnosis",
      finding: "Uncertain — symptoms are not clear enough (sample)",
      cropLabel: "Leaf photo",
      confidence: "low",
      whatWeSee: ["General discoloration", "Problem area partly out of frame"],
      why: "The visible detail is limited. A confident label would be misleading.",
      whatToDoNow: [
        "Photograph one leaf filling the frame, focused on the worst spot.",
        "Use soft daylight and hold the phone steady.",
      ],
      whatToWatch: ["Any rapid spread or sudden wilting"],
      nextStep: "Do not act on a single low-confidence label — retake or consult an expert.",
    },
  },
  {
    id: "healthy",
    label: "Healthy appearance (sample)",
    payload: {
      kind: "healthy",
      finding: "No obvious disease pattern in this photo (sample)",
      confidence: "moderate",
      whatWeSee: ["Even green color across the photographed area", "No distinct lesions in frame"],
      why: "Nothing in this sample view strongly suggests active disease. Stress or issues outside the frame are still possible.",
      whatToDoNow: [
        "Keep your usual scouting routine for the rest of the field.",
        "If the plant still looks unwell overall, photograph another leaf or a different symptom.",
      ],
      whatToWatch: ["New spots, wilting, or pests elsewhere on the plant"],
      nextStep: "Continue monitoring — one clear leaf photo cannot rule out all problems.",
    },
  },
  {
    id: "edge-poor-image",
    label: "Edge: poor image (sample)",
    payload: {
      kind: "edge",
      edge: "poor-image",
      title: "This photo is hard to read",
      message: "In a connected build, analysis would pause here and ask for a clearer photo. This is a UI sample only.",
      whatToDoNow: [
        "Move closer so one leaf fills most of the frame.",
        "Wipe the lens and hold steady before capturing.",
      ],
      nextStep: "Retake the photo from the capture screen.",
    },
  },
  {
    id: "edge-model-unavailable",
    label: "Edge: model unavailable (sample)",
    payload: {
      kind: "edge",
      edge: "model-unavailable",
      title: "Diagnosis service is not connected",
      message: "The analysis model is not wired to this prototype yet. You are viewing layout and copy samples.",
      whatToDoNow: ["Use photo capture to validate the field workflow.", "Treat all labels on this page as demo content."],
      nextStep: "Return to capture when the backend is integrated.",
    },
  },
  {
    id: "edge-failed",
    label: "Edge: failed (sample)",
    payload: {
      kind: "edge",
      edge: "failed",
      title: "Analysis did not finish",
      message: "Sample state for a failed run — no result was produced.",
      whatToDoNow: ["Wait a moment and try again.", "If it keeps failing, retake the photo or try later on better signal."],
      nextStep: "Retry analysis or return to capture.",
    },
  },
  {
    id: "edge-unknown",
    label: "Edge: unknown (sample)",
    payload: {
      kind: "edge",
      edge: "unknown",
      title: "We could not show a result",
      message: "Sample empty outcome — the app would explain what happened in plain language.",
      whatToDoNow: ["Retake the photo with one leaf centered.", "Contact support if this keeps happening after integration."],
      nextStep: "Return to capture and try again.",
    },
  },
  {
    id: "edge-unsupported",
    label: "Edge: unsupported crop (sample)",
    payload: {
      kind: "edge",
      edge: "unsupported-crop",
      title: "This crop is not in the sample set",
      message: "When connected, the model will only label crops it was trained to recognize.",
      whatToDoNow: ["Photograph a supported crop for this demo.", "Ask a local expert for crops outside the model scope."],
      nextStep: "Try another crop or consult an agronomist.",
    },
  },
  {
    id: "edge-unassessable",
    label: "Edge: unassessable (sample)",
    payload: {
      kind: "edge",
      edge: "unassessable",
      title: "Symptoms are not clear enough to assess",
      message: "Sample state when visible detail is too limited for any label.",
      whatToDoNow: ["Move closer to the affected area.", "Include both healthy and affected tissue in frame if possible."],
      nextStep: "Retake the photo before acting.",
    },
  },
];

export function getMockScenario(id: string | null | undefined): MockResultScenario {
  const found = MOCK_RESULT_SCENARIOS.find((s) => s.id === id);
  return found ?? MOCK_RESULT_SCENARIOS[1];
}
