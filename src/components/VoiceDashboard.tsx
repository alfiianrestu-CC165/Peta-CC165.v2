import React, { useState, useMemo } from 'react';
import { 
  DataRow, 
  CategoryBreakdownData, 
  RegionalData, 
  ParticipantSegmentData 
} from '../types';
import { 
  Database, 
  PhoneCall, 
  PhoneIncoming, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileSpreadsheet,
  Globe2,
  BarChart3,
  Layers,
  Users
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  CartesianGrid, 
  Cell 
} from 'recharts';
import { cn } from '../lib/utils';
import { CategoryBreakdown } from './CategoryBreakdown';
import { RegionalBreakdown } from './RegionalBreakdown';
import { ParticipantSegmentBreakdown } from './ParticipantSegmentBreakdown';

export interface LogItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: Date;
}

export interface VoiceDashboardProps {
  data: DataRow[];
  loading: boolean;
  filteredData: DataRow[];
  chartData: (DataRow & { persenDijawabVal: number; persenTuntasVal: number })[];
  categoryStackedData: {
    chartData: any[];
    info: number;
    req: number;
    comp: number;
    total: number;
    infoPct: number;
    reqPct: number;
    compPct: number;
  };
  categoryData: CategoryBreakdownData;
  totalMasuk: number;
  persenDijawab: string;
  rataTuntas: string;
  logs: LogItem[];
  setLogs: React.Dispatch<React.SetStateAction<LogItem[]>>;
  regionalData: RegionalData;
  segmentData: ParticipantSegmentData;
}

