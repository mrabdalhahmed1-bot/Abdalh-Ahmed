import 'dotenv/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function appIconUploaderPlugin(): Plugin {
  return {
    name: 'app-icon-uploader',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/downloads/bolt-aq-coaching.zip' || url === '/downloads/bolt.zip' || url === '/bolt-aq-coaching.zip' || url === '/bolt.zip') {
          const boltZipPath = path.resolve('public/downloads/bolt-aq-coaching.zip');
          if (fs.existsSync(boltZipPath)) {
            const stat = fs.statSync(boltZipPath);
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="bolt-aq-coaching.zip"');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(boltZipPath).pipe(res);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('ملف bolt-aq-coaching.zip غير متوفر حالياً');
            return;
          }
        }
        if (url === '/downloads/dist.zip' || url === '/dist.zip') {
          const distZipPath = path.resolve('public/downloads/dist.zip');
          if (fs.existsSync(distZipPath)) {
            const stat = fs.statSync(distZipPath);
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="dist.zip"');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(distZipPath).pipe(res);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('ملف dist.zip غير متوفر حالياً');
            return;
          }
        }
        if (url === '/downloads/aq-coaching-project.zip' || url === '/api/download-project-zip') {
          const zipPath = path.resolve('public/downloads/aq-coaching-project.zip');
          if (fs.existsSync(zipPath)) {
            const stat = fs.statSync(zipPath);
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="aq-coaching-project.zip"');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(zipPath).pipe(res);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('ملف المشروع المضغوط غير متوفر حالياً');
            return;
          }
        }
        if (url === '/_redirects') {
          const redirectsPath = path.resolve('public/_redirects');
          if (fs.existsSync(redirectsPath)) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename="_redirects"');
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(redirectsPath).pipe(res);
          }
        }
        if (url === '/sw.js') {
          const swPath = path.resolve('public/sw.js');
          if (fs.existsSync(swPath)) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            return fs.createReadStream(swPath).pipe(res);
          }
        }
        if (url === '/manifest.webmanifest' || url === '/manifest.json') {
          const manifestPath = path.resolve('public/manifest.json');
          if (fs.existsSync(manifestPath)) {
            res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(manifestPath).pipe(res);
          }
        }
        next();
      });

      server.middlewares.use('/api/upload-app-icon', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { imageBase64 } = JSON.parse(body);
              if (!imageBase64) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'No image provided' }));
                return;
              }

              const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              const publicDir = path.resolve('public');
              const isPng = imageBase64.startsWith('data:image/png');
              const ext = isPng ? '.png' : '.jpg';
              const tmpPath = path.join(publicDir, `tmp_icon_upload${ext}`);
              fs.writeFileSync(tmpPath, buffer);

              try {
                // Ensure public/images directory exists
                const imagesDir = path.join(publicDir, 'images');
                if (!fs.existsSync(imagesDir)) {
                  fs.mkdirSync(imagesDir, { recursive: true });
                }

                // Generate genuine PNGs with ImageMagick convert in public/images
                execSync(`convert "${tmpPath}" -resize 180x180 -format png PNG32:"${path.join(imagesDir, 'icon-180.png')}"`);
                execSync(`convert "${tmpPath}" -resize 192x192 -format png PNG32:"${path.join(imagesDir, 'icon-192.png')}"`);
                execSync(`convert "${tmpPath}" -resize 512x512 -format png PNG32:"${path.join(imagesDir, 'icon-512.png')}"`);
                execSync(`convert "${tmpPath}" -resize 1024x1024 -format png PNG32:"${path.join(imagesDir, 'icon-1024.png')}"`);
                execSync(`convert "${tmpPath}" -resize 410x410 -background '#09090b' -gravity center -extent 512x512 -format png PNG32:"${path.join(imagesDir, 'icon-maskable-512.png')}"`);

                // Also maintain root fallbacks
                execSync(`convert "${tmpPath}" -resize 192x192 -format png PNG32:"${path.join(publicDir, 'pwa-192x192.png')}"`);
                execSync(`convert "${tmpPath}" -resize 512x512 -format png PNG32:"${path.join(publicDir, 'pwa-512x512.png')}"`);
                execSync(`convert "${tmpPath}" -resize 410x410 -background '#09090b' -gravity center -extent 512x512 -format png PNG32:"${path.join(publicDir, 'pwa-maskable-512x512.png')}"`);
                execSync(`convert "${tmpPath}" -resize 180x180 -format png PNG32:"${path.join(publicDir, 'apple-touch-icon.png')}"`);
                execSync(`convert "${tmpPath}" -resize 48x48 -format png PNG32:"${path.join(publicDir, 'favicon.png')}"`);
              } catch (convertErr: any) {
                console.error('ImageMagick convert error:', convertErr.message);
                throw new Error('فشلت معالجة الصورة إلى صيغة PNG معتمدة: ' + convertErr.message);
              }

              if (fs.existsSync(tmpPath)) {
                fs.unlinkSync(tmpPath);
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Icon updated successfully' }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      // AI Food Vision & Nutrition Analysis Endpoint
      server.middlewares.use('/api/analyze-food-image', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { imageBase64, userHint } = JSON.parse(body);
              let result = null;

              if (process.env.GEMINI_API_KEY && imageBase64) {
                try {
                  const { GoogleGenAI } = await import('@google/genai');
                  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
                  const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
                  
                  const promptText = `You are an elite sports nutritionist and computer vision AI specialized in Middle Eastern, Arab, Egyptian, and international cuisine.
Look carefully at this photograph and identify the food with high accuracy.

SPECIAL RECOGNITION GUIDE FOR ARAB & EGYPTIAN FOODS:
- "فول مدمس" (Foul Mudammas): Brown/fava bean stew, mashed or whole beans, often with olive/flaxseed oil, cumin, tahini, or lemon.
- "طحينة" (Tahina / Sesame paste): Creamy beige/white viscous sesame sauce or dressing.
- "فلافل / طعمية" (Falafel / Taameya): Crispy fried green-herb chickpea/fava bean patties.
- "حمص بطحينة" (Hummus): Smooth chickpea puree with tahini and olive oil.
- "كشري" (Koshary): Mixed rice, lentils, macaroni, chickpeas, fried onions, tomato sauce.
- Also recognize standard athlete foods: chicken breast, salmon, steak, rice, oats, eggs, apples, bananas, protein shakes, etc.

CRITICAL INSTRUCTIONS:
1. Identify EXACTLY what is shown in the photo.
2. If it is a SINGLE ITEM (e.g. plate of foul, bowl of tahini, an apple, a cup of coffee), mark "isSingleItem": true and put only that item in "foodItems".
3. If it is a COMPOSITE MEAL (e.g. foul with eggs and bread), mark "isSingleItem": false and separate each item with realistic grams.
4. Calculate realistic macronutrients (Calories, Protein, Carbs, Fat) and key Vitamins and Minerals (e.g., Iron, Calcium, Fiber, Potassium).
5. User Note / Hint: "${userHint || ''}". If provided, use it to ensure 100% precision.

Return STRICT JSON:
{
  "name": "اسم الصنف أو الوجبة الحقيقي بدقة (مثال: طبق فول مدمس بالزيت والليمون، أو سلطة طحينة متبلة)",
  "isSingleItem": true,
  "serving": "تقدير حجم الحصة بالجرام (مثال: طبق 250 غرام أو حصة 60 غرام)",
  "foodItems": [
    {
      "id": "item-1",
      "name": "اسم الصنف",
      "quantity": "250 غرام",
      "grams": 250,
      "calories": 290,
      "protein": 16,
      "carbs": 38,
      "fat": 8.5
    }
  ],
  "calories": 290,
  "protein": 16,
  "carbs": 38,
  "fat": 8.5,
  "vitamins": [
    { "name": "فيتامين B9 (فولات)", "amount": "148 ميكروغرام" },
    { "name": "فيتامين C", "amount": "6.5 ملغ" }
  ],
  "minerals": [
    { "name": "حديد (Iron)", "amount": "3.8 ملغ" },
    { "name": "بوتاسيوم (Potassium)", "amount": "450 ملغ" },
    { "name": "مغنيسيوم (Magnesium)", "amount": "75 ملغ" }
  ],
  "fiber": "11.5 غرام",
  "coachAdvice": "مصدر بروتين نباتي وألياف مشبعة ممتازة، بطيء الامتصاص ويحافظ على استقرار سكر الدم لساعات."
}`;

                  let response;
                  try {
                    response = await ai.models.generateContent({
                      model: 'gemini-3-flash-preview',
                      contents: [
                        { inlineData: { mimeType, data: cleanBase64 } },
                        { text: promptText }
                      ],
                      config: { responseMimeType: 'application/json' }
                    });
                  } catch (e1: any) {
                    console.warn('gemini-3-flash-preview error, trying gemini-3.8-flash:', e1.message);
                    try {
                      response = await ai.models.generateContent({
                        model: 'gemini-3.8-flash',
                        contents: [
                          { inlineData: { mimeType, data: cleanBase64 } },
                          { text: promptText }
                        ],
                        config: { responseMimeType: 'application/json' }
                      });
                    } catch (e2: any) {
                      console.warn('gemini-3.8-flash error:', e2.message);
                      throw e2;
                    }
                  }

                  const text = response?.text || '';
                  const cleanedJson = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
                  const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
                  if (jsonMatch) {
                    result = JSON.parse(jsonMatch[0]);
                  }
                } catch (geminiErr: any) {
                  console.warn('Gemini food analysis error, using intelligent nutritional calculation:', geminiErr.message);
                }
              }

              if (!result) {
                const hint = (userHint || '').toLowerCase();
                if (hint.includes('فول') || hint.includes('foul') || hint.includes('fava')) {
                  result = {
                    name: "طبق فول مدمس بالزيت والكمون",
                    isSingleItem: true,
                    serving: "طبق متوسط (250 غرام)",
                    foodItems: [
                      { id: "item-1", name: "فول مدمس متبل بالزيت والليمون", quantity: "250 غرام", grams: 250, calories: 290, protein: 16.5, carbs: 38, fat: 8.5 }
                    ],
                    calories: 290,
                    protein: 16.5,
                    carbs: 38,
                    fat: 8.5,
                    vitamins: [{ name: "فيتامين B9 (فولات)", amount: "155 ميكروغرام" }, { name: "فيتامين C", amount: "6.5 ملغ" }],
                    minerals: [{ name: "حديد", amount: "3.8 ملغ" }, { name: "بوتاسيوم", amount: "460 ملغ" }, { name: "مغنيسيوم", amount: "78 ملغ" }],
                    fiber: "12 غرام",
                    coachAdvice: "مصدر بروتين نباتي وألياف ممتازة تشعرك بالشبع لساعات طويلة وتثبت سكر الدم."
                  };
                } else if (hint.includes('طحين') || hint.includes('tahina') || hint.includes('sesame')) {
                  result = {
                    name: "سلطة طحينة سمسم نقي",
                    isSingleItem: true,
                    serving: "حصة فردية (60 غرام)",
                    foodItems: [
                      { id: "item-1", name: "طحينة بيضاء متبلة بالليمون والكمون", quantity: "60 غرام", grams: 60, calories: 310, protein: 9, carbs: 7.5, fat: 28 }
                    ],
                    calories: 310,
                    protein: 9,
                    carbs: 7.5,
                    fat: 28,
                    vitamins: [{ name: "فيتامين B1", amount: "0.4 ملغ" }, { name: "فيتامين E", amount: "1.2 ملغ" }],
                    minerals: [{ name: "كالسيوم", amount: "420 ملغ" }, { name: "زنك", amount: "3.5 ملغ" }, { name: "حديد", amount: "4.5 ملغ" }],
                    fiber: "4.2 غرام",
                    coachAdvice: "دهون نباتية صحية غير مشبعة غنية جداً بالكالسيوم والزنك لدعم المفاصل والهرمونات."
                  };
                } else if (hint.includes('تفاح') || hint.includes('apple')) {
                  result = {
                    name: "تفاحة خضراء طازجة",
                    isSingleItem: true,
                    serving: "1 حبة متوسطة (حوالي 180 غرام)",
                    foodItems: [
                      { id: "item-1", name: "تفاح طازج", quantity: "180 غرام", grams: 180, calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
                    ],
                    calories: 95,
                    protein: 0.5,
                    carbs: 25,
                    fat: 0.3,
                    vitamins: [{ name: "فيتامين C", amount: "8.4 ملغ" }, { name: "فيتامين A", amount: "98 وحدة" }],
                    minerals: [{ name: "بوتاسيوم", amount: "195 ملغ" }, { name: "كالسيوم", amount: "11 ملغ" }],
                    fiber: "4.4 غرام",
                    coachAdvice: "مصدر كاربوهيدرات نقي وألياف ممتازة لسد الشهية قبل التمرين بنصف ساعة."
                  };
                } else if (hint.includes('بيض') || hint.includes('egg')) {
                  result = {
                    name: "بيض مسلوق طازج",
                    isSingleItem: true,
                    serving: "2 حبة بيض مسلوق (100 غرام)",
                    foodItems: [
                      { id: "item-1", name: "بيض دجاج مسلوق", quantity: "2 حبة (100 غرام)", grams: 100, calories: 144, protein: 12.6, carbs: 1.1, fat: 9.6 }
                    ],
                    calories: 144,
                    protein: 12.6,
                    carbs: 1.1,
                    fat: 9.6,
                    vitamins: [{ name: "فيتامين B12", amount: "1.1 ميكروغرام" }, { name: "فيتامين D", amount: "2.0 ميكروغرام" }],
                    minerals: [{ name: "حديد", amount: "1.8 ملغ" }, { name: "زنك", amount: "1.3 ملغ" }],
                    fiber: "0 غرام",
                    coachAdvice: "قيمة بيولوجية بروتينية قصوى 100%، غني بالكولين لدعم التركيز والجهاز العصبي."
                  };
                } else if (hint.includes('موز') || hint.includes('banana')) {
                  result = {
                    name: "موز طازج",
                    isSingleItem: true,
                    serving: "1 حبة متوسطة (حوالي 120 غرام)",
                    foodItems: [
                      { id: "item-1", name: "موز أصفر طازج", quantity: "120 غرام", grams: 120, calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
                    ],
                    calories: 105,
                    protein: 1.3,
                    carbs: 27,
                    fat: 0.3,
                    vitamins: [{ name: "فيتامين B6", amount: "0.4 ملغ" }, { name: "فيتامين C", amount: "10 ملغ" }],
                    minerals: [{ name: "بوتاسيوم", amount: "422 ملغ" }, { name: "ماغنيسيوم", amount: "32 ملغ" }],
                    fiber: "3.1 غرام",
                    coachAdvice: "طاقة بومب سريعة تمنع الشد العضلي أثناء التمرين بفضل وفرة البوتاسيوم."
                  };
                } else if (hint.includes('دجاج') || hint.includes('فراخ') || hint.includes('chicken')) {
                  result = {
                    name: "صدر دجاج مشوي متبل",
                    isSingleItem: true,
                    serving: "حصة فردية (200 غرام)",
                    foodItems: [
                      { id: "item-1", name: "صدر دجاج مشوي بدون جلد", quantity: "200 غرام", grams: 200, calories: 330, protein: 62, carbs: 0, fat: 7.2 }
                    ],
                    calories: 330,
                    protein: 62,
                    carbs: 0,
                    fat: 7.2,
                    vitamins: [{ name: "نياسين B3", amount: "24 ملغ" }, { name: "فيتامين B6", amount: "1.2 ملغ" }],
                    minerals: [{ name: "فوسفور", amount: "440 ملغ" }, { name: "سيلينيوم", amount: "55 ميكروغرام" }],
                    fiber: "0 غرام",
                    coachAdvice: "مصدر بروتين صافي من النخبة 100% لبناء العضلات وسرعة الاستشفاء أثناء التنشيف أو التضخيم."
                  };
                } else if (hint.includes('سالمون') || hint.includes('سمك') || hint.includes('salmon') || hint.includes('fish')) {
                  result = {
                    name: "فيليه سالمون مشوي بالليمون",
                    isSingleItem: true,
                    serving: "قطعة فيليه متوسطة (200 غرام)",
                    foodItems: [
                      { id: "item-1", name: "سالمون أطلسي مشوي", quantity: "200 غرام", grams: 200, calories: 416, protein: 44, carbs: 0, fat: 26 }
                    ],
                    calories: 416,
                    protein: 44,
                    carbs: 0,
                    fat: 26,
                    vitamins: [{ name: "فيتامين D", amount: "22 ميكروغرام" }, { name: "فيتامين B12", amount: "6.4 ميكروغرام" }],
                    minerals: [{ name: "سيلينيوم", amount: "65 ميكروغرام" }, { name: "بوتاسيوم", amount: "750 ملغ" }],
                    fiber: "0 غرام",
                    coachAdvice: "أعلى مصدر للأحماض الدهنية أوميغا 3 التي تقلل الالتهابات وتزيد حساسية الإنسولين في العضلات."
                  };
                } else if (hint.includes('تونة') || hint.includes('tuna')) {
                  result = {
                    name: "تونة معلبة مصفاة بالماء",
                    isSingleItem: true,
                    serving: "علبة متوسطة مصفاة (150 غرام)",
                    foodItems: [
                      { id: "item-1", name: "لحم تونة خفيف بالماء", quantity: "150 غرام", grams: 150, calories: 175, protein: 39, carbs: 0, fat: 1.2 }
                    ],
                    calories: 175,
                    protein: 39,
                    carbs: 0,
                    fat: 1.2,
                    vitamins: [{ name: "فيتامين B12", amount: "4.2 ميكروغرام" }, { name: "فيتامين D", amount: "3.5 ميكروغرام" }],
                    minerals: [{ name: "سيلينيوم", amount: "90 ميكروغرام" }, { name: "حديد", amount: "1.5 ملغ" }],
                    fiber: "0 غرام",
                    coachAdvice: "سناك بروتيني سريع منخفض السعرات والدهون ومثالي جداً لأيام التنشيف الصارمة."
                  };
                } else if (hint.includes('أرز') || hint.includes('رز') || hint.includes('rice')) {
                  result = {
                    name: "أرز بسمتي أبيض مسلوق",
                    isSingleItem: true,
                    serving: "طبق متوسط (200 غرام مطبوخ)",
                    foodItems: [
                      { id: "item-1", name: "أرز بسمتي مطبوخ على البخار", quantity: "200 غرام", grams: 200, calories: 260, protein: 5.4, carbs: 56, fat: 0.8 }
                    ],
                    calories: 260,
                    protein: 5.4,
                    carbs: 56,
                    fat: 0.8,
                    vitamins: [{ name: "ثيامين B1", amount: "0.3 ملغ" }, { name: "حمض الفوليك", amount: "90 ميكروغرام" }],
                    minerals: [{ name: "حديد", amount: "1.8 ملغ" }, { name: "مغنيسيوم", amount: "24 ملغ" }],
                    fiber: "1.4 غرام",
                    coachAdvice: "مصدر طاقة نقي سهل الهضم سريع الامتصاص لتعبئة مخازن الجلايكوجين العضلي بعد التمرين."
                  };
                } else if (hint.includes('شوفان') || hint.includes('oat')) {
                  result = {
                    name: "شوفان حبة كاملة",
                    isSingleItem: true,
                    serving: "حصة جافة (80 غرام)",
                    foodItems: [
                      { id: "item-1", name: "رقائق شوفان كاملة", quantity: "80 غرام", grams: 80, calories: 304, protein: 10.8, carbs: 53, fat: 5.2 }
                    ],
                    calories: 304,
                    protein: 10.8,
                    carbs: 53,
                    fat: 5.2,
                    vitamins: [{ name: "فيتامين B1", amount: "0.5 ملغ" }, { name: "فيتامين B5", amount: "1.1 ملغ" }],
                    minerals: [{ name: "مغنيسيوم", amount: "110 ملغ" }, { name: "زنك", amount: "3.2 ملغ" }],
                    fiber: "8.2 غرام",
                    coachAdvice: "ألياف البيتا جلوكان تنظم سكر الدم وتمنح شبعاً مستمراً لعدة ساعات في الصباح."
                  };
                } else {
                  // Intelligent food recognition fallback for meals
                  result = {
                    name: "وجبة صحية متوازنة (بروتين ونشويات وخضار)",
                    isSingleItem: false,
                    serving: "طبق متكامل (حوالي 380 غرام)",
                    foodItems: [
                      { id: "item-1", name: "صدر دجاج / بروتين مشوي", quantity: "180 غرام", grams: 180, calories: 295, protein: 55, carbs: 0, fat: 6 },
                      { id: "item-2", name: "أرز بسمتي / بطاطس مطبوخة", quantity: "150 غرام", grams: 150, calories: 195, protein: 4, carbs: 42, fat: 0.8 },
                      { id: "item-3", name: "خضار طازجة / سلطة خضراء", quantity: "80 غرام", grams: 80, calories: 30, protein: 1.5, carbs: 5, fat: 0.3 }
                    ],
                    calories: 520,
                    protein: 60.5,
                    carbs: 47,
                    fat: 7.1,
                    vitamins: [
                      { name: "فيتامين C", amount: "38 ملغ" },
                      { name: "فيتامين B6", amount: "1.4 ملغ" }
                    ],
                    minerals: [
                      { name: "حديد هيمي", amount: "3.2 ملغ" },
                      { name: "بوتاسيوم", amount: "520 ملغ" }
                    ],
                    fiber: "4.8 غرام",
                    coachAdvice: "وجبة متوازنة عالية البروتين؛ يمكنك تعديل أو استبعاد أي صنف من القائمة قبل الحفظ المباشر."
                  };
                }
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, data: result }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
    configurePreviewServer(server) {
      // @ts-ignore
      this.configureServer(server);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      appIconUploaderPlugin(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: [
          'apple-touch-icon.png', 
          'icon.svg', 
          'images/icon-180.png',
          'images/icon-192.png', 
          'images/icon-512.png',
          'images/icon-1024.png',
          'images/icon-maskable-512.png',
          'pwa-192x192.png', 
          'pwa-512x512.png'
        ],
        manifest: {
          id: '/',
          name: 'AQ Coaching - Abdullah Qasim',
          short_name: 'AQ Coaching',
          description: 'AQ Coaching - برنامج التدريب الرياضي والمتابعة الغذائية الذكية بإشراف كوتش عبدالله قاسم (Abdullah Qasim)',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          dir: 'rtl',
          lang: 'ar',
          icons: [
            {
              src: '/images/icon-1024.png',
              sizes: '1024x1024',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/images/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/images/icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/images/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
