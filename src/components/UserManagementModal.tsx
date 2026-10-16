import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  ShieldCheck, 
  Users, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  Filter,
  Building2,
  Lock,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPetaCC, USERS_PETA_CC, SHEET_URL, fetchLiveUsersFromSheet } from '../data/usersPetaCC';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    username: string;
    level: string;
    unitKerja?: string;
  };
}

export function UserManagementModal({ isOpen, onClose, currentUser }: UserManagementModalProps) {
  const [users, setUsers] = useState<UserPetaCC[]>(USERS_PETA_CC);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'Administrator' | 'User'>('all');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesLevel = levelFilter === 'all' || u.level === levelFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        !q ||
        u.unitKerja.toLowerCase().includes(q) ||
        u.kode.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.level.toLowerCase().includes(q);
      
      return matchesLevel && matchesQuery;
    });
  }, [users, searchQuery, levelFilter]);

  const adminCount = useMemo(() => users.filter(u => u.level === 'Administrator').length, [users]);
  const userCount = useMemo(() => users.filter(u => u.level === 'User').length, [users]);

  const handleSyncWithSheet = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    try {
      const freshUsers = await fetchLiveUsersFromSheet();
      setUsers(freshUsers);
      setRefreshMessage(`Berhasil menyinkronkan ${freshUsers.length} pengguna langsung dari Google Sheet!`);
      setTimeout(() => setRefreshMessage(null), 4000);
    } catch {
      setRefreshMessage('Gagal mengambil data live. Menggunakan data tersimpan.');
      setTimeout(() => setRefreshMessage(null), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Users size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800">
                    Direktori Pengguna PETA Care Center 165
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Sheet: User PETA CC
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Total {users.length} pengguna resmi terdaftar beserta hak akses level Administrator & User.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={SHEET_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Buka Spreadsheet Sumber"
              >
                <ExternalLink size={13} />
                <span>Buka Spreadsheet</span>
              </a>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 bg-slate-50/50 border-b border-slate-200/80">
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-500">Total Akun Terdaftar</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-slate-800">{users.length}</span>
                <span className="text-xs text-slate-400 font-normal">pengguna</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs bg-amber-50/30">
              <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
                <ShieldCheck size={12} className="text-amber-600" />
                Level Administrator
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-amber-800">{adminCount}</span>
                <span className="text-xs text-amber-600 font-medium">ADMIN0000</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-200/80 shadow-2xs bg-blue-50/30">
              <span className="text-[11px] font-medium text-blue-700 flex items-center gap-1">
                <Building2 size={12} className="text-blue-600" />
                Level User (Cabang & Wilayah)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-blue-800">{userCount}</span>
                <span className="text-xs text-blue-600 font-medium">160 Cabang/Unit</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-500">Aksi Sinkronisasi</span>
              <button
                onClick={handleSyncWithSheet}
                disabled={isRefreshing}
                className="mt-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                <span>{isRefreshing ? 'Menyinkronkan...' : 'Sinkron Sheet'}</span>
              </button>
            </div>
          </div>

          {/* Sync notification */}
          {refreshMessage && (
            <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check size={14} className="text-emerald-600" />
              <span>{refreshMessage}</span>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="p-4 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200/60">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari Unit Kerja, Kantor Cabang, Kode, Username, Level..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Filter buttons & Show password toggle */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setLevelFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    levelFilter === 'all'
                      ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({users.length})
                </button>
                <button
                  onClick={() => setLevelFilter('Administrator')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    levelFilter === 'Administrator'
                      ? 'bg-amber-500 text-white shadow-2xs font-semibold'
                      : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  Admin ({adminCount})
                </button>
                <button
                  onClick={() => setLevelFilter('User')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    levelFilter === 'User'
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'text-blue-700 hover:text-blue-900'
                  }`}
                >
                  User ({userCount})
                </button>
              </div>

              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                title="Tampilkan / Sembunyikan Password"
              >
                {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="hidden sm:inline">{showPasswords ? 'Tutup Password' : 'Lihat Password'}</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:px-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 z-10">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3">Unit Kerja / Kantor Cabang</th>
                  <th className="py-2.5 px-3 w-20 text-center">Kode</th>
                  <th className="py-2.5 px-3 w-28 text-center">Level Hak Akses</th>
                  <th className="py-2.5 px-3 w-32">Username</th>
                  <th className="py-2.5 px-3 w-32">Password</th>
                  <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Tidak ada pengguna yang sesuai dengan pencarian "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const isAdmin = u.level === 'Administrator';
                    const isSelf = currentUser?.username.toUpperCase() === u.username.toUpperCase();

                    return (
                      <tr 
                        key={`${u.username}-${idx}`} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isAdmin ? 'bg-amber-50/30' : isSelf ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            {isAdmin ? (
                              <ShieldCheck size={14} className="text-amber-600 shrink-0" />
                            ) : (
                              <Building2 size={14} className="text-slate-400 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-800">
                              {u.unitKerja}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                Akun Anda
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600 font-medium">
                          {u.kode}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                              <ShieldCheck size={11} />
                              Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              <UserCheck size={11} />
                              User
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                          {u.username}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {showPasswords ? (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-900 font-bold">
                              {u.password}
                            </span>
                          ) : (
                            <span className="text-slate-400 tracking-widest font-mono">
                              ••••••••
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleCopy(`${u.username} / ${u.password}`, u.username)}
                            title="Salin Username & Password"
                            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            {copiedKey === u.username ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Menampilkan {filteredUsers.length} dari {users.length} akun terdaftar • Level Administrator memiliki akses direktori pengguna penuh.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Tutup Direktori
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
