export enum AppMode {
  MENU = 'MENU',
  LEARNING = 'LEARNING',
  EXAM = 'EXAM',
  RESULTS = 'RESULTS'
}

export enum Scenario {
  STADIUM = '体育馆',
  FOREST = '森林',
  OCEAN = '海洋',
  STREET = '街道',
  DESERT = '沙漠',
  INDOOR = '室内摄影棚'
}

export enum Step {
  SETUP_SUIT = 0,
  CALIBRATION_WAND = 1,
  CALIBRATION_GROUND = 2,
  SKELETON_CREATE = 3,
  DATA_RECORDING = 4,
  COMPLETE = 5
}

export interface SimulationState {
  mode: AppMode;
  currentStep: Step;
  scenario: Scenario;
  score: number;
  hintsUsed: number;
  mistakes: number;
  history: string[]; // Log of actions
  isRecording: boolean;
  hasRecorded: boolean; // Added to track recording completion
  isCalibrated: boolean;
  skeletonCreated: boolean;
  
  // Exam specific
  examAnswers: Record<number, number>; // Question ID -> Selected Option Index
  examTimeLeft: number; // Seconds
  examCurrentQuestion: number; // Current Question Index (0-9)
}

export interface MarkerPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  placed: boolean;
}

export const SCENARIO_BG: Record<Scenario, string> = {
  [Scenario.STADIUM]: 'bg-emerald-900',
  [Scenario.FOREST]: 'bg-green-950',
  [Scenario.OCEAN]: 'bg-blue-950',
  [Scenario.STREET]: 'bg-gray-800',
  [Scenario.DESERT]: 'bg-yellow-950',
  [Scenario.INDOOR]: 'bg-slate-900',
};
