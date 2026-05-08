import React from "react";

// ── StatCard ─────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
}
export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xl font-extrabold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ── CardHeader ───────────────────────────────────────────────────
interface CardHeaderProps {
  title: string;
  icon?: string;
  action?: React.ReactNode;
}
export function CardHeader({ title, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="font-bold text-[15px] text-gray-900">{title}</span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Th / Td ──────────────────────────────────────────────────────
export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
      {children}
    </th>
  );
}

interface TdProps {
  children: React.ReactNode;
  className?: string;
}
export function Td({ children, className = "" }: TdProps) {
  return (
    <td className={`px-4 py-2.5 text-[13px] text-gray-900 border-b border-gray-200 ${className}`}>
      {children}
    </td>
  );
}

// ── Modal ────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}
export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between px-[22px] py-4 border-b border-gray-200">
          <span className="font-bold text-base text-gray-900">{title}</span>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-lg text-gray-500 leading-none hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className="px-[22px] py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Field ────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  children: React.ReactNode;
}
export function Field({ label, children }: FieldProps) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}
export function Input({ value, onChange, placeholder, type = "text" }: InputProps) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none text-gray-900 box-border focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />
  );
}

// ── Btn ──────────────────────────────────────────────────────────
interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}
export function Btn({ children, onClick, variant = "outline", size = "md", disabled }: BtnProps) {
  const sizeClass =
    size === "sm" ? "px-3 py-1.5 text-xs"
    : size === "lg" ? "px-6 py-2.5 text-sm"
    : "px-4 py-2 text-[13px]";

  const variantClass =
    variant === "primary"
      ? "bg-[#0D7A4E] text-white border-transparent hover:bg-[#0a6641]"
      : variant === "danger"
      ? "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
      : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-semibold cursor-pointer transition-colors ${sizeClass} ${variantClass} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

// ── Avatar ───────────────────────────────────────────────────────
const AVATAR_COLORS = [
  ['#1D9E75','#E1F5EE'],['#1565C0','#E3F2FD'],['#7B3FA8','#F3E8FF'],
  ['#C62828','#FFEBEE'],['#F57F17','#FFF8E1'],['#2E7D32','#E8F5E9'],
];
const avatarColor = (name: string): [string, string] => {
  const s = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[s % AVATAR_COLORS.length] as [string, string];
};
const getInitials = (name: string) =>
  name ? name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() : '?';

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const [fg, bg] = avatarColor(name);
  return (
    <div
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
    >
      {getInitials(name)}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { bg: string; color: string; label: string }> = {
  ACTIVE:            { bg: '#E8F8F2', color: '#0F6E56', label: 'Hoạt động' },
  APPROVED:          { bg: '#E8F8F2', color: '#0F6E56', label: 'Đã duyệt' },
  ELIGIBLE:          { bg: '#E8F8F2', color: '#0F6E56', label: 'Đủ điều kiện' },
  ONGOING:           { bg: '#E3F2FD', color: '#1565C0', label: 'Đang diễn ra' },
  SCHEDULED:         { bg: '#FFF8E1', color: '#854F0B', label: 'Sắp diễn ra' },
  PENDING:           { bg: '#FFF8E1', color: '#854F0B', label: 'Chờ duyệt' },
  REGISTRATION_OPEN: { bg: '#E8F8F2', color: '#0F6E56', label: 'Mở đăng ký' },
  FINISHED:          { bg: '#F1F3F5', color: '#4B5563', label: 'Kết thúc' },
  SUSPENDED:         { bg: '#FFEBEE', color: '#C62828', label: 'Treo giò' },
  WITHDRAWN:         { bg: '#F1F3F5', color: '#4B5563', label: 'Đã rút lui' },
  REJECTED:          { bg: '#FFEBEE', color: '#C62828', label: 'Từ chối' },
  REMOVED:           { bg: '#FFEBEE', color: '#C62828', label: 'Đã xóa' },
  LEFT:              { bg: '#F1F3F5', color: '#4B5563', label: 'Đã rời' },
  FIT:               { bg: '#E8F8F2', color: '#0F6E56', label: 'Khỏe mạnh' },
  INJURED:           { bg: '#FFEBEE', color: '#C62828', label: 'Chấn thương' },
  DRAFT:             { bg: '#F1F3F5', color: '#4B5563', label: 'Nháp' },
};

export function Badge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? { bg: '#F1F3F5', color: '#4B5563', label: status };
  return (
    <span
      style={{ background: cfg.bg, color: cfg.color }}
      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
    >
      {cfg.label}
    </span>
  );
}

// ── Pill ─────────────────────────────────────────────────────────
export function Pill({ label, color = '#6B7280', bg = '#F1F3F5' }: { label: string; color?: string; bg?: string }) {
  return (
    <span style={{ background: bg, color }} className="text-[11px] font-semibold px-2 py-0.5 rounded-md">
      {label}
    </span>
  );
}

// ── Select ───────────────────────────────────────────────────────
export function Select({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-gray-50 box-border font-[inherit] focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}