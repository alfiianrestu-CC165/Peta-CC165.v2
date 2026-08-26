export function getFormattedBuildTime(): string {
  try {
    const rawTime = (import.meta as any).env?.VITE_BUILD_TIME;
    const date = rawTime ? new Date(rawTime) : new Date();
    
    // Format to Indonesian locale (Asia/Jakarta WIB)
    const formatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date);
    
    return `${formatted} WIB`;
  } catch (e) {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
    return `${formatted} WIB`;
  }
}
