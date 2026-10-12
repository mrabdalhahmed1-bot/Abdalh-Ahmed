export type UserRole = 'coach' | 'trainee';

export type GoalType = 'fat_loss' | 'muscle_gain' | 'recomp' | 'maintenance' | 'athletic_performance';

export interface ExerciseSet {
  setNumber: number;
  targetReps: string; // e.g. "8-10" or "12"
  targetRpe?: number; // Rate of Perceived Exertion (6-10)
  restSeconds: number;
  actualReps?: number;
  actualWeight?: number; // kg
  completed?: boolean;
}

export type ExerciseCategory = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight';

export interface MasterExercise {
  id: string;
  nameAr: string;
  nameEn: string;
  primaryMuscle: string;
  equipment: string;
  category: ExerciseCategory;
  thumbnailUrl: string;
  videoUrl?: string;
  executionCues: string[];
  defaultSets?: number;
  defaultReps?: string;
  targetRpe?: number;
  restSeconds?: number;
}

export interface WorkoutExercise {
  id: string;
  nameAr: string;
  nameEn: string;
  primaryMuscle: string;
  equipment: string;
  category?: ExerciseCategory;
  videoUrl?: string;
  thumbnailUrl?: string;
  executionCues: string[]; // Arabic cues
  sets: ExerciseSet[];
  coachNotes?: string;
  isSuperSet?: boolean;
  superSetName?: string;
  superSetPair?: WorkoutExercise;
  superSetNotes?: string;
}

export interface WorkoutDay {
  id: string;
  dayName: string; // "اليوم 1: دفع (صدر وتراي وأكتاف)"
  dayOfWeek?: number; // 0=Sunday, etc.
  focusArea: string;
  targetMuscleGroup?: string; // اسم العضلة المستهدفة اليوم ده
  estimatedMinutes: number;
  exercises: WorkoutExercise[];
  completedToday?: boolean;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  splitType: 'push_pull_legs' | 'upper_lower' | 'full_body' | 'custom';
  daysPerWeek: number;
  days: WorkoutDay[];
  createdDate: string;
}

export interface MacroGoals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterLiters: number;
  fiberGrams: number;
  cardioMinutesPerWeek: number;
  cardioType: 'LISS' | 'HIIT' | 'مشي يومي';
  stepGoal: number;
}

export interface DietMealFood {
  id: string;
  name: string;
  grams?: number;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  image?: string;
  note?: string;
}

export interface DietMealSection {
  id: string;
  title: string;
  titleAr: string;
  totalCalories?: number;
  note?: string;
  foods: DietMealFood[];
}

export interface TraineeDietPlan {
  planType: 'standard' | 'carb_cycling';
  defaultDayType?: 'high' | 'low';
  highCarbDay?: {
    title: string;
    description: string;
    targetMacros: { calories: number; protein: number; carbs: number; fat: number };
    meals: DietMealSection[];
  };
  lowCarbDay?: {
    title: string;
    description: string;
    targetMacros: { calories: number; protein: number; carbs: number; fat: number };
    meals: DietMealSection[];
  };
  standardMeals?: DietMealSection[];
  coachNotes?: string;
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string;
}

export interface DailyHabitLog {
  date: string;
  waterGlasses: number; // 250ml each
  stepsCount: number;
  sleepHours: number;
  energyLevel: 1 | 2 | 3 | 4 | 5; // 1-5 stars
  supplementsTaken: boolean;
  notes?: string;
}

export interface BodyMeasurements {
  waistCm: number;
  chestCm: number;
  hipsCm?: number;
  thighCm: number;
  armCm: number;
}

export interface WeeklyCheckIn {
  id: string;
  traineeId: string;
  weekNumber: number;
  date: string;
  weightKg: number;
  measurements: BodyMeasurements;
  photoFrontUrl: string;
  photoBackUrl: string;
  photoSideUrl?: string;
  dietAdherenceScore: number; // 1 to 10
  workoutAdherenceScore: number; // 1 to 10
  sleepQualityScore: number; // 1 to 10
  hungerLevel: 'منخفض' | 'معتدل' | 'مرتفع' | 'شديد';
  digestionStatus: 'ممتاز' | 'طبيعي' | 'انتفاخ خفيف' | 'مشاكل هضمية';
  traineeNotes: string;
  coachFeedback?: {
    feedbackText: string;
    audioNoteUrl?: string;
    reviewedAt: string;
    nextWeekTargetAdjustment?: string;
  };
  status: 'pending' | 'reviewed';
}

export interface TraineeProfile {
  id: string;
  fullName: string;
  username?: string; // اسم المستخدم للدخول
  accessPin?: string; // الرقم السري أو كود المرور
  accessLink?: string; // رابط الدخول المباشر
  avatarUrl: string;
  phone: string;
  email: string;
  age: number;
  heightCm: number;
  startingWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  goal: GoalType;
  goalTitle: string;
  startDate: string;
  subscriptionEnd: string;
  status: 'active' | 'pending_checkin' | 'expiring_soon' | 'paused';
  macroGoals: MacroGoals;
  program: WorkoutProgram;
  loggedMeals: MealItem[];
  customDietPlan?: TraineeDietPlan;
  habits: DailyHabitLog[];
  checkIns: WeeklyCheckIn[];
  personalRecords: {
    exerciseName: string;
    weightKg: number;
    reps: number;
    date: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderRole: UserRole;
  senderName: string;
  traineeId: string;
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  attachmentUrl?: string;
  read: boolean;
}
