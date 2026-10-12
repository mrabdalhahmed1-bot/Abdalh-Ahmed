import React, { useState, useId } from 'react';
import { TraineeProfile, WeeklyCheckIn } from '../../types/fitness';
import { 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Scale, 
  Ruler, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  BarChart2,
  Info
} from 'lucide-react';

interface WeightProgressChartProps {
  trainee: TraineeProfile;
  title?: string;
  showWaistToggle?: boolean;
  compact?: boolean;
}

interface DataPoint {
  id: string;
  label: string;
  shortLabel: string;
  weekNumber: number;
  date: string;
  weightKg: number;
  waistCm?: number;
  deltaFromPrev: number;
  deltaFromStart: number;
  status?: 'pending' | 'reviewed';
  notes?: string;
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  trainee,
  title = 'المؤشر البياني لتطور الوزن ونزوله / صعوده',
  showWaistToggle = true,
  compact = false
}) => {
  const gradientId = useId();
  const [activeMetric, setActiveMetric] = useState<'weight' | 'waist' | 'delta'>('weight');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  // Prepare chronological sorted checkins
  const sortedCheckIns = [...(trainee.checkIns || [])].sort((a, b) => a.weekNumber - b.weekNumber);

  // Initial waist estimate (fallback to first checkin or default)
  const initialWaist = sortedCheckIns.length > 0 && sortedCheckIns[0].measurements?.waistCm
    ? sortedCheckIns[0].measurements.waistCm + 2.0
    : 88;

  // Build the complete points timeline starting from Day 0 (startDate)
  const points: DataPoint[] = [];

  // Point 0: Starting baseline
  points.push({
    id: 'point-start',
    label: 'نقطة البداية',
    shortLabel: 'W0',
    weekNumber: 0,
    date: trainee.startDate,
    weightKg: trainee.startingWeightKg,
    waistCm: initialWaist,
    deltaFromPrev: 0,
    deltaFromStart: 0,
    notes: 'بداية الاشتراك والتقييم الأولي'
  });

  // Points from check-ins
  let prevWeight = trainee.startingWeightKg;
  sortedCheckIns.forEach((chk) => {
    const deltaPrev = chk.weightKg - prevWeight;
    const deltaStart = chk.weightKg - trainee.startingWeightKg;
    prevWeight = chk.weightKg;

    points.push({
      id: chk.id,
      label: `الأسبوع ${chk.weekNumber}`,
      shortLabel: `W${chk.weekNumber}`,
      weekNumber: chk.weekNumber,
      date: chk.date,
      weightKg: chk.weightKg,
      waistCm: chk.measurements?.waistCm,
      deltaFromPrev: parseFloat(deltaPrev.toFixed(1)),
      deltaFromStart: parseFloat(deltaStart.toFixed(1)),
      status: chk.status,
      notes: chk.traineeNotes
    });
  });

  // Key summary numbers
  const totalChangeKg = trainee.currentWeightKg - trainee.startingWeightKg;
  const isLoss = totalChangeKg < 0;
  const isGain = totalChangeKg > 0;
  const absChangeKg = Math.abs(totalChangeKg).toFixed(1);
  const targetWeight = trainee.targetWeightKg;
  const remainingKg = (trainee.currentWeightKg - targetWeight).toFixed(1);

  // Goal direction logic
  const isGoalFatLoss = trainee.goal === 'fat_loss';
  const isGoalMuscleGain = trainee.goal === 'muscle_gain';

  // Determine trend health
  let trendStatusText = 'ثبات وإعادة تشكيل القوام (Recomp)';
  let trendColor = 'text-blue-400 bg-blue-950/60 border-blue-800';

  if (isLoss) {
    if (isGoalFatLoss || trainee.currentWeightKg > targetWeight) {
      trendStatusText = `نزول وتنشيف دهون إيجابي (${absChangeKg} كغ منذ البداية)`;
      trendColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    } else {
      trendStatusText = `نزول في الوزن (${absChangeKg} كغ)`;
      trendColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
    }
  } else if (isGain) {
    if (isGoalMuscleGain) {
      trendStatusText = `زيادة عضلية مدروسة وكتلة نظيفة (+${absChangeKg} كغ)`;
      trendColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    } else {
      trendStatusText = `ارتفاع في الوزن (+${absChangeKg} كغ)`;
      trendColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
    }
  }

  // Chart coordinates calculation
  const svgWidth = 640;
  const svgHeight = compact ? 200 : 250;
  const paddingX = 45;
  const paddingTop = 30;
  const paddingBottom = 40;

  // Values depending on active metric
  const values = points.map(p => {
    if (activeMetric === 'waist') return p.waistCm || initialWaist;
    if (activeMetric === 'delta') return p.deltaFromPrev;
    return p.weightKg;
  });

  // Calculate Min and Max for Y-axis
  let minY = Math.min(...values);
  let maxY = Math.max(...values);

  // If in weight mode, ensure target weight is also inside bounds
  if (activeMetric === 'weight') {
    minY = Math.min(minY, targetWeight);
    maxY = Math.max(maxY, targetWeight);
  }

  // Add 10% breathing room to Y-axis
  const rangeY = (maxY - minY) || 5;
  const yDomainMin = Math.floor(minY - rangeY * 0.15);
  const yDomainMax = Math.ceil(maxY + rangeY * 0.15);
  const yDomainSpread = yDomainMax - yDomainMin || 1;

  // Convert (index, value) to SVG (x, y)
  const getX = (index: number) => {
    if (points.length <= 1) return svgWidth / 2;
    return paddingX + (index / (points.length - 1)) * (svgWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const norm = (val - yDomainMin) / yDomainSpread;
    return svgHeight - paddingBottom - norm * (svgHeight - paddingTop - paddingBottom);
  };

  // Build SVG path string
  const pointCoords = points.map((p, idx) => {
    const val = activeMetric === 'waist' ? (p.waistCm || initialWaist) : activeMetric === 'delta' ? p.deltaFromPrev : p.weightKg;
    return {
      x: getX(idx),
      y: getY(val),
      point: p,
      val
    };
  });

  const pathD = pointCoords.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    // Smooth Bézier curve
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  // Closed area path for gradient
  const areaD = pointCoords.length > 0
    ? `${pathD} L ${pointCoords[pointCoords.length - 1].x} ${svgHeight - paddingBottom} L ${pointCoords[0].x} ${svgHeight - paddingBottom} Z`
    : '';

  // Target reference line Y
  const targetY = activeMetric === 'weight' ? getY(targetWeight) : null;
  const startY = activeMetric === 'weight' ? getY(trainee.startingWeightKg) : null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-semibold ${trendColor}`}>
                  {isLoss ? '📉 نزول في الوزن' : isGain ? '📈 صعود في الوزن' : '⚖️ ثبات وزن'}
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                تتبع مسار الصعود أو النزول مع خط الوزن المستهدف وفروقات الأسابيع
              </p>
            </div>
          </div>
        </div>

        {/* Metric Toggles */}
        {showWaistToggle && (
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveMetric('weight')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeMetric === 'weight'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>الوزن (كغ)</span>
            </button>
            <button
              onClick={() => setActiveMetric('waist')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeMetric === 'waist'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>محيط الخصر (سم)</span>
            </button>
            <button
              onClick={() => setActiveMetric('delta')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeMetric === 'delta'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>التغير الأسبوعي</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-xl">
          <span className="text-[11px] text-neutral-400 block mb-1">الوزن الأولي (البداية)</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-white">
            {trainee.startingWeightKg} <span className="text-xs text-neutral-400">كغ</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">{trainee.startDate}</span>
        </div>

        <div className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-xl">
          <span className="text-[11px] text-neutral-400 block mb-1">الوزن الحالي</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
            {trainee.currentWeightKg} <span className="text-xs text-neutral-400">كغ</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
            {isLoss ? (
              <span className="text-emerald-400 flex items-center">
                <TrendingDown className="w-3 h-3 ml-0.5" />
                نزول {absChangeKg} كغ
              </span>
            ) : isGain ? (
              <span className="text-amber-400 flex items-center">
                <TrendingUp className="w-3 h-3 ml-0.5" />
                زيادة {absChangeKg} كغ
              </span>
            ) : (
              <span>ثابت</span>
            )}
          </span>
        </div>

        <div className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-xl">
          <span className="text-[11px] text-neutral-400 block mb-1">الوزن المستهدف (الهدف)</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400">
            {targetWeight} <span className="text-xs text-neutral-400">كغ</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            {parseFloat(remainingKg) <= 0 
              ? '✓ تم تحقيق الهدف بالكامل!' 
              : `باقي ${remainingKg} كغ للهدف`}
          </span>
        </div>

        <div className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-xl">
          <span className="text-[11px] text-neutral-400 block mb-1">متوسط التغير الأسبوعي</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-white">
            {sortedCheckIns.length > 0 
              ? `${(totalChangeKg / sortedCheckIns.length).toFixed(2)}` 
              : '0.00'}{' '}
            <span className="text-xs text-neutral-400">كغ/أسبوع</span>
          </div>
          <span className="text-[10px] text-emerald-400">
            {isGoalFatLoss && totalChangeKg < 0 ? 'معدل صحي وآمن للحفاظ على العضل' : 'متابعة مستمرة'}
          </span>
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div className="relative bg-neutral-950 border border-neutral-800 rounded-2xl p-4 overflow-hidden">
        
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
              <strong className="text-white">
                {activeMetric === 'weight' ? 'مسار الوزن المسجل' : activeMetric === 'waist' ? 'محيط الخصر' : 'فرق الأسبوع'}
              </strong>
            </span>
            {activeMetric === 'weight' && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-cyan-400 border-b border-dashed border-cyan-400 inline-block" />
                  <span className="text-cyan-300">الوزن المستهدف ({targetWeight} كغ)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-neutral-600 inline-block" />
                  <span className="text-neutral-400">نقطة الانطلاق ({trainee.startingWeightKg} كغ)</span>
                </span>
              </>
            )}
          </div>
          <span className="text-[11px] text-neutral-500">
            اضغط على أي نقطة لعرض تفاصيل ذلك الأسبوع
          </span>
        </div>

        {/* SVG Drawing */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[500px] select-none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#10b981" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + ratio * (svgHeight - paddingTop - paddingBottom);
              const val = (yDomainMax - ratio * yDomainSpread).toFixed(0);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#262626"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-neutral-500"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Target Weight Reference Line */}
            {activeMetric === 'weight' && targetY !== null && (
              <g>
                <line
                  x1={paddingX}
                  y1={targetY}
                  x2={svgWidth - paddingX}
                  y2={targetY}
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  opacity="0.85"
                />
                <text
                  x={svgWidth - paddingX - 4}
                  y={targetY - 5}
                  textAnchor="end"
                  className="text-[10px] font-bold font-mono fill-cyan-400"
                >
                  الهدف: {targetWeight} كغ
                </text>
              </g>
            )}

            {/* Starting Weight Reference Line */}
            {activeMetric === 'weight' && startY !== null && (
              <g>
                <line
                  x1={paddingX}
                  y1={startY}
                  x2={svgWidth - paddingX}
                  y2={startY}
                  stroke="#525252"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
              </g>
            )}

            {/* Gradient Area Fill */}
            {areaD && (
              <path d={areaD} fill={`url(#${gradientId})`} />
            )}

            {/* Main Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            )}

            {/* Data Points */}
            {pointCoords.map((pt, index) => {
              const isSelected = selectedPoint?.id === pt.point.id;
              const isHovered = hoveredPoint?.id === pt.point.id;
              const isLatest = index === pointCoords.length - 1;

              return (
                <g 
                  key={pt.point.id} 
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedPoint(pt.point)}
                  onMouseEnter={() => setHoveredPoint(pt.point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Invisible larger hit area for easy clicks */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={18}
                    fill="transparent"
                  />

                  {/* Pulsing ring on the latest point */}
                  {isLatest && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={9}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      className="animate-ping"
                      opacity="0.7"
                    />
                  )}

                  {/* Outer circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected || isHovered ? 7 : 5}
                    fill={isLatest ? '#10b981' : '#09090b'}
                    stroke={isSelected ? '#ffffff' : '#10b981'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                  />

                  {/* Point value label */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className={`text-[10px] font-mono font-bold transition-all ${
                      isSelected || isHovered ? 'fill-white' : 'fill-emerald-400'
                    }`}
                  >
                    {pt.val}
                  </text>

                  {/* X-axis week label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    className={`text-[10px] font-mono transition-colors ${
                      isSelected ? 'fill-emerald-400 font-bold' : 'fill-neutral-400'
                    }`}
                  >
                    {pt.point.shortLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover / Selected Info Tooltip */}
        {(hoveredPoint || selectedPoint) && (
          <div className="mt-3 p-3.5 bg-neutral-900 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            {(() => {
              const activePt = hoveredPoint || selectedPoint!;
              const deltaPrev = activePt.deltaFromPrev;
              const deltaStart = activePt.deltaFromStart;

              return (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center font-mono font-bold text-white text-xs">
                      {activePt.shortLabel}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{activePt.label}</span>
                        <span className="text-[11px] font-mono text-neutral-400">({activePt.date})</span>
                        {activePt.status && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            activePt.status === 'reviewed' 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {activePt.status === 'reviewed' ? 'تمت مراجعة الكوتش' : 'متابعة جديدة'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        {activePt.notes || 'تسجيل متابعة منتظم'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">الوزن المسجل</span>
                      <span className="font-bold text-white text-sm">{activePt.weightKg} كغ</span>
                    </div>

                    {activePt.waistCm && (
                      <div>
                        <span className="text-neutral-500 text-[10px] block">محيط الخصر</span>
                        <span className="font-bold text-emerald-400 text-sm">{activePt.waistCm} سم</span>
                      </div>
                    )}

                    <div>
                      <span className="text-neutral-500 text-[10px] block">عن الأسبوع السابق</span>
                      <span className={`font-bold text-xs ${
                        deltaPrev < 0 ? 'text-emerald-400' : deltaPrev > 0 ? 'text-amber-400' : 'text-neutral-400'
                      }`}>
                        {deltaPrev < 0 ? `${deltaPrev} كغ` : deltaPrev > 0 ? `+${deltaPrev} كغ` : '0 كغ'}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500 text-[10px] block">إجمالي التغير</span>
                      <span className={`font-bold text-xs ${
                        deltaStart < 0 ? 'text-emerald-400' : deltaStart > 0 ? 'text-amber-400' : 'text-neutral-400'
                      }`}>
                        {deltaStart < 0 ? `${deltaStart} كغ` : deltaStart > 0 ? `+${deltaStart} كغ` : '0 كغ'}
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

      </div>

      {/* Trajectory Insights Message */}
      <div className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-xl flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="text-neutral-300">
            <strong className="text-white">التحليل الذكي لمسار الوزن: </strong>
            {trendStatusText}.
            {isGoalFatLoss && totalChangeKg < 0 && (
              <span> استمرارية النزول بمعدل 500-800 غرام أسبوعياً هي الصيغة المثالية لحرق الشحوم دون التضحية بالنسيج العضلي أو هبوط طاقة التدريب.</span>
            )}
            {isGoalMuscleGain && totalChangeKg > 0 && (
              <span> زيادة الوزن ضمن نطاق 250-400 غرام أسبوعياً تضمن أن النسبة العظمى من المكتسبات هي ألياف عضلية مع الحد الأدنى من الدهون.</span>
            )}
          </p>
        </div>
      </div>

    </div>
  );
};
