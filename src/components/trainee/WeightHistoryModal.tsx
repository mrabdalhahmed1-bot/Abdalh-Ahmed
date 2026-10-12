import React, { useState } from 'react';
import { X, Scale, Plus, TrendingDown, Calendar, Check } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

interface WeightHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeightHistoryModal: React.FC<WeightHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeTrainee, updateTraineeProfile } = useFitness();
  const [newWeight, setNewWeight] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<'kg' | 'lbs'>('kg');
  const [recordedSuccessfully, setRecordedSuccessfully] = useState(false);

  if (!isOpen) return null;

  // Derive weights history from checkIns + starting weight
  const history = [
    { week: 'البداية', date: activeTrainee.startDate, weight: activeTrainee.startingWeightKg },
    ...activeTrainee.checkIns.map(c => ({
      week: `الأسبوع ${c.weekNumber}`,
      date: c.date,
      weight: c.weightKg
    }))
  ];

  const totalLoss = (activeTrainee.startingWeightKg - activeTrainee.currentWeightKg).toFixed(1);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (!val || val <= 0) return;

    updateTraineeProfile(activeTrainee.id, {
      currentWeightKg: val
    });

    setRecordedSuccessfully(true);
    setNewWeight('');
    setTimeout(() => setRecordedSuccessfully(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">سجل وتطور الوزن</h3>
              <p className="text-[11px] text-neutral-400">تسجيل وزن الصباح ومتابعة منحنى النتائج</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Summary Banner */}
        <div className="p-5 bg-gradient-to-r from-neutral-950 via-emerald-950/80 to-neutral-950 border-b border-neutral-800 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block">الوزن الحالي</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-white">{activeTrainee.currentWeightKg}</span>
              <span className="text-xs font-bold text-neutral-400">كغ</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-neutral-400 block">المستهدف</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-emerald-400">{activeTrainee.targetWeightKg}</span>
              <span className="text-xs font-bold text-neutral-400">كغ</span>
            </div>
          </div>

          <div className="text-left bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">إجمالي النزول</span>
            <span className="text-base font-black text-emerald-400">📉 {totalLoss} كغ</span>
          </div>
        </div>

        {/* New Weight Entry Form */}
        <form onSubmit={handleAddWeight} className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="أدخل وزنك اليوم (كغ)..."
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-800 text-xs bg-neutral-900 text-white focus:outline-none focus:border-emerald-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>تسجيل</span>
          </button>
        </form>

        {recordedSuccessfully && (
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center border-b border-emerald-500/40 flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>تم تحديث وزنك الحالي بنجاح!</span>
          </div>
        )}

        {/* History List */}
        <div className="p-5 space-y-2.5 max-h-[300px] overflow-y-auto">
          <span className="text-xs font-bold text-neutral-400 block mb-2">سجل القياسات السابقة:</span>
          {history.map((item, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 font-bold text-[11px] border border-neutral-800">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-bold text-white block">{item.week}</span>
                  <span className="text-[10px] text-neutral-400">{item.date}</span>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {item.weight} كغ
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
