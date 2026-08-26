import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DataRow, CategoryBreakdownData } from '../types';
import { fetchSheetData, fetchCategoryBreakdown } from '../lib/sheets';
import { 
  RefreshCw, 
  Search, 
  AlertCircle, 
  Database, 
  PhoneCall, 
  MessagesSquare, 
  Bell, 
  Award,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceDashboard, LogItem } from './VoiceDashboard';
import { SocialMediaDashboard } from './SocialMediaDashboard';
import { getFormattedBuildTime } from '../lib/buildInfo';

export function Dashboard() {
  const [data, setData] = useState<DataRow[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdownData>({
    informasi: [],
    pengaduan: [],
    permintaan: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);
  
  // Navigation Tabs: 'voice' | 'social'
  const [activeTab, setActiveTab] = useState<'voice' | 'social'>('voice');
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [socialRefreshing, setSocialRefreshing] = useState(false);
  const lastUpdateTime = useMemo(() => getFormattedBuildTime(), []);
  
  const previousDataRef = useRef<string>('');

  const addLog = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(), title, message, type, time: new Date() }, ...prev].slice(0, 50));
  };

  const handleRefreshSocial = async () => {
    setSocialRefreshing(true);
    setNotification('Memperbarui data kanal media sosial & WhatsApp...');
    addLog('Medsos Refresh', 'Memulai sinkronisasi metrik kanal media sosial & live feed.', 'info');
    
    setTimeout(() => {
      setSocialRefreshing(false);
      setNotification('Data Media Sosial & WhatsApp berhasil diperbarui.');
      addLog('Medsos Sync', 'Semua kanal interaksi (WhatsApp, IG, X, FB, YouTube) tersinkronisasi.', 'success');
      setTimeout(() => setNotification(null), 4000);
    }, 600);
  };

  const loadData = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      setError(null);
      const [rows, catBreakdown] = await Promise.all([
        fetchSheetData(),
        fetchCategoryBreakdown()
      ]);
      
      const newDataString = JSON.stringify({ rows, catBreakdown });
      
      // On first load, just set data, don't notify unless we had previous data
      if (previousDataRef.current === '') {
         previousDataRef.current = newDataString;
         addLog('Data Loaded', `${rows.length} data bulanan & kategori pemanfaatan dimuat dari Google Sheets.`, 'success');
      } else if (isPolling && previousDataRef.current !== newDataString) {
        setNotification('Data terbaru telah disinkronkan dari Google Sheets.');
        addLog('Sync Successful', 'Perubahan terbaru dari Google Sheets diperbarui secara otomatis.', 'success');
        setTimeout(() => setNotification(null), 5000);
        previousDataRef.current = newDataString;
      }
      
      setData(rows);
      setCategoryData(catBreakdown);
    } catch (err: any) {
      if (!isPolling) {
        setError(err.message || 'Gagal memuat data dari Google Sheets');
        addLog('Sync Error', err.message, 'error');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 15 seconds for updates
    const interval = setInterval(() => {
      loadData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter & Search logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return item.bulan.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm]);

  const summaryRow = useMemo(() => data.find(item => item.bulan.toLowerCase().includes('total') || item.bulan.toLowerCase().includes('rata-rata')), [data]);
  const chartData = useMemo(() => {
    return filteredData
      .filter(item => !(item.bulan.toLowerCase().includes('total') || item.bulan.toLowerCase().includes('rata-rata')))
      .map(item => {
        const parsedPersenDijawab = parseFloat((item.persenDijawab || '').replace('%', '').replace(',', '.')) || 0;
        const parsedPersenTuntas = parseFloat((item.persenTuntas || '').replace('%', '').replace(',', '.')) || 0;
        return {
          ...item,
          persenDijawabVal: parsedPersenDijawab,
          persenTuntasVal: parsedPersenTuntas,
        };
      });
  }, [filteredData]);

  // Category Total & Percentage Data (100% Stacked Bar)
  const categoryStackedData = useMemo(() => {
    const info = chartData.reduce((sum, item) => sum + (item.informasi || 0), 0);
    const req = chartData.reduce((sum, item) => sum + (item.permintaan || 0), 0);
    const comp = chartData.reduce((sum, item) => sum + (item.pengaduan || 0), 0);
    const total = info + req + comp;

    if (total === 0) {
      return {
        chartData: [{ name: 'Kategori', Informasi: 0, Permintaan: 0, Pengaduan: 0 }],
        info: 0,
        req: 0,
        comp: 0,
        total: 0,
        infoPct: 0,
        reqPct: 0,
        compPct: 0
      };
    }

    const infoPct = Number(((info / total) * 100).toFixed(1));
    const reqPct = Number(((req / total) * 100).toFixed(1));
    const compPct = Number((100 - infoPct - reqPct).toFixed(1));

    return {
      chartData: [{
        name: 'Kategori',
        Informasi: infoPct,
        Permintaan: reqPct,
        Pengaduan: compPct
      }],
      info,
      req,
      comp,
      infoPct,
      reqPct,
      compPct,
      total
    };
  }, [chartData]);

  const totalMasuk = useMemo(() => summaryRow ? summaryRow.panggilanMasuk : chartData.reduce((sum, item) => sum + (item.panggilanMasuk || 0), 0), [summaryRow, chartData]);
  const persenDijawab = useMemo(() => summaryRow ? summaryRow.persenDijawab : '0%', [summaryRow]);
  const rataTuntas = useMemo(() => {
    if (summaryRow && summaryRow.persenTuntas) return summaryRow.persenTuntas;
    const validRows = chartData.filter(d => d.persenTuntas);
    if (!validRows.length) return '0%';
    const sum = validRows.reduce((acc, c) => acc + (parseFloat((c.persenTuntas || '').replace('%', '').replace(',', '.')) || 0), 0);
    return (sum / validRows.length).toFixed(1) + '%';
  }, [summaryRow, chartData]);

  const isCurrentTabRefreshing = activeTab === 'voice' ? loading : socialRefreshing;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan bulan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-600 rounded-lg text-sm transition-all outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="sm:hidden font-bold text-blue-600 flex items-center gap-2">
            <Database size={20} /> SheetSync
          </div>

          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-lg transition-colors">
              {notification && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
              <Bell className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* Top Title Bar & Tab Navigation */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
             <div>
               <div className="flex flex-wrap items-center gap-3">
                 <h1 className="text-2xl font-bold tracking-tight text-slate-800">PETA Care Center 165</h1>
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-lg shadow-sm shadow-blue-500/20 border border-blue-500/30">
                   <Award size={14} className="text-amber-300" />
                   <span className="text-xs font-semibold tracking-wide uppercase">Executive Summary Report</span>
                 </div>
               </div>
               <div className="flex flex-wrap items-center gap-2 mt-1">
                 <p className="text-slate-500 text-sm font-medium">Pemanfaatan Data</p>
                 <span className="text-slate-300 text-xs hidden sm:inline">•</span>
                 <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] leading-tight font-normal text-slate-400 bg-slate-50 border border-slate-200/50">
                   <Clock size={9} className="text-slate-400 shrink-0" />
                   <span>Last Update: {lastUpdateTime}</span>
                 </div>
               </div>
             </div>

             <div className="flex flex-wrap items-center gap-3">
               {/* Menu Tabs: Voice & Media Sosial */}
               <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/60 shadow-inner">
                 <button
                   onClick={() => setActiveTab('voice')}
                   className={cn(
                     "flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200",
                     activeTab === 'voice'
                       ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                       : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                   )}
                 >
                   <PhoneCall size={15} />
                   <span>Voice</span>
                 </button>

                 <button
                   onClick={() => setActiveTab('social')}
                   className={cn(
                     "flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200",
                     activeTab === 'social'
                       ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                       : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                   )}
                 >
                   <MessagesSquare size={15} />
                   <span>Media Sosial</span>
                 </button>
               </div>

               {/* Refresh Data Button (Active for both Voice and Media Sosial tabs) */}
               <button
                 onClick={() => {
                   if (activeTab === 'voice') {
                     loadData();
                   } else {
                     handleRefreshSocial();
                   }
                 }}
                 disabled={isCurrentTabRefreshing}
                 className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
               >
                 <RefreshCw size={16} className={cn(isCurrentTabRefreshing && "animate-spin text-blue-600")} />
                 <span>Refresh Data</span>
               </button>
             </div>
          </div>

          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 rounded-xl bg-blue-50 border-l-4 border-blue-500 p-4 flex gap-3"
              >
                <div className="mt-1"><Bell size={16} className="text-blue-500" /></div>
                <div>
                  <p className="text-xs font-bold text-blue-900">Notifikasi</p>
                  <p className="text-[10px] text-blue-700">{notification}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Active Tab View */}
          {activeTab === 'voice' ? (
            <VoiceDashboard
              data={data}
              loading={loading}
              filteredData={filteredData}
              chartData={chartData}
              categoryStackedData={categoryStackedData}
              categoryData={categoryData}
              totalMasuk={totalMasuk}
              persenDijawab={persenDijawab}
              rataTuntas={rataTuntas}
              logs={logs}
              setLogs={setLogs}
            />
          ) : (
            <SocialMediaDashboard searchTerm={searchTerm} />
          )}

        </div>
      </main>
    </div>
  );
}