export function VoiceDashboard({
  data,
  loading,
  filteredData,
  chartData,
  categoryStackedData,
  categoryData,
  totalMasuk,
  persenDijawab,
  rataTuntas,
  logs,
  setLogs,
  regionalData,
  segmentData,
}: VoiceDashboardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [voiceSubTab, setVoiceSubTab] = useState<'ringkasan' | 'segmen' | 'kedeputian'>('ringkasan');

  // Dapatkan data Rata-rata Waktu Layanan dari baris Total/Rata-Rata (Cell E9 Google Sheets)
  const summaryRow = useMemo(() => {
    return data.find(item => item.bulan.toLowerCase().includes('total') || item.bulan.toLowerCase().includes('rata-rata'));
  }, [data]);

  const avgHandleTime = useMemo(() => {
    if (summaryRow?.rataWaktu) {
      const raw = summaryRow.rataWaktu.trim();
      const parts = raw.split(':');
      if (parts.length === 3) {
        return parts.map(p => p.padStart(2, '0')).join(':');
      }
      return raw;
    }
    return '00:04:01';
  }, [summaryRow]);

  const totalDijawab = useMemo(() => {
    if (summaryRow && summaryRow.panggilanDijawab) return summaryRow.panggilanDijawab;
    const monthlyRows = data.filter(item => !(item.bulan.toLowerCase().includes('total') || item.bulan.toLowerCase().includes('rata-rata')));
    return monthlyRows.reduce((acc, curr) => acc + (curr.panggilanDijawab || 0), 0);
  }, [summaryRow, data]);

  const totalTuntas = useMemo(() => {
    if (summaryRow && summaryRow.tuntas) return summaryRow.tuntas;
    const monthlyRows = data.filter(item => !(item.bulan.toLowerCase().includes('total') || item.bulan.toLowerCase().includes('rata-rata')));
    return monthlyRows.reduce((acc, curr) => acc + (curr.tuntas || 0), 0);
  }, [summaryRow, data]);

  // Data Disposisi ke KC (Kolom M9: Disposisi Kantor Cabang, Kolom N9: % Disposisi)
  const disposisiInfo = useMemo(() => {
    if (summaryRow) {
      const persen = summaryRow.persenDisposisi ? summaryRow.persenDisposisi.trim() : '0,39%';
      const count = typeof summaryRow.disposisi === 'number' && !isNaN(summaryRow.disposisi)
        ? new Intl.NumberFormat('id-ID').format(summaryRow.disposisi)
        : '3.913';
      return `${persen} (${count} Tiket)`;
    }
    const monthlyRows = data.filter(item => !(item.bulan.toLowerCase().includes('total') || item.bulan.toLowerCase().includes('rata-rata')));
    if (monthlyRows.length > 0) {
      const totalDisposisi = monthlyRows.reduce((acc, curr) => acc + (curr.disposisi || 0), 0);
      const totalLayanan = monthlyRows.reduce((acc, curr) => acc + (curr.total || 0), 0);
      const pct = totalLayanan > 0 ? ((totalDisposisi / totalLayanan) * 100).toFixed(2).replace('.', ',') + '%' : '0,39%';
      return `${pct} (${new Intl.NumberFormat('id-ID').format(totalDisposisi || 3913)} Tiket)`;
    }
    return '0,39% (3.913 Tiket)';
  }, [summaryRow, data]);

  // Format persentase 2 digit desimal (koma)
  const formatPct = (val: number) => {
    return (Number(val) || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const infoPctFormatted = formatPct(categoryStackedData.infoPct);
  const reqPctFormatted = formatPct(categoryStackedData.reqPct);
  const compPctFormatted = formatPct(categoryStackedData.compPct);

  return (
    <div className="space-y-4">
      {/* Sub-menu Tabs for Voice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center p-1 bg-slate-100/90 rounded-lg border border-slate-200 gap-1">
          <button
            onClick={() => setVoiceSubTab('ringkasan')}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer",
              voiceSubTab === 'ringkasan'
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            )}
          >
            <BarChart3 size={14} className={voiceSubTab === 'ringkasan' ? "text-blue-600" : "text-slate-500"} />
            <span>Ringkasan & Kategori</span>
          </button>

          <button
            onClick={() => setVoiceSubTab('segmen')}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer",
              voiceSubTab === 'segmen'
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            )}
          >
            <Users size={14} className={voiceSubTab === 'segmen' ? "text-blue-600" : "text-slate-500"} />
            <span>Segmen Peserta</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full">
              7 Segmen
            </span>
          </button>

          <button
            onClick={() => setVoiceSubTab('kedeputian')}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer",
              voiceSubTab === 'kedeputian'
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            )}
          >
            <Globe2 size={14} className={voiceSubTab === 'kedeputian' ? "text-blue-600" : "text-slate-500"} />
            <span>Pemanfaatan per Wilayah</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full">
              12 Wilayah
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-3 text-xs text-slate-500 font-medium">
          <Layers size={13} className="text-slate-400" />
          <span>Layanan Voice CC 165</span>
        </div>
      </div>

      {voiceSubTab === 'segmen' ? (
        <ParticipantSegmentBreakdown segmentData={segmentData} />
      ) : voiceSubTab === 'kedeputian' ? (
        <RegionalBreakdown
          regionalData={regionalData}
          loading={loading}
        />
      ) : (
        <>
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Total Panggilan Masuk */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-white p-5 shadow-xs border border-blue-200/80 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-blue-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Total Panggilan Masuk
                    </h3>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
                    {loading && data.length === 0 ? '...' : new Intl.NumberFormat('id-ID').format(totalMasuk)}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Total interaksi masuk ke Call Center 165
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100/80 text-blue-700 border border-blue-200/60 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                  <PhoneCall size={22} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-100/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Periode Data</span>
                <span className="inline-flex items-center gap-1 font-bold bg-blue-100/70 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200/60 text-[11px]">
                  Januari - September 2026
                </span>
              </div>
            </div>

            {/* 2. % Dijawab Petugas */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white p-5 shadow-xs border border-emerald-200/80 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-emerald-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      % Dijawab Petugas
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-2 flex-wrap">
                    <p className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
                      {loading && data.length === 0 ? '...' : persenDijawab}
                    </p>
                    <span className="inline-flex items-center font-bold bg-emerald-100/80 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200/70 text-xs">
                      {loading && data.length === 0 ? '...' : new Intl.NumberFormat('id-ID').format(totalDijawab)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Dijawab Petugas: <span className="font-bold text-emerald-800">{loading && data.length === 0 ? '...' : new Intl.NumberFormat('id-ID').format(totalDijawab)}</span> panggilan
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100/80 text-emerald-700 border border-emerald-200/60 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                  <PhoneIncoming size={22} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Clock size={12} className="text-emerald-600" /> Avg. Handle Time
                </span>
                <span className="inline-flex items-center gap-1 font-bold bg-emerald-100/70 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
                  {loading && data.length === 0 ? '...' : `${avgHandleTime} Menit`}
                </span>
              </div>
            </div>

            {/* 3. % Tuntas pada CC 165 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50/90 via-indigo-50/50 to-white p-5 shadow-xs border border-purple-200/80 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-purple-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                      % Tuntas pada CC 165
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-2 flex-wrap">
                    <p className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight">
                      {loading && data.length === 0 ? '...' : rataTuntas}
                    </p>
                    <span className="inline-flex items-center font-bold bg-purple-100/80 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200/70 text-xs">
                      {loading && data.length === 0 ? '...' : new Intl.NumberFormat('id-ID').format(totalTuntas)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Tuntas pada Layanan CC 165: <span className="font-bold text-purple-800">{loading && data.length === 0 ? '...' : new Intl.NumberFormat('id-ID').format(totalTuntas)}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100/80 text-purple-700 border border-purple-200/60 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={22} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Disposisi ke KC</span>
                <span className="inline-flex items-center gap-1 font-bold bg-purple-100/70 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200/60 text-[11px]">
                  {loading && data.length === 0 ? '...' : disposisiInfo}
                </span>
              </div>
            </div>
          </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Komposisi Kategori Layanan Card */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Database size={16} className="text-blue-600" />
                  <span>Komposisi Kategori Layanan</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Distribusi pemanfaatan dari 3 kategori utama (Jan – Jul 2026)
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100/80 shrink-0">
                Total: {new Intl.NumberFormat('id-ID').format(categoryStackedData.total || 976919)}
              </span>
            </div>

            {/* 100% Horizontal Proportion Bar */}
            <div className="my-3">
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium mb-1.5">
                <span>Distribusi Proporsional</span>
                <span className="text-slate-700 font-semibold">100% Akumulasi</span>
              </div>

              <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex p-1 border border-slate-200/80 gap-1 shadow-inner">
                {/* Informasi Segment */}
                <div 
                  style={{ width: `${Math.max(categoryStackedData.infoPct, 5)}%` }}
                  className="bg-blue-600 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-2xs transition-all hover:brightness-110 cursor-pointer relative group"
                  title={`Informasi: ${infoPctFormatted}% (${new Intl.NumberFormat('id-ID').format(categoryStackedData.info)})`}
                >
                  <span className="truncate px-1.5">{infoPctFormatted}%</span>
                </div>

                {/* Permintaan Segment */}
                <div 
                  style={{ width: `${Math.max(categoryStackedData.reqPct, 4)}%` }}
                  className="bg-emerald-600 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-2xs transition-all hover:brightness-110 cursor-pointer relative group"
                  title={`Permintaan: ${reqPctFormatted}% (${new Intl.NumberFormat('id-ID').format(categoryStackedData.req)})`}
                >
                  <span className="truncate px-1">{reqPctFormatted}%</span>
                </div>

                {/* Pengaduan Segment */}
                <div 
                  style={{ width: `${Math.max(categoryStackedData.compPct, 3)}%` }}
                  className="bg-amber-500 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-2xs transition-all hover:brightness-110 cursor-pointer relative group"
                  title={`Pengaduan: ${compPctFormatted}% (${new Intl.NumberFormat('id-ID').format(categoryStackedData.comp)})`}
                >
                  <span className="truncate px-0.5">{compPctFormatted}%</span>
                </div>
              </div>
            </div>

            {/* Structured Proportional Category Cards */}
            <div className="space-y-2 mt-3.5">
              {/* Informasi */}
              <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50/70 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-200"></span>
                    <span className="text-xs font-bold text-slate-800">Informasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {new Intl.NumberFormat('id-ID').format(categoryStackedData.info)}
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded">
                      {infoPctFormatted}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-blue-100/60 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full" 
                    style={{ width: `${categoryStackedData.infoPct}%` }}
                  />
                </div>
              </div>

              {/* Permintaan */}
              <div className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
                    <span className="text-xs font-bold text-slate-800">Permintaan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {new Intl.NumberFormat('id-ID').format(categoryStackedData.req)}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                      {reqPctFormatted}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-emerald-100/60 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full" 
                    style={{ width: `${categoryStackedData.reqPct}%` }}
                  />
                </div>
              </div>

              {/* Pengaduan */}
              <div className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50/70 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
                    <span className="text-xs font-bold text-slate-800">Pengaduan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {new Intl.NumberFormat('id-ID').format(categoryStackedData.comp)}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.5 rounded">
                      {compPctFormatted}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-amber-100/60 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full" 
                    style={{ width: `${categoryStackedData.compPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Dominasi utama: <strong className="text-blue-700 font-semibold">Kategori Informasi</strong></span>
            <span className="text-slate-400">{infoPctFormatted}% dari total</span>
          </div>
        </div>

        {/* Line Chart Panggilan Masuk */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
              <Activity size={16} className="text-blue-600" /> Tren Panggilan Masuk per Bulan
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
              Trend Bulanan
            </span>
          </div>
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 12, right: 14, left: -6, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} dy={6} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [
                    new Intl.NumberFormat('id-ID').format(value),
                    'Panggilan Masuk'
                  ]}
                  labelFormatter={(label: string, payload: any[]) => {
                    if (payload && payload.length > 0) {
                      const row = payload[0].payload;
                      return `${label} (Dijawab: ${row.persenDijawab || '0%'})`;
                    }
                    return label;
                  }}
                  labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '2px' }}
                />
                <Line
                  type="monotone"
                  dataKey="panggilanMasuk"
                  name="Panggilan Masuk"
                  stroke="#2563eb"
                  strokeWidth={4}
                  dot={{ r: 4.5, strokeWidth: 2, stroke: '#2563eb', fill: '#ffffff' }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff', fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rincian Top Pemanfaatan per Kategori (Informasi, Permintaan, Pengaduan) */}
      <CategoryBreakdown 
        categoryData={categoryData} 
        categoryTotals={categoryStackedData}
      />

      {/* Full-Width Table View */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={17} className="text-blue-600" />
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Data Lengkap Panggilan CC 165
            </h3>
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold border border-blue-100">
              {filteredData.filter(d => !d.bulan.toLowerCase().includes('total') && !d.bulan.toLowerCase().includes('rata-rata')).length || 7} Bulan
            </span>
          </div>

          {/* Quick toggle for system logs */}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>{showLogs ? 'Tutup Log Sistem' : 'Lihat Log Sistem'}</span>
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200">
            <thead>
              <tr className="border-b border-slate-200 text-[9.5px] font-bold uppercase tracking-tight leading-tight">
                <th rowSpan={2} className="px-1.5 py-2 text-center align-middle border-r border-slate-200 bg-slate-100 text-slate-700">
                  Bulan
                </th>
                <th rowSpan={2} className="px-1.5 py-2 text-center align-middle border-r border-slate-200 bg-blue-50/80 text-blue-900">
                  Panggilan<br />Masuk
                </th>
                <th rowSpan={2} className="px-1.5 py-2 text-center align-middle border-r border-slate-200 bg-blue-50/80 text-blue-900">
                  Dijawab<br />Petugas
                </th>
                <th rowSpan={2} className="px-1.5 py-2 text-center align-middle border-r border-slate-200 bg-blue-50/80 text-blue-900">
                  % Jawab
                </th>
                <th rowSpan={2} className="px-1.5 py-2 text-center align-middle border-r border-slate-200 bg-teal-50/80 text-teal-900">
                  Rata-Rata<br />Waktu Layanan
                </th>
                <th rowSpan={2} className="px-1.5 py-2 text-center align-middle border-r border-slate-200 bg-teal-50/80 text-teal-900">
                  Dijawab Petugas<br />&lt;20 Detik
                </th>
                <th colSpan={3} className="px-1 py-1.5 text-center align-middle border-r border-b border-slate-200 bg-amber-50 text-amber-900">
                  Kategori
                </th>
                <th rowSpan={2} className="px-1 py-2 text-center align-middle border-r border-slate-200 bg-emerald-50/80 text-emerald-900">
                  Total
                </th>
                <th rowSpan={2} className="px-1 py-2 text-center align-middle border-r border-slate-200 bg-emerald-50/80 text-emerald-900">
                  Tuntas Pada<br />Layanan CC 165
                </th>
                <th rowSpan={2} className="px-1 py-2 text-center align-middle border-r border-slate-200 bg-emerald-50/80 text-emerald-900">
                  % Tuntas
                </th>
                <th rowSpan={2} className="px-1 py-2 text-center align-middle border-r border-slate-200 bg-purple-50/80 text-purple-900">
                  Tidak Tuntas pada<br />Layanan CC 165
                </th>
                <th rowSpan={2} className="px-1 py-2 text-center align-middle bg-purple-50/80 text-purple-900">
                  % Tidak Tuntas pada<br />Layanan CC 165
                </th>
              </tr>
              <tr className="border-b border-slate-200 text-[9px] font-bold uppercase tracking-tight leading-tight">
                <th className="px-1 py-1 text-center align-middle border-r border-slate-200 bg-amber-50/50 text-amber-900">
                  Informasi
                </th>
                <th className="px-1 py-1 text-center align-middle border-r border-slate-200 bg-amber-50/50 text-amber-900">
                  Permintaan
                </th>
                <th className="px-1 py-1 text-center align-middle border-r border-slate-200 bg-amber-50/50 text-amber-900">
                  Pengaduan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[10px]">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-6 text-center text-slate-500 font-medium">Memuat data dari Google Sheets...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-6 text-center text-slate-500 font-medium">Tidak ada data ditemukan</td>
                </tr>
              ) : (
                filteredData.map((row) => {
                  const isSummary = row.bulan.toLowerCase().includes('total') || row.bulan.toLowerCase().includes('rata-rata');
                  return (
                    <tr 
                      key={row.rowNumber} 
                      className={cn(
                        "transition-colors",
                        isSummary 
                          ? "bg-blue-50/70 font-semibold text-slate-900 border-t-2 border-slate-300" 
                          : "hover:bg-slate-50/80 text-slate-700"
                      )}
                    >
                      <td className="px-1 py-1.5 text-center font-medium whitespace-nowrap text-slate-900">{row.bulan}</td>
                      <td className="px-1 py-1.5 text-center font-medium">{new Intl.NumberFormat('id-ID').format(row.panggilanMasuk)}</td>
                      <td className="px-1 py-1.5 text-center text-slate-700">{new Intl.NumberFormat('id-ID').format(row.panggilanDijawab)}</td>
                      <td className="px-1 py-1.5 text-center font-semibold text-blue-600">{row.persenDijawab}</td>
                      <td className="px-1 py-1.5 text-center text-slate-600 whitespace-nowrap">{row.rataWaktu}</td>
                      <td className="px-1 py-1.5 text-center text-emerald-600 font-medium">{row.dijawabKurang20}</td>
                      <td className="px-1 py-1.5 text-center">{new Intl.NumberFormat('id-ID').format(row.informasi)}</td>
                      <td className="px-1 py-1.5 text-center">{new Intl.NumberFormat('id-ID').format(row.permintaan)}</td>
                      <td className="px-1 py-1.5 text-center">{new Intl.NumberFormat('id-ID').format(row.pengaduan)}</td>
                      <td className="px-1 py-1.5 text-center font-medium">{new Intl.NumberFormat('id-ID').format(row.total)}</td>
                      <td className="px-1 py-1.5 text-center font-medium text-slate-800">{new Intl.NumberFormat('id-ID').format(row.tuntas)}</td>
                      <td className="px-1 py-1.5 text-center font-bold text-emerald-600">{row.persenTuntas}</td>
                      <td className="px-1 py-1.5 text-center">{new Intl.NumberFormat('id-ID').format(row.disposisi)}</td>
                      <td className="px-1 py-1.5 text-center font-medium text-slate-600">{row.persenDisposisi}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Collapsible System Logs (When toggled) */}
      {showLogs && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Activity size={14} className="text-blue-600" /> System Activity Log
            </h4>
            <span className="text-[10px] text-blue-600 hover:underline cursor-pointer" onClick={() => setLogs([])}>
              Bersihkan Log
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-[11px] text-slate-400 col-span-full text-center py-2">Belum ada aktivitas</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className={cn("p-2.5 rounded-lg border flex items-start gap-2 text-[11px]",
                  log.type === 'success' ? 'bg-blue-50/60 border-blue-200 text-blue-900' :
                  log.type === 'error' ? 'bg-red-50/60 border-red-200 text-red-900' :
                  'bg-slate-50 border-slate-200 text-slate-800'
                )}>
                  <div className="mt-0.5 shrink-0">
                    {log.type === 'success' ? <RefreshCw size={12} className="text-blue-600" /> :
                     log.type === 'error' ? <AlertCircle size={12} className="text-red-600" /> :
                     <Database size={12} className="text-slate-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold truncate">{log.title}</p>
                      <span className="text-[9px] text-slate-400 shrink-0">
                        {log.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 line-clamp-1 mt-0.5">{log.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
