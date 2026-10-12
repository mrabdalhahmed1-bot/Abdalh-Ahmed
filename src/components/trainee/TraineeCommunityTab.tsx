import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  Plus, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  X, 
  Image as ImageIcon,
  Sparkles,
  Send
} from 'lucide-react';

interface CommunityPost {
  id: number;
  author: string;
  role: string;
  avatar: string;
  timeAgo: string;
  text: string;
  imageUrl?: string;
  likes: number;
  isLiked: boolean;
  commentsCount: number;
}

export const TraineeCommunityTab: React.FC = () => {
  const { activeTrainee } = useFitness();
  const [subTab, setSubTab] = useState<'ideas' | 'challenges'>('ideas');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');

  // Sample dynamic community posts matching the video
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      author: 'أحمد جمال',
      role: 'Contributor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timeAgo: 'منذ يوم',
      text: '🥣 🥛 🍚 🥚 🍳 وجبة الفطور بعد تمرين الأرجل الصباحي.. التزام بالماكروز 100%!',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
      likes: 8,
      isLiked: false,
      commentsCount: 3
    },
    {
      id: 2,
      author: 'عبدالله قاسم',
      role: 'Trainee',
      avatar: activeTrainee.avatarUrl,
      timeAgo: 'منذ يومين',
      text: 'الحمد لله تم كسر رقم قياسي جديد في البنش برس اليوم 85 كغ لـ 8 تكرارات 💪🔥 شكراً للكوتش على التوجيهات الدقيقة في تكنيك النزول.',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      likes: 14,
      isLiked: true,
      commentsCount: 5
    }
  ]);

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        likes: p.isLiked ? p.likes - 1 : p.likes + 1,
        isLiked: !p.isLiked
      };
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newP = {
      id: Date.now(),
      author: activeTrainee.fullName,
      role: 'Trainee',
      avatar: activeTrainee.avatarUrl,
      timeAgo: 'الآن',
      text: newPostText,
      imageUrl: undefined,
      likes: 1,
      isLiked: true,
      commentsCount: 0
    };

    setPosts([newP, ...posts]);
    setNewPostText('');
    setIsNewPostOpen(false);
  };

  return (
    <div className="space-y-4 pb-24 text-neutral-100">
      
      {/* Header (Title "المجتمع" with "+" button on left) */}
      <div className="bg-neutral-900/90 rounded-2xl p-4 shadow-sm border border-neutral-800 flex items-center justify-between">
        <button
          onClick={() => setIsNewPostOpen(true)}
          className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-200 transition-colors cursor-pointer"
          title="نشر فكرة أو إنجاز جديد"
        >
          <Plus className="w-5 h-5 text-emerald-400" />
        </button>

        <h1 className="text-xl font-black text-white">
          مجتمع المتدربين
        </h1>
      </div>

      {/* Sub Tabs: "أفكار" and "تحديات" with emerald active indicator */}
      <div className="bg-neutral-900/80 rounded-xl shadow-xs border border-neutral-800 flex overflow-hidden">
        <button
          onClick={() => setSubTab('ideas')}
          className={`flex-1 py-3 text-xs font-bold transition-all relative ${
            subTab === 'ideas' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>أفكار وتجارب</span>
          {subTab === 'ideas' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setSubTab('challenges')}
          className={`flex-1 py-3 text-xs font-bold transition-all relative ${
            subTab === 'challenges' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>تحديات أسبوعية</span>
          {subTab === 'challenges' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content: أفكار (Posts Feed) */}
      {subTab === 'ideas' && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="bg-neutral-900/90 rounded-2xl p-5 shadow-xs border border-neutral-800 space-y-3"
            >
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-white">{post.author}</h4>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                        {post.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block">{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-xs text-neutral-200 leading-relaxed">
                {post.text}
              </p>

              {/* Optional Image */}
              {post.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-neutral-800 max-h-72 bg-neutral-950">
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Likes counter */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400 border-b border-neutral-800/80 pb-2">
                <span className="flex items-center gap-1 font-semibold text-neutral-300">
                  👍 {post.likes} إعجاب
                </span>
                <span>{post.commentsCount} تعليقات</span>
              </div>

              {/* Action Buttons (Like, Comment, Share) */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                    post.isLiked 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>إعجاب</span>
                </button>

                <button
                  onClick={() => alert('ميزة كتابة التعليق متاحة الآن.')}
                  className="py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تعليق</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('تم نسخ رابط المنشور للمشاركة!');
                  }}
                  className="py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tab Content: تحديات (Challenges) */}
      {subTab === 'challenges' && (
        <div className="space-y-3.5">
          {/* Challenge 1 */}
          <div className="bg-neutral-900/90 rounded-2xl p-5 shadow-xs border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">تحدي 10,000 خطوة يومياً</h4>
                  <span className="text-[10px] text-neutral-400">7 أيام متواصلة لزيادة الحرق</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                جاري الآن
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400 font-medium">
                <span>التقدم: 5 من 7 أيام</span>
                <span className="font-bold text-emerald-400">71%</span>
              </div>
              <div className="h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '71%' }} />
              </div>
            </div>
          </div>

          {/* Challenge 2 */}
          <div className="bg-neutral-900/90 rounded-2xl p-5 shadow-xs border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">تحدي الالتزام بالماكروز 100%</h4>
                  <span className="text-[10px] text-neutral-400">تحقيق هدف البروتين والسعرات بدون وجبات مفتوحة</span>
                </div>
              </div>
              <button 
                onClick={() => alert('تم الانضمام للتحدي بنجاح!')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                انضم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-xs font-black text-white">نشر في مجتمع المتدربين</h3>
              <button onClick={() => setIsNewPostOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="p-4 space-y-3">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="شارك وجبتك، رقمك القياسي الجديد، أو سؤالك الرياضي..."
                rows={4}
                className="w-full p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                نشر الآن
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
