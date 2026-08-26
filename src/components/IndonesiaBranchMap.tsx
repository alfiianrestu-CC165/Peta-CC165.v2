import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { BranchOfficeData, RegionalSummaryItem } from '../types';
import { getBranchCoordinate } from '../lib/branchCoordinates';
import { 
  MapPin, 
  Building2, 
  Globe2, 
  Layers, 
  TrendingUp, 
  Search, 
  Maximize2, 
  Eye,
  Activity,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

interface IndonesiaBranchMapProps {
  branches: BranchOfficeData[];
  regions: RegionalSummaryItem[];
  selectedRegionFilter?: string;
}

// Helper component to auto center and zoom when filter changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export function IndonesiaBranchMap({
  branches,
  regions,
  selectedRegionFilter: initialRegionFilter = 'ALL'
}: IndonesiaBranchMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegionFilter);
  const [searchBranch, setSearchBranch] = useState<string>('');
  const [highlightedBranch, setHighlightedBranch] = useState<BranchOfficeData | null>(null);
  const [mapLayer, setMapLayer] = useState<'carto' | 'osm' | 'topo'>('carto');

  useEffect(() => {
    if (initialRegionFilter) {
      setSelectedRegion(initialRegionFilter);
    }
  }, [initialRegionFilter]);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const matchRegion = selectedRegion === 'ALL' || b.kedeputianWilayah === selectedRegion;
      const matchSearch = !searchBranch || 
        b.kantorCabang.toLowerCase().includes(searchBranch.toLowerCase()) ||
        b.provinsi.toLowerCase().includes(searchBranch.toLowerCase()) ||
        b.kedeputianWilayah.toLowerCase().includes(searchBranch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [branches, selectedRegion, searchBranch]);

  // Max and Min values for radius & color scaling
  const maxTotal = useMemo(() => {
    return Math.max(...branches.map(b => b.total), 1);
  }, [branches]);

  // Center coordinates calculation based on selected region or nationwide
  const { mapCenter, mapZoom } = useMemo(() => {
    if (highlightedBranch) {
      const coord = getBranchCoordinate(highlightedBranch.kantorCabang);
      return { mapCenter: [coord.lat, coord.lng] as [number, number], mapZoom: 9 };
    }

    if (selectedRegion !== 'ALL' && filteredBranches.length > 0) {
      let latSum = 0;
      let lngSum = 0;
      filteredBranches.forEach(b => {
        const coord = getBranchCoordinate(b.kantorCabang);
        latSum += coord.lat;
        lngSum += coord.lng;
      });
      return { 
        mapCenter: [latSum / filteredBranches.length, lngSum / filteredBranches.length] as [number, number], 
        mapZoom: 7 
      };
    }

    // Default Indonesia center
    return { mapCenter: [-2.2, 118.0] as [number, number], mapZoom: 5 };
  }, [selectedRegion, filteredBranches, highlightedBranch]);

  // Tile layer URL
  const tileUrl = useMemo(() => {
    switch (mapLayer) {
      case 'carto':
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      case 'topo':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  }, [mapLayer]);

  // Top 5 branches in current filter
  const topBranches = useMemo(() => {
    return [...filteredBranches].sort((a, b) => b.total - a.total).slice(0, 5);
  }, [filteredBranches]);

  // Calculate Marker Color based on volume
  const getMarkerColor = (total: number) => {
    const ratio = total / maxTotal;
    if (ratio > 0.6) return '#dc2626'; // High (Red)
    if (ratio > 0.3) return '#ea580c'; // Medium-High (Orange)
    if (ratio > 0.15) return '#2563eb'; // Medium (Blue)
    return '#059669'; // Normal (Emerald)
  };

  const getMarkerRadius = (total: number) => {
    const ratio = total / maxTotal;
    return Math.max(7, Math.min(24, Math.round(7 + ratio * 20)));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Globe2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Peta Interaktif Sebaran Pemanfaatan per Kantor Cabang
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualisasi spasial 126 Kantor Cabang BPJS Kesehatan di 38 Provinsi se-Indonesia (Periode Jan – Jul 2026)
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Region selector */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setHighlightedBranch(null);
              }}
              className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 pr-8 shadow-xs focus:ring-1 focus:ring-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Kedeputian Wilayah (12 Wilayah)</option>
              {regions.map((r) => (
                <option key={r.kedeputianWilayah} value={r.kedeputianWilayah}>
                  {r.kedeputianWilayah} ({new Intl.NumberFormat('id-ID').format(r.total)} pemanfaatan)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative w-40 sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Cari Cabang / Provinsi..."
              value={searchBranch}
              onChange={(e) => setSearchBranch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Map style toggle */}
          <div className="flex items-center p-0.5 bg-slate-200/80 rounded-lg border border-slate-300 text-[11px] font-medium">
            <button
              onClick={() => setMapLayer('carto')}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                mapLayer === 'carto' ? "bg-white text-blue-700 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Terang
            </button>
            <button
              onClick={() => setMapLayer('osm')}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                mapLayer === 'osm' ? "bg-white text-blue-700 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              OSM
            </button>
            <button
              onClick={() => setMapLayer('topo')}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                mapLayer === 'topo' ? "bg-white text-blue-700 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Topografi
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Left Interactive Map Canvas */}
        <div className="lg:col-span-9 h-[450px] lg:h-[560px] relative z-0">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={tileUrl}
            />

            {/* Render Circles for each Branch */}
            {filteredBranches.map((branch) => {
              const coord = getBranchCoordinate(branch.kantorCabang);
              const color = getMarkerColor(branch.total);
              const radius = getMarkerRadius(branch.total);

              return (
                <CircleMarker
                  key={branch.kantorCabang}
                  center={[coord.lat, coord.lng]}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.75,
                    color: '#ffffff',
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => setHighlightedBranch(branch),
                  }}
                >
                  <Popup>
                    <div className="p-3.5 min-w-[240px]">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50 w-fit mb-1.5">
                        <Building2 size={11} />
                        <span>{branch.kedeputianWilayah}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        KC {branch.kantorCabang}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 mb-2.5">
                        Provinsi {branch.provinsi}
                      </p>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Total Pemanfaatan:</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {new Intl.NumberFormat('id-ID').format(branch.total)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60">
                          <span>Rata-rata / Bulan:</span>
                          <span className="font-semibold text-slate-700">
                            {new Intl.NumberFormat('id-ID').format(Math.round(branch.total / 7))}
                          </span>
                        </div>
                      </div>

                      {/* Mini Monthly Breakdown */}
                      <div className="text-[10px] text-slate-600 grid grid-cols-4 gap-1 text-center bg-slate-100/70 p-1.5 rounded-md">
                        <div><span className="text-slate-400 block">Jan</span>{branch.januari.toLocaleString('id-ID')}</div>
                        <div><span className="text-slate-400 block">Feb</span>{branch.februari.toLocaleString('id-ID')}</div>
                        <div><span className="text-slate-400 block">Mar</span>{branch.maret.toLocaleString('id-ID')}</div>
                        <div><span className="text-slate-400 block">Apr</span>{branch.april.toLocaleString('id-ID')}</div>
                        <div><span className="text-slate-400 block">Mei</span>{branch.mei.toLocaleString('id-ID')}</div>
                        <div><span className="text-slate-400 block">Jun</span>{branch.juni.toLocaleString('id-ID')}</div>
                        <div><span className="text-slate-400 block">Jul</span>{branch.juli.toLocaleString('id-ID')}</div>
                        <div className="font-bold text-blue-700 bg-blue-50 rounded"><span className="text-blue-500 block font-normal">Tot</span>{branch.total.toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-md border border-slate-200/80 text-xs">
            <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Layers size={13} className="text-blue-600" />
              <span>Legenda Volume Pemanfaatan</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white inline-block shadow-2xs"></span>
                <span>Sangat Tinggi (&gt; 15.000)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 border border-white inline-block shadow-2xs"></span>
                <span>Tinggi (8.000 – 15.000)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white inline-block shadow-2xs"></span>
                <span>Sedang (4.000 – 8.000)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 border border-white inline-block shadow-2xs"></span>
                <span>Standar (&lt; 4.000)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info & Ranking Panel */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-blue-600" />
                  <span>Cabang Teraktif di Peta</span>
                </h4>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {filteredBranches.length} Cabang
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Klik salah satu cabang untuk memperbesar posisi di peta:
              </p>
            </div>

            {/* List of top branch cards */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {topBranches.map((b, idx) => {
                const isSelected = highlightedBranch?.kantorCabang === b.kantorCabang;
                return (
                  <div
                    key={b.kantorCabang}
                    onClick={() => setHighlightedBranch(b)}
                    className={cn(
                      "p-3 rounded-lg border transition-all cursor-pointer text-left bg-white",
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/20 shadow-xs bg-blue-50/30"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800">KC {b.kantorCabang}</h5>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 ml-5">
                          {b.provinsi} • <span className="text-blue-600">{b.kedeputianWilayah.replace('Kedeputian Wilayah ', 'KW ')}</span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-blue-700 shrink-0">
                        {new Intl.NumberFormat('id-ID').format(b.total)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 shadow-2xs">
            <div className="flex items-center justify-between text-slate-700 font-bold mb-1.5">
              <span>Total Pemanfaatan Filter:</span>
              <span className="text-blue-700">
                {new Intl.NumberFormat('id-ID').format(
                  filteredBranches.reduce((sum, b) => sum + b.total, 0)
                )}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Mencakup sebaran layanan interaksi dari seluruh faskes & peserta BPJS Kesehatan di wilayah ini.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
