# AQ Coaching App 🏋️‍♂️⚡

تطبيق إدارة التدريب الرياضي والمتابعة المتكامل **AQ Coaching** المبني باستخدام React 19، Vite، Tailwind CSS، ودعم PWA الكامل.

---

## ⚡ التشغيل السريع على Bolt.new

1. ادخل إلى [Bolt.new](https://bolt.new).
2. اسحب وأفلت (Drag & Drop) ملف `bolt-aq-coaching.zip` مباشرة في المتصفح، أو اختر **Upload Project**.
3. سيتعرف Bolt.new تلقائياً على بيئة `Vite + React` ويقوم بتثبيت التبعيات وتشغيل خادم التطوير فوراً.

أو إذا كان مشروعك على GitHub:
- افتح في المتصفح: `https://bolt.new/github/<your-username>/<your-repo-name>`

---

## 🚀 النشر على Vercel

المشروع جاهز تماماً للنشر على Vercel:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- تم تضمين ملف `_redirects` و `public/_redirects` لضمان عمل توجيه مسارات الـ SPA بسلاسة.

---

## 💻 التشغيل المحلي (Local Development)

```bash
# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev

# بناء النسخة الإنتاجية
npm run build
```

---

## 📁 هيكلية المشروع
- `src/` : مكونات React، الصفحات، الواجهات، وإدارة الحالة.
- `public/` : الأصول العامة، أيقونات PWA، ملف `sw.js`، وملف `_redirects`.
- `index.html` : نقطة الدخول الرئيسية وتجهيزات الـ PWA.
- `vite.config.ts` : إعدادات Vite ومكونات الـ PWA وخادم التطوير.
