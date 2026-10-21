import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Share2, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ThumbsUp, 
  Activity, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  Send,
  HelpCircle,
  AlertTriangle,
  Bot,
  Copy,
  Check,
  BarChart3,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialMediaData, MonthlySocialMediaRow, SocialMediaTopicsData } from '../types';
import { DEFAULT_SOCIAL_MEDIA_DATA, DEFAULT_SOCIAL_MEDIA_TOPICS } from '../lib/sheets';

export interface SocialMediaDashboardProps {
  searchTerm?: string;
  socialData?: SocialMediaData;
}

// Official Social Media SVG Logos
function InstagramLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad-share" cx="20%" cy="100%" r="120%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad-share)" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="15.8" cy="8.2" r="0.9" fill="#ffffff" />
    </svg>
  );
}

function FacebookLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path d="M14.5 12.5H12.5V19H9.8V12.5H8.5V10.2H9.8V8.7C9.8 7.3 10.5 6 12.8 6H14.8V8.3H13.4C12.7 8.3 12.5 8.7 12.5 9.2V10.2H14.8L14.5 12.5Z" fill="#ffffff" />
    </svg>
  );
}

function WhatsAppLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path d="M17.2 14.5C16.9 14.3 15.5 13.6 15.2 13.5C14.9 13.4 14.7 13.4 14.5 13.7C14.3 14 13.7 14.7 13.5 14.9C13.3 15.1 13.1 15.1 12.8 15C12.5 14.8 11.5 14.5 10.4 13.5C9.5 12.7 8.9 11.7 8.7 11.4C8.5 11.1 8.7 11 8.8 10.8C9 10.7 9.1 10.5 9.3 10.3C9.4 10.1 9.5 10 9.6 9.8C9.7 9.6 9.6 9.4 9.5 9.3C9.4 9.2 8.8 7.7 8.6 7.1C8.3 6.5 8.1 6.6 8 6.6H7.5C7.3 6.6 6.9 6.7 6.6 7C6.3 7.3 5.5 8.1 5.5 9.6C5.5 11.1 6.6 12.6 6.8 12.8C6.9 13 9 16.3 12.3 17.6C15.1 18.7 15.6 18.3 16.2 18.2C16.8 18.1 17.9 17.5 18.1 16.8C18.4 16.1 18.4 15.5 18.3 15.4C18.2 15.3 17.5 14.8 17.2 14.5Z" fill="#ffffff" />
    </svg>
  );
}

function XLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path d="M16.5 6H18.5L14.1 11L19.2 18H15.1L11.9 13.7L8.2 18H6.2L10.8 12.7L6 6H10.2L13.1 9.9L16.5 6ZM15.8 16.7H16.9L9.4 7.2H8.2L15.8 16.7Z" fill="#ffffff" />
    </svg>
  );
}

function TikTokLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#010101" />
      <path d="M15.8 9.2C15.1 9.2 14.5 8.9 14 8.5V14.1C14 16.3 12.2 18 10 18C7.8 18 6 16.2 6 14C6 11.8 7.8 10 10 10C10.2 10 10.4 10 10.6 10.1V12.2C10.4 12.1 10.2 12.1 10 12.1C8.9 12.1 8 13 8 14.1C8 15.2 8.9 16.1 10 16.1C11.1 16.1 12 15.2 12 14.1V6H14.1C14.2 7.1 15 8 16.1 8.1V9.2C16 9.2 15.9 9.2 15.8 9.2Z" fill="#25F4EE" />
      <path d="M16.1 8.8C15.3 8.8 14.6 8.5 14.1 8V14C14 16.2 12.2 18 10 18C8.8 18 7.7 17.5 7 16.7C7.8 17.3 8.8 17.7 9.8 17.7C12 17.7 13.8 15.9 13.8 13.7V6.2C14.5 7.1 15.5 7.7 16.7 7.8V6.8C15.7 6.6 14.9 5.8 14.8 4.8H12.7V12.8C12.4 12.4 11.9 12.1 11.3 12.1C10.2 12.1 9.3 13 9.3 14.1C9.3 15 9.9 15.7 10.7 16C10.2 15.8 9.8 15.3 9.8 14.6C9.8 13.5 10.7 12.6 11.8 12.6C12.3 12.6 12.7 12.8 13 13.1V6.2H14.8C14.9 7.2 15.7 8 16.7 8.2V8.8C16.5 8.8 16.3 8.8 16.1 8.8Z" fill="#FE2C55" opacity="0.85" />
    </svg>
  );
}

function YouTubeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path d="M18.8 9.2C18.7 8.6 18.2 8.1 17.6 7.9C16.5 7.6 12 7.6 12 7.6C12 7.6 7.5 7.6 6.4 7.9C5.8 8.1 5.3 8.6 5.2 9.2C4.9 10.3 4.9 12 4.9 12C4.9 12 4.9 13.7 5.2 14.8C5.3 15.4 5.8 15.9 6.4 16.1C7.5 16.4 12 16.4 12 16.4C12 16.4 16.5 16.4 17.6 16.1C18.2 15.9 18.7 15.4 18.8 14.8C19.1 13.7 19.1 12 19.1 12C19.1 12 19.1 10.3 18.8 9.2ZM10.5 14.1V9.9L14.2 12L10.5 14.1Z" fill="#ffffff" />
    </svg>
  );
}

function EmailLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#F59E0B" />
      <path d="M6 8.5C6 7.7 6.7 7 7.5 7H16.5C17.3 7 18 7.7 18 8.5V15.5C18 16.3 17.3 17 16.5 17H7.5C6.7 17 6 16.3 6 15.5V8.5Z" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M6.5 8.5L12 12.5L17.5 8.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThreadsLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 192 192" fill="none">
      <rect width="192" height="192" rx="44" fill="#000000" />
      <path 
        fill="#ffffff" 
        d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4148 44.745 97.2678 44.745 97.1207 44.745C83.8436 44.745 72.8252 50.1517 65.0441 60.4704C57.4819 70.4984 53.6493 84.819 53.9452 101.996C54.2492 119.537 60.1037 133.407 70.9231 142.235C80.2031 149.809 92.5192 153.284 106.666 152.282C118.892 151.415 129.549 146.953 137.409 139.38C143.766 133.254 147.886 125.132 149.336 115.824H135.041C133.447 122.251 130.34 127.674 125.803 131.791C120.088 136.968 112.569 139.756 103.58 140.108C91.4398 140.584 81.3325 137.381 74.2255 130.793C66.1966 123.352 61.9427 111.455 61.6841 95.8327C61.4542 81.9366 64.9123 70.4357 71.9546 61.9798C77.4087 55.4344 85.3414 51.5204 95.0347 51.5204C111.432 51.5204 121.758 61.916 123.003 81.6508C117.848 79.5229 111.752 78.431 104.838 78.431C86.7458 78.431 74.9392 88.9469 74.9392 105.158C74.9392 119.789 84.7954 129.538 98.7107 129.538C111.236 129.538 120.738 123.003 124.646 111.39C127.358 116.143 131.026 119.897 135.539 122.508C137.892 123.869 140.569 124.965 143.518 125.688C143.766 126.315 144.041 126.934 144.343 127.534C147.284 133.376 151.725 137.947 157.348 140.852V127.087C154.218 125.044 151.815 122.029 150.365 118.275C148.824 114.285 148.016 109.43 148.016 103.883C148.016 102.321 148.077 100.744 148.199 99.1673C148.337 97.4116 148.537 95.6637 148.799 93.9317H141.537V88.9883ZM110.158 119.988C101.583 119.988 95.8427 114.153 95.8427 105.776C95.8427 96.9531 102.368 91.247 111.691 91.247C116.035 91.247 120.047 92.0124 123.471 93.475C122.518 110.519 116.892 119.988 110.158 119.988Z"
      />
    </svg>
  );
}

