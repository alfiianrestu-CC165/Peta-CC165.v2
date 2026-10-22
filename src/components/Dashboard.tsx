import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DataRow, CategoryBreakdownData, RegionalData, ParticipantSegmentData, SatisfactionSurveyData, SocialMediaData } from '../types';
import { 
  fetchSheetData, 
  fetchCategoryBreakdown, 
  fetchRegionalData, 
  fetchParticipantSegmentData, 
  fetchSatisfactionSurveyData, 
  DEFAULT_SATISFACTION_SURVEY_DATA,
  fetchSocialMediaData,
  DEFAULT_SOCIAL_MEDIA_DATA
} from '../lib/sheets';
import { 
  RefreshCw, 
  Search, 
  AlertCircle, 
  Database, 
  PhoneCall, 
  MessagesSquare, 
  Bell, 
  Award,
  Sparkles,
  Clock,
  LogOut,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceDashboard, LogItem } from './VoiceDashboard';
import { SocialMediaDashboard } from './SocialMediaDashboard';
import { getFormattedBuildTime } from '../lib/buildInfo';
import { AuthUser } from './LoginPage';
import { UserManagementModal } from './UserManagementModal';

export interface DashboardProps {
  user?: AuthUser | null;
  onLogout?: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps = {}) {
  const [data, setData] = useState<DataRow[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdownData>({
    informasi: [],
    pengaduan: [],
    permintaan: []
  });
  const [regionalData, setRegionalData] = useState<RegionalData>({
    regions: [],
    branches: [],
    provinces: [],
    totals: { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, total: 0 }
  });
  const [segmentData, setSegmentData] = useState<ParticipantSegmentData>({
    segments: [],
    monthlyData: [],
    regionalSegments: [],
    grandTotal: 0
  });
  const [surveyData, setSurveyData] = useState<SatisfactionSurveyData>(DEFAULT_SATISFACTION_SURVEY_DATA);
  const [socialData, setSocialData] = useState<SocialMediaData>(DEFAULT_SOCIAL_MEDIA_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);
  
  // Navigation Tabs: 'voice' | 'social'
  const [activeTab, setActiveTab] = useState<'voice' | 'social'>('voice');
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [socialRefreshing, setSocialRefreshing] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const lastUpdateTime = useMemo(() => getFormattedBuildTime(), []);
  
  const previousDataRef = useRef<string>('');

  const addLog = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(), title, message, type, time: new Date() }, ...prev].slice(0, 50));
  };

  const handleRefreshSocial = async () => {
    setSocialRefreshing(true);
    setNotification('Memperbarui data Media Sosial & VIKA dari sheet "Data Pemanfaatan Media Sosial"...');
    addLog('Medsos Refresh', 'Memulai sinkronisasi metrik kanal media sosial & VIKA dari Google Sheets.', 'info');
    
    try {
      const freshSocData = await fetchSocialMediaData();
      setSocialData(freshSocData);
      setNotification('Data Media Sosial & VIKA berhasil disinkronkan dari spreadsheet.');
      addLog('Medsos Sync', 'Semua kanal interaksi medsos (Instagram, FB, WA, X, TikTok, dll) & VIKA tersinkronisasi.', 'success');
    } catch (err: any) {
      addLog('Medsos Error', err?.message || 'Gagal memuat data live medsos, menggunakan data tersimpan.', 'warning');
    } finally {
      setSocialRefreshing(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const loadData = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      setError(null);
      const [rows, catBreakdown, regData, segData, survData, socData] = await Promise.all([
        fetchSheetData(),
        fetchCategoryBreakdown(),
        fetchRegionalData(),
        fetchParticipantSegmentData(),
        fetchSatisfactionSurveyData(),
        fetchSocialMediaData()
      ]);
      
      const newDataString = JSON.stringify({ rows, catBreakdown, regData, segData, survData, socData });
      
      // On first load, just set data, don't notify unless we had previous data
      if (previousDataRef.current === '') {
         previousDataRef.current = newDataString;
         addLog('Data Loaded', `${rows.length} data bulanan, Survei Kepuasan, 7 Segmen, & Media Sosial/VIKA dimuat dari Google Sheets.`, 'success');
      } else if (isPolling && previousDataRef.current !== newDataString) {
        setNotification('Data terbaru telah disinkronkan dari Google Sheets.');
        addLog('Sync Successful', 'Perubahan terbaru dari Google Sheets diperbarui secara otomatis.', 'success');
        setTimeout(() => setNotification(null), 5000);
        previousDataRef.current = newDataString;
      }
      
      setData(rows);
      setCategoryData(catBreakdown);
      setRegionalData(regData);
      setSegmentData(segData);
      setSurveyData(survData);
      setSocialData(socData);
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
    const useSummary = !searchTerm.trim() && summaryRow;
    const info = useSummary && summaryRow.informasi ? summaryRow.informasi : chartData.reduce((sum, item) => sum + (item.informasi || 0), 0);
    const req = useSummary && summaryRow.permintaan ? summaryRow.permintaan : chartData.reduce((sum, item) => sum + (item.permintaan || 0), 0);
    const comp = useSummary && summaryRow.pengaduan ? summaryRow.pengaduan : chartData.reduce((sum, item) => sum + (item.pengaduan || 0), 0);
    const total = useSummary && summaryRow.total ? summaryRow.total : (info + req + comp);

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

    const infoPct = Number(((info / total) * 100).toFixed(2));
    const reqPct = Number(((req / total) * 100).toFixed(2));
    const compPct = Number((100 - infoPct - reqPct).toFixed(2));

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
        
        {/* Header with Official Logos */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] z-10">
          {/* Official Brand Identity: BPJS Kesehatan */}
          <div className="flex items-center py-1">
            <img
              src="/images/logo-bpjs-kesehatan.svg"
              alt="BPJS Kesehatan"
              className="h-7 sm:h-9 w-auto max-w-[150px] sm:max-w-[210px] object-contain select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right Header Controls: Search, Notification, User & Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="relative w-40 sm:w-56 md:w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari berdasarkan bulan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-100/90 border border-transparent focus:border-blue-600 focus:bg-white rounded-lg text-xs sm:text-sm transition-all outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
              {notification && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              <Bell className="w-5 h-5" />
            </div>

            {/* Logged in User indicator */}
            {user && (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="hidden lg:flex flex-col text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[170px]">
                      {user.level === 'Administrator' ? 'Administrator' : user.unitKerja}
                    </span>
                    {user.level === 'Administrator' ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        ADMIN
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        USER
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {user.level === 'Administrator'
                      ? 'ID: ADMIN0000 • Hak Akses Penuh'
                      : `Kode: ${user.kode} • Hak Akses User`}
                  </span>
                </div>
                {user.level === 'Administrator' ? (
                  <button
                    onClick={() => setIsUserModalOpen(true)}
                    className="group relative flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100/90 to-amber-50 hover:from-amber-200 hover:to-amber-100 border border-amber-300 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    title="Klik untuk membuka Direktori Pengguna (Administrator)"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                      <ShieldCheck size={15} />
                    </div>
                    <span className="text-[11px] font-bold text-amber-900 group-hover:text-amber-950 flex items-center gap-1.5 whitespace-nowrap">
                      <span>Direktori Pengguna</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    </span>
                  </button>
                ) : (
                  <div 
                    className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 shadow-2xs"
                    title={`${user.unitKerja} (Kode: ${user.kode}) - Level: User`}
                  >
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar dari sistem"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* Top Title Bar & Tab Navigation */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">PETA Care Center 165</h1>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full border border-amber-400/30 shadow-sm shadow-slate-900/10 transition-all">
                  <Sparkles size={11} className="text-amber-400 shrink-0" />
                  <span className="text-[10.5px] font-semibold tracking-[0.15em] uppercase bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
                    Executive Summary Report
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-slate-500 text-sm font-medium">Pemanfaatan Data</p>
                <span className="text-slate-300 text-xs hidden sm:inline">•</span>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] leading-tight font-normal text-slate-400 bg-slate-50 border border-slate-200/50">
                  <Clock size={9} className="text-slate-400 shrink-0" />
                  <span>Last Update: {lastUpdateTime}</span>
                </div>
                {user && (
                  <>
                    <span className="text-slate-300 text-xs hidden sm:inline">•</span>
                    {user.level === 'Administrator' ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 shadow-2xs">
                        <ShieldCheck size={11} className="text-amber-600" />
                        <span>Akses: Administrator (PETA CC)</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium text-slate-700 bg-white border border-slate-200 shadow-2xs">
                        <Building2 size={11} className="text-blue-600" />
                        <span>Akses: User • {user.unitKerja} ({user.kode})</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

             <div className="flex flex-wrap items-center gap-3">
               {/* Menu Tabs: Voice & Media Sosial */}
               <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/60 shadow-inner">
                 <button
                   onClick={() => setActiveTab('voice')}
                   className={cn(
                     "flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
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
                     "flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                     activeTab === 'social'
                       ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                       : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                   )}
                 >
                   <MessagesSquare size={15} />
                   <span>Media Sosial</span>
                 </button>
               </div>

               {/* Refresh Data Button */}
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
              regionalData={regionalData}
              segmentData={segmentData}
              surveyData={surveyData}
            />
          ) : (
            <SocialMediaDashboard searchTerm={searchTerm} socialData={socialData} />
          )}

        </div>
      </main>

      {/* Administrator User Management Directory Modal */}
      {user?.level === 'Administrator' && (
        <UserManagementModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          currentUser={user || undefined}
        />
      )}
    </div>
  );
}
