export interface SprintMetrics {
  reaction_time: string | null;
  whistle_time: string | null;
  launch_angle: number | null;
  knee_angle: number | null;
}

export interface SprintLog {
  id: string;
  date: string;
  reaction_time: string;
  whistle_time: string;
  launch_angle?: number;
  knee_angle?: number;
  hand_drop_dist?: number;
  created_at?: string;
}

export interface RepPerformance {
  repNumber: number;
  distance: string;
  time: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  title: string;
  splits: RepPerformance[];
  notes: string;
}