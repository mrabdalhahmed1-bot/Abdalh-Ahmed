import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { X, CheckCircle2, User, Award, Phone, Image as ImageIcon } from 'lucide-react';

interface CoachProfileModalProps {
  onClose: () => void;
}

export const CoachProfileModal: React.FC<CoachProfileModalProps> = ({ onClose }) => {
  const { coachInfo, updateCoachInfo } = useFitness();
  const [name, setName] = useState(coachInfo.name);
  const [title, setTitle] = useState(coachInfo.title);
  const [phone, setPhone] = useState(coachInfo.phone || '01068298126');
  const [avatar, setAvatar] = useState(coachInfo.avatar);
  const [coachUsername, setCoachUsername] = useState(coachInfo.username || 'coach');
  const [coachPin, setCoachPin] = useState(coachInfo.accessPin || '123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCoachInfo({
      name,
      title,
      phone,
      avatar,
      username: coachUsername.trim() || 'coach',
      accessPin: coachPin.trim() || '123456'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">تخصيص ملف المدرب (حسابك الشخصي)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">اسم الكوتش / المدرب *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: كوتش محمد الخالد"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">المسمى المهني والشهادات الرياضية</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مدرب معتمد دولياً (CSCS & CPT) ومختص تغذية رياضية"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">رقم الهاتف / واتساب المتابعة (للتواصل السريع)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01068298126"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              dir="ltr"
            />
          </div>

          {/* Coach Login Credentials Section */}
          <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3">
            <span className="text-xs font-bold text-amber-400 block">بيانات دخول المدرب (اسم المستخدم والرقم السري الخاص بك)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">اسم مستخدم المدرب (Username)</label>
                <input
                  type="text"
                  value={coachUsername}
                  onChange={(e) => setCoachUsername(e.target.value)}
                  placeholder="coach"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">الرقم السري للمدرب (PIN / كلمة المرور)</label>
                <input
                  type="text"
                  value={coachPin}
                  onChange={(e) => setCoachPin(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">رابط الصورة الشخصية (أو اتركها الافتراضية)</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ وتحديث الملف الشخصي</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
