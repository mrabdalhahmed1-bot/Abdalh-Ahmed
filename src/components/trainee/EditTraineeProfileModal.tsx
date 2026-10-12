import React, { useState } from 'react';
import { X, User, Check, Scale, Ruler, Target } from 'lucide-react';
import { TraineeProfile } from '../../types/fitness';

interface EditTraineeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: TraineeProfile;
  onSave: (updates: Partial<TraineeProfile>) => void;
}

export const EditTraineeProfileModal: React.FC<EditTraineeProfileModalProps> = ({
  isOpen,
  onClose,
  trainee,
  onSave
}) => {
  const [fullName, setFullName] = useState(trainee.fullName);
  const [currentWeightKg, setCurrentWeightKg] = useState(trainee.currentWeightKg);
  const [targetWeightKg, setTargetWeightKg] = useState(trainee.targetWeightKg);
  const [heightCm, setHeightCm] = useState(trainee.heightCm);
  const [goalTitle, setGoalTitle] = useState(trainee.goalTitle);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      fullName,
      currentWeightKg: Number(currentWeightKg),
      targetWeightKg: Number(targetWeightKg),
      heightCm: Number(heightCm),
      goalTitle
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">تعديل ملفك الرياضي</h3>
              <p className="text-[11px] text-neutral-400">تحديث بيانات الطول، الوزن الحالي، وهدفك</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5">الاسم بالكامل</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-neutral-400" />
                الوزن الحالي (كغ)
              </label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-neutral-400" />
                الوزن المستهدف (كغ)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5 flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-neutral-400" />
              الطول (سم)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5">عنوان الهدف التدريبي</label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-emerald-500"
              placeholder="مثال: تنشيف وخسارة دهون مع زيادة الكتلة العضلية"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </form>

      </div>
    </div>
  );
};
