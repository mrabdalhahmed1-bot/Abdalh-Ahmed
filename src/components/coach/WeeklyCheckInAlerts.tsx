import React, { useState, useEffect } from 'react';
import { TraineeProfile, WeeklyCheckIn } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Share2, 
  MessageSquare, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  ExternalLink,
  Flame,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface WeeklyCheckInAlertsProps {
  trainees: TraineeProfile[];
  onSelectTrainee: (trainee: TraineeProfile) => void;
  onFilterMissingInDirectory?: () => void;
}

export interface MissingCheckInInfo {
  trainee: TraineeProfile;
  expectedWeek: number;
  daysSinceLastCheckIn: number;
  daysOverdue: number;
  urgency: 'critical' | 'overdue' | 'due_today';
  lastCheckIn: WeeklyCheckIn | null;
  lastDateFormatted: string;
}

const STORAGE_KEY_REMINDERS = 'modarribi_reminded_trainees_v1';

export const WeeklyCheckInAlerts: React.FC<WeeklyCheckInAlertsProps> = ({
  trainees,
  onSelectTrainee,
  onFilterMissingInDirectory
}) => {
  const { coachInfo, sendMessage } = useFitness();
  const [isExpanded, setIsExpanded] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Track reminded timestamps by traineeId
  const [remindedMap, setRemindedMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REMINDERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Save reminded status to localStorage
  const markAsReminded = (traineeId: string, channel: 'whatsapp' | 'chat') => {
    const timeStr = new Intl.DateTimeFormat('ar-SA', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date());
    
    const label = channel === 'whatsapp' ? `واتساب (${timeStr})` : `التطبيق (${timeStr})`;
    const updated = { ...remindedMap, [traineeId]: label };
    setRemindedMap(updated);
    try {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(updated));
    } catch {}
  };

  // Toast banner auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Reference date: current system date
  const now = new Date();

  // Compute trainees who haven't submitted their weekly check-in yet
  const missingCheckIns: MissingCheckInInfo[] = trainees.reduce<MissingCheckInInfo[]>((acc, trainee) => {
    // If the trainee already has an unreviewed pending check-in, they HAVE submitted their data
    const hasPendingReview = trainee.checkIns.some(c => c.status === 'pending');
    if (hasPendingReview) {
      return acc;
    }

    // Sort check-ins to find the latest
    const sortedCheckIns = [...trainee.checkIns].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latest = sortedCheckIns[0] || null;

    let daysSinceLast = 0;
    let expectedWeek = 1;
    let lastDateFormatted = 'لم يرسل أي تقرير بعد';

    if (latest) {
      const lastDate = new Date(latest.date);
      daysSinceLast = Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));
      expectedWeek = latest.weekNumber + 1;
      lastDateFormatted = `الأسبوع ${latest.weekNumber} (${latest.date})`;
    } else {
      // New trainee without check-in: calculate from startDate
      const startDate = trainee.startDate ? new Date(trainee.startDate) : new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      daysSinceLast = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      expectedWeek = 1;
      lastDateFormatted = `انضم في ${trainee.startDate || 'بداية البرنامج'}`;
    }

    // Weekly cycle standard is 7 days.
    // If >= 7 days or if marked 'pending_checkin', trainee needs to submit!
    const isDueOrOverdue = daysSinceLast >= 7 || trainee.status === 'pending_checkin';

    if (isDueOrOverdue) {
      const daysOverdue = Math.max(0, daysSinceLast - 7);
      let urgency: 'critical' | 'overdue' | 'due_today' = 'due_today';
      if (daysOverdue >= 3) {
        urgency = 'critical';
      } else if (daysOverdue >= 1) {
        urgency = 'overdue';
      }

      acc.push({
        trainee,
        expectedWeek,
        daysSinceLastCheckIn: daysSinceLast,
        daysOverdue,
        urgency,
        lastCheckIn: latest,
        lastDateFormatted
      });
    }

    return acc;
  }, []);

  // Sort by highest overdue first
  missingCheckIns.sort((a, b) => b.daysSinceLastCheckIn - a.daysSinceLastCheckIn);

  // Send WhatsApp Reminder
  const handleSendWhatsAppReminder = (item: MissingCheckInInfo) => {
    const cleanPhone = item.trainee.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `مرحباً يا ${item.trainee.fullName} 💪\nمعك ${coachInfo.name} من منصة التدريب الرياضي.\n\nتذكير ودي بضرورة تسجيل وإرسال التقييم الأسبوعي (الأسبوع ${item.expectedWeek}) في التطبيق:\n- تسجيل الوزن الحالي صباحاً على الريق\n- قياس محيط الخصر\n- صور التطور ونسبة الالتزام بالدايت والتمرين\n\nبانتظار تقريرك لنراجع التطور ونضبط خطتك للأسبوع القادم. عاش يا بطل! 🚀`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    markAsReminded(item.trainee.id, 'whatsapp');
    setToastMessage(`تم فتح واتساب لإرسال تذكير التقييم الأسبوعي إلى ${item.trainee.fullName} 📲`);
  };

  // Send In-App Chat Reminder
  const handleSendChatReminder = (item: MissingCheckInInfo) => {
    const text = `🔔 تذكير بمتابعة التقييم الأسبوعي (الأسبوع ${item.expectedWeek}):\nمرحباً يا ${item.trainee.fullName}، نذكرك بضرورة تسجيل وزنك ومقاساتك وصور التقدم في صفحة "المتابعة والتقارير" داخل التطبيق لنقوم بمراجعتها وتعديل السعرات وبرنامج التمرين.`;
    sendMessage(item.trainee.id, text);
    markAsReminded(item.trainee.id, 'chat');
    setToastMessage(`تم إرسال تذكير التقييم الأسبوعي داخل المحادثة إلى ${item.trainee.fullName} بنجاح ✅`);
  };

  // Batch In-App Reminder
  const handleBatchChatReminder = () => {
    if (missingCheckIns.length === 0) return;
    
    missingCheckIns.forEach(item => {
      const text = `🔔 تذكير بمتابعة التقييم الأسبوعي (الأسبوع ${item.expectedWeek}):\nمرحباً يا ${item.trainee.fullName}، نذكرك بضرورة رفع تقريرك الأسبوعي في التطبيق لنتمكن من مراجعة نتائجك وتحديث خطتك.`;
      sendMessage(item.trainee.id, text);
      markAsReminded(item.trainee.id, 'chat');
    });

    setToastMessage(`تم إرسال تذكيرات التقييم الأسبوعي لجميع المتدربين المتأخرين (${missingCheckIns.length}) بنجاح! 📨`);
  };

  return (
    <div className="rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-950/25 via-neutral-900 to-neutral-950 p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all">
      {/* Decorative subtle ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="mb-4 p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white text-xs px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header of Alerts System */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>تنبيهات التقييم الأسبوعي</span>
                <span className="text-[11px] font-semibold text-neutral-400">· متابعة المتأخرين</span>
              </h2>
              {missingCheckIns.length > 0 ? (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 shadow-sm animate-pulse">
                  {missingCheckIns.length} لم يرسلوا بياناتهم بعد
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  كافة المتدربين ملتزمون ✅
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              تذكير المدرب بضرورة مراجعة ومتابعة المتدربين المتأخرين عن إرسال قياسات الوزن والصور الأسبوعية لضمان استمرارية النتائج.
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {missingCheckIns.length > 0 && (
            <button
              onClick={handleBatchChatReminder}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
              title="إرسال رسائل تذكير داخلية لجميع المتأخرين بنقرة واحدة"
            >
              <Send className="w-3.5 h-3.5" />
              <span>تذكير جماعي في التطبيق</span>
            </button>
          )}

          {onFilterMissingInDirectory && missingCheckIns.length > 0 && (
            <button
              onClick={onFilterMissingInDirectory}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium border border-neutral-700 transition-colors"
              title="عرض المتأخرين فقط في قائمة المتدربين"
            >
              <span>تصفية بالقائمة</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg transition-colors"
            title={isExpanded ? 'طي التنبيهات' : 'توسيع التنبيهات'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content View */}
      {isExpanded && (
        <div className="pt-4">
          {missingCheckIns.length === 0 ? (
            /* Empty State: All trainees are up to date */
            <div className="p-8 text-center bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">ممتاز يا كوتش! جميع المتدربين أرسلوا تقاريرهم</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                لا يوجد أي متدرب متأخر عن موعد التقييم الأسبوعي حالياً. كل المشتركين مواظبون على تسجيل بياناتهم في مواعيدها.
              </p>
            </div>
          ) : (
            /* Trainees Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {missingCheckIns.map((item) => {
                const isReminded = !!remindedMap[item.trainee.id];
                const remindedInfo = remindedMap[item.trainee.id];

                return (
                  <div
                    key={item.trainee.id}
                    className={`bg-neutral-950/90 rounded-xl p-4 border transition-all flex flex-col justify-between shadow-md ${
                      item.urgency === 'critical'
                        ? 'border-rose-500/40 hover:border-rose-500/60'
                        : item.urgency === 'overdue'
                        ? 'border-amber-500/40 hover:border-amber-500/60'
                        : 'border-yellow-500/30 hover:border-yellow-500/50'
                    }`}
                  >
                    <div>
                      {/* Trainee Top Info */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.trainee.avatarUrl}
                            alt={item.trainee.fullName}
                            className="w-11 h-11 rounded-xl object-cover border border-neutral-700"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm">{item.trainee.fullName}</h4>
                            <span className="text-[11px] text-neutral-400 font-mono block">
                              {item.trainee.phone}
                            </span>
                          </div>
                        </div>

                        {/* Urgency Badge */}
                        <div className="text-left shrink-0">
                          {item.urgency === 'critical' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-300 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              <span>متأخر {item.daysOverdue} أيام</span>
                            </span>
                          ) : item.urgency === 'overdue' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>متأخر {item.daysOverdue === 1 ? 'يوم واحد' : `${item.daysOverdue} يومين`}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-yellow-300 bg-yellow-950/80 border border-yellow-800/80 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3 text-yellow-400" />
                              <span>مستحق اليوم</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Goal & Required Check-in Details */}
                      <p className="text-[11px] text-neutral-300 mb-3 line-clamp-1">
                        🎯 {item.trainee.goalTitle}
                      </p>

                      <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800 mb-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400">التقرير المطلوب:</span>
                          <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
                            تقرير الأسبوع {item.expectedWeek}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400">آخر تقرير مسجل:</span>
                          <span className="text-white font-mono text-[11px]">{item.lastDateFormatted}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400">المدة المنقضية:</span>
                          <span className="font-semibold text-neutral-200">
                            منذ {item.daysSinceLastCheckIn} يوماً
                          </span>
                        </div>
                      </div>

                      {/* Reminder status badge if coach already reminded */}
                      {isReminded && (
                        <div className="mb-3 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/50 rounded-lg flex items-center gap-1.5 text-[11px] text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>تم التذكير اليوم: {remindedInfo}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for this trainee */}
                    <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* WhatsApp Reminder */}
                        <button
                          onClick={() => handleSendWhatsAppReminder(item)}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all shadow-sm"
                          title="إرسال رسالة تذكير مخصصة عبر واتساب"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تذكير واتساب 📲</span>
                        </button>

                        {/* In-App Chat Reminder */}
                        <button
                          onClick={() => handleSendChatReminder(item)}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg text-xs font-semibold transition-colors"
                          title="إرسال رسالة تذكير مباشرة في محادثة التطبيق"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                          <span>تذكير بالتطبيق 💬</span>
                        </button>
                      </div>

                      {/* Profile Overview Link */}
                      <button
                        onClick={() => onSelectTrainee(item.trainee)}
                        className="w-full py-1.5 text-center text-neutral-400 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        <span>فتح ملف المتدرب ومراجعة أهدافه</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
