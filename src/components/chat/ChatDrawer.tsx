import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  X, 
  Send, 
  Mic, 
  Play, 
  Pause, 
  Dumbbell, 
  Sparkles,
  Paperclip,
  CheckCheck
} from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    userRole, 
    currentTraineeId, 
    activeTrainee, 
    coachInfo, 
    messages, 
    sendMessage 
  } = useFitness();

  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter messages for current trainee
  const traineeMessages = messages.filter(m => m.traineeId === currentTraineeId);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(currentTraineeId, inputText.trim());
    setInputText('');

    // Simulate smart partner reply after 1.2 seconds if it's the trainee writing to coach or coach to trainee
    setTimeout(() => {
      if (userRole === 'trainee') {
        sendMessage(
          currentTraineeId,
          'تم استلام رسالتك يا بطل! استمر على نفس الجدول، وإذا حسيت بأي إجهاد في أسفل الظهر خفف وزن الرفعة الميتة 5 كغ وركز على التحكم الحركي. معك خطوة بخطوة 🚀'
        );
      } else {
        sendMessage(
          currentTraineeId,
          'تسلم يا كوتش! واضحة التوجيهات وجاهز للتطبيق بإذن الله 🔥'
        );
      }
    }, 1500);
  };

  const handleSendVoiceNote = () => {
    sendMessage(
      currentTraineeId,
      '🎙️ رسالة صوتية مسجلة',
      true,
      '0:42'
    );
  };

  const quickReplies = userRole === 'coach' ? [
    'عاش يا بطل! استمرارية ممتازة 💪',
    'التزم بإنهاء حصة الماء اليوم كاملة 💧',
    'أرسل لي فيديو لأدائك في جولة السكوات القادمة',
    'ممتاز، ارفع الوزن الأسبوع القادم 2.5 كغ 🎯'
  ] : [
    'كوتش، أداء اليوم كان ممتاز وكسرت وزني السابق! 🔥',
    'أحتاج توجيهك بخصوص وجبة قبل التمرين',
    'أرسلت تقرير المتابعة الأسبوعية بانتظار مراجعتك 📋',
    'تم إنهاء التمرين والخطوات 10 آلاف خطوة اليوم ✅'
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-96 bg-neutral-900 border-r border-neutral-800 shadow-2xl flex flex-col text-neutral-100 animate-in slide-in-from-left duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userRole === 'coach' ? activeTrainee.avatarUrl : coachInfo.avatar}
            alt="Recipient"
            className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-sm font-bold text-white">
              {userRole === 'coach' ? activeTrainee.fullName : coachInfo.name}
            </h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>متصل الآن</span>
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-950/40">
        {traineeMessages.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">
            لا توجد رسائل سابقة. ابدأ المحادثة الآن!
          </div>
        ) : (
          traineeMessages.map((msg) => {
            const isMe = msg.senderRole === userRole;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
              >
                <span className="text-[10px] text-neutral-500 mb-1 px-1">
                  {msg.senderName}
                </span>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-neutral-800 text-neutral-200 border border-neutral-700/60 rounded-tl-none'
                  }`}
                >
                  {msg.isAudio ? (
                    <div className="flex items-center gap-3 min-w-[170px]">
                      <button
                        onClick={() => setIsPlayingAudio(isPlayingAudio === msg.id ? null : msg.id)}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors"
                      >
                        {isPlayingAudio === msg.id ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-white rounded-full ${
                              isPlayingAudio === msg.id ? 'w-2/3 transition-all duration-1000' : 'w-0'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] opacity-80 mt-1 block font-mono">
                          {msg.audioDuration || '0:35'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{msg.text}</p>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 opacity-75 text-[10px] font-mono">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3 h-3 text-emerald-200" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Reply Chips */}
      <div className="p-2 border-t border-neutral-800 bg-neutral-900/60 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => setInputText(reply)}
            className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] whitespace-nowrap transition-colors border border-neutral-700/60"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSendVoiceNote}
          className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400 border border-neutral-800 transition-colors"
          title="إرسال مقطع صوتي"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-neutral-950 font-bold transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