// Map Official Social Media Accounts
const SOCIAL_ACCOUNTS: Record<string, { account: string; Logo: React.ComponentType<{ className?: string }> }> = {
  instagram: {
    account: '@bpjskesehatan_ri',
    Logo: InstagramLogo
  },
  facebook: {
    account: '@BPJSKesehatanRI',
    Logo: FacebookLogo
  },
  whatsapp: {
    account: '0811-10-165-165',
    Logo: WhatsAppLogo
  },
  x: {
    account: '@BPJSKesehatanRI',
    Logo: XLogo
  },
  tiktok: {
    account: '@bpjskesehatan_ri',
    Logo: TikTokLogo
  },
  youtube: {
    account: 'BPJS Kesehatan',
    Logo: YouTubeLogo
  },
  email: {
    account: 'carecenter@bpjs-kesehatan.co.id',
    Logo: EmailLogo
  },
  threads: {
    account: '@bpjskesehatan_ri',
    Logo: ThreadsLogo
  }
};

export function SocialMediaDashboard({ 
  searchTerm = '', 
  socialData = DEFAULT_SOCIAL_MEDIA_DATA 
}: SocialMediaDashboardProps) {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'all' | 'social' | 'vika'>('all');
  const [copied, setCopied] = useState(false);
  const [topicCategory, setTopicCategory] = useState<'all' | 'informasi' | 'pengaduan'>('all');

  const topicsData = socialData.topics || DEFAULT_SOCIAL_MEDIA_TOPICS;

  // Filter months by search query
  const filteredMonthly = useMemo(() => {
    if (!searchTerm.trim()) return socialData.monthly;
    const q = searchTerm.toLowerCase().trim();
    return socialData.monthly.filter(item => 
      item.bulan.toLowerCase().includes(q)
    );
  }, [socialData.monthly, searchTerm]);

  // Aggregate metrics based on filtered months
  const filteredTotals = useMemo(() => {
    const isFiltered = filteredMonthly.length !== socialData.monthly.length;
    if (!isFiltered) {
      return socialData.totals;
    }

    const fb = filteredMonthly.reduce((s, m) => s + m.facebook, 0);
    const ig = filteredMonthly.reduce((s, m) => s + m.instagram, 0);
    const x = filteredMonthly.reduce((s, m) => s + m.x, 0);
    const tiktok = filteredMonthly.reduce((s, m) => s + m.tiktok, 0);
    const threads = filteredMonthly.reduce((s, m) => s + m.threads, 0);
    const email = filteredMonthly.reduce((s, m) => s + m.email, 0);
    const youtube = filteredMonthly.reduce((s, m) => s + m.youtube, 0);
    const wa = filteredMonthly.reduce((s, m) => s + m.whatsapp, 0);
    const jumlah = fb + ig + x + tiktok + threads + email + youtube + wa;

    const vikaStatus = filteredMonthly.reduce((s, m) => s + m.vikaStatusKepesertaan, 0);
    const vikaTagihan = filteredMonthly.reduce((s, m) => s + m.vikaTagihanIuran, 0);
    const vikaTotal = vikaStatus + vikaTagihan;

    const totalSeconds = filteredMonthly.reduce((s, m) => s + m.responTimeSeconds, 0);
    const avgSec = filteredMonthly.length > 0 ? Math.round(totalSeconds / filteredMonthly.length) : 0;
    const mins = Math.floor(avgSec / 60);
    const secs = avgSec % 60;
    const avgResponTime = `0:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return {
      facebook: fb,
      instagram: ig,
      x,
      tiktok,
      threads,
      email,
      youtube,
      whatsapp: wa,
      jumlah,
      avgResponTime,
      avgResponTimeSeconds: avgSec,
      vikaStatusKepesertaan: vikaStatus,
      vikaTagihanIuran: vikaTagihan,
      vikaTotal,
      grandTotalDigital: jumlah + vikaTotal
    };
  }, [filteredMonthly, socialData]);

  // Format response time string like "0:06:35" to human-readable "6m 35s"
  const formatResponTimeHuman = (rtStr: string) => {
    if (!rtStr) return '0s';
    const parts = rtStr.split(':');
    if (parts.length === 3) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const s = parseInt(parts[2], 10);
      if (h > 0) return `${h}j ${m}m ${s}s`;
      return `${m}m ${s}s`;
    }
    return rtStr;
  };

  const handleCopyTable = () => {
    const headers = [
      'No', 'Bulan', 'Facebook', 'Instagram', 'X (Twitter)', 'TikTok', 'Threads', 'Email', 
      'YouTube', 'WhatsApp', 'Jumlah Medsos', 'Respon Time'
    ];
    const rows = filteredMonthly.map((m, idx) => [
      idx + 1, m.bulan, m.facebook, m.instagram, m.x, m.tiktok, m.threads, m.email,
      m.youtube, m.whatsapp, m.jumlah, m.responTime
    ].join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pie chart data for social channels
  const pieData = useMemo(() => {
    return socialData.channelSummary.map(ch => ({
      name: ch.name,
      value: ch.count,
      pct: ch.pct,
      color: ch.color
    }));
  }, [socialData.channelSummary]);

  // VIKA Pie data
  const vikaPieData = useMemo(() => {
    return [
      { name: 'Status Kepesertaan', value: filteredTotals.vikaStatusKepesertaan, color: '#2563eb', pct: socialData.percentages.vikaStatusKepesertaan },
      { name: 'Tagihan Iuran', value: filteredTotals.vikaTagihanIuran, color: '#10b981', pct: socialData.percentages.vikaTagihanIuran },
    ];
  }, [filteredTotals, socialData.percentages]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-900/90 via-slate-900 to-indigo-950 rounded-2xl text-white shadow-md border border-blue-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/40 border border-blue-400/30 text-blue-300">
            <Share2 size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg">
              Pemanfaatan Media Sosial &amp; Layanan Digital
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Data resmi Care Center 165 mencakup 8 kanal Media Sosial &amp; VIKA (Voice Interaktif JKN) periode Januari – September 2026.
            </p>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Interaksi Media Sosial */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Interaksi Medsos
              </span>
              <p className="text-3xl font-bold mt-1 text-slate-800">
                {new Intl.NumberFormat('id-ID').format(filteredTotals.jumlah)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Share2 size={22} />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Kanal Dominan:</span>
            <span className="font-bold text-pink-600">Instagram (72,61%)</span>
          </div>
        </div>

        {/* Rata-Rata Respon Time */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 p-5 rounded-2xl shadow-lg text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-100">
              Rata-Rata Respon Time
            </span>
            <p className="text-3xl font-bold mt-1">
              {formatResponTimeHuman(filteredTotals.avgResponTime)}
            </p>
          </div>
          <div className="relative z-10 mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-indigo-100">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              Waktu Respon Rata-rata
            </span>
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[11px]">
              {filteredTotals.avgResponTime}
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 scale-125 transform rotate-12 pointer-events-none">
            <Clock size={110} />
          </div>
        </div>

        {/* Total Interaksi VIKA */}
        <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-600 p-5 rounded-2xl shadow-lg text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
              Total VIKA (Interaktif JKN)
            </span>
            <p className="text-3xl font-bold mt-1">
              {new Intl.NumberFormat('id-ID').format(filteredTotals.vikaTotal)}
            </p>
          </div>
          <div className="relative z-10 mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100">
            <span>Status: {new Intl.NumberFormat('id-ID').format(filteredTotals.vikaStatusKepesertaan)} (81%)</span>
            <span>Tagihan: {new Intl.NumberFormat('id-ID').format(filteredTotals.vikaTagihanIuran)} (19%)</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 scale-125 transform rotate-12 pointer-events-none">
            <Bot size={110} />
          </div>
        </div>

        {/* Grand Total Interaksi Digital */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Grand Total Layanan Digital
              </span>
              <p className="text-3xl font-bold mt-1 text-emerald-600">
                {new Intl.NumberFormat('id-ID').format(filteredTotals.grandTotalDigital)}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity size={22} />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Medsos (359K) + VIKA (337K)</span>
            <span className="font-bold text-slate-700">9 Bulan 2026</span>
          </div>
        </div>
      </div>

      {/* View Filter Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('all')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              viewMode === 'all'
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Semua Layanan (Medsos &amp; VIKA)
          </button>
          <button
            onClick={() => setViewMode('social')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              viewMode === 'social'
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Media Sosial (8 Kanal)
          </button>
          <button
            onClick={() => setViewMode('vika')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              viewMode === 'vika'
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            VIKA (Voice Interaktif JKN)
          </button>
        </div>

        {searchTerm && (
          <div className="text-xs text-slate-500 px-2 flex items-center gap-1.5">
            <span>Filter bulan aktif:</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              "{searchTerm}"
            </span>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Chart: Tren Interaksi Bulanan */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                {viewMode === 'all' ? (
                  <BarChart3 size={18} className="text-blue-600" />
                ) : (
                  <TrendingUp size={18} className={viewMode === 'social' ? "text-blue-600" : "text-emerald-600"} />
                )}
                {viewMode === 'all' 
                  ? 'Tren Interaksi Media Sosial & VIKA' 
                  : viewMode === 'social' 
                    ? 'Tren Interaksi Media Sosial (8 Kanal) per Bulan' 
                    : 'Tren Interaksi VIKA (Voice Interaktif JKN) per Bulan'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Data resmi Care Center 165 (Januari s.d. September 2026)
              </p>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'all' ? (
                <BarChart data={filteredMonthly} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="bulan" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={8}
                    tickFormatter={(v) => v.replace(' 2026', '')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number, name: string) => [
                      new Intl.NumberFormat('id-ID').format(value),
                      name
                    ]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                  <Bar dataKey="jumlah" name="Total Medsos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vikaTotal" name="Total VIKA" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : viewMode === 'social' ? (
                <LineChart data={filteredMonthly} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="bulan" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={8}
                    tickFormatter={(v) => v.replace(' 2026', '')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number, name: string) => [
                      new Intl.NumberFormat('id-ID').format(value),
                      name
                    ]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#e1306c" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877f2" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="whatsapp" name="WhatsApp" stroke="#25d366" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="x" name="X (Twitter)" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#0891b2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="threads" name="Threads" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="email" name="Email" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="youtube" name="YouTube" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              ) : (
                <LineChart data={filteredMonthly} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="bulan" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={8}
                    tickFormatter={(v) => v.replace(' 2026', '')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number, name: string) => [
                      new Intl.NumberFormat('id-ID').format(value),
                      name
                    ]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="vikaStatusKepesertaan" name="Status Kepesertaan" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="vikaTagihanIuran" name="Tagihan Iuran" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="vikaTotal" name="Total VIKA" stroke="#0d9488" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share Kanal Media Sosial (Proporsi 8 Kanal) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                <Share2 size={18} className="text-pink-600" /> Share Kanal Medsos
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200">
                8 Kanal
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Proporsi interaksi per kanal dari total {new Intl.NumberFormat('id-ID').format(filteredTotals.jumlah)} interaksi
            </p>

            <div className="space-y-2.5">
              {socialData.channelSummary.map((ch, idx) => {
                const meta = SOCIAL_ACCOUNTS[ch.key];
                const LogoComponent = meta?.Logo;

                return (
                  <div 
                    key={idx} 
                    className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/90 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {LogoComponent && (
                          <div className="shrink-0 w-6 h-6 rounded-md overflow-hidden shadow-xs flex items-center justify-center">
                            <LogoComponent className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-800 leading-tight">
                              {ch.name}
                            </span>
                            {meta && (
                              <span className="text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs shrink-0">
                                {meta.account}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 text-xs">
                          {ch.pct}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Intl.NumberFormat('id-ID').format(ch.count)}
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: ch.pct, backgroundColor: ch.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Kanal Dominan:</span>
            <span className="font-bold text-pink-600">Instagram (260.959 / 72,61%)</span>
          </div>
        </div>

      </div>

      {/* Second Row: Kecepatan Respon Time & VIKA Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Grafik Respon Time Bulanan */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                <Clock size={18} className="text-indigo-600" /> Tren Kecepatan Respon Time (Medsos)
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Rata-rata: {filteredTotals.avgResponTime}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Waktu rata-rata penanganan tiket per bulan (Januari – September 2026)
            </p>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredMonthly} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="bulan" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={8}
                    tickFormatter={(v) => v.replace(' 2026', '')}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(s) => `${Math.floor(s / 60)}m`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(_val: any, _name: string, props: any) => [
                      props.payload.responTime,
                      'Respon Time'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="responTimeSeconds" 
                    name="Respon Time" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Respon Tercepat:</span>
            <span className="font-bold text-emerald-600">Januari (3m 07s) &amp; Agustus (3m 10s)</span>
          </div>
        </div>

        {/* VIKA Breakdown: Status Kepesertaan vs Tagihan Iuran */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                <Bot size={18} className="text-emerald-600" /> VIKA (Voice Interaktif JKN)
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Total: {new Intl.NumberFormat('id-ID').format(filteredTotals.vikaTotal)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Layanan interaktif otomasi suara untuk pengecekan status dan informasi tagihan iuran
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Status Kepesertaan */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-700 uppercase">
                    Status Kepesertaan
                  </span>
                  <span className="font-bold bg-blue-200/70 px-2 py-0.5 rounded text-blue-900 text-xs">
                    {socialData.percentages.vikaStatusKepesertaan}
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-2">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.vikaStatusKepesertaan)}
                </p>
              </div>

              {/* Tagihan Iuran */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase">
                    Informasi Tagihan Iuran
                  </span>
                  <span className="font-bold bg-emerald-200/70 px-2 py-0.5 rounded text-emerald-900 text-xs">
                    {socialData.percentages.vikaTagihanIuran}
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-900 mt-2">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.vikaTagihanIuran)}
                </p>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>Distribusi Layanan VIKA:</span>
                <span>81,07% vs 18,93%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-600 h-full" 
                  style={{ width: '81.07%' }} 
                  title="Status Kepesertaan: 81.07%" 
                />
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: '18.93%' }} 
                  title="Tagihan Iuran: 18.93%" 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Status Kepesertaan (273.358)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Tagihan Iuran (63.813)
                </span>
              </div>
            </div>

          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Bulan Tertinggi VIKA:</span>
            <span className="font-bold text-emerald-600">Februari 2026 (72.064 interaksi)</span>
          </div>
        </div>

      </div>

      {/* Top 5 Topik Layanan Media Sosial */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Sparkles size={18} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Top 5 Topik Layanan Media Sosial
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Data Resmi Medsos
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Daftar topik paling sering diajukan peserta melalui kanal media sosial untuk kategori Permintaan Informasi dan Pengaduan
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto shrink-0">
            <button
              onClick={() => setTopicCategory('all')}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                topicCategory === 'all'
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Semua (2 Kategori)
            </button>
            <button
              onClick={() => setTopicCategory('informasi')}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                topicCategory === 'informasi'
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Informasi (Top 5)
            </button>
            <button
              onClick={() => setTopicCategory('pengaduan')}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                topicCategory === 'pengaduan'
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Pengaduan (Top 5)
            </button>
          </div>
        </div>

        {/* 2-column Grid for Top 5 Informasi & Top 5 Pengaduan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: Top 5 Topik Informasi */}
          {(topicCategory === 'all' || topicCategory === 'informasi') && (
            <div className={cn(
              "bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between",
              topicCategory === 'informasi' && "lg:col-span-2"
            )}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                      Top 5 Permintaan Informasi
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Kategori Informasi
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Topik informasi dengan volume interaksi tertinggi dari peserta di seluruh kanal media sosial
                </p>

                <div className="space-y-3">
                  {topicsData.informasi.map((item) => (
                    <div 
                      key={item.rank}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 text-xs mb-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className={cn(
                            "shrink-0 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs",
                            item.rank === 1 ? "bg-amber-400 text-amber-950 border border-amber-300" :
                            item.rank === 2 ? "bg-slate-200 text-slate-800 border border-slate-300" :
                            item.rank === 3 ? "bg-amber-100 text-amber-900 border border-amber-200" :
                            "bg-slate-100 text-slate-600 border border-slate-200"
                          )}>
                            {item.rank}
                          </span>
                          <span className="font-semibold text-slate-800 leading-snug">
                            {item.topik}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-blue-900 text-xs bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-200/80">
                            {item.persen}
                          </span>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {item.formattedJumlah} interaksi
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500" 
                          style={{ width: `${Math.min(100, (item.persenVal / 16.05) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Topik Informasi Terbanyak:</span>
                <span className="font-bold text-blue-700">Kanal Layanan (39.014 / 16,05%)</span>
              </div>
            </div>
          )}

          {/* Card 2: Top 5 Topik Pengaduan */}
          {(topicCategory === 'all' || topicCategory === 'pengaduan') && (
            <div className={cn(
              "bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between",
              topicCategory === 'pengaduan' && "lg:col-span-2"
            )}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                      Top 5 Pengaduan Peserta
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    Kategori Pengaduan
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Keluhan dan kendala teknis yang paling banyak disampaikan peserta melalui media sosial
                </p>

                <div className="space-y-3">
                  {topicsData.pengaduan.map((item) => (
                    <div 
                      key={item.rank}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 text-xs mb-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className={cn(
                            "shrink-0 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs",
                            item.rank === 1 ? "bg-rose-500 text-white border border-rose-600" :
                            item.rank === 2 ? "bg-slate-200 text-slate-800 border border-slate-300" :
                            item.rank === 3 ? "bg-amber-100 text-amber-900 border border-amber-200" :
                            "bg-slate-100 text-slate-600 border border-slate-200"
                          )}>
                            {item.rank}
                          </span>
                          <span className="font-semibold text-slate-800 leading-snug">
                            {item.topik}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-rose-900 text-xs bg-rose-100/70 px-2 py-0.5 rounded-md border border-rose-200/80">
                            {item.persen}
                          </span>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {item.formattedJumlah} interaksi
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-500" 
                          style={{ width: `${Math.min(100, (item.persenVal / 40.62) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Keluhan Paling Dominan:</span>
                <span className="font-bold text-rose-700">Mobile JKN sulit diakses (2.249 / 40,62%)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabel Rinci Pemanfaatan Media Sosial */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Tabel Rinci Pemanfaatan Media Sosial
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                8 Kanal Medsos
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian interaksi 8 kanal media sosial dan waktu respon per bulan periode 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTable}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              title="Salin tabel ke clipboard (format TSV/Excel)"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin!' : 'Salin Data'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="w-[3.5%] py-2.5 px-1.5 text-center border-r border-slate-200">No</th>
                <th className="w-[11.5%] py-2.5 px-2 border-r border-slate-200">Bulan</th>
                <th className="w-[8.5%] py-2.5 px-1.5 text-right">Facebook</th>
                <th className="w-[10%] py-2.5 px-1.5 text-right font-bold text-pink-700 bg-pink-50/50">Instagram</th>
                <th className="w-[8.5%] py-2.5 px-1.5 text-right">X (Twitter)</th>
                <th className="w-[8%] py-2.5 px-1.5 text-right">TikTok</th>
                <th className="w-[7.5%] py-2.5 px-1.5 text-right">Threads</th>
                <th className="w-[7.5%] py-2.5 px-1.5 text-right">Email</th>
                <th className="w-[7.5%] py-2.5 px-1.5 text-right">YouTube</th>
                <th className="w-[8.5%] py-2.5 px-1.5 text-right font-semibold text-emerald-700">WhatsApp</th>
                <th className="w-[10.5%] py-2.5 px-2 text-right font-bold text-blue-900 bg-blue-50/60 border-l border-r border-slate-200">Jumlah</th>
                <th className="w-[9%] py-2.5 px-1.5 text-center">Respon Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] sm:text-xs">
              {filteredMonthly.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-1.5 text-center text-slate-400 font-mono border-r border-slate-100">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-slate-800 border-r border-slate-100 truncate">
                    {m.bulan}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono text-slate-700">
                    {new Intl.NumberFormat('id-ID').format(m.facebook)}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono font-bold text-pink-700 bg-pink-50/20">
                    {new Intl.NumberFormat('id-ID').format(m.instagram)}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono text-slate-700">
                    {new Intl.NumberFormat('id-ID').format(m.x)}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono text-slate-700">
                    {new Intl.NumberFormat('id-ID').format(m.tiktok)}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono text-slate-700">
                    {m.threads > 0 ? new Intl.NumberFormat('id-ID').format(m.threads) : '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono text-slate-700">
                    {new Intl.NumberFormat('id-ID').format(m.email)}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono text-slate-700">
                    {new Intl.NumberFormat('id-ID').format(m.youtube)}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-mono font-semibold text-emerald-700">
                    {new Intl.NumberFormat('id-ID').format(m.whatsapp)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-blue-900 bg-blue-50/40 border-l border-r border-slate-100">
                    {new Intl.NumberFormat('id-ID').format(m.jumlah)}
                  </td>
                  <td className="py-2.5 px-1.5 text-center font-mono font-medium text-indigo-700">
                    {m.responTime}
                  </td>
                </tr>
              ))}

              {/* Total / Rata-Rata Row */}
              <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-700 text-[11px] sm:text-xs">
                <td className="py-3 px-1.5 text-center text-slate-400 font-mono border-r border-slate-800">
                  Σ
                </td>
                <td className="py-3 px-2 font-bold border-r border-slate-800 truncate">
                  Total / Rata-Rata
                </td>
                <td className="py-3 px-1.5 text-right font-mono">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.facebook)}
                </td>
                <td className="py-3 px-1.5 text-right font-mono text-pink-300">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.instagram)}
                </td>
                <td className="py-3 px-1.5 text-right font-mono">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.x)}
                </td>
                <td className="py-3 px-1.5 text-right font-mono">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.tiktok)}
                </td>
                <td className="py-3 px-1.5 text-right font-mono">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.threads)}
                </td>
                <td className="py-3 px-1.5 text-right font-mono">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.email)}
                </td>
                <td className="py-3 px-1.5 text-right font-mono">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.youtube)}
                </td>
                <td className="py-3 px-1.5 text-right font-mono text-emerald-300">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.whatsapp)}
                </td>
                <td className="py-3 px-2 text-right font-mono text-blue-300 bg-slate-800 border-l border-r border-slate-700">
                  {new Intl.NumberFormat('id-ID').format(filteredTotals.jumlah)}
                </td>
                <td className="py-3 px-1.5 text-center font-mono text-indigo-300">
                  {filteredTotals.avgResponTime}
                </td>
              </tr>

              {/* Persentase (%) Row */}
              <tr className="bg-slate-100/90 text-slate-700 font-semibold text-[10px] sm:text-[11px] border-b border-slate-200">
                <td className="py-2.5 px-1.5 text-center text-slate-400 font-mono border-r border-slate-200">
                  %
                </td>
                <td className="py-2.5 px-2 font-bold border-r border-slate-200 truncate">
                  Persentase
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono">
                  {socialData.percentages.facebook}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono font-bold text-pink-700">
                  {socialData.percentages.instagram}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono">
                  {socialData.percentages.x}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono">
                  {socialData.percentages.tiktok}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono">
                  {socialData.percentages.threads}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono">
                  {socialData.percentages.email}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono">
                  {socialData.percentages.youtube}
                </td>
                <td className="py-2.5 px-1.5 text-right font-mono text-emerald-700 font-bold">
                  {socialData.percentages.whatsapp}
                </td>
                <td className="py-2.5 px-2 text-right font-mono font-bold text-blue-900 bg-blue-100/60 border-l border-r border-slate-200">
                  100%
                </td>
                <td className="py-2.5 px-1.5 text-center text-slate-400 font-mono">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-blue-600 shrink-0" />
            <span>
              Menampilkan {filteredMonthly.length} bulan data pemanfaatan 8 kanal media sosial dan waktu respon.
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Data Resmi Care Center 165
          </span>
        </div>
      </div>

    </div>
  );
}
