import React, { useState, useMemo } from 'react';
import { SatisfactionSurveyData } from '../types';
import { 
  SmilePlus, 
  Zap, 
  HeartHandshake, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';

interface SatisfactionSurveySectionProps {
  surveyData: SatisfactionSurveyData;
  loading?: boolean;
}

export function SatisfactionSurveySection({ surveyData, loading }: SatisfactionSurveySectionProps) {
  const [selectedDimension, setSelectedDimension] = useState<'all' | 'kecepatan' | 'keramahan' | 'kebutuhan'>('all');
  const [chartMode, setChartMode] = useState<'percentage' | 'volume'>('percentage');

  const { monthly, summary } = surveyData;

  const chartRows = useMemo(() => {
    return monthly.map((row) => ({
      ...row,
      shortBulan: row.bulan.replace(' 2026', '').slice(0, 3),
    }));
  }, [monthly]);

  const dimensions = [
    {
      key: 'kecepatan' as const,
      title: 'Kecepatan',
      subtitle: 'Kecepatan Layanan & Respon Petugas',
      icon: Zap,
      puas: summary.kecepatanPuas,
      tidakPuas: summary.kecepatanTidakPuas,
      persen: summary.persenKecepatan,
      persenVal: summary.persenKecepatanVal,
      total: summary.totalSurvei,
      colorHex: '#2563eb',
      cardBg: 'from-blue-50/90 via-sky-50/40 to-white',
      borderCls: 'border-blue-200/80 hover:border-blue-300',
      badgeCls: 'bg-blue-100/80 text-blue-800 border-blue-200',
      iconCls: 'bg-blue-100/80 text-blue-700 border-blue-200/60',
      barCls: 'bg-blue-600',
      textAccent: 'text-blue-950',
    },
    {
      key: 'keramahan' as const,
      title: 'Keramahan',
      subtitle: 'Sikap, Empati & Keramahan Petugas',
      icon: HeartHandshake,
      puas: summary.keramahanPuas,
      tidakPuas: summary.keramahanTidakPuas,
      persen: summary.persenKeramahan,
      persenVal: summary.persenKeramahanVal,
      total: summary.totalSurvei,
      colorHex: '#0d9488',
      cardBg: 'from-teal-50/90 via-emerald-50/40 to-white',
      borderCls: 'border-teal-200/80 hover:border-teal-300',
      badgeCls: 'bg-teal-100/80 text-teal-800 border-teal-200',
      iconCls: 'bg-teal-100/80 text-teal-700 border-teal-200/60',
      barCls: 'bg-teal-600',
      textAccent: 'text-teal-950',
    },
    {
      key: 'kebutuhan' as const,
      title: 'Memenuhi Kebutuhan',
      subtitle: 'Ketepatan Solusi & Pemenuhan Kebutuhan',
      icon: CheckCircle2,
      puas: summary.kebutuhanPuas,
      tidakPuas: summary.kebutuhanTidakPuas,
      persen: summary.persenKebutuhan,
      persenVal: summary.persenKebutuhanVal,
      total: summary.totalSurvei,
      colorHex: '#7c3aed',
      cardBg: 'from-purple-50/90 via-indigo-50/40 to-white',
      borderCls: 'border-purple-200/80 hover:border-purple-300',
      badgeCls: 'bg-purple-100/80 text-purple-800 border-purple-200',
      iconCls: 'bg-purple-100/80 text-purple-700 border-purple-200/60',
      barCls: 'bg-purple-600',
      textAccent: 'text-purple-950',
    },
  ];

  const formatNum = (num: number) => new Intl.NumberFormat('id-ID').format(num || 0);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <SmilePlus size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Survei Kepuasan Layanan CC 165
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold border border-blue-200/80">
              3 Dimensi Penilaian
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200/80">
              Total Survei: {formatNum(summary.totalSurvei)} Responden
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluasi kepuasan layanan per bulan berdasarkan dimensi <strong>Kecepatan</strong>, <strong>Keramahan</strong>, dan <strong>Memenuhi Kebutuhan</strong> (Januari – September 2026)
          </p>
        </div>

        {/* Dimension Filter Pills */}
        <div className="flex flex-wrap items-center p-1 bg-slate-200/80 rounded-lg border border-slate-300/60 self-start lg:self-auto shrink-0 gap-0.5">
          <button
            onClick={() => setSelectedDimension('all')}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedDimension === 'all'
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Semua Dimensi
          </button>
          <button
            onClick={() => setSelectedDimension('kecepatan')}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedDimension === 'kecepatan'
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Kecepatan ({summary.persenKecepatan})
          </button>
          <button
            onClick={() => setSelectedDimension('keramahan')}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedDimension === 'keramahan'
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Keramahan ({summary.persenKeramahan})
          </button>
          <button
            onClick={() => setSelectedDimension('kebutuhan')}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedDimension === 'kebutuhan'
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Memenuhi Kebutuhan ({summary.persenKebutuhan})
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* 3 Dimensi Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            const isSelected = selectedDimension === 'all' || selectedDimension === dim.key;

            return (
              <div
                key={dim.key}
                onClick={() => setSelectedDimension(selectedDimension === dim.key ? 'all' : dim.key)}
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between",
                  dim.cardBg,
                  dim.borderCls,
                  isSelected ? "shadow-xs opacity-100" : "opacity-60 hover:opacity-90"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", dim.badgeCls)}>
                        Dimensi Penilaian
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1.5">
                        {dim.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {dim.subtitle}
                      </p>
                    </div>
                    <div className={cn("p-2.5 rounded-xl border shadow-2xs shrink-0", dim.iconCls)}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className={cn("text-2xl sm:text-3xl font-extrabold tracking-tight", dim.textAccent)}>
                        {loading && monthly.length === 0 ? '...' : dim.persen}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold ml-1.5">
                        Tingkat Kepuasan
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Tingkat Kepuasan */}
                  <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden mt-2.5 flex p-0.5 border border-slate-200/60">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", dim.barCls)}
                      style={{ width: `${Math.min(Math.max(dim.persenVal, 5), 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Monthly Trend Chart */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <TrendingUp size={16} className="text-blue-600" />
                <span>
                  {chartMode === 'percentage'
                    ? 'Tren Persentase Kepuasan Layanan per Bulan (Januari – September 2026)'
                    : 'Distribusi Responden Puas per Bulan Berdasarkan Dimensi Penilaian'}
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Perbandingan capaian bulanan untuk dimensi Kecepatan, Keramahan, dan Memenuhi Kebutuhan
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              <button
                onClick={() => setChartMode('percentage')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer",
                  chartMode === 'percentage'
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <TrendingUp size={12} />
                <span>% Kepuasan</span>
              </button>
              <button
                onClick={() => setChartMode('volume')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer",
                  chartMode === 'volume'
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <BarChart3 size={12} />
                <span>Jumlah Puas</span>
              </button>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80 bg-white p-3.5 rounded-xl border border-slate-200/80">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'percentage' ? (
                <LineChart data={chartRows} margin={{ top: 14, right: 24, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="bulan"
                    interval={0}
                    padding={{ left: 10, right: 14 }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10.5, fontWeight: 600, fill: '#64748b' }}
                    dy={6}
                  />
                  <YAxis
                    domain={[82, 98]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10.5, fill: '#64748b' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number, name: string) => [
                      `${Number(value).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
                      name,
                    ]}
                    labelFormatter={(label: string, payload: any[]) => {
                      if (payload && payload.length > 0) {
                        const row = payload[0].payload;
                        return `${label} (Total Survei: ${formatNum(row.totalSurvei)})`;
                      }
                      return label;
                    }}
                    labelStyle={{ color: '#0f172a', fontWeight: 700, marginBottom: '4px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11.5px', fontWeight: 600, paddingTop: '10px' }} />
                  {(selectedDimension === 'all' || selectedDimension === 'kecepatan') && (
                    <Line
                      type="monotone"
                      dataKey="persenKecepatanVal"
                      name="% Puas Kecepatan"
                      stroke="#2563eb"
                      strokeWidth={5.5}
                      dot={{ r: 5.5, strokeWidth: 2.5, stroke: '#2563eb', fill: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 2.5, stroke: '#ffffff', fill: '#1d4ed8' }}
                    />
                  )}
                  {(selectedDimension === 'all' || selectedDimension === 'keramahan') && (
                    <Line
                      type="monotone"
                      dataKey="persenKeramahanVal"
                      name="% Puas Keramahan"
                      stroke="#0d9488"
                      strokeWidth={5.5}
                      dot={{ r: 5.5, strokeWidth: 2.5, stroke: '#0d9488', fill: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 2.5, stroke: '#ffffff', fill: '#0f766e' }}
                    />
                  )}
                  {(selectedDimension === 'all' || selectedDimension === 'kebutuhan') && (
                    <Line
                      type="monotone"
                      dataKey="persenKebutuhanVal"
                      name="% Puas Memenuhi Kebutuhan"
                      stroke="#7c3aed"
                      strokeWidth={5.5}
                      dot={{ r: 5.5, strokeWidth: 2.5, stroke: '#7c3aed', fill: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 2.5, stroke: '#ffffff', fill: '#6d28d9' }}
                    />
                  )}
                </LineChart>
              ) : (
                <BarChart data={chartRows} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="bulan"
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 500, fill: '#64748b' }}
                    dy={6}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(val) => formatNum(val)}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number, name: string) => [formatNum(value), name]}
                    labelFormatter={(label: string, payload: any[]) => {
                      if (payload && payload.length > 0) {
                        const row = payload[0].payload;
                        return `${label} (Total Survei: ${formatNum(row.totalSurvei)})`;
                      }
                      return label;
                    }}
                    labelStyle={{ color: '#0f172a', fontWeight: 700, marginBottom: '4px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  {(selectedDimension === 'all' || selectedDimension === 'kecepatan') && (
                    <Bar dataKey="kecepatanPuas" name="Kecepatan (Puas)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  )}
                  {(selectedDimension === 'all' || selectedDimension === 'keramahan') && (
                    <Bar dataKey="keramahanPuas" name="Keramahan (Puas)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  )}
                  {(selectedDimension === 'all' || selectedDimension === 'kebutuhan') && (
                    <Bar dataKey="kebutuhanPuas" name="Memenuhi Kebutuhan (Puas)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
