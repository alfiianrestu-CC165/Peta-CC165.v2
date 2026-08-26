import React, { useState, useMemo } from 'react';
import { RegionalData, RegionalSummaryItem, BranchOfficeData } from '../types';
import { 
  MapPin, 
  Building2, 
  TrendingUp, 
  Search, 
  Filter, 
  BarChart3, 
  ChevronRight, 
  ArrowUpDown,
  Download,
  Layers,
  Sparkles,
  ChevronDown,
  Globe2,
  Calendar,
  Map as MapIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { IndonesiaBranchMap } from './IndonesiaBranchMap';

interface RegionalBreakdownProps {
  regionalData: RegionalData;
  loading?: boolean;
}

const REGION_COLORS = [
  '#2563eb', // KW I - Blue
  '#0284c7', // KW II - Sky
  '#0d9488', // KW III - Teal
  '#059669', // KW IV - Emerald
  '#16a34a', // KW V - Green
  '#65a30d', // KW VI - Lime
  '#d97706', // KW VII - Amber
  '#ea580c', // KW VIII - Orange
  '#dc2626', // KW IX - Red
  '#9333ea', // KW X - Purple
  '#4f46e5', // KW XI - Indigo
  '#0891b2'  // KW XII - Cyan
];

export function RegionalBreakdown({ regionalData, loading }: RegionalBreakdownProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('total');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof BranchOfficeData>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [activeTab, setActiveTab] = useState<'map' | 'ranking' | 'monthly' | 'provinces'>('map');

  const { regions = [], branches = [], provinces = [], totals } = regionalData;

  // Extract all unique provinces
  const allProvinces = useMemo(() => {
    const set = new Set<string>();
    branches.forEach(b => {
      if (b.provinsi) set.add(b.provinsi);
    });
    return Array.from(set).sort();
  }, [branches]);

  // Ranked regions for chart
  const rankedRegions = useMemo(() => {
    return [...regions].sort((a, b) => {
      if (selectedMonth === 'total') return b.total - a.total;
      return ((b as any)[selectedMonth] || 0) - ((a as any)[selectedMonth] || 0);
    });
  }, [regions, selectedMonth]);

  // Highest contributing region
  const topRegion = useMemo(() => {
    if (regions.length === 0) return null;
    return [...regions].sort((a, b) => b.total - a.total)[0];
  }, [regions]);

  // Monthly aggregated trend data
  const monthlyTrendData = useMemo(() => {
    return [
      { bulan: 'Januari', pemanfaatan: totals.januari },
      { bulan: 'Februari', pemanfaatan: totals.februari },
      { bulan: 'Maret', pemanfaatan: totals.maret },
      { bulan: 'April', pemanfaatan: totals.april },
      { bulan: 'Mei', pemanfaatan: totals.mei },
      { bulan: 'Juni', pemanfaatan: totals.juni },
      { bulan: 'Juli', pemanfaatan: totals.juli },
    ];
  }, [totals]);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      // Region filter
      if (selectedRegion !== 'ALL' && b.kedeputianWilayah !== selectedRegion) {
        return false;
      }
      // Province filter
      if (selectedProvince !== 'ALL' && b.provinsi !== selectedProvince) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKc = b.kantorCabang.toLowerCase().includes(q);
        const matchKw = b.kedeputianWilayah.toLowerCase().includes(q);
        const matchProv = b.provinsi.toLowerCase().includes(q);
        if (!matchKc && !matchKw && !matchProv) return false;
      }
      return true;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
      }
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      return sortDirection === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
    });
  }, [branches, selectedRegion, selectedProvince, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage) || 1;
  const paginatedBranches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(start, start + itemsPerPage);
  }, [filteredBranches, currentPage, itemsPerPage]);

  const handleSort = (field: keyof BranchOfficeData) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCsv = () => {
    const headers = ['No', 'Kantor Cabang', 'Kedeputian Wilayah', 'Provinsi', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Total'];
    const rows = filteredBranches.map((b, i) => [
      i + 1,
      `"${b.kantorCabang}"`,
      `"${b.kedeputianWilayah}"`,
      `"${b.provinsi}"`,
      b.januari,
      b.februari,
      b.maret,
      b.april,
      b.mei,
      b.juni,
      b.juli,
      b.total
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pemanfaatan_Kedeputian_Wilayah_CC165.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Metrics / Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pemanfaatan */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Pemanfaatan Wilayah
              </span>
              <div className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900 tracking-tight">
                {new Intl.NumberFormat('id-ID').format(totals.total)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe2 size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Periode Januari s.d. Juli 2026
          </div>
        </div>

        {/* Kedeputian Tertinggi */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-4 rounded-xl shadow-xs text-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-blue-200">
                Kedeputian Wilayah Tertinggi
              </span>
              <div className="text-xl font-bold mt-1 tracking-tight truncate max-w-[200px]">
                {topRegion?.kedeputianWilayah || 'KEDEPUTIAN WILAYAH V'}
              </div>
              <div className="text-xs text-blue-100 mt-0.5">
                {new Intl.NumberFormat('id-ID').format(topRegion?.total || 0)} pemanfaatan ({topRegion?.percentage.toFixed(1)}%)
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-blue-200 flex items-center gap-1">
            <Building2 size={12} />
            <span>Wilayah Jawa Barat ({topRegion?.branchCount || 14} KC)</span>
          </div>
        </div>

        {/* Cakupan Kedeputian */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Cakupan Wilayah
              </span>
              <div className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900 tracking-tight">
                {regions.length || 12}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Kedeputian Wilayah I s.d. XII
          </div>
        </div>

        {/* Jumlah Kantor Cabang */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Kantor Cabang
              </span>
              <div className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900 tracking-tight">
                {branches.length || 126}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Tersebar di {allProvinces.length} Provinsi
          </div>
        </div>
      </div>

      {/* Main Visuals & Comparison Section */}
      {activeTab === 'map' ? (
        <div className="space-y-4">
          <IndonesiaBranchMap
            branches={branches}
            regions={regions}
            selectedRegionFilter={selectedRegion}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Ranked Bar Chart or Monthly Chart */}
          <div className="lg:col-span-8 bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-600" />
                  Peringkat Pemanfaatan per Kedeputian Wilayah
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total volume dan kontribusi pemanfaatan data CC 165 di seluruh 12 Kedeputian Wilayah
                </p>
              </div>

              {/* Visual View Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs">
                <button
                  onClick={() => setActiveTab('map')}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer",
                    activeTab === 'map' ? "bg-white text-blue-600 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <MapIcon size={13} />
                  <span>Peta Indonesia</span>
                </button>
                <button
                  onClick={() => setActiveTab('ranking')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer",
                    activeTab === 'ranking' ? "bg-white text-blue-600 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Peringkat Wilayah
                </button>
                <button
                  onClick={() => setActiveTab('monthly')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer",
                    activeTab === 'monthly' ? "bg-white text-blue-600 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Trend Bulanan
                </button>
                <button
                  onClick={() => setActiveTab('provinces')}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer",
                    activeTab === 'provinces' ? "bg-white text-blue-600 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Top Provinsi
                </button>
              </div>
            </div>

            {/* Chart Container */}
            <div className="w-full h-72 sm:h-80">
              {activeTab === 'ranking' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rankedRegions.map(r => ({
                      name: r.kedeputianWilayah.replace('KEDEPUTIAN WILAYAH', 'KW'),
                      fullName: r.kedeputianWilayah,
                      total: selectedMonth === 'total' ? r.total : (r as any)[selectedMonth] || 0,
                      pct: r.percentage,
                      branches: r.branchCount
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(v) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(v)}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 600, fill: '#334155' }}
                      width={50}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                            <div className="font-bold text-blue-300">{item.fullName}</div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Pemanfaatan:</span>
                              <span className="font-bold">{new Intl.NumberFormat('id-ID').format(item.total)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Kontribusi:</span>
                              <span className="font-bold text-emerald-400">{item.pct.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Jumlah Cabang:</span>
                              <span>{item.branches} Kantor Cabang</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar 
                      dataKey="total" 
                      radius={[0, 4, 4, 0]}
                      onClick={(data) => {
                        const found = regions.find(r => r.kedeputianWilayah.replace('KEDEPUTIAN WILAYAH', 'KW') === data.name);
                        if (found) {
                          setSelectedRegion(prev => prev === found.kedeputianWilayah ? 'ALL' : found.kedeputianWilayah);
                        }
                      }}
                    >
                      {rankedRegions.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={selectedRegion === entry.kedeputianWilayah ? '#1e40af' : REGION_COLORS[index % REGION_COLORS.length]} 
                          className="cursor-pointer transition-all hover:opacity-85"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'monthly' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={5} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(v) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(v)}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                            <div className="font-bold text-blue-300">Bulan {d.bulan} 2026</div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Pemanfaatan:</span>
                              <span className="font-bold text-white">{new Intl.NumberFormat('id-ID').format(d.pemanfaatan)}</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pemanfaatan" 
                      stroke="#2563eb" 
                      strokeWidth={3.5} 
                      dot={{ r: 4.5, strokeWidth: 2, fill: '#fff', stroke: '#2563eb' }}
                      activeDot={{ r: 7, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'provinces' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={provinces.slice(0, 10).map(p => ({
                      name: p.name.length > 14 ? p.name.substring(0, 12) + '...' : p.name,
                      fullName: p.name,
                      total: p.total,
                      region: p.region
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(v) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(v)}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 500, fill: '#334155' }}
                      width={85}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                            <div className="font-bold text-emerald-300">{item.fullName}</div>
                            <div className="text-[11px] text-slate-300">{item.region}</div>
                            <div className="flex justify-between gap-4 pt-1">
                              <span className="text-slate-300">Pemanfaatan:</span>
                              <span className="font-bold text-white">{new Intl.NumberFormat('id-ID').format(item.total)}</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="total" fill="#0d9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Right: Interactive Quick Region Selector Cards */}
          <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-600" />
                Pilih Kedeputian Wilayah
              </h4>
              {selectedRegion !== 'ALL' && (
                <button
                  onClick={() => setSelectedRegion('ALL')}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[300px] pr-1">
              {regions.map((reg, idx) => {
                const isSelected = selectedRegion === reg.kedeputianWilayah;
                return (
                  <div
                    key={reg.kedeputianWilayah}
                    onClick={() => {
                      setSelectedRegion(isSelected ? 'ALL' : reg.kedeputianWilayah);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between",
                      isSelected 
                        ? "bg-blue-50/80 border-blue-500 text-blue-900 shadow-2xs font-semibold" 
                        : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: REGION_COLORS[idx % REGION_COLORS.length] }}
                      />
                      <div className="truncate">
                        <div className="truncate text-[11px]">{reg.kedeputianWilayah}</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">
                          {reg.provinces.slice(0, 2).join(', ')} {reg.provinces.length > 2 ? `+${reg.provinces.length - 2}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <div className="text-[11px] font-bold text-slate-800">
                        {new Intl.NumberFormat('id-ID').format(reg.total)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {reg.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar for Branch Data Table */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-slate-700" />
            <h3 className="font-bold text-slate-800 text-sm">
              Data Lengkap Kantor Cabang & Wilayah
            </h3>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredBranches.length} Kantor Cabang
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Kantor Cabang, Wilayah, Provinsi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Kedeputian Wilayah */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-700 font-medium"
            >
              <option value="ALL">Semua Kedeputian Wilayah (12 Wilayah)</option>
              {regions.map(r => (
                <option key={r.kedeputianWilayah} value={r.kedeputianWilayah}>
                  {r.kedeputianWilayah} ({r.branchCount} KC)
                </option>
              ))}
            </select>
          </div>

          {/* Filter Provinsi */}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-700 font-medium"
            >
              <option value="ALL">Semua Provinsi ({allProvinces.length} Provinsi)</option>
              {allProvinces.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Items per page */}
          <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
            <span>Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-1 px-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={150}>Semua ({filteredBranches.length})</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th 
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                  onClick={() => handleSort('kantorCabang')}
                >
                  <div className="flex items-center gap-1">
                    <span>Kantor Cabang</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                  onClick={() => handleSort('kedeputianWilayah')}
                >
                  <div className="flex items-center gap-1">
                    <span>Kedeputian Wilayah</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                  onClick={() => handleSort('provinsi')}
                >
                  <div className="flex items-center gap-1">
                    <span>Provinsi</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-2.5 text-right font-medium text-slate-600">Jan</th>
                <th className="py-2.5 px-2.5 text-right font-medium text-slate-600">Feb</th>
                <th className="py-2.5 px-2.5 text-right font-medium text-slate-600">Mar</th>
                <th className="py-2.5 px-2.5 text-right font-medium text-slate-600">Apr</th>
                <th className="py-2.5 px-2.5 text-right font-medium text-slate-600">Mei</th>
                <th className="py-2.5 px-2.5 text-right font-medium text-slate-600">Jun</th>
                <th className="py-2.5 px-2.5 text-right font-medium text-slate-600">Jul</th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors font-bold text-slate-900 bg-blue-50/50"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total</span>
                    <ArrowUpDown size={11} className="text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBranches.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada data Kantor Cabang yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                paginatedBranches.map((b, idx) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr 
                      key={`${b.kantorCabang}-${b.kedeputianWilayah}`}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">
                        {globalIdx}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {b.kantorCabang}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {b.kedeputianWilayah}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {b.provinsi}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {new Intl.NumberFormat('id-ID').format(b.januari)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {new Intl.NumberFormat('id-ID').format(b.februari)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {new Intl.NumberFormat('id-ID').format(b.maret)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {new Intl.NumberFormat('id-ID').format(b.april)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {new Intl.NumberFormat('id-ID').format(b.mei)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {new Intl.NumberFormat('id-ID').format(b.juni)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {new Intl.NumberFormat('id-ID').format(b.juli)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold font-mono text-blue-700 bg-blue-50/30">
                        {new Intl.NumberFormat('id-ID').format(b.total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-slate-500">
            <div>
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBranches.length)} sampai{' '}
              {Math.min(currentPage * itemsPerPage, filteredBranches.length)} dari {filteredBranches.length} data
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-medium"
              >
                Sebelumnya
              </button>
              
              <span className="px-2 font-medium text-slate-700">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-medium"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
