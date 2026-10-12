import React from 'react';
import { X, BookOpen, AlertCircle, Dumbbell, Pill, ShieldCheck, Flame, Moon } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

interface ProgramInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProgramInstructionsModal: React.FC<ProgramInstructionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeTrainee, coachInfo } = useFitness();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-emerald-950/80 to-neutral-950 p-6 text-white relative border-b border-neutral-800">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-black text-white">تعليمات برنامجك التدريبي والغذائي</h3>
          <p className="text-neutral-400 text-xs mt-1">
            القواعد الذهبية لضمان تحقيق أفضل نتيجة بإشراف {coachInfo.name}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto text-xs leading-relaxed">
          
          {/* Rule 1: Progressive Overload & RPE */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>1. الزيادة التدريجية ومفهوم RPE</span>
            </div>
            <p className="text-neutral-300">
              الهدف الأساسي هو الزيادة الدورية إما بزيادة الوزن بمقدار بسيط (1 - 2.5 كغ) أو زيادة التكرارات بنفس الوزن طالما كان الأداء الحركي صحيحاً بنسبة 100%. احرص أن تترك عدة أو عدتين في الاحتياط (RPE 8-9) دون الوصول للفشل العضلي المؤذي.
            </p>
          </div>

          {/* Rule 2: Water & Hydration */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Flame className="w-4 h-4 text-sky-400" />
              <span>2. شرب الماء والترطيب أثناء التمرين</span>
            </div>
            <p className="text-neutral-300">
              هدفنا الأدنى هو 3 لترات ماء يومياً. اشرب ما بين 500 إلى 750 مل قبل التمرين بـ 45 دقيقة، ورشفات ماء منتظمة بين الجولات لتفادي الهبوط والشد العضلي.
            </p>
          </div>

          {/* Rule 3: Supplements */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Pill className="w-4 h-4 text-amber-400" />
              <span>3. بروتوكول المكملات المعتمدة</span>
            </div>
            <p className="text-neutral-300">
              • كرياتين مونوهيدرات: 5 غرام يومياً في نفس الموعد باستمرار.
              <br />
              • واي بروتين: سكوب بعد التمرين مباشرة أو عند الحاجة لإكمال احتياج البروتين.
              <br />
              • أوميجا 3 وفيتامين D3 مع الوجبة التي تحتوي على دهون صحية.
            </p>
          </div>

          {/* Rule 4: Sleep & Recovery */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>4. النوم والاستشفاء العضلي</span>
            </div>
            <p className="text-neutral-300">
              البناء العضلي وحرق الدهون يحدثان أثناء النوم العميق وليس في النادي. احرص على نوم 7 إلى 8 ساعات في غرفة مظلمة وباردة، وأوقف الشاشات قبل النوم بنصف ساعة.
            </p>
          </div>

          {/* Rule 5: Weekly Check-In */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>5. التقييم الأسبوعي (Check-in)</span>
            </div>
            <p className="text-neutral-300">
              سجل وزنك أسبوعياً صباح يوم التقييم على الريق بعد دخول الحمام مباشرة، مع التقاط صور التطور بنفس الإضاءة لنقوم بتحديث السعرات وجدول التمارين.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            فهمت التعليمات وسألتزم بها 💪
          </button>
        </div>

      </div>
    </div>
  );
};
