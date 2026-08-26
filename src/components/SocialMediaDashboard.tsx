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
  AlertTriangle
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
import { motion } from 'framer-motion';

export interface SocialMediaDashboardProps {
  searchTerm: string;
}

// Data channel bulanan Care Center 165 Media Sosial
const MONTHLY_SOCIAL_DATA = [
  { bulan: 'Januari', whatsapp: 84500, instagram: 32400, twitter: 21200, facebook: 14200, youtube: 4200, total: 156500, sla: '98.4%', tuntas: 153800 },
  { bulan: 'Februari', whatsapp: 78900, instagram: 29800, twitter: 19500, facebook: 13100, youtube: 3900, total: 145200, sla: '98.6%', tuntas: 143100 },
  { bulan: 'Maret', whatsapp: 92300, instagram: 35600, twitter: 23100, facebook: 15800, youtube: 4800, total: 171600, sla: '98.1%', tuntas: 168300 },
  { bulan: 'April', whatsapp: 89400, instagram: 34100, twitter: 22400, facebook: 14900, youtube: 4500, total: 165300, sla: '98.5%', tuntas: 162800 },
  { bulan: 'Mei', whatsapp: 95800, instagram: 38200, twitter: 25300, facebook: 16400, youtube: 5100, total: 180800, sla: '98.8%', tuntas: 178600 },
  { bulan: 'Juni', whatsapp: 91200, instagram: 36700, twitter: 24100, facebook: 15600, youtube: 4900, total: 172500, sla: '98.3%', tuntas: 169500 },
  { bulan: 'Juli', whatsapp: 97600, instagram: 39800, twitter: 26500, facebook: 17100, youtube: 5400, total: 186400, sla: '98.7%', tuntas: 183900 },
  { bulan: 'Agustus', whatsapp: 99400, instagram: 41200, twitter: 27800, facebook: 17800, youtube: 5800, total: 192000, sla: '98.9%', tuntas: 189800 },
  { bulan: 'September', whatsapp: 94100, instagram: 37900, twitter: 24900, facebook: 16200, youtube: 5200, total: 178300, sla: '98.5%', tuntas: 175600 },
  { bulan: 'Oktober', whatsapp: 98200, instagram: 40500, twitter: 26900, facebook: 17400, youtube: 5600, total: 188600, sla: '98.7%', tuntas: 186100 },
  { bulan: 'November', whatsapp: 96300, instagram: 39100, twitter: 25800, facebook: 16800, youtube: 5300, total: 183300, sla: '98.6%', tuntas: 180700 },
  { bulan: 'Desember', whatsapp: 104500, instagram: 43600, twitter: 29200, facebook: 18900, youtube: 6200, total: 202400, sla: '99.1%', tuntas: 200500 },
];

const CHANNEL_SUMMARY = [
  { name: 'WhatsApp (CHIKA)', count: 1122200, pct: '52.9%', color: '#22c55e', frt: '1m 12s', sla: '99.2%', tuntas: '98.9%' },
  { name: 'Instagram (@bpjskesehatan_ri)', count: 448900, pct: '21.1%', color: '#e1306c', frt: '4m 30s', sla: '97.8%', tuntas: '97.5%' },
  { name: 'X / Twitter (@BPJSKesehatanRI)', count: 291700, pct: '13.7%', color: '#0ea5e9', frt: '3m 45s', sla: '98.2%', tuntas: '98.1%' },
  { name: 'Facebook Page', count: 194400, pct: '9.2%', color: '#3b82f6', frt: '5m 20s', sla: '97.1%', tuntas: '96.8%' },
  { name: 'YouTube & TikTok', count: 64900, pct: '3.1%', color: '#ef4444', frt: '8m 10s', sla: '96.5%', tuntas: '96.2%' },
];

const TOPIC_CATEGORIES = [
  { topik: 'Cek Status Kepesertaan', volume: 684200, persen: 32.2, color: '#3b82f6' },
  { topik: 'Informasi Tagihan & Autodebet', volume: 512600, persen: 24.1, color: '#10b981' },
  { topik: 'Perubahan Data & FKTP', volume: 382400, persen: 18.0, color: '#f59e0b' },
  { topik: 'Pelayanan di Rumah Sakit/Faskes', volume: 314500, persen: 14.8, color: '#8b5cf6' },
  { topik: 'Pendaftaran Peserta Baru', volume: 229200, persen: 10.9, color: '#ec4899' },
];

const RECENT_SOCIAL_FEED = [
  { id: '1', channel: 'WhatsApp', user: 'Peserta Mandiri', text: 'Permisi min mau tanya cara cek kartu JKN aktif atau tidak lewat NIK bagaimana ya?', time: '2 menit yang lalu', status: 'Tuntas (Bot CHIKA)', sentiment: 'Netral' },
  { id: '2', channel: 'X / Twitter', user: '@budi_santoso', text: 'Terima kasih admin @BPJSKesehatanRI responnya cepat sekali bantu update faskes saya!', time: '14 menit yang lalu', status: 'Tuntas (Agent)', sentiment: 'Positif' },
  { id: '3', channel: 'Instagram', user: '@anisa_putri99', text: 'Mau tanya mengenai autodebet bank BNI untuk iuran keluarga, apakah sudah terpotong otomatis?', time: '28 menit yang lalu', status: 'Tuntas (Agent)', sentiment: 'Netral' },
  { id: '4', channel: 'Facebook', user: 'Rahmat Hidayat', text: 'Pelayanan di faskes pertama sangat baik dan obat sudah diterima tanpa biaya tambahan.', time: '45 menit yang lalu', status: 'Tuntas', sentiment: 'Positif' },
  { id: '5', channel: 'X / Twitter', user: '@maya_lestari', text: 'Apakah pendaftaran bayi baru lahir bisa langsung diurus via aplikasi Mobile JKN?', time: '1 jam yang lalu', status: 'Tuntas (Agent)', sentiment: 'Netral' },
];

