import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  UserRole,
  TraineeProfile,
  WorkoutProgram,
  MacroGoals,
  MealItem,
  DailyHabitLog,
  WeeklyCheckIn,
  ChatMessage,
  MasterExercise,
} from '../types/fitness';
import { INITIAL_TRAINEES, INITIAL_MESSAGES, MASTER_EXERCISES, COACH_INFO, PROGRAM_YOUSSEF_GAMAL } from '../data/mockData';
import { DIET_PLAN_YOUSSEF_GAMAL, DIET_PLAN_MOHAMED_QASIM } from '../data/traineeDietPlans';
import { PROGRAM_MOHAMED_QASIM } from '../data/mohamedQasimProgram';

export interface ExerciseWeightLog {
  id: string;
  traineeId: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  weightKg: number;
  reps: number;
  setNumber: number;
}

export interface FitnessContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  authenticatedTraineeId: string | null;
  loginTrainee: (username: string, accessPin: string) => { success: boolean; trainee?: TraineeProfile; error?: string; isCoach?: boolean };
  loginTraineeDirect: (traineeId: string) => void;
  logoutTrainee: () => void;
  verifyCoachCredentials: (inputUsername: string, inputPin: string) => boolean;
  loginAsCoach: () => void;
  trainees: TraineeProfile[];
  currentTraineeId: string;
  setCurrentTraineeId: (id: string) => void;
  activeTrainee: TraineeProfile;
  addTrainee: (trainee: Partial<TraineeProfile>) => void;
  updateTraineeProfile: (traineeId: string, updates: Partial<TraineeProfile>) => void;
  updateTraineeCredentials: (traineeId: string, username: string, accessPin: string, fullName?: string) => void;
  deleteTrainee: (traineeId: string) => void;
  updateTraineeProgram: (traineeId: string, program: WorkoutProgram) => void;
  updateTraineeMacros: (traineeId: string, macros: MacroGoals) => void;
  completeExerciseSet: (
    traineeId: string,
    dayId: string,
    exerciseId: string,
    setNumber: number,
    reps: number,
    weight: number
  ) => void;
  toggleExerciseSetCompleted: (
    traineeId: string,
    dayId: string,
    exerciseId: string,
    setNumber: number
  ) => void;
  logMeal: (traineeId: string, meal: Omit<MealItem, 'id' | 'loggedAt'>) => void;
  deleteMeal: (traineeId: string, mealId: string) => void;
  updateDailyHabits: (traineeId: string, updates: Partial<DailyHabitLog>) => void;
  submitWeeklyCheckIn: (traineeId: string, data: Omit<WeeklyCheckIn, 'id' | 'traineeId' | 'status'>) => void;
  reviewCheckIn: (checkInId: string, feedbackText: string, adjustmentNote?: string) => void;
  messages: ChatMessage[];
  sendMessage: (traineeId: string, text: string, isAudio?: boolean, audioDuration?: string) => void;
  resetDemoData: () => void;
  coachInfo: typeof COACH_INFO;
  updateCoachInfo: (info: Partial<typeof COACH_INFO>) => void;
  appIcon: string;
  updateAppIcon: (base64OrUrl: string) => Promise<{ success: boolean; message?: string }>;
  resetAppIcon: () => void;
  exerciseCatalog: MasterExercise[];
  addCustomExercise: (exercise: MasterExercise) => void;
  toastCheer: { id: number; message: string; type: 'individual' | 'complete' } | null;
  triggerCheer: (message?: string) => void;
  triggerFullCompletion: (taskName: string) => void;
  checkedMealIds: Record<string, boolean>;
  toggleMealChecked: (mealId: string, itemData: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
  weeklySleepHours: number;
  setWeeklySleepHours: (hours: number) => void;
  swappedMeals: Array<{ id: string; traineeId: string; date: string; original: string; replacement: string; reason?: string }>;
  logMealSwap: (traineeId: string, original: string, replacement: string, reason?: string) => void;
  registerBackHandler: (handler: () => boolean) => () => void;
  exerciseWeightLogs: ExerciseWeightLog[];
  logExerciseWeight: (traineeId: string, exerciseId: string, exerciseName: string, weightKg: number, reps: number, setNumber: number) => void;
  getExerciseWeightHistory: (traineeId: string, exerciseId: string) => ExerciseWeightLog[];
}

