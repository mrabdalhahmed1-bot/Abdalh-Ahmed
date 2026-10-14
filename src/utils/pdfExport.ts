/**
 * Professional PDF / Printable Document Generator for AQ Coaching
 * Generates an elegant, high-contrast, RTL-ready print view for mobile & desktop.
 */

export interface ExportPdfOptions {
  title: string;
  subtitle?: string;
  category: 'workout' | 'warmup' | 'mobility' | 'cardio' | 'diet';
  traineeName: string;
  coachName?: string;
  coachPhone?: string;
  targetGoal?: string;
  date?: string;
  items: Array<{
    title: string;
    subtitle?: string;
    details?: string[];
    badges?: string[];
  }>;
  summaryNotes?: string[];
}

export const exportProgramToPdf = (options: ExportPdfOptions) => {
  const {
    title,
    subtitle = '',
    category,
    traineeName,
    coachName = 'كوتش عبدالله قاسم (Abdullah Qasim)',
    coachPhone = '01068298126',
    targetGoal = '',
    date = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
    items,
    summaryNotes = []
  } = options;

  const categoryColor = 
    category === 'workout' ? '#10b981' :
    category === 'warmup' ? '#f59e0b' :
    category === 'mobility' ? '#8b5cf6' :
    category === 'cardio' ? '#06b6d4' :
    '#10b981';

  const categoryLabelAr = 
    category === 'workout' ? 'برنامج التمارين التفاعلي' :
    category === 'warmup' ? 'برنامج الإحماء الحركي والتأهيل' :
    category === 'mobility' ? 'برنامج المرونة والاستشفاء' :
    category === 'cardio' ? 'برنامج اللياقة والكارديو' :
    'الخطة الغذائية والماكروز';

  const itemsHtml = items.map((item, idx) => `
    <div class="item-card">
      <div class="item-header">
        <span class="item-number">${idx + 1}</span>
        <div class="item-title-box">
          <div class="item-title">${item.title}</div>
          ${item.subtitle ? `<div class="item-subtitle">${item.subtitle}</div>` : ''}
        </div>
        ${item.badges && item.badges.length > 0 ? `
          <div class="item-badges">
            ${item.badges.map(b => `<span class="badge">${b}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      ${item.details && item.details.length > 0 ? `
        <ul class="item-details">
          ${item.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');

  const summaryHtml = summaryNotes.length > 0 ? `
    <div class="summary-box">
      <div class="summary-title">💡 تعليمات وتوجيهات الكوتش:</div>
      <ul>
        ${summaryNotes.map(n => `<li>${n}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${traineeName} | AQ Coaching</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        body {
          background-color: #ffffff;
          color: #111827;
          padding: 24px;
          line-height: 1.5;
          font-size: 13px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid ${categoryColor};
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .brand-title {
          font-size: 24px;
          font-weight: 900;
          color: #047857;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
        }
        .meta-box {
          text-align: left;
          font-size: 12px;
          color: #374151;
        }
        .meta-box strong {
          color: #111827;
        }
        .badge-category {
          display: inline-block;
          background: ${categoryColor};
          color: #ffffff;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .trainee-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .trainee-info {
          display: flex;
          gap: 20px;
        }
        .info-pill {
          font-size: 12px;
        }
        .info-pill span {
          color: #6b7280;
        }
        .info-pill strong {
          color: #111827;
        }
        .section-title {
          font-size: 16px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .item-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px 14px;
          page-break-inside: avoid;
        }
        .item-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .item-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f3f4f6;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
          flex-shrink: 0;
        }
        .item-title-box {
          flex: 1;
        }
        .item-title {
          font-size: 13px;
          font-weight: 800;
          color: #111827;
        }
        .item-subtitle {
          font-size: 11px;
          color: #4b5563;
        }
        .item-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .badge {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
        }
        .item-details {
          margin-top: 8px;
          padding-right: 34px;
          font-size: 11px;
          color: #4b5563;
          list-style-type: square;
        }
        .item-details li {
          margin-bottom: 2px;
        }
        .summary-box {
          margin-top: 20px;
          background: #fefce8;
          border: 1px solid #fef08a;
          border-radius: 10px;
          padding: 14px;
          page-break-inside: avoid;
        }
        .summary-title {
          font-size: 12px;
          font-weight: 800;
          color: #854d0e;
          margin-bottom: 6px;
        }
        .summary-box ul {
          padding-right: 18px;
          font-size: 11px;
          color: #713f12;
        }
        .footer {
          margin-top: 30px;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
        }
        .btn-print {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: #059669;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 1000;
        }
        @media print {
          .btn-print {
            display: none !important;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <button class="btn-print" onclick="window.print()">
        <span>حفظ أو طباعة كـ PDF 📥</span>
      </button>

      <div class="header">
        <div>
          <span class="badge-category">${categoryLabelAr}</span>
          <div class="brand-title">AQ COACHING</div>
          <div class="brand-sub">إشراف وتدريب: ${coachName} · هاتف / واتساب: ${coachPhone}</div>
        </div>
        <div class="meta-box">
          <div><strong>التاريخ:</strong> ${date}</div>
          <div><strong>المستند:</strong> رسمي ومعتمد</div>
        </div>
      </div>

      <div class="trainee-card">
        <div class="trainee-info">
          <div class="info-pill">
            <span>اسم المتدرب: </span>
            <strong>${traineeName}</strong>
          </div>
          ${targetGoal ? `
            <div class="info-pill">
              <span>الهدف التدريبي: </span>
              <strong>${targetGoal}</strong>
            </div>
          ` : ''}
        </div>
        <div class="info-pill">
          <span>المنظومة: </span>
          <strong>تطبيق AQ Coaching PWA</strong>
        </div>
      </div>

      <div class="section-title">
        <span>📋 ${title}</span>
        ${subtitle ? `<span style="font-size: 12px; font-weight: normal; color: #6b7280;">(${subtitle})</span>` : ''}
      </div>

      <div class="items-list">
        ${itemsHtml}
      </div>

      ${summaryHtml}

      <div class="footer">
        <div>AQ Coaching © جميع الحقوق محفوظة لـ كوتش عبدالله قاسم</div>
        <div>صفحة رسمية مخصصة للمتدرب ${traineeName}</div>
      </div>

      <script>
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.focus();
            window.print();
          }, 300);
        });
      </script>
    </body>
    </html>
  `;

  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 1500);
      }, 500);
    }
  } catch (e) {
    console.error('PDF print generation error:', e);
  }
};
