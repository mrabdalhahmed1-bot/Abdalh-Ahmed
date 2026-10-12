import React, { useState, useMemo } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { MasterExercise, WorkoutExercise, ExerciseCategory, ExerciseSet } from '../../types/fitness';
import { 
  X, 
  Search, 
  Dumbbell, 
  Plus, 
  Sparkles, 
  Check, 
  Layers, 
  Clock, 
  Target, 
  Info,
  ChevronLeft,
  SlidersHorizontal
} from 'lucide-react';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExerciseToDay?: (exercise: WorkoutExercise) => void;
  targetDayName?: string;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onAddExerciseToDay,
  targetDayName
}) => {
  const { exerciseCatalog, addCustomExercise } = useFitness();

  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<MasterExercise | null>(null);

  // Set customization when adding to a workout day
  const [customSetsCount, setCustomSetsCount] = useState(3);
  const [customReps, setCustomReps] = useState('8-10');
  const [customRpe, setCustomRpe] = useState(8.5);
  const [customRest, setCustomRest] = useState(90);
  const [customCoachNotes, setCustomCoachNotes] = useState('');

  // New Custom Exercise Form State
  const [newExNameAr, setNewExNameAr] = useState('');
  const [newExNameEn, setNewExNameEn] = useState('');
  const [newExCategory, setNewExCategory] = useState<ExerciseCategory>('barbell');
  const [newExMuscle, setNewExMuscle] = useState('الصدر (Chest)');
  const [newExEquipment, setNewExEquipment] = useState('بار وأوزان أولمبية');
  const [newExCues, setNewExCues] = useState('');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRest, setNewExRest] = useState(90);
  const [createSuccessMsg, setCreateSuccessMsg] = useState(false);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exerciseCatalog.filter(ex => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        ex.nameAr.toLowerCase().includes(q) || 
        ex.nameEn.toLowerCase().includes(q) || 
        ex.primaryMuscle.toLowerCase().includes(q) || 
        ex.equipment.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory;
      const matchesMuscle = selectedMuscle === 'all' || ex.primaryMuscle.includes(selectedMuscle);

      return matchesSearch && matchesCat && matchesMuscle;
    });
  }, [exerciseCatalog, searchQuery, selectedCategory, selectedMuscle]);

  if (!isOpen) return null;

  const handleSelectExercise = (ex: MasterExercise) => {
    setSelectedExercise(ex);
    setCustomSetsCount(ex.defaultSets || 3);
    setCustomReps(ex.defaultReps || '8-10');
    setCustomRpe(ex.targetRpe || 8.5);
    setCustomRest(ex.restSeconds || 90);
    setCustomCoachNotes('');
  };

  const handleConfirmAddSelected = () => {
    if (!selectedExercise || !onAddExerciseToDay) return;

    const sets: ExerciseSet[] = Array.from({ length: customSetsCount }, (_, i) => ({
      setNumber: i + 1,
      targetReps: customReps,
      targetRpe: customRpe,
      restSeconds: customRest,
    }));

    const workoutEx: WorkoutExercise = {
      id: `ex-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nameAr: selectedExercise.nameAr,
      nameEn: selectedExercise.nameEn,
      primaryMuscle: selectedExercise.primaryMuscle,
      equipment: selectedExercise.equipment,
      category: selectedExercise.category,
      thumbnailUrl: selectedExercise.thumbnailUrl,
      videoUrl: selectedExercise.videoUrl,
      executionCues: selectedExercise.executionCues,
      sets,
      coachNotes: customCoachNotes.trim() ? customCoachNotes.trim() : undefined
    };

    onAddExerciseToDay(workoutEx);
    onClose();
  };

  const handleCreateCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExNameAr.trim()) return;

    const cuesArray = newExCues.trim() 
      ? newExCues.split('\n').map(c => c.trim()).filter(Boolean)
      : ['الحفاظ على الثبات والمدى الحركي الكامل', 'التحكم بالنزول السلبي وعصر العضلة'];

    const newMasterEx: MasterExercise = {
      id: `custom-ex-${Date.now()}`,
      nameAr: newExNameAr.trim(),
      nameEn: newExNameEn.trim() || newExNameAr.trim(),
      category: newExCategory,
      primaryMuscle: newExMuscle,
      equipment: newExEquipment,
      thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
      executionCues: cuesArray,
      defaultSets: newExSets,
      defaultReps: newExReps,
      restSeconds: newExRest,
      targetRpe: 8.5
    };

    addCustomExercise(newMasterEx);

    // If we're inside a trainee's workout day, add it immediately!
    if (onAddExerciseToDay) {
      const sets: ExerciseSet[] = Array.from({ length: newExSets }, (_, i) => ({
        setNumber: i + 1,
        targetReps: newExReps,
        targetRpe: 8.5,
        restSeconds: newExRest,
      }));

      const workoutEx: WorkoutExercise = {
        id: `ex-${Date.now()}`,
        nameAr: newMasterEx.nameAr,
        nameEn: newMasterEx.nameEn,
        primaryMuscle: newMasterEx.primaryMuscle,
        equipment: newMasterEx.equipment,
        category: newMasterEx.category,
        thumbnailUrl: newMasterEx.thumbnailUrl,
        executionCues: newMasterEx.executionCues,
        sets
      };
      onAddExerciseToDay(workoutEx);
      onClose();
      return;
    }

    setCreateSuccessMsg(true);
    setTimeout(() => {
      setCreateSuccessMsg(false);
      setNewExNameAr('');
      setNewExNameEn('');
      setNewExCues('');
      setActiveTab('browse');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {onAddExerciseToDay ? `إضافة تمرين إلى: ${targetDayName || 'اليوم التدريبي'}` : 'مكتبة التمارين وإضافة تمرين جديد'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {exerciseCatalog.length} تمرين متاح
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                اختر من تمارين البار، الدانبل، الكابل، أو أنشئ تمريناً مخصصاً بمرونة كاملة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Browse Catalog vs Create Custom */}
        <div className="px-5 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'browse'
                  ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              📚 تصفح المكتبة الشاملة ({exerciseCatalog.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'create'
                  ? 'bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إنشاء تمرين يدوي مخصص</span>
            </button>
          </div>

          {targetDayName && (
            <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
              الوجهة: <strong className="text-emerald-400">{targetDayName}</strong>
            </span>
          )}
        </div>

        {/* CONTENT AREA */}
        {activeTab === 'browse' ? (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left/Middle Column: Filters & Exercises List */}
            <div className="flex-1 flex flex-col overflow-hidden border-b md:border-b-0 md:border-l border-neutral-800">
              
              {/* Search & Filter Bar */}
              <div className="p-3.5 bg-neutral-900/60 border-b border-neutral-800 space-y-2.5 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم (بنش برس، سحب، دمبل، سكوات، بار، كيبل)..."
                    className="w-full bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Equipment / Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                        : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setSelectedCategory('barbell')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1 ${
                      selectedCategory === 'barbell'
                        ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800'
                        : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                    }`}
                  >
                    <span>🏋️ تمارين البار</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('dumbbell')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1 ${
                      selectedCategory === 'dumbbell'
                        ? 'bg-blue-950 text-blue-300 font-bold border border-blue-800'
                        : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                    }`}
                  >
                    <span>⚖️ تمارين الدانبل</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('cable')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1 ${
                      selectedCategory === 'cable'
                        ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                        : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                    }`}
                  >
                    <span>🔄 تمارين الكابل</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('machine')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1 ${
                      selectedCategory === 'machine'
                        ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800'
                        : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                    }`}
                  >
                    <span>🦾 الأجهزة</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('bodyweight')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1 ${
                      selectedCategory === 'bodyweight'
                        ? 'bg-neutral-800 text-neutral-200 font-bold border border-neutral-700'
                        : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                    }`}
                  >
                    <span>🤸 وزن الجسم</span>
                  </button>
                </div>

                {/* Muscle Group Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <span className="text-neutral-500 shrink-0 text-[10px]">العضلة:</span>
                  {[
                    { key: 'all', label: 'الكل' },
                    { key: 'الصدر', label: 'الصدر' },
                    { key: 'الظهر', label: 'الظهر' },
                    { key: 'الأكتاف', label: 'الأكتاف' },
                    { key: 'الأرجل', label: 'الأرجل' },
                    { key: 'البايسبس', label: 'البايسبس' },
                    { key: 'الترايسبس', label: 'الترايسبس' },
                  ].map(m => (
                    <button
                      key={m.key}
                      onClick={() => setSelectedMuscle(m.key)}
                      className={`px-2 py-0.5 rounded text-[10px] shrink-0 transition-colors ${
                        selectedMuscle === m.key
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-neutral-200 bg-neutral-950/40'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercises Grid List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
                {filteredExercises.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-950 border border-neutral-800 rounded-xl">
                    <p className="text-xs text-neutral-400 mb-2">لا توجد تمارين مطابقة لهذا البحث والتصفية.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedMuscle('all'); }}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      إعادة ضبط الفلاتر
                    </button>
                  </div>
                ) : (
                  filteredExercises.map(ex => {
                    const isSelected = selectedExercise?.id === ex.id;
                    const catBadge = 
                      ex.category === 'barbell' ? { label: 'بار', color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' } :
                      ex.category === 'dumbbell' ? { label: 'دانبل', color: 'text-blue-400 bg-blue-950/60 border-blue-800/60' } :
                      ex.category === 'cable' ? { label: 'كابل', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' } :
                      ex.category === 'machine' ? { label: 'جهاز', color: 'text-purple-400 bg-purple-950/60 border-purple-800/60' } :
                      { label: 'وزن جسم', color: 'text-neutral-400 bg-neutral-900 border-neutral-800' };

                    return (
                      <div
                        key={ex.id}
                        onClick={() => handleSelectExercise(ex)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-neutral-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                            : 'bg-neutral-950/70 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                            <img
                              src={ex.thumbnailUrl}
                              alt={ex.nameAr}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-xs font-bold text-white">{ex.nameAr}</h4>
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${catBadge.color}`}>
                                {catBadge.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-neutral-400 block line-clamp-1">
                              {ex.nameEn} · {ex.primaryMuscle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
                              ✓
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-400 px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
                              تحديد
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Selected Exercise Customizer (Sets, Reps, RPE, Notes) */}
            <div className="w-full md:w-80 p-4 bg-neutral-950/80 flex flex-col justify-between overflow-y-auto shrink-0">
              {selectedExercise ? (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-neutral-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                      التمرين المحدد:
                    </span>
                    <h4 className="text-sm font-bold text-white">{selectedExercise.nameAr}</h4>
                    <span className="text-[11px] text-neutral-400 block font-mono">
                      {selectedExercise.nameEn}
                    </span>
                    <span className="text-[11px] text-emerald-300 block mt-1">
                      {selectedExercise.primaryMuscle} · {selectedExercise.equipment}
                    </span>
                  </div>

                  {/* Execution cues snippet */}
                  <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-2.5 space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 block">نقاط التوجيه الحركي:</span>
                    {selectedExercise.executionCues.slice(0, 2).map((cue, i) => (
                      <p key={i} className="text-[10px] text-neutral-300 leading-snug">
                        • {cue}
                      </p>
                    ))}
                  </div>

                  {/* Set customizer if adding to day */}
                  {onAddExerciseToDay && (
                    <div className="space-y-3 bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تخصيص جولات التمرين:</span>
                      </span>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">عدد الجولات</label>
                          <input
                            type="number"
                            min="1"
                            max="8"
                            value={customSetsCount}
                            onChange={(e) => setCustomSetsCount(parseInt(e.target.value) || 1)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">العدات المستهدفة</label>
                          <input
                            type="text"
                            value={customReps}
                            onChange={(e) => setCustomReps(e.target.value)}
                            placeholder="مثلاً: 8-10 أو 12"
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">معدل الشدة (RPE)</label>
                          <input
                            type="number"
                            step="0.5"
                            min="6"
                            max="10"
                            value={customRpe}
                            onChange={(e) => setCustomRpe(parseFloat(e.target.value) || 8)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-400 block mb-1">الراحة (ثوانٍ)</label>
                          <input
                            type="number"
                            step="15"
                            min="30"
                            max="300"
                            value={customRest}
                            onChange={(e) => setCustomRest(parseInt(e.target.value) || 90)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">ملاحظة الكوتش للمتدرب (اختياري)</label>
                        <input
                          type="text"
                          value={customCoachNotes}
                          onChange={(e) => setCustomCoachNotes(e.target.value)}
                          placeholder="مثلاً: تركيز على النزول البطيء 3 ثوانٍ"
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-neutral-300"
                        />
                      </div>
                    </div>
                  )}

                  {onAddExerciseToDay ? (
                    <button
                      onClick={handleConfirmAddSelected}
                      className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-4"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة التمرين إلى {targetDayName || 'الجدول'}</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-400">
                      التمرين جاهز ومتاح للاستخدام في كافة الجداول التدريبية.
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <Info className="w-8 h-8 text-neutral-600 mb-2" />
                  <p className="text-xs">اختر تمريناً من القائمة لتخصيص جولاته وعداته وإضافته للجدول.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* TAB 2: CREATE CUSTOM EXERCISE FORM */
          <form onSubmit={handleCreateCustomExercise} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-300">حرية ومرونة كاملة لإضافة أي تمرين خاص</h4>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  يمكنك إنشاء تمرين بالبار أو الدمبل أو الكابل أو جهاز مخصص وحفظه دائماً في مكتبتك، وسيكون متاحاً لجميع المتدربين.
                </p>
              </div>
            </div>

            {createSuccessMsg && (
              <div className="p-3 bg-emerald-500 text-neutral-950 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>تم إنشاء التمرين وحفظه في المكتبة بنجاح! 👏</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-300 block mb-1">اسم التمرين بالعربي *</label>
                <input
                  type="text"
                  required
                  value={newExNameAr}
                  onChange={(e) => setNewExNameAr(e.target.value)}
                  placeholder="مثلاً: بنش برس قبضة واسعة بالبار"
                  className="w-full bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1">اسم التمرين بالإنجليزي</label>
                <input
                  type="text"
                  value={newExNameEn}
                  onChange={(e) => setNewExNameEn(e.target.value)}
                  placeholder="e.g. Wide Grip Barbell Bench Press"
                  className="w-full bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-neutral-300 block mb-1">نوع وفئة التمرين (Category)</label>
                <select
                  value={newExCategory}
                  onChange={(e) => setNewExCategory(e.target.value as ExerciseCategory)}
                  className="w-full bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-emerald-400 font-semibold"
                >
                  <option value="barbell">🏋️ تمارين البار (Barbell)</option>
                  <option value="dumbbell">⚖️ تمارين الدانبل (Dumbbell)</option>
                  <option value="cable">🔄 تمارين الكابل (Cable)</option>
                  <option value="machine">🦾 جهاز وماكينة (Machine)</option>
                  <option value="bodyweight">🤸 وزن الجسم (Bodyweight)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1">العضلة المستهدفة الأساسية</label>
                <input
                  type="text"
                  value={newExMuscle}
                  onChange={(e) => setNewExMuscle(e.target.value)}
                  placeholder="مثلاً: الصدر الأوسط، الظهر، البايسبس..."
                  className="w-full bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1">الأداة والمعدات المستخدمة</label>
                <input
                  type="text"
                  value={newExEquipment}
                  onChange={(e) => setNewExEquipment(e.target.value)}
                  placeholder="مثلاً: بار أولمبي، دمبل، كيبل..."
                  className="w-full bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-neutral-300 block mb-1">الجولات الافتراضية</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={newExSets}
                  onChange={(e) => setNewExSets(parseInt(e.target.value) || 3)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded-xl p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-300 block mb-1">العدات الافتراضية</label>
                <input
                  type="text"
                  value={newExReps}
                  onChange={(e) => setNewExReps(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded-xl p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-300 block mb-1">الراحة الافتراضية (ثانية)</label>
                <input
                  type="number"
                  min="30"
                  step="15"
                  value={newExRest}
                  onChange={(e) => setNewExRest(parseInt(e.target.value) || 90)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded-xl p-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-300 block mb-1">نقاط التوجيه والأداء الحركي (سطر لكل نقطة)</label>
              <textarea
                rows={3}
                value={newExCues}
                onChange={(e) => setNewExCues(e.target.value)}
                placeholder="تثبيت لوحي الكتف للخلف&#10;النزول بتحكم خلال ثانيتين&#10;الدفع بقوة وعصر العضلة المستهدفة"
                className="w-full bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 outline-none leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{onAddExerciseToDay ? `حفظ وإضافة إلى ${targetDayName || 'الجدول'}` : 'حفظ التمرين في المكتبة'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
