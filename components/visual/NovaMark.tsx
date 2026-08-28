// Logo：Nova 星形标识（内联 SVG，避免额外请求）
export function NovaMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nova-mark-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="55%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#E879F9" />
        </linearGradient>
      </defs>
      {/* 外圈轨道 */}
      <circle cx="24" cy="24" r="21" stroke="url(#nova-mark-grad)" strokeWidth="1.4" opacity="0.5" />
      <circle cx="24" cy="24" r="14.5" stroke="url(#nova-mark-grad)" strokeWidth="1" opacity="0.35" />
      {/* 核心星 */}
      <path
        d="M24 7l3.4 10.6L38 21l-10.6 3.4L24 35l-3.4-10.6L10 21l10.6-3.4L24 7z"
        fill="url(#nova-mark-grad)"
      />
      {/* 卫星点 */}
      <circle cx="39" cy="13" r="2" fill="#67E8F9" />
      <circle cx="8" cy="34" r="1.6" fill="#E879F9" />
    </svg>
  );
}
