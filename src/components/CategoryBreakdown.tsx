import React, { useState } from 'react';
import { CategoryBreakdownData } from '../types';
import { 
  Info, 
  FileEdit, 
  AlertTriangle, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CategoryBreakdownProps {
  categoryData: CategoryBreakdownData;
  categoryTotals?: {
    info: number;
    req: number;
    comp: number;
    total: number;
    infoPct: number;
    reqPct: number;
    compPct: number;
  };
}

export function CategoryBreakdown({ categoryData, categoryTotals }: CategoryBreakdownProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'informasi' | 'permintaan' | 'pengaduan'>('all');

  // Official Category Totals from Spreadsheet (G9, H9, I9)
  const officialInfoTotal = categoryData.totals?.informasi || categoryTotals?.info || 852095;
  const officialReqTotal = categoryData.totals?.permintaan || categoryTotals?.req || 116901;
  const officialCompTotal = categoryData.totals?.pengaduan || categoryTotals?.comp || 7923;
  const officialGrandTotal = categoryData.totals?.total || (officialInfoTotal + officialReqTotal + officialCompTotal) || 976919;

  const categories = [
    {
      key: 'informasi' as const,
      title: 'Informasi',
      fullTitle: 'Kategori Informasi',
      subtitle: 'Informasi Layanan BPJS Kesehatan',
      icon: Info,
      items: categoryData.informasi,
      color: 'blue',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      headerText: 'text-blue-700',
      headerBg: 'bg-blue-50/70',
      barBg: 'bg-blue-500',
      accentColor: '#3b82f6',
      totalOfficial: officialInfoTotal,
      pctOfTotal: Number(((officialInfoTotal / officialGrandTotal) * 100).toFixed(2)),
      pctOfTotalFormatted: ((officialInfoTotal / officialGrandTotal) * 100).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
    },
    {
      key: 'permintaan' as const,
      title: 'Permintaan',
      fullTitle: 'Kategori Permintaan',
      subtitle: 'Permintaan Administrasi & Perubahan Data',
      icon: FileEdit,
      items: categoryData.permintaan,
      color: 'emerald',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      headerText: 'text-emerald-700',
      headerBg: 'bg-emerald-50/70',
      barBg: 'bg-emerald-500',
      accentColor: '#10b981',
      totalOfficial: officialReqTotal,
      pctOfTotal: Number(((officialReqTotal / officialGrandTotal) * 100).toFixed(2)),
      pctOfTotalFormatted: ((officialReqTotal / officialGrandTotal) * 100).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
    },
    {
      key: 'pengaduan' as const,
      title: 'Pengaduan',
      fullTitle: 'Kategori Pengaduan',
      subtitle: 'Pengaduan & Kendala Layanan',
      icon: AlertTriangle,
      items: categoryData.pengaduan,
      color: 'amber',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      headerText: 'text-amber-700',
      headerBg: 'bg-amber-50/70',
      barBg: 'bg-amber-500',
      accentColor: '#f59e0b',
      totalOfficial: officialCompTotal,
      pctOfTotal: Number(((officialCompTotal / officialGrandTotal) * 100).toFixed(2)),
      pctOfTotalFormatted: ((officialCompTotal / officialGrandTotal) * 100).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
    }
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header section */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Layers size={17} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Rincian Pemanfaatan per Kategori Layanan
            </h3>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-white text-slate-700 px-2.5 py-0.5 rounded-full font-semibold border border-slate-200">
              <Sparkles size={12} className="text-amber-500" />
              Total: {new Intl.NumberFormat('id-ID').format(officialGrandTotal)} Interaksi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Trend pemanfaatan kategori Informasi, Permintaan, dan Pengaduan bulan Januari sd Juli 2026
          </p>
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-lg border border-slate-300/60 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedFilter === 'all'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Semua (3 Kategori)
          </button>
          <button
            onClick={() => setSelectedFilter('informasi')}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedFilter === 'informasi'
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Informasi ({new Intl.NumberFormat('id-ID').format(officialInfoTotal)})
          </button>
          <button
            onClick={() => setSelectedFilter('permintaan')}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedFilter === 'permintaan'
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Permintaan ({new Intl.NumberFormat('id-ID').format(officialReqTotal)})
          </button>
          <button
            onClick={() => setSelectedFilter('pengaduan')}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              selectedFilter === 'pengaduan'
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Pengaduan ({new Intl.NumberFormat('id-ID').format(officialCompTotal)})
          </button>
        </div>
      </div>

      {/* Unified View for "Semua (3 Kategori)" */}
      {selectedFilter === 'all' ? (
        <div className="w-full">
          {/* Summary Strip: Total Pemanfaatan per Kategori dari Spreadsheet */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/40 text-xs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("p-1.5 rounded-lg", cat.badgeBg)}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">{cat.title}</span>
                      <span className="text-[10px] text-slate-500">Kategori Layanan</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-sm block leading-tight">
                      {new Intl.NumberFormat('id-ID').format(cat.totalOfficial)}
                    </span>
                    <span className="text-[10px] text-slate-500">Total Pemanfaatan</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unified Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-3 text-center w-12 bg-slate-100/90 border-r border-slate-200/80">#</th>
                  <th className="py-2.5 px-4 w-1/3 text-blue-700 bg-blue-50/40 border-r border-slate-200/80">
                    <div className="flex items-center gap-1.5">
                      <Info size={14} className="text-blue-600" />
                      <span>Kategori Informasi</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-4 w-1/3 text-emerald-700 bg-emerald-50/40 border-r border-slate-200/80">
                    <div className="flex items-center gap-1.5">
                      <FileEdit size={14} className="text-emerald-600" />
                      <span>Kategori Permintaan</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-4 w-1/3 text-amber-700 bg-amber-50/40">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-600" />
                      <span>Kategori Pengaduan</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {[0, 1, 2, 3, 4].map((index) => {
                  const rank = index + 1;
                  const infoItem = categoryData.informasi[index];
                  const reqItem = categoryData.permintaan[index];
                  const compItem = categoryData.pengaduan[index];

                  return (
                    <tr 
                      key={index} 
                      className={cn(
                        "hover:bg-slate-50/90 transition-colors",
                        index % 2 === 1 ? "bg-slate-50/30" : "bg-white"
                      )}
                    >
                      {/* Rank Number Badge */}
                      <td className="py-2.5 px-3 text-center align-top border-r border-slate-200/60 font-bold">
                        <span className="w-5 h-5 mx-auto rounded-full text-[11px] flex items-center justify-center font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {rank}
                        </span>
                      </td>

                      {/* Informasi Column */}
                      <td className="py-2.5 px-4 align-top border-r border-slate-200/60">
                        {infoItem ? (
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-slate-800 leading-snug line-clamp-2" title={infoItem.topik}>
                                {infoItem.topik}
                              </p>
                              <div className="text-right shrink-0">
                                <span className="font-bold text-slate-900 block text-[11px]">
                                  {new Intl.NumberFormat('id-ID').format(infoItem.jumlah)}
                                </span>
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 inline-block">
                                  {infoItem.persen}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${Math.min(infoItem.persenVal, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                      </td>

                      {/* Permintaan Column */}
                      <td className="py-2.5 px-4 align-top border-r border-slate-200/60">
                        {reqItem ? (
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-slate-800 leading-snug line-clamp-2" title={reqItem.topik}>
                                {reqItem.topik}
                              </p>
                              <div className="text-right shrink-0">
                                <span className="font-bold text-slate-900 block text-[11px]">
                                  {new Intl.NumberFormat('id-ID').format(reqItem.jumlah)}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block">
                                  {reqItem.persen}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${Math.min(reqItem.persenVal, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                      </td>

                      {/* Pengaduan Column */}
                      <td className="py-2.5 px-4 align-top">
                        {compItem ? (
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-slate-800 leading-snug line-clamp-2" title={compItem.topik}>
                                {compItem.topik}
                              </p>
                              <div className="text-right shrink-0">
                                <span className="font-bold text-slate-900 block text-[11px]">
                                  {new Intl.NumberFormat('id-ID').format(compItem.jumlah)}
                                </span>
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 inline-block">
                                  {compItem.persen}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                              <div 
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${Math.min(compItem.persenVal, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                {/* Total Pemanfaatan Kategori (Official dari Google Sheets) */}
                <tr className="bg-blue-50/40 border-t border-slate-300 text-xs font-bold text-slate-800">
                  <td className="py-3 px-3 text-center border-r border-slate-200 text-blue-900 font-bold">Total</td>
                  <td className="py-3 px-4 border-r border-slate-200 text-blue-800">
                    <span className="text-sm font-bold">{new Intl.NumberFormat('id-ID').format(officialInfoTotal)}</span>
                    <span className="text-sm font-bold text-blue-800 ml-1.5">({categories[0].pctOfTotalFormatted})</span>
                  </td>
                  <td className="py-3 px-4 border-r border-slate-200 text-emerald-800">
                    <span className="text-sm font-bold">{new Intl.NumberFormat('id-ID').format(officialReqTotal)}</span>
                    <span className="text-sm font-bold text-emerald-800 ml-1.5">({categories[1].pctOfTotalFormatted})</span>
                  </td>
                  <td className="py-3 px-4 text-amber-800">
                    <span className="text-sm font-bold">{new Intl.NumberFormat('id-ID').format(officialCompTotal)}</span>
                    <span className="text-sm font-bold text-amber-800 ml-1.5">({categories[2].pctOfTotalFormatted})</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* Single Filter View */
        (() => {
          const cat = categories.find(c => c.key === selectedFilter) || categories[0];
          const Icon = cat.icon;

          return (
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={cn("p-2 rounded-lg", cat.badgeBg)}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{cat.fullTitle}</h4>
                    <p className="text-xs text-slate-500">{cat.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Total Pemanfaatan Kategori</span>
                  <span className="text-base font-bold text-slate-900">
                    {new Intl.NumberFormat('id-ID').format(cat.totalOfficial)} Interaksi
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((item, idx) => {
                  const rank = idx + 1;
                  return (
                    <div 
                      key={idx} 
                      className="p-3 rounded-lg bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 bg-purple-50 text-purple-700 border border-purple-200">
                          {rank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate" title={item.topik}>
                            {item.topik}
                          </p>
                          <div className="w-full max-w-md h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                            <div 
                              className={cn("h-full rounded-full", cat.barBg)}
                              style={{ width: `${Math.min(item.persenVal, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900 block">
                          {new Intl.NumberFormat('id-ID').format(item.jumlah)}
                        </span>
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", cat.badgeBg)}>
                          {item.persen}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
