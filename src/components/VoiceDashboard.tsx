import React, { useState } from 'react';
import { DataRow, CategoryBreakdownData } from '../types';
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
  FileSpreadsheet
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
  LabelList 
} from 'recharts';
import { cn } from '../lib/utils';
import { CategoryBreakdown } from './CategoryBreakdown';

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
}: VoiceDashboardProps) {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Panggilan Masuk */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Panggilan Masuk</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-1.5 text-slate-800 tracking-tight">
                {new Intl.NumberFormat('id-ID').format(totalMasuk)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <PhoneIncoming size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Akumulasi Panggilan Masuk
          </div>
        </div>

        {/* Success Call Ratio */}
        <div className="bg-blue-600 p-4 sm:p-5 rounded-xl shadow-sm text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-[11px] font-semibold uppercase opacity-85 tracking-wider">Success Call Ratio</h3>
            <p className="text-2xl sm:text-3xl font-bold mt-1.5 tracking-tight">{persenDijawab}</p>
          </div>
          <div className="relative z-10 flex items-center gap-1.5 text-[11px] opacity-90 mt-3">
            <Activity size={13} />
            Panggilan Dijawab Petugas
          </div>
          <div className="absolute -right-3 -bottom-3 opacity-15 scale-110 transform rotate-12 pointer-events-none">
            <PhoneCall size={90} />
          </div>
        </div>

        {/* Rata-rata % Tuntas */}
        <div className="bg-emerald-600 p-4 sm:p-5 rounded-xl shadow-sm text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-[11px] font-semibold uppercase opacity-85 tracking-wider">Rata-rata % Tuntas</h3>
            <p className="text-2xl sm:text-3xl font-bold mt-1.5 tracking-tight">{rataTuntas}</p>
          </div>
          <div className="relative z-10 flex items-center gap-1.5 text-[11px] opacity-90 mt-3">
            <CheckCircle2 size={13} />
            Tuntas pada Layanan CC 165
          </div>
          <div className="absolute -right-3 -bottom-3 opacity-15 scale-110 transform rotate-12 pointer-events-none">
            <ShieldCheck size={90} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 100% Stacked Bar Chart Kategori Layanan */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
              <Database size={16} className="text-indigo-600" /> Komposisi Kategori Layanan
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
              100% Stacked Bar
            </span>
          </div>
          
          <div className="w-full h-16 my-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryStackedData.chartData}
                margin={{ top: 2, right: 4, left: 4, bottom: 2 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  hide
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  hide
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const count = name === 'Informasi' ? categoryStackedData.info : name === 'Permintaan' ? categoryStackedData.req : categoryStackedData.comp;
                    return [`${value}% (${new Intl.NumberFormat('id-ID').format(count)})`, name];
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '2px' }}
                />
                <Bar dataKey="Informasi" name="Informasi" stackId="kategori" fill="#3b82f6" radius={[6, 0, 0, 6]} barSize={28}>
                  <LabelList
                    dataKey="Informasi"
                    position="center"
                    formatter={(val: number) => val > 7 ? `${val}%` : ''}
                    style={{ fontSize: '11px', fontWeight: 700, fill: '#ffffff' }}
                  />
                </Bar>
                <Bar dataKey="Permintaan" name="Permintaan" stackId="kategori" fill="#10b981" barSize={28}>
                  <LabelList
                    dataKey="Permintaan"
                    position="center"
                    formatter={(val: number) => val > 7 ? `${val}%` : ''}
                    style={{ fontSize: '11px', fontWeight: 700, fill: '#ffffff' }}
                  />
                </Bar>
                <Bar dataKey="Pengaduan" name="Pengaduan" stackId="kategori" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={28}>
                  <LabelList
                    dataKey="Pengaduan"
                    position="center"
                    formatter={(val: number) => val > 7 ? `${val}%` : ''}
                    style={{ fontSize: '11px', fontWeight: 700, fill: '#ffffff' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend & Summary Cards */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
            <div className="bg-blue-50/70 py-1 px-1.5 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-[10px] font-semibold text-slate-700">Informasi</span>
              </div>
              <p className="text-xs font-bold text-blue-700 leading-tight">{categoryStackedData.infoPct}%</p>
              <p className="text-[9px] text-slate-500 mt-0.5">{new Intl.NumberFormat('id-ID').format(categoryStackedData.info)}</p>
            </div>

            <div className="bg-emerald-50/70 py-1 px-1.5 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-semibold text-slate-700">Permintaan</span>
              </div>
              <p className="text-xs font-bold text-emerald-700 leading-tight">{categoryStackedData.reqPct}%</p>
              <p className="text-[9px] text-slate-500 mt-0.5">{new Intl.NumberFormat('id-ID').format(categoryStackedData.req)}</p>
            </div>

            <div className="bg-amber-50/70 py-1 px-1.5 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="text-[10px] font-semibold text-slate-700">Pengaduan</span>
              </div>
              <p className="text-xs font-bold text-amber-700 leading-tight">{categoryStackedData.compPct}%</p>
              <p className="text-[9px] text-slate-500 mt-0.5">{new Intl.NumberFormat('id-ID').format(categoryStackedData.comp)}</p>
            </div>
          </div>
        </div>

        {/* Line Chart Panggilan Masuk */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
              <Activity size={16} className="text-blue-600" /> Tren Panggilan Masuk per Bulan
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
              Volume Bulanan
            </span>
          </div>
          <div className="w-full h-44 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={5} />
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
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
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
              {filteredData.length} Bulan
            </span>
          </div>

          {/* Quick toggle for system logs */}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200"
          >
            <Clock size={13} />
            <span>Log Sistem ({logs.length})</span>
            {showLogs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px] xl:min-w-full">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                <th className="px-2.5 py-2.5 text-center">Bulan</th>
                <th className="px-2 py-2.5 text-center">Panggilan Masuk</th>
                <th className="px-2 py-2.5 text-center">Panggilan Dijawab</th>
                <th className="px-2 py-2.5 text-center">% Dijawab</th>
                <th className="px-2 py-2.5 text-center">Avg Waktu</th>
                <th className="px-2 py-2.5 text-center">&lt;20 Detik</th>
                <th className="px-2 py-2.5 text-center">Informasi</th>
                <th className="px-2 py-2.5 text-center">Permintaan</th>
                <th className="px-2 py-2.5 text-center">Pengaduan</th>
                <th className="px-2 py-2.5 text-center">Tuntas</th>
                <th className="px-2 py-2.5 text-center">% Tuntas</th>
                <th className="px-2 py-2.5 text-center">Disposisi</th>
                <th className="px-2 py-2.5 text-center">% Disposisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-6 text-center text-slate-500 font-medium">Memuat data dari Google Sheets...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-6 text-center text-slate-500 font-medium">Tidak ada data ditemukan</td>
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
                      <td className="px-2.5 py-1.5 font-medium whitespace-nowrap text-slate-900">{row.bulan}</td>
                      <td className="px-2 py-1.5 text-right font-medium">{new Intl.NumberFormat('id-ID').format(row.panggilanMasuk)}</td>
                      <td className="px-2 py-1.5 text-right text-slate-700">{new Intl.NumberFormat('id-ID').format(row.panggilanDijawab)}</td>
                      <td className="px-2 py-1.5 text-right font-semibold text-blue-600">{row.persenDijawab}</td>
                      <td className="px-2 py-1.5 text-center text-slate-600 whitespace-nowrap">{row.rataWaktu}</td>
                      <td className="px-2 py-1.5 text-right text-emerald-600 font-medium">{row.dijawabKurang20}</td>
                      <td className="px-2 py-1.5 text-right">{new Intl.NumberFormat('id-ID').format(row.informasi)}</td>
                      <td className="px-2 py-1.5 text-right">{new Intl.NumberFormat('id-ID').format(row.permintaan)}</td>
                      <td className="px-2 py-1.5 text-right">{new Intl.NumberFormat('id-ID').format(row.pengaduan)}</td>
                      <td className="px-2 py-1.5 text-right font-medium">{new Intl.NumberFormat('id-ID').format(row.tuntas)}</td>
                      <td className="px-2 py-1.5 text-right font-bold text-emerald-600">{row.persenTuntas}</td>
                      <td className="px-2 py-1.5 text-right">{new Intl.NumberFormat('id-ID').format(row.disposisi)}</td>
                      <td className="px-2 py-1.5 text-right font-medium text-slate-600">{row.persenDisposisi}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
