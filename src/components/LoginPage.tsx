import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  AlertCircle, 
  Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPetaCC, 
  USERS_PETA_CC, 
  authenticateUser, 
  fetchLiveUsersFromSheet,
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
  
  // Sheet users state for authentication
  const [allUsers, setAllUsers] = useState<UserPetaCC[]>(USERS_PETA_CC);

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
              Masukkan ID pengguna dan kata sandi Anda untuk mengakses sistem pemantauan data.
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
                  placeholder="Masukkan Username / ID Pengguna"
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
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
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

          {/* Security badge footer */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Koneksi Aman &amp; Terotentikasi • BPJS Kesehatan</span>
          </div>

        </div>

        {/* Outer bottom copyright */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          &copy; {new Date().getFullYear()} Care Center 165 BPJS Kesehatan. Seluruh hak cipta dilindungi.
        </p>
      </motion.div>
    </div>
  );
}
