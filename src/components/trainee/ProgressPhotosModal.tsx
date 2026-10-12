import React, { useState } from 'react';
import { X, Image as ImageIcon, Camera, Upload, CheckCircle2 } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

interface ProgressPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProgressPhotosModal: React.FC<ProgressPhotosModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeTrainee } = useFitness();
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'side' | 'back'>('front');

  if (!isOpen) return null;

  // Derive photos from checkIns
  const photos = activeTrainee.checkIns
    .filter(c => c.photoFrontUrl || c.photoBackUrl)
    .map(c => ({
      week: `الأسبوع ${c.weekNumber}`,
      date: c.date,
      photos: [
        c.photoFrontUrl,
        c.photoSideUrl,
        c.photoBackUrl
      ].filter(Boolean) as string[]
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">معرض صور التطور (Progress Photos)</h3>
              <p className="text-[11px] text-neutral-400">مقارنة الصور أسبوعياً لملاحظة التغير العضلي والشكل</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          
          {/* Tip Notice */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
            💡 <strong className="text-emerald-400">نصيحة الكوتش:</strong> التقط الصور دائماً بنفس الإضاءة، بنفس المسافة من الكاميرا، وصباحاً على الريق بعد دخول الحمام للحصول على أدق مقارنة لتطور شكل العضلات ونسبة الدهون.
          </div>

          {/* Photos Stream */}
          {photos.length > 0 ? (
            <div className="space-y-6">
              {photos.map((entry, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-white">{entry.week}</span>
                    <span className="text-[10px] text-neutral-400">{entry.date}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {entry.photos.map((p, pIdx) => (
                      <div key={pIdx} className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-sm relative group">
                        <img 
                          src={p} 
                          alt="Progress" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-neutral-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {pIdx === 0 ? 'أمامي' : pIdx === 1 ? 'جانبي' : 'خلفي'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 mx-auto flex items-center justify-center text-neutral-500">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-200">لا توجد صور مسجلة حتى الآن</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                يمكنك إرفاق صور التطور (أمامي، جانبي، خلفي) بسهولة أثناء إرسال التقييم الأسبوعي (Weekly Check-in).
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق المعرض
          </button>
        </div>

      </div>
    </div>
  );
};
