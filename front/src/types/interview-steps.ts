export type InterviewStep =
  | "TRIGGER"
  | "CRISIS"
  | "TURNING_POINT"
  | "ACHIEVEMENT";

export const interviewNarration: Record<
  InterviewStep,
  { section: string; url: string }
> = {
  TRIGGER: {
    section: "きっかけ",
    url: process.env.NEXT_PUBLIC_TRRIGER_NARRATION_URL as string,
  },
  CRISIS: {
    section: "危機",
    url: process.env.NEXT_PUBLIC_CRISIS_NARRATION_URL as string,
  },
  TURNING_POINT: {
    section: "転機",
    url: process.env.NEXT_PUBLIC_TURNING_POINT_NARRATION_URL as string,
  },
  ACHIEVEMENT: {
    section: "実績",
    url: process.env.NEXT_PUBLIC_ACHIEVEMENT_NARRATION_URL as string,
  },
};
