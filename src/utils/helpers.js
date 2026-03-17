// ─── Date & Time Formatting ──────────────────────────────────────────────────

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

// ─── Price Formatting ────────────────────────────────────────────────────────

export const formatPrice = (price) => {
  if (price === 0 || price === null || price === undefined) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// ─── Text Utilities ──────────────────────────────────────────────────────────

export const truncateText = (text, length = 120) => {
  if (!text || text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

// ─── Booking ID Generation ───────────────────────────────────────────────────

export const generateBookingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const timestamp = Date.now().toString(36).toUpperCase();
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BK-${timestamp}-${random}`;
};

// ─── Status Colors ───────────────────────────────────────────────────────────

export const getStatusColor = (status) => {
  const statusMap = {
    published: 'success',
    draft: 'warning',
    completed: 'info',
    cancelled: 'error',
    upcoming: 'info',
    ongoing: 'success',
    past: 'default',
  };
  return statusMap[status?.toLowerCase()] || 'default';
};

// ─── Attendance Calculation ──────────────────────────────────────────────────

export const calculateAttendanceRate = (sold, capacity) => {
  if (!capacity || capacity === 0) return 0;
  return Math.round((sold / capacity) * 100);
};

// ─── Avatar Initials ─────────────────────────────────────────────────────────

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// ─── Relative Time ───────────────────────────────────────────────────────────

export const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// ─── CSV Export ──────────────────────────────────────────────────────────────

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((row) =>
    Object.values(row)
      .map((v) => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v))
      .join(',')
  );
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Random Color from Palette ───────────────────────────────────────────────

export const getRandomColor = () => {
  const colors = ['#E8441A', '#F5A623', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// ─── Password Strength ───────────────────────────────────────────────────────

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 50, label: 'Fair', color: 'bg-yellow-500' };
  if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' };
  return { score: 100, label: 'Strong', color: 'bg-green-500' };
};
