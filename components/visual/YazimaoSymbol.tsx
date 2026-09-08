/**
 * YAZIMAO Symbol Logo —— Feather + Network（羽毛 × 网络）
 *
 * 品牌隐喻：一根鸭毛很轻；一个人的创造也很小；但无数人的创造被连接、验证
 * 并汇聚后，可以形成一个属于所有人的公共网络。
 *
 * 视觉语言：
 * - 一根斜向的羽管/羽毛（远看即羽毛，具有高辨识度）。
 * - 羽轴上的节点与末梢小圆点 = 分布式网络的暗示（近看是网络）。
 * - 禁止出现卡通鸭/鸭头/鸭嘴/Meme 元素。鸭毛是隐喻，不是吉祥物。
 *
 * 设计要点：
 * - 采用填充式羽毛轮廓，黑/白/深/浅背景均可识别；渐变只是增强。
 * - 24/48/64/128/256/512 下清晰；小尺寸由羽身 + 羽轴主导。
 * - 几何基于 24 单位空间绘制后 scale(2) 铺满 48 viewBox，各尺寸一致。
 */
export function YazimaoSymbol({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="yazimao-symbol-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="55%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#E879F9" />
        </linearGradient>
      </defs>

      <g transform="translate(1 1) scale(2)">
        {/* 羽身（斜向羽管轮廓，填充 + 描边） */}
        <path
          d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
          fill="url(#yazimao-symbol-grad)"
          stroke="url(#yazimao-symbol-grad)"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        {/* 羽轴（rachis / calamus） */}
        <line
          x1="16"
          y1="8"
          x2="2.4"
          y2="21.6"
          stroke="url(#yazimao-symbol-grad)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* 网络节点（羽管端点 + 羽身附近三个“开放网络”点） */}
        <circle cx="2.4" cy="21.6" r="1.5" fill="url(#yazimao-symbol-grad)" />
        <circle cx="21.6" cy="16.8" r="1.05" fill="url(#yazimao-symbol-grad)" />
        <circle cx="19.4" cy="5.6" r="0.9" fill="url(#yazimao-symbol-grad)" />
        <circle cx="10.6" cy="4.2" r="0.75" fill="url(#yazimao-symbol-grad)" />
      </g>
    </svg>
  );
}