export function SocialMediaDashboard({ searchTerm }: SocialMediaDashboardProps) {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  const filteredMonthly = useMemo(() => {
    return MONTHLY_SOCIAL_DATA.filter(item => 
      item.bulan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalInteractions = useMemo(() => {
    return filteredMonthly.reduce((sum, item) => sum + item.total, 0);
  }, [filteredMonthly]);

  const totalTuntas = useMemo(() => {
    return filteredMonthly.reduce((sum, item) => sum + item.tuntas, 0);
  }, [filteredMonthly]);

  const avgResolutionRate = useMemo(() => {
    if (!totalInteractions) return '0%';
    return ((totalTuntas / totalInteractions) * 100).toFixed(1) + '%';
  }, [totalInteractions, totalTuntas]);

  return (
    <div className="space-y-5">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Interaksi Masuk */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Total Interaksi Medsos</h3>
              <p className="text-3xl font-bold mt-2 text-slate-800">
                {new Intl.NumberFormat('id-ID').format(totalInteractions)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Share2 size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            Semua Kanal Media Sosial & WhatsApp
          </div>
        </div>

        {/* First Response Time (FRT) */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-2xl shadow-lg text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold uppercase opacity-80 tracking-wider">Avg First Response Time</h3>
            <p className="text-3xl font-bold mt-2">2m 45s</p>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs opacity-90 mt-4">
            <Clock size={15} />
            Kecepatan Respon Agent & Bot
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 scale-125 transform rotate-12 pointer-events-none">
            <MessageCircle size={100} />
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-2xl shadow-lg text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold uppercase opacity-80 tracking-wider">Resolution Rate (% Tuntas)</h3>
            <p className="text-3xl font-bold mt-2">{avgResolutionRate}</p>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs opacity-90 mt-4">
            <CheckCircle2 size={15} />
            {new Intl.NumberFormat('id-ID').format(totalTuntas)} Tiket Diselesaikan
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 scale-125 transform rotate-12 pointer-events-none">
            <ShieldCheck size={100} />
          </div>
        </div>

        {/* Sentiment Index */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Indeks Kepuasan & Sentimen</h3>
              <p className="text-3xl font-bold mt-2 text-emerald-600">89.4%</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ThumbsUp size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Sentimen Positif & Netral Terverifikasi
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trend Volume Interaksi Bulanan */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                <Activity size={18} className="text-blue-600" /> Tren Interaksi Media Sosial per Bulan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Perbandingan volume interaksi dan penyelesaian tiket</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full w-fit">
              Omnichannel 165
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredMonthly} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [
                    new Intl.NumberFormat('id-ID').format(value),
                    name
                  ]}
                  labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Interaksi"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="tuntas"
                  name="Tiket Tuntas"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Share per Kanal Medsos */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
              <Share2 size={18} className="text-indigo-600" /> Share Kanal Media Sosial
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Proporsi volume interaksi per kanal</p>
          </div>

          <div className="space-y-3 my-auto py-2">
            {CHANNEL_SUMMARY.map((ch, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }}></span>
                    {ch.name}
                  </span>
                  <span className="font-bold text-slate-800">{ch.pct}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: ch.pct, backgroundColor: ch.color }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{new Intl.NumberFormat('id-ID').format(ch.count)} interaksi</span>
                  <span>SLA: {ch.sla}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Kanal Dominan:</span>
            <span className="font-bold text-emerald-600">WhatsApp (CHIKA) - 52.9%</span>
          </div>
        </div>
      </div>

      {/* Kategori Topik & Performa Kanal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top Kategori Topik Medsos */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
              <HelpCircle size={18} className="text-amber-500" /> Kategori Pertanyaan Terbanyak
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Topik paling sering ditanyakan peserta</p>
          </div>

          <div className="space-y-3">
            {TOPIC_CATEGORIES.map((cat, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{cat.topik}</p>
                    <p className="text-[10px] text-slate-500">{new Intl.NumberFormat('id-ID').format(cat.volume)} interaksi</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                  {cat.persen}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabel Ringkasan Kinerja Kanal */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                  <ShieldCheck size={18} className="text-blue-600" /> Kinerja Layanan Tiap Kanal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Metrik SLA dan kecepatan penanganan</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5 text-center">Kanal Layanan</th>
                    <th className="px-3 py-2.5 text-center">Volume</th>
                    <th className="px-3 py-2.5 text-center">Avg FRT</th>
                    <th className="px-3 py-2.5 text-center">SLA %</th>
                    <th className="px-3 py-2.5 text-center">% Tuntas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CHANNEL_SUMMARY.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3 font-medium text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }}></span>
                        {row.name}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-700">
                        {new Intl.NumberFormat('id-ID').format(row.count)}
                      </td>
                      <td className="px-3 py-3 text-center text-blue-600 font-medium">{row.frt}</td>
                      <td className="px-3 py-3 text-center text-emerald-600 font-bold">{row.sla}</td>
                      <td className="px-3 py-3 text-center font-bold text-emerald-600">{row.tuntas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Interaksi Live Feed Sample */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-slate-400" /> Contoh Interaksi Terbaru Terlayani
            </h4>
            <div className="space-y-2">
              {RECENT_SOCIAL_FEED.slice(0, 2).map((feed) => (
                <div key={feed.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-[11px]">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-800">{feed.user}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-100 text-blue-800">{feed.channel}</span>
                      <span className="text-slate-400 text-[10px]">{feed.time}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">"{feed.text}"</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {feed.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
