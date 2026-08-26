import React, { useState, useMemo } from 'react';
import { ParticipantSegmentData, SegmentItem } from '../types';
import { getKedeputianWilayahIndex } from '../lib/sheets';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  HeartHandshake, 
  Landmark, 
  ShieldAlert, 
  HelpCircle, 
  TrendingUp, 
  BarChart3, 
  Table as TableIcon,
  PieChart as PieChartIcon,
  Info,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie 
} from 'recharts';
import { cn } from '../lib/utils';

interface ParticipantSegmentBreakdownProps {
  segmentData: ParticipantSegmentData;
}

const SEGMENT_ICONS: Record<string, React.ElementType> = {
  'PBPU': Users,
  'PPU': Briefcase,
  'PBI APBN': HeartHandshake,
  'PBI APBD': Landmark,
  'PPU PN': UserCheck,
  'BP': Layers,
  'Belum Terdaftar': HelpCircle
};

export function ParticipantSegmentBreakdown({ segmentData }: ParticipantSegmentBreakdownProps) {
  const [activeTab, setActiveTab] = useState<'cards' | 'chart' | 'regional' | 'table'>('cards');
  const [selectedSegment, setSelectedSegment] = useState<string>('WILAYAH');

  const { segments, monthlyData, regionalSegments, grandTotal } = segmentData;

  // Chart data for donut/pie
  const pieData = useMemo(() => {
    return segments.map(s => ({
      name: s.segmentName,
      fullName: s.fullName,
      value: s.total,
      percentage: s.percentage,
      color: s.color
    }));
  }, [segments]);

  // Monthly breakdown dataset formatted for stacked / grouped bar chart
  const monthlyChartData = useMemo(() => {
    return monthlyData.map(m => ({
      name: m.bulan.substring(0, 3),
      fullMonth: m.bulan,
      'PBPU': m['PBPU'],
      'PPU': m['PPU'],
      'PBI APBN': m['PBI APBN'],
      'PBI APBD': m['PBI APBD'],
      'PPU PN': m['PPU PN'],
      'BP': m['BP'],
      'Belum Terdaftar': m['Belum Terdaftar'],
      total: m.total
    }));
  }, [monthlyData]);

  // Valid 12 Kedeputian Wilayah (exclude generic header rows like "KEDEPUTIAN WILAYAH")
  const validRegionalSegments = useMemo(() => {
    return regionalSegments.filter(r => {
      const idx = getKedeputianWilayahIndex(r.kedeputianWilayah);
      return idx >= 1 && idx <= 12 && r.kedeputianWilayah.trim().toUpperCase() !== 'KEDEPUTIAN WILAYAH';
    });
  }, [regionalSegments]);

  // Filtered and ordered regional list (strictly Kedeputian Wilayah I s.d. XII by default)
  const sortedRegional = useMemo(() => {
    if (selectedSegment === 'WILAYAH') {
      return [...validRegionalSegments].sort((a, b) => getKedeputianWilayahIndex(a.kedeputianWilayah) - getKedeputianWilayahIndex(b.kedeputianWilayah));
    }
    if (selectedSegment === 'TOTAL_DESC') {
      return [...validRegionalSegments].sort((a, b) => b.total - a.total);
    }
    return [...validRegionalSegments].sort((a, b) => {
      const diff = ((b as any)[selectedSegment] || 0) - ((a as any)[selectedSegment] || 0);
      if (diff !== 0) return diff;
      return getKedeputianWilayahIndex(a.kedeputianWilayah) - getKedeputianWilayahIndex(b.kedeputianWilayah);
    });
  }, [validRegionalSegments, selectedSegment]);

  // Table rows strictly ordered from Kedeputian Wilayah I s.d. XII
  const tableRows = useMemo(() => {
    return [...validRegionalSegments].sort((a, b) => getKedeputianWilayahIndex(a.kedeputianWilayah) - getKedeputianWilayahIndex(b.kedeputianWilayah));
  }, [validRegionalSegments]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-slate-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
              <Users size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                  Pemanfaatan Berdasarkan Segmen Peserta
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                  <Sparkles size={12} /> 7 Segmen Utama
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Rincian interaksi peserta berdasarkan jenis kepesertaan JKN (Januari – Juli 2026)
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('cards')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'cards' 
                  ? "bg-white text-blue-700 shadow-xs" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <PieChartIcon size={14} /> Ringkasan Segmen
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'chart' 
                  ? "bg-white text-blue-700 shadow-xs" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <BarChart3 size={14} /> Tren Bulanan
            </button>
            <button
              onClick={() => setActiveTab('regional')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'regional' 
                  ? "bg-white text-blue-700 shadow-xs" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Layers size={14} /> Sebaran Wilayah
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'table' 
                  ? "bg-white text-blue-700 shadow-xs" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <TableIcon size={14} /> Tabel Data
            </button>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-5">
          {segments.map((seg, idx) => {
            const Icon = SEGMENT_ICONS[seg.segmentName] || Users;
            return (
              <div 
                key={seg.segmentName}
                onClick={() => {
                  setSelectedSegment(selectedSegment === seg.segmentName ? 'ALL' : seg.segmentName);
                }}
                className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between",
                  selectedSegment === seg.segmentName 
                    ? "ring-2 ring-blue-500 bg-white shadow-sm border-blue-200" 
                    : "bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span 
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: seg.color }}
                    >
                      {seg.segmentName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      {seg.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 line-clamp-1" title={seg.fullName}>
                    {seg.fullName}
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    {new Intl.NumberFormat('id-ID').format(seg.total)}
                  </span>
                  <span className="text-[10px] text-slate-400">interaksi</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* TAB 1: CARDS & COMPOSITION */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            {/* Top Row: Visual Distribution & Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Detailed Segment Breakdown */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Peringkat & Kontribusi Segmen Peserta
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    Total: {new Intl.NumberFormat('id-ID').format(grandTotal)} Pemanfaatan
                  </span>
                </div>

                {segments.map((seg, idx) => {
                  const Icon = SEGMENT_ICONS[seg.segmentName] || Users;
                  return (
                    <div 
                      key={seg.segmentName}
                      className={cn(
                        "p-3.5 rounded-xl border transition-all hover:shadow-xs",
                        selectedSegment === seg.segmentName
                          ? "border-blue-300 bg-blue-50/40"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                            style={{ backgroundColor: seg.color }}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{seg.segmentName}</span>
                              <span className="text-[11px] text-slate-500 hidden sm:inline">— {seg.fullName}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{seg.description}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {new Intl.NumberFormat('id-ID').format(seg.total)}
                            </span>
                            <span 
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: seg.color }}
                            >
                              {seg.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            rata-rata {(seg.total / 7).toLocaleString('id-ID', { maximumFractionDigits: 0 })} / bln
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${seg.percentage}%`,
                            backgroundColor: seg.color 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right 5 Cols: Donut Chart & Insight Box */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-200 flex-1 flex flex-col items-center justify-center">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 self-start">
                    Proporsi Segmen Kepesertaan
                  </h4>

                  <div className="w-full h-56 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            `${new Intl.NumberFormat('id-ID').format(value)} (${((value / grandTotal) * 100).toFixed(1)}%)`,
                            name
                          ]}
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Donut Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Pemanfaatan</span>
                      <span className="text-base font-extrabold text-slate-800">
                        {new Intl.NumberFormat('id-ID').format(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Micro Legend */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2 pt-3 border-t border-slate-200/80">
                    {segments.slice(0, 4).map(s => (
                      <div key={s.segmentName} className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-slate-600 truncate">{s.segmentName}</span>
                        <span className="font-bold text-slate-800 ml-auto">{s.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insight Card */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80">
                  <div className="flex items-start gap-2.5">
                    <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-blue-900">Insight Segmen Utama</h5>
                      <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                        Segmen <strong>PBPU (Peserta Mandiri)</strong> menjadi kelompok pemanfaat terbanyak dengan <strong>316.929 pemanfaatan (36,5%)</strong>, diikuti oleh <strong>PPU (Pekerja Swasta/BUMN)</strong> sebesar <strong>219.153 pemanfaatan (25,3%)</strong>. Bersama-sama, kedua kelompok pekerja ini menyumbang lebih dari <strong>61,8%</strong> dari total seluruh panggilan ke CC 165.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MONTHLY TRENDS */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Tren Pemanfaatan Segmen per Bulan (Jan – Jul 2026)</h4>
                <p className="text-xs text-slate-500">Pergerakan interaksi layanan 165 untuk setiap segmen peserta dari waktu ke waktu (Stacked Bar)</p>
              </div>
              <div className="text-xs text-slate-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                Puncak Pemanfaatan: <strong className="text-blue-700 font-bold">Januari (160.249) & Februari (158.425)</strong>
              </div>
            </div>

            <div className="w-full h-80 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="fullMonth" tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
                  <YAxis 
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <Tooltip 
                    formatter={(val: number, name: string) => [
                      new Intl.NumberFormat('id-ID').format(val),
                      name
                    ]}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" iconSize={8} />
                  <Bar dataKey="PBPU" name="PBPU (Mandiri)" stackId="a" fill="#2563eb" />
                  <Bar dataKey="PPU" name="PPU (Swasta/BUMN)" stackId="a" fill="#0d9488" />
                  <Bar dataKey="PBI APBN" name="PBI APBN" stackId="a" fill="#16a34a" />
                  <Bar dataKey="PBI APBD" name="PBI APBD" stackId="a" fill="#ca8a04" />
                  <Bar dataKey="PPU PN" name="PPU PN (ASN/TNI/POLRI)" stackId="a" fill="#7c3aed" />
                  <Bar dataKey="BP" name="Bukan Pekerja (BP)" stackId="a" fill="#ea580c" />
                  <Bar dataKey="Belum Terdaftar" name="Belum Terdaftar" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rincian Data per Bulan (Matriks Tabel & Kartu Bulanan) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Tabel Data Pemanfaatan per Bulan</span>
                <span className="text-[11px] text-slate-500 font-medium">Januari – Juli 2026</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/80 font-bold text-slate-700">
                      <th className="py-2.5 px-3">Bulan</th>
                      <th className="py-2.5 px-2 text-right text-blue-700">PBPU</th>
                      <th className="py-2.5 px-2 text-right text-teal-700">PPU</th>
                      <th className="py-2.5 px-2 text-right text-emerald-700">PBI APBN</th>
                      <th className="py-2.5 px-2 text-right text-yellow-700">PBI APBD</th>
                      <th className="py-2.5 px-2 text-right text-purple-700">PPU PN</th>
                      <th className="py-2.5 px-2 text-right text-orange-700">BP</th>
                      <th className="py-2.5 px-2 text-right text-slate-600">Belum Terdaftar</th>
                      <th className="py-2.5 px-3 text-right font-extrabold text-slate-900 bg-slate-100">Total Bulan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {monthlyChartData.map((row) => (
                      <tr key={row.fullMonth} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{row.fullMonth}</td>
                        <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row.PBPU)}</td>
                        <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row.PPU)}</td>
                        <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row['PBI APBN'])}</td>
                        <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row['PBI APBD'])}</td>
                        <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row['PPU PN'])}</td>
                        <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row.BP)}</td>
                        <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row['Belum Terdaftar'])}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-blue-700 bg-blue-50/30">
                          {new Intl.NumberFormat('id-ID').format(row.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 bg-slate-100/90 font-extrabold text-slate-900">
                      <td className="py-2.5 px-3">Total Akumulasi</td>
                      <td className="py-2.5 px-2 text-right text-blue-700">{new Intl.NumberFormat('id-ID').format(segments.find(s => s.segmentName === 'PBPU')?.total || 0)}</td>
                      <td className="py-2.5 px-2 text-right text-teal-700">{new Intl.NumberFormat('id-ID').format(segments.find(s => s.segmentName === 'PPU')?.total || 0)}</td>
                      <td className="py-2.5 px-2 text-right text-emerald-700">{new Intl.NumberFormat('id-ID').format(segments.find(s => s.segmentName === 'PBI APBN')?.total || 0)}</td>
                      <td className="py-2.5 px-2 text-right text-yellow-700">{new Intl.NumberFormat('id-ID').format(segments.find(s => s.segmentName === 'PBI APBD')?.total || 0)}</td>
                      <td className="py-2.5 px-2 text-right text-purple-700">{new Intl.NumberFormat('id-ID').format(segments.find(s => s.segmentName === 'PPU PN')?.total || 0)}</td>
                      <td className="py-2.5 px-2 text-right text-orange-700">{new Intl.NumberFormat('id-ID').format(segments.find(s => s.segmentName === 'BP')?.total || 0)}</td>
                      <td className="py-2.5 px-2 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(segments.find(s => s.segmentName === 'Belum Terdaftar')?.total || 0)}</td>
                      <td className="py-2.5 px-3 text-right text-blue-900 bg-blue-100/50">
                        {new Intl.NumberFormat('id-ID').format(grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REGIONAL DISTRIBUTION */}
        {activeTab === 'regional' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Distribusi Segmen di 12 Kedeputian Wilayah</h4>
                <p className="text-xs text-slate-500">Analisis profil peserta yang mengakses layanan 165 di masing-masing wilayah</p>
              </div>

              {/* Segment filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Urutkan Berdasarkan:</span>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="WILAYAH">Kedeputian Wilayah I s.d. XII (Urutan Wilayah)</option>
                  <option value="TOTAL_DESC">Total Pemanfaatan Terbanyak</option>
                  {segments.map(s => (
                    <option key={s.segmentName} value={s.segmentName}>{s.segmentName} ({s.fullName})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {sortedRegional.map((reg) => {
                const romanIdx = getKedeputianWilayahIndex(reg.kedeputianWilayah);
                return (
                  <div key={reg.kedeputianWilayah} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {romanIdx < 999 && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                            Wilayah {reg.romanId || romanIdx}
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-900 truncate">{reg.kedeputianWilayah}</span>
                      </div>
                      <span className="text-xs font-extrabold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-200 shrink-0 ml-2">
                        {new Intl.NumberFormat('id-ID').format(reg.total)}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3">
                      {segments.slice(0, 5).map(s => {
                        const val = (reg as any)[s.segmentName] || 0;
                        const pct = reg.total > 0 ? (val / reg.total) * 100 : 0;
                        return (
                          <div key={s.segmentName} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 flex items-center gap-1.5 truncate">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                              <span className="truncate">{s.segmentName}</span>
                            </span>
                            <span className="font-semibold text-slate-800 shrink-0 ml-2">
                              {new Intl.NumberFormat('id-ID').format(val)} <span className="text-[10px] text-slate-400 font-normal">({pct.toFixed(0)}%)</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: COMPREHENSIVE DATA TABLE */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Kedeputian Wilayah</th>
                  <th className="py-2.5 px-2 text-right">PBI APBN</th>
                  <th className="py-2.5 px-2 text-right">PBI APBD</th>
                  <th className="py-2.5 px-2 text-right bg-blue-50/80 text-blue-800">PBPU (Mandiri)</th>
                  <th className="py-2.5 px-2 text-right">PPU PN</th>
                  <th className="py-2.5 px-2 text-right bg-teal-50/80 text-teal-800">PPU (Swasta)</th>
                  <th className="py-2.5 px-2 text-right">BP</th>
                  <th className="py-2.5 px-2 text-right">Belum Terdaftar</th>
                  <th className="py-2.5 px-3 text-right bg-slate-200 text-slate-900">Total</th>
                  <th className="py-2.5 px-2 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableRows.map((row) => (
                  <tr key={row.kedeputianWilayah} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{row.kedeputianWilayah}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{new Intl.NumberFormat('id-ID').format(row['PBI APBN'])}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{new Intl.NumberFormat('id-ID').format(row['PBI APBD'])}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-blue-700 bg-blue-50/30">{new Intl.NumberFormat('id-ID').format(row['PBPU'])}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{new Intl.NumberFormat('id-ID').format(row['PPU PN'])}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-teal-700 bg-teal-50/30">{new Intl.NumberFormat('id-ID').format(row['PPU'])}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{new Intl.NumberFormat('id-ID').format(row['BP'])}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{new Intl.NumberFormat('id-ID').format(row['Belum Terdaftar'])}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 bg-slate-100/60">
                      {new Intl.NumberFormat('id-ID').format(row.total)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-500">
                      {row.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/90 font-extrabold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-3 px-3">TOTAL NASIONAL</td>
                  <td className="py-3 px-2 text-right text-emerald-700">{new Intl.NumberFormat('id-ID').format(147854)}</td>
                  <td className="py-3 px-2 text-right text-amber-700">{new Intl.NumberFormat('id-ID').format(99161)}</td>
                  <td className="py-3 px-2 text-right text-blue-700 bg-blue-100/50">{new Intl.NumberFormat('id-ID').format(316929)}</td>
                  <td className="py-3 px-2 text-right text-purple-700">{new Intl.NumberFormat('id-ID').format(59294)}</td>
                  <td className="py-3 px-2 text-right text-teal-700 bg-teal-100/50">{new Intl.NumberFormat('id-ID').format(219153)}</td>
                  <td className="py-3 px-2 text-right text-orange-700">{new Intl.NumberFormat('id-ID').format(14834)}</td>
                  <td className="py-3 px-2 text-right text-slate-600">{new Intl.NumberFormat('id-ID').format(10607)}</td>
                  <td className="py-3 px-3 text-right text-blue-900 bg-blue-100/70 text-sm">
                    {new Intl.NumberFormat('id-ID').format(grandTotal)}
                  </td>
                  <td className="py-3 px-2 text-right">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