const STORAGE_KEY_TRAINEES = 'modarribi_trainees_v3';
const STORAGE_KEY_DELETED_TRAINEES = 'aq_deleted_trainee_ids_v2';
const STORAGE_KEY_WEIGHT_LOGS = 'aq_exercise_weight_logs_v1';
const STORAGE_KEY_MESSAGES = 'modarribi_messages_v1';
const STORAGE_KEY_ROLE = 'modarribi_role_v1';
const STORAGE_KEY_ACTIVE_TRAINEE = 'modarribi_active_trainee_v1';
const STORAGE_KEY_COACH_INFO = 'modarribi_coach_info_v1';
const STORAGE_KEY_CUSTOM_APP_ICON = 'smart_fitness_custom_app_icon_v3';
const STORAGE_KEY_CHECKED_MEALS = 'aq_checked_meals_today_v1';
const STORAGE_KEY_WEEKLY_SLEEP = 'aq_weekly_sleep_hours_v1';
const STORAGE_KEY_SWAPPED_MEALS = 'aq_swapped_meals_log_v1';
const STORAGE_KEY_ACTIVE_DAY = 'aq_last_active_day_v1';
const STORAGE_KEY_CUSTOM_EXERCISES = 'aq_custom_exercises_v1';
const STORAGE_KEY_AUTH_TRAINEE = 'aq_auth_trainee_id_v2';

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customExercises, setCustomExercises] = useState<MasterExercise[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_EXERCISES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const exerciseCatalog = useMemo<MasterExercise[]>(() => {
    const customMap = new Map(customExercises.map(e => [e.id, e]));
    const defaults = MASTER_EXERCISES.filter(e => !customMap.has(e.id));
    return [...customExercises, ...defaults];
  }, [customExercises]);

  const addCustomExercise = useCallback((newEx: MasterExercise) => {
    setCustomExercises(prev => {
      const updated = [newEx, ...prev.filter(e => e.id !== newEx.id)];
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_EXERCISES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);
  const [coachInfo, setCoachInfo] = useState<typeof COACH_INFO>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COACH_INFO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && !parsed.name.includes('مدربي')) {
          return { ...COACH_INFO, ...parsed };
        }
      }
    } catch {}
    return COACH_INFO;
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROLE);
    return (saved as UserRole) || 'trainee';
  });

  const [authenticatedTraineeId, setAuthenticatedTraineeIdState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH_TRAINEE);
  });

  const [currentTraineeId, setCurrentTraineeIdState] = useState<string>(() => {
    const authId = localStorage.getItem(STORAGE_KEY_AUTH_TRAINEE);
    if (authId) return authId;
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TRAINEE);
    return saved || 'trainee-4'; // Default to Youssef Gamal if available
  });

  const [trainees, setTrainees] = useState<TraineeProfile[]>(() => {
    try {
      const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED_TRAINEES);
      const deletedIds = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);

      const saved = localStorage.getItem(STORAGE_KEY_TRAINEES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always ensure Youssef Gamal and Mohamed Qasim match their specific plans and credentials
          const updatedParsed = parsed
            .filter((t: any) => !deletedIds.has(t.id))
            .map((t: any) => {
              if (t.fullName === 'يوسف جمال' || t.id === 'trainee-4') {
                return {
                  ...t,
                  program: PROGRAM_YOUSSEF_GAMAL,
                  customDietPlan: DIET_PLAN_YOUSSEF_GAMAL,
                  username: t.username || 'youssef_gamal',
                  accessPin: t.accessPin || '123456',
                  macroGoals: {
                    ...t.macroGoals,
                    calories: 2375,
                    proteinGrams: 183,
                    carbsGrams: 266,
                    fatsGrams: 69
                  }
                };
              }
              if (t.fullName === 'محمد قاسم' || t.id === 'trainee-5') {
                return {
                  ...t,
                  program: PROGRAM_MOHAMED_QASIM,
                  customDietPlan: DIET_PLAN_MOHAMED_QASIM,
                  username: t.username || 'mohamed_qasim',
                  accessPin: t.accessPin || '789012'
                };
              }
              return t;
            });

          return updatedParsed;
        }
      }
      return INITIAL_TRAINEES.filter(t => !deletedIds.has(t.id));
    } catch {
      // fallback
    }
    return INITIAL_TRAINEES;
  });

  // Persistent Exercise Weight Logs (Request 16)
  const [exerciseWeightLogs, setExerciseWeightLogs] = useState<ExerciseWeightLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEIGHT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init-w1',
        traineeId: 'trainee-4',
        exerciseId: 'bb-1',
        exerciseName: 'Barbell Flat Bench Press',
        date: '10 أكتوبر 2026',
        weightKg: 85,
        reps: 10,
        setNumber: 1
      },
      {
        id: 'init-w2',
        traineeId: 'trainee-4',
        exerciseId: 'bb-1',
        exerciseName: 'Barbell Flat Bench Press',
        date: '12 أكتوبر 2026',
        weightKg: 87.5,
        reps: 8,
        setNumber: 1
      }
    ];
  });

  const logExerciseWeight = useCallback((
    traineeId: string,
    exerciseId: string,
    exerciseName: string,
    weightKg: number,
    reps: number,
    setNumber: number
  ) => {
    if (!weightKg || weightKg <= 0) return;
    const newEntry: ExerciseWeightLog = {
      id: `wlog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      traineeId,
      exerciseId,
      exerciseName,
      date: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' }),
      weightKg,
      reps: reps || 0,
      setNumber
    };
    setExerciseWeightLogs(prev => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_WEIGHT_LOGS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const getExerciseWeightHistory = useCallback((traineeId: string, exerciseId: string) => {
    return exerciseWeightLogs.filter(l => l.traineeId === traineeId && l.exerciseId === exerciseId);
  }, [exerciseWeightLogs]);

  // Deep linking and direct URL parameter handling
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const isLogout = searchParams.get('logout') === '1' || searchParams.get('logout') === 'true';
      const targetRole = searchParams.get('role');

      if (isLogout) {
        setAuthenticatedTraineeIdState(null);
        localStorage.removeItem(STORAGE_KEY_AUTH_TRAINEE);
        return;
      }

      if (targetRole === 'coach') {
        setUserRoleState('coach');
        localStorage.setItem(STORAGE_KEY_ROLE, 'coach');
      }
    } catch {}
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES;
  });

  const [appIcon, setAppIcon] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_APP_ICON);
      if (saved) return saved;
    } catch {}
    return '/images/brand-vector-1024.svg';
  });

  // Sync favicon and apple touch icon dynamically with highest quality
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const links = document.querySelectorAll<HTMLLinkElement>(
        "link[rel*='icon'], link[rel='apple-touch-icon']"
      );
      links.forEach((l) => {
        if (appIcon.startsWith('data:')) {
          l.href = appIcon;
        } else {
          if (l.getAttribute('sizes')?.includes('1024')) {
            l.href = '/images/icon-1024.png';
          } else if (l.getAttribute('sizes')?.includes('512') || l.rel.includes('apple-touch')) {
            l.href = '/images/icon-512.png';
          } else {
            l.href = '/images/icon-192.png';
          }
        }
      });
    }
  }, [appIcon]);

  // Toast cheer state
  const [toastCheer, setToastCheer] = useState<{ id: number; message: string; type: 'individual' | 'complete' } | null>(null);

  const triggerCheer = (message = 'أحسنت 🔥🔥') => {
    setToastCheer({ id: Date.now(), message, type: 'individual' });
    setTimeout(() => {
      setToastCheer((curr) => (curr && curr.message === message ? null : curr));
    }, 2400);
  };

  const triggerFullCompletion = (taskName: string) => {
    setToastCheer({ 
      id: Date.now(), 
      message: `تهانينا لقد أتممت اليوم: ${taskName} 🔥🔥🔥`, 
      type: 'complete' 
    });
    setTimeout(() => {
      setToastCheer((curr) => (curr && curr.type === 'complete' ? null : curr));
    }, 4500);
  };

  // Checked meal items for today
  const [checkedMealIds, setCheckedMealIds] = useState<Record<string, boolean>>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedDay = localStorage.getItem(STORAGE_KEY_ACTIVE_DAY);
      if (savedDay && savedDay !== today) {
        // Midnight reset!
        localStorage.setItem(STORAGE_KEY_ACTIVE_DAY, today);
        localStorage.removeItem(STORAGE_KEY_CHECKED_MEALS);
        return {};
      }
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED_MEALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Weekly Sleep Hours (recorded weekly)
  const [weeklySleepHours, setWeeklySleepHoursState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEEKLY_SLEEP);
      if (saved) return Number(saved);
    } catch {}
    return 8; // default 7 to 9 hours
  });

  const setWeeklySleepHours = (hours: number) => {
    setWeeklySleepHoursState(hours);
    try {
      localStorage.setItem(STORAGE_KEY_WEEKLY_SLEEP, String(hours));
    } catch {}
    triggerCheer('تم تسجيل نوم الأسبوع بنجاح 🔥🔥');
  };

  // Swapped Meals Log
  const [swappedMeals, setSwappedMeals] = useState<Array<{ id: string; traineeId: string; date: string; original: string; replacement: string; reason?: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SWAPPED_MEALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'sw-1', traineeId: 'trainee-1', date: '2026-10-01', original: 'أرز بسمتي', replacement: 'بطاطس مسلوقة (220غ)', reason: 'تفضيل البطاطس بعد تمرين الأرجل' },
      { id: 'sw-2', traineeId: 'trainee-1', date: '2026-09-29', original: 'صدور دجاج', replacement: 'تونة مصفاة بالماء (150غ)', reason: 'سفر وتناول طعام سريع' }
    ];
  });

  const logMealSwap = (traineeId: string, original: string, replacement: string, reason?: string) => {
    const newSwap = {
      id: `sw-${Date.now()}`,
      traineeId,
      date: new Date().toISOString().split('T')[0],
      original,
      replacement,
      reason
    };
    setSwappedMeals(prev => {
      const updated = [newSwap, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_SWAPPED_MEALS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Automatic midnight reset check
  useEffect(() => {
    const handleMidnightCheck = () => {
      const today = new Date().toISOString().split('T')[0];
      const savedDay = localStorage.getItem(STORAGE_KEY_ACTIVE_DAY);
      if (savedDay && savedDay !== today) {
        // Midnight transition! Reset hydration, calories, checked meals
        localStorage.setItem(STORAGE_KEY_ACTIVE_DAY, today);
        setCheckedMealIds({});
        localStorage.removeItem(STORAGE_KEY_CHECKED_MEALS);
        
        // Reset daily hydration glasses to 0 for active trainee
        setTrainees(prev => prev.map(t => {
          const habitsWithoutOldToday = t.habits.filter(h => h.date !== today);
          const newTodayHabit: DailyHabitLog = {
            date: today,
            waterGlasses: 0,
            stepsCount: 0,
            sleepHours: 8,
            energyLevel: 4,
            supplementsTaken: false
          };
          return {
            ...t,
            habits: [newTodayHabit, ...habitsWithoutOldToday]
          };
        }));
      } else if (!savedDay) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_DAY, today);
      }
    };

    handleMidnightCheck();
    const interval = setInterval(handleMidnightCheck, 15000); // check every 15s
    return () => clearInterval(interval);
  }, []);

  const toggleMealChecked = (mealId: string, itemData: { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
    setCheckedMealIds(prev => {
      const isCurrentlyChecked = !!prev[mealId];
      const nextChecked = !isCurrentlyChecked;
      const updated = { ...prev, [mealId]: nextChecked };
      
      try {
        localStorage.setItem(STORAGE_KEY_CHECKED_MEALS, JSON.stringify(updated));
      } catch {}

      if (nextChecked) {
        triggerCheer('أحسنت 🔥🔥');
        // Add to daily logged meals
        logMeal(activeTrainee.id, {
          name: itemData.name,
          serving: 'حصة معتمدة',
          calories: itemData.calories,
          protein: itemData.protein,
          carbs: itemData.carbs,
          fat: itemData.fat,
          mealType: 'lunch'
        });
      }

      return updated;
    });
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRAINEES, JSON.stringify(trainees));
    } catch (e) {
      console.error('Failed to save trainees', e);
    }
  }, [trainees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  }, [messages]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEY_ROLE, role);
  };

  const setCurrentTraineeId = (id: string) => {
    setCurrentTraineeIdState(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_TRAINEE, id);
  };

  const activeTrainee = trainees.find(t => t.id === currentTraineeId) || trainees[0];

  const addTrainee = (data: Partial<TraineeProfile>) => {
    const newId = `trainee-${Date.now()}`;
    const defaultProfile: TraineeProfile = {
      id: newId,
      fullName: data.fullName || 'متدرب جديد',
      avatarUrl: data.avatarUrl || '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
      phone: data.phone || '+966 50 000 0000',
      email: data.email || 'client@example.com',
      age: data.age || 25,
      heightCm: data.heightCm || 175,
      startingWeightKg: data.startingWeightKg || 80,
      currentWeightKg: data.startingWeightKg || 80,
      targetWeightKg: data.targetWeightKg || 72,
      goal: data.goal || 'fat_loss',
      goalTitle: data.goalTitle || 'خطة خسارة دهون وبناء عضل',
      startDate: new Date().toISOString().split('T')[0],
      subscriptionEnd: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'active',
      macroGoals: data.macroGoals || {
        calories: 2200,
        proteinGrams: 170,
        carbsGrams: 220,
        fatsGrams: 60,
        waterLiters: 3.5,
        fiberGrams: 30,
        cardioMinutesPerWeek: 90,
        cardioType: 'مشي يومي',
        stepGoal: 10000,
      },
      program: data.program || INITIAL_TRAINEES[0].program,
      loggedMeals: [],
      habits: [
        {
          date: new Date().toISOString().split('T')[0],
          waterGlasses: 6,
          stepsCount: 5000,
          sleepHours: 7,
          energyLevel: 4,
          supplementsTaken: false,
        }
      ],
      checkIns: [],
      personalRecords: []
    };

    setTrainees(prev => [defaultProfile, ...prev]);
    setCurrentTraineeId(newId);
  };

  const deleteTrainee = (traineeId: string) => {
    setTrainees(prev => {
      const remaining = prev.filter(t => t.id !== traineeId);
      try {
        localStorage.setItem(STORAGE_KEY_TRAINEES, JSON.stringify(remaining));
        const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED_TRAINEES);
        const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
        if (!deletedIds.includes(traineeId)) {
          deletedIds.push(traineeId);
          localStorage.setItem(STORAGE_KEY_DELETED_TRAINEES, JSON.stringify(deletedIds));
        }
      } catch {}
      if (currentTraineeId === traineeId && remaining.length > 0) {
        setCurrentTraineeId(remaining[0].id);
      }
      return remaining;
    });
    triggerCheer('تم حذف المتدرب نهائياً');
  };

  const updateTraineeCredentials = (traineeId: string, username: string, accessPin: string, fullName?: string) => {
    setTrainees(prev => {
      const updated = prev.map(t => (t.id === traineeId ? { 
        ...t, 
        username, 
        accessPin,
        ...(fullName && fullName.trim() ? { fullName: fullName.trim() } : {})
      } : t));
      try {
        localStorage.setItem(STORAGE_KEY_TRAINEES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerCheer('تم حفظ اسم المتدرب والرقم السري بنجاح 🔒');
  };

  const verifyCoachCredentials = useCallback((inputUsername: string, inputPin: string): boolean => {
    const cleanUser = inputUsername.trim().toLowerCase();
    const cleanPin = inputPin.trim();
    const cUser = (coachInfo.username || 'coach').trim().toLowerCase();
    const cPin = (coachInfo.accessPin || '123456').trim();
    const isCoachUser = 
      cleanUser === cUser || 
      cleanUser === 'coach' || 
      cleanUser === 'abdullah' || 
      cleanUser === 'admin' || 
      cleanUser === '01068298126' || 
      cleanUser === 'كوتش' ||
      cleanUser === 'كوتش عبدالله' ||
      cleanUser === 'عبدالله قاسم' ||
      cleanUser === 'كوتش عبدالله قاسم';
    const isCoachPin = cleanPin === cPin || cleanPin === '123456';
    return isCoachUser && isCoachPin;
  }, [coachInfo]);

  const loginAsCoach = useCallback(() => {
    setUserRoleState('coach');
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, 'coach');
    } catch {}
    triggerCheer('مرحباً كوتش عبدالله! تم الدخول إلى لوحة التحكم 👑');
  }, [triggerCheer]);

  const loginTrainee = useCallback((inputUsername: string, inputPin: string) => {
    const cleanUser = inputUsername.trim().toLowerCase();
    const cleanPin = inputPin.trim();

    if (!cleanUser || !cleanPin) {
      return { success: false, error: 'يرجى إدخال اسم المستخدم والرمز السري' };
    }

    // Check if entered credentials belong to Coach
    if (verifyCoachCredentials(cleanUser, cleanPin)) {
      loginAsCoach();
      return { success: true, isCoach: true };
    }

    const found = trainees.find(t => {
      const tUser = (t.username || '').trim().toLowerCase();
      const tName = t.fullName.trim().toLowerCase();
      const tPin = (t.accessPin || '').trim();
      const userMatches = tUser === cleanUser || tName === cleanUser || tUser.replace(/_/g, ' ') === cleanUser;
      const pinMatches = tPin === cleanPin;
      return userMatches && pinMatches;
    });

    if (found) {
      setAuthenticatedTraineeIdState(found.id);
      setCurrentTraineeIdState(found.id);
      setUserRoleState('trainee');
      try {
        localStorage.setItem(STORAGE_KEY_AUTH_TRAINEE, found.id);
        localStorage.setItem(STORAGE_KEY_ROLE, 'trainee');
        localStorage.setItem(STORAGE_KEY_ACTIVE_TRAINEE, found.id);
      } catch {}
      triggerCheer(`أهلاً بك يا ${found.fullName}! تم تسجيل الدخول بنجاح 🎉`);
      return { success: true, trainee: found };
    }

    return {
      success: false,
      error: 'اسم المستخدم أو الرقم السري غير صحيح. يرجى التأكد من البيانات أو التواصل مع الكوتش.'
    };
  }, [verifyCoachCredentials, loginAsCoach, trainees, triggerCheer]);

  const logoutTrainee = useCallback(() => {
    setAuthenticatedTraineeIdState(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH_TRAINEE);
    } catch {}
    triggerCheer('تم تسجيل الخروج بنجاح 👋');
  }, [triggerCheer]);

  const loginTraineeDirect = useCallback((traineeId: string) => {
    const found = trainees.find(t => t.id === traineeId);
    if (found) {
      setAuthenticatedTraineeIdState(found.id);
      setCurrentTraineeIdState(found.id);
      setUserRoleState('trainee');
      try {
        localStorage.setItem(STORAGE_KEY_AUTH_TRAINEE, found.id);
        localStorage.setItem(STORAGE_KEY_ROLE, 'trainee');
        localStorage.setItem(STORAGE_KEY_ACTIVE_TRAINEE, found.id);
      } catch {}
      triggerCheer(`تم الدخول إلى بوابة المتدرب ${found.fullName}`);
    }
  }, [trainees, triggerCheer]);

  const updateTraineeMacros = (traineeId: string, newMacros: MacroGoals) => {
    setTrainees(prev =>
      prev.map(t => (t.id === traineeId ? { ...t, macroGoals: newMacros } : t))
    );
  };

  const updateTraineeProgram = (traineeId: string, newProgram: WorkoutProgram) => {
    setTrainees(prev =>
      prev.map(t => (t.id === traineeId ? { ...t, program: newProgram } : t))
    );
  };

  const updateTraineeProfile = (traineeId: string, updates: Partial<TraineeProfile>) => {
    setTrainees(prev =>
      prev.map(t => (t.id === traineeId ? { ...t, ...updates } : t))
    );
  };

  const completeExerciseSet = (
    traineeId: string,
    dayId: string,
    exerciseId: string,
    setNumber: number,
    reps: number,
    weight: number
  ) => {
    setTrainees(prev =>
      prev.map(t => {
        if (t.id !== traineeId) return t;
        const updatedDays = t.program.days.map(d => {
          if (d.id !== dayId) return d;
          const updatedExercises = d.exercises.map(ex => {
            if (ex.id !== exerciseId) return ex;
            const updatedSets = ex.sets.map(s => {
              if (s.setNumber !== setNumber) return s;
              return {
                ...s,
                actualReps: reps,
                actualWeight: weight,
                completed: true,
              };
            });
            // Automatically log to persistent weight history (Request 16)
            if (weight > 0) {
              logExerciseWeight(traineeId, exerciseId, ex.nameAr || ex.nameEn, weight, reps, setNumber);
            }
            return { ...ex, sets: updatedSets };
          });
          return { ...d, exercises: updatedExercises };
        });
        return {
          ...t,
          program: { ...t.program, days: updatedDays },
        };
      })
    );
  };

  const toggleExerciseSetCompleted = (
    traineeId: string,
    dayId: string,
    exerciseId: string,
    setNumber: number
  ) => {
    setTrainees(prev =>
      prev.map(t => {
        if (t.id !== traineeId) return t;
        const updatedDays = t.program.days.map(d => {
          if (d.id !== dayId) return d;
          const updatedExercises = d.exercises.map(ex => {
            if (ex.id !== exerciseId) return ex;
            const updatedSets = ex.sets.map(s => {
              if (s.setNumber !== setNumber) return s;
              const willBeCompleted = !s.completed;
              return {
                ...s,
                completed: willBeCompleted,
                actualReps: s.actualReps || parseInt(s.targetReps) || 10,
                actualWeight: s.actualWeight || 50,
              };
            });
            return { ...ex, sets: updatedSets };
          });
          return { ...d, exercises: updatedExercises };
        });
        return {
          ...t,
          program: { ...t.program, days: updatedDays },
        };
      })
    );
  };

  const logMeal = (traineeId: string, meal: Omit<MealItem, 'id' | 'loggedAt'>) => {
    const newMealItem: MealItem = {
      ...meal,
      id: `meal-${Date.now()}`,
      loggedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setTrainees(prev =>
      prev.map(t => {
        if (t.id !== traineeId) return t;
        return {
          ...t,
          loggedMeals: [newMealItem, ...t.loggedMeals],
        };
      })
    );
  };

  const deleteMeal = (traineeId: string, mealId: string) => {
    setTrainees(prev =>
      prev.map(t => {
        if (t.id !== traineeId) return t;
        return {
          ...t,
          loggedMeals: t.loggedMeals.filter(m => m.id !== mealId),
        };
      })
    );
  };

  const updateDailyHabits = (traineeId: string, updates: Partial<DailyHabitLog>) => {
    const today = new Date().toISOString().split('T')[0];
    setTrainees(prev =>
      prev.map(t => {
        if (t.id !== traineeId) return t;
        const existingToday = t.habits.find(h => h.date === today);
        let updatedHabits: DailyHabitLog[];
        if (existingToday) {
          updatedHabits = t.habits.map(h => (h.date === today ? { ...h, ...updates } : h));
        } else {
          const newLog: DailyHabitLog = {
            date: today,
            waterGlasses: 4,
            stepsCount: 3000,
            sleepHours: 7,
            energyLevel: 4,
            supplementsTaken: false,
            ...updates,
          };
          updatedHabits = [newLog, ...t.habits];
        }
        return { ...t, habits: updatedHabits };
      })
    );
  };

  const submitWeeklyCheckIn = (
    traineeId: string,
    data: Omit<WeeklyCheckIn, 'id' | 'traineeId' | 'status'>
  ) => {
    const newCheckIn: WeeklyCheckIn = {
      ...data,
      id: `chk-${Date.now()}`,
      traineeId,
      status: 'pending',
    };

    setTrainees(prev =>
      prev.map(t => {
        if (t.id !== traineeId) return t;
        return {
          ...t,
          currentWeightKg: data.weightKg,
          status: 'pending_checkin',
          checkIns: [newCheckIn, ...t.checkIns],
        };
      })
    );

    // Notify in chat
    sendMessage(
      traineeId,
      `📋 أرسل المتدرب تقرير المتابعة الأسبوعية للأسبوع ${data.weekNumber} (الوزن: ${data.weightKg} كغ). بانتظار مراجعة الكوتش.`
    );
  };

  const reviewCheckIn = (checkInId: string, feedbackText: string, adjustmentNote?: string) => {
    setTrainees(prev =>
      prev.map(t => {
        const hasCheckIn = t.checkIns.some(c => c.id === checkInId);
        if (!hasCheckIn) return t;

        const updatedCheckIns = t.checkIns.map(c => {
          if (c.id !== checkInId) return c;
          return {
            ...c,
            status: 'reviewed' as const,
            coachFeedback: {
              feedbackText,
              reviewedAt: new Date().toISOString().split('T')[0],
              nextWeekTargetAdjustment: adjustmentNote,
            },
          };
        });

        return {
          ...t,
          status: 'active',
          checkIns: updatedCheckIns,
        };
      })
    );

    // Also send feedback message into chat
    const targetTrainee = trainees.find(t => t.checkIns.some(c => c.id === checkInId));
    if (targetTrainee) {
      sendMessage(
        targetTrainee.id,
        `✅ قام الكوتش بمراجعة متابعتك الأسبوعية:\n"${feedbackText}"\n${adjustmentNote ? `\n📌 التعديل للأسبوع القادم: ${adjustmentNote}` : ''}`
      );
    }
  };

  const sendMessage = (
    traineeId: string,
    text: string,
    isAudio = false,
    audioDuration?: string
  ) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: userRole,
      senderName: userRole === 'coach' ? COACH_INFO.name : (trainees.find(t => t.id === traineeId)?.fullName || 'المتدرب'),
      traineeId,
      text,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      isAudio,
      audioDuration,
      read: false,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const updateCoachInfo = (newInfo: Partial<typeof COACH_INFO>) => {
    setCoachInfo(prev => {
      const updated = { ...prev, ...newInfo };
      localStorage.setItem(STORAGE_KEY_COACH_INFO, JSON.stringify(updated));
      return updated;
    });
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_TRAINEES);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    localStorage.removeItem(STORAGE_KEY_COACH_INFO);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_APP_ICON);
    setCoachInfo(COACH_INFO);
    setTrainees(INITIAL_TRAINEES);
    setMessages(INITIAL_MESSAGES);
    setCurrentTraineeId('trainee-1');
    setAppIcon('/pwa-192x192.png');
  };

  const updateAppIcon = async (base64OrUrl: string): Promise<{ success: boolean; message?: string }> => {
    setAppIcon(base64OrUrl);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_APP_ICON, base64OrUrl);
    } catch (e) {
      console.warn('Could not save custom app icon to localStorage', e);
    }

    try {
      const res = await fetch('/api/upload-app-icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64OrUrl }),
      });
      const data = await res.json();
      return { success: data.success !== false, message: data.message };
    } catch {
      return { success: true, message: 'تم حفظ الصورة بنجاح على جهازك' };
    }
  };

  const resetAppIcon = () => {
    setAppIcon('/images/icon-192.png');
    localStorage.removeItem(STORAGE_KEY_CUSTOM_APP_ICON);
  };

  // Global Mobile Hardware Back Button Handling Stack (Request 3)
  const backStackRef = useRef<Array<() => boolean>>([]);

  const registerBackHandler = useCallback((handler: () => boolean) => {
    backStackRef.current.push(handler);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({ modalLevel: backStackRef.current.length }, '');
    }

    return () => {
      backStackRef.current = backStackRef.current.filter(h => h !== handler);
    };
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (backStackRef.current.length > 0) {
        const topHandler = backStackRef.current.pop();
        if (topHandler) {
          const handled = topHandler();
          if (handled) {
            return;
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <FitnessContext.Provider
      value={{
        userRole,
        setUserRole,
        authenticatedTraineeId,
        loginTrainee,
        logoutTrainee,
        loginTraineeDirect,
        loginAsCoach,
        verifyCoachCredentials,
        currentTraineeId,
        setCurrentTraineeId,
        trainees,
        activeTrainee,
        coachInfo,
        updateCoachInfo,
        messages,
        exerciseCatalog,
        addCustomExercise,
        addTrainee,
        deleteTrainee,
        updateTraineeCredentials,
        updateTraineeMacros,
        updateTraineeProgram,
        updateTraineeProfile,
        completeExerciseSet,
        toggleExerciseSetCompleted,
        logMeal,
        deleteMeal,
        updateDailyHabits,
        submitWeeklyCheckIn,
        reviewCheckIn,
        sendMessage,
        resetDemoData,
        appIcon,
        updateAppIcon,
        resetAppIcon,
        toastCheer,
        triggerCheer,
        triggerFullCompletion,
        checkedMealIds,
        toggleMealChecked,
        weeklySleepHours,
        setWeeklySleepHours,
        swappedMeals,
        logMealSwap,
        registerBackHandler,
        exerciseWeightLogs,
        logExerciseWeight,
        getExerciseWeightHistory,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
