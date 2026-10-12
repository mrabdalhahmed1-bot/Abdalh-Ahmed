import React, { useState } from 'react';
import { X, MessageSquare, Star, Send, CheckCircle2 } from 'lucide-react';

interface TraineeFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendFeedback: (text: string, rating: number) => void;
}

export const TraineeFeedbackModal: React.FC<TraineeFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSendFeedback
}) => {
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    onSendFeedback(feedbackText, rating);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">شاركنا رأيك وملاحظاتك</h3>
              <p className="text-[11px] text-neutral-400">رسالتك تصل مباشرة للمدرب لتطوير خطتك</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-white">شكراً لمشاركتك رأيك!</h4>
            <p className="text-xs text-neutral-400">
              تم إرسال ملاحظاتك وتقييمك بنجاح للمدرب.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2 text-center">
                تقييمك لبرنامج التدريب والتجربة:
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                ما الذي يعجبك أو ترغب في تعديله بالبرنامج؟
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                placeholder="اكتب ملاحظاتك بحرية (مثلاً: التمرين مناسب جداً، أحتاج بدائل لوجبة الغداء، طاقة التمرين ممتازة...)"
                className="w-full p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الرأي للمدرب</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
