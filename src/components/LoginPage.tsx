import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2,
  PhoneCall,
  Headphones,
  Search,
  Building2,
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPetaCC, 
  USERS_PETA_CC, 
  authenticateUser, 
  fetchLiveUsersFromSheet,
  SHEET_URL,
  UserLevel
} from '../data/usersPetaCC';

export interface AuthUser {
  username: string;
  unitKerja: string;
  kode: string;
  level: UserLevel;
  role: string;
  loginTime: string;
  name: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser, rememberMe: boolean) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);
  
  // Sheet users state
  const [allUsers, setAllUsers] = useState<UserPetaCC[]>(USERS_PETA_CC);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLevelFilter, setPickerLevelFilter] = useState<'all' | 'Administrator' | 'User'>('all');

  // Attempt live refresh in background if possible
  useEffect(() => {
    fetchLiveUsersFromSheet()
      .then((users) => {
        if (users && users.length > 0) {
          setAllUsers(users);
        }
      })
      .catch((err) => {
        console.warn('Background users fetch:', err);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Mohon masukkan Username dan Password secara lengkap.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Authenticate against spreadsheet database
      const matched = authenticateUser(cleanUser, cleanPass, allUsers);

      if (matched) {
        const userObj: AuthUser = {
          username: matched.username,
          unitKerja: matched.unitKerja,
          kode: matched.kode,
          level: matched.level,
          name: matched.level === 'Administrator' ? 'Administrator' : matched.unitKerja,
          role: matched.level === 'Administrator' 
            ? 'Administrator Sistem' 
            : `User (${matched.unitKerja})`,
          loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        onLoginSuccess(userObj, rememberMe);
      } else {
        setError(
          'Username atau password salah. Pastikan kredensial sesuai data pada sheet "User PETA CC".'
        );
        setIsLoading(false);
      }
    }, 350);
  };

  const handleAutofill = (accUser: string, accPass: string) => {
    setUsername(accUser);
    setPassword(accPass);
    setError(null);
  };

  const filteredPickerUsers = allUsers.filter((u) => {
    const matchesLevel = pickerLevelFilter === 'all' || u.level === pickerLevelFilter;
    const q = pickerSearch.toLowerCase().trim();
    const matchesQuery = 
      !q ||
      u.unitKerja.toLowerCase().includes(q) ||
      u.kode.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q);
    return matchesLevel && matchesQuery;
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-8 overflow-hidden font-sans text-slate-100 select-none">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-12 flex items-center justify-center mb-3">
              {logoLoaded ? (
                <img
                  src="/Logo BPJS Kesehatan versi Horizontal Warna.png"
                  alt="BPJS Kesehatan"
                  className="h-10 sm:h-11 w-auto object-contain"
                  onError={() => {
                    setLogoLoaded(false);
                  }}
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                  <ShieldCheck size={18} />
                  <span>BPJS Kesehatan</span>
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2 shadow-sm">
              <Headphones size={13} className="text-blue-400" />
              <span>Portal Layanan Care Center 165</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Masuk ke PETA Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
              Autentikasi Pengguna &amp; Hak Akses sesuai sheet <b>User PETA CC</b>
            </p>
          </div>

          {/* Error Message Box */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs sm:text-sm">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username / User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: ADMIN0000 atau KC0901"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors uppercase font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi sesuai sheet"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>

              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors cursor-pointer"
              >
                Cari Akun Sheet ({allUsers.length})
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi kredensial...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Autofill / Demo Accounts Section */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span className="font-semibold text-slate-300">Pilihan Cepat Level User &amp; Admin:</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">{allUsers.length} Akun Sheet</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Kolom A4:E4 - User: Satuan Pengawasan Internal */}
              <button
                type="button"
                onClick={() => handleAutofill('SPI0011', '8711ZR')}
                className="flex flex-col text-left p-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate pr-1">
                    Satuan Pengawasan Int.
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-900 text-blue-300 font-mono">A4:E4</span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono mt-1">User: SPI0011</span>
                <span className="text-[9px] text-slate-400 font-mono">Pass: 8711ZR (Kode: 0011)</span>
              </button>

              {/* Kolom A5:E5 - User: Sekretaris Badan */}
              <button
                type="button"
                onClick={() => handleAutofill('SESBAN0012', '1077CX')}
                className="flex flex-col text-left p-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate pr-1">
                    Sekretaris Badan
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-900 text-blue-300 font-mono">A5:E5</span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono mt-1">User: SESBAN0012</span>
                <span className="text-[9px] text-slate-400 font-mono">Pass: 1077CX (Kode: 0012)</span>
              </button>

              {/* Kolom A6:E6 - User: Sekretaris Dewan Pengawas */}
              <button
                type="button"
                onClick={() => handleAutofill('SESDEWAS0013', '4321AL')}
                className="flex flex-col text-left p-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate pr-1">
                    Sekretaris Dewas
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-900 text-blue-300 font-mono">A6:E6</span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono mt-1">User: SESDEWAS0013</span>
                <span className="text-[9px] text-slate-400 font-mono">Pass: 4321AL (Kode: 0013)</span>
              </button>

              {/* Administrator */}
              <button
                type="button"
                onClick={() => handleAutofill('ADMIN0000', 'CC_165')}
                className="flex flex-col text-left p-2.5 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/60 hover:border-amber-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-amber-200 group-hover:text-amber-300 flex items-center gap-1">
                    <ShieldCheck size={11} className="text-amber-400" />
                    Administrator
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-900/80 text-amber-300 font-mono">Admin</span>
                </div>
                <span className="text-[10px] text-amber-100 font-mono mt-1">User: ADMIN0000</span>
                <span className="text-[9px] text-amber-300/80 font-mono">Pass: CC_165 (Kode: 0000)</span>
              </button>
            </div>
          </div>

          {/* Security badge & Spreadsheet reference */}
          <div className="mt-5 flex flex-col items-center gap-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>Data Akun Resmi Terhubung ke Google Sheet</span>
            </div>
            <a
              href={SHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10.5px] text-slate-400 hover:text-blue-400 transition-colors"
            >
              <span>Sheet: "User PETA CC" ({allUsers.length} Baris Pengguna)</span>
              <ExternalLink size={10} />
            </a>
          </div>

        </div>

        {/* Outer bottom copyright */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          &copy; {new Date().getFullYear()} Care Center 165 BPJS Kesehatan. Seluruh hak cipta dilindungi.
        </p>
      </motion.div>

      {/* Account Picker Modal for convenience in exploring all 161 users */}
      <AnimatePresence>
        {isPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Pilih Akun dari Sheet "User PETA CC"
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Klik akun mana saja untuk otomatis mengisi form login
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search & Level Filters */}
              <div className="p-4 border-b border-slate-800 space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Ketik nama unit kerja, kantor cabang, kode, atau username..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Filter Level:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPickerLevelFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        pickerLevelFilter === 'all'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Semua ({allUsers.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickerLevelFilter('Administrator')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        pickerLevelFilter === 'Administrator'
                          ? 'bg-amber-600 text-white font-semibold'
                          : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                      }`}
                    >
                      Administrator (1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickerLevelFilter('User')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        pickerLevelFilter === 'User'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                      }`}
                    >
                      User (160)
                    </button>
                  </div>
                </div>
              </div>

              {/* Accounts List */}
              <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-800/60">
                {filteredPickerUsers.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Tidak ditemukan akun yang cocok.
                  </div>
                ) : (
                  filteredPickerUsers.map((u, i) => {
                    const isAdmin = u.level === 'Administrator';
                    return (
                      <button
                        key={`${u.username}-${i}`}
                        type="button"
                        onClick={() => {
                          handleAutofill(u.username, u.password);
                          setIsPickerOpen(false);
                        }}
                        className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800/70 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            isAdmin 
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-600/40' 
                              : 'bg-slate-800 text-blue-400'
                          }`}>
                            {isAdmin ? <ShieldCheck size={14} /> : <Building2 size={14} />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                                {u.unitKerja}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Kode: {u.kode}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                              <span>User: <b className="font-mono text-slate-200">{u.username}</b></span>
                              <span>Pass: <b className="font-mono text-slate-300">{u.password}</b></span>
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          isAdmin 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {u.level}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                <span>Ditemukan {filteredPickerUsers.length} akun</span>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
